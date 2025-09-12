import { useEffect, useRef } from 'react'

export default function TronBeaker({ size = 200, className = "" }) {
  const beakerRef = useRef()

  useEffect(() => {
    const beaker = beakerRef.current
    if (!beaker) return

    // Animazione delle bolle
    const bubbles = beaker.querySelectorAll('.bubble')
    bubbles.forEach((bubble, index) => {
      const delay = index * 1000
      const duration = 3000 + Math.random() * 2000
      
      const animate = () => {
        bubble.style.animation = `bubbleRise ${duration}ms ease-in-out infinite`
        bubble.style.animationDelay = `${delay}ms`
      }
      
      animate()
    })
  }, [])

  return (
    <div className={`tron-beaker ${className}`} ref={beakerRef}>
      <svg width={size} height={size} viewBox="0 0 200 200" className="drop-shadow-2xl">
        <defs>
          {/* Gradienti */}
          <linearGradient id="liquidGreen" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#39ff14" stopOpacity="0.9" />
            <stop offset="50%" stopColor="#00ff88" stopOpacity="0.8" />
            <stop offset="100%" stopColor="#00cc44" stopOpacity="0.7" />
          </linearGradient>

          <linearGradient id="glassGradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#00ffff" stopOpacity="0.3" />
            <stop offset="100%" stopColor="#0066ff" stopOpacity="0.6" />
          </linearGradient>

          {/* Filtri glow */}
          <filter id="neonGlow" x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur stdDeviation="3" result="coloredBlur"/>
            <feMerge> 
              <feMergeNode in="coloredBlur"/>
              <feMergeNode in="SourceGraphic"/>
            </feMerge>
          </filter>

          <filter id="liquidGlow" x="-20%" y="-20%" width="140%" height="140%">
            <feGaussianBlur stdDeviation="2" result="coloredBlur"/>
            <feMerge> 
              <feMergeNode in="coloredBlur"/>
              <feMergeNode in="SourceGraphic"/>
            </feMerge>
          </filter>

          {/* Pattern circuitale */}
          <pattern id="circuitPattern" x="0" y="0" width="20" height="20" patternUnits="userSpaceOnUse">
            <rect width="20" height="20" fill="none"/>
            <path d="M0,10 L20,10 M10,0 L10,20" stroke="#00ffff" strokeWidth="0.5" opacity="0.2"/>
          </pattern>
        </defs>

        {/* Sfondo con pattern */}
        <rect width="200" height="200" fill="url(#circuitPattern)" opacity="0.1"/>

        {/* Corpo della beuta (triangolare) */}
        <path 
          d="M70 80 L50 160 L150 160 L130 80 Z" 
          fill="none" 
          stroke="url(#glassGradient)" 
          strokeWidth="3" 
          filter="url(#neonGlow)"
          className="glass-surface"
        />

        {/* Collo della beuta */}
        <rect 
          x="85" 
          y="60" 
          width="30" 
          height="25" 
          fill="none" 
          stroke="url(#glassGradient)" 
          strokeWidth="3" 
          filter="url(#neonGlow)"
          rx="2"
        />

        {/* Apertura */}
        <ellipse 
          cx="100" 
          cy="60" 
          rx="18" 
          ry="3" 
          fill="none" 
          stroke="url(#glassGradient)" 
          strokeWidth="2" 
          filter="url(#neonGlow)"
        />

        {/* Liquido verde */}
        <path 
          d="M55 150 L145 150 L135 90 L65 90 Z" 
          fill="url(#liquidGreen)" 
          filter="url(#liquidGlow)"
          className="liquid-surface"
        >
          {/* Animazione ondeggiante del liquido */}
          <animate 
            attributeName="opacity" 
            values="0.7;1;0.8;1;0.7" 
            dur="4s" 
            repeatCount="indefinite"
          />
        </path>

        {/* Superficie del liquido ondeggiante */}
        <path 
          d="M65 90 Q85 85 100 90 T135 90" 
          fill="none" 
          stroke="#39ff14" 
          strokeWidth="2" 
          filter="url(#liquidGlow)"
        >
          <animate 
            attributeName="d" 
            values="M65 90 Q85 85 100 90 T135 90;M65 90 Q85 95 100 90 T135 90;M65 90 Q85 85 100 90 T135 90" 
            dur="3s" 
            repeatCount="indefinite"
          />
        </path>

        {/* Bolle animate */}
        <g className="bubbles-container">
          <circle className="bubble" cx="80" cy="140" r="2" fill="#39ff14" opacity="0">
            <animate attributeName="cy" values="140;70;140" dur="4s" repeatCount="indefinite"/>
            <animate attributeName="opacity" values="0;1;0.5;0" dur="4s" repeatCount="indefinite"/>
            <animate attributeName="r" values="1;3;1" dur="4s" repeatCount="indefinite"/>
          </circle>
          
          <circle className="bubble" cx="120" cy="130" r="1.5" fill="#00ff88" opacity="0">
            <animate attributeName="cy" values="130;65;130" dur="5s" repeatCount="indefinite"/>
            <animate attributeName="opacity" values="0;0.8;0.3;0" dur="5s" repeatCount="indefinite"/>
            <animate attributeName="r" values="1;2.5;1" dur="5s" repeatCount="indefinite"/>
          </circle>

          <circle className="bubble" cx="95" cy="135" r="1" fill="#39ff14" opacity="0">
            <animate attributeName="cy" values="135;72;135" dur="3.5s" repeatCount="indefinite"/>
            <animate attributeName="opacity" values="0;1;0.4;0" dur="3.5s" repeatCount="indefinite"/>
            <animate attributeName="r" values="0.5;2;0.5" dur="3.5s" repeatCount="indefinite"/>
          </circle>

          <circle className="bubble" cx="110" cy="125" r="0.8" fill="#00cc44" opacity="0">
            <animate attributeName="cy" values="125;68;125" dur="4.5s" repeatCount="indefinite"/>
            <animate attributeName="opacity" values="0;0.9;0.2;0" dur="4.5s" repeatCount="indefinite"/>
            <animate attributeName="r" values="0.3;1.8;0.3" dur="4.5s" repeatCount="indefinite"/>
          </circle>
        </g>

        {/* Riflessi sulla superficie del vetro */}
        <path 
          d="M75 85 Q85 80 95 85 T115 85" 
          fill="none" 
          stroke="#00ffff" 
          strokeWidth="1" 
          opacity="0.4"
        >
          <animate attributeName="opacity" values="0.2;0.6;0.2" dur="6s" repeatCount="indefinite"/>
        </path>

        {/* Etichetta Tron */}
        <rect x="45" y="100" width="30" height="15" fill="rgba(0,255,255,0.1)" stroke="#00ffff" strokeWidth="1" rx="2"/>
        <text x="60" y="110" fill="#00ffff" fontSize="6" textAnchor="middle" fontFamily="monospace">
          CHM
        </text>
      </svg>

      <style jsx>{`
        .tron-beaker {
          position: relative;
          filter: drop-shadow(0 0 20px rgba(0, 255, 136, 0.3));
        }

        .glass-surface {
          stroke-dasharray: 300;
          stroke-dashoffset: 300;
          animation: drawGlass 3s ease-out forwards;
        }

        .liquid-surface {
          transform-origin: center;
        }

        @keyframes drawGlass {
          to {
            stroke-dashoffset: 0;
          }
        }

        @keyframes bubbleRise {
          0% {
            opacity: 0;
            transform: translateY(0) scale(0.5);
          }
          10% {
            opacity: 1;
          }
          90% {
            opacity: 0.3;
          }
          100% {
            opacity: 0;
            transform: translateY(-60px) scale(1.2);
          }
        }

        .tron-beaker:hover {
          filter: drop-shadow(0 0 30px rgba(0, 255, 136, 0.5));
          transform: scale(1.02);
          transition: all 0.3s ease;
        }
      `}</style>
    </div>
  )
}