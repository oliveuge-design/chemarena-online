import Image from "next/image"
import { usePlayerContext } from "@/context/player"
import Form from "@/components/Form"
import Button from "@/components/Button"
import Input from "@/components/Input"
import { useEffect, useState } from "react"
import { socket } from "@/context/socket"
import logo from "@/assets/logo.svg"
import toast from "react-hot-toast"

export default function ManagerPassword({ onCreateRoom }) {
  const [loading, setLoading] = useState(false)
  const [password, setPassword] = useState("")
  const [currentQuizPassword, setCurrentQuizPassword] = useState("QUIZ123")

  useEffect(() => {
    // Verifica che siamo nel browser prima di usare localStorage
    if (typeof window !== 'undefined') {
      try {
        // Prova a caricare la password del quiz corrente dal localStorage
        const currentQuiz = JSON.parse(localStorage.getItem('current-game-quiz') || 'null')
        const gameSettings = JSON.parse(localStorage.getItem('game-settings') || 'null')
        
        if (gameSettings && gameSettings.password) {
          setCurrentQuizPassword(gameSettings.password)
          setPassword(gameSettings.password) // Pre-compila il campo
        } else if (currentQuiz && currentQuiz.password) {
          setCurrentQuizPassword(currentQuiz.password)
          setPassword(currentQuiz.password) // Pre-compila il campo
        }
      } catch (error) {
        console.log('Errore nel caricare impostazioni da localStorage:', error)
      }
    }
  }, [])

  const handleCreate = async () => {
    setLoading(true)
    
    try {
      // Se la password inserita è diversa da quella di default nel config, sincronizza
      if (password && password !== "QUIZ123") {
        console.log('Sincronizzazione password in corso...')
        
        const syncResponse = await fetch('/api/sync-password', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ password: password }),
        })
        
        if (syncResponse.ok) {
          console.log('Password sincronizzata con successo')
        }
      }
      
      // Procedi con la creazione della room
      if (onCreateRoom) {
        onCreateRoom(password)
      } else {
        socket.emit("manager:createRoom", password)
      }
      
    } catch (error) {
      console.error('Errore durante la sincronizzazione:', error)
      // Procedi comunque con la creazione della room
      if (onCreateRoom) {
        onCreateRoom(password)
      } else {
        socket.emit("manager:createRoom", password)
      }
    } finally {
      setLoading(false)
    }
  }

  const handleKeyDown = (event) => {
    if (event.key === "Enter") {
      handleCreate()
    }
  }

  useEffect(() => {
    socket.on("game:errorMessage", (message) => {
      toast.error(message)
    })

    return () => {
      socket.off("game:errorMessage")
    }
  }, [])

  return (
    <section className="relative flex min-h-screen flex-col items-center justify-center">
      <div className="absolute h-full w-full overflow-hidden">
        <div className="absolute -left-[15vmin] -top-[15vmin] min-h-[75vmin] min-w-[75vmin] rounded-full bg-primary/15"></div>
        <div className="absolute -bottom-[15vmin] -right-[15vmin] min-h-[75vmin] min-w-[75vmin] rotate-45 bg-primary/15"></div>
      </div>

      <Image src={logo} className="mb-6 h-32" alt="logo" />

      <div className="mb-6 text-center">
        <Button 
          onClick={() => window.open('/dashboard', '_blank')}
          className="bg-purple-500 hover:bg-purple-600 text-white px-6 py-3 mr-4"
        >
          📚 Dashboard Completo
        </Button>
      </div>

      <Form>
        <div className="mb-4 text-center">
          <p className="text-gray-600 text-sm mb-2">Inserisci la password del quiz per creare la room</p>
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
            <p className="text-blue-800 text-sm">
              💡 <strong>Password corrente del quiz:</strong> <code className="bg-blue-100 px-2 py-1 rounded">{currentQuizPassword}</code>
            </p>
            {(() => {
              // Verifica che siamo nel browser prima di usare localStorage
              if (typeof window !== 'undefined') {
                try {
                  const settings = JSON.parse(localStorage.getItem('game-settings') || '{}');
                  if (settings.autoUpdated) {
                    return (
                      <p className="text-green-700 text-xs mt-2">
                        ⚡ <strong>Sistema aggiornato automaticamente</strong> - Password sincronizzata in real-time!
                      </p>
                    );
                  }
                } catch (error) {
                  console.log('Errore nel leggere game-settings:', error);
                }
              }
              return null;
            })()}
          </div>
        </div>
        <Input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder={`Inserisci: ${currentQuizPassword}`}
        />
        <Button 
          onClick={() => handleCreate()} 
          disabled={loading}
        >
          {loading ? '🔄 Sincronizzazione...' : 'Crea Room e Genera PIN'}
        </Button>
        
        <div className="mt-4 text-center text-xs text-gray-500">
          <p>Dopo aver creato la room, otterrai un PIN numerico da condividere con gli studenti</p>
        </div>
      </Form>
    </section>
  )
}
