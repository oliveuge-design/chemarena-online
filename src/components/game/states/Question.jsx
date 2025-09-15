import { SFX_SHOW_SOUND } from "@/constants"
import { useEffect, useRef } from "react"
import useSound from "use-sound"

export default function Question({ data: { question, image, cooldown } }) {
  const [sfxShow] = useSound(SFX_SHOW_SOUND, { volume: 0.5 })

  useEffect(() => {
    sfxShow()
  }, [sfxShow])

  return (
    <section className="relative mx-auto flex h-full w-full max-w-7xl flex-1 flex-col items-center px-4">
      {/* Spaziatura superiore ridotta per posizionare più in alto */}
      <div className="flex flex-col items-center justify-center h-[15vh] min-h-[80px]"></div>

      {/* Contenuto domanda posizionato più in alto */}
      <div className="flex flex-col items-center justify-center gap-8 py-8">
        <h2 className="anim-show text-center text-3xl font-bold text-white drop-shadow-lg md:text-4xl lg:text-6xl max-w-6xl leading-tight">
          {question}
        </h2>

        {!!image && (
          <img src={image} className="h-48 max-h-72 w-auto rounded-xl shadow-2xl border-4 border-cyan-400/30" />
        )}
      </div>

      {/* Parte inferiore espansa con progress bar */}
      <div className="flex-1 flex flex-col justify-end pb-8 min-h-[200px]">
        <div
          className="h-6 w-full max-w-4xl mx-auto rounded-full bg-gradient-to-r from-cyan-400 to-green-400 shadow-[0_0_20px_rgba(0,255,136,0.6)] border-2 border-white/20"
          style={{ animation: `progressBar ${cooldown}s linear forwards` }}
        ></div>
      </div>
    </section>
  )
}
