// Test real timeout scenario: Students don't respond, but manager stays connected
const { io } = require('socket.io-client');

console.log('🧪 TEST REAL TIMEOUT - Nessun studente risponde ma manager resta connesso');

const managerSocket = io('http://localhost:5505', {
  transports: ["polling", "websocket"],
  timeout: 10000,
  autoConnect: true,
});

let roomId;

managerSocket.on('connect', () => {
  console.log('✅ Manager connected:', managerSocket.id);

  // Crea room con domanda a timeout breve per test veloce
  managerSocket.emit('manager:createRoom', {
    teacherId: 'test_real_timeout',
    password: 'TEST123',
    subject: 'Test Real Timeout',
    questions: [
      {
        id: 'real_timeout_q1',
        question: 'Prima domanda - nessuno risponderà',
        answers: ['A', 'B', 'C', 'D'],
        solution: 0,
        time: 3, // Timeout breve: 3 secondi
        cooldown: 1,
        image: ''
      },
      {
        id: 'real_timeout_q2',
        question: 'Seconda domanda per testare avanzamento',
        answers: ['A', 'B', 'C', 'D'],
        solution: 1,
        time: 3,
        cooldown: 1,
        image: ''
      }
    ]
  });
});

managerSocket.on('manager:inviteCode', (code) => {
  roomId = code;
  console.log('✅ Room creata:', roomId);

  // Avvia il gioco subito senza studenti
  setTimeout(() => {
    console.log('🚀 Avvio gioco senza studenti per testare timeout...');
    managerSocket.emit('manager:startGame');
  }, 1000);
});

// Eventi manager per monitorare il flusso
managerSocket.on('game:status', (data) => {
  console.log(`📨 Manager riceve: ${data.name}`);

  if (data.name === 'SHOW_RESPONSES') {
    console.log('✅ RISULTATI RICEVUTI DAL MANAGER:');
    console.log('   - Risposte ricevute:', data.data.responses);
    console.log('   - Soluzione corretta:', data.data.correct);

    if (Object.keys(data.data.responses).length === 0) {
      console.log('✅ TIMEOUT TEST RIUSCITO: Nessuna risposta ricevuta');
      console.log('🔍 Il gioco dovrebbe permettere di continuare...');

      // Attendi 2 secondi e prova ad andare alla prossima domanda
      setTimeout(() => {
        console.log('🔄 Tentativo di passare alla prossima domanda...');
        managerSocket.emit('manager:nextQuestion');
      }, 2000);
    } else {
      console.log('❌ ERRORE: Ricevute risposte inaspettate!');
    }
  }

  // Se riceve stato per seconda domanda, il test è riuscito
  if (data.name === 'SELECT_ANSWER' && data.data.question && data.data.question.includes('Seconda domanda')) {
    console.log('🎉 SUCCESS: Il gioco è riuscito a passare alla domanda successiva!');
    console.log('✅ Il bug del timeout è RISOLTO!');

    // Termina il test pulito
    setTimeout(() => {
      managerSocket.disconnect();
      process.exit(0);
    }, 1000);
  }
});

// Timeout di sicurezza
setTimeout(() => {
  console.log('⏰ TIMEOUT GENERALE - Possibile bug individuato');
  console.log('❌ Il gioco si è bloccato dopo che nessuno ha risposto');
  console.log('🔍 PROBLEMA CONFERMATO: Timeout non gestito correttamente');

  // Non disconnettere il manager per non confondere il debug
  process.exit(1);
}, 15000);