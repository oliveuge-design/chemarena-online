import clsx from "clsx"

export default function Button({ children, className, disabled, ...otherProps }) {
  return (
    <button
      className={clsx(
        "btn-shadow rounded-md bg-primary p-2 text-lg font-semibold text-white transition-colors",
        disabled && "opacity-50 cursor-not-allowed",
        className,
      )}
      disabled={disabled}
      {...otherProps}
    >
      <span>{children}</span>
    </button>
  )
}
