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
import LabParticles from "@/components/LabParticles"
import AtomAnimation from "@/components/AtomAnimation"

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
    <section className="relative flex min-h-screen flex-col items-center justify-center lab-background">
      <LabParticles intensity="normal" show={true} />
      
      <AtomAnimation 
        size={100} 
        position={{ top: '15%', left: '50%', transform: 'translateX(-50%)' }} 
        show={true} 
      />

      <div className="glass-card-strong p-8 w-full max-w-md mx-auto relative z-10 flex flex-col items-center text-center">
        <Image src={logo} className="mb-6 h-32 mx-auto glow-green" alt="logo" />

        {!player ? <Room /> : <Username />}

      </div>
    </section>
  )
}
