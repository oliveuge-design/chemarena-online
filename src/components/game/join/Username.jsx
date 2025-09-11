import { usePlayerContext } from "@/context/player"
import Form from "@/components/Form"
import Button from "@/components/Button"
import Input from "@/components/Input"
import { useEffect, useState } from "react"
import { useSocketContext } from "@/context/socket"
import { useRouter } from "next/router"

export default function Username() {
  const { socket, emit, on, off } = useSocketContext()
  const { player, dispatch } = usePlayerContext()
  const router = useRouter()
  const [username, setUsername] = useState("")
  const [error, setError] = useState("")

  const validateUsername = (name) => {
    if (!name || name.trim().length < 3) {
      return "Il nome deve avere almeno 3 caratteri"
    }
    if (name.trim().length > 20) {
      return "Il nome non può superare 20 caratteri"
    }
    return null
  }

  const handleJoin = () => {
    const validationError = validateUsername(username)
    
    if (validationError) {
      setError(validationError)
      return
    }

    setError("")
    
    const playerData = {
      username: username.trim(),
      room: player.room,
      displayName: username.trim()
    }
    
    emit("player:join", playerData)
  }

  const handleKeyDown = (event) => {
    if (event.key === "Enter") {
      handleJoin()
    }
  }

  useEffect(() => {
    on("game:successJoin", () => {
      dispatch({
        type: "LOGIN",
        payload: username.trim(),
      })

      router.replace("/game")
    })

    return () => {
      off("game:successJoin")
    }
  }, [username, on, off, dispatch, router])

  const isValid = !validateUsername(username) && username.trim().length >= 3

  return (
    <Form>
      <div className="space-y-4">
        <Input
          value={username}
          onChange={(e) => {
            setUsername(e.target.value)
            if (error) setError("")
          }}
          onKeyDown={handleKeyDown}
          placeholder="Il tuo nickname (min. 3 caratteri)"
          className={error ? "border-red-500" : ""}
          type="text"
          maxLength="20"
          autoFocus={true}
        />

        {error && (
          <p className="text-red-500 text-sm text-center">{error}</p>
        )}

        <p className="text-xs text-center text-gray-500">
          🎮 Inserisci un nickname per entrare nel gioco!
        </p>
      </div>

      <Button 
        onClick={handleJoin}
        disabled={!isValid}
        className={`mt-4 ${!isValid ? 'opacity-50 cursor-not-allowed' : ''}`}
      >
        🎮 Entra nel Gioco
      </Button>
    </Form>
  )
}
