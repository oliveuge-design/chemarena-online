import clsx from "clsx"

export default function Input({ className, onChange, ...otherProps }) {
  const handleChange = (e) => {
    if (onChange) {
      // Supporta entrambi i formati: onChange(value) e onChange(event)
      // Se onChange ha 1 parametro, passa solo il valore
      // Se onChange ha 2 parametri, passa l'evento completo
      if (onChange.length === 1) {
        onChange(e.target.value)
      } else {
        onChange(e)
      }
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
