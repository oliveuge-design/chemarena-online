// Integrated server for Render deployment
const { createServer } = require('http')
const { parse } = require('url')
const next = require('next')
const { Server } = require('socket.io')
const { GAME_STATE_INIT, WEBSOCKET_SERVER_PORT } from './config.mjs'
const Manager = require('./socket/roles/manager.js')
const Player = require('./socket/roles/player.js')
const { abortCooldown } = require('./socket/utils/cooldown.js')
const deepClone = require('./socket/utils/deepClone.js')

const dev = process.env.NODE_ENV !== 'production'
const hostname = 'localhost'
const port = process.env.PORT || 3000

// Initialize Next.js app
const app = next({ dev, hostname, port })
const handle = app.getRequestHandler()

let gameState = deepClone(GAME_STATE_INIT)

app.prepare().then(() => {
  const server = createServer(async (req, res) => {
    try {
      const parsedUrl = parse(req.url, true)
      await handle(req, res, parsedUrl)
    } catch (err) {
      console.error('Error occurred handling', req.url, err)
      res.statusCode = 500
      res.end('internal server error')
    }
  })

  // Initialize Socket.IO
  const io = new Server(server, {
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

  server.listen(port, (err) => {
    if (err) throw err
    console.log(`🚀 Server ready on http://${hostname}:${port}`)
    console.log(`🎮 Game URL: http://${hostname}:${port}`)
    console.log(`👨‍🏫 Dashboard URL: http://${hostname}:${port}/dashboard`)
    console.log(`📝 Password Dashboard: admin123`)
    console.log(`───────────────────────────────────────`)
  })
})