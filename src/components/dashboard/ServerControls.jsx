import { useState } from "react"
import Button from "@/components/Button"

export default function ServerControls() {
  const [isRestarting, setIsRestarting] = useState(false)
  const [lastRestart, setLastRestart] = useState(null)
  const [status, setStatus] = useState(null)

  const restartServer = async () => {
    setIsRestarting(true)
    setStatus(null)

    try {
      console.log('Richiesta riavvio server...')
      
      const response = await fetch('/api/restart-server', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      })

      const data = await response.json()

      if (data.success) {
        setStatus('success')
        setLastRestart(new Date().toLocaleString('it-IT'))
        
        // Mostra notifica di successo
        setTimeout(() => {
          alert('✅ Server riavviato con successo!\n\nIl nuovo quiz sarà attivo tra alcuni secondi.')
        }, 500)
      } else {
        setStatus('error')
        alert('❌ Errore durante il riavvio del server:\n' + data.message)
      }

    } catch (error) {
      console.error('Errore nella chiamata API:', error)
      setStatus('error')
      alert('❌ Errore di connessione durante il riavvio del server.')
    } finally {
      setIsRestarting(false)
      
      // Reset dello status dopo 5 secondi
      setTimeout(() => {
        setStatus(null)
      }, 5000)
    }
  }

  const restartManually = () => {
    const instructions = `
🔄 RIAVVIO MANUALE DEL SERVER

Per riavviare manualmente il server socket:

1️⃣ Apri il terminale dove è in esecuzione il server
2️⃣ Premi Ctrl+C per fermare il server
3️⃣ Esegui il comando: npm run socket
4️⃣ Oppure esegui: npm run chemarena

Il server si riavvierà con la nuova configurazione.
`
    alert(instructions)
  }

  const downloadRestartScript = () => {
    const isWindows = navigator.platform.toLowerCase().includes('win')
    
    if (isWindows) {
      // Script per Windows
      const script = `@echo off
echo.
echo ===============================================
echo        RIAVVIO SERVER CHEMARENA SOCKET
echo ===============================================
echo.
echo Terminando il server esistente...
taskkill /f /im node.exe >nul 2>&1

echo Attendo 2 secondi...
timeout /t 2 /nobreak >nul

echo.
echo Riavviando il server socket...
echo ===============================================
cd /d "%~dp0"
start "ChemArena Socket Server" cmd /k "npm run socket"

echo.
echo Server riavviato! Una nuova finestra dovrebbe aprirsi.
echo Premi un tasto per chiudere questa finestra...
pause >nul`
      
      const blob = new Blob([script], { type: 'text/plain' })
      const url = URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = 'restart-server.bat'
      a.click()
      URL.revokeObjectURL(url)
      
    } else {
      // Script per macOS/Linux
      const script = `#!/bin/bash

echo ""
echo "==============================================="
echo "        RIAVVIO SERVER CHEMARENA SOCKET"
echo "==============================================="
echo ""

echo "Terminando eventuali processi server esistenti..."
pkill -f "node.*socket/index.js" 2>/dev/null || true

echo "Attendo 2 secondi..."
sleep 2

echo ""
echo "Riavviando il server socket..."
echo "==============================================="

cd "$(dirname "$0")"

# Avvia il server in background
npm run socket &
SERVER_PID=$!

echo "Server avviato con PID: $SERVER_PID"
echo ""
echo "Per fermare il server, usa: kill $SERVER_PID"
echo "Oppure premi Ctrl+C se stai usando npm run ChemArena"
echo ""
echo "Riavvio completato!"`
      
      const blob = new Blob([script], { type: 'text/plain' })
      const url = URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = 'restart-server.sh'
      a.click()
      URL.revokeObjectURL(url)
    }
    
    alert('📥 Script di riavvio scaricato!\n\nPosizionalo nella cartella del progetto ed eseguilo quando necessario.')
  }

  const checkServerStatus = async () => {
    try {
      // Tenta di connettersi al server socket per verificare lo status
      const ws = new WebSocket('ws://localhost:5505')
      
      ws.onopen = () => {
        setStatus('online')
        ws.close()
        alert('✅ Server Socket Online\n\nIl server sta funzionando correttamente.')
      }
      
      ws.onerror = () => {
        setStatus('offline')
        alert('❌ Server Socket Offline\n\nIl server non risponde. Prova a riavviarlo.')
      }
      
      // Timeout dopo 3 secondi
      setTimeout(() => {
        if (ws.readyState === WebSocket.CONNECTING) {
          ws.close()
          setStatus('offline')
          alert('⏱️ Server Socket Timeout\n\nIl server non risponde entro il tempo limite.')
        }
      }, 3000)
      
    } catch (error) {
      console.error('Errore nel controllo status:', error)
      setStatus('offline')
      alert('❌ Impossibile controllare lo status del server.')
    }
  }

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="text-lg font-semibold text-gray-900">Controlli Server</h3>
          <p className="text-sm text-gray-600">Gestisci il server socket per applicare le modifiche</p>
        </div>
        <div className="flex items-center space-x-2">
          {status === 'success' && (
            <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
              ✅ Riavviato
            </span>
          )}
          {status === 'error' && (
            <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-red-100 text-red-800">
              ❌ Errore
            </span>
          )}
          {status === 'online' && (
            <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
              🟢 Online
            </span>
          )}
          {status === 'offline' && (
            <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-red-100 text-red-800">
              🔴 Offline
            </span>
          )}
        </div>
      </div>

      <div className="space-y-4">
        <div className="flex flex-wrap gap-3">
          <Button
            onClick={restartServer}
            disabled={isRestarting}
            className="bg-blue-500 hover:bg-blue-600"
          >
            {isRestarting ? '🔄 Riavviando...' : '🔄 Riavvia Server'}
          </Button>
          
          <Button
            onClick={checkServerStatus}
            className="bg-green-500 hover:bg-green-600"
          >
            📡 Controlla Status
          </Button>
          
          <Button
            onClick={restartManually}
            className="bg-orange-500 hover:bg-orange-600"
          >
            📖 Istruzioni Manuali
          </Button>
          
          <Button
            onClick={downloadRestartScript}
            className="bg-purple-500 hover:bg-purple-600"
          >
            📥 Scarica Script
          </Button>
        </div>

        {lastRestart && (
          <div className="text-xs text-gray-500">
            Ultimo riavvio: <span className="font-medium">{lastRestart}</span>
          </div>
        )}

        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <div className="flex items-start">
            <div className="text-blue-500 mr-2">💡</div>
            <div className="text-sm">
              <p className="font-medium text-blue-900 mb-1">Quando riavviare il server:</p>
              <ul className="text-blue-800 space-y-1 list-disc list-inside text-xs">
                <li>Dopo aver creato o modificato un quiz</li>
                <li>Dopo aver scaricato una nuova configurazione</li>
                <li>Se il gioco non risponde o non trova il quiz</li>
                <li>Quando cambi la password del gioco</li>
              </ul>
            </div>
          </div>
        </div>

        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
          <div className="flex items-start">
            <div className="text-yellow-600 mr-2">⚠️</div>
            <div className="text-sm">
              <p className="font-medium text-yellow-800 mb-1">Attenzione:</p>
              <p className="text-yellow-700 text-xs">
                Il riavvio automatico potrebbe non funzionare in tutti gli ambienti. 
                Se non funziona, usa il riavvio manuale dal terminale.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}