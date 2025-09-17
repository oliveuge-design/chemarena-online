import { useState, useEffect } from "react"

export default function RealisticScientist({
  position = 1,
  username = "Scienziato",
  className = "",
  size = "medium"
}) {
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    setIsVisible(true)
  }, [])

  const getAnimationType = () => {
    if (position === 1) return 'victory'
    if (position === 2) return 'happy'
    if (position === 3) return 'neutral'
    return 'disappointed'
  }

  const getSizeClass = () => {
    switch(size) {
      case 'small': return 'scale-75'
      case 'large': return 'scale-125'
      default: return 'scale-100'
    }
  }

  const animationType = getAnimationType()

  return (
    <div className={`realistic-scientist ${getSizeClass()} ${className}`}>
      <div className={`scientist-container ${animationType} ${isVisible ? 'appear' : ''}`}>
        {/* Character Body */}
        <div className="character-body">
          {/* Head */}
          <div className="head">
            <div className="face">
              <div className="hair"></div>
              <div className="glasses">
                <div className="lens left"></div>
                <div className="lens right"></div>
                <div className="bridge"></div>
              </div>
              <div className="eyes">
                <div className="eye left">
                  <div className="pupil"></div>
                </div>
                <div className="eye right">
                  <div className="pupil"></div>
                </div>
              </div>
              <div className="nose"></div>
              <div className="mouth"></div>
            </div>
          </div>

          {/* Body */}
          <div className="torso">
            <div className="lab-coat">
              <div className="coat-collar"></div>
              <div className="coat-buttons">
                <div className="button"></div>
                <div className="button"></div>
                <div className="button"></div>
              </div>
            </div>
          </div>

          {/* Arms */}
          <div className="arms">
            <div className="arm left">
              <div className="upper-arm"></div>
              <div className="forearm"></div>
              <div className="hand"></div>
            </div>
            <div className="arm right">
              <div className="upper-arm"></div>
              <div className="forearm"></div>
              <div className="hand"></div>
            </div>
          </div>

          {/* Tablet/Device */}
          <div className="tablet">
            <div className="screen"></div>
          </div>
        </div>

        {/* Particle Effects */}
        <div className="particles">
          {[...Array(8)].map((_, i) => (
            <div key={i} className={`particle particle-${i}`}></div>
          ))}
        </div>
      </div>

      <style jsx>{`
        .realistic-scientist {
          position: relative;
          width: 80px;
          height: 80px;
          transition: all 0.3s ease;
        }

        .scientist-container {
          position: relative;
          width: 100%;
          height: 100%;
          transform-origin: center bottom;
          opacity: 0;
          transform: translateY(20px) scale(0.8);
          transition: all 0.6s cubic-bezier(0.4, 0, 0.2, 1);
        }

        .scientist-container.appear {
          opacity: 1;
          transform: translateY(0) scale(1);
        }

        /* Character Body */
        .character-body {
          position: relative;
          width: 100%;
          height: 100%;
        }

        /* Head */
        .head {
          position: absolute;
          top: 5px;
          left: 50%;
          transform: translateX(-50%);
          width: 32px;
          height: 32px;
          z-index: 3;
        }

        .face {
          position: relative;
          width: 100%;
          height: 100%;
          background: linear-gradient(145deg, #fdbcb4, #f4a99c);
          border-radius: 50%;
          box-shadow:
            inset 0 2px 4px rgba(255,255,255,0.3),
            0 4px 8px rgba(0,0,0,0.1);
        }

        /* Hair */
        .hair {
          position: absolute;
          top: -8px;
          left: 50%;
          transform: translateX(-50%);
          width: 36px;
          height: 20px;
          background: linear-gradient(135deg, #8B4513, #A0522D);
          border-radius: 18px 18px 12px 12px;
          z-index: -1;
        }

        .hair::before {
          content: '';
          position: absolute;
          top: 8px;
          right: -3px;
          width: 8px;
          height: 8px;
          background: inherit;
          border-radius: 50%;
        }

        .hair::after {
          content: '';
          position: absolute;
          top: 6px;
          left: -2px;
          width: 6px;
          height: 6px;
          background: inherit;
          border-radius: 50%;
        }

        /* Glasses */
        .glasses {
          position: absolute;
          top: 8px;
          left: 50%;
          transform: translateX(-50%);
          width: 28px;
          height: 12px;
          z-index: 2;
        }

        .lens {
          position: absolute;
          width: 10px;
          height: 10px;
          background: rgba(255,255,255,0.1);
          border: 2px solid #333;
          border-radius: 50%;
          backdrop-filter: blur(1px);
        }

        .lens.left { left: 2px; }
        .lens.right { right: 2px; }

        .bridge {
          position: absolute;
          top: 4px;
          left: 50%;
          transform: translateX(-50%);
          width: 4px;
          height: 2px;
          background: #333;
          border-radius: 1px;
        }

        /* Eyes */
        .eyes {
          position: absolute;
          top: 10px;
          left: 50%;
          transform: translateX(-50%);
          width: 20px;
          height: 6px;
        }

        .eye {
          position: absolute;
          width: 6px;
          height: 4px;
          background: white;
          border-radius: 50%;
          overflow: hidden;
        }

        .eye.left { left: 2px; }
        .eye.right { right: 2px; }

        .pupil {
          position: absolute;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
          width: 3px;
          height: 3px;
          background: #333;
          border-radius: 50%;
        }

        /* Nose */
        .nose {
          position: absolute;
          top: 16px;
          left: 50%;
          transform: translateX(-50%);
          width: 2px;
          height: 3px;
          background: rgba(0,0,0,0.1);
          border-radius: 1px;
        }

        /* Mouth */
        .mouth {
          position: absolute;
          top: 22px;
          left: 50%;
          transform: translateX(-50%);
          width: 8px;
          height: 3px;
          border-radius: 0 0 8px 8px;
          border: 1px solid rgba(0,0,0,0.3);
          border-top: none;
        }

        /* Body */
        .torso {
          position: absolute;
          top: 35px;
          left: 50%;
          transform: translateX(-50%);
          width: 28px;
          height: 30px;
          z-index: 2;
        }

        .lab-coat {
          position: relative;
          width: 100%;
          height: 100%;
          background: linear-gradient(145deg, #ffffff, #f5f5f5);
          border-radius: 8px 8px 12px 12px;
          box-shadow:
            0 4px 8px rgba(0,0,0,0.1),
            inset 0 2px 4px rgba(255,255,255,0.5);
        }

        .coat-collar {
          position: absolute;
          top: 0;
          left: 50%;
          transform: translateX(-50%);
          width: 24px;
          height: 8px;
          background: linear-gradient(145deg, #f0f0f0, #e0e0e0);
          border-radius: 4px 4px 0 0;
        }

        .coat-buttons {
          position: absolute;
          top: 8px;
          left: 50%;
          transform: translateX(-50%);
          display: flex;
          flex-direction: column;
          gap: 3px;
        }

        .button {
          width: 3px;
          height: 3px;
          background: #007acc;
          border-radius: 50%;
          box-shadow: 0 1px 2px rgba(0,0,0,0.2);
        }

        /* Arms */
        .arms {
          position: absolute;
          top: 40px;
          left: 50%;
          transform: translateX(-50%);
          width: 40px;
          height: 25px;
          z-index: 1;
        }

        .arm {
          position: absolute;
          width: 12px;
          height: 100%;
        }

        .arm.left { left: 0; }
        .arm.right { right: 0; }

        .upper-arm {
          position: absolute;
          top: 0;
          width: 8px;
          height: 12px;
          background: linear-gradient(145deg, #ffffff, #f0f0f0);
          border-radius: 4px;
        }

        .forearm {
          position: absolute;
          top: 10px;
          width: 6px;
          height: 10px;
          background: #fdbcb4;
          border-radius: 3px;
        }

        .hand {
          position: absolute;
          bottom: 0;
          width: 4px;
          height: 4px;
          background: #fdbcb4;
          border-radius: 50%;
        }

        /* Tablet */
        .tablet {
          position: absolute;
          top: 45px;
          left: 50%;
          transform: translateX(-50%);
          width: 12px;
          height: 8px;
          z-index: 3;
        }

        .screen {
          width: 100%;
          height: 100%;
          background: linear-gradient(135deg, #007acc, #0099ff);
          border-radius: 2px;
          box-shadow: 0 2px 4px rgba(0,0,0,0.2);
        }

        .screen::before {
          content: '';
          position: absolute;
          top: 1px;
          left: 1px;
          right: 1px;
          bottom: 1px;
          background: linear-gradient(45deg, rgba(255,255,255,0.3), transparent);
          border-radius: 1px;
        }

        /* Particles */
        .particles {
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          pointer-events: none;
          z-index: 4;
        }

        .particle {
          position: absolute;
          width: 3px;
          height: 3px;
          border-radius: 50%;
          opacity: 0;
        }

        /* Animation States */
        .scientist-container.victory {
          animation: victory-bounce 2s ease-in-out infinite;
        }

        .victory .particle {
          background: linear-gradient(45deg, #ffd700, #ffed4e);
          animation: victory-particles 2s ease-out infinite;
        }

        .scientist-container.happy {
          animation: happy-sway 3s ease-in-out infinite;
        }

        .happy .particle {
          background: linear-gradient(45deg, #00ff88, #00bfff);
          animation: happy-particles 3s ease-out infinite;
        }

        .scientist-container.neutral {
          animation: neutral-float 4s ease-in-out infinite;
        }

        .neutral .particle {
          background: linear-gradient(45deg, #88c999, #a8e6cf);
          animation: neutral-particles 4s ease-out infinite;
        }

        .scientist-container.disappointed {
          animation: disappointed-droop 3s ease-in-out infinite;
        }

        .disappointed .particle {
          background: linear-gradient(45deg, #888, #aaa);
          animation: disappointed-particles 3s ease-out infinite;
        }

        /* Victory Animation */
        @keyframes victory-bounce {
          0%, 100% { transform: translateY(0) scale(1); }
          25% { transform: translateY(-8px) scale(1.05); }
          50% { transform: translateY(-4px) scale(1.02); }
          75% { transform: translateY(-6px) scale(1.03); }
        }

        @keyframes victory-particles {
          0% { opacity: 0; transform: translate(0, 0) scale(0); }
          20% { opacity: 1; transform: translate(var(--particle-x, 0), var(--particle-y, 0)) scale(1); }
          100% { opacity: 0; transform: translate(calc(var(--particle-x, 0) * 2), calc(var(--particle-y, 0) * 2)) scale(0); }
        }

        /* Happy Animation */
        @keyframes happy-sway {
          0%, 100% { transform: rotate(0deg) scale(1); }
          25% { transform: rotate(2deg) scale(1.01); }
          75% { transform: rotate(-2deg) scale(1.01); }
        }

        @keyframes happy-particles {
          0% { opacity: 0; transform: translate(0, 0) rotate(0deg); }
          30% { opacity: 0.8; }
          100% { opacity: 0; transform: translate(var(--particle-x, 0), var(--particle-y, 0)) rotate(360deg); }
        }

        /* Neutral Animation */
        @keyframes neutral-float {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-2px); }
        }

        @keyframes neutral-particles {
          0% { opacity: 0; transform: translate(0, 0); }
          50% { opacity: 0.4; }
          100% { opacity: 0; transform: translate(var(--particle-x, 0), var(--particle-y, 0)); }
        }

        /* Disappointed Animation */
        @keyframes disappointed-droop {
          0%, 100% { transform: translateY(0) scale(1); }
          50% { transform: translateY(2px) scale(0.98); }
        }

        @keyframes disappointed-particles {
          0% { opacity: 0; transform: translate(0, 0); }
          20% { opacity: 0.3; }
          100% { opacity: 0; transform: translate(0, 20px); }
        }

        /* Particle Positions */
        .particle-0 { --particle-x: -15px; --particle-y: -10px; animation-delay: 0s; }
        .particle-1 { --particle-x: 15px; --particle-y: -8px; animation-delay: 0.2s; }
        .particle-2 { --particle-x: -10px; --particle-y: -15px; animation-delay: 0.4s; }
        .particle-3 { --particle-x: 10px; --particle-y: -12px; animation-delay: 0.6s; }
        .particle-4 { --particle-x: -20px; --particle-y: -5px; animation-delay: 0.8s; }
        .particle-5 { --particle-x: 20px; --particle-y: -7px; animation-delay: 1s; }
        .particle-6 { --particle-x: 0px; --particle-y: -18px; animation-delay: 1.2s; }
        .particle-7 { --particle-x: -5px; --particle-y: -20px; animation-delay: 1.4s; }

        /* Responsive */
        @media (max-width: 768px) {
          .realistic-scientist {
            width: 70px;
            height: 70px;
          }
        }

        /* Accessibility */
        @media (prefers-reduced-motion: reduce) {
          .scientist-container {
            animation: none !important;
          }
          .particle {
            animation: none !important;
            opacity: 0 !important;
          }
        }
      `}</style>
    </div>
  )
}