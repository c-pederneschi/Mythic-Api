import { prisma } from '../../../../lib/prisma'

function resolveProfileKey(req) {
  const queryProfile = req.query?.profile
  const headerProfile = req.headers['x-profile-key']

  const value =
    (Array.isArray(queryProfile) ? queryProfile[0] : queryProfile) ||
    (Array.isArray(headerProfile) ? headerProfile[0] : headerProfile) ||
    'anonymous'

  return String(value).trim() || 'anonymous'
}

function parseChaosLevel(value) {
  const raw = String(value || '').toLowerCase().trim()

  if (/^cf[1-9]$/.test(raw)) {
    return Number(raw.replace('cf', ''))
  }

  if (/^[1-9]$/.test(raw)) {
    return Number(raw)
  }

  return null
}

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Only GET allowed' })
  }

  const profileKey = resolveProfileKey(req)
  const cflvlParam = Array.isArray(req.query.cflvl) ? req.query.cflvl[0] : req.query.cflvl
  const chaosFactor = parseChaosLevel(cflvlParam)

  if (!chaosFactor) {
    return res.status(400).json({
      error: 'Invalid chaos factor. Use cf1..cf9 or 1..9.',
      cflvl: cflvlParam || null,
    })
  }

  try {
    const state = await prisma.adventureState.upsert({
      where: { profileKey },
      update: { chaosFactor },
      create: {
        profileKey,
        chaosFactor,
      },
    })

    return res.status(200).json({
      table: 'adventure/cf/set',
      profileKey,
      chaosFactor: state.chaosFactor,
      result: `CF atualizado para ${state.chaosFactor}`,
    })
  } catch (error) {
    console.error('Error updating adventure CF:', error)
    return res.status(500).json({ error: 'Failed to update adventure CF' })
  }
}
