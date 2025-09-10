// Check Socket.IO server status
export default async function handler(req, res) {
  try {
    // This will trigger the socket.js to initialize if not already done
    const socketModule = await import('./socket.js')
    
    res.status(200).json({ 
      status: 'Socket server active',
      timestamp: new Date().toISOString(),
      method: req.method
    })
  } catch (error) {
    console.error('Socket status error:', error)
    res.status(500).json({ 
      status: 'Socket server error',
      error: error.message,
      timestamp: new Date().toISOString()
    })
  }
}