const ELITE_SCIENTISTS = [
  { type: 'female', suit: '#00ffff', visor: '#0066ff', glow: '#00ff88', circuits: '#00ccff', energy: '#80ff80', name: 'Dr. Cyra Nova' },
  { type: 'male', suit: '#ff6b00', visor: '#ff0040', glow: '#ffff00', circuits: '#ff8800', energy: '#ffcc00', name: 'Prof. Zex Prime' },
  { type: 'female', suit: '#9b59b6', visor: '#e74c3c', glow: '#00ffff', circuits: '#c39bd3', energy: '#ff6ec7', name: 'Dr. Luna Hex' },
  { type: 'male', suit: '#2ecc71', visor: '#3498db', glow: '#ff00ff', circuits: '#52d68f', energy: '#00ffaa', name: 'Prof. Neon Rex' },
  { type: 'female', suit: '#e67e22', visor: '#8e44ad', glow: '#00ff00', circuits: '#f39c12', energy: '#ff7700', name: 'Dr. Astra Vox' }
]

// Componente scienziato sci-fi ultra avanzato
const EliteScientist = ({ scientist, isWinner, isLoser, position }) => {
  const isHappy = isWinner
  const isSad = isLoser

  return (
    <div className="relative">
      <svg
        width="120"
        height="150"
        viewBox="0 0 120 150"
        className={`transform transition-all duration-1000 ${
          isWinner ? 'animate-bounce scale-125' :
          isLoser ? 'animate-pulse scale-85 grayscale' :
          'hover:scale-110'
        }`}
        style={{
          filter: `drop-shadow(0 0 30px ${scientist.glow}) brightness(${isWinner ? 1.3 : 1})`,
          transform: isWinner ? 'perspective(100px) rotateY(10deg)' : 'none'
        }}
      >
        {/* Jetpack sci-fi avanzato */}
        <g transform="translate(60, 65)">
          <ellipse cx="0" cy="0" rx="35" ry="30" fill={scientist.suit} stroke={scientist.circuits} strokeWidth="3" opacity="0.9"/>

          {/* Pannelli di controllo */}
          <rect x="-25" y="-15" width="50" height="25" rx="8" fill="rgba(0,0,0,0.3)" stroke={scientist.circuits} strokeWidth="2"/>
          <rect x="-20" y="-10" width="40" height="15" rx="5" fill={scientist.energy} opacity="0.6"/>

          {/* Luci LED tuta */}
          <circle cx="-15" cy="-5" r="2" fill={scientist.glow} className="animate-pulse"/>
          <circle cx="0" cy="-8" r="2.5" fill={scientist.energy} className="animate-ping"/>
          <circle cx="15" cy="-5" r="2" fill={scientist.glow} className="animate-pulse" style={{animationDelay: '0.5s'}}/>

          {/* Circuiti luminosi */}
          <path d="M-30 -5 L-20 -5 L-15 0 L-10 -5 L10 -5 L15 0 L20 -5 L30 -5"
                stroke={scientist.circuits} strokeWidth="2" fill="none" className="animate-pulse" opacity="0.8"/>
          <path d="M-25 5 L-15 5 L-10 10 L0 5 L10 10 L15 5 L25 5"
                stroke={scientist.circuits} strokeWidth="2" fill="none" className="animate-pulse" style={{animationDelay: '0.3s'}} opacity="0.8"/>
        </g>

        {/* Casco ultra tecnologico */}
        <g transform="translate(60, 35)">
          {/* Casco principale */}
          <circle cx="0" cy="0" r="28" fill="rgba(255,255,255,0.05)" stroke={scientist.glow} strokeWidth="4"/>
          <circle cx="0" cy="0" r="24" fill="rgba(0,50,100,0.2)"/>

          {/* Visiera HUD */}
          <ellipse cx="0" cy="-2" rx="20" ry="18" fill={scientist.visor} opacity="0.3"/>
          <path d="M-18 -8 Q0 -12 18 -8" stroke={scientist.energy} strokeWidth="2" fill="none" className="animate-pulse"/>

          {/* Scanner retina */}
          <circle cx="-8" cy="-2" r="1" fill={scientist.energy} className="animate-ping"/>
          <circle cx="8" cy="-2" r="1" fill={scientist.energy} className="animate-ping" style={{animationDelay: '0.4s'}}/>
        </g>

        {/* Viso ultra dettagliato */}
        <g transform="translate(60, 35)">
          {scientist.type === 'female' ? (
            <>
              {/* Capelli femminili futuristici */}
              <path d="M-22 -15 Q-25 -20 -20 -25 Q0 -30 20 -25 Q25 -20 22 -15 Q18 -10 0 -12 Q-18 -10 -22 -15"
                    fill="#4a4a4a" stroke={scientist.energy} strokeWidth="1" opacity="0.8"/>

              {/* Occhi femminili con scanner */}
              <ellipse cx="-8" cy="-2" rx="4" ry="3" fill={scientist.visor}/>
              <ellipse cx="8" cy="-2" rx="4" ry="3" fill={scientist.visor}/>
              <circle cx="-8" cy="-2" r="1.5" fill="white" className="animate-pulse"/>
              <circle cx="8" cy="-2" r="1.5" fill="white" className="animate-pulse" style={{animationDelay: '0.2s'}}/>

              <path d="M-12 -4 Q-8 -5 -4 -4 M4 -4 Q8 -5 12 -4" stroke={scientist.circuits} strokeWidth="1.5" fill="none"/>
            </>
          ) : (
            <>
              {/* Capelli maschili tech */}
              <path d="M-20 -10 Q0 -25 20 -10 Q20 -5 0 -8 Q-20 -5 -20 -10"
                    fill="#4a4a4a" stroke={scientist.energy} strokeWidth="1" opacity="0.8"/>

              {/* Occhi maschili con HUD */}
              <circle cx="-8" cy="-2" r="3.5" fill={scientist.visor}/>
              <circle cx="8" cy="-2" r="3.5" fill={scientist.visor}/>
              <circle cx="-8" cy="-2" r="1" fill="white" className="animate-pulse"/>
              <circle cx="8" cy="-2" r="1" fill="white" className="animate-pulse" style={{animationDelay: '0.3s'}}/>
            </>
          )}

          {/* Espressioni emotive avanzate */}
          {isHappy ? (
            <>
              {/* Sorriso euforico */}
              <path d="M-12 8 Q0 18 12 8" stroke={scientist.glow} strokeWidth="4" fill="none" className="animate-pulse"/>
              <text x="-8" y="1" textAnchor="middle" fontSize="10" fill="gold" className="animate-bounce">✦</text>
              <text x="8" y="1" textAnchor="middle" fontSize="10" fill="gold" className="animate-bounce" style={{animationDelay: '0.2s'}}>✦</text>
              {/* Hologram di gioia */}
              <circle cx="0" cy="-8" r="2" fill={scientist.energy} className="animate-ping" opacity="0.7"/>
            </>
          ) : isSad ? (
            <>
              {/* Bocca triste tech */}
              <path d="M-10 12 Q0 4 10 12" stroke="#ff4444" strokeWidth="3" fill="none"/>
              {/* Lacrime digitalizzate */}
              <circle cx="-12" cy="2" r="2.5" fill="#87ceeb" className="animate-bounce"/>
              <circle cx="12" cy="2" r="2.5" fill="#87ceeb" className="animate-bounce" style={{animationDelay: '0.3s'}}/>
              <rect x="-13" y="8" width="2" height="8" fill="#87ceeb" className="animate-pulse"/>
              <rect x="11" y="8" width="2" height="8" fill="#87ceeb" className="animate-pulse"/>
            </>
          ) : (
            <>
              {/* Espressione neutra con scanner */}
              <line x1="-8" y1="8" x2="8" y2="8" stroke={scientist.visor} strokeWidth="3"/>
              <circle cx="0" cy="8" r="1" fill={scientist.energy} className="animate-pulse"/>
            </>
          )}
        </g>

        {/* Braccia dinamiche con gadget */}
        <ellipse cx="25" cy="85" rx="12" ry="20" fill={scientist.suit} opacity="0.8"
                stroke={scientist.circuits} strokeWidth="2"/>
        <ellipse cx="95" cy="85" rx="12" ry="20" fill={scientist.suit} opacity="0.8"
                stroke={scientist.circuits} strokeWidth="2"/>

        {/* Gadget tech sui polsi */}
        <rect x="20" y="75" width="10" height="6" rx="3" fill={scientist.energy} className="animate-pulse"/>
        <rect x="90" y="75" width="10" height="6" rx="3" fill={scientist.energy} className="animate-pulse" style={{animationDelay: '0.5s'}}/>

        {/* ANIMAZIONI ESULTANZA ESTREMA per il vincitore */}
        {isWinner && (
          <>
            {/* Braccia alzate in trionfo */}
            <ellipse cx="15" cy="45" rx="12" ry="20" fill={scientist.suit}
                    transform="rotate(-60 15 45)" className="animate-bounce"/>
            <ellipse cx="105" cy="45" rx="12" ry="20" fill={scientist.suit}
                    transform="rotate(60 105 45)" className="animate-bounce"/>

            {/* Jetpack in modalità celebrazione */}
            <g transform="translate(60, 110)">
              <ellipse cx="-15" cy="0" rx="8" ry="15" fill={scientist.energy} className="animate-bounce" opacity="0.8"/>
              <ellipse cx="15" cy="0" rx="8" ry="15" fill={scientist.energy} className="animate-bounce" style={{animationDelay: '0.2s'}} opacity="0.8"/>
            </g>

            {/* Corona suprema */}
            <g transform="translate(60, 5)">
              <polygon points="-20,0 -15,-15 -10,0 -5,-20 0,-25 5,-20 10,0 15,-15 20,0"
                      fill="gold" stroke="#ffff00" strokeWidth="3" className="animate-pulse"/>
              <circle cx="0" cy="-20" r="4" fill="#ff6b6b" className="animate-ping"/>
              <circle cx="-10" cy="-10" r="2" fill="gold" className="animate-ping" style={{animationDelay: '0.3s'}}/>
              <circle cx="10" cy="-10" r="2" fill="gold" className="animate-ping" style={{animationDelay: '0.6s'}}/>
            </g>
          </>
        )}
      </svg>

      {/* Particelle di energia vincitore */}
      {isWinner && (
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute -top-8 left-1/2 transform -translate-x-1/2 w-4 h-4 bg-yellow-300 rounded-full animate-ping"></div>
          <div className="absolute top-4 -left-8 w-3 h-3 bg-gold rounded-full animate-ping" style={{animationDelay: '0.3s'}}></div>
          <div className="absolute top-4 -right-8 w-3 h-3 bg-yellow-400 rounded-full animate-ping" style={{animationDelay: '0.6s'}}></div>
          <div className="absolute -bottom-4 left-1/4 w-2 h-2 bg-yellow-200 rounded-full animate-ping" style={{animationDelay: '0.9s'}}></div>
          <div className="absolute top-1/2 -left-6 w-2 h-2 bg-orange-300 rounded-full animate-ping" style={{animationDelay: '1.2s'}}></div>
          <div className="absolute top-1/2 -right-6 w-2 h-2 bg-orange-300 rounded-full animate-ping" style={{animationDelay: '1.5s'}}></div>
        </div>
      )}

      {/* Hologram name tag */}
      <div className={`absolute -bottom-6 left-1/2 transform -translate-x-1/2 text-xs font-bold px-2 py-1 rounded-full ${
        isWinner ? 'bg-gold text-black animate-pulse' :
        isLoser ? 'bg-gray-600 text-gray-300' :
        'bg-cyan-900 text-cyan-300'
      }`} style={{
        backdropFilter: 'blur(4px)',
        border: `1px solid ${scientist.glow}`,
        boxShadow: `0 0 10px ${scientist.glow}40`
      }}>
        {scientist.name}
      </div>
    </div>
  )
}

