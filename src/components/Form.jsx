export default function Form({ children }) {
  return (
    <div className="z-10 flex w-full max-w-80 flex-col gap-4 rounded-md glass-card p-6 mx-auto tron-form-container">
      {/* Contorno luminoso */}
      <div className="absolute inset-0 rounded-md border-2 border-cyan-400/60 shadow-[0_0_20px_rgba(34,211,238,0.5)] animate-pulse"></div>

      {/* Bordi interni luminosi */}
      <div className="absolute inset-1 rounded-md border border-cyan-300/30"></div>

      {/* Punto luminoso che scorre sul perimetro */}
      <div className="absolute inset-0 overflow-hidden rounded-md">
        <div className="tron-runner"></div>
      </div>

      {/* Contenuto del form */}
      <div className="relative z-10">
        {children}
      </div>

      <style jsx>{`
        .tron-form-container {
          position: relative;
          background: rgba(0, 0, 0, 0.7);
          backdrop-filter: blur(10px);
          overflow: hidden;
        }

        .tron-runner {
          position: absolute;
          width: 8px;
          height: 8px;
          background: radial-gradient(circle, #00ffff 0%, #00bfff 50%, transparent 100%);
          border-radius: 50%;
          box-shadow:
            0 0 15px #00ffff,
            0 0 30px #00ffff,
            0 0 45px #00ffff;
          animation: tronRun 4s linear infinite;
        }

        /* Scia luminosa */
        .tron-runner::before {
          content: '';
          position: absolute;
          width: 20px;
          height: 2px;
          background: linear-gradient(90deg, transparent, #00ffff, transparent);
          top: 50%;
          left: -15px;
          transform: translateY(-50%);
          opacity: 0.8;
        }

        .tron-runner::after {
          content: '';
          position: absolute;
          width: 2px;
          height: 20px;
          background: linear-gradient(180deg, transparent, #00ffff, transparent);
          left: 50%;
          top: -15px;
          transform: translateX(-50%);
          opacity: 0.6;
        }

        @keyframes tronRun {
          0% {
            top: 0;
            left: 0;
            transform: rotate(0deg);
          }
          25% {
            top: 0;
            left: calc(100% - 8px);
            transform: rotate(90deg);
          }
          50% {
            top: calc(100% - 8px);
            left: calc(100% - 8px);
            transform: rotate(180deg);
          }
          75% {
            top: calc(100% - 8px);
            left: 0;
            transform: rotate(270deg);
          }
          100% {
            top: 0;
            left: 0;
            transform: rotate(360deg);
          }
        }

        /* Effetti aggiuntivi per mobile */
        @media (max-width: 768px) {
          .tron-runner {
            width: 10px;
            height: 10px;
            animation-duration: 3s;
          }
        }

        /* Riduzione motion per accessibilità */
        @media (prefers-reduced-motion: reduce) {
          .tron-runner {
            animation: none;
            display: none;
          }

          .tron-form-container .absolute.inset-0.border-2 {
            animation: none;
          }
        }
      `}</style>
    </div>
  )
}
