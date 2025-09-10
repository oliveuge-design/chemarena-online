// Utility per sincronizzare la configurazione del quiz

export const syncQuizPassword = async (password) => {
  try {
    const response = await fetch('/api/sync-password', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ password }),
    })
    
    const data = await response.json()
    return data
    
  } catch (error) {
    console.error('Errore nella sincronizzazione password:', error)
    return { success: false, error: error.message }
  }
}

export const syncFullQuizConfig = async (quiz, settings) => {
  try {
    const response = await fetch('/api/update-config', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ quiz, settings }),
    })
    
    const data = await response.json()
    return data
    
  } catch (error) {
    console.error('Errore nella sincronizzazione configurazione:', error)
    return { success: false, error: error.message }
  }
}

// Controlla se il quiz e il config sono sincronizzati
export const isConfigSynced = () => {
  const currentQuiz = JSON.parse(localStorage.getItem('current-game-quiz') || 'null')
  const gameSettings = JSON.parse(localStorage.getItem('game-settings') || 'null')
  const lastUpdate = localStorage.getItem('last-config-update')
  
  if (!currentQuiz || !gameSettings || !lastUpdate) {
    return false
  }
  
  // Controlla se la configurazione è stata aggiornata di recente (ultimi 5 minuti)
  const lastUpdateTime = new Date(lastUpdate).getTime()
  const now = new Date().getTime()
  const fiveMinutes = 5 * 60 * 1000
  
  return (now - lastUpdateTime) < fiveMinutes
}

// Ottiene la password corrente dal localStorage
export const getCurrentQuizPassword = () => {
  const gameSettings = JSON.parse(localStorage.getItem('game-settings') || 'null')
  const currentQuiz = JSON.parse(localStorage.getItem('current-game-quiz') || 'null')
  
  if (gameSettings && gameSettings.password) {
    return gameSettings.password
  }
  
  if (currentQuiz && currentQuiz.password) {
    return currentQuiz.password
  }
  
  return 'QUIZ123' // Default fallback
}