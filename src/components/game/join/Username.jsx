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
  const [realName, setRealName] = useState("")
  const [isEducationalMode, setIsEducationalMode] = useState(false)
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
    const nameToValidate = isEducationalMode ? realName : username
    const validationError = validateUsername(nameToValidate)
    
    if (validationError) {
      setError(validationError)
      return
    }

    setError("")
    
    const playerData = {
      username: nameToValidate.trim(),
      room: player.room,
      isEducational: isEducationalMode,
      displayName: isEducationalMode ? realName.trim() : username.trim()
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
      const finalUsername = isEducationalMode ? realName : username
      dispatch({
        type: "LOGIN",
        payload: finalUsername.trim(),
      })

      router.replace("/game")
    })

    return () => {
      off("game:successJoin")
    }
  }, [username, realName, isEducationalMode, on, off, dispatch, router])

  const currentName = isEducationalMode ? realName : username
  const isValid = !validateUsername(currentName) && currentName.trim().length >= 3

  return (
    <Form>
      <div className="space-y-4">
        {/* Toggle per modalità educativa */}
        <div className="flex items-center justify-center space-x-3 p-3 bg-gray-50 rounded-lg">
          <label className="flex items-center space-x-2 cursor-pointer">
            <input
              type="checkbox"
              checked={isEducationalMode}
              onChange={(e) => setIsEducationalMode(e.target.checked)}
              className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500"
            />
            <span className="text-sm font-medium text-gray-700">
              📚 Modalità Valutazione (Nome Reale)
            </span>
          </label>
        </div>

        {/* Input dinamico */}
        <Input
          value={currentName}
          onChange={(e) => {
            const value = e.target.value
            if (isEducationalMode) {
              setRealName(value)
            } else {
              setUsername(value)
            }
            if (error) setError("") // Pulisci errore durante digitazione
          }}
          onKeyDown={handleKeyDown}
          placeholder={isEducationalMode ? "Il tuo nome e cognome" : "Nickname (min. 3 caratteri)"}
          className={error ? "border-red-500" : ""}
          type="text"
          maxLength="20"
          autoFocus={true}
        />

        {/* Messaggio di errore */}
        {error && (
          <p className="text-red-500 text-sm text-center">{error}</p>
        )}

        {/* Info dinamica */}
        <p className="text-xs text-center text-gray-500">
          {isEducationalMode 
            ? "🎓 Il tuo nome reale verrà usato per la valutazione" 
            : "🎮 Usa un nickname divertente per il gioco!"
          }
        </p>
      </div>

      <Button 
        onClick={handleJoin}
        disabled={!isValid}
        className={`mt-4 ${!isValid ? 'opacity-50 cursor-not-allowed' : ''}`}
      >
        {isEducationalMode ? "📚 Entra per Valutazione" : "🎮 Entra nel Gioco"}
      </Button>
    </Form>
  )
}
