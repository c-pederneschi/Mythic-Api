import * as gme from '../../../doc/gme'

const EXCLUDED_EXPORTS = new Set([
  'fateChart',
  'chanceLabel',
  'randomEventFocusTable',
  'mythicMeaningTables',
])

function toSlug(name) {
  return name.toLowerCase().replace(/_/g, '-')
}

function isSingleWordTable(value) {
  if (!Array.isArray(value) || value.length < 2) return false

  const firstValue = value[1]
  if (typeof firstValue !== 'string') return false

  return true
}

const tableRegistry = Object.entries(gme).reduce((acc, [exportName, tableData]) => {
  if (EXCLUDED_EXPORTS.has(exportName)) return acc
  if (!isSingleWordTable(tableData)) return acc

  const slug = toSlug(exportName)

  acc[slug] = {
    exportName,
    data: tableData,
  }

  return acc
}, {})

export default function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Only GET allowed' })
  }

  const tableParam = Array.isArray(req.query.table) ? req.query.table[0] : req.query.table
  const tableKey = (tableParam || '').toLowerCase()
  const tableEntry = tableRegistry[tableKey]

  if (!tableEntry) {
    const availableTables = Object.keys(tableRegistry).sort()

    return res.status(404).json({
      error: 'Table not found',
      table: tableParam || null,
      instruction:
        'Use um dos nomes disponíveis em /api/tables/<table>. Exemplo: /api/tables/adventure-tone',
      availableTables,
    })
  }

  const roll = Math.floor(Math.random() * 100) + 1
  const word = tableEntry.data[roll] ?? null

  if (!word) {
    return res.status(500).json({
      error: 'Invalid table index for generated roll',
      table: tableKey,
      roll,
    })
  }

  res.status(200).json({
    table: tableKey,
    source: tableEntry.exportName,
    roll,
    word,
  })
}
