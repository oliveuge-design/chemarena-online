import { useEffect, useRef } from 'react'

export default function TronBackground({ children }) {
  const canvasRef = useRef()

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext('2d')
    let animationFrameId
    
    // Dimensioni responsive
    const resizeCanvas = () => {
      canvas.width = window.innerWidth
      canvas.height = window.innerHeight
    }
    
    resizeCanvas()
    window.addEventListener('resize', resizeCanvas)

    // Griglia Tron
    const drawGrid = (time) => {
      const gridSize = 40
      const opacity = 0.1 + 0.05 * Math.sin(time * 0.001)
      
      ctx.strokeStyle = `rgba(0, 255, 255, ${opacity})`
      ctx.lineWidth = 0.5
      ctx.beginPath()

      // Linee verticali
      for (let x = 0; x < canvas.width; x += gridSize) {
        const offset = 5 * Math.sin(time * 0.002 + x * 0.01)
        ctx.moveTo(x + offset, 0)
        ctx.lineTo(x + offset, canvas.height)
      }

      // Linee orizzontali
      for (let y = 0; y < canvas.height; y += gridSize) {
        const offset = 5 * Math.cos(time * 0.002 + y * 0.01)
        ctx.moveTo(0, y + offset)
        ctx.lineTo(canvas.width, y + offset)
      }

      ctx.stroke()
    }

    // Circuiti animati
    const circuits = []
    for (let i = 0; i < 8; i++) {
      circuits.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        length: 100 + Math.random() * 200,
        direction: Math.random() * Math.PI * 2,
        speed: 0.5 + Math.random() * 1.5,
        color: i % 3 === 0 ? '#00ffff' : i % 3 === 1 ? '#00ff88' : '#39ff14',
        opacity: 0.3 + Math.random() * 0.4,
        phase: Math.random() * Math.PI * 2
      })
    }

    const drawCircuits = (time) => {
      circuits.forEach((circuit, index) => {
        const intensity = 0.5 + 0.5 * Math.sin(time * 0.003 + circuit.phase)
        const opacity = circuit.opacity * intensity
        
        ctx.strokeStyle = circuit.color.replace(')', `, ${opacity})`)
          .replace('rgb', 'rgba')
          .replace('#', 'rgba(')
        
        if (circuit.color === '#00ffff') {
          ctx.strokeStyle = `rgba(0, 255, 255, ${opacity})`
        } else if (circuit.color === '#00ff88') {
          ctx.strokeStyle = `rgba(0, 255, 136, ${opacity})`
        } else {
          ctx.strokeStyle = `rgba(57, 255, 20, ${opacity})`
        }
        
        ctx.lineWidth = 1 + intensity
        ctx.beginPath()
        
        const startX = circuit.x + 20 * Math.cos(time * 0.001 + index)
        const startY = circuit.y + 20 * Math.sin(time * 0.001 + index)
        const endX = startX + circuit.length * Math.cos(circuit.direction)
        const endY = startY + circuit.length * Math.sin(circuit.direction)
        
        ctx.moveTo(startX, startY)
        ctx.lineTo(endX, endY)
        ctx.stroke()

        // Nodi ai terminali
        ctx.fillStyle = ctx.strokeStyle
        ctx.beginPath()
        ctx.arc(startX, startY, 2, 0, Math.PI * 2)
        ctx.fill()
        
        ctx.beginPath()
        ctx.arc(endX, endY, 2, 0, Math.PI * 2)
        ctx.fill()

        // Aggiorna posizione
        circuit.x += circuit.speed * Math.cos(circuit.direction + time * 0.0005)
        circuit.y += circuit.speed * Math.sin(circuit.direction + time * 0.0005)
        
        // Wraparound
        if (circuit.x < -50) circuit.x = canvas.width + 50
        if (circuit.x > canvas.width + 50) circuit.x = -50
        if (circuit.y < -50) circuit.y = canvas.height + 50
        if (circuit.y > canvas.height + 50) circuit.y = -50
      })
    }

    // Particelle di energia
    const particles = []
    for (let i = 0; i < 15; i++) {
      particles.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        vx: (Math.random() - 0.5) * 2,
        vy: (Math.random() - 0.5) * 2,
        size: 1 + Math.random() * 3,
        color: i % 3 === 0 ? '#00ffff' : i % 3 === 1 ? '#00ff88' : '#39ff14',
        life: Math.random(),
        decay: 0.002 + Math.random() * 0.005
      })
    }

    const drawParticles = (time) => {
      particles.forEach((particle, index) => {
        const intensity = Math.sin(time * 0.005 + index) * 0.5 + 0.5
        const opacity = particle.life * intensity
        
        if (particle.color === '#00ffff') {
          ctx.fillStyle = `rgba(0, 255, 255, ${opacity})`
        } else if (particle.color === '#00ff88') {
          ctx.fillStyle = `rgba(0, 255, 136, ${opacity})`
        } else {
          ctx.fillStyle = `rgba(57, 255, 20, ${opacity})`
        }

        ctx.beginPath()
        ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2)
        ctx.fill()

        // Effetto glow
        ctx.shadowBlur = 10
        ctx.shadowColor = particle.color
        ctx.fill()
        ctx.shadowBlur = 0

        // Aggiorna particella
        particle.x += particle.vx
        particle.y += particle.vy
        particle.life -= particle.decay

        // Reset particella se morta
        if (particle.life <= 0) {
          particle.x = Math.random() * canvas.width
          particle.y = Math.random() * canvas.height
          particle.life = 1
          particle.vx = (Math.random() - 0.5) * 2
          particle.vy = (Math.random() - 0.5) * 2
        }

        // Wraparound
        if (particle.x < 0) particle.x = canvas.width
        if (particle.x > canvas.width) particle.x = 0
        if (particle.y < 0) particle.y = canvas.height
        if (particle.y > canvas.height) particle.y = 0
      })
    }

    // Onde di energia periodiche
    let waveTime = 0
    const drawEnergyWaves = (time) => {
      if (time - waveTime > 8000) { // Ogni 8 secondi
        waveTime = time
      }
      
      const waveProgress = (time - waveTime) / 3000 // 3 secondi di durata
      if (waveProgress > 1) return

      const centerX = canvas.width / 2
      const centerY = canvas.height / 2
      const radius = waveProgress * Math.max(canvas.width, canvas.height)
      
      const opacity = (1 - waveProgress) * 0.3
      
      ctx.strokeStyle = `rgba(0, 255, 255, ${opacity})`
      ctx.lineWidth = 2
      ctx.beginPath()
      ctx.arc(centerX, centerY, radius, 0, Math.PI * 2)
      ctx.stroke()
      
      // Onda interna
      ctx.strokeStyle = `rgba(57, 255, 20, ${opacity * 0.7})`
      ctx.lineWidth = 1
      ctx.beginPath()
      ctx.arc(centerX, centerY, radius * 0.7, 0, Math.PI * 2)
      ctx.stroke()
    }

    // Loop di animazione
    const animate = (time) => {
      ctx.fillStyle = 'rgba(0, 0, 0, 0.05)'
      ctx.fillRect(0, 0, canvas.width, canvas.height)
      
      drawGrid(time)
      drawCircuits(time)
      drawParticles(time)
      drawEnergyWaves(time)
      
      animationFrameId = requestAnimationFrame(animate)
    }

    animate(0)

    return () => {
      window.removeEventListener('resize', resizeCanvas)
      cancelAnimationFrame(animationFrameId)
    }
  }, [])

  return (
    <div className="tron-background">
      <canvas 
        ref={canvasRef}
        className="background-canvas"
      />
      
      {/* Gradiente overlay */}
      <div className="gradient-overlay" />
      
      {/* Contenuto */}
      <div className="content-layer">
        {children}
      </div>

      <style jsx>{`
        .tron-background {
          position: relative;
          min-height: 100vh;
          background: linear-gradient(135deg, #000000 0%, #001122 50%, #000000 100%);
          overflow: hidden;
        }

        .background-canvas {
          position: absolute;
          top: 0;
          left: 0;
          z-index: 1;
          pointer-events: none;
        }

        .gradient-overlay {
          position: absolute;
          inset: 0;
          z-index: 2;
          background: radial-gradient(
            circle at center,
            rgba(0, 0, 0, 0) 0%,
            rgba(0, 0, 0, 0.3) 70%,
            rgba(0, 0, 0, 0.6) 100%
          );
          pointer-events: none;
        }

        .content-layer {
          position: relative;
          z-index: 10;
          min-height: 100vh;
        }

        /* Effetti aggiuntivi */
        .tron-background::before {
          content: '';
          position: absolute;
          top: -50%;
          left: -50%;
          width: 200%;
          height: 200%;
          background: repeating-conic-gradient(
            from 0deg at 50% 50%,
            rgba(0, 255, 255, 0.03) 0deg,
            transparent 0.5deg,
            transparent 2deg,
            rgba(0, 255, 255, 0.03) 2.5deg
          );
          animation: rotateBackground 60s linear infinite;
          z-index: 0;
        }

        @keyframes rotateBackground {
          from {
            transform: rotate(0deg);
          }
          to {
            transform: rotate(360deg);
          }
        }

        .tron-background::after {
          content: '';
          position: absolute;
          inset: 0;
          background: 
            radial-gradient(circle at 20% 80%, rgba(0, 255, 136, 0.05) 0%, transparent 50%),
            radial-gradient(circle at 80% 20%, rgba(57, 255, 20, 0.05) 0%, transparent 50%),
            radial-gradient(circle at 40% 40%, rgba(0, 255, 255, 0.03) 0%, transparent 50%);
          z-index: 1;
          animation: pulseOverlay 8s ease-in-out infinite alternate;
        }

        @keyframes pulseOverlay {
          from {
            opacity: 0.5;
          }
          to {
            opacity: 1;
          }
        }
      `}</style>
    </div>
  )
}