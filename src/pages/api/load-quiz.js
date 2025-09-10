import fs from 'fs';
import path from 'path';

const CONFIG_PATH = path.join(process.cwd(), 'config.mjs');
const QUIZ_ARCHIVE_PATH = path.join(process.cwd(), 'data', 'quiz-archive.json');

function readQuizArchive() {
  try {
    if (fs.existsSync(QUIZ_ARCHIVE_PATH)) {
      const data = fs.readFileSync(QUIZ_ARCHIVE_PATH, 'utf8');
      return JSON.parse(data);
    }
    return { quizzes: [] };
  } catch (error) {
    console.error('Errore nella lettura dell\'archivio quiz:', error);
    return { quizzes: [] };
  }
}

function updateConfig(quizData) {
  try {
    const configContent = `export const WEBSOCKET_PUBLIC_URL = "http://localhost:5505/"
export const WEBSOCKET_SERVER_PORT = 5505

const QUIZZ_CONFIG = {
  password: "${quizData.password || 'QUIZ123'}",
  subject: "${quizData.subject}",
  questions: ${JSON.stringify(quizData.questions, null, 4)}
}

// DONT CHANGE
export const GAME_STATE_INIT = {
  started: false,
  players: [],
  playersAnswer: [],
  manager: null,
  room: null,
  currentQuestion: 0,
  roundStartTime: 0,
  ...QUIZZ_CONFIG,
}`;

    fs.writeFileSync(CONFIG_PATH, configContent);
    return true;
  } catch (error) {
    console.error('Errore nell\'aggiornare il config:', error);
    return false;
  }
}

export default async function handler(req, res) {
  const { method } = req;

  switch (method) {
    case 'POST':
      try {
        const { quizId, password } = req.body;
        
        if (!quizId) {
          return res.status(400).json({ error: 'ID quiz mancante' });
        }

        const archive = readQuizArchive();
        const quiz = archive.quizzes.find(q => q.id === quizId);
        
        if (!quiz) {
          return res.status(404).json({ error: 'Quiz non trovato nell\'archivio' });
        }

        const configData = {
          password: password || quiz.password || 'QUIZ123',
          subject: quiz.subject,
          questions: quiz.questions
        };

        // Store quiz data in memory for the socket API to use
        global.currentQuizConfig = configData;

        if (updateConfig(configData)) {
          // Trigger socket server initialization with new quiz data
          try {
            const response = await fetch(`${process.env.RENDER_EXTERNAL_URL || 'http://localhost:3000'}/api/socket-init`, {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ 
                type: 'updateGameState',
                data: configData 
              })
            });
            
            if (response.ok) {
              console.log('✅ GameState updated via API');
            }
          } catch (updateError) {
            console.log('⚠️ Socket update warning:', updateError);
            // Non bloccare il caricamento
          }

          return res.status(200).json({ 
            message: 'Quiz caricato e gameState aggiornato automaticamente',
            quiz: quiz.title,
            subject: quiz.subject,
            questionsCount: quiz.questions.length,
            password: configData.password,
            autoUpdate: true
          });
        } else {
          return res.status(500).json({ error: 'Errore nell\'aggiornare il config' });
        }
      } catch (error) {
        console.error('Errore nel caricamento del quiz:', error);
        return res.status(500).json({ error: 'Errore del server' });
      }

    case 'GET':
      try {
        const archive = readQuizArchive();
        const quizList = archive.quizzes.map(quiz => ({
          id: quiz.id,
          title: quiz.title,
          subject: quiz.subject,
          questionsCount: quiz.questions.length,
          created: quiz.created,
          author: quiz.author
        }));

        return res.status(200).json({ quizzes: quizList });
      } catch (error) {
        console.error('Errore nel recuperare la lista dei quiz:', error);
        return res.status(500).json({ error: 'Errore del server' });
      }

    default:
      res.setHeader('Allow', ['GET', 'POST']);
      return res.status(405).json({ error: `Metodo ${method} non supportato` });
  }
}