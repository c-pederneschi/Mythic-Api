import { prisma } from '../../../lib/prisma'

const TOOL_USE_SYSTEM_PROMPT = `Você é um assistente-oráculo para RPG solo usando Mythic. Responda sempre em português.
Objetivo: conduzir a aventura no estilo do Big Example (cenas, perguntas de destino, interpretação e próximos ganchos), sem controlar o personagem do jogador.
Regra de agência: NUNCA decida ações, falas ou pensamentos do personagem do jogador. Sempre descreva contexto/consequências e termine com uma pergunta direta para o jogador decidir a próxima ação.
Fluxo esperado por turno:
1) Entenda a intenção do jogador e o estado atual da cena.
2) Se houver incerteza relevante, use ferramenta (Fate/Chaos/Tables) antes de narrar.
3) Interprete o resultado de forma curta e coerente com o contexto.
4) Avance a cena um passo e devolva o controle ao jogador com pergunta objetiva.
Ferramentas disponíveis (endpoints sem /api): odds/certain, odds/nearly-certain, odds/very-likely, odds/likely, odds/fifty-fifty, odds/unlikely, odds/very-unlikely, odds/nearly-impossible, odds/impossible, chaos/cf1 até chaos/cf9 e tabelas individuais via /api/tables/[table] (ex.: tables/adventure-tone, tables/names, tables/powers, tables/locations, tables/character-appearance).
Ferramentas de estado da aventura (Chaos Factor persistente):
- adventure/cf (consulta CF atual)
- adventure/cf/cf1 até adventure/cf/cf9 (atualiza CF)
Ferramenta especial de controle de sessão: chat/reset (apaga todas as mensagens do chat).
Se o jogador pedir para "começar do zero", "apagar progresso", "resetar chat" ou equivalente, use a ferramenta chat/reset antes de responder.
Se precisar de ferramentas, responda SOMENTE em JSON válido. Formatos aceitos:
1) {"tool_use":[{"endpoint":"odds/fifty-fifty"}]}
2) {"tool_use":[{"endpoint":"odds/fifty-fifty"},{"endpoint":"tables/adventure-tone"}]}
3) {"tool_use":{"endpoint":"chaos/cf5"}}
4) {"tool_use":["odds/likely","tables/names"]}
5) {"tool_use":[{"endpoint":"chat/reset"}]}
6) {"tool_use":[{"endpoint":"adventure/cf"}]}
7) {"tool_use":[{"endpoint":"adventure/cf/cf4"}]}
Também aceitamos a chave "toolUse" (camelCase) com os mesmos formatos.
Use apenas endpoints listados/documentados em /api e nunca invente rotas.
Quando não precisar de ferramenta, responda em 3-6 frases curtas e finalize com uma pergunta para o jogador.`

function getMythicApiBaseUrl(req) {
  const configured = (process.env.MYTHIC_API_BASE_URL || '').trim()

  if (configured) {
    return configured.replace(/\/+$/, '')
  }

  const forwardedHost = req.headers['x-forwarded-host']
  const host = forwardedHost || req.headers.host
  const proto = req.headers['x-forwarded-proto'] || 'https'

  if (host) {
    return `${proto}://${host}/api`
  }

  return 'https://mythic.api.vercel.app/api'
}

function getJsonCandidates(text) {
  if (!text || typeof text !== 'string') return []

  const candidates = [text.trim()]
  const codeBlockMatch = text.match(/```json\s*([\s\S]*?)```/i)

  if (codeBlockMatch?.[1]) {
    candidates.push(codeBlockMatch[1].trim())
  }

  const firstBrace = text.indexOf('{')
  const lastBrace = text.lastIndexOf('}')

  if (firstBrace !== -1 && lastBrace !== -1 && lastBrace > firstBrace) {
    candidates.push(text.slice(firstBrace, lastBrace + 1).trim())
  }

  return [...new Set(candidates.filter(Boolean))]
}

