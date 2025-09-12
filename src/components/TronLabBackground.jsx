import React from 'react'

export default function TronLabBackground() {
  return (
    <div className="fixed inset-0 overflow-hidden">
      {/* Nuovo sfondo laboratorio moderno */}
      <div 
        className="absolute inset-0"
        style={{
          background: `
            linear-gradient(135deg, #0f172a 0%, #1e293b 25%, #334155 50%, #1e293b 75%, #0f172a 100%),
            radial-gradient(circle at 25% 25%, rgba(6, 182, 212, 0.15) 0%, transparent 50%),
            radial-gradient(circle at 75% 75%, rgba(8, 145, 178, 0.15) 0%, transparent 50%)
          `
        }}
      ></div>
      
      {/* Overlay turchese per tema laboratorio */}
      <div 
        className="absolute inset-0" 
        style={{
          background: `
            linear-gradient(45deg, rgba(6, 182, 212, 0.1) 0%, transparent 30%, rgba(8, 145, 178, 0.1) 70%),
            radial-gradient(circle at 30% 70%, rgba(20, 184, 166, 0.08) 0%, transparent 40%),
            radial-gradient(circle at 70% 30%, rgba(14, 165, 233, 0.08) 0%, transparent 40%)
          `
        }}
      ></div>
      
      {/* Enhanced Grid pattern */}
      <div className="absolute inset-0 opacity-30">
        <div className="absolute inset-0 bg-[linear-gradient(rgba(0,255,255,0.15)_1px,transparent_1px),linear-gradient(90deg,rgba(0,255,255,0.15)_1px,transparent_1px)] bg-[size:40px_40px] animate-pulse"></div>
      </div>
      
      {/* Laboratory cabinet-like rectangles */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-0 left-0 w-full h-20 bg-gradient-to-b from-slate-600/50 to-transparent"></div>
        <div className="absolute bottom-0 left-0 w-full h-32 bg-gradient-to-t from-slate-700/60 to-transparent"></div>
        <div className="absolute top-20 left-0 w-32 h-full bg-gradient-to-r from-slate-600/40 to-transparent"></div>
        <div className="absolute top-20 right-0 w-32 h-full bg-gradient-to-l from-slate-600/40 to-transparent"></div>
      </div>

      {/* Subtle Laboratory Equipment Silhouettes - reduced opacity */}
      
      {/* Beakers and flasks - Left side */}
      <div className="absolute left-10 top-1/4 transform -translate-y-1/2 opacity-40">
        {/* Large beaker with glowing liquid */}
        <div className="relative">
          <div className="w-24 h-32 bg-gradient-to-b from-transparent via-cyan-900/10 to-cyan-500/20 rounded-b-3xl border border-cyan-400/30 shadow-[0_0_20px_rgba(0,255,255,0.2)]">
            <div className="absolute bottom-0 w-full h-16 bg-gradient-to-t from-cyan-400/30 to-transparent rounded-b-3xl animate-pulse"></div>
          </div>
          {/* Beaker neck */}
          <div className="absolute -top-4 left-1/2 transform -translate-x-1/2 w-8 h-6 bg-gray-800/60 border border-cyan-400/30 rounded-t-lg"></div>
        </div>
      </div>

      {/* Molecular structures floating - more subtle */}
      <div className="absolute top-20 left-1/3 opacity-30">
        <div className="relative animate-float">
          {/* Benzene ring */}
          <div className="w-16 h-16 relative">
            {[...Array(6)].map((_, i) => (
              <div
                key={i}
                className="absolute w-2 h-2 bg-cyan-400/60 rounded-full shadow-[0_0_6px_rgba(0,255,255,0.3)]"
                style={{
                  top: `${50 + 30 * Math.sin((i * 60) * Math.PI / 180) - 4}px`,
                  left: `${50 + 30 * Math.cos((i * 60) * Math.PI / 180) - 4}px`
                }}
              ></div>
            ))}
            {/* Bonds */}
            {[...Array(6)].map((_, i) => (
              <div
                key={i}
                className="absolute w-6 h-0.5 bg-cyan-300/30"
                style={{
                  top: '50px',
                  left: '44px',
                  transformOrigin: 'left center',
                  transform: `rotate(${i * 60}deg)`
                }}
              ></div>
            ))}
          </div>
        </div>
      </div>

      {/* Subtle decorative elements */}
      <div className="absolute right-32 bottom-40 opacity-20">
        <div className="relative">
          {/* Base */}
          <div className="w-16 h-4 bg-gray-800 border border-cyan-400/30 rounded-lg"></div>
          {/* Arm */}
          <div className="absolute top-0 left-1/2 transform -translate-x-1/2 w-2 h-12 bg-gray-800 border border-cyan-400/30"></div>
          {/* Eyepiece */}
          <div className="absolute -top-8 left-1/2 transform -translate-x-1/2 w-4 h-8 bg-gray-700 border border-cyan-400/30 rounded-t-lg shadow-[0_0_10px_rgba(0,255,255,0.2)]"></div>
        </div>
      </div>


      {/* Subtle DNA helix - Top right */}
      <div className="absolute top-16 right-1/4 opacity-20">
        <div className="relative animate-spin-slow">
          <div className="w-12 h-32 relative">
            {[...Array(8)].map((_, i) => (
              <div
                key={i}
                className={`absolute w-1.5 h-1.5 rounded-full ${i % 2 === 0 ? 'bg-blue-400/60' : 'bg-pink-400/60'} shadow-[0_0_4px_currentColor]`}
                style={{
                  top: `${i * 4}px`,
                  left: `${5 + 3 * Math.sin((i * 45) * Math.PI / 180)}px`
                }}
              ></div>
            ))}
          </div>
        </div>
      </div>

      {/* Subtle floating particles */}
      <div className="absolute inset-0 opacity-30">
        {[...Array(12)].map((_, i) => (
          <div
            key={i}
            className="absolute w-0.5 h-0.5 bg-cyan-300 rounded-full animate-float"
            style={{
              top: `${Math.random() * 100}%`,
              left: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 5}s`,
              animationDuration: `${3 + Math.random() * 4}s`
            }}
          ></div>
        ))}
      </div>

      {/* Subtle ambient light effects */}
      <div className="absolute top-10 left-10 w-32 h-32 bg-cyan-400/3 rounded-full blur-3xl animate-pulse"></div>
      <div className="absolute bottom-20 right-20 w-40 h-40 bg-blue-400/3 rounded-full blur-3xl animate-pulse"></div>
      <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-60 h-60 bg-cyan-300/2 rounded-full blur-3xl animate-pulse"></div>

      {/* Subtle energy lines */}
      <div className="absolute top-0 left-1/4 w-px h-full bg-gradient-to-b from-transparent via-cyan-400/20 to-transparent animate-pulse opacity-50"></div>
      <div className="absolute top-0 right-1/3 w-px h-full bg-gradient-to-b from-transparent via-blue-400/20 to-transparent animate-pulse opacity-50" style={{ animationDelay: '1s' }}></div>
    </div>
  )
}