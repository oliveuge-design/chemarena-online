import { useState, useEffect } from "react"

const BACKGROUNDS = {
  default: "/background.webp", // Fallback immagine esistente
  laboratory: "/lab-background-optimized.svg",
  gaming1: "/gaming-background-1.svg", // 1.3MB - Sfondo gaming professionale 1
  gaming2: "/gaming-background-2.svg", // 1.2MB - Sfondo gaming professionale 2
  gaming3: "/gaming-background-3.svg", // 1.2MB - Sfondo gaming professionale 3
  original: "/lab-background.svg" // SVG completo originale
}

const BACKGROUND_THEMES = {
  laboratory: {
    name: "Laboratorio Cyberpunk",
    description: "Laboratorio spaziale con beute animate e vapori",
    colors: {
      primary: "#00ff88",
      secondary: "#00bfff",
      accent: "#8a2be2"
    }
  },
  gaming1: {
    name: "Gaming Tech Arancione",
    description: "Sfondo gaming professionale nero e arancione (1)",
    colors: {
      primary: "#ff8c00",
      secondary: "#ff6b00",
      accent: "#ff4500"
    }
  },
  gaming2: {
    name: "Gaming Tech Avanzato",
    description: "Sfondo gaming professionale nero e arancione (2)",
    colors: {
      primary: "#ff8c00",
      secondary: "#ff6b00",
      accent: "#ff4500"
    }
  },
  gaming3: {
    name: "Gaming Tech Premium",
    description: "Sfondo gaming professionale nero e arancione (3)",
    colors: {
      primary: "#ff8c00",
      secondary: "#ff6b00",
      accent: "#ff4500"
    }
  },
  original: {
    name: "Laboratorio Completo",
    description: "Versione completa con tutti gli elementi animati",
    colors: {
      primary: "#00ff88",
      secondary: "#00bfff",
      accent: "#8a2be2"
    }
  }
}

export default function BackgroundManager({
  theme = "laboratory",
  quizId = null,
  className = "",
  children,
  opacity = 70,
  overlay = true
}) {
  const [backgroundLoaded, setBackgroundLoaded] = useState(false)
  const [fallback, setFallback] = useState(false)
  const [loadingProgress, setLoadingProgress] = useState(0)
  const [selectedTheme, setSelectedTheme] = useState(theme)

  // Determina il tema da utilizzare
  useEffect(() => {
    let themeToUse = theme

    // Se abbiamo un quizId, controlla se ci sono preferenze salvate
    if (quizId) {
      try {
        const preferences = localStorage.getItem('quiz-theme-preferences')
        if (preferences) {
          const prefs = JSON.parse(preferences)
          if (prefs[quizId]) {
            themeToUse = prefs[quizId]
            console.log(`🎨 Tema personalizzato per quiz ${quizId}: ${themeToUse}`)
          } else {
            console.log(`🎨 Tema default per quiz ${quizId}: ${themeToUse}`)
          }
        }
      } catch (error) {
        console.error('Errore lettura preferenze tema:', error)
      }
    }

    setSelectedTheme(themeToUse)
  }, [theme, quizId])

  const currentTheme = BACKGROUND_THEMES[selectedTheme] || BACKGROUND_THEMES.laboratory
  const backgroundUrl = BACKGROUNDS[selectedTheme] || BACKGROUNDS.laboratory

  useEffect(() => {
    setBackgroundLoaded(false)
    setFallback(false)
    setLoadingProgress(0)

    // Preload SVG background with progress tracking for large files
    if (backgroundUrl.endsWith('.svg')) {
      const startTime = Date.now()

      // Simulate progress for large SVG files
      const progressInterval = setInterval(() => {
        const elapsed = Date.now() - startTime
        const progress = Math.min(90, (elapsed / 3000) * 100) // Max 90% until actual load
        setLoadingProgress(progress)
      }, 100)

      fetch(backgroundUrl)
        .then(response => {
          if (!response.ok) throw new Error('SVG not found')
          clearInterval(progressInterval)
          setLoadingProgress(100)

          // Small delay to show complete progress
          setTimeout(() => {
            setBackgroundLoaded(true)
          }, 200)
        })
        .catch(() => {
          console.warn(`⚠️ Fallback to default background: ${backgroundUrl} not found`)
          clearInterval(progressInterval)
          setFallback(true)
          setBackgroundLoaded(true)
        })
    } else {
      // For regular images
      const img = new Image()
      img.onload = () => {
        setLoadingProgress(100)
        setBackgroundLoaded(true)
      }
      img.onerror = () => {
        setFallback(true)
        setBackgroundLoaded(true)
      }
      img.src = backgroundUrl
    }
  }, [backgroundUrl, selectedTheme])

  const finalBackgroundUrl = fallback ? BACKGROUNDS.default : backgroundUrl

  return (
    <div className={`relative ${className}`}>
      {/* Background Layer */}
      <div
        className={`fixed left-0 top-0 -z-10 h-full w-full transition-opacity duration-1000 ${
          backgroundLoaded ? 'opacity-100' : 'opacity-0'
        }`}
        style={{
          backgroundImage: `url(${finalBackgroundUrl})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat',
          backgroundAttachment: 'fixed'
        }}
      />

      {/* Overlay Layer */}
      {overlay && (
        <div
          className={`fixed left-0 top-0 -z-[9] h-full w-full bg-black transition-opacity duration-1000 ${
            backgroundLoaded ? 'opacity-100' : 'opacity-0'
          }`}
          style={{
            opacity: `${100 - opacity}%`
          }}
        />
      )}

      {/* Loading placeholder with progress */}
      {!backgroundLoaded && (
        <div className="fixed left-0 top-0 -z-10 h-full w-full bg-gradient-to-br from-gray-900 via-gray-800 to-black">
          {/* Loading indicator for large files */}
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="text-center">
              <div className="w-32 h-32 border-4 border-orange-500/30 border-t-orange-500 rounded-full animate-spin mb-4"></div>
              <div className="text-white/80 text-sm mb-2">
                Caricamento sfondo...
              </div>
              <div className="w-48 h-2 bg-gray-700 rounded-full overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-orange-500 to-orange-400 transition-all duration-300 ease-out"
                  style={{ width: `${loadingProgress}%` }}
                ></div>
              </div>
              <div className="text-orange-400 text-xs mt-2 font-mono">
                {Math.round(loadingProgress)}%
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Content */}
      <div className="relative z-0">
        {children}
      </div>

      {/* Theme CSS variables for components */}
      <style jsx>{`
        :global(:root) {
          --theme-primary: ${currentTheme.colors.primary};
          --theme-secondary: ${currentTheme.colors.secondary};
          --theme-accent: ${currentTheme.colors.accent};
        }
      `}</style>
    </div>
  )
}

// Hook per accedere al tema corrente
export function useCurrentTheme(theme = "laboratory") {
  return BACKGROUND_THEMES[theme] || BACKGROUND_THEMES.laboratory
}

// Utility per ottenere tutti i temi disponibili
export function getAvailableThemes() {
  return Object.entries(BACKGROUND_THEMES).map(([key, theme]) => ({
    id: key,
    ...theme
  }))
}