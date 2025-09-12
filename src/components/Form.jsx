export default function Form({ children }) {
  return (
    <div className="z-10 flex w-full max-w-80 flex-col gap-4 rounded-md glass-card p-6 mx-auto">
      {children}
    </div>
  )
}
