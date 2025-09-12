export default function SimpleLabBackground() {
  return (
    <>
      <div className="simple-lab-background" />
      <div className="simple-lab-overlay" />
      
      <style jsx>{`
        .simple-lab-background {
          position: fixed;
          top: 0;
          left: 0;
          width: 100vw;
          height: 100vh;
          background: 
            radial-gradient(circle at 30% 70%, rgba(0, 120, 180, 0.1) 0%, transparent 40%),
            radial-gradient(circle at 70% 30%, rgba(0, 180, 120, 0.1) 0%, transparent 40%),
            linear-gradient(135deg, #1a202c 0%, #2d3748 25%, #1a202c 50%, #2d3748 75%, #1a202c 100%);
          z-index: -2;
        }
        
        .simple-lab-overlay {
          position: fixed;
          top: 0;
          left: 0;
          width: 100vw;
          height: 100vh;
          background: linear-gradient(
            135deg,
            rgba(0, 30, 50, 0.92) 0%,
            rgba(0, 50, 70, 0.88) 25%,
            rgba(0, 70, 90, 0.85) 50%,
            rgba(0, 50, 70, 0.88) 75%,
            rgba(0, 30, 50, 0.92) 100%
          );
          z-index: -1;
        }
        
        /* Griglia sottile */}
        .simple-lab-overlay::before {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          background-image: 
            linear-gradient(rgba(0, 255, 255, 0.02) 1px, transparent 1px),
            linear-gradient(90deg, rgba(0, 255, 255, 0.02) 1px, transparent 1px);
          background-size: 60px 60px;
          animation: subtleGridPulse 12s ease-in-out infinite;
        }
        
        @keyframes subtleGridPulse {
          0%, 100% {
            opacity: 0.2;
          }
          50% {
            opacity: 0.4;
          }
        }
      `}</style>
    </>
  )
}