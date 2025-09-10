import Loader from "@/components/Loader"
import {
  SFX_PODIUM_FIRST,
  SFX_PODIUM_SECOND,
  SFX_PODIUM_THREE,
  SFX_SNEAR_ROOL,
} from "@/constants"
import useScreenSize from "@/hook/useScreenSize"
import clsx from "clsx"
import { useEffect, useState } from "react"
import ReactConfetti from "react-confetti"
import useSound from "use-sound"

export default function Podium({ data: { subject, top }, manager = false }) {
  const [apparition, setApparition] = useState(0)

  const { width, height } = useScreenSize()

  const [sfxtThree] = useSound(SFX_PODIUM_THREE, {
    volume: 0.2,
  })

  const [sfxSecond] = useSound(SFX_PODIUM_SECOND, {
    volume: 0.2,
  })

  const [sfxRool, { stop: sfxRoolStop }] = useSound(SFX_SNEAR_ROOL, {
    volume: 0.2,
  })

  const [sfxFirst] = useSound(SFX_PODIUM_FIRST, {
    volume: 0.2,
  })

  useEffect(() => {
    console.log(apparition)
    switch (apparition) {
      case 4:
        sfxRoolStop()
        sfxFirst()
        break
      case 3:
        sfxRool()
        break
      case 2:
        sfxSecond()
        break
      case 1:
        sfxtThree()
        break
    }
  }, [apparition, sfxFirst, sfxSecond, sfxtThree, sfxRool])

  useEffect(() => {
    if (top.length < 3) {
      setApparition(4)
      return
    }

    const interval = setInterval(() => {
      if (apparition > 4) {
        clearInterval(interval)
        return
      }
      setApparition((value) => value + 1)
    }, 2000)

    return () => clearInterval(interval)
  }, [apparition])

  return (
    <>
      {apparition >= 4 && (
        <ReactConfetti
          width={width}
          height={height}
          className="h-full w-full"
        />
      )}

      {apparition >= 3 && top.length >= 3 && (
        <div className="absolute min-h-screen w-full overflow-hidden">
          <div className="spotlight"></div>{" "}
        </div>
      )}
      <section className="relative mx-auto flex w-full max-w-7xl flex-1 flex-col items-center justify-between">
        <h2 className="anim-show text-center text-3xl font-bold text-white drop-shadow-lg md:text-4xl lg:text-5xl">
          {subject}
        </h2>

        <div
          className={`grid w-full max-w-[800px] flex-1 grid-cols-${top.length} items-end justify-center justify-self-end overflow-y-hidden overflow-x-visible`}
        >
          {top[1] && (
            <div
              className={clsx(
                "z-20 flex h-[50%] w-full translate-y-full flex-col items-center justify-center gap-3 opacity-0 transition-all",
                { "!translate-y-0 opacity-100": apparition >= 2 },
              )}
            >
              <p
                className={clsx(
                  "overflow-visible whitespace-nowrap text-center text-2xl font-bold text-white drop-shadow-lg md:text-4xl",
                  {
                    "anim-balanced": apparition >= 4,
                  },
                )}
              >
                {top[1]?.username || "Giocatore 2"}
              </p>
              <div className="flex h-full w-full flex-col items-center gap-4 rounded-t-md bg-primary pt-6 text-center shadow-2xl">
                <p className="flex aspect-square h-14 items-center justify-center rounded-full border-4 border-zinc-400 bg-zinc-500 text-3xl font-bold text-white drop-shadow-lg">
                  <span className="drop-shadow-md">2</span>
                </p>
                <p className="text-2xl font-bold text-white drop-shadow-lg">
                  {top[1]?.points || 0}
                </p>
              </div>
            </div>
          )}

          {top.length > 0 && (
            <div
              className={clsx(
                "z-30 flex h-[60%] w-full translate-y-full flex-col items-center gap-3 opacity-0 transition-all",
                {
                  "!translate-y-0 opacity-100": apparition >= 3,
                },
                {
                  "md:min-w-64": top.length < 2,
                },
              )}
            >
              <p
                className={clsx(
                  "overflow-visible whitespace-nowrap text-center text-2xl font-bold text-white opacity-0 drop-shadow-lg md:text-4xl",
                  { "anim-balanced opacity-100": apparition >= 4 },
                )}
              >
                {top[0]?.username || "Giocatore 1"}
              </p>
              <div className="flex h-full w-full flex-col items-center gap-4 rounded-t-md bg-primary pt-6 text-center shadow-2xl">
                <p className="flex aspect-square h-14 items-center justify-center rounded-full border-4 border-amber-400 bg-amber-300 text-3xl font-bold text-white drop-shadow-lg">
                  <span className="drop-shadow-md">1</span>
                </p>
                <p className="text-2xl font-bold text-white drop-shadow-lg">
                  {top[0]?.points || 0}
                </p>
              </div>
            </div>
          )}

          {top[2] && (
            <div
              className={clsx(
                "z-10 flex h-[40%] w-full translate-y-full flex-col items-center gap-3 opacity-0 transition-all",
                {
                  "!translate-y-0 opacity-100": apparition >= 1,
                },
              )}
            >
              <p
                className={clsx(
                  "overflow-visible whitespace-nowrap text-center text-2xl font-bold text-white drop-shadow-lg md:text-4xl",
                  {
                    "anim-balanced": apparition >= 4,
                  },
                )}
              >
                {top[2]?.username || "Giocatore 3"}
              </p>
              <div className="flex h-full w-full flex-col items-center gap-4 rounded-t-md bg-primary pt-6 text-center shadow-2xl">
                <p className="flex aspect-square h-14 items-center justify-center rounded-full border-4 border-amber-800 bg-amber-700 text-3xl font-bold text-white drop-shadow-lg">
                  <span className="drop-shadow-md">3</span>
                </p>

                <p className="text-2xl font-bold text-white drop-shadow-lg">
                  {top[2]?.points || 0}
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Messaggio per il manager */}
        {manager && apparition >= 4 && (
          <div className="anim-show absolute bottom-20 left-1/2 transform -translate-x-1/2 bg-black bg-opacity-60 rounded-lg p-4 text-center backdrop-blur-sm">
            <p className="text-white text-sm font-medium">
              🏆 Quiz completato! <br />
              Clicca su "🏠 Nuovo Quiz" in alto a destra per selezionare un nuovo quiz
            </p>
          </div>
        )}
      </section>
    </>
  )
}
