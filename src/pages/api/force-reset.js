import { Server } from 'socket.io'
import { io } from 'socket.io-client'

export default function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' })
  }

  try {
    // Connetti al socket API interno per invocare il force reset
    const clientSocket = io('http://localhost:3004/api/socket', {
      transports: ['polling']
    })

    clientSocket.on('connect', () => {
      console.log('🔌 Connected to internal socket for force reset')

      // Invia il comando force reset
      clientSocket.emit('manager:forceReset')

      // Disconnetti dopo aver inviato il comando
      setTimeout(() => {
        clientSocket.disconnect()
      }, 1000)
    })

    res.status(200).json({
      success: true,
      message: 'Force reset command sent to legacy socket system'
    })

  } catch (error) {
    console.error('Errore durante il force reset:', error)
    res.status(500).json({
      success: false,
      message: 'Errore durante il force reset',
      error: error.message
    })
  }
}