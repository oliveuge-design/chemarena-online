// Utility per salvare le statistiche dei giochi nel browser
// Questo file verrà caricato dal client per salvare i dati nel localStorage

export const saveGameStats = (gameData) => {
  if (typeof window === 'undefined') return // Server-side protection
  
  try {
    const gameStats = {
      id: Date.now().toString(),
      date: new Date().toISOString(),
      quizSubject: gameData.subject || 'Quiz Sconosciuto',
      players: gameData.players || [],
      duration: gameData.duration || 0,
      questionsCount: gameData.questions?.length || 0,
      maxScore: calculateMaxScore(gameData.questions),
      questionStats: calculateQuestionStats(gameData.questions, gameData.playersAnswers)
    }

    // Carica cronologia esistente
    const existingHistory = JSON.parse(localStorage.getItem('rahoot-game-history') || '[]')
    
    // Aggiungi nuova partita
    existingHistory.push(gameStats)
    
    // Mantieni solo le ultime 50 partite per evitare problemi di storage
    const limitedHistory = existingHistory.slice(-50)
    
    // Salva nel localStorage
    localStorage.setItem('rahoot-game-history', JSON.stringify(limitedHistory))
    
    return gameStats
  } catch (error) {
    console.error('Errore nel salvare le statistiche:', error)
    return null
  }
}

const calculateMaxScore = (questions) => {
  if (!questions || questions.length === 0) return 0
  
  // Calcolo del punteggio massimo basato sul tempo delle domande
  return questions.reduce((total, question) => {
    const timePoints = Math.max(0, (question.time || 15) * 10)
    const bonusPoints = 100
    return total + timePoints + bonusPoints
  }, 0)
}

const calculateQuestionStats = (questions, playersAnswers) => {
  if (!questions || !playersAnswers) return []
  
  return questions.map((question, index) => {
    const questionAnswers = playersAnswers.filter(answer => answer.questionIndex === index)
    const correct = questionAnswers.filter(answer => answer.correct).length
    const total = questionAnswers.length
    
    return {
      questionIndex: index,
      question: question.question,
      correct,
      total,
      percentage: total > 0 ? Math.round((correct / total) * 100) : 0
    }
  })
}

// Funzione per essere chiamata dalla dashboard quando il gioco finisce
export const finalizeGameStats = (gameState) => {
  if (typeof window === 'undefined') return
  
  const finalData = {
    subject: gameState.subject,
    players: gameState.players.map(player => ({
      id: player.id,
      name: player.name,
      score: player.score || 0,
      answers: player.answers || []
    })),
    questions: gameState.questions,
    duration: Date.now() - gameState.gameStartTime,
    playersAnswers: gameState.playersAnswer || []
  }
  
  return saveGameStats(finalData)
}