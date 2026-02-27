import { fateChart, chanceLabel } from '../../../doc/gme'
import { checkRandomEvent, generateRandomEvent } from '../../../helper/randomEvent'

function parseChaosLevel(value) {
  const raw = (value || '').toLowerCase()

  if (/^cf[1-9]$/.test(raw)) {
    return Number(raw.replace('cf', ''))
  }

  if (/^[1-9]$/.test(raw)) {
    return Number(raw)
  }

  return null
}

export default function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Only GET allowed' })
  }

  const cflvlParam = Array.isArray(req.query.cflvl) ? req.query.cflvl[0] : req.query.cflvl
  const chaosLevel = parseChaosLevel(cflvlParam)

  if (!chaosLevel) {
    return res.status(404).json({
      error: 'Chaos level not found',
      cflvl: cflvlParam || null,
      instruction: 'Use /api/chaos/<cflvl> com cf1 até cf9 (ou 1..9).',
      availableChaos: ['cf1', 'cf2', 'cf3', 'cf4', 'cf5', 'cf6', 'cf7', 'cf8', 'cf9'],
    })
  }

  const cfIndex = chaosLevel - 1
  const roll = Math.floor(Math.random() * 100) + 1
  const results = {}

  for (let oddIndex = 0; oddIndex < 9; oddIndex++) {
    const [exYes, yes, exNo] = fateChart[oddIndex][cfIndex]

    let result
    if (exYes !== null && roll <= exYes) {
      result = 'EXCEPTIONAL YES'
    } else if (roll <= yes) {
      result = 'YES'
    } else if (exNo !== null && roll <= exNo) {
      result = 'NO'
    } else {
      result = 'EXCEPTIONAL NO'
    }

    results[chanceLabel[oddIndex]] = {
      fate: result,
    }
  }

  const hasRE = checkRandomEvent(roll, chaosLevel)
  const randomEvent = hasRE ? generateRandomEvent() : null

  res.status(200).json({
    chaosLevel,
    roll,
    RE: hasRE,
    results,
    randomEvent,
  })
}
