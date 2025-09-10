// Socket.IO API route for Next.js
import { Server } from 'socket.io'
import { GAME_STATE_INIT } from '../../../config.mjs'
import Manager from '../../../socket/roles/manager.js'
import Player from '../../../socket/roles/player.js'
import deepClone from '../../../socket/utils/deepClone.js'

let gameState = deepClone(GAME_STATE_INIT)
let io

export default function handler(req, res) {
  if (!res.socket.server.io) {
    console.log('🚀 Starting Socket.IO server...')

    // Create Socket.IO server
    io = new Server(res.socket.server, {
      path: '/api/socket',
      cors: {
        origin: process.env.NODE_ENV === 'production' 
          ? ["https://*.onrender.com", "https://*.render.com"] 
          : "*",
        credentials: true,
      },
    })

    // Socket.IO event handlers
    io.on("connection", (socket) => {
      console.log(`A user connected ${socket.id}`)

      socket.on("player:checkRoom", (roomId) =>
        Player.checkRoom(gameState, io, socket, roomId),
      )

      socket.on("player:join", (player) =>
        Player.join(gameState, io, socket, player),
      )

      socket.on("manager:createRoom", (password) =>
        Manager.createRoom(gameState, io, socket, password),
      )
      
      socket.on("manager:kickPlayer", (playerId) =>
        Manager.kickPlayer(gameState, io, socket, playerId),
      )

      socket.on("manager:startGame", () => Manager.startGame(gameState, io, socket))

      socket.on("player:selectedAnswer", (answerKey) =>
        Player.selectedAnswer(gameState, io, socket, answerKey),
      )

      socket.on("manager:abortQuiz", () => Manager.abortQuiz(gameState, io, socket))

      socket.on("manager:nextQuestion", () =>
        Manager.nextQuestion(gameState, io, socket),
      )

      socket.on("admin:updateGameState", (newGameState) => {
        gameState = { ...gameState, ...newGameState }
        console.log("🔄 Game state updated via admin")
      })

      socket.on("disconnect", () => {
        console.log(`User disconnected ${socket.id}`)
        Player.disconnect(gameState, io, socket)
      })
    })

    res.socket.server.io = io
    console.log('✅ Socket.IO server initialized')
  }

  res.end()
}