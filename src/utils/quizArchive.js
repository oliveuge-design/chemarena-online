export class QuizArchive {
  static async getAllQuizzes() {
    try {
      const response = await fetch('/api/quiz-archive');
      if (!response.ok) throw new Error('Errore nel recuperare i quiz');
      return await response.json();
    } catch (error) {
      console.error('Errore nel recuperare i quiz:', error);
      return { quizzes: [], metadata: { totalQuizzes: 0, totalQuestions: 0 } };
    }
  }

  static async getQuizById(id) {
    try {
      const response = await fetch(`/api/quiz-archive?id=${id}`);
      if (!response.ok) throw new Error('Quiz non trovato');
      return await response.json();
    } catch (error) {
      console.error('Errore nel recuperare il quiz:', error);
      return null;
    }
  }

  static async saveQuiz(quizData) {
    try {
      const response = await fetch('/api/quiz-archive', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(quizData),
      });
      
      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Errore nel salvare il quiz');
      }
      
      return await response.json();
    } catch (error) {
      console.error('Errore nel salvare il quiz:', error);
      throw error;
    }
  }

  static async updateQuiz(id, updateData) {
    try {
      const response = await fetch(`/api/quiz-archive?id=${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updateData),
      });
      
      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Errore nell\'aggiornare il quiz');
      }
      
      return await response.json();
    } catch (error) {
      console.error('Errore nell\'aggiornare il quiz:', error);
      throw error;
    }
  }

  static async deleteQuiz(id) {
    try {
      const response = await fetch(`/api/quiz-archive?id=${id}`, {
        method: 'DELETE',
      });
      
      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Errore nell\'eliminare il quiz');
      }
      
      return await response.json();
    } catch (error) {
      console.error('Errore nell\'eliminare il quiz:', error);
      throw error;
    }
  }

  static async uploadImage(imageFile, tags = []) {
    try {
      const formData = new FormData();
      formData.append('image', imageFile);
      formData.append('tags', tags.join(','));

      const response = await fetch('/api/upload-image', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Errore nell\'upload dell\'immagine');
      }

      return await response.json();
    } catch (error) {
      console.error('Errore nell\'upload dell\'immagine:', error);
      throw error;
    }
  }

  static async getAllImages() {
    try {
      const response = await fetch('/api/upload-image');
      if (!response.ok) throw new Error('Errore nel recuperare le immagini');
      return await response.json();
    } catch (error) {
      console.error('Errore nel recuperare le immagini:', error);
      return { images: [], metadata: { totalImages: 0 } };
    }
  }

  static async deleteImage(id) {
    try {
      const response = await fetch(`/api/upload-image?id=${id}`, {
        method: 'DELETE',
      });
      
      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Errore nell\'eliminare l\'immagine');
      }
      
      return await response.json();
    } catch (error) {
      console.error('Errore nell\'eliminare l\'immagine:', error);
      throw error;
    }
  }

  static validateQuiz(quiz) {
    const errors = [];

    if (!quiz.title || quiz.title.trim() === '') {
      errors.push('Il titolo è obbligatorio');
    }

    if (!quiz.subject || quiz.subject.trim() === '') {
      errors.push('La materia è obbligatoria');
    }

    if (!quiz.questions || !Array.isArray(quiz.questions) || quiz.questions.length === 0) {
      errors.push('Almeno una domanda è necessaria');
    } else {
      quiz.questions.forEach((question, index) => {
        if (!question.question || question.question.trim() === '') {
          errors.push(`Domanda ${index + 1}: Il testo della domanda è obbligatorio`);
        }

        if (!question.answers || !Array.isArray(question.answers) || question.answers.length < 2) {
          errors.push(`Domanda ${index + 1}: Almeno 2 risposte sono necessarie`);
        } else {
          // Valida che ogni risposta abbia almeno un testo o un'immagine
          question.answers.forEach((answer, answerIndex) => {
            if (typeof answer === 'object') {
              if ((!answer.text || answer.text.trim() === '') && !answer.image) {
                errors.push(`Domanda ${index + 1}, Risposta ${answerIndex + 1}: Deve avere almeno un testo o un'immagine`);
              }
            } else if (typeof answer === 'string' && answer.trim() === '') {
              errors.push(`Domanda ${index + 1}, Risposta ${answerIndex + 1}: Il testo non può essere vuoto`);
            }
          });
        }

        if (question.solution === undefined || question.solution < 0 || question.solution >= question.answers?.length) {
          errors.push(`Domanda ${index + 1}: Risposta corretta non valida`);
        }

        if (question.time && (question.time < 5 || question.time > 120)) {
          errors.push(`Domanda ${index + 1}: Il tempo deve essere tra 5 e 120 secondi`);
        }
      });
    }

    return {
      isValid: errors.length === 0,
      errors
    };
  }
}