// Initialize Socket.IO server
export default async function handler(req, res) {
  // Import the socket API to ensure it's initialized
  const socketModule = await import('./socket.js')
  
  // Handle quiz data update requests
  if (req.method === 'POST' && req.body?.type === 'updateGameState') {
    const { data } = req.body
    
    // Update global quiz config
    global.currentQuizConfig = data
    
    console.log('🔄 Quiz config updated:', {
      password: data.password,
      subject: data.subject,
      questions: data.questions?.length || 0
    })
  }
  
  res.status(200).json({ 
    success: true, 
    message: 'Socket.IO server initialized',
    path: '/api/socket',
    quizConfig: global.currentQuizConfig || null
  })
}