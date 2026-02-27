import { prisma } from '../../../lib/prisma'

export default async function handler(req, res) {
  if (req.method !== 'GET' && req.method !== 'POST') {
    return res.status(405).json({ error: 'Only GET/POST allowed' })
  }

  try {
    const deleted = await prisma.message.deleteMany({})

    res.status(200).json({
      table: 'chat/reset',
      reset: true,
      deletedMessages: deleted.count || 0,
      result: `Chat reiniciado. ${deleted.count || 0} mensagens apagadas.`,
    })
  } catch (error) {
    console.error('Error resetting chat messages:', error)
    res.status(500).json({ error: 'Failed to reset chat messages' })
  }
}
