'use client'

import { useSearchParams, useRouter } from 'next/navigation'
import { useState, useEffect, Suspense } from 'react'
import Image from 'next/image'

function SuccessContent() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const sessionId = searchParams.get('session_id')

  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [images, setImages] = useState<string[]>([])
  const [amount, setAmount] = useState(0)

  useEffect(() => {
    if (!sessionId) {
      setError('无效的支付会话')
      setLoading(false)
      return
    }

    const verifyPayment = async () => {
      try {
        const response = await fetch('/api/verify-payment', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ session_id: sessionId }),
        })

        const data = await response.json()

        if (!response.ok) {
          throw new Error(data.error || '验证支付失败')
        }

        if (data.success && data.paid) {
          setImages(data.images)
          setAmount(data.amount)
        } else {
          throw new Error('支付未完成')
        }
      } catch (err) {
        console.error('验证错误:', err)
        setError(err instanceof Error ? err.message : '验证支付失败')
      } finally {
        setLoading(false)
      }
    }

    verifyPayment()
  }, [sessionId])

  const handleDownload = async (imageUrl: string, index: number) => {
    try {
      // 下载图片
      const response = await fetch(imageUrl)
      const blob = await response.blob()
      const url = window.URL.createObjectURL(blob)

      // 创建下载链接
      const a = document.createElement('a')
      a.href = url
      a.download = `pet-avatar-${index + 1}.png`
      document.body.appendChild(a)
      a.click()
      document.body.removeChild(a)
      window.URL.revokeObjectURL(url)
    } catch (err) {
      console.error('下载失败:', err)
      alert('下载失败，请右键点击图片另存为')
    }
  }

  const handleDownloadAll = async () => {
    for (let i = 0; i < images.length; i++) {
      await handleDownload(images[i], i)
      // 添加延迟避免浏览器阻止多个下载
      await new Promise(resolve => setTimeout(resolve, 500))
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-blue-50 flex items-center justify-center">
        <div className="bg-white rounded-2xl shadow-xl p-16 text-center">
          <div className="inline-block animate-spin rounded-full h-16 w-16 border-4 border-purple-200 border-t-purple-600 mb-4"></div>
          <p className="text-xl font-semibold text-gray-700">验证支付中...</p>
          <p className="text-gray-500 mt-2">请稍候</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-blue-50 flex items-center justify-center">
        <div className="bg-white rounded-2xl shadow-xl p-8 max-w-md">
          <div className="text-center">
            <div className="text-5xl mb-4">⚠️</div>
            <h1 className="text-2xl font-bold text-gray-900 mb-4">验证失败</h1>
            <p className="text-gray-600 mb-6">{error}</p>
            <button
              onClick={() => router.push('/')}
              className="bg-purple-600 text-white px-6 py-3 rounded-lg hover:bg-purple-700 transition-all"
            >
              返回首页
            </button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-blue-50">
      <main className="container mx-auto px-4 py-16 max-w-4xl">
        {/* 成功提示 */}
        <div className="text-center mb-8">
          <div className="text-6xl mb-4">🎉</div>
          <h1 className="text-4xl font-bold text-gray-900 mb-2">支付成功！</h1>
          <p className="text-lg text-gray-600">
            感谢您的购买！已支付 ${amount.toFixed(2)}
          </p>
        </div>

        {/* 调试信息（已注释） */}
        {/* <div className="bg-yellow-100 border border-yellow-400 rounded-lg p-4 mb-6">
          <p className="text-sm font-mono">
            <strong>调试信息：</strong><br/>
            图片数量: {images.length}<br/>
            第一张 URL: {images[0]?.substring(0, 50)}...
          </p>
        </div> */}

        {/* 高清图片展示 */}
        <div className="bg-white rounded-2xl shadow-xl p-6 mb-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-2xl font-semibold text-gray-900">
              ✨ 您的高清原图（4 张）
            </h2>
            <button
              onClick={handleDownloadAll}
              className="bg-gradient-to-r from-purple-600 to-pink-600 text-white px-6 py-2 rounded-lg hover:from-purple-700 hover:to-pink-700 transition-all text-sm font-semibold"
            >
              📥 下载全部
            </button>
          </div>

          <div className="grid grid-cols-2 gap-4 mb-4">
            {images.map((img, index) => (
              <div key={index}>
                <div className="relative aspect-square rounded-lg overflow-hidden border-2 border-gray-200">
                  {img && (
                    <Image
                      src={img}
                      alt={`高清图 ${index + 1}`}
                      fill
                      className="object-cover"
                      unoptimized
                    />
                  )}
                </div>
                {/* 下载按钮 */}
                <button
                  onClick={() => handleDownload(img, index)}
                  className="w-full mt-2 bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 transition-all text-sm"
                >
                  下载图 {index + 1}
                </button>
              </div>
            ))}
          </div>

          <div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
            <p className="text-sm text-purple-900">
              💡 <strong>提示：</strong>这些图片为 1024x1024 高分辨率，无水印，可用于商业用途。
              您可以随时重新访问此页面下载（请保存此页面链接）。
            </p>
          </div>
        </div>

        {/* 操作按钮 */}
        <div className="flex gap-4 justify-center">
          <button
            onClick={() => router.push('/')}
            className="bg-white text-purple-600 border-2 border-purple-600 px-8 py-3 rounded-lg hover:bg-purple-50 transition-all font-semibold"
          >
            🏠 返回首页
          </button>
          <button
            onClick={() => router.push('/')}
            className="bg-gradient-to-r from-purple-600 to-pink-600 text-white px-8 py-3 rounded-lg hover:from-purple-700 hover:to-pink-700 transition-all font-semibold"
          >
            ✨ 生成更多头像
          </button>
        </div>
      </main>
    </div>
  )
}

export default function SuccessPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-blue-50 flex items-center justify-center">
        <div className="bg-white rounded-2xl shadow-xl p-16 text-center">
          <div className="inline-block animate-spin rounded-full h-16 w-16 border-4 border-purple-200 border-t-purple-600 mb-4"></div>
          <p className="text-xl font-semibold text-gray-700">加载中...</p>
        </div>
      </div>
    }>
      <SuccessContent />
    </Suspense>
  )
}
