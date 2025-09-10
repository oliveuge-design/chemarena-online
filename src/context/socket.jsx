import { createContext, useContext, useEffect, useState } from "react"
import { io } from "socket.io-client"
import { WEBSOCKET_PUBLIC_URL } from "../../config.mjs"

// Initialize socket connection
let socket = null

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

  return (
    <SocketContext.Provider value={socketInstance}>
      {children}
    </SocketContext.Provider>
  )
}

export function useSocketContext() {
  const context = useContext(SocketContext)

  // Return socket with null checks
  return { 
    socket: context,
    isConnected: context?.connected || false,
    emit: (event, ...args) => {
      if (context && context.emit) {
        return context.emit(event, ...args)
      }
      console.warn('Socket not available for emit:', event)
    },
    on: (event, callback) => {
      if (context && context.on) {
        return context.on(event, callback)
      }
      console.warn('Socket not available for on:', event)
    },
    off: (event, callback) => {
      if (context && context.off) {
        return context.off(event, callback)
      }
      console.warn('Socket not available for off:', event)
    }
  }
}
