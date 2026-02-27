import { fateChart, chanceLabel } from '../../../doc/gme'
import { checkRandomEvent, generateRandomEvent } from '../../../helper/randomEvent'

const ODDS_TO_INDEX = {
  certain: 0,
  'nearly-certain': 1,
  'very-likely': 2,
  likely: 3,
  'fifty-fifty': 4,
  unlikely: 5,
  'very-unlikely': 6,
  'nearly-impossible': 7,
  impossible: 8,
}

export default function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Only GET allowed' })
  }

  const oddsParam = Array.isArray(req.query.odds) ? req.query.odds[0] : req.query.odds
  const oddsKey = (oddsParam || '').toLowerCase()
  const oddIndex = ODDS_TO_INDEX[oddsKey]

  if (oddIndex === undefined) {
    return res.status(404).json({
      error: 'Odds not found',
      odds: oddsParam || null,
      instruction: 'Use /api/odds/<odds> com um valor válido.',
      availableOdds: Object.keys(ODDS_TO_INDEX),
    })
  }

  const roll = Math.floor(Math.random() * 100) + 1
  const chanceName = chanceLabel[oddIndex]
  const results = {}
  let hasRETriggered = false

  for (let cfIndex = 0; cfIndex < 9; cfIndex++) {
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

    const hasRE = checkRandomEvent(roll, cfIndex + 1)
    if (hasRE) hasRETriggered = true

    results[`CF${cfIndex + 1}`] = {
      fate: result,
      RE: hasRE,
    }
  }

  const randomEvent = hasRETriggered ? generateRandomEvent() : null

  res.status(200).json({
    chance: chanceName,
    roll,
    results,
    randomEvent,
  })
}
