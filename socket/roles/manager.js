import { GAME_STATE_INIT } from "../../config.mjs"
import { abortCooldown, cooldown, sleep } from "../utils/cooldown.js"
import deepClone from "../utils/deepClone.js"
import generateRoomId from "../utils/generateRoomId.js"
import { startRound } from "../utils/round.js"

const Manager = {
  createRoom: (game, io, socket) => {
    if (game.manager || game.room) {
      io.to(socket.id).emit("game:errorMessage", "Already manager")
      return
    }

    let roomInvite = generateRoomId()
    game.room = roomInvite
    game.manager = socket.id

    socket.join(roomInvite)
    io.to(socket.id).emit("manager:inviteCode", roomInvite)

    console.log("New room created: " + roomInvite)
  },

  kickPlayer: (game, io, socket, playerId) => {
    if (game.manager !== socket.id) {
      return
    }

    const player = game.players.find((p) => p.id === playerId)
    game.players = game.players.filter((p) => p.id !== playerId)

    io.in(playerId).socketsLeave(game.room)
    io.to(player.id).emit("game:kick")
    io.to(game.manager).emit("manager:playerKicked", player.id)
  },

  startGame: async (game, io, socket) => {
    if (game.started || !game.room) {
      return
    }

    game.started = true
    game.gameStartTime = Date.now() // Registra l'inizio del gioco
    
    io.to(game.room).emit("game:status", {
      name: "SHOW_START",
      data: {
        time: 3,
        subject: game.subject,
      },
    })

    await sleep(3)
    io.to(game.room).emit("game:startCooldown")

    await cooldown(3, io, game.room)
    startRound(game, io, socket)
  },

  nextQuestion: (game, io, socket) => {
    if (!game.started) {
      return
    }

    if (socket.id !== game.manager) {
      return
    }

    if (!game.questions[game.currentQuestion + 1]) {
      return
    }

    game.currentQuestion++
    startRound(game, io, socket)
  },

  abortQuiz: (game, io, socket) => {
    if (!game.started) {
      return
    }

    if (socket.id !== game.manager) {
      return
    }

    abortCooldown(game, io, game.room)
  },

  showLoaderboard: (game, io, socket) => {
    if (!game.questions[game.currentQuestion + 1]) {
      // Salva statistiche prima di finire il gioco
      const gameEndTime = Date.now()
      const gameStats = {
        id: Date.now().toString(),
        date: new Date().toISOString(),
        quizSubject: game.subject,
        duration: gameEndTime - (game.gameStartTime || gameEndTime),
        questionsCount: game.questions.length,
        players: game.players.map(player => ({
          id: player.id || Date.now() + Math.random(),
          name: player.username || player.name || 'Anonimo',
          score: player.points || 0
        })),
        maxScore: game.questions.length * 1000,
        questionStats: game.questions.map((question, index) => {
          const totalAnswers = game.playersAnswer.filter(a => a.questionIndex === index).length
          const correctAnswers = game.playersAnswer.filter(a => 
            a.questionIndex === index && a.answerKey === question.solution
          ).length
          
          return {
            questionIndex: index,
            question: question.question,
            correct: correctAnswers,
            total: totalAnswers,
            percentage: totalAnswers > 0 ? Math.round((correctAnswers / totalAnswers) * 100) : 0
          }
        })
      }

      // Invia evento speciale per salvare le statistiche lato client
      socket.emit("game:saveStats", gameStats)
      
      socket.emit("game:status", {
        name: "FINISH",
        data: {
          subject: game.subject,
          top: game.players.slice(0, 3).sort((a, b) => b.points - a.points),
        },
      })

      game = deepClone(GAME_STATE_INIT)
      return
    }

    socket.emit("game:status", {
      name: "SHOW_LEADERBOARD",
      data: {
        leaderboard: game.players
          .sort((a, b) => b.points - a.points)
          .slice(0, 5),
      },
    })
  },
}

export default Manager
