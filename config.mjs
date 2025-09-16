export const WEBSOCKET_PUBLIC_URL = "http://localhost:5505/"
export const WEBSOCKET_SERVER_PORT = 5505

const QUIZZ_CONFIG = {
  password: "CHEMARENA",
  subject: "Test",
  questions: [
    {
        "id": "q1757828391780_0",
        "question": "Test?",
        "answers": [
            "A",
            "B",
            "C",
            "D"
        ],
        "solution": 0,
        "time": 15,
        "cooldown": 5,
        "image": ""
    }
]
}

// DONT CHANGE
export const GAME_STATE_INIT = {
  started: false,
  players: [],
  playersAnswer: [],
  manager: null,
  room: null,
  currentQuestion: 0,
  roundStartTime: 0,
  ...QUIZZ_CONFIG,
}