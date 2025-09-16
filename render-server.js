#!/usr/bin/env node

/**
 * 🚀 RENDER.COM PRODUCTION SERVER
 * Integrates Next.js + Socket.io on single port
 */

const { createServer } = require('http')
const { parse } = require('url')
const next = require('next')
const { Server } = require('socket.io')

// Import socket logic - we'll implement inline
const fs = require('fs')
const path = require('path')

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

  // Basic socket setup - just connection for now
  io.on('connection', (socket) => {
    console.log('👋 Client connected:', socket.id)

    socket.emit('connected', {
      message: 'ChemArena Socket.io Ready',
      timestamp: new Date().toISOString()
    })

    socket.on('disconnect', () => {
      console.log('👋 Client disconnected:', socket.id)
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