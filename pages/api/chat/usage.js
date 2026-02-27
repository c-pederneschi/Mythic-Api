import { prisma } from '../../../lib/prisma'

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Only GET allowed' })
  }

  try {
    const dailyLimitStr = process.env.GEMINI_DAILY_TOKEN_LIMIT
    const parsedDailyLimit = dailyLimitStr ? parseInt(dailyLimitStr, 10) : NaN
    const dailyLimit = !Number.isNaN(parsedDailyLimit) && parsedDailyLimit > 0 ? parsedDailyLimit : null

    const startOfDay = new Date()
    startOfDay.setUTCHours(0, 0, 0, 0)

    const [aggregate, totalCalls, dailyCalls, dailyAggregate, lastUsages] = await Promise.all([
      prisma.tokenUsage.aggregate({
        _sum: {
          promptTokens: true,
          completionTokens: true,
          totalTokens: true,
          thoughtsTokens: true,
        },
      }),
      prisma.tokenUsage.count(),
      prisma.tokenUsage.count({
        where: {
          createdAt: {
            gte: startOfDay,
          },
        },
      }),
      prisma.tokenUsage.aggregate({
        where: {
          createdAt: {
            gte: startOfDay,
          },
        },
        _sum: {
          totalTokens: true,
        },
      }),
      prisma.tokenUsage.findMany({
        orderBy: { createdAt: 'desc' },
        take: 20,
      }),
    ])

    const usedToday = dailyAggregate._sum.totalTokens || 0
    const percentUsedRaw = dailyLimit ? (usedToday / dailyLimit) * 100 : 0

    res.status(200).json({
      totals: {
        calls: totalCalls,
        promptTokens: aggregate._sum.promptTokens || 0,
        completionTokens: aggregate._sum.completionTokens || 0,
        totalTokens: aggregate._sum.totalTokens || 0,
        thoughtsTokens: aggregate._sum.thoughtsTokens || 0,
      },
      daily: {
        usedTokens: usedToday,
        usedRequestsToday: dailyCalls,
        limit: dailyLimit,
        percentUsed: Number(percentUsedRaw.toFixed(2)),
      },
      lastUsages,
    })
  } catch (error) {
    console.error('Error fetching token usage:', error)
    res.status(500).json({ error: 'Failed to fetch token usage' })
  }
}
