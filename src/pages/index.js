import Image from 'next/image'
import { useRouter } from 'next/router'
import { useState, useEffect } from 'react'
import TronLabBackground from '@/components/TronLabBackground'
import TronButton from '@/components/TronButton'
import TronBeaker from '@/components/TronBeaker'
import TronAtom from '@/components/TronAtom'

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
    <div className="relative min-h-screen">
      <TronLabBackground />
      <div className="min-h-screen flex flex-col">
        {/* Header con Logo */}
        <header className="flex justify-between items-center p-6 z-20 relative">
          <div className="logo-container">
            <Image 
              src="/chemhoot-logo.svg" 
              alt="ChemHoot" 
              width={300} 
              height={80}
              className="logo-glow"
            />
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
            
            {/* Layout principale */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
              
              {/* Lato sinistro - Beuta */}
              <div className="flex justify-center lg:justify-end">
                <TronBeaker size={300} className="animate-float" />
              </div>

              {/* Lato destro - Atomo */}
              <div className="flex justify-center lg:justify-start">
                <TronAtom size={280} className="animate-pulse-glow" />
              </div>
            </div>

            {/* Banner di selezione al centro */}
            <div className="mt-12 mb-8">
              <div className="text-center mb-8">
                <h1 className="text-4xl font-bold text-cyan-400 mb-3 tron-text">
                  SCEGLI LA TUA MODALITÀ
                </h1>
                <p className="text-cyan-300 text-lg opacity-80">
                  Seleziona il tipo di accesso alla piattaforma
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
            ChemHoot © 2024 - Piattaforma di Quiz Chimici Interattivi
          </p>
        </footer>
      </div>
      
      <style jsx>{`
        .logo-glow {
          filter: drop-shadow(0 0 20px rgba(0, 255, 255, 0.4));
          transition: all 0.3s ease;
        }
        
        .logo-glow:hover {
          filter: drop-shadow(0 0 30px rgba(0, 255, 255, 0.6));
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

        /* Responsive */
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
        }
      `}</style>
    </div>
  )
}
