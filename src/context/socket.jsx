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
    console.log('🏢 Inizializzazione Multi-Room Socket Client...')
    console.log('🔍 WEBSOCKET_PUBLIC_URL from config:', WEBSOCKET_PUBLIC_URL)

    // Use Multi-Room Socket Server
    const socketURL = WEBSOCKET_PUBLIC_URL || 'http://localhost:5557'

    console.log('🏢 Connecting to Multi-Room Server:', socketURL)
    console.log('🔍 Socket will connect to:', socketURL)

    // Force disconnect any existing socket
    if (socket) {
      console.log('🚨 Forcing disconnect of existing socket')
      socket.disconnect()
      socket = null
      socketRef.current = null
    }

    socket = io(socketURL, {
      // Rimuovi path - usiamo connessione diretta al server dedicato
      transports: ["polling", "websocket"],
      timeout: 10000,
      autoConnect: true,
    })
    
    // Update the ref too
    socketRef.current = socket
    
    socket.on('connect', () => {
      console.log('✅ Socket connected successfully!')
      console.log('🔍 Connected to URL:', socketURL)
      console.log('🔍 Socket ID:', socket.id)
      console.log('🔍 Multi-Room Server detected!')
    })

    socket.on('disconnect', () => {
      console.log('❌ Socket disconnected from:', socketURL)
    })

    socket.on('connect_error', (error) => {
      console.error('❌ Socket connection error to:', socketURL)
      console.error('❌ Error details:', error)
      if (process.env.NODE_ENV === 'development' || socket.connected === false) {
        console.log('🔄 Connection error, will retry...')
      }
    })

    // Debug: Log multi-room events
    socket.on('manager:roomCreated', (data) => {
      console.log('✅ Multi-Room: Room created!', data)
    })

    socket.on('manager:createRoomError', (data) => {
      console.log('❌ Multi-Room: Room creation failed!', data)
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

  // Return socket with better null checks and less verbose warnings
  return { 
    socket: socketInstance,
    isConnected: socketInstance?.connected || false,
    emit: (event, ...args) => {
      if (socketInstance && socketInstance.emit) {
        return socketInstance.emit(event, ...args)
      }
      // Silently fail for game events during initialization
      if (process.env.NODE_ENV === 'development' && !event.startsWith('game:')) {
        console.warn('Socket not available for emit:', event)
      }
    },
    on: (event, callback) => {
      if (socketInstance && socketInstance.on) {
        return socketInstance.on(event, callback)
      }
      // Silently fail during initialization - socket will be ready soon
      if (process.env.NODE_ENV === 'development') {
        console.debug('Socket not ready for listener:', event)
      }
    },
    off: (event, callback) => {
      if (socketInstance && socketInstance.off) {
        return socketInstance.off(event, callback)
      }
      // Silently fail during cleanup
    }
  }
}
