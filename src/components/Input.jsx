import clsx from "clsx"

export default function Input({ className, onChange, ...otherProps }) {
  const handleChange = (e) => {
    if (onChange) {
      // Passa sempre l'evento completo per semplicità
      onChange(e)
    }
  }

  return (
    <input
      className={clsx(
        "w-full text-center rounded-lg p-3 text-lg font-semibold bg-white/20 backdrop-blur-sm border-2 border-white/30 text-white placeholder-white/70 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-400/50",
        className,
      )}
      onChange={handleChange}
      autoComplete="off"
      autoCorrect="off"
      autoCapitalize="off"
      spellCheck="false"
      inputMode="text"
      {...otherProps}
    />
  )
}
