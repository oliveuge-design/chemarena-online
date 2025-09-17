import { useState, useEffect } from 'react';
import clsx from 'clsx';

export default function SciFiImageLoader({
  query,
  category = 'science',
  className = '',
  width = 800,
  height = 600,
  cyberpunkFallback = true
}) {
  const [imageData, setImageData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    loadImage();
  }, [query, category]);

  const loadImage = async () => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch(`/api/unsplash?query=${encodeURIComponent(query)}&category=${category}`);
      const data = await response.json();

      if (data.success) {
        setImageData(data);
      } else {
        setImageData(data); // Include fallback gradient
      }
    } catch (err) {
      setError('Errore caricamento immagine');
      console.error('SciFiImageLoader error:', err);
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
      <div className={clsx('relative overflow-hidden rounded-xl', className)}>
        {/* Loading animation cyberpunk */}
        <div className="w-full h-full bg-gradient-to-br from-cyan-900/20 to-purple-900/20 flex items-center justify-center">
          <div className="relative">
            {/* Pulsing core */}
            <div className="w-12 h-12 rounded-full bg-gradient-to-r from-cyan-400 to-purple-500 animate-pulse"></div>

            {/* Orbiting particles */}
            <div className="absolute -inset-4">
              <div className="w-20 h-20 border-2 border-cyan-400/30 rounded-full animate-spin">
                <div className="absolute top-0 left-1/2 w-2 h-2 bg-cyan-400 rounded-full -translate-x-1/2 -translate-y-1"></div>
              </div>
            </div>

            {/* Inner glow */}
            <div className="absolute inset-0 w-12 h-12 rounded-full bg-gradient-to-r from-cyan-400 to-purple-500 blur-lg opacity-60 animate-ping"></div>
          </div>

          <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2">
            <span className="text-cyan-400 text-sm font-mono animate-pulse">
              CARICAMENTO IMMAGINE...
            </span>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className={clsx('relative overflow-hidden rounded-xl bg-red-900/20', className)}>
        <div className="w-full h-full flex items-center justify-center p-4">
          <div className="text-center">
            <div className="text-red-400 text-2xl mb-2">⚠</div>
            <span className="text-red-400 text-sm font-mono">{error}</span>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={clsx('relative overflow-hidden rounded-xl', className)}>
      {imageData?.imageUrl ? (
        <div className="relative">
          <img
            src={imageData.imageUrl}
            alt={`Immagine: ${query}`}
            className="w-full h-full object-cover"
            style={{ width, height }}
            onError={(e) => {
              // Fallback se immagine non carica
              e.target.style.display = 'none';
              e.target.nextElementSibling.style.display = 'block';
            }}
          />

          {/* Fallback gradient nascosto */}
          <div
            className={clsx(
              'absolute inset-0 hidden',
              imageData.fallbackGradient || 'bg-gradient-to-br from-cyan-500 to-purple-600'
            )}
          />

          {/* Overlay cyberpunk */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent"></div>

          {/* Bordi luminosi */}
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-cyan-400/80 to-transparent"></div>
          <div className="absolute bottom-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-purple-400/80 to-transparent"></div>

          {/* Particelle di energia */}
          <div className="absolute top-2 right-2 w-2 h-2 bg-cyan-400 rounded-full animate-ping opacity-60"></div>
          <div className="absolute bottom-2 left-2 w-1.5 h-1.5 bg-purple-400 rounded-full animate-ping opacity-40"
               style={{animationDelay: '0.7s'}}></div>

          {/* Badge sorgente */}
          <div className="absolute top-2 left-2 px-2 py-1 bg-black/60 rounded-md backdrop-blur-sm">
            <span className="text-xs text-cyan-400 font-mono">
              {imageData.metadata?.source?.toUpperCase() || 'SCI-FI'}
            </span>
          </div>
        </div>
      ) : (
        // Fallback gradient completo
        <div className={clsx(
          'relative w-full h-full flex items-center justify-center',
          imageData?.fallbackGradient || 'bg-gradient-to-br from-cyan-500 to-purple-600'
        )} style={{ width, height }}>
          {/* Pattern geometrico */}
          <div className="absolute inset-0 opacity-20">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_50%,rgba(255,255,255,0.1)_100%)]"></div>
            <div className="absolute inset-4 border border-white/20 rounded-lg"></div>
            <div className="absolute inset-8 border border-white/10 rounded-lg"></div>
          </div>

          {/* Icona chimica */}
          <div className="relative z-10 text-white/60">
            <svg className="w-16 h-16" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 2C13.1 2 14 2.9 14 4C14 5.1 13.1 6 12 6C10.9 6 10 5.1 10 4C10 2.9 10.9 2 12 2ZM21 9V7L15 7.5V9C15 10.1 14.1 11 13 11S11 10.1 11 9V7.5L5 7V9C5 10.1 4.1 11 3 11S1 10.1 1 9V7L7 7.5V9C7 11.2 8.8 13 11 13S15 11.2 15 9V7.5L21 7V9C21 10.1 20.1 11 19 11S17 10.1 17 9H15V11C15 13.2 16.8 15 19 15S23 13.2 23 11V9H21Z"/>
            </svg>
          </div>
        </div>
      )}

      {/* Glow esterno */}
      <div className="absolute -inset-1 bg-gradient-to-r from-cyan-400/20 to-purple-400/20 rounded-xl blur-sm -z-10"></div>
    </div>
  );
}