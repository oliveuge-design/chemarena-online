import React from 'react';

const TronScientist = ({ position, isWinner, isLoser }) => {
  // Determina l'animazione in base alla posizione
  const getAnimationType = () => {
    if (position === 1) return 'celebrate'; // 1° posto - esultanza
    if (position === 2) return 'party';     // 2° posto - festa
    if (position === 3) return 'chill';     // 3° posto - rilassato
    return 'sad';                           // Altri - triste
  };

  const animationType = getAnimationType();

  return (
    <div className={`tron-scientist ${animationType} relative`}>
      {/* Corpo principale scienziato */}
      <div className="scientist-body">
        {/* Testa */}
        <div className="head">
          <div className="helmet">
            {/* Visiera */}
            <div className="visor"></div>
            {/* HUD Lines */}
            <div className="hud-lines">
              <div className="hud-line line-1"></div>
              <div className="hud-line line-2"></div>
              <div className="hud-line line-3"></div>
            </div>
            {/* Scanner occhi */}
            <div className="eye-scanner left-eye"></div>
            <div className="eye-scanner right-eye"></div>
          </div>
        </div>

        {/* Torso con tuta */}
        <div className="torso">
          {/* Pannello chest */}
          <div className="chest-panel">
            <div className="power-core"></div>
            <div className="status-lights">
              <div className="status-light light-1"></div>
              <div className="status-light light-2"></div>
              <div className="status-light light-3"></div>
            </div>
          </div>

          {/* Circuiti tuta */}
          <div className="suit-circuits">
            <div className="circuit-line vertical-left"></div>
            <div className="circuit-line vertical-right"></div>
            <div className="circuit-line horizontal-top"></div>
            <div className="circuit-line horizontal-bottom"></div>
          </div>
        </div>

        {/* Braccia */}
        <div className="arms">
          <div className="arm left-arm">
            <div className="arm-circuit"></div>
          </div>
          <div className="arm right-arm">
            <div className="arm-circuit"></div>
          </div>
        </div>

        {/* Gambe */}
        <div className="legs">
          <div className="leg left-leg">
            <div className="leg-circuit"></div>
          </div>
          <div className="leg right-leg">
            <div className="leg-circuit"></div>
          </div>
        </div>
      </div>

      {/* Effetti particellari per animazioni */}
      {animationType === 'celebrate' && (
        <div className="celebration-effects">
          <div className="spark spark-1"></div>
          <div className="spark spark-2"></div>
          <div className="spark spark-3"></div>
          <div className="spark spark-4"></div>
        </div>
      )}

      {animationType === 'party' && (
        <div className="party-effects">
          <div className="confetti confetti-1"></div>
          <div className="confetti confetti-2"></div>
          <div className="confetti confetti-3"></div>
        </div>
      )}

      <style jsx>{`
        .tron-scientist {
          width: 80px;
          height: 120px;
          position: relative;
          transform-style: preserve-3d;
          transition: all 0.3s ease;
        }

        /* Corpo principale */
        .scientist-body {
          width: 100%;
          height: 100%;
          position: relative;
        }

        /* TESTA & CASCO */
        .head {
          width: 32px;
          height: 32px;
          position: absolute;
          top: 0;
          left: 50%;
          transform: translateX(-50%);
        }

        .helmet {
          width: 100%;
          height: 100%;
          background: linear-gradient(145deg, #f0f0f0 0%, #e0e0e0 50%, #d0d0d0 100%);
          border: 2px solid #00bfff;
          border-radius: 50%;
          position: relative;
          box-shadow:
            0 0 15px rgba(0, 191, 255, 0.6),
            inset 0 0 10px rgba(0, 191, 255, 0.2);
          overflow: hidden;
        }

        .visor {
          width: 24px;
          height: 14px;
          background: linear-gradient(135deg, #001133 0%, #003366 50%, #0066cc 100%);
          border: 1px solid #00bfff;
          border-radius: 12px;
          position: absolute;
          top: 6px;
          left: 50%;
          transform: translateX(-50%);
          box-shadow:
            0 0 8px rgba(0, 191, 255, 0.8),
            inset 0 0 5px rgba(0, 191, 255, 0.3);
        }

        /* HUD Lines */
        .hud-lines {
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
        }

        .hud-line {
          position: absolute;
          background: #00ffff;
          box-shadow: 0 0 3px #00ffff;
          animation: hud-pulse 2s ease-in-out infinite;
        }

        .line-1 {
          width: 12px;
          height: 1px;
          top: 8px;
          left: 2px;
        }

        .line-2 {
          width: 8px;
          height: 1px;
          top: 12px;
          right: 3px;
          animation-delay: 0.3s;
        }

        .line-3 {
          width: 1px;
          height: 6px;
          bottom: 4px;
          left: 6px;
          animation-delay: 0.6s;
        }

        /* Scanner occhi */
        .eye-scanner {
          width: 4px;
          height: 4px;
          background: #00ffff;
          border-radius: 50%;
          position: absolute;
          top: 10px;
          animation: scanner-blink 1.5s ease-in-out infinite;
          box-shadow: 0 0 5px #00ffff;
        }

        .left-eye {
          left: 8px;
        }

        .right-eye {
          right: 8px;
          animation-delay: 0.7s;
        }

        /* TORSO */
        .torso {
          width: 28px;
          height: 40px;
          position: absolute;
          top: 28px;
          left: 50%;
          transform: translateX(-50%);
          background: linear-gradient(145deg, #f8f8f8 0%, #e8e8e8 50%, #d8d8d8 100%);
          border: 2px solid #00bfff;
          border-radius: 8px;
          box-shadow:
            0 0 12px rgba(0, 191, 255, 0.5),
            inset 0 0 8px rgba(0, 191, 255, 0.1);
        }

        .chest-panel {
          width: 16px;
          height: 20px;
          position: absolute;
          top: 4px;
          left: 50%;
          transform: translateX(-50%);
          background: rgba(0, 0, 0, 0.2);
          border: 1px solid #00bfff;
          border-radius: 4px;
        }

        .power-core {
          width: 8px;
          height: 8px;
          background: radial-gradient(circle, #00ffff 0%, #0080ff  70%, #004080 100%);
          border-radius: 50%;
          position: absolute;
          top: 2px;
          left: 50%;
          transform: translateX(-50%);
          animation: power-pulse 1s ease-in-out infinite;
          box-shadow: 0 0 8px #00ffff;
        }

        .status-lights {
          position: absolute;
          bottom: 2px;
          left: 50%;
          transform: translateX(-50%);
          display: flex;
          gap: 2px;
        }

        .status-light {
          width: 2px;
          height: 2px;
          background: #00ff00;
          border-radius: 50%;
          animation: status-blink 0.8s ease-in-out infinite;
        }

        .light-2 {
          animation-delay: 0.2s;
        }

        .light-3 {
          animation-delay: 0.4s;
        }

        /* Circuiti tuta */
        .suit-circuits {
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
        }

        .circuit-line {
          position: absolute;
          background: #00bfff;
          box-shadow: 0 0 2px #00bfff;
          animation: circuit-flow 2s linear infinite;
        }

        .vertical-left {
          width: 1px;
          height: 20px;
          left: 4px;
          top: 8px;
        }

        .vertical-right {
          width: 1px;
          height: 20px;
          right: 4px;
          top: 8px;
          animation-delay: 0.5s;
        }

        .horizontal-top {
          width: 16px;
          height: 1px;
          top: 6px;
          left: 50%;
          transform: translateX(-50%);
          animation-delay: 1s;
        }

        .horizontal-bottom {
          width: 12px;
          height: 1px;
          bottom: 6px;
          left: 50%;
          transform: translateX(-50%);
          animation-delay: 1.5s;
        }

        /* BRACCIA */
        .arms {
          position: absolute;
          top: 32px;
          left: 50%;
          transform: translateX(-50%);
          width: 44px;
          height: 24px;
        }

        .arm {
          width: 12px;
          height: 24px;
          position: absolute;
          background: linear-gradient(145deg, #f0f0f0 0%, #d8d8d8 100%);
          border: 1px solid #00bfff;
          border-radius: 6px;
          box-shadow: 0 0 5px rgba(0, 191, 255, 0.3);
        }

        .left-arm {
          left: 0;
          transform-origin: top center;
        }

        .right-arm {
          right: 0;
          transform-origin: top center;
        }

        .arm-circuit {
          width: 1px;
          height: 16px;
          background: #00bfff;
          position: absolute;
          left: 50%;
          top: 2px;
          transform: translateX(-50%);
          animation: circuit-flow 1.5s linear infinite;
          box-shadow: 0 0 2px #00bfff;
        }

        /* GAMBE */
        .legs {
          position: absolute;
          top: 64px;
          left: 50%;
          transform: translateX(-50%);
          width: 24px;
          height: 32px;
        }

        .leg {
          width: 8px;
          height: 32px;
          position: absolute;
          background: linear-gradient(145deg, #f0f0f0 0%, #d8d8d8 100%);
          border: 1px solid #00bfff;
          border-radius: 4px;
          box-shadow: 0 0 5px rgba(0, 191, 255, 0.3);
        }

        .left-leg {
          left: 2px;
        }

        .right-leg {
          right: 2px;
        }

        .leg-circuit {
          width: 1px;
          height: 24px;
          background: #00bfff;
          position: absolute;
          left: 50%;
          top: 2px;
          transform: translateX(-50%);
          animation: circuit-flow 1.8s linear infinite;
          box-shadow: 0 0 2px #00bfff;
        }

        /* ANIMAZIONI BASE */
        @keyframes hud-pulse {
          0%, 100% { opacity: 0.6; }
          50% { opacity: 1; }
        }

        @keyframes scanner-blink {
          0%, 80%, 100% { opacity: 0.3; }
          10%, 70% { opacity: 1; }
        }

        @keyframes power-pulse {
          0%, 100% {
            transform: translateX(-50%) scale(1);
            box-shadow: 0 0 8px #00ffff;
          }
          50% {
            transform: translateX(-50%) scale(1.2);
            box-shadow: 0 0 12px #00ffff, 0 0 20px #0080ff;
          }
        }

        @keyframes status-blink {
          0%, 70%, 100% { opacity: 0.5; }
          10%, 60% { opacity: 1; }
        }

        @keyframes circuit-flow {
          0% {
            box-shadow: 0 0 2px #00bfff;
            filter: brightness(1);
          }
          50% {
            box-shadow: 0 0 6px #00ffff, 0 0 10px #0080ff;
            filter: brightness(1.5);
          }
          100% {
            box-shadow: 0 0 2px #00bfff;
            filter: brightness(1);
          }
        }

        /* ANIMAZIONI EMOTIVE */

        /* 1° POSTO - CELEBRATE (Esultanza) */
        .celebrate {
          animation: celebration-bounce 1.5s ease-in-out infinite;
        }

        .celebrate .head {
          animation: celebrate-head 2s ease-in-out infinite;
        }

        .celebrate .left-arm {
          animation: celebrate-left-arm 1.5s ease-in-out infinite;
        }

        .celebrate .right-arm {
          animation: celebrate-right-arm 1.5s ease-in-out infinite;
        }

        .celebrate .power-core {
          animation: celebrate-core 0.5s ease-in-out infinite;
          background: radial-gradient(circle, #ffff00 0%, #ff8800 70%, #ff4400 100%);
          box-shadow: 0 0 15px #ffff00;
        }

        /* 2° POSTO - PARTY (Festa) */
        .party {
          animation: party-sway 2s ease-in-out infinite;
        }

        .party .left-arm {
          animation: party-wave-left 2s ease-in-out infinite;
        }

        .party .right-arm {
          animation: party-wave-right 2s ease-in-out infinite;
        }

        .party .power-core {
          background: radial-gradient(circle, #00ff00 0%, #00cc00 70%, #008800 100%);
          animation: party-core 1s ease-in-out infinite;
        }

        /* 3° POSTO - CHILL (Rilassato) */
        .chill {
          animation: chill-gentle 3s ease-in-out infinite;
        }

        .chill .power-core {
          background: radial-gradient(circle, #00ffff 0%, #0088ff 70%, #0044aa 100%);
          animation: chill-core 2s ease-in-out infinite;
        }

        /* ALTRI POSTI - SAD (Triste) */
        .sad {
          animation: sad-slump 2s ease-in-out infinite;
          filter: grayscale(0.3);
        }

        .sad .head {
          animation: sad-head 3s ease-in-out infinite;
        }

        .sad .power-core {
          background: radial-gradient(circle, #666666 0%, #444444 70%, #222222 100%);
          animation: sad-core 2s ease-in-out infinite;
        }

        /* KEYFRAMES CELEBRATE */
        @keyframes celebration-bounce {
          0%, 100% { transform: translateY(0) scale(1); }
          25% { transform: translateY(-8px) scale(1.05); }
          50% { transform: translateY(-4px) scale(1.02); }
          75% { transform: translateY(-12px) scale(1.08); }
        }

        @keyframes celebrate-head {
          0%, 100% { transform: translateX(-50%) rotate(0deg); }
          25% { transform: translateX(-50%) rotate(-10deg); }
          75% { transform: translateX(-50%) rotate(10deg); }
        }

        @keyframes celebrate-left-arm {
          0%, 100% { transform: rotate(45deg); }
          50% { transform: rotate(90deg); }
        }

        @keyframes celebrate-right-arm {
          0%, 100% { transform: rotate(-45deg); }
          50% { transform: rotate(-90deg); }
        }

        @keyframes celebrate-core {
          0%, 100% {
            transform: translateX(-50%) scale(1);
            box-shadow: 0 0 15px #ffff00;
          }
          50% {
            transform: translateX(-50%) scale(1.3);
            box-shadow: 0 0 25px #ffff00, 0 0 35px #ff8800;
          }
        }

        /* KEYFRAMES PARTY */
        @keyframes party-sway {
          0%, 100% { transform: rotate(0deg); }
          25% { transform: rotate(3deg); }
          75% { transform: rotate(-3deg); }
        }

        @keyframes party-wave-left {
          0%, 100% { transform: rotate(20deg); }
          50% { transform: rotate(60deg); }
        }

        @keyframes party-wave-right {
          0%, 100% { transform: rotate(-20deg); }
          50% { transform: rotate(-60deg); }
        }

        @keyframes party-core {
          0%, 100% {
            box-shadow: 0 0 8px #00ff00;
          }
          50% {
            box-shadow: 0 0 15px #00ff00, 0 0 20px #00cc00;
          }
        }

        /* KEYFRAMES CHILL */
        @keyframes chill-gentle {
          0%, 100% { transform: translateY(0) rotate(0deg); }
          50% { transform: translateY(-2px) rotate(1deg); }
        }

        @keyframes chill-core {
          0%, 100% {
            box-shadow: 0 0 8px #00ffff;
          }
          50% {
            box-shadow: 0 0 12px #00ffff;
          }
        }

        /* KEYFRAMES SAD */
        @keyframes sad-slump {
          0%, 100% { transform: translateY(2px) rotate(0deg); }
          50% { transform: translateY(6px) rotate(-1deg); }
        }

        @keyframes sad-head {
          0%, 100% { transform: translateX(-50%) translateY(0); }
          50% { transform: translateX(-50%) translateY(2px); }
        }

        @keyframes sad-core {
          0%, 100% {
            box-shadow: 0 0 4px #666666;
            opacity: 0.7;
          }
          50% {
            box-shadow: 0 0 6px #666666;
            opacity: 0.5;
          }
        }

        /* EFFETTI PARTICELLARI */
        .celebration-effects {
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          pointer-events: none;
        }

        .spark {
          position: absolute;
          width: 3px;
          height: 3px;
          background: #ffff00;
          border-radius: 50%;
          animation: spark-explode 1s ease-out infinite;
          box-shadow: 0 0 5px #ffff00;
        }

        .spark-1 {
          top: 10px;
          left: 10px;
          animation-delay: 0s;
        }

        .spark-2 {
          top: 15px;
          right: 8px;
          animation-delay: 0.3s;
        }

        .spark-3 {
          bottom: 20px;
          left: 15px;
          animation-delay: 0.6s;
        }

        .spark-4 {
          bottom: 25px;
          right: 12px;
          animation-delay: 0.9s;
        }

        @keyframes spark-explode {
          0% {
            transform: scale(0) translateY(0);
            opacity: 1;
          }
          50% {
            transform: scale(1.5) translateY(-10px);
            opacity: 0.8;
          }
          100% {
            transform: scale(0) translateY(-20px);
            opacity: 0;
          }
        }

        .party-effects {
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          pointer-events: none;
        }

        .confetti {
          position: absolute;
          width: 2px;
          height: 6px;
          animation: confetti-fall 2s linear infinite;
        }

        .confetti-1 {
          background: #ff0080;
          left: 20px;
          animation-delay: 0s;
        }

        .confetti-2 {
          background: #00ff80;
          left: 40px;
          animation-delay: 0.7s;
        }

        .confetti-3 {
          background: #8000ff;
          left: 60px;
          animation-delay: 1.4s;
        }

        @keyframes confetti-fall {
          0% {
            transform: translateY(-20px) rotate(0deg);
            opacity: 1;
          }
          100% {
            transform: translateY(140px) rotate(360deg);
            opacity: 0;
          }
        }

        /* Responsive mobile */
        @media (max-width: 768px) {
          .tron-scientist {
            width: 60px;
            height: 90px;
          }

          .head {
            width: 24px;
            height: 24px;
          }

          .torso {
            width: 20px;
            height: 30px;
            top: 20px;
          }

          .arms {
            width: 32px;
            height: 18px;
            top: 24px;
          }

          .legs {
            width: 18px;
            height: 24px;
            top: 48px;
          }
        }

        /* Reduced motion per accessibilità */
        @media (prefers-reduced-motion: reduce) {
          .tron-scientist * {
            animation: none !important;
          }

          .tron-scientist {
            animation: none !important;
          }
        }
      `}</style>
    </div>
  );
};

export default TronScientist;