import React, { useEffect, useRef } from 'react';

const LabParticles = ({ intensity = 'normal', show = true }) => {
  const containerRef = useRef(null);

  useEffect(() => {
    if (!show) return;

    const container = containerRef.current;
    if (!container) return;

    // Clean up existing particles
    container.innerHTML = '';

    // Determine particle count based on intensity
    const particleCount = {
      light: 6,
      normal: 9,
      heavy: 15
    }[intensity] || 9;

    // Create floating atoms instead of simple particles
    for (let i = 0; i < particleCount; i++) {
      const atom = document.createElement('div');
      atom.className = 'floating-atom';
      
      // Random positioning
      atom.style.left = `${Math.random() * 100}%`;
      atom.style.animationDelay = `${Math.random() * 8}s`;
      atom.style.animationDuration = `${8 + Math.random() * 4}s`;
      
      // Random colors from our lab theme
      const colors = ['#00ff88', '#0066ff', '#8a2be2'];
      const color = colors[Math.floor(Math.random() * colors.length)];
      
      // Create atom structure
      atom.innerHTML = `
        <div class="atom-nucleus" style="background: ${color}; box-shadow: 0 0 8px ${color};"></div>
        <div class="atom-electron-orbit">
          <div class="atom-electron" style="background: ${color}; box-shadow: 0 0 4px ${color};"></div>
        </div>
      `;
      
      // Random sizes
      const size = 12 + Math.random() * 8;
      atom.style.width = `${size}px`;
      atom.style.height = `${size}px`;
      
      container.appendChild(atom);
    }

    return () => {
      if (container) {
        container.innerHTML = '';
      }
    };
  }, [intensity, show]);

  if (!show) return null;

  return (
    <>
      <div 
        ref={containerRef}
        className="floating-particles"
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          pointerEvents: 'none',
          zIndex: -1,
          opacity: 0.6
        }}
      />
      <style jsx>{`
        .floating-particles .floating-atom {
          position: absolute;
          animation: float-atom-custom 12s infinite ease-in-out;
        }
        
        .floating-particles .atom-nucleus {
          position: absolute;
          top: 50%;
          left: 50%;
          width: 4px;
          height: 4px;
          border-radius: 50%;
          transform: translate(-50%, -50%);
        }
        
        .floating-particles .atom-electron-orbit {
          position: absolute;
          top: 50%;
          left: 50%;
          width: 100%;
          height: 100%;
          border: 1px solid rgba(255, 255, 255, 0.2);
          border-radius: 50%;
          transform: translate(-50%, -50%);
          animation: atom-orbit-rotate 2s linear infinite;
        }
        
        .floating-particles .atom-electron {
          position: absolute;
          width: 2px;
          height: 2px;
          border-radius: 50%;
          top: -1px;
          left: calc(50% - 1px);
        }
        
        @keyframes float-atom-custom {
          0%, 100% { 
            transform: translateY(100vh) translateX(0px); 
            opacity: 0; 
          }
          10% { 
            opacity: 0.8; 
          }
          50% { 
            transform: translateY(50vh) translateX(20px); 
            opacity: 1; 
          }
          90% { 
            opacity: 0.4; 
          }
        }
        
        @keyframes atom-orbit-rotate {
          from { transform: translate(-50%, -50%) rotate(0deg); }
          to { transform: translate(-50%, -50%) rotate(360deg); }
        }
      `}</style>
    </>
  );
};

export default LabParticles;