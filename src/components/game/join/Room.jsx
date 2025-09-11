import { usePlayerContext } from "@/context/player"
import Form from "@/components/Form"
import Button from "@/components/Button"
import Input from "@/components/Input"
import { useEffect, useState } from "react"
import { useSocketContext } from "@/context/socket"
import { useRouter } from "next/router"

export default function Room() {
  const { socket, emit, on, off } = useSocketContext()
  const { player, dispatch } = usePlayerContext()
  const router = useRouter()
  const [roomId, setRoomId] = useState("")

  const handleLogin = () => {
    emit("player:checkRoom", roomId)
  }

  const handleKeyDown = (event) => {
    if (event.key === "Enter") {
      handleLogin()
    }
  }

  // Popola il campo PIN se arrivato da QR code
  useEffect(() => {
    if (router.query.pin && !roomId) {
      setRoomId(router.query.pin)
    }
  }, [router.query.pin, roomId])

  useEffect(() => {
    on("game:successRoom", (roomId) => {
      dispatch({ type: "JOIN", payload: roomId })
    })

    return () => {
      off("game:successRoom")
    }
  }, [on, off, dispatch])

  return (
    <Form>
      <Input
        value={roomId}
        onChange={(e) => setRoomId(e.target.value)}
        onKeyDown={handleKeyDown}
        placeholder="PIN Code here"
        type="text"
        inputMode="numeric"
        pattern="[0-9]*"
        maxLength="6"
        autoFocus={true}
      />
      <Button onClick={() => handleLogin()}>Submit</Button>
    </Form>
  )
}
