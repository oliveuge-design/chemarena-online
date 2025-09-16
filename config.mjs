export const WEBSOCKET_PUBLIC_URL = process.env.WEBSOCKET_PUBLIC_URL || "http://localhost:5505/"
export const WEBSOCKET_SERVER_PORT = 5505

const QUIZZ_CONFIG = {
  password: "CHEMARENA",
  subject: "Geografia",
  questions: [
    {
        "id": "q1",
        "question": "Qual è la capitale della Francia?",
        "answers": [
            "Berlino",
            "Parigi",
            "Madrid",
            "Roma"
        ],
        "solution": 1,
        "time": 15,
        "cooldown": 5,
        "image": ""
    },
    {
        "id": "q2",
        "question": "Quale fiume è il più lungo del mondo?",
        "answers": [
            "Nilo",
            "Amazon",
            "Mississippi",
            "Yangtze"
        ],
        "solution": 1,
        "time": 15,
        "cooldown": 5,
        "image": ""
    },
    {
        "id": "q3",
        "question": "Quanti continenti ci sono?",
        "answers": [
            "5",
            "6",
            "7",
            "8"
        ],
        "solution": 2,
        "time": 15,
        "cooldown": 5,
        "image": ""
    },
    {
        "id": "q4",
        "question": "Qual è il monte più alto del mondo?",
        "answers": [
            "K2",
            "Everest",
            "Makalu",
            "Cho Oyu"
        ],
        "solution": 1,
        "time": 15,
        "cooldown": 5,
        "image": ""
    },
    {
        "id": "q5",
        "question": "Quale paese ha più fusi orari?",
        "answers": [
            "Russia",
            "USA",
            "Cina",
            "Canada"
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