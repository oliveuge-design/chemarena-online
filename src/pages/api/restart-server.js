import { spawn } from 'child_process'
import fs from 'fs'
import path from 'path'

let serverProcess = null

export default function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' })
  }

  try {
    // Controlla se c'è un processo server in esecuzione
    if (serverProcess) {
      console.log('Terminando il server esistente...')
      serverProcess.kill('SIGTERM')
      serverProcess = null
    }

    // Attende un momento per essere sicuro che il processo sia terminato
    setTimeout(() => {
      console.log('Riavviando il server socket...')
      
      // Avvia un nuovo processo server socket
      serverProcess = spawn('node', ['socket/index.js'], {
        cwd: process.cwd(),
        stdio: 'inherit',
        shell: true
      })

      serverProcess.on('error', (error) => {
        console.error('Errore nel riavvio del server:', error)
      })

      serverProcess.on('close', (code) => {
        console.log(`Server socket terminato con codice ${code}`)
        serverProcess = null
      })

    }, 1000)

    res.status(200).json({ 
      success: true, 
      message: 'Server socket riavviato con successo' 
    })

  } catch (error) {
    console.error('Errore durante il riavvio:', error)
    res.status(500).json({ 
      success: false, 
      message: 'Errore durante il riavvio del server',
      error: error.message 
    })
  }
}

// Gestisce la chiusura pulita quando il processo principale termina
process.on('exit', () => {
  if (serverProcess) {
    serverProcess.kill('SIGTERM')
  }
})

process.on('SIGINT', () => {
  if (serverProcess) {
    serverProcess.kill('SIGTERM')
  }
  process.exit(0)
})

process.on('SIGTERM', () => {
  if (serverProcess) {
    serverProcess.kill('SIGTERM')
  }
  process.exit(0)
})