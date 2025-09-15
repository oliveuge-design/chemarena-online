import { useState, useEffect } from "react"
import { getAvailableThemes } from "@/components/BackgroundManager"

export default function ThemeCustomizer() {
  const [quizzes, setQuizzes] = useState([])
  const [themePreferences, setThemePreferences] = useState({})
  const [previewQuiz, setPreviewQuiz] = useState(null)
  const [isLoading, setIsLoading] = useState(true)
  const [savedStatus, setSavedStatus] = useState("")

  const themes = getAvailableThemes()

  // Carica quiz e preferenze salvate
  useEffect(() => {
    loadQuizzes()
    loadThemePreferences()
  }, [])

  const loadQuizzes = async () => {
    try {
      const response = await fetch('/api/quiz-archive')
      const data = await response.json()
      setQuizzes(data.quizzes || [])
    } catch (error) {
      console.error('Errore caricamento quiz:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const loadThemePreferences = () => {
    try {
      const saved = localStorage.getItem('quiz-theme-preferences')
      if (saved) {
        setThemePreferences(JSON.parse(saved))
      }
    } catch (error) {
      console.error('Errore caricamento preferenze:', error)
    }
  }

  const saveThemePreferences = (prefs) => {
    try {
      localStorage.setItem('quiz-theme-preferences', JSON.stringify(prefs))
      setThemePreferences(prefs)
      setSavedStatus("✅ Preferenze salvate!")
      setTimeout(() => setSavedStatus(""), 3000)
    } catch (error) {
      console.error('Errore salvataggio:', error)
      setSavedStatus("❌ Errore salvataggio")
      setTimeout(() => setSavedStatus(""), 3000)
    }
  }

  const updateQuizTheme = (quizId, themeId) => {
    const newPrefs = {
      ...themePreferences,
      [quizId]: themeId
    }
    saveThemePreferences(newPrefs)
  }

  const resetAllToDefault = () => {
    if (confirm('Vuoi resettare tutti i quiz al tema di default (laboratorio)?')) {
      saveThemePreferences({})
    }
  }

  const applyThemeToAll = (themeId) => {
    if (confirm(`Vuoi applicare il tema "${themes.find(t => t.id === themeId)?.name}" a tutti i quiz?`)) {
      const newPrefs = {}
      quizzes.forEach(quiz => {
        newPrefs[quiz.id] = themeId
      })
      saveThemePreferences(newPrefs)
    }
  }

  const getThemeStats = () => {
    const stats = {}
    themes.forEach(theme => {
      stats[theme.id] = 0
    })

    Object.values(themePreferences).forEach(themeId => {
      if (stats[themeId] !== undefined) {
        stats[themeId]++
      }
    })

    const total = quizzes.length
    const customized = Object.keys(themePreferences).length
    const defaulted = total - customized

    return { stats, total, customized, defaulted }
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-blue-500/30 border-t-blue-500 rounded-full animate-spin mb-4"></div>
          <p className="text-gray-600">Caricamento quiz...</p>
        </div>
      </div>
    )
  }

  const { stats, total, customized, defaulted } = getThemeStats()

  return (
    <div className="space-y-6">
      {/* Header e statistiche */}
      <div className="bg-white rounded-lg shadow p-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 mb-2">
              🎨 Personalizzazione Sfondi
            </h1>
            <p className="text-gray-600">
              Associa sfondi diversi ai tuoi quiz per creare esperienze uniche
            </p>
          </div>

          {savedStatus && (
            <div className="px-4 py-2 bg-green-100 border border-green-300 rounded-lg text-green-800 font-medium">
              {savedStatus}
            </div>
          )}
        </div>

        {/* Statistiche utilizzo temi */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          <div className="text-center p-4 bg-blue-50 rounded-lg border border-blue-200">
            <div className="text-2xl font-bold text-blue-600">{total}</div>
            <div className="text-sm text-blue-700">Quiz Totali</div>
          </div>
          <div className="text-center p-4 bg-green-50 rounded-lg border border-green-200">
            <div className="text-2xl font-bold text-green-600">{customized}</div>
            <div className="text-sm text-green-700">Personalizzati</div>
          </div>
          <div className="text-center p-4 bg-gray-50 rounded-lg border border-gray-200">
            <div className="text-2xl font-bold text-gray-600">{defaulted}</div>
            <div className="text-sm text-gray-700">Predefiniti</div>
          </div>
          <div className="text-center p-4 bg-purple-50 rounded-lg border border-purple-200">
            <div className="text-2xl font-bold text-purple-600">
              {Math.round((customized / total) * 100)}%
            </div>
            <div className="text-sm text-purple-700">Personalizzazione</div>
          </div>
        </div>

        {/* Azioni rapide */}
        <div className="flex flex-wrap gap-3">
          <button
            onClick={resetAllToDefault}
            className="px-4 py-2 bg-gray-500 hover:bg-gray-600 text-white rounded-lg font-medium transition-colors"
          >
            🔄 Reset Tutti
          </button>

          {themes.map(theme => (
            <button
              key={theme.id}
              onClick={() => applyThemeToAll(theme.id)}
              className="px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg font-medium transition-colors text-sm"
              title={`Applica ${theme.name} a tutti i quiz`}
            >
              🎨 Tutti → {theme.name}
            </button>
          ))}
        </div>
      </div>

      {/* Lista quiz con selezione temi */}
      <div className="bg-white rounded-lg shadow">
        <div className="p-6 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-gray-900 mb-2">
            Quiz e Temi Associati
          </h2>
          <p className="text-sm text-gray-600">
            Clicca su un tema per vedere l'anteprima, poi seleziona quello desiderato per ogni quiz
          </p>
        </div>

        <div className="divide-y divide-gray-200">
          {quizzes.map((quiz) => (
            <div key={quiz.id} className="p-6">
              {/* Info quiz */}
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <h3 className="text-lg font-medium text-gray-900">
                      {quiz.title}
                    </h3>
                    <span className="px-2 py-1 text-xs font-medium bg-blue-100 text-blue-800 rounded-full">
                      {quiz.subject}
                    </span>
                  </div>
                  <div className="text-sm text-gray-600 space-x-4">
                    <span>📝 {quiz.questions?.length || 0} domande</span>
                    <span>👤 {quiz.author}</span>
                    <span>📅 {quiz.created}</span>
                  </div>
                </div>

                {/* Tema corrente */}
                <div className="text-right">
                  <div className="text-sm text-gray-500 mb-1">Tema attuale:</div>
                  <div className="font-medium text-gray-900">
                    {themePreferences[quiz.id]
                      ? themes.find(t => t.id === themePreferences[quiz.id])?.name
                      : "🏭 Laboratorio (Default)"}
                  </div>
                </div>
              </div>

              {/* Selezione temi */}
              <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
                {themes.map((theme) => (
                  <div
                    key={theme.id}
                    className={`relative cursor-pointer rounded-lg overflow-hidden transition-all duration-200 ${
                      themePreferences[quiz.id] === theme.id
                        ? 'ring-3 ring-blue-500 scale-105'
                        : 'hover:scale-102 hover:ring-2 hover:ring-gray-300'
                    }`}
                    onClick={() => updateQuizTheme(quiz.id, theme.id)}
                    title={`${theme.name} - ${theme.description}`}
                  >
                    {/* Preview thumbnail (riuso logica BackgroundSelector) */}
                    <div className="aspect-video bg-gradient-to-br from-gray-800 via-gray-700 to-gray-900 relative overflow-hidden">
                      {/* Laboratory preview */}
                      {theme.id === 'laboratory' && (
                        <div className="absolute inset-0 bg-gradient-to-b from-blue-900/50 via-purple-900/50 to-blue-800/50">
                          <div className="absolute top-1 left-1 w-2 h-2 rounded-full bg-green-400 animate-pulse"></div>
                          <div className="absolute top-2 right-2 w-1 h-1 rounded-full bg-blue-400 animate-ping"></div>
                        </div>
                      )}

                      {/* Gaming previews */}
                      {theme.id.startsWith('gaming') && (
                        <div className="absolute inset-0 bg-gradient-to-br from-orange-900/60 via-gray-900 to-orange-800/40">
                          <div className="absolute top-1 left-1 right-1 h-px bg-orange-400/50"></div>
                          <div className="absolute bottom-1 left-1 right-1 h-px bg-orange-400/30"></div>
                        </div>
                      )}

                      {/* Selection indicator */}
                      {themePreferences[quiz.id] === theme.id && (
                        <div className="absolute inset-0 bg-blue-500/20 flex items-center justify-center">
                          <div className="w-6 h-6 rounded-full bg-blue-500 flex items-center justify-center">
                            <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                              <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                            </svg>
                          </div>
                        </div>
                      )}
                    </div>

                    {/* Theme name */}
                    <div className="p-2 bg-gray-900/90 text-center">
                      <div className="text-white text-xs font-medium truncate">
                        {theme.name}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Preview section */}
      {previewQuiz && (
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">
            🔍 Anteprima Tema
          </h2>
          <p className="text-gray-600 mb-4">
            Quiz: <strong>{previewQuiz.title}</strong> con tema <strong>{themes.find(t => t.id === themePreferences[previewQuiz.id])?.name}</strong>
          </p>
          <div className="bg-gray-100 rounded-lg p-4 text-center text-gray-600">
            Anteprima live sarà disponibile nella prossima versione
          </div>
        </div>
      )}

      {/* Statistiche utilizzo per tema */}
      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">
          📊 Utilizzo Temi
        </h2>
        <div className="space-y-3">
          {themes.map(theme => {
            const count = stats[theme.id] || 0
            const percentage = total > 0 ? (count / total) * 100 : 0

            return (
              <div key={theme.id} className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div
                    className="w-4 h-4 rounded border border-gray-300"
                    style={{ backgroundColor: theme.colors.primary }}
                  ></div>
                  <span className="font-medium text-gray-700">{theme.name}</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-32 bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-blue-500 h-2 rounded-full"
                      style={{ width: `${percentage}%` }}
                    ></div>
                  </div>
                  <span className="text-sm font-medium text-gray-600 w-12 text-right">
                    {count}/{total}
                  </span>
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}