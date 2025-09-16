/**
 * TEST LOGIN STUDENTI
 * Simula flusso completo: Manager crea room → Studente si connette
 */

const { io } = require('socket.io-client')

console.log('🧪 INIZIANDO TEST LOGIN STUDENTI...\n')

// Test su LOCALHOST prima
const SOCKET_URL = 'http://localhost:5505'

let managerSocket, studentSocket, roomPin

// STEP 1: Manager si connette e crea room
managerSocket = io(SOCKET_URL)

managerSocket.on('connect', () => {
  console.log('👨‍🏫 Manager connesso:', managerSocket.id)

  // Simula creazione room
  const quizData = {
    teacherId: 'test_teacher',
    password: 'TEST123',
    subject: 'Test Subject',
    quizTitle: 'Test Quiz',
    questions: [
      {
        id: 'q1',
        question: 'Test question?',
        answers: ['A', 'B', 'C', 'D'],
        solution: 0,
        time: 30
      }
    ]
  }

  console.log('🚀 Manager creating room...')
  managerSocket.emit('manager:createRoom', quizData)
})

managerSocket.on('manager:inviteCode', (pin) => {
  console.log('✅ PIN ricevuto:', pin)
  roomPin = pin

  // STEP 2: Studente tenta login
  console.log('\n📱 SIMULANDO LOGIN STUDENTE...')
  studentSocket = io(SOCKET_URL)

  studentSocket.on('connect', () => {
    console.log('📱 Studente connesso:', studentSocket.id)

    // Test checkRoom
    console.log(`🔍 Studente verifica room: ${roomPin}`)
    studentSocket.emit('player:checkRoom', roomPin)
  })

  studentSocket.on('player:roomFound', (data) => {
    console.log('✅ Room trovata:', data)

    // Test join
    console.log('👋 Studente tenta join...')
    studentSocket.emit('player:join', {
      room: roomPin,
      username: 'TestStudent',
      password: data.password
    })
  })

  studentSocket.on('player:roomNotFound', (data) => {
    console.log('❌ Room NON trovata:', data)
    process.exit(1)
  })

  studentSocket.on('player:successJoin', (data) => {
    console.log('🎉 LOGIN STUDENTE SUCCESS:', data)
    console.log('\n✅ TEST COMPLETATO: Flusso login studenti FUNZIONA in localhost!')
    process.exit(0)
  })

  studentSocket.on('player:joinError', (data) => {
    console.log('❌ LOGIN STUDENTE FAILED:', data)
    process.exit(1)
  })
})

managerSocket.on('manager:createRoomError', (error) => {
  console.log('❌ Manager room creation failed:', error)
  process.exit(1)
})

// Timeout sicurezza
setTimeout(() => {
  console.log('⏰ Test timeout - qualcosa è andato storto')
  process.exit(1)
}, 10000)