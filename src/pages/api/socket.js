// Socket.IO API route for Next.js
import { Server } from 'socket.io'
import { GAME_STATE_INIT } from '../../../config.mjs'
import Manager from '../../../socket/roles/manager.js'
import Player from '../../../socket/roles/player.js'
import deepClone from '../../../socket/utils/deepClone.js'

// Function to get current game state
function getCurrentGameState() {
  const baseState = {
    started: false,
    players: [],
    playersAnswer: [],
    manager: null,
    room: null,
    currentQuestion: 0,
    roundStartTime: 0,
  }
  
  // Use global config if available, otherwise fallback to file config
  const config = global.currentQuizConfig || {
    password: GAME_STATE_INIT.password,
    subject: GAME_STATE_INIT.subject,
    questions: GAME_STATE_INIT.questions
  }
  
  return { ...baseState, ...config }
}

let gameState = getCurrentGameState()
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

      socket.on("manager:createRoom", () =>
        Manager.createRoom(gameState, io, socket),
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
        // Update global config
        global.currentQuizConfig = { ...global.currentQuizConfig, ...newGameState }
        // Refresh gameState with new config
        gameState = getCurrentGameState()
        console.log("🔄 Game state updated via admin:", {
          password: gameState.password,
          subject: gameState.subject,
          questions: gameState.questions?.length
        })
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