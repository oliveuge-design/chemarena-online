import { useRouter } from 'next/router'
import { useState } from 'react'

export default function TronButton({
  title,
  subtitle,
  icon,
  href,
  onClick,
  variant = "primary",
  className = "",
  disabled = false
}) {
  const router = useRouter()
  const [isHovered, setIsHovered] = useState(false)
  const [isPressed, setIsPressed] = useState(false)

  const handleClick = () => {
    if (disabled) return
    
    if (onClick) {
      onClick()
    } else if (href) {
      router.push(href)
    }
  }

  const variants = {
    primary: {
      bg: "rgba(0, 255, 255, 0.1)",
      border: "#00ffff",
      text: "#00ffff",
      hover: "rgba(0, 255, 255, 0.2)",
      glow: "rgba(0, 255, 255, 0.4)"
    },
    secondary: {
      bg: "rgba(0, 255, 136, 0.1)",
      border: "#00ff88",
      text: "#00ff88",
      hover: "rgba(0, 255, 136, 0.2)",
      glow: "rgba(0, 255, 136, 0.4)"
    },
    accent: {
      bg: "rgba(57, 255, 20, 0.1)",
      border: "#39ff14",
      text: "#39ff14",
      hover: "rgba(57, 255, 20, 0.2)",
      glow: "rgba(57, 255, 20, 0.4)"
    }
  }

  const style = variants[variant]

  // Gestione eventi touch avanzati
  const handleTouchStart = (e) => {
    if (disabled) return
    setIsHovered(true)
    setIsPressed(true)

    // Impedisce lo scrolling durante il touch
    e.preventDefault()

    // Vibrazione feedback (se supportata)
    if (navigator.vibrate) {
      navigator.vibrate(50)
    }
  }

  const handleTouchEnd = () => {
    setIsHovered(false)
    setIsPressed(false)
  }

  const handleMouseDown = () => {
    if (disabled) return
    setIsPressed(true)
  }

  const handleMouseUp = () => {
    setIsPressed(false)
  }

  return (
    <button
      onClick={handleClick}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onMouseDown={handleMouseDown}
      onMouseUp={handleMouseUp}
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
      disabled={disabled}
      className={`tron-button ${className} ${disabled ? 'disabled' : ''} ${isPressed ? 'pressed' : ''}`}
    >
      <div className="button-content">
        {icon && <div className="icon">{icon}</div>}
        <div className="text-content">
          <div className="title">{title}</div>
          {subtitle && <div className="subtitle">{subtitle}</div>}
        </div>
        <div className="arrow">▶</div>
      </div>

      {/* Effetti particellari */}
      <div className="particle-effect">
        {[...Array(6)].map((_, i) => (
          <div key={i} className={`particle particle-${i}`} />
        ))}
      </div>

      {/* Linee di circuito */}
      <div className="circuit-lines">
        <div className="line line-top" />
        <div className="line line-bottom" />
        <div className="line line-left" />
        <div className="line line-right" />
      </div>

      <style jsx>{`
        .tron-button {
          position: relative;
          width: 100%;
          max-width: 400px;
          height: 80px;
          background: ${style.bg};
          border: 2px solid ${style.border};
          backdrop-filter: blur(10px);
          cursor: pointer;
          transition: all 0.3s ease;
          overflow: hidden;
          clip-path: polygon(0 0, calc(100% - 15px) 0, 100% 15px, 100% 100%, 15px 100%, 0 calc(100% - 15px));
          font-family: 'Orbitron', 'Courier New', monospace;

          /* Touch-friendly sizing */
          min-height: 44px;
          -webkit-tap-highlight-color: transparent;
          touch-action: manipulation;
        }

        /* Mobile optimizations */
        @media (max-width: 768px) {
          .tron-button {
            height: 90px;
            max-width: 100%;
            border-width: 3px;
          }

          .button-content {
            padding: 0 24px;
          }

          .title {
            font-size: 20px;
          }

          .subtitle {
            font-size: 14px;
          }

          .icon {
            font-size: 28px;
            margin-right: 18px;
          }

          .arrow {
            font-size: 18px;
            margin-left: 18px;
          }
        }

        @media (max-width: 480px) {
          .tron-button {
            height: 100px;
            border-width: 4px;
          }

          .button-content {
            padding: 0 28px;
          }

          .title {
            font-size: 22px;
          }

          .subtitle {
            font-size: 16px;
          }

          .icon {
            font-size: 32px;
            margin-right: 20px;
          }
        }

        .tron-button:hover {
          background: ${style.hover};
          box-shadow: 
            0 0 20px ${style.glow},
            inset 0 0 20px rgba(255, 255, 255, 0.05);
          transform: translateY(-2px) scale(1.02);
          border-color: ${style.text};
        }

        .tron-button:active,
        .tron-button.pressed {
          transform: translateY(0) scale(0.98);
          background: ${style.hover};
          box-shadow:
            0 0 30px ${style.glow},
            inset 0 0 30px rgba(255, 255, 255, 0.1);
        }

        .tron-button.disabled {
          opacity: 0.5;
          cursor: not-allowed;
          transform: none !important;
        }

        /* Ottimizzazioni performance mobile */
        .tron-button {
          will-change: transform, background-color, box-shadow;
          -webkit-transform: translateZ(0);
          transform: translateZ(0);
          -webkit-backface-visibility: hidden;
          backface-visibility: hidden;
        }

        /* Migliore feedback tattile */
        @media (hover: none) and (pointer: coarse) {
          .tron-button:hover {
            transform: none;
            background: ${style.bg};
            box-shadow: none;
          }

          .tron-button.pressed {
            transform: scale(0.95);
            background: ${style.hover};
            box-shadow:
              0 0 20px ${style.glow},
              inset 0 0 20px rgba(255, 255, 255, 0.1);
          }

          .particle-effect,
          .circuit-lines {
            display: none; /* Disabilita effetti su mobile per performance */
          }
        }

        .button-content {
          position: relative;
          z-index: 2;
          height: 100%;
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 0 20px;
        }

        .icon {
          font-size: 24px;
          color: ${style.text};
          margin-right: 15px;
          transition: all 0.3s ease;
        }

        .text-content {
          flex: 1;
          text-align: left;
        }

        .title {
          font-size: 18px;
          font-weight: bold;
          color: ${style.text};
          margin-bottom: 2px;
          text-transform: uppercase;
          letter-spacing: 1px;
          text-shadow: 0 0 10px currentColor;
        }

        .subtitle {
          font-size: 12px;
          color: ${style.text};
          opacity: 0.7;
          text-transform: none;
          letter-spacing: 0.5px;
        }

        .arrow {
          font-size: 16px;
          color: ${style.text};
          transition: all 0.3s ease;
          margin-left: 15px;
        }

        .tron-button:hover .arrow {
          transform: translateX(5px);
          text-shadow: 0 0 10px currentColor;
        }

        .tron-button:hover .icon {
          transform: scale(1.2) rotate(5deg);
          text-shadow: 0 0 15px currentColor;
        }

        /* Particelle animate */
        .particle-effect {
          position: absolute;
          inset: 0;
          pointer-events: none;
          opacity: 0;
          transition: opacity 0.3s ease;
        }

        .tron-button:hover .particle-effect {
          opacity: 1;
        }

        .particle {
          position: absolute;
          width: 2px;
          height: 2px;
          background: ${style.text};
          border-radius: 50%;
          animation: particleFloat 3s infinite ease-in-out;
        }

        .particle-0 { top: 20%; left: 10%; animation-delay: 0s; }
        .particle-1 { top: 60%; left: 20%; animation-delay: 0.5s; }
        .particle-2 { top: 30%; right: 15%; animation-delay: 1s; }
        .particle-3 { bottom: 25%; right: 20%; animation-delay: 1.5s; }
        .particle-4 { bottom: 50%; left: 15%; animation-delay: 2s; }
        .particle-5 { top: 70%; right: 30%; animation-delay: 2.5s; }

        @keyframes particleFloat {
          0%, 100% {
            opacity: 0;
            transform: translateY(0) scale(0.5);
          }
          50% {
            opacity: 1;
            transform: translateY(-10px) scale(1);
          }
        }

        /* Linee di circuito */
        .circuit-lines {
          position: absolute;
          inset: 0;
          pointer-events: none;
          opacity: 0;
          transition: opacity 0.3s ease;
        }

        .tron-button:hover .circuit-lines {
          opacity: 0.6;
        }

        .line {
          position: absolute;
          background: ${style.text};
          opacity: 0.3;
        }

        .line-top {
          top: 5px;
          left: 20px;
          width: 60px;
          height: 1px;
          animation: lineGlow 2s infinite ease-in-out;
        }

        .line-bottom {
          bottom: 5px;
          right: 20px;
          width: 80px;
          height: 1px;
          animation: lineGlow 2s infinite ease-in-out reverse;
        }

        .line-left {
          left: 5px;
          top: 20px;
          width: 1px;
          height: 40px;
          animation: lineGlow 2.5s infinite ease-in-out;
        }

        .line-right {
          right: 5px;
          bottom: 15px;
          width: 1px;
          height: 35px;
          animation: lineGlow 2.5s infinite ease-in-out reverse;
        }

        @keyframes lineGlow {
          0%, 100% {
            box-shadow: 0 0 2px currentColor;
          }
          50% {
            box-shadow: 0 0 8px currentColor, 0 0 12px currentColor;
          }
        }

        /* Effetto scan */
        .tron-button::before {
          content: '';
          position: absolute;
          top: 0;
          left: -100%;
          width: 100%;
          height: 100%;
          background: linear-gradient(
            90deg,
            transparent,
            rgba(255, 255, 255, 0.1),
            transparent
          );
          transition: left 0.5s ease;
          z-index: 1;
        }

        .tron-button:hover::before {
          left: 100%;
        }

        /* Bordi animati */
        .tron-button::after {
          content: '';
          position: absolute;
          inset: -2px;
          background: linear-gradient(45deg, 
            ${style.border}, 
            transparent, 
            transparent, 
            ${style.border}
          );
          background-size: 400% 400%;
          animation: borderGlow 4s ease-in-out infinite;
          clip-path: polygon(0 0, calc(100% - 15px) 0, 100% 15px, 100% 100%, 15px 100%, 0 calc(100% - 15px));
          z-index: -1;
          opacity: 0;
          transition: opacity 0.3s ease;
        }

        .tron-button:hover::after {
          opacity: 0.7;
        }

        @keyframes borderGlow {
          0%, 100% {
            background-position: 0% 50%;
          }
          50% {
            background-position: 100% 50%;
          }
        }
      `}</style>
    </button>
  )
}