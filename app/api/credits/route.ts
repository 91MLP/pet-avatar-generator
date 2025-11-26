import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@clerk/nextjs/server'
import { getUserCredits, getUserTransactions, CreditTransaction } from '@/lib/credits'

// GET /api/credits - 获取用户积分余额和交易历史
export async function GET(request: NextRequest) {
  try {
    // 验证用户身份
    const authResult = await auth()
    const userId = authResult.userId

    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // 获取积分余额
    const credits = await getUserCredits(userId)

    // 获取交易历史（可选，通过查询参数控制）
    const url = new URL(request.url)
    const includeTransactions = url.searchParams.get('transactions') === 'true'

    let transactions: CreditTransaction[] = []
    if (includeTransactions) {
      transactions = await getUserTransactions(userId)
    }

    return NextResponse.json({
      credits,
      transactions: includeTransactions ? transactions : undefined,
    })
  } catch (error) {
    console.error('Error fetching credits:', error)
    return NextResponse.json(
      { error: 'Failed to fetch credits' },
      { status: 500 }
    )
  }
}
