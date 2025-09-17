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

    // FIXED: Update gameState immediately using the exported function
    // This ensures the running game uses the new quiz data
    try {
      socketModule.updateGameState(data)
      console.log('✅ GameState updated via exported function')
    } catch (error) {
      console.log('⚠️ GameState update warning:', error.message)
    }
  }

  res.status(200).json({
    success: true,
    message: 'Socket.IO server initialized',
    path: '/api/socket',
    quizConfig: global.currentQuizConfig || null
  })
}