import { createContext, useContext, useEffect, useState } from "react"
import { io } from "socket.io-client"
import { WEBSOCKET_PUBLIC_URL } from "../../config.mjs"

// Initialize socket connection
let socket = null

// Export a mutable reference
const socketRef = { current: null }

// Function to create socket connection
const createSocket = async () => {
  if (typeof window !== 'undefined' && !socket) {
    // Initialize the socket server first with multiple attempts
    try {
      console.log('🔧 Initializing socket server...')
      
      // Try to wake up the socket API
      const initResponse = await fetch('/api/socket-init', {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' }
      })
      
      if (initResponse.ok) {
        console.log('✅ Socket server initialized')
      }
      
      // Also try the status endpoint to ensure it's active
      await fetch('/api/socket-status')
      
    } catch (error) {
      console.log('⚠️ Socket init warning:', error)
    }
    
    // Wait a moment for server initialization
    await new Promise(resolve => setTimeout(resolve, 1000))
    
    // Use current hostname for production
    const socketURL = window.location.origin
    
    console.log('🌐 Connecting to:', socketURL)
    
    socket = io(socketURL, {
      path: '/api/socket',
      transports: ["polling", "websocket"],
      timeout: 10000,
      autoConnect: true,
    })
    
    // Update the ref too
    socketRef.current = socket
    
    socket.on('connect', () => {
      console.log('🚀 Socket connected:', socket.id)
    })
    
    socket.on('disconnect', () => {
      console.log('❌ Socket disconnected')
    })
    
    socket.on('connect_error', (error) => {
      console.log('❌ Socket connection error:', error)
    })
  }
  
  return socket
}

export { socket }

export const SocketContext = createContext()

export const SocketContextProvider = ({ children }) => {
  const [socketInstance, setSocketInstance] = useState(null)
  const [isConnecting, setIsConnecting] = useState(false)

  useEffect(() => {
    const initSocket = async () => {
      if (isConnecting) return
      
      setIsConnecting(true)
      try {
        const sock = await createSocket()
        setSocketInstance(sock)
        // Also update the global socket reference
        if (sock) {
          socketRef.current = sock
        }
      } catch (error) {
        console.error('Socket initialization failed:', error)
      } finally {
        setIsConnecting(false)
      }
    }
    
    if (typeof window !== 'undefined' && !socketInstance && !isConnecting) {
      initSocket()
    }
  }, [socketInstance, isConnecting])

  // Provide the socket instance immediately if available
  const currentSocket = socketInstance || socketRef.current

  return (
    <SocketContext.Provider value={currentSocket}>
      {children}
    </SocketContext.Provider>
  )
}

export function useSocketContext() {
  const context = useContext(SocketContext)
  
  // Use the global socket instance if context is not available yet
  const socketInstance = context || socketRef.current

  // Return socket with null checks
  return { 
    socket: socketInstance,
    isConnected: socketInstance?.connected || false,
    emit: (event, ...args) => {
      if (socketInstance && socketInstance.emit) {
        return socketInstance.emit(event, ...args)
      }
      console.warn('Socket not available for emit:', event)
    },
    on: (event, callback) => {
      if (socketInstance && socketInstance.on) {
        return socketInstance.on(event, callback)
      }
      console.warn('Socket not available for on:', event)
    },
    off: (event, callback) => {
      if (socketInstance && socketInstance.off) {
        return socketInstance.off(event, callback)
      }
      console.warn('Socket not available for off:', event)
    }
  }
}
