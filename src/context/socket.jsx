import { createContext, useContext, useEffect, useState } from "react"
import { io } from "socket.io-client"

let socket = null

export const SocketContext = createContext()

export const SocketContextProvider = ({ children }) => {
  const [socketInstance, setSocketInstance] = useState(null)

  useEffect(() => {
    if (typeof window !== 'undefined' && !socket) {
      socket = io(window.location.origin, {
        path: '/api/socket',
        transports: ["polling", "websocket"],
      })

      socket.on('connect', () => console.log('🚀 Connected:', socket.id))
      socket.on('disconnect', () => console.log('❌ Disconnected'))

      setSocketInstance(socket)
    }
  }, [])

  return (
    <SocketContext.Provider value={socketInstance}>
      {children}
    </SocketContext.Provider>
  )
}

export function useSocketContext() {
  const socket = useContext(SocketContext)

  return {
    socket,
    isConnected: socket?.connected || false,
    emit: (event, ...args) => socket?.emit(event, ...args),
    on: (event, callback) => socket?.on(event, callback),
    off: (event, callback) => socket?.off(event, callback)
  }
}
