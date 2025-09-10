import { useState, useEffect } from "react"
import Button from "@/components/Button"

export default function QuizCreator({ editingQuiz, onClearEdit }) {
  const [quiz, setQuiz] = useState({
    id: '',
    subject: '',
    password: 'QUIZ123',
    questions: []
  })
  
  const [currentQuestion, setCurrentQuestion] = useState({
    question: '',
    answers: ['', '', '', ''],
    solution: 0,
    time: 15,
    cooldown: 5,
    image: ''
  })

  const [editingIndex, setEditingIndex] = useState(-1)
  const [showPreview, setShowPreview] = useState(false)
  const [isEditMode, setIsEditMode] = useState(false)

  // Carica il quiz in modifica quando viene passato
  useEffect(() => {
    if (editingQuiz) {
      console.log("QuizCreator - Caricamento quiz per modifica:", editingQuiz) // Debug
      setQuiz({
        id: editingQuiz.id || '',
        subject: editingQuiz.subject || '',
        password: editingQuiz.password || 'QUIZ123',
        questions: editingQuiz.questions || []
      })
      setIsEditMode(true)
    }
  }, [editingQuiz])

  // Reset quando si esce dalla modalità modifica
  useEffect(() => {
    if (!editingQuiz && isEditMode) {
      resetForm()
      setIsEditMode(false)
    }
  }, [editingQuiz, isEditMode])

  const resetQuestion = () => {
    setCurrentQuestion({
      question: '',
      answers: ['', '', '', ''],
      solution: 0,
      time: 15,
      cooldown: 5,
      image: ''
    })
  }

  const resetForm = () => {
    setQuiz({
      id: '',
      subject: '',
      password: 'QUIZ123',
      questions: []
    })
    resetQuestion()
    setEditingIndex(-1)
    setShowPreview(false)
  }

  const handleQuizChange = (field, value) => {
    setQuiz(prev => ({ ...prev, [field]: value }))
  }

  const handleQuestionChange = (field, value) => {
    setCurrentQuestion(prev => ({ ...prev, [field]: value }))
  }

  const handleAnswerChange = (index, value) => {
    const newAnswers = [...currentQuestion.answers]
    newAnswers[index] = value
    setCurrentQuestion(prev => ({ ...prev, answers: newAnswers }))
  }

  const addQuestion = () => {
    if (!currentQuestion.question.trim() || !currentQuestion.answers.some(a => a.trim())) {
      alert('Compila almeno la domanda e una risposta!')
      return
    }

    const newQuestions = [...quiz.questions]
    if (editingIndex >= 0) {
      newQuestions[editingIndex] = { ...currentQuestion }
      setEditingIndex(-1)
    } else {
      newQuestions.push({ ...currentQuestion })
    }
    
    setQuiz(prev => ({ ...prev, questions: newQuestions }))
    resetQuestion()
  }

  const editQuestion = (index) => {
    setCurrentQuestion(quiz.questions[index])
    setEditingIndex(index)
  }

  const deleteQuestion = (index) => {
    if (confirm('Sei sicuro di voler eliminare questa domanda?')) {
      const newQuestions = quiz.questions.filter((_, i) => i !== index)
      setQuiz(prev => ({ ...prev, questions: newQuestions }))
    }
  }

  const saveQuiz = () => {
    if (!quiz.subject.trim() || quiz.questions.length === 0) {
      alert('Inserisci un titolo e almeno una domanda!')
      return
    }

    const quizToSave = {
      ...quiz,
      id: quiz.id || Date.now().toString(),
      createdAt: quiz.createdAt || new Date().toISOString(),
      updatedAt: new Date().toISOString()
    }

    const savedQuizzes = JSON.parse(localStorage.getItem('rahoot-quizzes') || '[]')
    const existingIndex = savedQuizzes.findIndex(q => q.id === quizToSave.id)
    
    if (existingIndex >= 0) {
      savedQuizzes[existingIndex] = quizToSave
      alert('✅ Quiz aggiornato con successo!')
    } else {
      savedQuizzes.push(quizToSave)
      alert('✅ Quiz creato con successo!')
    }
    
    localStorage.setItem('rahoot-quizzes', JSON.stringify(savedQuizzes))
    
    // Reset del form e uscita dalla modalità modifica
    if (onClearEdit) {
      onClearEdit()
    }
    resetForm()
    setIsEditMode(false)
  }

  return (
    <div className="space-y-8">
      <div>
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">
              {isEditMode ? `✏️ Modifica Quiz: ${quiz.subject || 'Quiz Senza Nome'}` : 'Crea Nuovo Quiz'}
            </h2>
            <p className="text-gray-600">
              {isEditMode ? 'Modifica il quiz esistente' : 'Crea un quiz personalizzato per i tuoi studenti'}
            </p>
          </div>
          {isEditMode && (
            <div className="flex space-x-3">
              <Button 
                onClick={() => {
                  if (onClearEdit) onClearEdit()
                  resetForm()
                  setIsEditMode(false)
                }}
                className="bg-gray-500 hover:bg-gray-600"
              >
                ❌ Annulla Modifica
              </Button>
            </div>
          )}
        </div>
      </div>

      {/* Informazioni Quiz */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Informazioni Generali</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Titolo Quiz *
            </label>
            <input
              type="text"
              value={quiz.subject}
              onChange={(e) => handleQuizChange('subject', e.target.value)}
              placeholder="es. Matematica - Equazioni"
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Password Quiz
            </label>
            <input
              type="text"
              value={quiz.password}
              onChange={(e) => handleQuizChange('password', e.target.value)}
              placeholder="PASSWORD"
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
        </div>
      </div>

      {/* Editor Domande */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">
          {editingIndex >= 0 ? 'Modifica Domanda' : 'Aggiungi Domanda'}
        </h3>
        
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Testo Domanda *
            </label>
            <textarea
              value={currentQuestion.question}
              onChange={(e) => handleQuestionChange('question', e.target.value)}
              placeholder="Inserisci la tua domanda qui..."
              rows="3"
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Risposte
            </label>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {currentQuestion.answers.map((answer, index) => (
                <div key={index} className="flex items-center space-x-2">
                  <input
                    type="radio"
                    name="correctAnswer"
                    checked={currentQuestion.solution === index}
                    onChange={() => handleQuestionChange('solution', index)}
                    className="text-green-500"
                  />
                  <input
                    type="text"
                    value={answer}
                    onChange={(e) => handleAnswerChange(index, e.target.value)}
                    placeholder={`Risposta ${index + 1}`}
                    className={`flex-1 p-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                      currentQuestion.solution === index ? 'border-green-500 bg-green-50' : 'border-gray-300'
                    }`}
                  />
                </div>
              ))}
            </div>
            <p className="text-xs text-gray-500 mt-1">
              Seleziona il radio button per indicare la risposta corretta
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Tempo (secondi)
              </label>
              <input
                type="number"
                value={currentQuestion.time}
                onChange={(e) => handleQuestionChange('time', parseInt(e.target.value) || 15)}
                min="5"
                max="120"
                className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Pausa (secondi)
              </label>
              <input
                type="number"
                value={currentQuestion.cooldown}
                onChange={(e) => handleQuestionChange('cooldown', parseInt(e.target.value) || 5)}
                min="0"
                max="30"
                className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Immagine (URL)
              </label>
              <input
                type="url"
                value={currentQuestion.image}
                onChange={(e) => handleQuestionChange('image', e.target.value)}
                placeholder="https://..."
                className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
          </div>

          <div className="flex space-x-3">
            <Button onClick={addQuestion}>
              {editingIndex >= 0 ? 'Aggiorna Domanda' : 'Aggiungi Domanda'}
            </Button>
            {editingIndex >= 0 && (
              <Button 
                onClick={() => {
                  resetQuestion()
                  setEditingIndex(-1)
                }}
                className="bg-gray-500 hover:bg-gray-600"
              >
                Annulla
              </Button>
            )}
          </div>
        </div>
      </div>

      {/* Lista Domande */}
      {quiz.questions.length > 0 && (
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900">
              Domande Aggiunte ({quiz.questions.length})
            </h3>
            <Button onClick={() => setShowPreview(!showPreview)}>
              {showPreview ? 'Nascondi Anteprima' : 'Mostra Anteprima'}
            </Button>
          </div>
          
          <div className="space-y-3">
            {quiz.questions.map((q, index) => (
              <div key={index} className="border border-gray-200 rounded-lg p-4">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <h4 className="font-medium text-gray-900">
                      {index + 1}. {q.question}
                    </h4>
                    {showPreview && (
                      <div className="mt-2 space-y-1">
                        {q.answers.map((answer, ansIndex) => (
                          <div 
                            key={ansIndex} 
                            className={`text-sm px-2 py-1 rounded ${
                              q.solution === ansIndex 
                                ? 'bg-green-100 text-green-800 font-medium' 
                                : 'bg-gray-100 text-gray-600'
                            }`}
                          >
                            {String.fromCharCode(65 + ansIndex)}. {answer}
                            {q.solution === ansIndex && ' ✓'}
                          </div>
                        ))}
                        <div className="text-xs text-gray-500 mt-1">
                          Tempo: {q.time}s | Pausa: {q.cooldown}s
                        </div>
                      </div>
                    )}
                  </div>
                  <div className="flex space-x-2 ml-4">
                    <button
                      onClick={() => editQuestion(index)}
                      className="text-blue-600 hover:text-blue-800 px-2 py-1 rounded text-sm"
                    >
                      ✏️ Modifica
                    </button>
                    <button
                      onClick={() => deleteQuestion(index)}
                      className="text-red-600 hover:text-red-800 px-2 py-1 rounded text-sm"
                    >
                      🗑️ Elimina
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Salva Quiz */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-semibold text-gray-900">
              {isEditMode ? 'Aggiorna Quiz' : 'Salva Quiz'}
            </h3>
            <p className="text-gray-600">
              Quiz con {quiz.questions.length} domande pronto per {isEditMode ? 'l\'aggiornamento' : 'il salvataggio'}
            </p>
          </div>
          <Button 
            onClick={saveQuiz}
            disabled={!quiz.subject.trim() || quiz.questions.length === 0}
            className={quiz.subject.trim() && quiz.questions.length > 0 
              ? "bg-green-500 hover:bg-green-600" 
              : "bg-gray-400 cursor-not-allowed"
            }
          >
            {isEditMode ? '✅ Aggiorna Quiz' : '💾 Salva Quiz'}
          </Button>
        </div>
      </div>
    </div>
  )
}