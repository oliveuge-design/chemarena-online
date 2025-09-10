import { useState, useEffect } from "react"
import { useRouter } from "next/router"
import Button from "@/components/Button"
import ConfigUpdater from "./ConfigUpdater"
import { QuizArchive } from "../../utils/quizArchive"
import toast from "react-hot-toast"

export default function GameLauncher() {
  const router = useRouter()
  const [quizzes, setQuizzes] = useState([])
  const [selectedQuiz, setSelectedQuiz] = useState(null)
  const [gameSettings, setGameSettings] = useState({
    password: '',
    allowLateJoin: true,
    showLeaderboardBetweenQuestions: true,
    shuffleQuestions: false,
    shuffleAnswers: false
  })
  const [currentGameQuiz, setCurrentGameQuiz] = useState(null)
  const [configStatus, setConfigStatus] = useState('unknown') // 'unknown', 'updated', 'needs-update'

  useEffect(() => {
    loadQuizzesFromArchive()
    
    // Carica il quiz attualmente impostato per il gioco
    const currentQuiz = JSON.parse(localStorage.getItem('current-game-quiz') || 'null')
    setCurrentGameQuiz(currentQuiz)
    if (currentQuiz) {
      setSelectedQuiz(currentQuiz)
      setGameSettings(prev => ({ ...prev, password: currentQuiz.password }))
    }
    
    // Controlla lo stato della configurazione
    checkConfigStatus()
  }, [])

  const loadQuizzesFromArchive = async () => {
    try {
      const data = await QuizArchive.getAllQuizzes()
      setQuizzes(data.quizzes || [])
    } catch (error) {
      toast.error('Errore nel caricamento dei quiz dall\'archivio')
    }
  }

  const checkConfigStatus = () => {
    const lastUpdate = localStorage.getItem('last-config-update')
    const lastGameSettings = localStorage.getItem('game-settings')
    const currentGameQuizStored = localStorage.getItem('current-game-quiz')
    
    if (!lastUpdate || !currentGameQuizStored) {
      setConfigStatus('unknown')
      return
    }
    
    if (selectedQuiz && gameSettings) {
      const needsUpdate = (
        JSON.stringify(selectedQuiz) !== currentGameQuizStored ||
        JSON.stringify(gameSettings) !== lastGameSettings
      )
      
      setConfigStatus(needsUpdate ? 'needs-update' : 'updated')
    }
  }

  const handleQuizSelection = (quiz) => {
    setSelectedQuiz(quiz)
    setGameSettings(prev => ({ ...prev, password: quiz.password }))
    
    // Salva come quiz attivo
    localStorage.setItem('current-game-quiz', JSON.stringify(quiz))
    setCurrentGameQuiz(quiz)
    
    // Aggiorna lo stato della configurazione
    setTimeout(checkConfigStatus, 100)
  }

  const updateGameConfig = async () => {
    if (!selectedQuiz) {
      toast.error('Seleziona prima un quiz!')
      return
    }

    try {
      console.log('Aggiornamento configurazione in corso...')
      
      // Usa la nuova API per caricare il quiz nel config
      const response = await fetch('/api/load-quiz', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          quizId: selectedQuiz.id,
          password: gameSettings.password
        }),
      })

      const data = await response.json()

      if (response.ok) {
        // Salva nel localStorage per riferimento
        localStorage.setItem('current-game-quiz', JSON.stringify(selectedQuiz))
        localStorage.setItem('game-settings', JSON.stringify(gameSettings))
        localStorage.setItem('last-config-update', new Date().toISOString())
        
        // Aggiorna lo stato
        setConfigStatus('updated')
        
        toast.success(`Quiz "${data.quiz}" caricato nel gioco!`)
      } else {
        toast.error('Errore: ' + data.error)
      }

    } catch (error) {
      console.error('Errore durante l\'aggiornamento:', error)
      toast.error('Errore durante l\'aggiornamento della configurazione')
    }
  }

  const launchGame = async () => {
    if (!selectedQuiz) {
      alert('Seleziona prima un quiz!')
      return
    }

    // Controlla se è necessario aggiornare la configurazione
    const lastUpdate = localStorage.getItem('last-config-update')
    const lastGameSettings = localStorage.getItem('game-settings')
    const currentGameQuiz = localStorage.getItem('current-game-quiz')
    
    const needsUpdate = (
      !lastUpdate ||
      !currentGameQuiz ||
      JSON.stringify(selectedQuiz) !== currentGameQuiz ||
      JSON.stringify(gameSettings) !== lastGameSettings
    )

    if (needsUpdate) {
      const confirmUpdate = confirm(
        '🔄 Il quiz o le impostazioni sono cambiate.\n\nVuoi aggiornare la configurazione del server prima di lanciare il gioco?'
      )
      
      if (confirmUpdate) {
        await updateGameConfig()
      }
    }

    // Salva il quiz attivo
    localStorage.setItem('current-game-quiz', JSON.stringify(selectedQuiz))
    localStorage.setItem('game-settings', JSON.stringify(gameSettings))

    // Vai alla pagina manager
    const confirmManager = confirm(
      `🚀 Pronto per lanciare il gioco!\n\n🔑 Password quiz: ${gameSettings.password}\n\nVuoi andare alla:\n` +
      `👨‍🏫 Pagina MANAGER (per gestire il gioco) - OK\n` +
      `👥 Pagina STUDENTI (per testare come studente) - Annulla`
    )
    
    if (confirmManager) {
      alert(`📋 Istruzioni per l'insegnante:\n\n1. Inserisci la password: ${gameSettings.password}\n2. Ottieni il PIN numerico\n3. Condividi il PIN con gli studenti\n4. Gestisci il gioco dalla dashboard`)
      router.push('/manager')
    } else {
      alert(`📋 Modalità studente:\n\nInserisci il PIN numerico che ti darà l'insegnante per partecipare al quiz.`)
      router.push('/')
    }
  }

  const previewQuiz = (quiz) => {
    const totalTime = quiz.questions.reduce((sum, q) => sum + (q.time || 15) + (q.cooldown || 5), 0)
    const minutes = Math.floor(totalTime / 60)
    const seconds = totalTime % 60
    
    return {
      duration: `${minutes}m ${seconds}s`,
      questionsCount: quiz.questions.length,
      averageTime: Math.round(quiz.questions.reduce((sum, q) => sum + (q.time || 15), 0) / quiz.questions.length),
      hasImages: quiz.questions.some(q => q.image)
    }
  }

  return (
    <div className="space-y-6">
      <div className="sm:flex sm:items-center sm:justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Lancia un Nuovo Gioco</h2>
          <p className="text-gray-600">
            Configura e avvia un quiz per i tuoi studenti
          </p>
        </div>
        <div className="mt-4 sm:mt-0">
          {configStatus === 'updated' && (
            <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-green-100 text-green-800">
              ✅ Configurazione Aggiornata
            </span>
          )}
          {configStatus === 'needs-update' && (
            <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-yellow-100 text-yellow-800">
              ⚠️ Richiede Aggiornamento
            </span>
          )}
          {configStatus === 'unknown' && (
            <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-gray-100 text-gray-800">
              ❓ Stato Sconosciuto
            </span>
          )}
        </div>
      </div>

      {/* Selezione Quiz */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">
          1. Seleziona Quiz
          {currentGameQuiz && (
            <span className="ml-2 text-sm font-normal text-green-600">
              (Attivo: {currentGameQuiz.subject})
            </span>
          )}
        </h3>
        
        {quizzes.length === 0 ? (
          <div className="text-center py-8">
            <div className="text-4xl mb-2">📝</div>
            <p className="text-gray-600 mb-4">Nessun quiz disponibile nell'archivio</p>
            <Button onClick={() => {
              router.push('/dashboard')
              // Imposta il tab archivio per creare un nuovo quiz
              setTimeout(() => {
                const event = new CustomEvent('setDashboardTab', { detail: 'archive' })
                window.dispatchEvent(event)
              }, 100)
            }}>
              Vai all'Archivio Quiz
            </Button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {quizzes.map((quiz) => {
              const preview = previewQuiz(quiz)
              const isSelected = selectedQuiz && selectedQuiz.id === quiz.id
              
              return (
                <div
                  key={quiz.id}
                  className={`border rounded-lg p-4 cursor-pointer transition-all ${
                    isSelected 
                      ? 'border-blue-500 bg-blue-50' 
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                  onClick={() => handleQuizSelection(quiz)}
                >
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="font-medium text-gray-900 truncate">
                      {quiz.title}
                    </h4>
                    {isSelected && <span className="text-blue-500">✓</span>}
                  </div>
                  <p className="text-sm text-gray-500 mb-2">{quiz.subject}</p>
                  
                  <div className="space-y-1 text-sm text-gray-600">
                    <div className="flex justify-between">
                      <span>Domande:</span>
                      <span>{preview.questionsCount}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Durata:</span>
                      <span>{preview.duration}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Tempo medio:</span>
                      <span>{preview.averageTime}s</span>
                    </div>
                    {preview.hasImages && (
                      <div className="flex items-center text-purple-600">
                        <span className="mr-1">📸</span>
                        <span>Con immagini</span>
                      </div>
                    )}
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </div>

      {/* Impostazioni Gioco */}
      {selectedQuiz && (
        <div className="bg-white rounded-lg shadow-md p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            2. Configurazione Gioco
          </h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Password Gioco
              </label>
              <input
                type="text"
                value={gameSettings.password}
                onChange={(e) => {
                  setGameSettings(prev => ({ ...prev, password: e.target.value }))
                  setTimeout(checkConfigStatus, 100)
                }}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="Inserisci password per gli studenti"
              />
            </div>

            <div className="space-y-4">
              <label className="flex items-center">
                <input
                  type="checkbox"
                  checked={gameSettings.allowLateJoin}
                  onChange={(e) => {
                    setGameSettings(prev => ({ ...prev, allowLateJoin: e.target.checked }))
                    setTimeout(checkConfigStatus, 100)
                  }}
                  className="mr-2"
                />
                <span className="text-sm text-gray-700">Consenti accesso tardivo</span>
              </label>

              <label className="flex items-center">
                <input
                  type="checkbox"
                  checked={gameSettings.showLeaderboardBetweenQuestions}
                  onChange={(e) => {
                    setGameSettings(prev => ({ ...prev, showLeaderboardBetweenQuestions: e.target.checked }))
                    setTimeout(checkConfigStatus, 100)
                  }}
                  className="mr-2"
                />
                <span className="text-sm text-gray-700">Mostra classifica tra le domande</span>
              </label>

              <label className="flex items-center">
                <input
                  type="checkbox"
                  checked={gameSettings.shuffleQuestions}
                  onChange={(e) => {
                    setGameSettings(prev => ({ ...prev, shuffleQuestions: e.target.checked }))
                    setTimeout(checkConfigStatus, 100)
                  }}
                  className="mr-2"
                />
                <span className="text-sm text-gray-700">Mescola ordine domande</span>
              </label>

              <label className="flex items-center">
                <input
                  type="checkbox"
                  checked={gameSettings.shuffleAnswers}
                  onChange={(e) => {
                    setGameSettings(prev => ({ ...prev, shuffleAnswers: e.target.checked }))
                    setTimeout(checkConfigStatus, 100)
                  }}
                  className="mr-2"
                />
                <span className="text-sm text-gray-700">Mescola ordine risposte</span>
              </label>
            </div>
          </div>
        </div>
      )}

      {/* Anteprima e Lancio */}
      {selectedQuiz && (
        <div className="bg-white rounded-lg shadow-md p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            3. Anteprima e Lancio
          </h3>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div>
              <h4 className="font-medium text-gray-900 mb-3">Riepilogo Quiz:</h4>
              <div className="bg-gray-50 rounded-lg p-4 space-y-2 text-sm">
                <div className="flex justify-between">
                  <span>Titolo:</span>
                  <span className="font-medium">{selectedQuiz.title}</span>
                </div>
                <div className="flex justify-between">
                  <span>Materia:</span>
                  <span className="font-medium">{selectedQuiz.subject}</span>
                </div>
                <div className="flex justify-between">
                  <span>Password:</span>
                  <span className="font-medium">{gameSettings.password}</span>
                </div>
                <div className="flex justify-between">
                  <span>Domande:</span>
                  <span>{selectedQuiz.questions.length}</span>
                </div>
                <div className="flex justify-between">
                  <span>Durata stimata:</span>
                  <span>{previewQuiz(selectedQuiz).duration}</span>
                </div>
              </div>
            </div>

            <div>
              <h4 className="font-medium text-gray-900 mb-3">Istruzioni:</h4>
              <div className="space-y-2 text-sm text-gray-600">
                <div className="flex items-start">
                  <span className="mr-2">1.</span>
                  <span>Clicca "Aggiorna Configurazione" per salvare le impostazioni</span>
                </div>
                <div className="flex items-start">
                  <span className="mr-2">2.</span>
                  <span>Riavvia il server se necessario</span>
                </div>
                <div className="flex items-start">
                  <span className="mr-2">3.</span>
                  <span>Clicca "Lancia Gioco" per iniziare</span>
                </div>
                <div className="flex items-start">
                  <span className="mr-2">4.</span>
                  <span>Condividi la password con gli studenti</span>
                </div>
              </div>
            </div>
          </div>

          <div className="flex space-x-4 mt-6">
            <Button 
              onClick={updateGameConfig}
              className="bg-blue-500 hover:bg-blue-600"
            >
              ⚙️ Aggiorna Configurazione
            </Button>
            <Button 
              onClick={launchGame}
              className="bg-green-500 hover:bg-green-600"
            >
              🚀 Lancia Gioco
            </Button>
          </div>
        </div>
      )}

      {/* Config Updater */}
      {selectedQuiz && (
        <ConfigUpdater 
          quiz={{
            ...selectedQuiz,
            password: gameSettings.password,
            questions: gameSettings.shuffleQuestions 
              ? [...selectedQuiz.questions].sort(() => Math.random() - 0.5)
              : selectedQuiz.questions
          }}
          onConfigUpdate={(config) => {
            console.log('Configurazione aggiornata:', config)
          }}
        />
      )}

      {/* Informazioni Stato */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <div className="flex items-start">
            <div className="text-blue-500 mr-2">ℹ️</div>
            <div className="text-sm">
              <p className="font-medium text-blue-900 mb-1">Configurazione Intelligente</p>
              <p className="text-blue-700 text-xs">
                Il sistema rileva automaticamente se il quiz è cambiato e aggiorna solo quando necessario.
              </p>
            </div>
          </div>
        </div>
        
        <div className="bg-green-50 border border-green-200 rounded-lg p-4">
          <div className="flex items-start">
            <div className="text-green-500 mr-2">🎯</div>
            <div className="text-sm">
              <p className="font-medium text-green-900 mb-1">Lancio Rapido</p>
              <p className="text-green-700 text-xs">
                Clicca "Lancia Gioco" per andare direttamente al gioco con le impostazioni correnti.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}