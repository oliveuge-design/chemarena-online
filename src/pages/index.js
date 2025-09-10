import Image from "next/image"
import { Montserrat } from "next/font/google"
import { useRouter } from "next/router"
import Form from "@/components/Form"
import Button from "@/components/Button"
import Input from "@/components/Input"
import logo from "@/assets/logo.svg"
import { useEffect, useState } from "react"
import Loader from "@/components/Loader"
import { usePlayerContext } from "@/context/player"
import Room from "@/components/game/join/Room"
import Username from "@/components/game/join/Username"
import { useSocketContext } from "@/context/socket"
import toast from "react-hot-toast"

export default function Home() {
  const router = useRouter()
  const { player, dispatch } = usePlayerContext()
  const { socket, emit, on, off } = useSocketContext()

  useEffect(() => {
    on("game:errorMessage", (message) => {
      toast.error(message)
    })

    return () => {
      off("game:errorMessage")
    }
  }, [on, off])

  // Gestisce il PIN dal QR code
  useEffect(() => {
    if (router.query.pin && !player) {
      emit("player:checkRoom", router.query.pin)
    }
  }, [router.query.pin, player])

  useEffect(() => {
    on("game:successRoom", (roomId) => {
      dispatch({ type: "JOIN", payload: roomId })
    })

    return () => {
      off("game:successRoom")
    }
  }, [dispatch, on, off])

  return (
    <section className="relative flex min-h-screen flex-col items-center justify-center">
      <div className="absolute h-full w-full overflow-hidden">
        <div className="absolute -left-[15vmin] -top-[15vmin] min-h-[75vmin] min-w-[75vmin] rounded-full bg-primary/15"></div>
        <div className="absolute -bottom-[15vmin] -right-[15vmin] min-h-[75vmin] min-w-[75vmin] rotate-45 bg-primary/15"></div>
      </div>

      {/* Link Dashboard per Insegnanti */}
      <div className="absolute top-4 right-4 z-10">
        <Button
          onClick={() => router.push('/dashboard')}
          className="bg-primary hover:bg-orange-600 text-white text-sm px-3 py-2"
        >
          👨‍🏫 Dashboard
        </Button>
      </div>

      <Image src={logo} className="mb-6 h-32" alt="logo" />

      {!player ? <Room /> : <Username />}

      {/* Info per insegnanti */}
      {!player && (
        <div className="mt-8 max-w-md text-center relative z-10">
          <p className="text-gray-700 text-sm mb-4 font-medium">
            Sei un insegnante? Accedi alla dashboard per creare e gestire i tuoi quiz!
          </p>
          <Button 
            onClick={() => router.push('/dashboard')}
            className="bg-green-500 hover:bg-green-600 text-sm px-6 py-3"
          >
            🎓 Dashboard Insegnanti
          </Button>
        </div>
      )}
    </section>
  )
}
