import { createContext, useContext, useEffect, useState } from "react"
import { io } from "socket.io-client"
import { WEBSOCKET_PUBLIC_URL } from "../../config.mjs"

// Initialize socket connection
let socket = null

// Function to create socket connection
const createSocket = async () => {
  if (typeof window !== 'undefined' && !socket) {
    // Initialize the socket server first
    try {
      await fetch('/api/socket-init')
    } catch (error) {
      console.log('Socket init warning:', error)
    }
    
    socket = io(WEBSOCKET_PUBLIC_URL, {
      path: '/api/socket',
      transports: ["websocket", "polling"],
      autoConnect: true,
    })
    
    socket.on('connect', () => {
      console.log('🚀 Socket connected:', socket.id)
    })
    
    socket.on('disconnect', () => {
      console.log('❌ Socket disconnected')
    })
  }
  
  return socket
}

// Create socket instance
if (typeof window !== 'undefined') {
  createSocket()
}

export { socket }

export const SocketContext = createContext()

export const SocketContextProvider = ({ children }) => {
  const [socketInstance, setSocketInstance] = useState(null)

  useEffect(() => {
    const initSocket = async () => {
      const sock = await createSocket()
      setSocketInstance(sock)
    }
    
    if (typeof window !== 'undefined') {
      initSocket()
    }
  }, [])

  return (
    <SocketContext.Provider value={socketInstance || socket}>
      {children}
    </SocketContext.Provider>
  )
}

export function useSocketContext() {
  const context = useContext(SocketContext)

  return { socket: context }
}
