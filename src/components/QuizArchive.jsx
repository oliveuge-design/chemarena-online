import { useState, useEffect } from 'react';
import { QuizArchive } from '../utils/quizArchive';
import toast from 'react-hot-toast';

export default function QuizArchiveComponent() {
  const [quizzes, setQuizzes] = useState([]);
  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedTab, setSelectedTab] = useState('browse'); // browse, create, images
  const [newQuiz, setNewQuiz] = useState({
    title: '',
    subject: '',
    questions: [{ question: '', answers: ['', '', '', ''], solution: 0, time: 15, cooldown: 5, image: '' }]
  });

  useEffect(() => {
    loadQuizzes();
    loadImages();
  }, []);

  const loadQuizzes = async () => {
    setLoading(true);
    try {
      const data = await QuizArchive.getAllQuizzes();
      setQuizzes(data.quizzes || []);
    } catch (error) {
      toast.error('Errore nel caricamento dei quiz');
    }
    setLoading(false);
  };

  const loadImages = async () => {
    try {
      const data = await QuizArchive.getAllImages();
      setImages(data.images || []);
    } catch (error) {
      toast.error('Errore nel caricamento delle immagini');
    }
  };

  const loadQuizIntoGame = async (quizId) => {
    try {
      const response = await fetch('/api/load-quiz', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ quizId })
      });

      if (!response.ok) throw new Error('Errore nel caricamento');
      
      const result = await response.json();
      toast.success(`Quiz "${result.quiz}" caricato con successo!`);
      
      setTimeout(() => {
        window.location.reload();
      }, 1500);
    } catch (error) {
      toast.error('Errore nel caricamento del quiz');
    }
  };

  const saveNewQuiz = async () => {
    try {
      const validation = QuizArchive.validateQuiz(newQuiz);
      if (!validation.isValid) {
        validation.errors.forEach(error => toast.error(error));
        return;
      }

      await QuizArchive.saveQuiz(newQuiz);
      toast.success('Quiz salvato nell\'archivio!');
      setNewQuiz({
        title: '',
        subject: '',
        questions: [{ question: '', answers: ['', '', '', ''], solution: 0, time: 15, cooldown: 5, image: '' }]
      });
      loadQuizzes();
      setSelectedTab('browse');
    } catch (error) {
      toast.error('Errore nel salvare il quiz');
    }
  };

  const addQuestion = () => {
    setNewQuiz(prev => ({
      ...prev,
      questions: [...prev.questions, { question: '', answers: ['', '', '', ''], solution: 0, time: 15, cooldown: 5, image: '' }]
    }));
  };

  const removeQuestion = (index) => {
    if (newQuiz.questions.length > 1) {
      setNewQuiz(prev => ({
        ...prev,
        questions: prev.questions.filter((_, i) => i !== index)
      }));
    }
  };

  const updateQuestion = (questionIndex, field, value) => {
    setNewQuiz(prev => ({
      ...prev,
      questions: prev.questions.map((q, i) => 
        i === questionIndex ? { ...q, [field]: value } : q
      )
    }));
  };

  const updateAnswer = (questionIndex, answerIndex, value) => {
    setNewQuiz(prev => ({
      ...prev,
      questions: prev.questions.map((q, i) => 
        i === questionIndex ? {
          ...q,
          answers: q.answers.map((a, j) => j === answerIndex ? value : a)
        } : q
      )
    }));
  };

  const handleImageUpload = async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    try {
      const result = await QuizArchive.uploadImage(file, ['quiz']);
      toast.success('Immagine caricata con successo!');
      loadImages();
    } catch (error) {
      toast.error('Errore nell\'upload dell\'immagine');
    }
  };

  const selectImageForQuestion = (questionIndex, imageUrl) => {
    updateQuestion(questionIndex, 'image', imageUrl);
    toast.success('Immagine selezionata per la domanda!');
  };

  return (
    <div className="bg-white rounded-lg shadow-lg p-6">
      <div className="mb-6">
        <div className="flex space-x-4 border-b">
          <button
            onClick={() => setSelectedTab('browse')}
            className={`py-2 px-4 font-medium ${selectedTab === 'browse' ? 'border-b-2 border-blue-500 text-blue-600' : 'text-gray-600'}`}
          >
            Sfoglia Quiz ({quizzes.length})
          </button>
          <button
            onClick={() => setSelectedTab('create')}
            className={`py-2 px-4 font-medium ${selectedTab === 'create' ? 'border-b-2 border-blue-500 text-blue-600' : 'text-gray-600'}`}
          >
            Crea Quiz
          </button>
          <button
            onClick={() => setSelectedTab('images')}
            className={`py-2 px-4 font-medium ${selectedTab === 'images' ? 'border-b-2 border-blue-500 text-blue-600' : 'text-gray-600'}`}
          >
            Immagini ({images.length})
          </button>
        </div>
      </div>

      {selectedTab === 'browse' && (
        <div>
          <h3 className="text-xl font-bold mb-4">Quiz Salvati</h3>
          {loading ? (
            <p>Caricamento...</p>
          ) : quizzes.length === 0 ? (
            <p className="text-gray-500">Nessun quiz salvato nell'archivio</p>
          ) : (
            <div className="grid gap-4">
              {quizzes.map(quiz => (
                <div key={quiz.id} className="border rounded-lg p-4 hover:shadow-md transition-shadow">
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <h4 className="font-semibold text-lg">{quiz.title}</h4>
                      <p className="text-gray-600">Materia: {quiz.subject}</p>
                      <p className="text-sm text-gray-500">
                        {quiz.questions.length} domande • Creato il {quiz.created}
                        {quiz.author && ` • da ${quiz.author}`}
                      </p>
                    </div>
                    <button
                      onClick={() => loadQuizIntoGame(quiz.id)}
                      className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition-colors"
                    >
                      Carica nel Gioco
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {selectedTab === 'create' && (
        <div>
          <h3 className="text-xl font-bold mb-4">Crea Nuovo Quiz</h3>
          
          <div className="mb-4 grid grid-cols-2 gap-4">
            <input
              type="text"
              placeholder="Titolo del quiz"
              value={newQuiz.title}
              onChange={(e) => setNewQuiz(prev => ({ ...prev, title: e.target.value }))}
              className="border rounded px-3 py-2 w-full"
            />
            <input
              type="text"
              placeholder="Materia"
              value={newQuiz.subject}
              onChange={(e) => setNewQuiz(prev => ({ ...prev, subject: e.target.value }))}
              className="border rounded px-3 py-2 w-full"
            />
          </div>

          <div className="space-y-6">
            {newQuiz.questions.map((question, questionIndex) => (
              <div key={questionIndex} className="border rounded-lg p-4 bg-gray-50">
                <div className="flex justify-between items-center mb-4">
                  <h4 className="font-medium">Domanda {questionIndex + 1}</h4>
                  {newQuiz.questions.length > 1 && (
                    <button
                      onClick={() => removeQuestion(questionIndex)}
                      className="text-red-500 hover:text-red-700"
                    >
                      Rimuovi
                    </button>
                  )}
                </div>

                <input
                  type="text"
                  placeholder="Testo della domanda"
                  value={question.question}
                  onChange={(e) => updateQuestion(questionIndex, 'question', e.target.value)}
                  className="border rounded px-3 py-2 w-full mb-4"
                />

                <div className="grid grid-cols-2 gap-3 mb-4">
                  {question.answers.map((answer, answerIndex) => (
                    <div key={answerIndex} className="flex items-center">
                      <input
                        type="radio"
                        name={`solution-${questionIndex}`}
                        checked={question.solution === answerIndex}
                        onChange={() => updateQuestion(questionIndex, 'solution', answerIndex)}
                        className="mr-2"
                      />
                      <input
                        type="text"
                        placeholder={`Risposta ${answerIndex + 1}`}
                        value={answer}
                        onChange={(e) => updateAnswer(questionIndex, answerIndex, e.target.value)}
                        className="border rounded px-3 py-2 flex-1"
                      />
                    </div>
                  ))}
                </div>

                <div className="grid grid-cols-3 gap-4 mb-4">
                  <div>
                    <label className="block text-sm font-medium mb-1">Tempo (secondi)</label>
                    <input
                      type="number"
                      min="5"
                      max="120"
                      value={question.time}
                      onChange={(e) => updateQuestion(questionIndex, 'time', parseInt(e.target.value) || 15)}
                      className="border rounded px-3 py-2 w-full"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">Cooldown (secondi)</label>
                    <input
                      type="number"
                      min="0"
                      max="10"
                      value={question.cooldown}
                      onChange={(e) => updateQuestion(questionIndex, 'cooldown', parseInt(e.target.value) || 5)}
                      className="border rounded px-3 py-2 w-full"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">Immagine</label>
                    <select
                      value={question.image}
                      onChange={(e) => updateQuestion(questionIndex, 'image', e.target.value)}
                      className="border rounded px-3 py-2 w-full"
                    >
                      <option value="">Nessuna immagine</option>
                      {images.map(img => (
                        <option key={img.id} value={img.url}>
                          {img.originalName}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                {question.image && (
                  <div className="mt-2">
                    <img src={question.image} alt="Preview" className="max-w-xs max-h-32 object-cover rounded" />
                  </div>
                )}
              </div>
            ))}
          </div>

          <div className="mt-6 flex justify-between">
            <button
              onClick={addQuestion}
              className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 transition-colors"
            >
              Aggiungi Domanda
            </button>
            <button
              onClick={saveNewQuiz}
              className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition-colors"
            >
              Salva Quiz
            </button>
          </div>
        </div>
      )}

      {selectedTab === 'images' && (
        <div>
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-xl font-bold">Gestione Immagini</h3>
            <div>
              <input
                type="file"
                accept="image/*"
                onChange={handleImageUpload}
                className="hidden"
                id="image-upload"
              />
              <label
                htmlFor="image-upload"
                className="bg-green-500 text-white px-4 py-2 rounded cursor-pointer hover:bg-green-600 transition-colors"
              >
                Carica Immagine
              </label>
            </div>
          </div>

          {images.length === 0 ? (
            <p className="text-gray-500">Nessuna immagine caricata</p>
          ) : (
            <div className="grid grid-cols-3 gap-4">
              {images.map(image => (
                <div key={image.id} className="border rounded-lg p-3">
                  <img
                    src={image.url}
                    alt={image.originalName}
                    className="w-full h-32 object-cover rounded mb-2"
                  />
                  <p className="text-sm font-medium truncate">{image.originalName}</p>
                  <p className="text-xs text-gray-500">
                    {(image.size / 1024).toFixed(1)} KB • {image.uploadDate}
                  </p>
                  <div className="mt-2 flex space-x-2">
                    <button
                      onClick={() => navigator.clipboard.writeText(image.url)}
                      className="text-xs bg-blue-500 text-white px-2 py-1 rounded"
                    >
                      Copia URL
                    </button>
                    <button
                      onClick={async () => {
                        if (confirm('Eliminare questa immagine?')) {
                          try {
                            await QuizArchive.deleteImage(image.id);
                            toast.success('Immagine eliminata');
                            loadImages();
                          } catch (error) {
                            toast.error('Errore nell\'eliminazione');
                          }
                        }
                      }}
                      className="text-xs bg-red-500 text-white px-2 py-1 rounded"
                    >
                      Elimina
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}