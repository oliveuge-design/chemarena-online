import Image from 'next/image'
import { useRouter } from 'next/router'
import { useState, useEffect } from 'react'
import TronButton from '@/components/TronButton'

export default function Home() {
  const router = useRouter()
  const [showQuickJoin, setShowQuickJoin] = useState(false)
  const [gamePin, setGamePin] = useState('')
  const [playerName, setPlayerName] = useState('')
  const [isQRAccess, setIsQRAccess] = useState(false)
  
  // Rileva accesso via QR code
  useEffect(() => {
    const { pin, qr } = router.query
    if (pin && qr === '1') {
      console.log('🔍 Accesso via QR code rilevato - PIN:', pin)
      setIsQRAccess(true)
      setGamePin(pin)
      setShowQuickJoin(true) // Mostra automaticamente il form di join
    }
  }, [router.query])

  const handleQuickJoin = () => {
    if (gamePin.trim() && playerName.trim()) {
      router.push(`/game?pin=${gamePin.trim()}&name=${encodeURIComponent(playerName.trim())}`)
    }
  }

  return (
    <div className="relative min-h-screen cyberpunk-lab-container">
      {/* Sfondo Laboratorio Cyberpunk */}
      <div className="lab-background"></div>
      
      {/* Overlay effetti */}
      <div className="lab-overlay"></div>
      
      {/* Particelle animate */}
      <div className="particles-container">
        <div className="particle particle-1"></div>
        <div className="particle particle-2"></div>
        <div className="particle particle-3"></div>
        <div className="particle particle-4"></div>
        <div className="particle particle-5"></div>
      </div>
      
      {/* Circuiti animati */}
      <div className="circuit-lines">
        <div className="circuit-line circuit-top"></div>
        <div className="circuit-line circuit-bottom"></div>
        <div className="circuit-line circuit-left"></div>
        <div className="circuit-line circuit-right"></div>
      </div>

      <div className="min-h-screen flex flex-col relative z-10">
        {/* Header con Logo ChemArena Grande */}
        <header className="text-center py-12 z-20 relative">
          <div className="chemarena-logo-container">
            <h1 className="chemarena-title">
              <span className="chem-part">CHEM</span>
              <span className="arena-part">ARENA</span>
            </h1>
            <div className="logo-circuit-frame">
              <div className="circuit-corner circuit-tl"></div>
              <div className="circuit-corner circuit-tr"></div>
              <div className="circuit-corner circuit-bl"></div>
              <div className="circuit-corner circuit-br"></div>
            </div>
            <p className="lab-subtitle">// LABORATORIO DIGITALE CHIMICO //</p>
          </div>
          
          {/* Pulsante Admin in basso a sinistra */}
          <button 
            onClick={() => router.push('/login')} 
            className="admin-button"
          >
            <span className="admin-icon">⚙️</span>
            <span className="admin-text">ADMIN</span>
          </button>
        </header>

        {/* Contenuto principale */}
        <main className="flex-1 flex items-center justify-center px-6">
          <div className="w-full max-w-6xl mx-auto">
            
            {/* Elementi decorativi laboratorio */}
            <div className="lab-elements">
              {/* Beute animate */}
              <div className="lab-beaker lab-beaker-1">
                <div className="beaker-liquid liquid-cyan"></div>
                <div className="beaker-bubbles">
                  <div className="bubble"></div>
                  <div className="bubble"></div>
                  <div className="bubble"></div>
                </div>
              </div>
              
              <div className="lab-beaker lab-beaker-2">
                <div className="beaker-liquid liquid-red"></div>
                <div className="beaker-steam"></div>
              </div>
              
              <div className="lab-beaker lab-beaker-3">
                <div className="beaker-liquid liquid-green"></div>
                <div className="beaker-glow"></div>
              </div>
              
              {/* Scaffali con strumenti */}
              <div className="lab-shelf lab-shelf-left">
                <div className="shelf-item"></div>
                <div className="shelf-item"></div>
                <div className="shelf-item"></div>
              </div>
              
              <div className="lab-shelf lab-shelf-right">
                <div className="shelf-item"></div>
                <div className="shelf-item"></div>
              </div>
            </div>

            {/* Banner di selezione al centro */}
            <div className="mt-16 mb-8 selection-area">
              <div className="text-center mb-8">
                <h2 className="mode-selection-title">
                  <span className="title-bracket">[</span>
                  <span className="title-text">ACCESSO LABORATORIO</span>
                  <span className="title-bracket">]</span>
                </h2>
                <p className="mode-subtitle">
                  >> Seleziona protocollo di accesso <<
                </p>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto">
                <TronButton
                  title="INSEGNANTE"
                  subtitle="Crea e gestisci quiz"
                  icon="👨‍🏫"
                  href="/teacher-dashboard"
                  variant="primary"
                />
                
                <TronButton
                  title="STUDENTE"
                  subtitle="Partecipa ai quiz"
                  icon="🎓"
                  onClick={() => setShowQuickJoin(!showQuickJoin)}
                  variant="secondary"
                />
                
                <TronButton
                  title="QUIZ LIBERO"
                  subtitle="Modalità di pratica"
                  icon="🧪"
                  href="/dashboard"
                  variant="accent"
                />
              </div>
              
              {/* Accesso rapido studente */}
              {showQuickJoin && (
                <div className="mt-8 max-w-md mx-auto quick-join-panel">
                  <div className="tron-panel p-6">
                    <h3 className="text-cyan-400 text-xl font-bold mb-4 text-center">
                      {isQRAccess ? '📱 ACCESSO RAPIDO' : 'ENTRA NEL QUIZ'}
                    </h3>
                    {isQRAccess && (
                      <div className="bg-cyan-900/20 border border-cyan-400/30 rounded-lg p-3 mb-4">
                        <p className="text-cyan-300 text-sm text-center">
                          ✅ PIN riconosciuto: <span className="font-bold text-cyan-400">{gamePin}</span>
                        </p>
                      </div>
                    )}
                    <div className="space-y-3">
                      {!isQRAccess && (
                        <input
                          type="text"
                          placeholder="PIN..."
                          value={gamePin}
                          onChange={(e) => setGamePin(e.target.value.toUpperCase())}
                          className="tron-input w-full"
                          maxLength={6}
                        />
                      )}
                      <input
                        type="text"
                        placeholder="Il tuo nome..."
                        value={playerName}
                        onChange={(e) => setPlayerName(e.target.value)}
                        className="tron-input w-full"
                        maxLength={20}
                        onKeyDown={(e) => e.key === 'Enter' && handleQuickJoin()}
                        autoFocus={isQRAccess} // Focus automatico se via QR
                      />
                      <button
                        onClick={handleQuickJoin}
                        disabled={!gamePin.trim() || !playerName.trim()}
                        className="tron-join-btn w-full"
                      >
                        {isQRAccess ? '🚀 ENTRA VELOCEMENTE' : 'ENTRA'}
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </main>

        {/* Footer */}
        <footer className="text-center p-6 text-cyan-400 opacity-60">
          <p className="text-sm">
            ChemArena © 2025 - Piattaforma di Quiz Chimici Interattivi
          </p>
        </footer>
      </div>
      
      <style jsx>{`
        /* === CYBERPUNK LAB BACKGROUND === */
        .cyberpunk-lab-container {
          position: relative;
          overflow: hidden;
        }
        
        .lab-background {
          position: fixed;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          background: url('/lab-background.jpg') center center/cover no-repeat;
          filter: brightness(0.4) contrast(1.2) saturate(1.5);
          z-index: -3;
        }
        
        .lab-overlay {
          position: fixed;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          background: 
            radial-gradient(circle at 20% 30%, rgba(0, 255, 255, 0.1) 0%, transparent 40%),
            radial-gradient(circle at 80% 70%, rgba(255, 0, 136, 0.08) 0%, transparent 40%),
            radial-gradient(circle at 40% 80%, rgba(0, 255, 136, 0.06) 0%, transparent 30%),
            linear-gradient(135deg, rgba(0, 20, 40, 0.8) 0%, rgba(0, 40, 80, 0.6) 100%);
          z-index: -2;
          animation: overlayPulse 8s ease-in-out infinite;
        }
        
        @keyframes overlayPulse {
          0%, 100% { opacity: 0.8; }
          50% { opacity: 1; }
        }

        /* === PARTICELLE ANIMATE === */
        .particles-container {
          position: fixed;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          pointer-events: none;
          z-index: -1;
        }
        
        .particle {
          position: absolute;
          width: 3px;
          height: 3px;
          background: #00ffff;
          border-radius: 50%;
          box-shadow: 0 0 10px #00ffff;
        }
        
        .particle-1 {
          top: 20%;
          left: 10%;
          animation: floatParticle 6s ease-in-out infinite;
        }
        
        .particle-2 {
          top: 60%;
          right: 15%;
          animation: floatParticle 8s ease-in-out infinite reverse;
        }
        
        .particle-3 {
          bottom: 30%;
          left: 25%;
          animation: floatParticle 7s ease-in-out infinite;
          background: #ff0088;
          box-shadow: 0 0 10px #ff0088;
        }
        
        .particle-4 {
          top: 40%;
          right: 30%;
          animation: floatParticle 5s ease-in-out infinite;
          background: #00ff88;
          box-shadow: 0 0 10px #00ff88;
        }
        
        .particle-5 {
          bottom: 60%;
          right: 45%;
          animation: floatParticle 9s ease-in-out infinite reverse;
        }
        
        @keyframes floatParticle {
          0%, 100% { 
            transform: translateY(0px) translateX(0px); 
            opacity: 0.3;
          }
          25% { 
            transform: translateY(-20px) translateX(10px); 
            opacity: 1;
          }
          50% { 
            transform: translateY(-40px) translateX(-5px); 
            opacity: 0.7;
          }
          75% { 
            transform: translateY(-20px) translateX(-15px); 
            opacity: 1;
          }
        }

        /* === CIRCUITI ANIMATI === */
        .circuit-lines {
          position: fixed;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          pointer-events: none;
          z-index: 1;
        }
        
        .circuit-line {
          position: absolute;
          background: linear-gradient(90deg, transparent, #00ffff, transparent);
          opacity: 0.6;
        }
        
        .circuit-top {
          top: 20%;
          left: 0;
          width: 100%;
          height: 2px;
          animation: circuitPulse 4s ease-in-out infinite;
        }
        
        .circuit-bottom {
          bottom: 20%;
          left: 0;
          width: 100%;
          height: 2px;
          animation: circuitPulse 4s ease-in-out infinite 2s;
        }
        
        .circuit-left {
          left: 5%;
          top: 0;
          width: 2px;
          height: 100%;
          background: linear-gradient(180deg, transparent, #00ff88, transparent);
          animation: circuitPulse 5s ease-in-out infinite 1s;
        }
        
        .circuit-right {
          right: 5%;
          top: 0;
          width: 2px;
          height: 100%;
          background: linear-gradient(180deg, transparent, #ff0088, transparent);
          animation: circuitPulse 5s ease-in-out infinite 3s;
        }
        
        @keyframes circuitPulse {
          0%, 100% { 
            opacity: 0.2; 
            filter: brightness(0.5);
          }
          50% { 
            opacity: 1; 
            filter: brightness(2) drop-shadow(0 0 10px currentColor);
          }
        }

        /* === LOGO CHEMARENA GRANDE === */
        .chemarena-logo-container {
          position: relative;
          padding: 2rem 0;
          text-align: center;
        }
        
        .chemarena-title {
          font-family: 'Orbitron', 'Courier New', monospace;
          font-size: clamp(3rem, 8vw, 6rem);
          font-weight: 900;
          letter-spacing: 0.3em;
          margin: 0;
          position: relative;
          z-index: 10;
        }
        
        .chem-part {
          color: #00ffff;
          text-shadow: 
            0 0 20px #00ffff,
            0 0 40px #00ffff,
            0 0 60px #00ffff;
          animation: chemGlow 3s ease-in-out infinite;
        }
        
        .arena-part {
          color: #ff0088;
          text-shadow: 
            0 0 20px #ff0088,
            0 0 40px #ff0088,
            0 0 60px #ff0088;
          animation: arenaGlow 3s ease-in-out infinite 1.5s;
        }
        
        @keyframes chemGlow {
          0%, 100% { 
            text-shadow: 
              0 0 20px #00ffff,
              0 0 40px #00ffff,
              0 0 60px #00ffff;
          }
          50% { 
            text-shadow: 
              0 0 30px #00ffff,
              0 0 60px #00ffff,
              0 0 90px #00ffff,
              0 0 120px #00ffff;
          }
        }
        
        @keyframes arenaGlow {
          0%, 100% { 
            text-shadow: 
              0 0 20px #ff0088,
              0 0 40px #ff0088,
              0 0 60px #ff0088;
          }
          50% { 
            text-shadow: 
              0 0 30px #ff0088,
              0 0 60px #ff0088,
              0 0 90px #ff0088,
              0 0 120px #ff0088;
          }
        }
        
        .logo-circuit-frame {
          position: absolute;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
          width: 120%;
          height: 120%;
          pointer-events: none;
        }
        
        .circuit-corner {
          position: absolute;
          width: 60px;
          height: 60px;
          border: 2px solid #00ff88;
          opacity: 0.8;
        }
        
        .circuit-tl {
          top: 0;
          left: 0;
          border-right: none;
          border-bottom: none;
          animation: cornerPulse 4s ease-in-out infinite;
        }
        
        .circuit-tr {
          top: 0;
          right: 0;
          border-left: none;
          border-bottom: none;
          animation: cornerPulse 4s ease-in-out infinite 1s;
        }
        
        .circuit-bl {
          bottom: 0;
          left: 0;
          border-right: none;
          border-top: none;
          animation: cornerPulse 4s ease-in-out infinite 2s;
        }
        
        .circuit-br {
          bottom: 0;
          right: 0;
          border-left: none;
          border-top: none;
          animation: cornerPulse 4s ease-in-out infinite 3s;
        }
        
        @keyframes cornerPulse {
          0%, 100% { 
            opacity: 0.4; 
            border-color: #00ff88;
          }
          50% { 
            opacity: 1; 
            border-color: #00ffff;
            filter: drop-shadow(0 0 10px currentColor);
          }
        }
        
        .lab-subtitle {
          font-family: 'Courier New', monospace;
          font-size: clamp(0.8rem, 2vw, 1.2rem);
          color: #00ff88;
          margin-top: 1rem;
          letter-spacing: 0.2em;
          opacity: 0.8;
          animation: subtitleFlicker 2s ease-in-out infinite;
        }
        
        @keyframes subtitleFlicker {
          0%, 90%, 100% { opacity: 0.8; }
          5%, 85% { opacity: 0.3; }
        }

        /* === ELEMENTI LABORATORIO ANIMATI === */
        .lab-elements {
          position: relative;
          width: 100%;
          height: 300px;
          margin: 2rem 0;
          pointer-events: none;
        }
        
        .lab-beaker {
          position: absolute;
          width: 40px;
          height: 60px;
          background: rgba(0, 255, 255, 0.1);
          border: 2px solid #00ffff;
          border-radius: 0 0 20px 20px;
          border-top: none;
        }
        
        .lab-beaker-1 {
          top: 50%;
          left: 15%;
          animation: beakerBob 4s ease-in-out infinite;
        }
        
        .lab-beaker-2 {
          top: 30%;
          right: 20%;
          animation: beakerBob 5s ease-in-out infinite 1s;
          border-color: #ff0088;
        }
        
        .lab-beaker-3 {
          bottom: 40%;
          left: 70%;
          animation: beakerBob 6s ease-in-out infinite 2s;
          border-color: #00ff88;
        }
        
        @keyframes beakerBob {
          0%, 100% { transform: translateY(0px) rotate(0deg); }
          50% { transform: translateY(-10px) rotate(2deg); }
        }
        
        .beaker-liquid {
          position: absolute;
          bottom: 2px;
          left: 2px;
          right: 2px;
          height: 60%;
          border-radius: 0 0 16px 16px;
          animation: liquidBubble 3s ease-in-out infinite;
        }
        
        .liquid-cyan { 
          background: linear-gradient(180deg, #00ffff, #0088aa); 
          box-shadow: 0 0 20px rgba(0, 255, 255, 0.5);
        }
        
        .liquid-red { 
          background: linear-gradient(180deg, #ff0088, #aa0055); 
          box-shadow: 0 0 20px rgba(255, 0, 136, 0.5);
        }
        
        .liquid-green { 
          background: linear-gradient(180deg, #00ff88, #00aa55); 
          box-shadow: 0 0 20px rgba(0, 255, 136, 0.5);
        }
        
        @keyframes liquidBubble {
          0%, 100% { height: 60%; }
          50% { height: 70%; }
        }
        
        .beaker-bubbles {
          position: absolute;
          top: 10px;
          left: 50%;
          transform: translateX(-50%);
          width: 20px;
          height: 30px;
        }
        
        .bubble {
          position: absolute;
          width: 4px;
          height: 4px;
          background: rgba(255, 255, 255, 0.6);
          border-radius: 50%;
          animation: bubbleRise 2s ease-in-out infinite;
        }
        
        .bubble:nth-child(1) { left: 2px; animation-delay: 0s; }
        .bubble:nth-child(2) { left: 8px; animation-delay: 0.7s; }
        .bubble:nth-child(3) { left: 14px; animation-delay: 1.4s; }
        
        @keyframes bubbleRise {
          0% { 
            bottom: 0; 
            opacity: 0; 
            transform: scale(0.5); 
          }
          50% { 
            opacity: 1; 
            transform: scale(1); 
          }
          100% { 
            bottom: 30px; 
            opacity: 0; 
            transform: scale(0.3); 
          }
        }
        
        .beaker-steam {
          position: absolute;
          top: -10px;
          left: 50%;
          transform: translateX(-50%);
          width: 15px;
          height: 20px;
          background: rgba(255, 255, 255, 0.2);
          border-radius: 50%;
          filter: blur(2px);
          animation: steamRise 3s ease-in-out infinite;
        }
        
        @keyframes steamRise {
          0% { 
            opacity: 0; 
            transform: translateX(-50%) translateY(0px) scale(0.5); 
          }
          50% { 
            opacity: 0.8; 
            transform: translateX(-50%) translateY(-15px) scale(1); 
          }
          100% { 
            opacity: 0; 
            transform: translateX(-50%) translateY(-30px) scale(1.5); 
          }
        }
        
        .beaker-glow {
          position: absolute;
          bottom: 0;
          left: 0;
          right: 0;
          height: 100%;
          border-radius: 0 0 20px 20px;
          background: radial-gradient(ellipse at center bottom, rgba(0, 255, 136, 0.3), transparent);
          animation: glowPulse 4s ease-in-out infinite;
        }
        
        @keyframes glowPulse {
          0%, 100% { opacity: 0.3; }
          50% { opacity: 0.8; }
        }
        
        .lab-shelf {
          position: absolute;
          width: 100px;
          height: 8px;
          background: linear-gradient(90deg, #00ffff, #0088aa);
          box-shadow: 0 0 10px rgba(0, 255, 255, 0.3);
        }
        
        .lab-shelf-left {
          top: 40%;
          left: 5%;
          animation: shelfGlow 6s ease-in-out infinite;
        }
        
        .lab-shelf-right {
          top: 60%;
          right: 10%;
          animation: shelfGlow 6s ease-in-out infinite 3s;
        }
        
        @keyframes shelfGlow {
          0%, 100% { 
            box-shadow: 0 0 10px rgba(0, 255, 255, 0.3); 
            opacity: 0.6;
          }
          50% { 
            box-shadow: 0 0 20px rgba(0, 255, 255, 0.6); 
            opacity: 1;
          }
        }
        
        .shelf-item {
          position: absolute;
          top: -15px;
          width: 12px;
          height: 15px;
          background: rgba(255, 0, 136, 0.6);
          border: 1px solid #ff0088;
          animation: itemFlicker 4s ease-in-out infinite;
        }
        
        .shelf-item:nth-child(1) { left: 10px; animation-delay: 0s; }
        .shelf-item:nth-child(2) { left: 35px; animation-delay: 1.3s; }
        .shelf-item:nth-child(3) { left: 60px; animation-delay: 2.6s; }
        
        @keyframes itemFlicker {
          0%, 90%, 100% { opacity: 0.6; }
          5%, 85% { opacity: 0.2; }
          50% { opacity: 1; }
        }

        /* === TITOLI SELEZIONE MODALITÀ === */
        .selection-area {
          position: relative;
          background: rgba(0, 20, 40, 0.7);
          border: 1px solid #00ffff;
          border-radius: 15px;
          padding: 2rem;
          backdrop-filter: blur(15px);
          box-shadow: 
            0 0 30px rgba(0, 255, 255, 0.1),
            inset 0 0 30px rgba(0, 255, 255, 0.05);
        }
        
        .mode-selection-title {
          font-family: 'Orbitron', 'Courier New', monospace;
          font-size: clamp(1.5rem, 4vw, 2.5rem);
          font-weight: bold;
          margin: 0;
          text-align: center;
        }
        
        .title-bracket {
          color: #00ff88;
          text-shadow: 0 0 10px #00ff88;
          animation: bracketPulse 2s ease-in-out infinite;
        }
        
        .title-text {
          color: #00ffff;
          text-shadow: 0 0 15px #00ffff;
          margin: 0 1rem;
          animation: titleGlow 3s ease-in-out infinite;
        }
        
        @keyframes bracketPulse {
          0%, 100% { opacity: 0.7; }
          50% { opacity: 1; }
        }
        
        @keyframes titleGlow {
          0%, 100% { 
            color: #00ffff;
            text-shadow: 0 0 15px #00ffff;
          }
          50% { 
            color: #ffffff;
            text-shadow: 0 0 25px #00ffff, 0 0 35px #00ffff;
          }
        }
        
        .mode-subtitle {
          font-family: 'Courier New', monospace;
          font-size: clamp(0.9rem, 2vw, 1.1rem);
          color: #00ff88;
          text-align: center;
          margin-top: 0.5rem;
          letter-spacing: 0.1em;
          opacity: 0.8;
          animation: subtypeFlicker 3s ease-in-out infinite;
        }
        
        @keyframes subtypeFlicker {
          0%, 95%, 100% { opacity: 0.8; }
          2%, 93% { opacity: 0.3; }
        }

        .admin-button {
          position: fixed;
          bottom: 30px;
          left: 30px;
          display: flex;
          align-items: center;
          gap: 8px;
          background: rgba(0, 255, 255, 0.1);
          border: 1px solid #00ffff;
          padding: 12px 20px;
          border-radius: 25px;
          color: #00ffff;
          font-family: 'Orbitron', monospace;
          font-size: 12px;
          font-weight: bold;
          cursor: pointer;
          backdrop-filter: blur(10px);
          transition: all 0.3s ease;
          z-index: 50;
        }

        .admin-button:hover {
          background: rgba(0, 255, 255, 0.2);
          box-shadow: 0 0 15px rgba(0, 255, 255, 0.4);
          transform: translateY(-2px);
        }

        .admin-icon {
          font-size: 16px;
        }

        .tron-text {
          font-family: 'Orbitron', 'Courier New', monospace;
          text-shadow: 0 0 10px currentColor;
          letter-spacing: 2px;
        }

        .tron-panel {
          background: rgba(0, 255, 255, 0.05);
          border: 1px solid #00ffff;
          backdrop-filter: blur(15px);
          clip-path: polygon(0 0, calc(100% - 10px) 0, 100% 10px, 100% 100%, 10px 100%, 0 calc(100% - 10px));
        }

        .tron-input {
          background: rgba(0, 0, 0, 0.5);
          border: 1px solid #00ffff;
          color: #00ffff;
          padding: 12px 16px;
          font-family: 'Courier New', monospace;
          font-size: 16px;
          text-align: center;
          letter-spacing: 2px;
          clip-path: polygon(0 0, calc(100% - 8px) 0, 100% 8px, 100% 100%, 8px 100%, 0 calc(100% - 8px));
          transition: all 0.3s ease;
        }

        .tron-input:focus {
          outline: none;
          box-shadow: 0 0 15px rgba(0, 255, 255, 0.4);
          border-color: #39ff14;
        }

        .tron-input::placeholder {
          color: rgba(0, 255, 255, 0.5);
        }

        .tron-join-btn {
          background: rgba(0, 255, 136, 0.2);
          border: 1px solid #00ff88;
          color: #00ff88;
          padding: 12px 24px;
          font-family: 'Orbitron', monospace;
          font-weight: bold;
          cursor: pointer;
          transition: all 0.3s ease;
          clip-path: polygon(0 0, calc(100% - 8px) 0, 100% 8px, 100% 100%, 8px 100%, 0 calc(100% - 8px));
        }

        .tron-join-btn:hover:not(:disabled) {
          background: rgba(0, 255, 136, 0.3);
          box-shadow: 0 0 15px rgba(0, 255, 136, 0.4);
          transform: translateX(2px);
        }

        .tron-join-btn:disabled {
          opacity: 0.5;
          cursor: not-allowed;
        }

        .animate-float {
          animation: float 6s ease-in-out infinite;
        }

        .animate-pulse-glow {
          animation: pulseGlow 4s ease-in-out infinite;
        }

        @keyframes float {
          0%, 100% {
            transform: translateY(0px);
          }
          50% {
            transform: translateY(-10px);
          }
        }

        @keyframes pulseGlow {
          0%, 100% {
            filter: drop-shadow(0 0 15px rgba(0, 255, 255, 0.3));
          }
          50% {
            filter: drop-shadow(0 0 25px rgba(0, 255, 255, 0.6));
          }
        }

        .quick-join-panel {
          animation: slideDown 0.3s ease-out;
        }

        @keyframes slideDown {
          from {
            opacity: 0;
            transform: translateY(-20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        /* === RESPONSIVE DESIGN === */
        @media (max-width: 768px) {
          .admin-button {
            bottom: 20px;
            left: 20px;
            padding: 10px 16px;
          }
          
          .admin-icon {
            font-size: 14px;
          }
          
          .admin-text {
            font-size: 10px;
          }
          
          .chemarena-title {
            font-size: clamp(2rem, 10vw, 4rem);
            letter-spacing: 0.2em;
          }
          
          .lab-elements {
            height: 200px;
          }
          
          .lab-beaker {
            width: 30px;
            height: 45px;
          }
          
          .circuit-corner {
            width: 40px;
            height: 40px;
          }
          
          .selection-area {
            padding: 1.5rem;
            margin: 1rem;
          }
          
          .particles-container {
            display: none; /* Nascondi particelle su mobile per performance */
          }
        }
        
        @media (max-width: 480px) {
          .chemarena-title {
            font-size: clamp(1.5rem, 12vw, 3rem);
            letter-spacing: 0.1em;
          }
          
          .lab-subtitle {
            font-size: 0.8rem;
          }
          
          .mode-selection-title {
            font-size: clamp(1rem, 6vw, 1.8rem);
          }
          
          .mode-subtitle {
            font-size: 0.8rem;
          }
          
          .lab-elements {
            height: 150px;
          }
          
          .lab-beaker {
            width: 25px;
            height: 35px;
          }
          
          .lab-shelf {
            width: 60px;
            height: 6px;
          }
        }
        
        /* === ANIMAZIONI PERFORMANCE === */
        @media (prefers-reduced-motion: reduce) {
          * {
            animation-duration: 0.01ms !important;
            animation-iteration-count: 1 !important;
            transition-duration: 0.01ms !important;
          }
        }
        
        /* === DARK MODE SUPPORT === */
        @media (prefers-color-scheme: dark) {
          .lab-background {
            filter: brightness(0.3) contrast(1.4) saturate(1.8);
          }
          
          .lab-overlay {
            background: 
              radial-gradient(circle at 20% 30%, rgba(0, 255, 255, 0.15) 0%, transparent 40%),
              radial-gradient(circle at 80% 70%, rgba(255, 0, 136, 0.12) 0%, transparent 40%),
              radial-gradient(circle at 40% 80%, rgba(0, 255, 136, 0.08) 0%, transparent 30%),
              linear-gradient(135deg, rgba(0, 10, 30, 0.9) 0%, rgba(0, 20, 60, 0.8) 100%);
          }
        }
        
        /* === HIGH CONTRAST === */
        @media (prefers-contrast: high) {
          .chem-part, .arena-part {
            text-shadow: 
              0 0 5px currentColor,
              0 0 10px currentColor,
              0 0 15px currentColor,
              2px 2px 0px rgba(0,0,0,0.8);
          }
          
          .circuit-line, .circuit-corner {
            opacity: 1;
            filter: brightness(2);
          }
        }
      `}</style>
    </div>
  )
}
