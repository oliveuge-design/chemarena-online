import { useSocketContext } from "@/context/socket"
import { useEffect, useState } from "react"
import QRCodeDisplay from "@/components/QRCodeDisplay"

export default function Room({ data: { text, inviteCode }, manager = false }) {
  const { socket, emit, on, off } = useSocketContext()
  const [playerList, setPlayerList] = useState([])

  useEffect(() => {
    on("manager:newPlayer", (player) => {
      setPlayerList([...playerList, player])
    })

    on("manager:removePlayer", (playerId) => {
      setPlayerList(playerList.filter((p) => p.id !== playerId))
    })

    on("manager:playerKicked", (playerId) => {
      setPlayerList(playerList.filter((p) => p.id !== playerId))
    })

    return () => {
      off("manager:newPlayer")
      off("manager:removePlayer")
      off("manager:playerKicked")
    }
  }, [playerList, on, off])

  if (manager) {
    return (
      <section className="relative mx-auto flex w-full max-w-7xl flex-1 flex-col items-center justify-start pt-16 px-2">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 w-full">
          {/* Colonna sinistra - Informazioni tradizionali */}
          <div className="flex flex-col items-center justify-center space-y-6">
            <div className="mb-4 rotate-3 rounded-md bg-white px-6 py-4 text-6xl font-extrabold">
              {inviteCode}
            </div>

            <h2 className="text-4xl font-bold text-white drop-shadow-lg text-center">
              {text}
            </h2>

            <div className="flex flex-wrap gap-3 justify-center">
              {playerList.map((player) => (
                <div
                  key={player.id}
                  className="shadow-inset rounded-md bg-primary px-4 py-3 font-bold text-white"
                  onClick={() => emit("manager:kickPlayer", player.id)}
                >
                  <span className="cursor-pointer text-xl drop-shadow-md hover:line-through">
                    {player.username}
                  </span>
                </div>
              ))}
            </div>

            {playerList.length === 0 && (
              <div className="text-white text-center mt-4 opacity-75">
                <p className="text-lg">👥 In attesa di studenti...</p>
                <p className="text-sm mt-2">Gli studenti possono scansionare il QR code o inserire il PIN</p>
              </div>
            )}
          </div>

          {/* Colonna destra - QR Code */}
          <div className="flex items-start justify-center pt-4">
            <QRCodeDisplay
              inviteCode={inviteCode}
              gameUrl={typeof window !== 'undefined' ? `${window.location.protocol}//${window.location.host}` : 'http://localhost:3000'}
            />
          </div>
        </div>
      </section>
    )
  }

  return (
    <section className="relative mx-auto flex w-full max-w-7xl flex-1 flex-col items-center justify-center px-2">
      <div className="mb-10 rotate-3 rounded-md bg-white px-6 py-4 text-6xl font-extrabold">
        {inviteCode}
      </div>

      <h2 className="mb-4 text-4xl font-bold text-white drop-shadow-lg">
        {text}
      </h2>

      <div className="flex flex-wrap gap-3">
        {playerList.map((player) => (
          <div
            key={player.id}
            className="shadow-inset rounded-md bg-primary px-4 py-3 font-bold text-white"
            onClick={() => emit("manager:kickPlayer", player.id)}
          >
            <span className="cursor-pointer text-xl drop-shadow-md hover:line-through">
              {player.username}
            </span>
          </div>
        ))}
      </div>
    </section>
  )
}
