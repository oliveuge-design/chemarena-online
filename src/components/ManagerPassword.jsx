import Image from "next/image"
import Form from "@/components/Form"
import Button from "@/components/Button"
import TeacherAuth from "@/components/TeacherAuth"
import { useEffect, useState } from "react"
import { useSocketContext } from "@/context/socket"
import logo from "@/assets/logo.svg"
import toast from "react-hot-toast"

export default function ManagerPassword({ onCreateRoom }) {
  const { socket, emit, on, off } = useSocketContext()
  const [loading, setLoading] = useState(false)
  const [authenticatedTeacher, setAuthenticatedTeacher] = useState(null)

  useEffect(() => {
    const savedTeacher = localStorage.getItem('teacher-auth')
    if (savedTeacher) {
      try {
        setAuthenticatedTeacher(JSON.parse(savedTeacher))
      } catch (error) {
        localStorage.removeItem('teacher-auth')
      }
    }
  }, [])


  const handleCreate = async () => {
    if (!authenticatedTeacher) {
      toast.error('Devi autenticarti come insegnante prima di creare una room')
      return
    }

    setLoading(true)
    
    try {
      // Sempre pulire eventuali room precedenti prima di creare una nuova
      if (socket && emit) {
        emit("manager:closeRoom")
        emit("manager:abortQuiz")
        
        // Piccolo delay per assicurare che i messaggi siano processati
        await new Promise(resolve => setTimeout(resolve, 100))
      }
      
      if (onCreateRoom) {
        onCreateRoom()
      } else {
        emit("manager:createRoom", { teacherId: authenticatedTeacher.id })
      }
      
    } catch (error) {
      console.error('Errore durante la creazione della room:', error)
      toast.error('Errore durante la creazione della room')
    } finally {
      setLoading(false)
    }
  }

  const handleLogout = () => {
    localStorage.removeItem('teacher-auth')
    setAuthenticatedTeacher(null)
    toast.success('Logout effettuato')
  }

  const handleAuthSuccess = (teacher) => {
    setAuthenticatedTeacher(teacher)
  }

  const handleKeyDown = (event) => {
    if (event.key === "Enter") {
      handleCreate()
    }
  }

  useEffect(() => {
    on("game:errorMessage", (message) => {
      toast.error(message)
    })

    return () => {
      off("game:errorMessage")
    }
  }, [on, off])

  if (!authenticatedTeacher) {
    return <TeacherAuth onAuthSuccess={handleAuthSuccess} />
  }

  return (
    <section className="relative flex min-h-screen flex-col items-center justify-center">
      <div className="absolute h-full w-full overflow-hidden">
        <div className="absolute -left-[15vmin] -top-[15vmin] min-h-[75vmin] min-w-[75vmin] rounded-full bg-primary/15"></div>
        <div className="absolute -bottom-[15vmin] -right-[15vmin] min-h-[75vmin] min-w-[75vmin] rotate-45 bg-primary/15"></div>
      </div>

      <Image src={logo} className="mb-6 h-32" alt="logo" />

      <div className="mb-4 text-center bg-green-50 p-3 rounded-lg">
        <p className="text-green-800 font-semibold">✅ Benvenuto/a {authenticatedTeacher.name}</p>
        <p className="text-green-600 text-sm">{authenticatedTeacher.subject} • {authenticatedTeacher.email}</p>
        <Button 
          onClick={handleLogout}
          className="mt-2 bg-red-500 hover:bg-red-600 text-white px-4 py-1 text-sm"
        >
          🚪 Logout
        </Button>
      </div>

      <div className="mb-6 text-center">
        <Button 
          onClick={() => window.open('/dashboard', '_blank')}
          className="bg-purple-500 hover:bg-purple-600 text-white px-6 py-3 mr-4"
        >
          📚 Dashboard Completo
        </Button>
      </div>

      <Form>
        <div className="mb-6 text-center">
          <p className="text-gray-600 text-lg mb-4">🎯 Pronto per iniziare il quiz?</p>
          <p className="text-gray-500 text-sm">Clicca il pulsante per generare un PIN e iniziare la partita!</p>
        </div>
        
        <Button 
          onClick={() => handleCreate()} 
          disabled={loading}
          className="w-full py-4 text-xl"
        >
          {loading ? '🔄 Creazione in corso...' : '🚀 Crea Room e Genera PIN'}
        </Button>
        
        <div className="mt-4 text-center text-xs text-gray-500">
          <p>Dopo aver creato la room, otterrai un PIN numerico da condividere con gli studenti</p>
        </div>
      </Form>
    </section>
  )
}
