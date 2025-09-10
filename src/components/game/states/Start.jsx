import { SFX_BOUMP_SOUND } from "@/constants"
import { useSocketContext } from "@/context/socket"
import clsx from "clsx"
import { useEffect, useState } from "react"
import useSound from "use-sound"

export default function Start({ data: { time, subject } }) {
  const { socket, on, off } = useSocketContext()
  const [showTitle, setShowTitle] = useState(true)
  const [cooldown, setCooldown] = useState(time)

  const [sfxBoump] = useSound(SFX_BOUMP_SOUND, {
    volume: 0.2,
  })

  useEffect(() => {
    on("game:startCooldown", () => {
      sfxBoump()
      setShowTitle(false)
    })

    on("game:cooldown", (sec) => {
      sfxBoump()
      setCooldown(sec)
    })

    return () => {
      off("game:startCooldown")
      off("game:cooldown")
    }
  }, [sfxBoump, on, off])

  return (
    <section className="relative mx-auto flex w-full max-w-7xl flex-1 flex-col items-center justify-center">
      {showTitle ? (
        <h2 className="anim-show text-center text-3xl font-bold text-white drop-shadow-lg md:text-4xl lg:text-5xl">
          {subject}
        </h2>
      ) : (
        <>
          <div
            className={clsx(
              `anim-show aspect-square h-32 bg-primary transition-all md:h-60`,
            )}
            style={{
              transform: `rotate(${45 * (time - cooldown)}deg)`,
            }}
          ></div>
          <span className="absolute text-6xl font-bold text-white drop-shadow-md md:text-8xl">
            {cooldown}
          </span>
        </>
      )}
    </section>
  )
}
