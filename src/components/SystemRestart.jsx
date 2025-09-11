import { useState } from 'react'
import Button from '@/components/Button'
import toast from 'react-hot-toast'

export default function SystemRestart() {
  const [restarting, setRestarting] = useState(false)

  const handleRestart = async () => {
    const confirmed = confirm(
      '⚠️ RIAVVIO SISTEMA\n\n' +
      'Questo riavvierà completamente il server socket e resetterà il gioco.\n' +
      'Tutti i giocatori verranno disconnessi.\n\n' +
      'Vuoi continuare?'
    )

    if (!confirmed) return

    setRestarting(true)
    toast.loading('🔄 Riavvio sistema in corso...')

    try {
      // Prima resettiamo il gameState lato client
      localStorage.removeItem('teacher-auth')
      
      // Chiamata API per riavviare il server socket
      const response = await fetch('/api/restart-server', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ 
          action: 'restart',
          timestamp: Date.now() 
        })
      })

      const data = await response.json()

      if (data.success) {
        toast.dismiss()
        toast.success('✅ Sistema riavviato con successo!')
        
        // Ricarica la pagina dopo 2 secondi
        setTimeout(() => {
          window.location.reload()
        }, 2000)
        
      } else {
        toast.dismiss()
        toast.error('❌ Errore durante il riavvio: ' + (data.error || 'Errore sconosciuto'))
      }
      
    } catch (error) {
      console.error('Errore riavvio sistema:', error)
      toast.dismiss()
      toast.error('❌ Errore di connessione durante il riavvio')
    } finally {
      setRestarting(false)
    }
  }

  return (
    <div className="bg-red-50 border border-red-200 p-4 rounded-lg">
      <div className="mb-3">
        <h3 className="text-red-800 font-semibold flex items-center gap-2">
          ⚠️ Riavvio Sistema di Emergenza
        </h3>
        <p className="text-red-600 text-sm mt-1">
          Usa solo se il gioco si blocca e skip/next non funzionano
        </p>
      </div>
      
      <Button
        onClick={handleRestart}
        disabled={restarting}
        className="bg-red-600 hover:bg-red-700 text-white px-4 py-2"
      >
        {restarting ? '🔄 Riavvio...' : '🚨 Riavvia Sistema'}
      </Button>
      
      <div className="mt-2 text-xs text-red-500">
        <p>• Disconnette tutti i giocatori</p>
        <p>• Reset completo del gameState</p>
        <p>• Ricarica automatica della pagina</p>
      </div>
    </div>
  )
}