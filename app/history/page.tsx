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

  useEffect(() => {
    if (isLoaded && user) {
      fetchGenerations()
    }
  }, [isLoaded, user])

  const fetchGenerations = async () => {
    try {
      setLoading(true)
      const response = await fetch('/api/generations')

      if (!response.ok) {
        throw new Error('Failed to fetch generations')
      }

      const data = await response.json()
      setGenerations(data)
    } catch (err) {
      console.error('Error fetching generations:', err)
      setError('Failed to load history')
    } finally {
      setLoading(false)
    }
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
            <div className="flex items-center justify-between">
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
              <div className="text-right">
                <p className="text-3xl font-bold text-purple-600">{generations.length}</p>
                <p className="text-sm text-gray-600">{t('history.totalGenerations')}</p>
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
                    {generation.preview_urls[0] && (
                      <Image
                        src={generation.preview_urls[0]}
                        alt={`${generation.breed} - ${generation.style}`}
                        fill
                        className="object-cover"
                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                      />
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
                    <Image
                      src={url}
                      alt={`${viewingGeneration.breed} ${index + 1}`}
                      fill
                      className="object-contain"
                      unoptimized
                    />
                    {!viewingGeneration.paid && (
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
    </div>
  )
}
