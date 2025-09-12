export const WEBSOCKET_PUBLIC_URL = "http://localhost:5505/"
export const WEBSOCKET_SERVER_PORT = 5505

const QUIZZ_CONFIG = {
  password: "QUIZ123",
  subject: "Informatica",
  questions: [
    {
        "id": "q16",
        "question": "Chi ha fondato Microsoft?",
        "answers": [
            "Steve Jobs",
            "Bill Gates",
            "Mark Zuckerberg",
            "Jeff Bezos"
        ],
        "solution": 1,
        "time": 15,
        "cooldown": 5,
        "image": ""
    },
    {
        "id": "q17",
        "question": "Cosa significa 'WWW'?",
        "answers": [
            "World Wide Web",
            "World Web Wide",
            "Wide World Web",
            "Web World Wide"
        ],
        "solution": 0,
        "time": 15,
        "cooldown": 5,
        "image": ""
    },
    {
        "id": "q18",
        "question": "In quale anno è stato inventato Internet?",
        "answers": [
            "1969",
            "1975",
            "1981",
            "1990"
        ],
        "solution": 0,
        "time": 15,
        "cooldown": 5,
        "image": ""
    },
    {
        "id": "q19",
        "question": "Qual è il linguaggio di programmazione più usato nel 2024?",
        "answers": [
            "Java",
            "Python",
            "JavaScript",
            "C++"
        ],
        "solution": 2,
        "time": 15,
        "cooldown": 5,
        "image": ""
    },
    {
        "id": "q20",
        "question": "Cosa significa 'AI' in informatica?",
        "answers": [
            "Auto Intelligence",
            "Artificial Intelligence",
            "Advanced Intelligence",
            "Applied Intelligence"
        ],
        "solution": 1,
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