export default function Leaderboard({ data: { leaderboard } }) {
  // Funzione per ottenere scienziato elite univoco per ogni giocatore
  const getScientistForPlayer = (index) => ELITE_SCIENTISTS[index % ELITE_SCIENTISTS.length]

  return (
    <section className="relative mx-auto flex w-full max-w-7xl flex-1 flex-col items-center px-4">
      {/* Spaziatura superiore per posizionamento a metà pagina */}
      <div className="flex-1 flex flex-col items-center justify-center max-h-[20vh]"></div>

      {/* Titolo sci-fi esplosivo */}
      <div className="relative mb-12">
        <h2 className="text-7xl font-black text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 via-gold to-orange-400 drop-shadow-lg text-center filter drop-shadow-[0_0_40px_rgba(255,215,0,0.9)] animate-pulse">
          🏆 ELITE SCIENTISTS RANKING 🏆
        </h2>

        {/* Particelle esplosive intorno al titolo */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute -top-6 left-1/4 w-3 h-3 bg-yellow-300 rounded-full animate-ping"></div>
          <div className="absolute -top-4 right-1/4 w-2 h-2 bg-orange-400 rounded-full animate-ping" style={{animationDelay: '0.5s'}}></div>
          <div className="absolute top-1/2 -left-8 w-4 h-4 bg-gold rounded-full animate-ping" style={{animationDelay: '1s'}}></div>
          <div className="absolute top-1/2 -right-8 w-4 h-4 bg-yellow-500 rounded-full animate-ping" style={{animationDelay: '1.5s'}}></div>
          <div className="absolute -bottom-6 left-1/3 w-2 h-2 bg-orange-300 rounded-full animate-ping" style={{animationDelay: '2s'}}></div>
          <div className="absolute -bottom-4 right-1/3 w-3 h-3 bg-yellow-400 rounded-full animate-ping" style={{animationDelay: '2.5s'}}></div>
        </div>
      </div>

      <div className="flex w-full flex-col gap-8 max-w-6xl">
        {leaderboard.map(({ username, points }, index) => {
          const scientist = getScientistForPlayer(index)
          const isWinner = index === 0
          const isLoser = index === leaderboard.length - 1 && leaderboard.length > 1

          return (
            <div
              key={index}
              className={`relative flex items-center justify-between p-8 rounded-3xl transition-all duration-700 hover:scale-[1.03] ${
                isWinner ?
                  'bg-gradient-to-r from-yellow-500/30 via-gold/40 to-orange-500/30 border-6 border-yellow-400 shadow-[0_0_60px_rgba(255,215,0,0.8)] animate-pulse' :
                isLoser ?
                  'bg-gradient-to-r from-gray-600/20 via-gray-700/30 to-gray-800/20 border-3 border-gray-500 shadow-[0_0_20px_rgba(128,128,128,0.3)]' :
                  'bg-gradient-to-r from-cyan-500/25 via-blue-600/35 to-purple-600/25 border-3 border-cyan-400 shadow-[0_0_40px_rgba(0,255,255,0.4)]'
              }`}
              style={{
                backdropFilter: 'blur(15px)',
                transform: isWinner ? 'perspective(200px) rotateX(2deg)' : 'none'
              }}
            >
              {/* POSIZIONE A SINISTRA con effetti */}
              <div className="flex flex-col items-center min-w-[100px] relative">
                <div className={`text-6xl font-black mb-3 relative ${
                  isWinner ? 'text-yellow-300 animate-bounce' :
                  isLoser ? 'text-gray-400' : 'text-cyan-300'
                }`} style={{
                  filter: isWinner ? 'drop-shadow(0 0 20px gold)' : 'drop-shadow(0 0 12px currentColor)',
                  textShadow: isWinner ? '0 0 30px gold' : '0 0 15px currentColor'
                }}>
                  {index + 1}°
                  {isWinner && (
                    <div className="absolute -top-2 -right-2 w-4 h-4 bg-yellow-300 rounded-full animate-ping"></div>
                  )}
                </div>
                <div className={`text-xl font-bold ${
                  isWinner ? 'text-yellow-200 animate-pulse' : isLoser ? 'text-gray-300' : 'text-cyan-200'
                } truncate max-w-[90px] text-center`}>
                  {username}
                </div>

                {/* Rango badge */}
                <div className={`mt-2 px-3 py-1 rounded-full text-xs font-bold ${
                  isWinner ? 'bg-gold text-black' :
                  isLoser ? 'bg-gray-600 text-gray-200' :
                  'bg-cyan-600 text-cyan-100'
                }`}>
                  {isWinner ? 'CHAMPION' : isLoser ? 'ROOKIE' : 'EXPERT'}
                </div>
              </div>

              {/* SCIENZIATO AL CENTRO */}
              <div className="flex-1 flex justify-center items-center relative">
                <EliteScientist
                  scientist={scientist}
                  isWinner={isWinner}
                  isLoser={isLoser}
                  position={index + 1}
                />

                {/* EFFETTI ESULTANZA ESPLOSIVA per il vincitore */}
                {isWinner && (
                  <>
                    {/* Esplosione di fuochi d'artificio */}
                    <div className="absolute inset-0 pointer-events-none">
                      <div className="absolute -top-12 left-1/2 transform -translate-x-1/2 w-6 h-6 bg-yellow-300 rounded-full animate-ping"></div>
                      <div className="absolute top-8 -left-12 w-4 h-4 bg-orange-400 rounded-full animate-ping" style={{animationDelay: '0.2s'}}></div>
                      <div className="absolute top-8 -right-12 w-4 h-4 bg-gold rounded-full animate-ping" style={{animationDelay: '0.4s'}}></div>
                      <div className="absolute -bottom-8 left-1/4 w-3 h-3 bg-yellow-500 rounded-full animate-ping" style={{animationDelay: '0.6s'}}></div>
                      <div className="absolute top-1/2 -left-16 w-5 h-5 bg-orange-300 rounded-full animate-ping" style={{animationDelay: '0.8s'}}></div>
                      <div className="absolute top-1/2 -right-16 w-5 h-5 bg-yellow-400 rounded-full animate-ping" style={{animationDelay: '1s'}}></div>
                    </div>

                    {/* Onde d'urto vincitore */}
                    <div className="absolute inset-0 pointer-events-none">
                      <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-32 h-32 border-4 border-yellow-400 rounded-full animate-ping opacity-30"></div>
                      <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-48 h-48 border-2 border-gold rounded-full animate-ping opacity-20" style={{animationDelay: '0.5s'}}></div>
                    </div>
                  </>
                )}
              </div>

              {/* PUNTEGGIO A DESTRA potenziato */}
              <div className="flex flex-col items-center min-w-[140px] relative">
                <div className={`text-5xl font-black mb-2 relative ${
                  isWinner ? 'text-yellow-300 animate-bounce' :
                  isLoser ? 'text-gray-400' : 'text-green-300'
                }`} style={{
                  filter: isWinner ? 'drop-shadow(0 0 25px gold)' :
                          isLoser ? 'drop-shadow(0 0 8px gray)' :
                          'drop-shadow(0 0 15px #00ff88)',
                  textShadow: isWinner ? '0 0 40px gold' : '0 0 20px currentColor'
                }}>
                  {Math.round(points) || 0}
                  {isWinner && (
                    <div className="absolute -top-3 -right-3 w-3 h-3 bg-yellow-300 rounded-full animate-ping"></div>
                  )}
                </div>
                <div className={`text-base font-bold uppercase tracking-wider mb-2 ${
                  isWinner ? 'text-yellow-200' :
                  isLoser ? 'text-gray-300' : 'text-green-200'
                }`}>
                  RESEARCH POINTS
                </div>

                {/* Badge supremo per il vincitore */}
                {isWinner && (
                  <div className="flex flex-col items-center gap-2">
                    <div className="px-4 py-2 bg-gradient-to-r from-yellow-400 via-gold to-orange-400 rounded-full text-sm font-black text-black animate-pulse shadow-[0_0_20px_rgba(255,215,0,0.8)]">
                      👑 SUPREME SCIENTIST
                    </div>
                    <div className="text-xs text-yellow-300 font-bold animate-pulse">
                      🧬 DISCOVERY MASTER 🧬
                    </div>
                  </div>
                )}

                {/* Progress bar per i punti */}
                <div className={`w-full h-2 rounded-full mt-3 overflow-hidden ${
                  isWinner ? 'bg-yellow-800' : isLoser ? 'bg-gray-700' : 'bg-cyan-800'
                }`}>
                  <div
                    className={`h-full transition-all duration-1000 ${
                      isWinner ? 'bg-gradient-to-r from-yellow-300 to-gold' :
                      isLoser ? 'bg-gray-500' : 'bg-gradient-to-r from-cyan-400 to-green-400'
                    }`}
                    style={{ width: `${Math.min(100, (points / 1000) * 100)}%` }}
                  ></div>
                </div>
                <div className="text-xs text-gray-400 mt-1">
                  {Math.round((points / 1000) * 100)}% efficiency
                </div>
              </div>
            </div>
          )
        })}
      </div>

      {/* Messaggio finale epico */}
      <div className="flex-1 flex flex-col justify-end pb-12 mt-12">
        {leaderboard.length > 0 && (
          <div className="text-center relative">
            {/* Banner di vittoria supremo */}
            <div className="relative mb-8">
              <p className="text-4xl text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 via-gold to-orange-400 font-black mb-4 animate-pulse filter drop-shadow-[0_0_30px_rgba(255,215,0,0.9)]">
                🚀 RESEARCH MISSION ACCOMPLISHED! 🚀
              </p>

              <div className="absolute inset-0 pointer-events-none">
                {[{pos: '-top-8 left-1/4', size: 'w-4 h-4', color: 'bg-yellow-300', delay: '0s'},
                  {pos: '-top-6 right-1/4', size: 'w-3 h-3', color: 'bg-orange-400', delay: '0.3s'},
                  {pos: 'top-1/2 -left-12', size: 'w-5 h-5', color: 'bg-gold', delay: '0.6s'},
                  {pos: 'top-1/2 -right-12', size: 'w-5 h-5', color: 'bg-yellow-500', delay: '0.9s'},
                  {pos: '-bottom-8 left-1/3', size: 'w-3 h-3', color: 'bg-orange-300', delay: '1.2s'},
                  {pos: '-bottom-6 right-1/3', size: 'w-4 h-4', color: 'bg-yellow-400', delay: '1.5s'}].map((particle, i) =>
                  <div key={i} className={`absolute ${particle.pos} ${particle.size} ${particle.color} rounded-full animate-ping`}
                       style={{animationDelay: particle.delay}}></div>
                )}
              </div>
            </div>

            <div className="bg-gradient-to-r from-black/40 via-yellow-900/20 to-black/40 rounded-3xl p-8 backdrop-blur-md border-2 border-yellow-400/30 shadow-[0_0_50px_rgba(255,215,0,0.3)]">
              <p className="text-2xl text-cyan-300 mb-4 font-bold">
                🧬 Lead Scientist <span className="font-black text-yellow-300 text-3xl filter drop-shadow-[0_0_15px_gold] animate-pulse">
                  {leaderboard[0]?.username}
                </span> has achieved breakthrough discovery! 🧬
              </p>

              <div className="flex justify-center items-center gap-8 mb-6">
                <div className="text-center">
                  <div className="text-6xl animate-bounce">🏆</div>
                  <div className="text-yellow-300 font-bold text-lg">CHAMPION</div>
                </div>
                <div className="text-center">
                  <div className="text-6xl animate-pulse">🧪</div>
                  <div className="text-cyan-300 font-bold text-lg">DISCOVERY</div>
                </div>
                <div className="text-center">
                  <div className="text-6xl animate-bounce" style={{animationDelay: '0.5s'}}>🌟</div>
                  <div className="text-green-300 font-bold text-lg">EXCELLENCE</div>
                </div>
              </div>

              <p className="text-xl text-green-300 filter drop-shadow-[0_0_8px_rgba(0,255,136,0.8)] font-semibold">
                ⚡ All Elite Scientists demonstrated exceptional research capabilities! ⚡
              </p>

              <div className="mt-6 text-base text-yellow-200 font-medium">
                🔬 Scientific Achievement Unlocked: <span className="text-gold font-bold">KNOWLEDGE MASTERY</span> 🔬
              </div>
            </div>

            {/* Effetti finali con onde espansive */}
            <div className="relative inline-block mt-8">
              <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-24 h-24 border-4 border-yellow-400 rounded-full animate-ping opacity-20"></div>
              <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-32 h-32 border-2 border-gold rounded-full animate-ping opacity-15" style={{animationDelay: '0.5s'}}></div>
              <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-40 h-40 border-2 border-orange-400 rounded-full animate-ping opacity-10" style={{animationDelay: '1s'}}></div>

              <div className="w-4 h-4 bg-yellow-300 rounded-full animate-ping"></div>
            </div>
          </div>
        )}
      </div>
    </section>
  )
}
