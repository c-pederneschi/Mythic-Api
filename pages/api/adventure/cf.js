import { prisma } from '../../../lib/prisma'

function resolveProfileKey(req) {
  const queryProfile = req.query?.profile
  const headerProfile = req.headers['x-profile-key']

  const value =
    (Array.isArray(queryProfile) ? queryProfile[0] : queryProfile) ||
    (Array.isArray(headerProfile) ? headerProfile[0] : headerProfile) ||
    'anonymous'

  return String(value).trim() || 'anonymous'
}

export default async function handler(req, res) {
  if (req.method !== 'GET' && req.method !== 'POST') {
    return res.status(405).json({ error: 'Only GET/POST allowed' })
  }

  const profileKey = resolveProfileKey(req)

  try {
    if (req.method === 'GET') {
      const state = await prisma.adventureState.upsert({
        where: { profileKey },
        update: {},
        create: {
          profileKey,
          chaosFactor: 5,
        },
      })

      return res.status(200).json({
        table: 'adventure/cf',
        profileKey,
        chaosFactor: state.chaosFactor,
        result: `CF atual: ${state.chaosFactor}`,
      })
    }

    const rawValue = req.body?.chaosFactor
    const parsed = Number(rawValue)

    if (!Number.isInteger(parsed) || parsed < 1 || parsed > 9) {
      return res.status(400).json({
        error: 'chaosFactor must be an integer between 1 and 9',
      })
    }

    const state = await prisma.adventureState.upsert({
      where: { profileKey },
      update: { chaosFactor: parsed },
      create: {
        profileKey,
        chaosFactor: parsed,
      },
    })

    return res.status(200).json({
      table: 'adventure/cf',
      profileKey,
      chaosFactor: state.chaosFactor,
      result: `CF atualizado para ${state.chaosFactor}`,
    })
  } catch (error) {
    console.error('Error handling adventure CF:', error)
    return res.status(500).json({ error: 'Failed to handle adventure CF' })
  }
}
