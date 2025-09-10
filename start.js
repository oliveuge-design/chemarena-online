#!/usr/bin/env node

console.log('\n🎓 ═══════════════════════════════════════════════════════════')
console.log('🚀                  RAHOOT - QUIZ SYSTEM                    🚀')
console.log('═══════════════════════════════════════════════════════════\n')

console.log('📱 STUDENTI (Giocatori):')
console.log('   🔗 http://localhost:3000')
console.log('   💡 Inserire il PIN code per partecipare\n')

console.log('👨‍🏫 INSEGNANTI (Dashboard):')
console.log('   🔗 http://localhost:3000/dashboard')
console.log('   🔑 Password: admin123')
console.log('   ✨ Crea e gestisci i tuoi quiz!\n')

console.log('🛠️  COMANDI UTILI:')
console.log('   npm run all-dev    -> Avvia tutto (dev mode)')
console.log('   npm run socket     -> Solo server socket')
console.log('   npm run dev        -> Solo interfaccia web\n')

console.log('📋 GUIDA RAPIDA:')
console.log('   1. Vai alla Dashboard Insegnanti')
console.log('   2. Crea un nuovo quiz')
console.log('   3. Lancia il gioco dalla Dashboard')
console.log('   4. Gli studenti si collegano con il PIN\n')

console.log('═══════════════════════════════════════════════════════════')
console.log('🎮 Buon divertimento con Rahoot! 🎮')
console.log('═══════════════════════════════════════════════════════════\n')

// Avvia concurrently dopo aver mostrato le info
const { spawn } = require('child_process')

const proc = spawn('npx', ['concurrently', '--kill-others', '"npm run dev"', '"npm run socket"'], {
  stdio: 'inherit',
  shell: true
})

proc.on('close', (code) => {
  console.log(`\n🔴 Rahoot terminato con codice ${code}`)
})

// Gestisci Ctrl+C
process.on('SIGINT', () => {
  console.log('\n\n👋 Arrivederci! Rahoot terminato dall\'utente.')
  proc.kill('SIGINT')
  process.exit(0)
})