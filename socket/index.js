import { Server } from "socket.io"
import { GAME_STATE_INIT, WEBSOCKET_SERVER_PORT } from "../config.mjs"
import Manager from "./roles/manager.js"
import Player from "./roles/player.js"
import { abortCooldown } from "./utils/cooldown.js"
import deepClone from "./utils/deepClone.js"

let gameState = deepClone(GAME_STATE_INIT)

const io = new Server({
  cors: {
    origin: process.env.NODE_ENV === 'production' 
      ? ["https://*.railway.app", "https://*.up.railway.app"] 
      : "*",
    credentials: true,
  },
})

console.log(`🚀 Socket Server running on port ${WEBSOCKET_SERVER_PORT}`)
console.log(`🎮 Game URL: http://localhost:3000`)
console.log(`👨‍🏫 Dashboard URL: http://localhost:3000/dashboard`)
console.log(`📝 Password Dashboard: admin123`)
console.log(`───────────────────────────────────────`)
io.listen(WEBSOCKET_SERVER_PORT)

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

  socket.on("manager:showLeaderboard", () =>
    Manager.showLoaderboard(gameState, io, socket),
  )

  // Sistema automatico di aggiornamento password real-time
  socket.on("admin:updateGameState", (updateData) => {
    try {
      console.log('🔄 Aggiornamento gameState in real-time...')
      
      if (updateData.password) {
        gameState.password = updateData.password
        console.log(`🔑 Password aggiornata: ${updateData.password}`)
      }
      
      if (updateData.subject) {
        gameState.subject = updateData.subject
        console.log(`📚 Materia aggiornata: ${updateData.subject}`)
      }
      
      if (updateData.questions) {
        gameState.questions = updateData.questions
        console.log(`❓ Domande aggiornate: ${updateData.questions.length} domande`)
      }
      
      // Conferma l'aggiornamento
      socket.emit("admin:gameStateUpdated", { 
        password: gameState.password,
        subject: gameState.subject,
        questionsCount: gameState.questions.length 
      })
      
      console.log(`✅ GameState aggiornato con successo!`)
      
    } catch (error) {
      console.error('❌ Errore nell\'aggiornamento gameState:', error)
      socket.emit("admin:updateError", error.message)
    }
  })

  // Endpoint per ottenere lo stato corrente
  socket.on("admin:getGameState", () => {
    socket.emit("admin:currentGameState", {
      password: gameState.password,
      subject: gameState.subject,
      questionsCount: gameState.questions.length,
      started: gameState.started,
      playersCount: gameState.players.length
    })
  })

  socket.on("disconnect", () => {
    console.log(`user disconnected ${socket.id}`)
    if (gameState.manager === socket.id) {
      console.log("Reset game")
      io.to(gameState.room).emit("game:reset")
      gameState.started = false
      gameState = deepClone(GAME_STATE_INIT)

      abortCooldown()

      return
    }

    const player = gameState.players.find((p) => p.id === socket.id)

    if (player) {
      gameState.players = gameState.players.filter((p) => p.id !== socket.id)
      socket.to(gameState.manager).emit("manager:removePlayer", player.id)
    }
  })
})
