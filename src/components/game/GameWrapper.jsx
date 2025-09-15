import Button from "@/components/Button"
import SystemRestart from "@/components/SystemRestart"
import BackgroundManager from "@/components/BackgroundManager"
import { usePlayerContext } from "@/context/player"
import { useSocketContext } from "@/context/socket"
import { useEffect, useState } from "react"
import { useRouter } from "next/router"

export default function GameWrapper({ children, textNext, onNext, manager, backgroundTheme = "laboratory" }) {
  const { socket, emit, on, off } = useSocketContext()
  const { player, dispatch } = usePlayerContext()
  const router = useRouter()

  const [questionState, setQuestionState] = useState()
  const [currentQuizId, setCurrentQuizId] = useState(null)

  useEffect(() => {
    on("game:kick", () => {
      dispatch({
        type: "LOGOUT",
      })

      router.replace("/")
    })

    on("game:updateQuestion", ({ current, total }) => {
      setQuestionState({
        current,
        total,
      })
    })

    return () => {
      off("game:kick")
      off("game:updateQuestion")
    }
  }, [on, off, dispatch, router])

  // Carica il quiz corrente per determinare il tema
  useEffect(() => {
    try {
      const savedQuiz = localStorage.getItem('current-game-quiz')
      if (savedQuiz) {
        const quiz = JSON.parse(savedQuiz)
        setCurrentQuizId(quiz.id)
        console.log(`🎮 Quiz corrente rilevato: ${quiz.title} (ID: ${quiz.id})`)
      }
    } catch (error) {
      console.error('Errore caricamento quiz corrente:', error)
    }
  }, [])

  return (
    <BackgroundManager
      theme={backgroundTheme}
      quizId={currentQuizId}
      opacity={75}
      className="min-h-screen"
    >
      <section className="relative flex min-h-screen w-full flex-col justify-between">

      <div className="flex w-full justify-between p-4">
        {questionState && (
          <div className="shadow-inset flex items-center rounded-md bg-white p-2 px-4 text-lg font-bold text-black">
            {`${questionState.current} / ${questionState.total}`}
          </div>
        )}

        {manager && (
          <div className="flex flex-col gap-2">
            <Button
              className="self-end bg-white px-4 !text-black"
              onClick={() => onNext()}
            >
              {textNext}
            </Button>
            
            {/* Pulsante di emergenza solo per manager */}
            <Button
              className="self-end bg-red-600 hover:bg-red-700 text-white px-2 py-1 text-xs"
              onClick={() => {
                const restart = confirm('⚠️ Riavvio di emergenza?\n\nUsa solo se il gioco si è bloccato.\n\nReset completo server + client.')
                if (restart) {
                  // Reset del game state sul server (forceReset per emergenza)
                  if (socket && emit) {
                    emit("manager:forceReset")
                    console.log('🚨 Emergency force reset: server state resettato')
                  }
                  
                  // Determina il dashboard corretto basato sul ruolo dell'utente
                  const savedTeacher = localStorage.getItem('teacher-auth')
                  let dashboardUrl = '/dashboard?emergency=true' // Default per admin
                  
                  if (savedTeacher) {
                    try {
                      const teacherData = JSON.parse(savedTeacher)
                      if (teacherData.role === 'teacher') {
                        dashboardUrl = '/teacher-dashboard?emergency=true'
                      }
                    } catch (error) {
                      console.error('Errore parsing teacher data:', error)
                    }
                  }
                  
                  // Naviga al dashboard corretto dopo reset server
                  setTimeout(() => {
                    window.location.href = dashboardUrl
                  }, 100) // Piccolo delay per assicurare che il reset server sia completato
                }
              }}
            >
              🚨 Emergency Reset
            </Button>
          </div>
        )}
      </div>

      {children}

      {!manager && (
        <div className="z-50 flex items-center justify-between bg-white px-4 py-2 text-lg font-bold text-white">
          <p className="text-gray-800">{!!player && player.username}</p>
          <div className="rounded-sm bg-gray-800 px-3 py-1 text-lg">
            {!!player && player.points}
          </div>
        </div>
      )}
      </section>
    </BackgroundManager>
  )
}
