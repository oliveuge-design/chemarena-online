// Initialize Socket.IO server
export default async function handler(req, res) {
  // Import the socket API to ensure it's initialized
  await import('./socket.js')
  
  res.status(200).json({ 
    success: true, 
    message: 'Socket.IO server initialized',
    path: '/api/socket'
  })
}