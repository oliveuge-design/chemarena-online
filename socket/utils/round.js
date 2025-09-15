import { cooldown, sleep } from "./cooldown.js"

export const startRound = async (game, io, socket, multiRoomManager = null) => {
  const question = game.questions[game.currentQuestion]

  console.log(`🔍 StartRound: questionIndex=${game.currentQuestion}, started=${game.started}, room=${game.room}`)

  // Funzione helper per verificare se la room esiste ancora
  const isRoomValid = () => {
    if (!game.started || !game.room) {
      return false;
    }
    // Se multiRoomManager è disponibile, verifica l'esistenza della room
    if (multiRoomManager && !multiRoomManager.getRoomState(game.room)) {
      console.log(`❌ Room ${game.room} no longer exists in multiRoomManager`)
      return false;
    }
    return true;
  }

  if (!isRoomValid()) {
    console.log(`❌ StartRound aborted: game not started, no room, or room removed`)
    return
  }

  io.to(game.room).emit("game:updateQuestion", {
    current: game.currentQuestion + 1,
    total: game.questions.length,
  })

  io.to(game.room).emit("game:status", {
    name: "SHOW_PREPARED",
    data: {
      totalAnswers: game.questions[game.currentQuestion].answers.length,
      questionNumber: game.currentQuestion + 1,
    },
  })

  await sleep(2)
  console.log(`🔍 After first sleep, game.started=${game.started}, room=${game.room}`)

  if (!isRoomValid()) {
    console.log(`❌ StartRound aborted after first sleep: room no longer valid`)
    return
  }

  io.to(game.room).emit("game:status", {
    name: "SHOW_QUESTION",
    data: {
      question: question.question,
      image: question.image,
      cooldown: question.cooldown,
    },
  })

  await sleep(question.cooldown)
  console.log(`🔍 After cooldown sleep, game.started=${game.started}, room=${game.room}`)

  if (!isRoomValid()) {
    console.log(`❌ StartRound aborted after cooldown: room no longer valid`)
    return
  }

  game.roundStartTime = Date.now()

  io.to(game.room).emit("game:status", {
    name: "SELECT_ANSWER",
    data: {
      question: question.question,
      answers: question.answers,
      image: question.image,
      time: question.time,
      totalPlayer: game.players.length,
    },
  })

  console.log(`🔍 Starting question cooldown for ${question.time} seconds...`)
  await cooldown(question.time, io, game.room)
  console.log(`🔍 After question cooldown, game.started=${game.started}, room=${game.room}`)

  if (!isRoomValid()) {
    console.log(`❌ StartRound aborted after question timeout: room no longer valid`)
    return
  }

  game.players.map(async (player) => {
    let playerAnswer = await game.playersAnswer.find((p) => p.id === player.id)

    let isCorrect = playerAnswer
      ? playerAnswer.answer === question.solution
      : false

    let points =
      (isCorrect && Math.round(playerAnswer && playerAnswer.points)) || 0

    player.points += points

    let sortPlayers = game.players.sort((a, b) => b.points - a.points)

    let rank = sortPlayers.findIndex((p) => p.id === player.id) + 1
    let aheadPlayer = sortPlayers[rank - 2]

    io.to(player.id).emit("game:status", {
      name: "SHOW_RESULT",
      data: {
        correct: isCorrect,
        message: isCorrect ? "Nice !" : "Too bad",
        points: points,
        myPoints: player.points,
        rank,
        aheadOfMe: aheadPlayer ? aheadPlayer.username : null,
      },
    })
  })

  let totalType = {}

  game.playersAnswer.forEach(({ answer }) => {
    totalType[answer] = (totalType[answer] || 0) + 1
  })

  // Manager
  io.to(game.manager).emit("game:status", {
    name: "SHOW_RESPONSES",
    data: {
      question: game.questions[game.currentQuestion].question,
      responses: totalType,
      correct: game.questions[game.currentQuestion].solution,
      answers: game.questions[game.currentQuestion].answers,
      image: game.questions[game.currentQuestion].image,
    },
  })

  game.playersAnswer = []
}
