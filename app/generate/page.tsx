'use client'

import { useSearchParams, useRouter } from 'next/navigation'
import { useState, useEffect, Suspense } from 'react'
import Image from 'next/image'
import { useLanguage } from '@/contexts/LanguageContext'
import LanguageSwitcher from '@/components/LanguageSwitcher'
import Link from 'next/link'
import { SignInButton } from '@clerk/nextjs'

// 模块级别的 Set，用于跟踪正在进行的生成请求
// 即使组件卸载重新挂载（React Strict Mode），这个 Set 也会保持
const ongoingGenerations = new Set<string>()

function GenerateContent() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const { t } = useLanguage()
  const breed = searchParams.get('breed') || '未知品种'
  const style = searchParams.get('style') || 'cute'

  const [isGenerating, setIsGenerating] = useState(true)
  const [images, setImages] = useState<string[]>([])
  const [error, setError] = useState<string | null>(null)
  const [errorCode, setErrorCode] = useState<string | null>(null)
  const [progress, setProgress] = useState(0)
  const [creditsUsed, setCreditsUsed] = useState<number | null>(null)
  const [remainingCredits, setRemainingCredits] = useState<number | null>(null)
  const [currentStep, setCurrentStep] = useState<string>('')
  const [generatedCount, setGeneratedCount] = useState(0)
  const [showSuccess, setShowSuccess] = useState(false)
  const [imageErrors, setImageErrors] = useState<Set<string>>(new Set())

  // 临时开关：true = Mock 数据，false = 真实 API
  const USE_MOCK_DATA = false

  // 风格积分映射
  const styleCredits: Record<string, number> = {
    cute: 1,
    chibi: 2,
    kawaii: 3,
  }

  // 生成图片
  useEffect(() => {
    // 如果没有品种参数，返回首页
    if (!searchParams.get('breed')) {
      router.push('/')
      return
    }

    // 生成唯一的 key 标识这次生成请求
    const generationKey = `${breed}-${style}`
    const storageKey = `generating-${generationKey}`

    // 检查 localStorage 和 Set，防止重复生成（双重检查机制）
    if (ongoingGenerations.has(generationKey) || localStorage.getItem(storageKey)) {
      console.log('Skipping duplicate generation due to React Strict Mode:', generationKey)
      return
    }

    // 标记这个组合正在生成（使用 Set 和 localStorage 双重标记）
    ongoingGenerations.add(generationKey)
    localStorage.setItem(storageKey, 'true')

    const generateImages = async () => {
      try {
        setIsGenerating(true)
        setError(null)
        setErrorCode(null)
        setProgress(0)

        if (USE_MOCK_DATA) {
          // Mock 模式：模拟进度
          for (let i = 0; i <= 100; i += 25) {
            setProgress(i)
            await new Promise(resolve => setTimeout(resolve, 500))
          }
          const mockImages = [
            'https://placehold.co/1024x1024/a78bfa/white?text=Pet+Avatar+1',
            'https://placehold.co/1024x1024/ec4899/white?text=Pet+Avatar+2',
            'https://placehold.co/1024x1024/8b5cf6/white?text=Pet+Avatar+3',
            'https://placehold.co/1024x1024/f472b6/white?text=Pet+Avatar+4',
          ]
          setImages(mockImages)
          setProgress(100)
          setCreditsUsed(styleCredits[style] || 1)
          setRemainingCredits(3)
        } else {
          // 真实 API 模式 - 模拟分阶段进度
          const totalImages = 4

          // 阶段 1: 准备生成
          setCurrentStep(t('generate.step.preparing') || '准备生成...')
          setProgress(5)
          await new Promise(resolve => setTimeout(resolve, 500))

          // 阶段 2: 开始请求
          setCurrentStep(t('generate.step.requesting') || '正在连接 AI...')
          setProgress(10)

          // 启动 API 请求
          const apiPromise = fetch('/api/generate', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              breed: breed,
              style: style,
            }),
          })

          // 阶段 3-6: 模拟生成每张图片的进度
          for (let i = 1; i <= totalImages; i++) {
            setCurrentStep(t('generate.step.generating')?.replace('{current}', i.toString()).replace('{total}', totalImages.toString()) || `正在生成第 ${i}/${totalImages} 张...`)
            setGeneratedCount(i - 1)

            // 每张图片模拟进度增长
            const baseProgress = 10 + ((i - 1) * 20)
            for (let p = 0; p < 20; p += 4) {
              setProgress(baseProgress + p)
              await new Promise(resolve => setTimeout(resolve, 300))
            }
          }

          // 阶段 7: 等待 API 响应
          setCurrentStep(t('generate.step.finalizing') || '正在完成...')
          setProgress(90)

          const response = await apiPromise
          const data = await response.json()

          // 处理错误
          if (!response.ok) {
            setErrorCode(data.code || 'UNKNOWN_ERROR')
            throw new Error(data.error || '生成失败')
          }

          if (data.success && data.images) {
            setProgress(100)
            setCurrentStep(t('generate.step.complete') || '生成完成！')
            setGeneratedCount(totalImages)
            setImages(data.images)
            setCreditsUsed(data.creditsUsed || styleCredits[style] || 1)
            setRemainingCredits(data.remainingCredits)

            // 显示成功动画
            await new Promise(resolve => setTimeout(resolve, 500))
            setShowSuccess(true)
          } else {
            throw new Error('生成失败，请重试')
          }
        }
      } catch (err) {
        console.error('生成错误:', err)
        setError(err instanceof Error ? err.message : '生成失败，请重试')
      } finally {
        setIsGenerating(false)
        // 生成完成后，清除标记，允许后续重新生成
        ongoingGenerations.delete(generationKey)
        localStorage.removeItem(storageKey)
      }
    }

    generateImages()
  }, [searchParams, router, breed, style])

  const handleRetry = () => {
    window.location.reload()
  }

  const handleGenerateMore = () => {
    router.push('/')
  }

  const handleDownload = async (imageUrl: string, index: number) => {
    try {
      const response = await fetch(imageUrl)
      const blob = await response.blob()
      const url = window.URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = `${breed}-${style}-${index + 1}.png`
      document.body.appendChild(a)
      a.click()
      window.URL.revokeObjectURL(url)
      document.body.removeChild(a)
    } catch (error) {
      console.error('下载失败:', error)
      alert('下载失败，请重试')
    }
  }

  const handleImageError = (url: string) => {
    setImageErrors(prev => new Set(prev).add(url))
  }

  const styleNames: Record<string, string> = {
    cute: t('home.style.cute'),
    chibi: t('home.style.chibi'),
    kawaii: t('home.style.kawaii'),
  }

  return (
    <>
      <style jsx global>{`
        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes gradient-x {
          0%, 100% {
            background-position: 0% 50%;
          }
          50% {
            background-position: 100% 50%;
          }
        }

        .animate-gradient-x {
          background-size: 200% 200%;
          animation: gradient-x 3s ease infinite;
        }
      `}</style>
      <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-blue-50">
        <LanguageSwitcher />
        <main className="container mx-auto px-4 py-16 max-w-5xl">
        {/* 标题 */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">
            {breed} · {styleNames[style]}
          </h1>
          <p className="text-gray-600">{t('generate.title')}</p>
        </div>

        {/* 生成中状态 */}
        {isGenerating && !error && (
          <div className="bg-white rounded-2xl shadow-xl p-8 md:p-16">
            {/* 动画图标 */}
            <div className="text-center mb-6">
              <div className="inline-flex items-center justify-center w-24 h-24 mb-4">
                <div className="relative">
                  <div className="text-6xl animate-bounce">
                    🎨
                  </div>
                </div>
              </div>
              <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2">
                {t('generate.generating') || '正在生成...'}
              </h2>
              {currentStep && (
                <p className="text-purple-600 font-semibold text-lg animate-pulse">
                  {currentStep}
                </p>
              )}
            </div>

            {/* 图片生成状态指示器 */}
            <div className="flex items-center justify-center gap-3 mb-8">
              {[1, 2, 3, 4].map((num) => (
                <div
                  key={num}
                  className={`relative w-16 h-16 rounded-lg border-2 transition-all duration-500 ${
                    num <= generatedCount
                      ? 'border-green-500 bg-green-50'
                      : num === generatedCount + 1
                      ? 'border-purple-500 bg-purple-50 animate-pulse'
                      : 'border-gray-300 bg-gray-50'
                  }`}
                >
                  <div className="absolute inset-0 flex items-center justify-center">
                    {num <= generatedCount ? (
                      <span className="text-2xl">✓</span>
                    ) : num === generatedCount + 1 ? (
                      <div className="animate-spin rounded-full h-6 w-6 border-2 border-purple-500 border-t-transparent"></div>
                    ) : (
                      <span className="text-gray-400 text-sm font-semibold">{num}</span>
                    )}
                  </div>
                </div>
              ))}
            </div>

            {/* 进度条 */}
            <div className="max-w-md mx-auto mb-6">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-semibold text-gray-700">
                  {t('generate.progress') || '生成进度'}
                </span>
                <span className="text-sm font-bold text-purple-600">
                  {progress}%
                </span>
              </div>
              <div className="relative w-full bg-gray-200 rounded-full h-4 overflow-hidden shadow-inner">
                <div
                  className="absolute inset-y-0 left-0 bg-gradient-to-r from-purple-600 via-pink-500 to-purple-600 rounded-full transition-all duration-500 ease-out animate-gradient-x"
                  style={{ width: `${progress}%` }}
                >
                  <div className="absolute inset-0 bg-white opacity-20 animate-pulse"></div>
                </div>
              </div>
            </div>

            {/* 提示信息 */}
            <div className="space-y-4">
              {/* 积分提示 */}
              <div className="flex items-center justify-center gap-2 px-4 py-3 bg-purple-50 rounded-lg border border-purple-200">
                <span className="text-2xl">💎</span>
                <span className="text-sm text-gray-700">
                  {t('generate.cost') || '将消耗'} <strong className="text-purple-600">{styleCredits[style] || 1}</strong> {t('generate.credit') || '积分'}
                </span>
              </div>

              {/* 温馨提示 */}
              <div className="text-center text-sm text-gray-500">
                <p>💡 {t('generate.tip') || 'AI 正在为你创作独特的作品，请稍候...'}</p>
              </div>
            </div>
          </div>
        )}

        {/* 错误状态 */}
        {error && !isGenerating && (
          <div className="bg-white rounded-2xl shadow-xl p-12 text-center max-w-2xl mx-auto">
            <div className="text-6xl mb-4">
              {errorCode === 'UNAUTHORIZED' ? '🔒' : errorCode === 'INSUFFICIENT_CREDITS' ? '💎' : '😢'}
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-3">
              {errorCode === 'UNAUTHORIZED'
                ? t('generate.error.unauthorized') || '需要登录'
                : errorCode === 'INSUFFICIENT_CREDITS'
                ? t('generate.insufficientCredits') || '积分不足'
                : t('generate.error.title') || '生成失败'}
            </h2>
            <p className="text-gray-600 mb-6">{error}</p>

            {errorCode === 'UNAUTHORIZED' && (
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
                <p className="text-sm text-blue-900">
                  💡 {t('generate.error.loginTip') || '请先登录后再生成图片'}
                </p>
              </div>
            )}

            {errorCode === 'INSUFFICIENT_CREDITS' && (
              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-6">
                <p className="text-sm text-yellow-900">
                  💡 {t('generate.error.creditsTip') || '你需要更多积分来生成这个风格的图片'}
                </p>
              </div>
            )}

            {!errorCode && (
              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-6">
                <p className="text-sm text-yellow-900">
                  💡 {t('generate.error.tips') || '可能的原因：网络问题、AI 服务暂时不可用、或者品种输入不正确'}
                </p>
              </div>
            )}

            <div className="flex gap-4 justify-center flex-wrap">
              {errorCode === 'UNAUTHORIZED' && (
                <SignInButton mode="modal">
                  <button className="bg-gradient-to-r from-purple-600 to-pink-600 text-white px-8 py-3 rounded-lg hover:from-purple-700 hover:to-pink-700 transition-all font-semibold shadow-lg">
                    🔑 {t('auth.signIn') || '登录'}
                  </button>
                </SignInButton>
              )}
              {errorCode === 'INSUFFICIENT_CREDITS' && (
                <Link
                  href="/credits"
                  className="bg-gradient-to-r from-purple-600 to-pink-600 text-white px-8 py-3 rounded-lg hover:from-purple-700 hover:to-pink-700 transition-all font-semibold shadow-lg"
                >
                  💎 {t('credits.buyNow') || '购买积分'}
                </Link>
              )}
              {!errorCode && (
                <button
                  onClick={handleRetry}
                  className="bg-gradient-to-r from-purple-600 to-pink-600 text-white px-8 py-3 rounded-lg hover:from-purple-700 hover:to-pink-700 transition-all font-semibold shadow-lg"
                >
                  🔄 {t('generate.error.retry') || '重试'}
                </button>
              )}
              <button
                onClick={handleGenerateMore}
                className="bg-white text-purple-600 border-2 border-purple-600 px-8 py-3 rounded-lg hover:bg-purple-50 transition-all font-semibold"
              >
                ← {t('generate.error.back') || '返回首页'}
              </button>
            </div>
          </div>
        )}

        {/* 生成结果 - 直接显示 HD 图片 */}
        {!isGenerating && images.length > 0 && (
          <div className="space-y-8">
            {/* 成功提示卡片 - 带动画 */}
            <div className={`bg-gradient-to-r from-green-500 to-emerald-500 rounded-2xl shadow-xl p-6 text-white text-center transition-all duration-700 ${
              showSuccess ? 'opacity-100 transform scale-100' : 'opacity-0 transform scale-95'
            }`}>
              <div className="text-5xl mb-3 animate-bounce">🎉</div>
              <h2 className="text-2xl md:text-3xl font-bold mb-2">
                {t('generate.success.title') || '生成成功！'}
              </h2>
              <p className="text-green-100 mb-4">
                {t('generate.success.desc') || '你的宠物 Q 版头像已生成，所有图片均为 1024x1024 高清无水印'}
              </p>
              <div className="flex items-center justify-center gap-6 text-sm">
                <div className="flex items-center gap-2">
                  <span className="text-2xl">💎</span>
                  <span>
                    {t('generate.creditsUsed') || '已使用'}: <strong>{creditsUsed || styleCredits[style] || 1}</strong> {t('generate.credit') || '积分'}
                  </span>
                </div>
                {remainingCredits !== null && (
                  <div className="flex items-center gap-2">
                    <span className="text-2xl">💰</span>
                    <span>
                      {t('generate.creditsRemaining') || '剩余'}: <strong>{remainingCredits}</strong> {t('generate.credit') || '积分'}
                    </span>
                  </div>
                )}
              </div>
            </div>

            {/* 高清图片网格 */}
            <div className="bg-white rounded-2xl shadow-xl p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-semibold text-gray-900">
                  {t('generate.hdImages') || '高清图片'} · 1024x1024
                </h2>
                <span className="text-sm text-purple-600 font-semibold bg-purple-50 px-3 py-1 rounded-full">
                  {images.length} {t('generate.images') || '张'}
                </span>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {images.map((img, index) => (
                  <div
                    key={index}
                    className="relative group animate-fadeIn"
                    style={{
                      animationDelay: `${index * 150}ms`,
                      opacity: 0,
                      animation: `fadeInUp 0.6s ease-out ${index * 150}ms forwards`
                    }}
                  >
                    <div className="relative aspect-square rounded-lg overflow-hidden border-2 border-gray-200 bg-gray-100 shadow-md hover:shadow-xl transition-all duration-300 hover:scale-105 hover:border-purple-400">
                      {img && !imageErrors.has(img) ? (
                        <Image
                          src={img}
                          alt={`${breed} ${styleNames[style]} ${index + 1}`}
                          fill
                          className="object-contain"
                          unoptimized
                          onError={() => handleImageError(img)}
                        />
                      ) : img && imageErrors.has(img) ? (
                        <div className="absolute inset-0 flex items-center justify-center bg-gray-200">
                          <div className="text-center text-gray-500">
                            <svg className="w-20 h-20 mx-auto mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                            </svg>
                            <p className="text-sm">{t('history.imageExpired') || '图片已过期'}</p>
                          </div>
                        </div>
                      ) : null}
                      {/* 高清标识 */}
                      <div className="absolute top-3 right-3 bg-purple-600 text-white text-xs px-2 py-1 rounded font-semibold shadow-lg">
                        HD 1024×1024
                      </div>
                      {/* 序号标识 */}
                      <div className="absolute top-3 left-3 bg-white bg-opacity-90 text-purple-600 text-xs font-bold w-6 h-6 rounded-full flex items-center justify-center shadow-lg">
                        {index + 1}
                      </div>
                    </div>
                    {/* 下载按钮 */}
                    <button
                      onClick={() => handleDownload(img, index)}
                      className="mt-3 w-full bg-gradient-to-r from-purple-600 to-pink-600 text-white py-3 px-4 rounded-lg hover:from-purple-700 hover:to-pink-700 transition-all font-semibold shadow-md hover:shadow-lg flex items-center justify-center gap-2"
                    >
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                      </svg>
                      {t('generate.download') || '下载图片'} #{index + 1}
                    </button>
                  </div>
                ))}
              </div>

              {/* 使用说明 */}
              <div className="mt-6 bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg p-4 border border-blue-200">
                <div className="flex items-start gap-3">
                  <span className="text-2xl flex-shrink-0">ℹ️</span>
                  <div className="flex-1 text-sm text-gray-700">
                    <p className="font-semibold mb-1">
                      {t('generate.usage.title') || '使用说明'}
                    </p>
                    <ul className="space-y-1 text-gray-600">
                      <li>✓ {t('generate.usage.commercial') || '所有图片可商用，无需署名'}</li>
                      <li>✓ {t('generate.usage.noWatermark') || '高清无水印，1024x1024 分辨率'}</li>
                      <li>✓ {t('generate.usage.download') || '支持永久下载，可用于头像、打印、周边'}</li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>

            {/* 操作按钮 */}
            <div className="flex gap-4 justify-center flex-wrap">
              <button
                onClick={handleGenerateMore}
                className="bg-gradient-to-r from-purple-600 to-pink-600 text-white px-8 py-3 rounded-lg hover:from-purple-700 hover:to-pink-700 transition-all font-semibold shadow-lg"
              >
                ✨ {t('generate.generateMore') || '生成更多头像'}
              </button>
              <Link
                href="/history"
                className="bg-white text-purple-600 border-2 border-purple-600 px-8 py-3 rounded-lg hover:bg-purple-50 transition-all font-semibold"
              >
                📚 {t('generate.viewHistory') || '查看历史记录'}
              </Link>
            </div>
          </div>
        )}
      </main>
    </div>
    </>
  )
}

function LoadingFallback() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-blue-50">
      <main className="container mx-auto px-4 py-16 max-w-4xl">
        <div className="bg-white rounded-2xl shadow-xl p-16 text-center">
          <div className="inline-block animate-spin rounded-full h-16 w-16 border-4 border-purple-200 border-t-purple-600 mb-4"></div>
          <p className="text-xl font-semibold text-gray-700">Loading...</p>
        </div>
      </main>
    </div>
  )
}

export default function GeneratePage() {
  return (
    <Suspense fallback={<LoadingFallback />}>
      <GenerateContent />
    </Suspense>
  )
}
