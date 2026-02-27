import { prisma } from '../../../lib/prisma'

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Only POST allowed' })
  }

  const { message } = req.body

  if (!message || !message.trim()) {
    return res.status(400).json({ error: 'Message cannot be empty' })
  }

  try {
    // 0. Verificar limite diário de tokens (bloqueio preventivo)
    const dailyLimitStr = process.env.GEMINI_DAILY_TOKEN_LIMIT

    if (dailyLimitStr) {
      const dailyLimit = parseInt(dailyLimitStr, 10)

      if (!Number.isNaN(dailyLimit) && dailyLimit > 0) {
        const startOfDay = new Date()
        startOfDay.setUTCHours(0, 0, 0, 0)

        const agg = await prisma.tokenUsage.aggregate({
          where: {
            createdAt: {
              gte: startOfDay,
            },
          },
          _sum: {
            totalTokens: true,
          },
        })

        const usedToday = agg._sum.totalTokens || 0
        const percentUsed = usedToday / dailyLimit

        if (percentUsed >= 0.76) {
          return res.status(429).json({
            error: 'Token limit nearly reached',
            details: `Uso diário de tokens em ${Math.round(percentUsed * 100)}% do limite configurado.`,
          })
        }
      }
    }

    // 1. Salvar mensagem do usuário
    const userMsg = await prisma.message.create({
      data: {
        author: 'user',
        content: message,
      },
    })

    // 2. Buscar histórico para contexto (apenas últimas 6 mensagens para reduzir tokens)
    const recentHistoryDesc = await prisma.message.findMany({
      orderBy: { createdAt: 'desc' },
      take: 100,
    })
    const recentHistory = recentHistoryDesc.reverse()

    // 3. Montar prompt simples para Gemini usando o histórico recente
    const historyText = recentHistory
      .map((m) => `${m.author === 'user' ? 'Usuário' : 'Assistente'}: ${m.content}`)
      .join('\n')

    const prompt = `${historyText}\nAssistente:`

    // 4. Chamar Gemini via REST com o mínimo de tokens possível
    const apiKey = process.env.GEMINI_API_KEY

    if (!apiKey) {
      throw new Error('GEMINI_API_KEY is not set')
    }

    const geminiResponse = await fetch(
      'https://generativelanguage.googleapis.com/v1beta/models/gemini-flash-latest:generateContent?key=' + apiKey,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          contents: [
            {
              role: 'user',
              parts: [{ text: prompt }],
            },
          ],
          systemInstruction: {
            parts: [
              {
                text:
                  'Você é um assistente para RPG solo usando Mythic. Responda sempre em português, em no máximo duas frases completas e claras.',
              },
            ],
          },
          generationConfig: {
            maxOutputTokens: 512,
            temperature: 0.7,
          },
        }),
      }
    )

    if (!geminiResponse.ok) {
      const errText = await geminiResponse.text()
      throw new Error(`Gemini API error: ${geminiResponse.status} - ${errText}`)
    }

    const geminiData = await geminiResponse.json()

    if (process.env.NODE_ENV !== 'production') {
      const usage = geminiData?.usageMetadata || {}
      console.log('Gemini API usage:', {
        model: geminiData?.modelVersion || 'unknown',
        promptTokens: usage.promptTokenCount ?? 0,
        completionTokens: usage.candidatesTokenCount ?? 0,
        totalTokens: usage.totalTokenCount ?? 0,
      })
    }

    const assistantContent =
      geminiData?.candidates?.[0]?.content?.parts?.[0]?.text ||
      'Não foi possível gerar resposta no momento.'

    // 5. Salvar resposta da IA
    const assistantMsg = await prisma.message.create({
      data: {
        author: 'assistant',
        content: assistantContent,
      },
    })

    // 6. Registrar uso de tokens
    const usage = geminiData?.usageMetadata || {}

    await prisma.tokenUsage.create({
      data: {
        model: geminiData?.modelVersion || 'unknown',
        responseId: geminiData?.responseId || null,
        promptTokens: usage.promptTokenCount ?? 0,
        completionTokens: usage.candidatesTokenCount ?? 0,
        totalTokens: usage.totalTokenCount ?? 0,
        thoughtsTokens: usage.thoughtsTokenCount ?? null,
      },
    })

    // 7. Retornar ambas as mensagens
    res.status(200).json({
      userMessage: userMsg,
      assistantMessage: assistantMsg,
    })
  } catch (error) {
    console.error('Error:', error)
    res.status(500).json({ 
      error: 'Failed to get response from Gemini',
      details: error.message 
    })
  }
}
