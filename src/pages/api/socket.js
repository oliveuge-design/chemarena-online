/**
 * ⚠️ DEPRECATED: LEGACY SOCKET.IO API ROUTE
 *
 * Questo file è stato sostituito dal nuovo sistema multi-room
 * in socket/index.js con supporto per quiz multipli contemporanei.
 *
 * CONSEGUENZE:
 * - Sistema single-room limitato (1 quiz alla volta)
 * - Conflitto con nuovo MultiRoomManager
 * - Blocca funzionalità multi-insegnante
 *
 * SOLUZIONE:
 * Usa socket/index.js (porta 5505) per il sistema multi-room
 */

export default function handler(req, res) {
  // Redirect al nuovo sistema
  return res.status(410).json({
    error: 'Legacy Socket.IO API deprecated',
    message: 'Sistema migrato al Multi-Room Socket Server',
    newEndpoint: {
      url: 'ws://localhost:5505',
      features: [
        'Multi-room support',
        'Multiple teachers concurrent',
        'Up to 5 quizzes per teacher',
        'Auto-cleanup inactive rooms',
        'Smart limits & warnings'
      ]
    },
    migration: {
      from: '/api/socket (deprecated)',
      to: 'socket/index.js:5505 (active)'
    },
    instructions: [
      '1. Assicurati che socket/index.js sia in esecuzione',
      '2. Frontend deve connettersi a localhost:5505',
      '3. Eventi Socket.IO rimangono gli stessi',
      '4. Nuovo: sistema multi-room automatico'
    ]
  });
}