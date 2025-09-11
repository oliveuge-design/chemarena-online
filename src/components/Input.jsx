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
        "rounded-sm p-2 text-lg font-semibold outline outline-2 outline-gray-300",
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
