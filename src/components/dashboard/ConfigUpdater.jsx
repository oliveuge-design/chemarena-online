import { useState } from "react"
import Button from "@/components/Button"

export default function ConfigUpdater({ quiz, onConfigUpdate }) {
  const [isUpdating, setIsUpdating] = useState(false)
  const [updateStatus, setUpdateStatus] = useState(null)

  const updateConfigFile = async () => {
    if (!quiz) return

    setIsUpdating(true)
    setUpdateStatus(null)

    try {
      // Prepara il contenuto del file di configurazione
      const configContent = `export const WEBSOCKET_PUBLIC_URL = "http://localhost:5505/"
export const WEBSOCKET_SERVER_PORT = 5505

const QUIZZ_CONFIG = {
  password: "${quiz.password}",
  subject: "${quiz.subject}",
  questions: ${JSON.stringify(quiz.questions, null, 4)},
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
}`

      // In un ambiente reale, qui si farebbe una chiamata API per aggiornare il file
      // Per ora salviamo nel localStorage come backup
      localStorage.setItem('current-config-backup', configContent)
      localStorage.setItem('last-config-update', new Date().toISOString())
      
      // Simula un delay per mostrare il loading
      await new Promise(resolve => setTimeout(resolve, 1500))
      
      setUpdateStatus('success')
      if (onConfigUpdate) {
        onConfigUpdate(configContent)
      }
      
    } catch (error) {
      console.error('Errore nell\'aggiornamento:', error)
      setUpdateStatus('error')
    } finally {
      setIsUpdating(false)
    }
  }

  const downloadConfig = () => {
    if (!quiz) return

    const configContent = `export const WEBSOCKET_PUBLIC_URL = "http://localhost:5505/"
export const WEBSOCKET_SERVER_PORT = 5505

const QUIZZ_CONFIG = {
  password: "${quiz.password}",
  subject: "${quiz.subject}",
  questions: ${JSON.stringify(quiz.questions, null, 2)},
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
}`

    const blob = new Blob([configContent], { type: 'application/javascript' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = 'config.mjs'
    a.click()
    URL.revokeObjectURL(url)
  }

  const copyToClipboard = async () => {
    if (!quiz) return

    const configContent = `export const WEBSOCKET_PUBLIC_URL = "http://localhost:5505/"
export const WEBSOCKET_SERVER_PORT = 5505

const QUIZZ_CONFIG = {
  password: "${quiz.password}",
  subject: "${quiz.subject}",
  questions: ${JSON.stringify(quiz.questions, null, 2)},
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
}`

    try {
      await navigator.clipboard.writeText(configContent)
      alert('Configurazione copiata negli appunti!')
    } catch (err) {
      console.error('Errore nella copia:', err)
      alert('Errore nella copia. Usa il download invece.')
    }
  }

  if (!quiz) return null

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">
        Aggiornamento Configurazione
      </h3>
      
      <div className="space-y-4">
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <div className="flex items-start">
            <div className="text-blue-500 mr-2">ℹ️</div>
            <div className="text-sm">
              <p className="font-medium text-blue-900 mb-1">Istruzioni:</p>
              <ol className="text-blue-800 space-y-1 list-decimal list-inside">
                <li>Scarica il file di configurazione aggiornato</li>
                <li>Sostituisci il file <code className="bg-blue-100 px-1 rounded">config.mjs</code> nella root del progetto</li>
                <li>Riavvia il server socket: <code className="bg-blue-100 px-1 rounded">npm run socket</code></li>
                <li>Il tuo quiz sarà pronto per essere utilizzato!</li>
              </ol>
            </div>
          </div>
        </div>

        <div className="flex flex-wrap gap-3">
          <Button
            onClick={downloadConfig}
            className="bg-green-500 hover:bg-green-600"
          >
            📥 Scarica Config
          </Button>
          
          <Button
            onClick={copyToClipboard}
            className="bg-blue-500 hover:bg-blue-600"
          >
            📋 Copia Config
          </Button>
          
          <Button
            onClick={updateConfigFile}
            disabled={isUpdating}
            className="bg-orange-500 hover:bg-orange-600"
          >
            {isUpdating ? '🔄 Aggiornamento...' : '⚙️ Aggiorna Auto'}
          </Button>
        </div>

        {updateStatus && (
          <div className={`p-3 rounded-lg ${
            updateStatus === 'success' 
              ? 'bg-green-100 text-green-800 border border-green-200' 
              : 'bg-red-100 text-red-800 border border-red-200'
          }`}>
            {updateStatus === 'success' ? (
              <div className="flex items-center">
                <span className="mr-2">✅</span>
                Configurazione aggiornata con successo! Ricordati di riavviare il server.
              </div>
            ) : (
              <div className="flex items-center">
                <span className="mr-2">❌</span>
                Errore nell'aggiornamento automatico. Usa il download manuale.
              </div>
            )}
          </div>
        )}

        <div className="text-xs text-gray-500">
          <p>Quiz: <span className="font-medium">{quiz.subject}</span></p>
          <p>Domande: <span className="font-medium">{quiz.questions?.length || 0}</span></p>
          <p>Password: <span className="font-medium">{quiz.password}</span></p>
        </div>
      </div>
    </div>
  )
}