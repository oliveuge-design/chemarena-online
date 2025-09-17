import GameWrapper from "@/components/game/GameWrapper"
import { GAME_STATES, GAME_STATE_COMPONENTS } from "@/constants"
import { usePlayerContext } from "@/context/player"
import { useSocketContext } from "@/context/socket"
import { useRouter } from "next/router"
import { createElement, useEffect, useState } from "react"
import toast from "react-hot-toast"

export default function Game() {
  const router = useRouter()
  const { pin, name, qr } = router.query

  const { socket, emit, on, off } = useSocketContext()
  const { player, dispatch } = usePlayerContext()

  // Gestione QR e normal join semplificata
  useEffect(() => {
    if (!socket) return

    // QR access - solo PIN, mostra form username
    if (pin && qr === '1' && !name && !player) {
      emit("player:checkRoom", pin)

      const handleSuccess = (roomId) => {
        dispatch({ type: "JOIN", payload: roomId })
        setState(prev => ({ ...prev, status: { name: "ENTER_USERNAME", data: {} } }))
      }

      const handleError = (error) => {
        toast.error(`Room non trovata: ${error}`)
        router.push('/')
      }

      on("game:successRoom", handleSuccess)
      on("game:errorMessage", handleError)
      return () => {
        off("game:successRoom", handleSuccess)
        off("game:errorMessage", handleError)
      }
    }

    // Normal join - PIN + nome
    if (pin && name && !player) {
      emit("player:checkRoom", pin)

      const handleRoomOk = (roomId) => {
        dispatch({ type: "JOIN", payload: roomId })
        emit("player:join", { username: name, room: roomId, displayName: name })
      }

      const handleJoinOk = () => {
        dispatch({ type: "LOGIN", payload: name })
      }

      on("game:successRoom", handleRoomOk)
      on("game:successJoin", handleJoinOk)
      return () => {
        off("game:successRoom", handleRoomOk)
        off("game:successJoin", handleJoinOk)
      }
    }
  }, [pin, qr, name, player, socket])

  useEffect(() => {
    if (!player && !pin && !name) {
      router.replace("/")
    }
  }, [player, pin, name, router])

  const [state, setState] = useState(GAME_STATES)
  const [backgroundTheme, setBackgroundTheme] = useState("laboratory")

  // Load background theme from localStorage
  useEffect(() => {
    const savedSettings = localStorage.getItem('game-settings')
    if (savedSettings) {
      try {
        const settings = JSON.parse(savedSettings)
        if (settings.backgroundTheme) {
          setBackgroundTheme(settings.backgroundTheme)
        }
      } catch (error) {
        console.warn('Error loading game settings:', error)
      }
    }
  }, [])

  useEffect(() => {
    on("game:status", (status) => {
      console.log(`🎮 Game status received:`, status)
      setState({
        ...state,
        status: status,
        question: {
          ...state.question,
          current: state.question.current, // Mantieni il valore corrente
        },
      })
    })

    on("game:reset", () => {
      router.replace("/")

      dispatch({ type: "LOGOUT" })
      setState(GAME_STATES)

      toast("The game has been reset by the host")
    })

    return () => {
      off("game:status")
      off("game:reset")
    }
  }, [on, off, dispatch, router])

  return (
    <GameWrapper backgroundTheme={backgroundTheme}>
      {GAME_STATE_COMPONENTS[state.status.name] &&
        createElement(GAME_STATE_COMPONENTS[state.status.name], {
          data: state.status.data,
        })}
    </GameWrapper>
  )
}
