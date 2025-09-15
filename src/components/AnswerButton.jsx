import clsx from "clsx"
import Triangle from "./icons/Triangle"

export default function AnswerButton({
  className,
  icon: Icon,
  children,
  answerImage,
  ...otherProps
}) {
  return (
    <button
      className={clsx(
        "relative overflow-hidden rounded-xl px-6 py-8 text-left font-bold text-white transform transition-all duration-300 hover:scale-105 active:scale-95",
        "before:absolute before:inset-0 before:bg-gradient-to-r before:from-transparent before:via-white/20 before:to-transparent before:translate-x-[-100%] hover:before:translate-x-[100%] before:transition-transform before:duration-700",
        className,
      )}
      {...otherProps}
    >
      {/* Particelle di energia */}
      <div className="absolute top-2 left-4 w-2 h-2 bg-white rounded-full animate-ping opacity-60"></div>
      <div className="absolute bottom-2 right-4 w-1.5 h-1.5 bg-white rounded-full animate-ping opacity-40" style={{animationDelay: '0.5s'}}></div>
      <div className="absolute top-1/2 right-8 w-1 h-1 bg-white rounded-full animate-pulse opacity-70"></div>

      {/* Bordi luminosi animati */}
      <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-white/60 to-transparent animate-pulse"></div>
      <div className="absolute bottom-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-white/60 to-transparent animate-pulse" style={{animationDelay: '0.5s'}}></div>

      {/* Contenuto principale */}
      <div className="relative z-10 flex items-center gap-4">
        <div className="relative">
          <Icon className="h-8 w-8 drop-shadow-[0_0_10px_rgba(255,255,255,0.8)]" />
          <div className="absolute inset-0 h-8 w-8 blur-sm opacity-50">
            <Icon className="h-8 w-8" />
          </div>
        </div>

        <div className="flex-1 flex items-center gap-3">
          {answerImage && (
            <div className="relative">
              <img
                src={answerImage}
                alt="Risposta"
                className="h-16 w-16 object-cover rounded-lg border-2 border-white/40 shadow-[0_0_15px_rgba(255,255,255,0.3)]"
              />
              <div className="absolute inset-0 rounded-lg bg-gradient-to-tr from-transparent to-white/20"></div>
            </div>
          )}
          <span className="text-xl font-bold drop-shadow-[0_0_8px_rgba(0,0,0,0.8)] filter brightness-110">
            {children}
          </span>
        </div>
      </div>

      {/* Effetto glow interno */}
      <div className="absolute inset-0 rounded-xl bg-gradient-to-tr from-white/10 via-transparent to-white/5 pointer-events-none"></div>
    </button>
  )
}
