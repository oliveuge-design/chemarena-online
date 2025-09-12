import React from 'react';

const AtomAnimation = ({ 
  size = 80, 
  position = { top: '10%', right: '10%' },
  show = true 
}) => {
  if (!show) return null;

  const nucleusSize = size * 0.2;
  const orbit1Size = size * 0.5;
  const orbit2Size = size * 0.8;
  const electronSize = size * 0.08;

  return (
    <div 
      className="atom-container"
      style={{
        position: 'fixed',
        ...position,
        width: `${size}px`,
        height: `${size}px`,
        zIndex: 0,
        pointerEvents: 'none'
      }}
    >
      <div className="atom" style={{ 
        position: 'relative', 
        width: '100%', 
        height: '100%',
        animation: 'atom-spin 15s linear infinite'
      }}>
        {/* Nucleus */}
        <div 
          className="nucleus"
          style={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            width: `${nucleusSize}px`,
            height: `${nucleusSize}px`,
            background: '#8a2be2',
            borderRadius: '50%',
            transform: 'translate(-50%, -50%)',
            boxShadow: '0 0 15px #8a2be2',
            animation: 'nucleus-pulse 3s ease-in-out infinite'
          }}
        />
        
        {/* Orbit 1 */}
        <div 
          className="orbit orbit-1"
          style={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            width: `${orbit1Size}px`,
            height: `${orbit1Size}px`,
            border: '1px solid rgba(0, 191, 255, 0.4)',
            borderRadius: '50%',
            transform: 'translate(-50%, -50%)',
            animation: 'orbit-rotate 4s linear infinite'
          }}
        >
          <div 
            className="electron"
            style={{
              position: 'absolute',
              width: `${electronSize}px`,
              height: `${electronSize}px`,
              background: '#00ff88',
              borderRadius: '50%',
              top: `-${electronSize/2}px`,
              left: `calc(50% - ${electronSize/2}px)`,
              boxShadow: '0 0 8px #00ff88'
            }}
          />
        </div>
        
        {/* Orbit 2 */}
        <div 
          className="orbit orbit-2"
          style={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            width: `${orbit2Size}px`,
            height: `${orbit2Size}px`,
            border: '1px solid rgba(0, 255, 136, 0.3)',
            borderRadius: '50%',
            transform: 'translate(-50%, -50%) rotate(60deg)',
            animation: 'orbit-rotate 6s linear infinite reverse'
          }}
        >
          <div 
            className="electron"
            style={{
              position: 'absolute',
              width: `${electronSize}px`,
              height: `${electronSize}px`,
              background: '#00bfff',
              borderRadius: '50%',
              top: `-${electronSize/2}px`,
              left: `calc(50% - ${electronSize/2}px)`,
              boxShadow: '0 0 8px #00bfff'
            }}
          />
        </div>
      </div>

      <style jsx>{`
        @keyframes atom-spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        
        @keyframes orbit-rotate {
          from { transform: translate(-50%, -50%) rotate(0deg); }
          to { transform: translate(-50%, -50%) rotate(360deg); }
        }
        
        @keyframes nucleus-pulse {
          0%, 100% { 
            transform: translate(-50%, -50%) scale(1); 
            box-shadow: 0 0 15px #8a2be2; 
          }
          50% { 
            transform: translate(-50%, -50%) scale(1.2); 
            box-shadow: 0 0 25px #8a2be2; 
          }
        }
        
        .orbit-2 {
          animation: orbit-rotate 6s linear infinite reverse !important;
        }
      `}</style>
    </div>
  );
};

export default AtomAnimation;