import { useState, useEffect, useCallback } from "react"
import { useRouter } from "next/router"
import dynamic from "next/dynamic"
import Button from "@/components/Button"
import { QuizArchive } from "../../utils/quizArchive"
import toast from "react-hot-toast"

// Componente per evitare problemi di hydration
function SmartGameLauncherContent() {
  const router = useRouter()
  const [quizzes, setQuizzes] = useState([])
  const [selectedQuiz, setSelectedQuiz] = useState(null)
  const [isLaunching, setIsLaunching] = useState(false)

  useEffect(() => {
    loadQuizzesFromArchive()
  }, [])

  const loadQuizzesFromArchive = async () => {
    try {
      const data = await QuizArchive.getAllQuizzes()
      setQuizzes(data.quizzes || [])
    } catch (error) {
      toast.error('Errore nel caricamento dei quiz dall\'archivio')
    }
  }

  const getDifficulty = (quiz) => {
    let difficulty = 0
    if (quiz.questions.length > 10) difficulty += 1
    const avgTime = quiz.questions.reduce((sum, q) => sum + (q.time || 15), 0) / quiz.questions.length
    if (avgTime < 10) difficulty += 1
    const hasImages = quiz.questions.some(q => q.image && q.image.trim() !== '')
    if (hasImages) difficulty += 1
    if (difficulty >= 3) return 'Difficile'
    if (difficulty >= 1) return 'Medio'
    return 'Facile'
  }

  const smartLaunch = useCallback(async () => {
    if (!selectedQuiz) {
      toast.error('Seleziona prima un quiz!')
      return
    }

    if (isLaunching) {
      return
    }

    setIsLaunching(true)

    try {
      console.log('LANCIO QUIZ: "' + selectedQuiz.title + '" (ID: ' + selectedQuiz.id + ')')

      toast.loading('1/4 - Configurazione quiz...', { id: 'launch' })
      const response = await fetch('/api/load-quiz', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          quizId: selectedQuiz.id
        })
      })

      if (!response.ok) throw new Error('Errore aggiornamento configurazione')

      toast.loading('2/4 - Ottimizzazione parametri...', { id: 'launch' })
      await new Promise(resolve => setTimeout(resolve, 1000))

      toast.loading('3/4 - Preparazione server...', { id: 'launch' })
      await new Promise(resolve => setTimeout(resolve, 800))

      // Verifica che il quiz sia stato caricato correttamente
      toast.loading('4/5 - Verifica caricamento...', { id: 'launch' })
      try {
        const verifyResponse = await fetch('/api/load-quiz', { method: 'GET' })
        const verifyData = await verifyResponse.json()
        const loadedQuiz = verifyData.quizzes.find(q => q.id === selectedQuiz.id)

        if (!loadedQuiz) {
          throw new Error('Quiz non trovato dopo il caricamento')
        }

        console.log(`✅ Verifica completata: Quiz "${loadedQuiz.title}" caricato correttamente`)
      } catch (verifyError) {
        console.warn('⚠️ Errore verifica:', verifyError)
      }

      toast.loading('5/5 - Avvio gioco...', { id: 'launch' })
      await new Promise(resolve => setTimeout(resolve, 500))

      toast.success('Gioco lanciato con successo!', { id: 'launch' })

      localStorage.setItem('current-game-quiz', JSON.stringify(selectedQuiz))

      // Force server restart per assicurare il caricamento corretto
      try {
        await fetch('/api/restart-server', { method: 'POST' })
        console.log('✅ Server socket riavviato automaticamente')
      } catch (error) {
        console.warn('⚠️ Impossibile riavviare server automaticamente:', error)
      }

      const confirmLaunch = confirm(
        'Quiz "' + selectedQuiz.title + '" configurato con successo!\n\n' +
        'Istruzioni:\n' +
        '1. Accedi al Manager del gioco\n' +
        '2. Ottieni il PIN numerico\n' +
        '3. Condividi il PIN con gli studenti\n' +
        '4. Gestisci il gioco dalla dashboard\n\n' +
        '✅ Server riavviato automaticamente per garantire il quiz corretto\n\n' +
        'Vuoi andare al Manager ora?'
      )

      if (confirmLaunch) {
        router.push('/manager')
      }
    } catch (error) {
      console.error('Errore durante il lancio:', error)
      toast.error('Errore durante il lancio del quiz. Riprova.', { id: 'launch' })
    } finally {
      setTimeout(() => {
        setIsLaunching(false)
      }, 100)
    }
  }, [selectedQuiz, isLaunching, router])

  return (
    <div className="space-y-6">
      <div className="sm:flex sm:items-center sm:justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Lancio Quiz Intelligente</h2>
          <p className="text-gray-600">
            Sistema semplificato: seleziona un quiz e clicca "Lancia". Il resto è automatico!
          </p>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-md p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">
          1. Seleziona Quiz
        </h3>

        {quizzes.length === 0 ? (
          <div className="text-center py-8">
            <div className="text-gray-400 text-4xl mb-4">📝</div>
            <p className="text-gray-500 mb-4">Nessun quiz disponibile nell'archivio</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Quiz
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Materia
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Domande
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Difficoltà
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Azione
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {quizzes.map((quiz) => (
                  <tr
                    key={quiz.id}
                    className={selectedQuiz && selectedQuiz.id === quiz.id ? 'bg-blue-50' : 'hover:bg-gray-50'}
                  >
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div>
                        <div className="text-sm font-medium text-gray-900">
                          {quiz.title}
                        </div>
                        <div className="text-sm text-gray-500">
                          {quiz.description || 'Nessuna descrizione'}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                        {quiz.subject}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {quiz.questions.length}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        getDifficulty(quiz) === 'Facile' ? 'bg-green-100 text-green-800' :
                        getDifficulty(quiz) === 'Medio' ? 'bg-yellow-100 text-yellow-800' :
                        'bg-red-100 text-red-800'
                      }`}>
                        {getDifficulty(quiz)}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <button
                        onClick={() => setSelectedQuiz(quiz)}
                        className={`inline-flex items-center px-3 py-1.5 border text-sm font-medium rounded-md transition-colors ${
                          selectedQuiz && selectedQuiz.id === quiz.id
                            ? 'border-blue-500 text-blue-700 bg-blue-50 hover:bg-blue-100'
                            : 'border-gray-300 text-gray-700 bg-white hover:bg-gray-50'
                        }`}
                      >
                        {selectedQuiz && selectedQuiz.id === quiz.id ? 'Selezionato' : 'Seleziona'}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {selectedQuiz && (
        <div className="bg-white rounded-lg shadow-md p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            2. Lancio Automatico
          </h3>

          <div className="bg-gradient-to-r from-green-50 to-blue-50 rounded-lg p-6 border border-green-200">
            <div className="text-center">
              <div className="text-green-600 text-4xl mb-3">⚡</div>
              <h4 className="text-lg font-semibold text-gray-900 mb-2">
                Quiz Selezionato: {selectedQuiz.title}
              </h4>
              <p className="text-gray-600 mb-4">
                Il sistema configurerà automaticamente tutto in 4 passaggi:
              </p>

              <div className="bg-blue-50 rounded-lg p-4 mb-6">
                <h5 className="font-medium text-blue-900 mb-2">Dettagli Quiz:</h5>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                  <div>
                    <span className="text-blue-600">Materia:</span>
                    <div className="font-medium">{selectedQuiz.subject}</div>
                  </div>
                  <div>
                    <span className="text-blue-600">Domande:</span>
                    <div className="font-medium">{selectedQuiz.questions.length}</div>
                  </div>
                  <div>
                    <span className="text-blue-600">Difficoltà:</span>
                    <div className="font-medium">{getDifficulty(selectedQuiz)}</div>
                  </div>
                </div>
              </div>

              <button
                onClick={smartLaunch}
                disabled={isLaunching}
                className="bg-gradient-to-r from-green-600 to-blue-600 hover:from-green-700 hover:to-blue-700 text-white px-8 py-3 text-lg font-semibold rounded-lg transition-all transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed"
                type="button"
              >
                {isLaunching ? (
                  <div className="flex items-center">
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                    Configurazione in corso...
                  </div>
                ) : (
                  <div className="flex items-center">
                    <span className="mr-2">🚀</span>
                    Lancia Quiz Automatico
                  </div>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

// Esporta il componente con dynamic import per evitare SSR
const SmartGameLauncher = dynamic(() => Promise.resolve(SmartGameLauncherContent), {
  ssr: false,
  loading: () => (
    <div className="space-y-6">
      <div className="sm:flex sm:items-center sm:justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Lancio Quiz Intelligente</h2>
          <p className="text-gray-600">Caricamento componente...</p>
        </div>
      </div>
    </div>
  )
})

export default SmartGameLauncher