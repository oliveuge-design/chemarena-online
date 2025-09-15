// Test timeout: Studente non risponde e il gioco dovrebbe continuare
const { io } = require('socket.io-client');

console.log('🧪 TEST TIMEOUT - Nessun studente risponde');

const managerSocket = io('http://localhost:5560', {
  transports: ["polling", "websocket"],
  timeout: 10000,
  autoConnect: true,
});

let roomId;
let studentSocket;

managerSocket.on('connect', () => {
  console.log('✅ Manager connected:', managerSocket.id);

  // Crea room con domanda a timeout breve per test veloce
  managerSocket.emit('manager:createRoom', {
    teacherId: 'test_timeout',
    password: 'TEST123',
    subject: 'Test Timeout',
    questions: [
      {
        id: 'timeout_q1',
        question: 'Test question - nessuno risponderà',
        answers: ['A', 'B', 'C', 'D'],
        solution: 0,
        time: 5, // Timeout breve: 5 secondi
        cooldown: 2,
        image: ''
      },
      {
        id: 'timeout_q2',
        question: 'Seconda domanda per testare avanzamento',
        answers: ['A', 'B', 'C', 'D'],
        solution: 1,
        time: 5,
        cooldown: 2,
        image: ''
      }
    ]
  });
});

managerSocket.on('manager:inviteCode', (code) => {
  roomId = code;
  console.log('✅ Room creata:', roomId);

  // Crea studente che si connette ma NON risponde
  studentSocket = io('http://localhost:5560');

  studentSocket.on('connect', () => {
    console.log('✅ Studente connesso (ma non risponderà):', studentSocket.id);

    studentSocket.emit('player:checkRoom', roomId);

    studentSocket.on('game:successRoom', () => {
      studentSocket.emit('player:join', {
        username: 'silent_student',
        room: roomId
      });
    });

    studentSocket.on('game:successJoin', () => {
      console.log('✅ Studente joinato - iniziando gioco...');

      // Avvia il gioco dopo 1 secondo
      setTimeout(() => {
        managerSocket.emit('manager:startGame');
      }, 1000);
    });

    // Lo studente riceverà gli eventi del gioco ma NON risponderà
    studentSocket.on('game:status', (data) => {
      console.log(`📨 Student riceve: ${data.name}`);

      if (data.name === 'SELECT_ANSWER') {
        console.log('⏰ TIMEOUT TEST: Studente NON risponderà alla domanda');
        console.log(`   - Timeout domanda: ${data.data.time} secondi`);
        console.log('   - Aspettiamo il timeout...');
      }

      if (data.name === 'SHOW_RESULT') {
        console.log('✅ Ricevuto risultato (studente non ha risposto)');
      }
    });
  });
});

managerSocket.on('manager:newPlayer', (player) => {
  console.log('✅ Player aggiunto:', player.username);
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
  if (data.name === 'SHOW_RESPONSES' && data.data.question.includes('Seconda domanda')) {
    console.log('🎉 SUCCESS: Il gioco è riuscito a passare alla domanda successiva!');
    console.log('✅ Il bug del timeout è RISOLTO o NON ESISTE');
    process.exit(0);
  }
});

// Timeout di sicurezza
setTimeout(() => {
  console.log('⏰ TIMEOUT GENERALE - Possibile bug individuato');
  console.log('❌ Il gioco si è bloccato dopo che nessuno ha risposto');
  console.log('🔍 PROBLEMA CONFERMATO: Timeout non gestito correttamente');
  process.exit(1);
}, 20000);