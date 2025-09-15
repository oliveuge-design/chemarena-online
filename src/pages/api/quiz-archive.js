import fs from 'fs';
import path from 'path';
import { validateQuizArchive, safeWriteQuizArchive, restoreFromBackup } from '../../utils/quizValidator.js';

const QUIZ_ARCHIVE_PATH = path.join(process.cwd(), 'data', 'quiz-archive.json');

function readQuizArchive() {
  try {
    if (fs.existsSync(QUIZ_ARCHIVE_PATH)) {
      const data = fs.readFileSync(QUIZ_ARCHIVE_PATH, 'utf8');
      const parsedData = JSON.parse(data);

      // Validazione dati letti
      const validation = validateQuizArchive(parsedData);
      if (!validation.isValid) {
        console.error('⚠️ Dati corrotti rilevati:', validation.errors);
        console.log('🔄 Tentativo ripristino da backup...');

        const restore = restoreFromBackup();
        if (restore.success) {
          console.log('✅ Ripristino completato');
          return readQuizArchive(); // Rileggi dopo ripristino
        } else {
          console.error('❌ Ripristino fallito:', restore.error);
          // Fallback ai dati di default
          return { quizzes: [], metadata: { version: "1.0", totalQuizzes: 0, totalQuestions: 0, lastUpdate: new Date().toISOString().split('T')[0] } };
        }
      }

      return parsedData;
    }
    return { quizzes: [], metadata: { version: "1.0", totalQuizzes: 0, totalQuestions: 0, lastUpdate: new Date().toISOString().split('T')[0] } };
  } catch (error) {
    console.error('❌ Errore nella lettura dell\'archivio quiz:', error);

    // Tentativo ripristino automatico
    console.log('🔄 Tentativo ripristino da backup...');
    const restore = restoreFromBackup();
    if (restore.success) {
      console.log('✅ Ripristino completato');
      return readQuizArchive();
    }

    return { quizzes: [], metadata: { version: "1.0", totalQuizzes: 0, totalQuestions: 0, lastUpdate: new Date().toISOString().split('T')[0] } };
  }
}

function writeQuizArchive(data) {
  console.log('⚠️ DEPRECATO: Usa safeWriteQuizArchive per scritture sicure');

  // Usa il nuovo sistema sicuro
  const result = safeWriteQuizArchive(data);
  if (!result.success) {
    console.error('❌ Scrittura fallita:', result.error);
    if (result.validationErrors) {
      console.error('❌ Errori validazione:', result.validationErrors);
    }
  }

  return result.success;
}

export default function handler(req, res) {
  const { method } = req;

  switch (method) {
    case 'GET':
      try {
        const { id } = req.query;
        const archive = readQuizArchive();
        
        if (id) {
          const quiz = archive.quizzes.find(q => q.id === id);
          if (!quiz) {
            return res.status(404).json({ error: 'Quiz non trovato' });
          }
          return res.status(200).json(quiz);
        }
        
        return res.status(200).json(archive);
      } catch (error) {
        return res.status(500).json({ error: 'Errore del server' });
      }

    case 'POST':
      try {
        const { title, subject, questions, author = 'Utente' } = req.body;
        
        if (!title || !subject || !questions || !Array.isArray(questions)) {
          return res.status(400).json({ error: 'Dati mancanti o non validi' });
        }

        const archive = readQuizArchive();
        const newQuiz = {
          id: `quiz_${Date.now()}`,
          title,
          subject,
          created: new Date().toISOString().split('T')[0],
          author,
          questions: questions.map((q, index) => ({
            id: `q${Date.now()}_${index}`,
            question: q.question,
            answers: q.answers,
            solution: q.solution,
            time: q.time || 15,
            cooldown: q.cooldown || 5,
            image: q.image || ""
          }))
        };

        archive.quizzes.push(newQuiz);
        archive.metadata.totalQuizzes = archive.quizzes.length;
        archive.metadata.totalQuestions = archive.quizzes.reduce((total, quiz) => total + quiz.questions.length, 0);
        archive.metadata.lastUpdate = new Date().toISOString().split('T')[0];

        const saveResult = safeWriteQuizArchive(archive);
        if (saveResult.success) {
          return res.status(201).json({
            ...newQuiz,
            _meta: {
              backupCreated: saveResult.backupCreated,
              backupName: saveResult.backupName
            }
          });
        } else {
          return res.status(500).json({
            error: 'Errore nel salvare il quiz',
            details: saveResult.error,
            validationErrors: saveResult.validationErrors,
            rollbackAttempted: saveResult.rollbackAttempted,
            rollbackSuccess: saveResult.rollbackSuccess
          });
        }
      } catch (error) {
        return res.status(500).json({ error: 'Errore del server' });
      }

    case 'PUT':
      try {
        const { id } = req.query;
        const updateData = req.body;
        
        if (!id) {
          return res.status(400).json({ error: 'ID quiz mancante' });
        }

        const archive = readQuizArchive();
        const quizIndex = archive.quizzes.findIndex(q => q.id === id);
        
        if (quizIndex === -1) {
          return res.status(404).json({ error: 'Quiz non trovato' });
        }

        archive.quizzes[quizIndex] = { ...archive.quizzes[quizIndex], ...updateData };
        archive.metadata.lastUpdate = new Date().toISOString().split('T')[0];

        const saveResult = safeWriteQuizArchive(archive);
        if (saveResult.success) {
          return res.status(200).json({
            ...archive.quizzes[quizIndex],
            _meta: {
              backupCreated: saveResult.backupCreated,
              backupName: saveResult.backupName
            }
          });
        } else {
          return res.status(500).json({
            error: 'Errore nell\'aggiornare il quiz',
            details: saveResult.error,
            validationErrors: saveResult.validationErrors,
            rollbackAttempted: saveResult.rollbackAttempted,
            rollbackSuccess: saveResult.rollbackSuccess
          });
        }
      } catch (error) {
        return res.status(500).json({ error: 'Errore del server' });
      }

    case 'DELETE':
      try {
        const { id } = req.query;
        
        if (!id) {
          return res.status(400).json({ error: 'ID quiz mancante' });
        }

        const archive = readQuizArchive();
        const quizIndex = archive.quizzes.findIndex(q => q.id === id);
        
        if (quizIndex === -1) {
          return res.status(404).json({ error: 'Quiz non trovato' });
        }

        archive.quizzes.splice(quizIndex, 1);
        archive.metadata.totalQuizzes = archive.quizzes.length;
        archive.metadata.totalQuestions = archive.quizzes.reduce((total, quiz) => total + quiz.questions.length, 0);
        archive.metadata.lastUpdate = new Date().toISOString().split('T')[0];

        const saveResult = safeWriteQuizArchive(archive);
        if (saveResult.success) {
          return res.status(200).json({
            message: 'Quiz eliminato con successo',
            _meta: {
              backupCreated: saveResult.backupCreated,
              backupName: saveResult.backupName
            }
          });
        } else {
          return res.status(500).json({
            error: 'Errore nell\'eliminare il quiz',
            details: saveResult.error,
            validationErrors: saveResult.validationErrors,
            rollbackAttempted: saveResult.rollbackAttempted,
            rollbackSuccess: saveResult.rollbackSuccess
          });
        }
      } catch (error) {
        return res.status(500).json({ error: 'Errore del server' });
      }

    default:
      res.setHeader('Allow', ['GET', 'POST', 'PUT', 'DELETE']);
      return res.status(405).json({ error: `Metodo ${method} non supportato` });
  }
}