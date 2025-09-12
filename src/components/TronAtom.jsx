import { useEffect, useRef } from 'react'

export default function TronAtom({ size = 150, className = "" }) {
  const atomRef = useRef()

  return (
    <div className={`tron-atom ${className}`} ref={atomRef}>
      <svg width={size} height={size} viewBox="0 0 150 150">
        <defs>
          {/* Gradienti per il nucleo */}
          <radialGradient id="nucleusGradient">
            <stop offset="0%" stopColor="#39ff14" stopOpacity="1" />
            <stop offset="70%" stopColor="#00ff88" stopOpacity="0.8" />
            <stop offset="100%" stopColor="#00cc44" stopOpacity="0.6" />
          </radialGradient>

          {/* Gradiente per gli elettroni */}
          <radialGradient id="electronGradient">
            <stop offset="0%" stopColor="#00ffff" stopOpacity="1" />
            <stop offset="70%" stopColor="#0066ff" stopOpacity="0.8" />
            <stop offset="100%" stopColor="#003cff" stopOpacity="0.4" />
          </radialGradient>

          {/* Filtro glow */}
          <filter id="atomGlow" x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur stdDeviation="2" result="coloredBlur"/>
            <feMerge> 
              <feMergeNode in="coloredBlur"/>
              <feMergeNode in="SourceGraphic"/>
            </feMerge>
          </filter>

          {/* Pattern per le orbite */}
          <pattern id="orbitPattern" x="0" y="0" width="4" height="4" patternUnits="userSpaceOnUse">
            <circle cx="2" cy="2" r="0.5" fill="#00ffff" opacity="0.3"/>
          </pattern>
        </defs>

        {/* Orbite elettroniche */}
        <g className="orbital-system">
          {/* Orbita 1 - orizzontale */}
          <ellipse 
            cx="75" 
            cy="75" 
            rx="45" 
            ry="15" 
            fill="none" 
            stroke="#00ffff" 
            strokeWidth="1" 
            strokeDasharray="2,3"
            opacity="0.4"
            filter="url(#atomGlow)"
          >
            <animate attributeName="opacity" values="0.2;0.6;0.2" dur="4s" repeatCount="indefinite"/>
          </ellipse>

          {/* Orbita 2 - diagonale */}
          <ellipse 
            cx="75" 
            cy="75" 
            rx="40" 
            ry="12" 
            fill="none" 
            stroke="#0066ff" 
            strokeWidth="1" 
            strokeDasharray="3,2"
            opacity="0.3"
            transform="rotate(60 75 75)"
            filter="url(#atomGlow)"
          >
            <animate attributeName="opacity" values="0.1;0.5;0.1" dur="5s" repeatCount="indefinite"/>
          </ellipse>

          {/* Orbita 3 - verticale */}
          <ellipse 
            cx="75" 
            cy="75" 
            rx="38" 
            ry="10" 
            fill="none" 
            stroke="#003cff" 
            strokeWidth="1" 
            strokeDasharray="1,4"
            opacity="0.35"
            transform="rotate(120 75 75)"
            filter="url(#atomGlow)"
          >
            <animate attributeName="opacity" values="0.15;0.55;0.15" dur="6s" repeatCount="indefinite"/>
          </ellipse>
        </g>

        {/* Nucleo centrale */}
        <circle 
          cx="75" 
          cy="75" 
          r="8" 
          fill="url(#nucleusGradient)" 
          filter="url(#atomGlow)"
          className="nucleus"
        >
          <animate attributeName="r" values="7;10;7" dur="3s" repeatCount="indefinite"/>
        </circle>

        {/* Particelle del nucleo */}
        <g className="nucleus-particles">
          <circle cx="72" cy="72" r="2" fill="#39ff14" opacity="0.8">
            <animate attributeName="opacity" values="0.6;1;0.6" dur="2s" repeatCount="indefinite"/>
          </circle>
          <circle cx="78" cy="75" r="1.5" fill="#00ff88" opacity="0.7">
            <animate attributeName="opacity" values="0.5;0.9;0.5" dur="2.5s" repeatCount="indefinite"/>
          </circle>
          <circle cx="75" cy="78" r="1.8" fill="#00cc44" opacity="0.9">
            <animate attributeName="opacity" values="0.7;1;0.7" dur="1.8s" repeatCount="indefinite"/>
          </circle>
        </g>

        {/* Elettroni orbitanti */}
        <g className="electrons">
          {/* Elettrone 1 - orbita orizzontale */}
          <circle 
            cx="75" 
            cy="75" 
            r="3" 
            fill="url(#electronGradient)" 
            filter="url(#atomGlow)"
            className="electron"
          >
            <animateMotion dur="8s" repeatCount="indefinite" rotate="auto">
              <path d="M 30,75 A 45,15 0 1,1 120,75 A 45,15 0 1,1 30,75"/>
            </animateMotion>
            <animate attributeName="r" values="2;4;2" dur="3s" repeatCount="indefinite"/>
          </circle>

          {/* Elettrone 2 - orbita diagonale */}
          <circle 
            cx="75" 
            cy="75" 
            r="2.5" 
            fill="url(#electronGradient)" 
            filter="url(#atomGlow)"
            className="electron"
          >
            <animateMotion dur="6s" repeatCount="indefinite" rotate="auto">
              <path d="M 45,90 A 40,12 60 1,1 105,60 A 40,12 60 1,1 45,90"/>
            </animateMotion>
            <animate attributeName="r" values="1.5;3.5;1.5" dur="4s" repeatCount="indefinite"/>
          </circle>

          {/* Elettrone 3 - orbita verticale */}
          <circle 
            cx="75" 
            cy="75" 
            r="2.8" 
            fill="url(#electronGradient)" 
            filter="url(#atomGlow)"
            className="electron"
          >
            <animateMotion dur="10s" repeatCount="indefinite" rotate="auto">
              <path d="M 105,90 A 38,10 120 1,1 45,60 A 38,10 120 1,1 105,90"/>
            </animateMotion>
            <animate attributeName="r" values="2;3.8;2" dur="5s" repeatCount="indefinite"/>
          </circle>
        </g>

        {/* Effetti particellari di fondo */}
        <g className="particle-effects" opacity="0.2">
          <circle cx="30" cy="30" r="1" fill="#00ffff">
            <animate attributeName="opacity" values="0;1;0" dur="3s" repeatCount="indefinite"/>
            <animate attributeName="r" values="0.5;2;0.5" dur="3s" repeatCount="indefinite"/>
          </circle>
          <circle cx="120" cy="40" r="0.8" fill="#0066ff">
            <animate attributeName="opacity" values="0;0.8;0" dur="4s" repeatCount="indefinite"/>
            <animate attributeName="r" values="0.3;1.8;0.3" dur="4s" repeatCount="indefinite"/>
          </circle>
          <circle cx="25" cy="120" r="1.2" fill="#39ff14">
            <animate attributeName="opacity" values="0;0.6;0" dur="5s" repeatCount="indefinite"/>
            <animate attributeName="r" values="0.6;2.2;0.6" dur="5s" repeatCount="indefinite"/>
          </circle>
          <circle cx="125" cy="110" r="0.9" fill="#00ff88">
            <animate attributeName="opacity" values="0;0.9;0" dur="3.5s" repeatCount="indefinite"/>
            <animate attributeName="r" values="0.4;1.9;0.4" dur="3.5s" repeatCount="indefinite"/>
          </circle>
        </g>

        {/* Onda di energia */}
        <circle 
          cx="75" 
          cy="75" 
          r="0" 
          fill="none" 
          stroke="#00ffff" 
          strokeWidth="1" 
          opacity="0"
        >
          <animate 
            attributeName="r" 
            values="0;60;0" 
            dur="8s" 
            repeatCount="indefinite"
          />
          <animate 
            attributeName="opacity" 
            values="0;0.6;0" 
            dur="8s" 
            repeatCount="indefinite"
          />
          <animate 
            attributeName="stroke-width" 
            values="3;0.5;3" 
            dur="8s" 
            repeatCount="indefinite"
          />
        </circle>
      </svg>

      <style jsx>{`
        .tron-atom {
          position: relative;
          filter: drop-shadow(0 0 15px rgba(0, 255, 255, 0.3));
        }

        .nucleus {
          filter: drop-shadow(0 0 8px rgba(57, 255, 20, 0.6));
        }

        .electron {
          filter: drop-shadow(0 0 4px rgba(0, 255, 255, 0.8));
        }

        .orbital-system {
          transform-origin: center;
        }

        .tron-atom:hover {
          filter: drop-shadow(0 0 25px rgba(0, 255, 255, 0.5));
          transform: scale(1.05);
          transition: all 0.4s ease;
        }

        .tron-atom:hover .orbital-system {
          animation: orbitSpin 20s linear infinite;
        }

        @keyframes orbitSpin {
          from {
            transform: rotate(0deg);
          }
          to {
            transform: rotate(360deg);
          }
        }

        .electrons {
          filter: drop-shadow(0 0 6px rgba(0, 255, 255, 0.4));
        }

        .particle-effects circle {
          filter: drop-shadow(0 0 3px currentColor);
        }
      `}</style>
    </div>
  )
}