function normalizeEndpoints(toolUseValue) {
  if (!toolUseValue) return []

  const rawList = Array.isArray(toolUseValue) ? toolUseValue : [toolUseValue]

  return rawList
    .map((item) => {
      if (typeof item === 'string') return item
      if (item && typeof item === 'object' && typeof item.endpoint === 'string') return item.endpoint
      return null
    })
    .filter(Boolean)
    .map((endpoint) => endpoint.replace(/^\/+/, '').replace(/^api\//, ''))
}

function extractToolQueue(assistantText) {
  const candidates = getJsonCandidates(assistantText)

  for (const candidate of candidates) {
    try {
      const parsed = JSON.parse(candidate)
      const toolUseValue = parsed?.tool_use ?? parsed?.toolUse
      const endpoints = normalizeEndpoints(toolUseValue)

      if (endpoints.length > 0) {
        return endpoints
      }
    } catch {
      continue
    }
  }

  return []
}

function mergeUsage(base, extra) {
  return {
    promptTokens: (base.promptTokens || 0) + (extra.promptTokens || 0),
    completionTokens: (base.completionTokens || 0) + (extra.completionTokens || 0),
    totalTokens: (base.totalTokens || 0) + (extra.totalTokens || 0),
    thoughtsTokens:
      (base.thoughtsTokens ?? 0) + (extra.thoughtsTokens ?? 0) > 0
        ? (base.thoughtsTokens ?? 0) + (extra.thoughtsTokens ?? 0)
        : null,
  }
}

function ensurePlayerPrompt(text) {
  const normalized = (text || '').trim()

  if (!normalized) {
    return 'Não consegui avançar a cena agora. O que seu personagem faz em seguida?'
  }

  if (/\?\s*$/.test(normalized)) {
    return normalized
  }

  return `${normalized}\n\nO que seu personagem faz agora?`
}

function parseRetryAfterSeconds(errorPayload) {
  try {
    const details = errorPayload?.error?.details
    if (!Array.isArray(details)) return null

    const retryInfo = details.find((item) => item?.['@type']?.includes('RetryInfo'))
    const retryDelay = retryInfo?.retryDelay

    if (typeof retryDelay !== 'string') return null

    const match = retryDelay.match(/([0-9]+(?:\.[0-9]+)?)s/)
    if (!match) return null

    const seconds = Math.ceil(Number(match[1]))
    return Number.isFinite(seconds) && seconds > 0 ? seconds : null
  } catch {
    return null
  }
}

async function callGemini({ apiKey, prompt, forceTextAnswer = false }) {
  const systemText = forceTextAnswer
    ? 'Você é um assistente-oráculo de Mythic. Use os resultados das ferramentas para interpretar a cena em português, sem controlar o personagem do jogador. Escreva 3-6 frases curtas e finalize com uma pergunta objetiva para o jogador decidir a ação.'
    : TOOL_USE_SYSTEM_PROMPT

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
          parts: [{ text: systemText }],
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
    let parsedError = null

    try {
      parsedError = JSON.parse(errText)
    } catch {
      parsedError = null
    }

    const error = new Error(`Gemini API error: ${geminiResponse.status} - ${errText}`)
    error.statusCode = geminiResponse.status
    error.retryAfterSeconds = parseRetryAfterSeconds(parsedError)
    error.providerPayload = parsedError
    throw error
  }

  const geminiData = await geminiResponse.json()
  const content =
    geminiData?.candidates?.[0]?.content?.parts?.[0]?.text ||
    'Não foi possível gerar resposta no momento.'
  const usageMetadata = geminiData?.usageMetadata || {}

  return {
    content,
    modelVersion: geminiData?.modelVersion || 'unknown',
    responseId: geminiData?.responseId || null,
    usage: {
      promptTokens: usageMetadata.promptTokenCount ?? 0,
      completionTokens: usageMetadata.candidatesTokenCount ?? 0,
      totalTokens: usageMetadata.totalTokenCount ?? 0,
      thoughtsTokens: usageMetadata.thoughtsTokenCount ?? null,
    },
  }
}

function extractToolResult(payload, endpoint) {
  if (payload && typeof payload === 'object') {
    if (typeof payload.chaosFactor === 'number') return `CF ${payload.chaosFactor}`
    if (typeof payload.word === 'string') return payload.word
    if (typeof payload.result === 'string') return payload.result
    if (typeof payload.fate === 'string') return payload.fate
  }

  return JSON.stringify(payload)
}

async function runToolQueue(req, endpoints) {
  const baseUrl = getMythicApiBaseUrl(req)
  const results = []
  let resetTriggered = false

  for (const endpoint of endpoints) {
    const cleanEndpoint = endpoint.replace(/^\/+/, '')
    const url = `${baseUrl}/${cleanEndpoint}`

    try {
      const response = await fetch(url)
      const data = await response.json().catch(() => ({}))

      if (!response.ok) {
        results.push({
          table: cleanEndpoint,
          result: `Erro ${response.status}: ${data?.error || 'Falha ao consultar endpoint'}`,
        })
        continue
      }

      if (cleanEndpoint === 'chat/reset' && data?.reset === true) {
        resetTriggered = true
      }

      results.push({
        table: data?.table || cleanEndpoint,
        result: extractToolResult(data, cleanEndpoint),
      })
    } catch (error) {
      results.push({
        table: cleanEndpoint,
        result: `Erro de rede: ${error.message}`,
      })
    }
  }

  return {
    results,
    resetTriggered,
  }
}

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

    // 2. Buscar histórico para contexto
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

    const firstRun = await callGemini({ apiKey, prompt })
    let assistantContent = firstRun.content
    let modelVersion = firstRun.modelVersion
    let mergedUsage = firstRun.usage
    let toolResults = []
    let resetTriggered = false
    const usageEntries = [
      {
        model: firstRun.modelVersion,
        responseId: firstRun.responseId,
        promptTokens: firstRun.usage.promptTokens,
        completionTokens: firstRun.usage.completionTokens,
        totalTokens: firstRun.usage.totalTokens,
        thoughtsTokens: firstRun.usage.thoughtsTokens,
      },
    ]

    const toolQueue = extractToolQueue(assistantContent)

    if (toolQueue.length > 0) {
      const toolExecution = await runToolQueue(req, toolQueue)
      toolResults = toolExecution.results
      resetTriggered = toolExecution.resetTriggered

      const secondPrompt = `${historyText}\nUsuário: ${message}\nResultados das ferramentas: ${JSON.stringify(
        toolResults
      )}\nAgora responda ao usuário usando os resultados acima.\nAssistente:`

      const secondRun = await callGemini({
        apiKey,
        prompt: secondPrompt,
        forceTextAnswer: true,
      })

      assistantContent = secondRun.content
      modelVersion = secondRun.modelVersion
      mergedUsage = mergeUsage(mergedUsage, secondRun.usage)
      usageEntries.push({
        model: secondRun.modelVersion,
        responseId: secondRun.responseId,
        promptTokens: secondRun.usage.promptTokens,
        completionTokens: secondRun.usage.completionTokens,
        totalTokens: secondRun.usage.totalTokens,
        thoughtsTokens: secondRun.usage.thoughtsTokens,
      })
    }

    assistantContent = ensurePlayerPrompt(assistantContent)

    if (process.env.NODE_ENV !== 'production') {
      console.log('Gemini API usage:', {
        model: modelVersion,
        promptTokens: mergedUsage.promptTokens,
        completionTokens: mergedUsage.completionTokens,
        totalTokens: mergedUsage.totalTokens,
      })
      if (toolResults.length > 0) {
        console.log('Tool queue executed:', toolResults)
      }
    }

    let assistantMsg

    if (resetTriggered) {
      assistantMsg = {
        id: null,
        author: 'assistant',
        content: assistantContent,
        createdAt: new Date().toISOString(),
      }
    } else {
      // 5. Salvar resposta da IA
      assistantMsg = await prisma.message.create({
        data: {
          author: 'assistant',
          content: assistantContent,
        },
      })
    }

    // 6. Registrar uso de tokens (uma linha por chamada ao Gemini)
    await prisma.tokenUsage.createMany({
      data: usageEntries,
    })

    // 7. Retornar ambas as mensagens
    res.status(200).json({
      userMessage: userMsg,
      assistantMessage: assistantMsg,
      toolResults,
      resetTriggered,
    })
  } catch (error) {
    console.error('Error:', error)

    if (error.statusCode === 429) {
      return res.status(429).json({
        error: 'Rate limit exceeded',
        details:
          error.retryAfterSeconds && error.retryAfterSeconds > 0
            ? `Limite temporário da IA atingido. Tente novamente em ${error.retryAfterSeconds}s.`
            : 'Limite temporário da IA atingido. Tente novamente em alguns instantes.',
        retryAfterSeconds: error.retryAfterSeconds || null,
      })
    }

    res.status(500).json({ 
      error: 'Failed to get response from Gemini',
      details: error.message 
    })
  }
}
