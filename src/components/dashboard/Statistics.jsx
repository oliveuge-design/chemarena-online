import { useState, useEffect } from "react"
import Button from "@/components/Button"

export default function Statistics() {
  const [gameHistory, setGameHistory] = useState([])
  const [selectedGame, setSelectedGame] = useState(null)
  const [stats, setStats] = useState({
    totalGames: 0,
    totalPlayers: 0,
    averageScore: 0,
    mostPlayedQuiz: null,
    bestPerformance: null
  })

  useEffect(() => {
    // Carica la cronologia dei giochi dal localStorage
    const history = JSON.parse(localStorage.getItem('rahoot-game-history') || '[]')
    setGameHistory(history)
    calculateStats(history)
  }, [])

  const calculateStats = (history) => {
    if (history.length === 0) return

    const totalGames = history.length
    const totalPlayers = history.reduce((sum, game) => sum + (game.players?.length || 0), 0)
    const totalScores = history.reduce((sum, game) => {
      return sum + (game.players?.reduce((playerSum, player) => playerSum + (player.score || 0), 0) || 0)
    }, 0)
    const averageScore = totalPlayers > 0 ? Math.round(totalScores / totalPlayers) : 0

    // Quiz più giocato
    const quizCounts = {}
    history.forEach(game => {
      const quizName = game.quizSubject || 'Quiz Sconosciuto'
      quizCounts[quizName] = (quizCounts[quizName] || 0) + 1
    })
    const mostPlayedQuiz = Object.keys(quizCounts).length > 0 
      ? Object.entries(quizCounts).reduce((a, b) => quizCounts[a[0]] > quizCounts[b[0]] ? a : b)[0]
      : null

    // Migliore performance
    let bestPerformance = null
    history.forEach(game => {
      if (game.players && game.players.length > 0) {
        const topPlayer = game.players.reduce((best, player) => 
          (player.score || 0) > (best.score || 0) ? player : best
        )
        if (!bestPerformance || topPlayer.score > bestPerformance.score) {
          bestPerformance = {
            ...topPlayer,
            quizSubject: game.quizSubject,
            date: game.date
          }
        }
      }
    })

    setStats({
      totalGames,
      totalPlayers,
      averageScore,
      mostPlayedQuiz,
      bestPerformance
    })
  }

  const exportData = () => {
    const data = {
      gameHistory,
      statistics: stats,
      exportDate: new Date().toISOString()
    }
    
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `rahoot-statistics-${new Date().toISOString().split('T')[0]}.json`
    a.click()
    URL.revokeObjectURL(url)
  }

  const clearHistory = () => {
    if (confirm('Sei sicuro di voler cancellare tutta la cronologia? Questa azione non può essere annullata.')) {
      localStorage.removeItem('rahoot-game-history')
      setGameHistory([])
      setStats({
        totalGames: 0,
        totalPlayers: 0,
        averageScore: 0,
        mostPlayedQuiz: null,
        bestPerformance: null
      })
    }
  }

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleString('it-IT', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  const getScoreColor = (score, maxScore) => {
    const percentage = (score / maxScore) * 100
    if (percentage >= 80) return 'text-green-600 bg-green-100'
    if (percentage >= 60) return 'text-yellow-600 bg-yellow-100'
    return 'text-red-600 bg-red-100'
  }

  return (
    <div className="space-y-6">
      <div className="sm:flex sm:items-center sm:justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Statistiche e Report</h2>
          <p className="mt-1 text-sm text-gray-600">
            Analizza le performance dei tuoi quiz e degli studenti
          </p>
        </div>
        <div className="mt-4 sm:mt-0 flex space-x-3">
          <Button onClick={exportData} className="bg-blue-500 hover:bg-blue-600">
            📊 Esporta Dati
          </Button>
          <Button onClick={clearHistory} className="bg-red-500 hover:bg-red-600">
            🗑️ Cancella Cronologia
          </Button>
        </div>
      </div>

      {/* Statistiche Generali */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center">
            <div className="text-3xl mr-3">🎮</div>
            <div>
              <p className="text-2xl font-bold text-gray-900">{stats.totalGames}</p>
              <p className="text-sm text-gray-600">Giochi Totali</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center">
            <div className="text-3xl mr-3">👥</div>
            <div>
              <p className="text-2xl font-bold text-gray-900">{stats.totalPlayers}</p>
              <p className="text-sm text-gray-600">Giocatori Totali</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center">
            <div className="text-3xl mr-3">📈</div>
            <div>
              <p className="text-2xl font-bold text-gray-900">{stats.averageScore}</p>
              <p className="text-sm text-gray-600">Punteggio Medio</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center">
            <div className="text-3xl mr-3">🏆</div>
            <div>
              <p className="text-lg font-bold text-gray-900 truncate">
                {stats.mostPlayedQuiz || 'N/A'}
              </p>
              <p className="text-sm text-gray-600">Quiz Più Popolare</p>
            </div>
          </div>
        </div>
      </div>

      {/* Migliore Performance */}
      {stats.bestPerformance && (
        <div className="bg-gradient-to-r from-yellow-400 to-orange-500 rounded-lg shadow-md p-6 text-white">
          <h3 className="text-lg font-semibold mb-2">🌟 Record Assoluto</h3>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xl font-bold">{stats.bestPerformance.name}</p>
              <p className="opacity-90">{stats.bestPerformance.quizSubject}</p>
              <p className="text-sm opacity-75">
                {formatDate(stats.bestPerformance.date)}
              </p>
            </div>
            <div className="text-3xl font-bold">
              {stats.bestPerformance.score} pts
            </div>
          </div>
        </div>
      )}

      {/* Cronologia Giochi */}
      <div className="bg-white rounded-lg shadow-md">
        <div className="px-6 py-4 border-b border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900">
            Cronologia Giochi ({gameHistory.length})
          </h3>
        </div>
        
        {gameHistory.length === 0 ? (
          <div className="p-6 text-center">
            <div className="text-6xl mb-4">📊</div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">Nessun dato disponibile</h3>
            <p className="text-gray-600">
              Inizia a giocare per vedere le statistiche qui!
            </p>
          </div>
        ) : (
          <div className="divide-y divide-gray-200">
            {gameHistory.slice().reverse().map((game, index) => (
              <div key={index} className="p-6 hover:bg-gray-50">
                <div className="flex items-center justify-between mb-3">
                  <div>
                    <h4 className="text-lg font-medium text-gray-900">
                      {game.quizSubject || 'Quiz Sconosciuto'}
                    </h4>
                    <p className="text-sm text-gray-600">
                      {formatDate(game.date)} • {game.players?.length || 0} giocatori
                    </p>
                  </div>
                  <Button
                    onClick={() => setSelectedGame(selectedGame === game ? null : game)}
                    className="bg-gray-100 hover:bg-gray-200 text-gray-700 text-sm"
                  >
                    {selectedGame === game ? 'Nascondi' : 'Dettagli'}
                  </Button>
                </div>

                {selectedGame === game && (
                  <div className="mt-4 bg-gray-50 rounded-lg p-4">
                    <h5 className="font-medium text-gray-900 mb-3">Classifica Finale:</h5>
                    <div className="space-y-2">
                      {game.players
                        ?.sort((a, b) => (b.score || 0) - (a.score || 0))
                        .map((player, playerIndex) => (
                          <div 
                            key={playerIndex}
                            className="flex items-center justify-between p-2 bg-white rounded border"
                          >
                            <div className="flex items-center space-x-3">
                              <span className="text-lg">
                                {playerIndex === 0 ? '🥇' : playerIndex === 1 ? '🥈' : playerIndex === 2 ? '🥉' : ''}
                              </span>
                              <span className="font-medium">{player.name}</span>
                            </div>
                            <span className={`px-2 py-1 rounded text-sm font-medium ${
                              getScoreColor(player.score || 0, game.maxScore || 1000)
                            }`}>
                              {player.score || 0} pts
                            </span>
                          </div>
                        ))}
                    </div>
                    
                    {game.questionStats && (
                      <div className="mt-4">
                        <h6 className="font-medium text-gray-900 mb-2">Statistiche Domande:</h6>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm">
                          {game.questionStats.map((stat, qIndex) => (
                            <div key={qIndex} className="flex justify-between p-2 bg-white rounded">
                              <span>Domanda {qIndex + 1}</span>
                              <span className="text-green-600">
                                {Math.round((stat.correct / stat.total) * 100)}% corrette
                              </span>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}