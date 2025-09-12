import GameWrapper from "@/components/game/GameWrapper"
import { GAME_STATES, GAME_STATE_COMPONENTS } from "@/constants"
import { usePlayerContext } from "@/context/player"
import { useSocketContext } from "@/context/socket"
import { useRouter } from "next/router"
import { createElement, useEffect, useState } from "react"
import toast from "react-hot-toast"

export default function Game() {
  const router = useRouter()
  const { pin, name } = router.query

  const { socket, emit, on, off } = useSocketContext()
  const { player, dispatch } = usePlayerContext()

  // Auto-join se PIN e nome sono forniti nella query
  useEffect(() => {
    if (pin && name && !player && socket) {
      // Prima verifica la stanza
      emit("player:checkRoom", pin)
      
      // Ascolta per il successo della verifica stanza
      const handleRoomSuccess = (roomId) => {
        dispatch({ type: "JOIN", payload: roomId })
        
        // Poi prova a unirsi
        const playerData = {
          username: name,
          room: roomId,
          displayName: name
        }
        
        emit("player:join", playerData)
      }
      
      // Ascolta per il successo del join
      const handleJoinSuccess = () => {
        dispatch({ type: "LOGIN", payload: name })
      }
      
      on("game:successRoom", handleRoomSuccess)
      on("game:successJoin", handleJoinSuccess)
      
      return () => {
        off("game:successRoom", handleRoomSuccess)
        off("game:successJoin", handleJoinSuccess)
      }
    }
  }, [pin, name, player, socket, emit, on, off, dispatch])

  useEffect(() => {
    if (!player && !pin && !name) {
      router.replace("/")
    }
  }, [player, pin, name, router])

  const [state, setState] = useState(GAME_STATES)

  useEffect(() => {
    on("game:status", (status) => {
      setState({
        ...state,
        status: status,
        question: {
          ...state.question,
          current: status.question,
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
  }, [state, on, off])

  return (
    <GameWrapper>
      {GAME_STATE_COMPONENTS[state.status.name] &&
        createElement(GAME_STATE_COMPONENTS[state.status.name], {
          data: state.status.data,
        })}
    </GameWrapper>
  )
}
