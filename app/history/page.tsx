'use client'

import { useUser } from '@clerk/nextjs'
import { useRouter } from 'next/navigation'
import { useLanguage } from '@/contexts/LanguageContext'
import { useState, useEffect } from 'react'
import { Generation } from '@/lib/supabase'
import NavBar from '@/components/NavBar'
import Image from 'next/image'

export default function HistoryPage() {
  const { user, isLoaded } = useUser()
  const router = useRouter()
  const { t } = useLanguage()
  const [generations, setGenerations] = useState<Generation[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [viewingGeneration, setViewingGeneration] = useState<Generation | null>(null)
  const [showClearConfirm, setShowClearConfirm] = useState(false)
  const [clearing, setClearing] = useState(false)
  const [imageErrors, setImageErrors] = useState<Set<string>>(new Set())

  useEffect(() => {
    if (isLoaded && user) {
      fetchGenerations()
    }
  }, [isLoaded, user])

  const fetchGenerations = async (retryCount = 0) => {
    try {
      setLoading(true)
      setError('')

      // 添加超时控制（10秒）
      const controller = new AbortController()
      const timeoutId = setTimeout(() => controller.abort(), 10000)

      const response = await fetch('/api/generations', {
        signal: controller.signal,
      })

      clearTimeout(timeoutId)

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`)
      }

      const data = await response.json()
      setGenerations(data)
    } catch (err) {
      console.error('Error fetching generations:', err)

      // 如果是超时或网络错误，尝试重试（最多2次）
      if (retryCount < 2 && (
        err instanceof Error && (
          err.name === 'AbortError' ||
          err.message.includes('Failed to fetch') ||
          err.message.includes('NetworkError')
        )
      )) {
        console.log(`Retrying... (${retryCount + 1}/2)`)
        setTimeout(() => fetchGenerations(retryCount + 1), 1000 * (retryCount + 1))
        return
      }

      // 提供更友好的错误信息
      let errorMessage = t('history.loadError') || '加载失败'
      if (err instanceof Error) {
        if (err.name === 'AbortError') {
          errorMessage = t('history.loadTimeout') || '加载超时，请刷新重试'
        } else if (err.message.includes('401')) {
          errorMessage = t('history.loadUnauthorized') || '未授权，请重新登录'
        } else if (err.message.includes('500')) {
          errorMessage = t('history.loadServerError') || '服务器错误，请稍后重试'
        }
      }
      setError(errorMessage)
    } finally {
      setLoading(false)
    }
  }

  // 处理图片加载失败
  const handleImageError = (url: string) => {
    setImageErrors(prev => new Set(prev).add(url))
  }

  // 查看图片功能
  const handleView = (generation: Generation) => {
    setViewingGeneration(generation)
  }

  // 下载高清图片功能
  const handleDownload = async (generation: Generation) => {
    if (!generation.hd_urls || generation.hd_urls.length === 0) {
      alert(t('history.noHdImages') || '没有高清图片可下载')
      return
    }

    try {
      // 下载所有高清图片
      for (let i = 0; i < generation.hd_urls.length; i++) {
        const url = generation.hd_urls[i]
        const response = await fetch(url)
        const blob = await response.blob()
        const blobUrl = window.URL.createObjectURL(blob)

        const link = document.createElement('a')
        link.href = blobUrl
        link.download = `${generation.breed}-${generation.style}-${i + 1}.png`
        document.body.appendChild(link)
        link.click()
        document.body.removeChild(link)

        window.URL.revokeObjectURL(blobUrl)

        // 添加延迟避免浏览器阻止多次下载
        if (i < generation.hd_urls.length - 1) {
          await new Promise(resolve => setTimeout(resolve, 500))
        }
      }
    } catch (error) {
      console.error('Download error:', error)
      alert(t('history.downloadError') || '下载失败，请重试')
    }
  }

  // 清除所有历史记录
  const handleClearHistory = async () => {
    try {
      setClearing(true)

      // 添加超时控制（10秒）
      const controller = new AbortController()
      const timeoutId = setTimeout(() => controller.abort(), 10000)

      const response = await fetch('/api/generations', {
        method: 'DELETE',
        signal: controller.signal,
      })

      clearTimeout(timeoutId)

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}))
        throw new Error(errorData.error || `HTTP ${response.status}`)
      }

      // 清除成功，刷新列表
      setGenerations([])
      setShowClearConfirm(false)
      alert(t('history.clearSuccess') || '历史记录已清除')
    } catch (error) {
      console.error('Clear history error:', error)

      // 提供更详细的错误信息
      let errorMessage = t('history.clearError') || '清除失败，请重试'

      if (error instanceof Error) {
        if (error.name === 'AbortError') {
          errorMessage = t('history.clearTimeout') || '请求超时，请检查网络连接后重试'
        } else if (error.message.includes('401')) {
          errorMessage = t('history.clearUnauthorized') || '未授权，请重新登录'
        } else if (error.message.includes('500')) {
          errorMessage = t('history.clearServerError') || '服务器错误，请稍后重试'
        } else if (error.message.includes('NetworkError') || error.message.includes('Failed to fetch')) {
          errorMessage = t('history.clearNetworkError') || '网络错误，请检查网络连接'
        }
      }

      alert(errorMessage)
    } finally {
      setClearing(false)
    }
  }

  if (!isLoaded || loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">{t('common.loading')}</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <NavBar />

      <main className="container mx-auto px-4 sm:px-6 lg:px-8 pt-24 pb-16">
        {/* 页面标题 */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            {t('history.title')}
          </h1>
          <p className="text-lg text-gray-600">
            {t('history.subtitle')}
          </p>
        </div>

        {/* 用户信息卡片 */}
        <div className="max-w-6xl mx-auto mb-8">
          <div className="bg-gradient-to-r from-purple-50 to-pink-50 rounded-2xl p-6 border border-purple-100">
            <div className="flex items-center justify-between flex-wrap gap-4">
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 bg-purple-600 rounded-full flex items-center justify-center text-white text-2xl font-bold">
                  {user?.firstName?.[0] || user?.emailAddresses[0].emailAddress[0].toUpperCase()}
                </div>
                <div>
                  <h2 className="text-xl font-semibold text-gray-900">
                    {user?.firstName || user?.emailAddresses[0].emailAddress.split('@')[0]}
                  </h2>
                  <p className="text-gray-600">{user?.emailAddresses[0].emailAddress}</p>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <div className="text-right">
                  <p className="text-3xl font-bold text-purple-600">{generations.length}</p>
                  <p className="text-sm text-gray-600">{t('history.totalGenerations')}</p>
                </div>
                {generations.length > 0 && (
                  <button
                    onClick={() => setShowClearConfirm(true)}
                    className="px-4 py-2 bg-red-500 text-white text-sm font-semibold rounded-lg hover:bg-red-600 transition-all shadow-md hover:shadow-lg"
                  >
                    🗑️ {t('history.clearAll') || '清除历史'}
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* 生成记录列表 */}
        <div className="max-w-6xl mx-auto">
          {error && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-8">
              <p className="text-red-800">{error}</p>
            </div>
          )}

          {generations.length === 0 ? (
            // 空状态
            <div className="bg-white rounded-2xl shadow-xl p-8 md:p-12 text-center border-2 border-dashed border-gray-300">
              <div className="w-24 h-24 mx-auto mb-6 bg-gradient-to-br from-purple-100 to-pink-100 rounded-full flex items-center justify-center">
                <svg className="w-12 h-12 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                </svg>
              </div>
              <h3 className="text-2xl md:text-3xl font-bold text-gray-900 mb-4">
                {t('history.empty.title')}
              </h3>
              <p className="text-gray-600 text-lg mb-8">
                {t('history.empty.description')}
              </p>
              <button
                onClick={() => router.push('/')}
                className="inline-flex items-center px-8 py-4 bg-gradient-to-r from-purple-600 to-pink-600 text-white font-semibold rounded-xl hover:from-purple-700 hover:to-pink-700 transition-all shadow-lg hover:shadow-xl"
              >
                {t('history.empty.cta')}
              </button>
            </div>
          ) : (
            // 生成记录网格
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {generations.map((generation) => (
                <div
                  key={generation.id}
                  className="bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all overflow-hidden group"
                >
                  {/* 图片预览 */}
                  <div className="relative aspect-square bg-gray-100">
                    {generation.preview_urls[0] && !imageErrors.has(generation.preview_urls[0]) ? (
                      <Image
                        src={generation.preview_urls[0]}
                        alt={`${generation.breed} - ${generation.style}`}
                        fill
                        className="object-cover"
                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                        onError={() => handleImageError(generation.preview_urls[0])}
                      />
                    ) : (
                      <div className="absolute inset-0 flex items-center justify-center bg-gray-200">
                        <div className="text-center text-gray-500">
                          <svg className="w-16 h-16 mx-auto mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                          </svg>
                          <p className="text-sm">{t('history.imageExpired') || '图片已过期'}</p>
                        </div>
                      </div>
                    )}
                    {generation.paid && (
                      <div className="absolute top-3 right-3 px-3 py-1 bg-green-500 text-white text-xs font-semibold rounded-full">
                        ✓ {t('history.paid')}
                      </div>
                    )}
                  </div>

                  {/* 信息区域 */}
                  <div className="p-4">
                    <h3 className="font-semibold text-lg text-gray-900 mb-2">
                      {generation.breed}
                    </h3>
                    <div className="flex items-center justify-between text-sm text-gray-600 mb-3">
                      <span>{generation.style}</span>
                      <span>{new Date(generation.created_at).toLocaleDateString()}</span>
                    </div>
                    <div className="flex items-center justify-between text-xs text-gray-500">
                      <span>{generation.preview_urls.length} {t('history.images')}</span>
                      {generation.paid && generation.hd_urls && (
                        <span className="text-green-600">
                          {generation.hd_urls.length} {t('history.hdImages')}
                        </span>
                      )}
                    </div>
                  </div>

                  {/* 操作按钮 */}
                  <div className="p-4 pt-0 flex gap-2">
                    <button
                      onClick={() => handleView(generation)}
                      className="flex-1 px-4 py-2 text-sm bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-all"
                    >
                      {t('history.view')}
                    </button>
                    {generation.paid && (
                      <button
                        onClick={() => handleDownload(generation)}
                        className="flex-1 px-4 py-2 text-sm bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-all"
                      >
                        {t('history.download')}
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </main>

      {/* 查看图片模态框 */}
      {viewingGeneration && (
        <div
          className="fixed inset-0 bg-black bg-opacity-75 z-50 flex items-center justify-center p-4"
          onClick={() => setViewingGeneration(null)}
        >
          <div
            className="bg-white rounded-2xl max-w-6xl w-full max-h-[90vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            {/* 模态框头部 */}
            <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between rounded-t-2xl">
              <div>
                <h2 className="text-2xl font-bold text-gray-900">
                  {viewingGeneration.breed}
                </h2>
                <p className="text-sm text-gray-600">
                  {viewingGeneration.style} • {new Date(viewingGeneration.created_at).toLocaleDateString()}
                </p>
              </div>
              <button
                onClick={() => setViewingGeneration(null)}
                className="text-gray-500 hover:text-gray-700 text-3xl leading-none"
              >
                ×
              </button>
            </div>

            {/* 图片网格 */}
            <div className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {(viewingGeneration.paid && viewingGeneration.hd_urls
                  ? viewingGeneration.hd_urls
                  : viewingGeneration.preview_urls
                ).map((url, index) => (
                  <div key={index} className="relative aspect-square bg-gray-100 rounded-lg overflow-hidden">
                    {!imageErrors.has(url) ? (
                      <Image
                        src={url}
                        alt={`${viewingGeneration.breed} ${index + 1}`}
                        fill
                        className="object-contain"
                        unoptimized
                        onError={() => handleImageError(url)}
                      />
                    ) : (
                      <div className="absolute inset-0 flex items-center justify-center bg-gray-200">
                        <div className="text-center text-gray-500">
                          <svg className="w-20 h-20 mx-auto mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                          </svg>
                          <p className="text-sm">{t('history.imageExpired') || '图片已过期'}</p>
                        </div>
                      </div>
                    )}
                    {!viewingGeneration.paid && !imageErrors.has(url) && (
                      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                        <div className="text-gray-400 text-opacity-60 text-4xl font-bold transform -rotate-12 select-none">
                          PREVIEW
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>

              {/* 底部操作按钮 */}
              <div className="mt-6 flex gap-4">
                {viewingGeneration.paid && viewingGeneration.hd_urls && (
                  <button
                    onClick={() => handleDownload(viewingGeneration)}
                    className="flex-1 bg-purple-600 text-white px-6 py-3 rounded-lg hover:bg-purple-700 transition-all font-semibold"
                  >
                    📥 {t('history.downloadAll') || '下载全部高清图'}
                  </button>
                )}
                <button
                  onClick={() => setViewingGeneration(null)}
                  className="flex-1 bg-gray-100 text-gray-700 px-6 py-3 rounded-lg hover:bg-gray-200 transition-all font-semibold"
                >
                  {t('common.close') || '关闭'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 清除历史记录确认对话框 */}
      {showClearConfirm && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4"
          onClick={() => !clearing && setShowClearConfirm(false)}
        >
          <div
            className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            {/* 警告图标 */}
            <div className="w-16 h-16 mx-auto mb-4 bg-red-100 rounded-full flex items-center justify-center">
              <svg className="w-8 h-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
            </div>

            {/* 标题 */}
            <h3 className="text-2xl font-bold text-gray-900 text-center mb-2">
              {t('history.clearConfirm.title') || '确认清除历史记录？'}
            </h3>

            {/* 描述 */}
            <p className="text-gray-600 text-center mb-6">
              {t('history.clearConfirm.description') || '此操作将删除所有历史记录，且无法恢复。'}
            </p>

            {/* 提示信息 */}
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-6">
              <p className="text-sm text-yellow-800">
                {t('history.clearConfirm.warning') || `⚠️ 即将删除 ${generations.length} 条记录`}
              </p>
            </div>

            {/* 操作按钮 */}
            <div className="flex gap-3">
              <button
                onClick={() => setShowClearConfirm(false)}
                disabled={clearing}
                className="flex-1 px-4 py-3 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-all font-semibold disabled:opacity-50"
              >
                {t('common.cancel') || '取消'}
              </button>
              <button
                onClick={handleClearHistory}
                disabled={clearing}
                className="flex-1 px-4 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-all font-semibold disabled:opacity-50"
              >
                {clearing ? (t('history.clearing') || '清除中...') : (t('history.confirmClear') || '确认清除')}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
