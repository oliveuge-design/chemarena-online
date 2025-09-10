export const WEBSOCKET_PUBLIC_URL = process.env.RENDER_EXTERNAL_URL || (process.env.WEBSOCKET_PUBLIC_URL || "http://localhost:5505/")
export const WEBSOCKET_SERVER_PORT = process.env.PORT || 5505

const QUIZZ_CONFIG = {
  password: "analitica123",
  subject: "Chimica Analitica",
  questions: [
    {
        "id": "qa1",
        "question": "Quale principio fisico è alla base della potenziometria?",
        "answers": [
            "Conduttività elettrica della soluzione",
            "Differenza di potenziale tra elettrodi",
            "Assorbimento di radiazioni elettromagnetiche",
            "Velocità di reazione chimica"
        ],
        "solution": 1,
        "time": 20,
        "cooldown": 5,
        "image": ""
    },
    {
        "id": "qa2",
        "question": "In una cella potenziometrica, quale elettrodo mantiene un potenziale costante?",
        "answers": [
            "Elettrodo di lavoro",
            "Elettrodo ausiliario",
            "Elettrodo di riferimento",
            "Controelettrodo"
        ],
        "solution": 2,
        "time": 20,
        "cooldown": 5,
        "image": ""
    },
    {
        "id": "qa3",
        "question": "L'equazione di Nernst correla il potenziale dell'elettrodo con:",
        "answers": [
            "La temperatura e la pressione",
            "La concentrazione degli ioni",
            "La superficie dell'elettrodo",
            "La velocità di agitazione"
        ],
        "solution": 1,
        "time": 25,
        "cooldown": 5,
        "image": ""
    },
    {
        "id": "qa4",
        "question": "Quale tipo di elettrodo è più comunemente usato per misurare il pH?",
        "answers": [
            "Elettrodo a calomelano",
            "Elettrodo ad argento/cloruro di argento",
            "Elettrodo di vetro",
            "Elettrodo di platino"
        ],
        "solution": 2,
        "time": 20,
        "cooldown": 5,
        "image": ""
    },
    {
        "id": "qa5",
        "question": "In conduttimetria, la conducibilità di una soluzione dipende da:",
        "answers": [
            "Solo dalla concentrazione degli ioni",
            "Dalla mobilità e concentrazione degli ioni",
            "Solo dalla temperatura",
            "Solo dal pH della soluzione"
        ],
        "solution": 1,
        "time": 25,
        "cooldown": 5,
        "image": ""
    },
    {
        "id": "qa6",
        "question": "L'unità di misura della conducibilità elettrica specifica è:",
        "answers": [
            "Ohm (Ω)",
            "Siemens per metro (S/m)",
            "Ampere (A)",
            "Volt per metro (V/m)"
        ],
        "solution": 1,
        "time": 20,
        "cooldown": 5,
        "image": ""
    },
    {
        "id": "qa7",
        "question": "Quale fattore NON influenza la conducibilità di una soluzione elettrolitica?",
        "answers": [
            "Temperatura",
            "Concentrazione degli ioni",
            "Colore della soluzione",
            "Natura degli ioni presenti"
        ],
        "solution": 2,
        "time": 20,
        "cooldown": 5,
        "image": ""
    },
    {
        "id": "qa8",
        "question": "In una titolazione conduttimetrica, il punto di equivalenza è identificato da:",
        "answers": [
            "Il massimo valore di conducibilità",
            "Il minimo valore di conducibilità",
            "Un cambiamento nella pendenza della curva",
            "Il colore della soluzione"
        ],
        "solution": 2,
        "time": 25,
        "cooldown": 5,
        "image": ""
    },
    {
        "id": "qa9",
        "question": "La costante di cella in conduttimetria è:",
        "answers": [
            "Il rapporto tra distanza e area degli elettrodi",
            "La resistenza della soluzione",
            "La temperatura della misura",
            "La concentrazione dell'elettrolita"
        ],
        "solution": 0,
        "time": 25,
        "cooldown": 5,
        "image": ""
    },
    {
        "id": "qa10",
        "question": "Quale tecnica è più appropriata per determinare il punto finale di una titolazione di acido forte con base forte?",
        "answers": [
            "Solo potenziometria",
            "Solo conduttimetria",
            "Entrambe le tecniche sono appropriate",
            "Nessuna delle due tecniche"
        ],
        "solution": 2,
        "time": 25,
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