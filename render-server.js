#!/usr/bin/env node

/**
 * 🚀 RENDER.COM PRODUCTION SERVER
 * Integrates Next.js + Socket.io on single port
 */

const { createServer } = require('http')
const { parse } = require('url')
const next = require('next')
const { Server } = require('socket.io')

// Import socket logic via dynamic import (ES6 compatibility)
const fs = require('fs')
const path = require('path')

// Simple room manager for Render
class SimpleRoomManager {
  constructor() {
    this.rooms = new Map()
    this.managerToRoom = new Map()
  }

  createRoom(socketId, teacherId, data) {
    const roomId = Math.floor(100000 + Math.random() * 900000).toString()

    const roomState = {
      roomId,
      teacherId,
      managerSocketId: socketId,
      password: data.password || 'CHEMARENA',
      subject: data.subject || 'Quiz',
      questions: data.questions || [],
      players: [],
      started: false,
      currentQuestion: 0,
      quizTitle: data.quizTitle || 'Quiz Default'
    }

    this.rooms.set(roomId, roomState)
    this.managerToRoom.set(socketId, roomId)

    console.log(`🎯 QUIZ CARICATO IN ROOM ${roomId}:`)
    console.log(`   📝 Titolo: ${roomState.quizTitle}`)
    console.log(`   📚 Materia: ${roomState.subject}`)
    console.log(`   🔢 Domande: ${roomState.questions.length}`)
    console.log(`   🔑 Password: ${roomState.password}`)

    return {
      success: true,
      roomId,
      stats: { activeRooms: this.rooms.size }
    }
  }

  getRoomById(roomId) {
    return this.rooms.get(roomId)
  }

  addPlayerToRoom(roomId, player) {
    const room = this.rooms.get(roomId)
    if (!room) return { success: false, error: 'Room not found' }

    // Check for duplicate username
    if (room.players.find(p => p.username === player.username)) {
      return { success: false, error: 'Username already taken' }
    }

    // Add player
    const playerData = {
      id: player.id,
      username: player.username,
      socketId: player.socketId,
      score: 0,
      answers: []
    }

    room.players.push(playerData)
    console.log(`👋 Player ${player.username} joined room ${roomId} (${room.players.length} total)`)

    return {
      success: true,
      room: room,
      playerData: playerData,
      playersCount: room.players.length
    }
  }

  removeRoom(roomId) {
    const room = this.rooms.get(roomId)
    if (room) {
      this.managerToRoom.delete(room.managerSocketId)
      this.rooms.delete(roomId)
      console.log(`🗑️ Room ${roomId} removed`)
    }
  }
}

const simpleRoomManager = new SimpleRoomManager()

const dev = process.env.NODE_ENV !== 'production'
const hostname = 'localhost'
const port = process.env.PORT || 3000

console.log('\n🌐 ═══════════════════════════════════════════════════════════')
console.log('🚀                 CHEMARENA - RENDER PRODUCTION             🚀')
console.log('═══════════════════════════════════════════════════════════\n')

// Initialize Next.js
const app = next({ dev, hostname, port })
const handle = app.getRequestHandler()

app.prepare().then(() => {
  // Create HTTP server
  const server = createServer(async (req, res) => {
    try {
      const parsedUrl = parse(req.url, true)
      await handle(req, res, parsedUrl)
    } catch (err) {
      console.error('Error occurred handling', req.url, err)
      res.statusCode = 500
      res.end('Internal Server Error')
    }
  })

  // Initialize Socket.io
  const io = new Server(server, {
    cors: {
      origin: "*",
      methods: ["GET", "POST"]
    },
    allowEIO3: true,
    transports: ['websocket', 'polling']
  })

  console.log('🔌 Setting up Socket.io handlers...')

  // Full socket setup with room management
  io.on('connection', (socket) => {
    console.log('👋 Client connected:', socket.id)

    socket.emit('connected', {
      message: 'ChemArena Socket.io Ready',
      timestamp: new Date().toISOString()
    })

    // ============================================
    // MANAGER EVENTS - Room Creation
    // ============================================
    socket.on("manager:createRoom", (data = {}) => {
      console.log('🔌 Manager creating room with data:', data)

      const teacherId = data.teacherId || `teacher_${socket.id}`

      const result = simpleRoomManager.createRoom(socket.id, teacherId, data)

      if (result.success) {
        socket.join(result.roomId)
        socket.emit("manager:inviteCode", result.roomId)
        socket.emit("manager:roomCreated", {
          roomId: result.roomId,
          stats: result.stats
        })

        console.log(`✅ Room ${result.roomId} created for ${teacherId}`)
      } else {
        socket.emit("manager:createRoomError", {
          error: result.error,
          suggestions: result.suggestions || [],
          stats: result.stats
        })

        console.log(`❌ Room creation failed for ${teacherId}: ${result.error}`)
      }
    })

    // ============================================
    // PLAYER EVENTS - Student Login
    // ============================================
    socket.on("player:checkRoom", (roomId) => {
      console.log(`🔍 Player checking room: ${roomId}`)

      const room = simpleRoomManager.getRoomById(roomId)
      if (room) {
        socket.emit("game:successRoom", roomId)
        console.log(`✅ Room ${roomId} found for player`)
      } else {
        socket.emit("game:errorMessage", "Room not found")
        console.log(`❌ Room ${roomId} not found`)
      }
    })

    socket.on("player:join", (playerData) => {
      console.log(`👋 Player ${playerData.username} attempting to join room ${playerData.room}`)

      const result = simpleRoomManager.addPlayerToRoom(playerData.room, {
        id: socket.id,
        username: playerData.username,
        socketId: socket.id
      })

      if (result.success) {
        // Join socket to room
        socket.join(playerData.room)

        // Notify player success
        socket.emit("game:successJoin", {
          username: playerData.username,
          room: playerData.room
        })

        // Notify manager about new player
        socket.to(playerData.room).emit("game:status", {
          name: "SHOW_ROOM",
          data: {
            players: result.room.players,
            playersCount: result.playersCount
          }
        })

        console.log(`✅ Player ${playerData.username} successfully joined room ${playerData.room}`)
      } else {
        socket.emit("game:errorMessage", result.error)
        console.log(`❌ Player ${playerData.username} join failed: ${result.error}`)
      }
    })

    // Cleanup on disconnect
    socket.on('disconnect', () => {
      console.log('👋 Client disconnected:', socket.id)

      // Remove room if manager disconnects
      const roomId = simpleRoomManager.managerToRoom.get(socket.id)
      if (roomId) {
        console.log(`🚨 Manager disconnected for room ${roomId}`)
        simpleRoomManager.removeRoom(roomId)
      }
    })
  })

  server.listen(port, (err) => {
    if (err) throw err
    console.log(`✅ ChemArena ready on http://localhost:${port}`)
    console.log(`🔌 Socket.io ready on same port`)
    console.log('📱 Students: http://localhost:' + port)
    console.log('👨‍🏫 Teachers: http://localhost:' + port + '/dashboard')
    console.log('═══════════════════════════════════════════════════════════\n')
  })
})