'use client'

import { useUser } from '@clerk/nextjs'
import { useState } from 'react'

export default function TestDBPage() {
  const { user, isLoaded } = useUser()
  const [testResult, setTestResult] = useState<any>(null)
  const [loading, setLoading] = useState(false)

  const testDatabaseConnection = async () => {
    setLoading(true)
    try {
      // 测试创建记录
      const createResponse = await fetch('/api/generations', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          breed: '测试品种',
          style: 'cute',
          preview_urls: ['https://example.com/test1.jpg', 'https://example.com/test2.jpg'],
          user_email: user?.emailAddresses[0].emailAddress,
          paid: false,
        }),
      })

      const createData = await createResponse.json()
      console.log('Create response:', createData)

      // 测试获取记录
      const getResponse = await fetch('/api/generations')
      const getData = await getResponse.json()
      console.log('Get response:', getData)

      setTestResult({
        createStatus: createResponse.ok ? '✅ 成功' : '❌ 失败',
        createData,
        getStatus: getResponse.ok ? '✅ 成功' : '❌ 失败',
        getData,
        userId: user?.id,
      })
    } catch (error) {
      console.error('Test error:', error)
      setTestResult({
        error: error instanceof Error ? error.message : '未知错误',
      })
    } finally {
      setLoading(false)
    }
  }

  if (!isLoaded) {
    return <div className="p-8">加载中...</div>
  }

  if (!user) {
    return <div className="p-8">请先登录</div>
  }

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-4">数据库连接测试</h1>

        <div className="bg-white rounded-lg shadow p-6 mb-6">
          <h2 className="text-xl font-semibold mb-4">用户信息</h2>
          <div className="space-y-2 text-sm">
            <p><strong>User ID (Clerk):</strong> {user.id}</p>
            <p><strong>Email:</strong> {user.emailAddresses[0].emailAddress}</p>
            <p><strong>Name:</strong> {user.firstName} {user.lastName}</p>
          </div>
        </div>

        <button
          onClick={testDatabaseConnection}
          disabled={loading}
          className="bg-purple-600 text-white px-6 py-3 rounded-lg hover:bg-purple-700 disabled:opacity-50 mb-6"
        >
          {loading ? '测试中...' : '运行数据库测试'}
        </button>

        {testResult && (
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-xl font-semibold mb-4">测试结果</h2>
            <pre className="bg-gray-100 p-4 rounded overflow-auto text-xs">
              {JSON.stringify(testResult, null, 2)}
            </pre>
          </div>
        )}
      </div>
    </div>
  )
}
