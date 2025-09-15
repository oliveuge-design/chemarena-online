import { useState, useEffect } from "react"
import { getAvailableThemes } from "@/components/BackgroundManager"

export default function BackgroundSelector({ onThemeChange, currentTheme = "laboratory" }) {
  const [selectedTheme, setSelectedTheme] = useState(currentTheme)
  const [previewMode, setPreviewMode] = useState(false)
  const themes = getAvailableThemes()

  useEffect(() => {
    setSelectedTheme(currentTheme)
  }, [currentTheme])

  const handleThemeChange = (themeId) => {
    setSelectedTheme(themeId)
    if (onThemeChange) {
      onThemeChange(themeId)
    }
  }

  const togglePreview = () => {
    setPreviewMode(!previewMode)
  }

  return (
    <div className="w-full max-w-4xl mx-auto p-6 bg-white/10 backdrop-blur-sm rounded-lg border border-white/20">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-xl font-bold text-white mb-2">
            🎨 Sfondi Quiz
          </h3>
          <p className="text-white/80 text-sm">
            Scegli il tema visuale per le pagine di gioco
          </p>
        </div>

        <button
          onClick={togglePreview}
          className={`px-4 py-2 rounded-lg font-medium transition-all duration-300 ${
            previewMode
              ? 'bg-green-500 hover:bg-green-600 text-white'
              : 'bg-white/20 hover:bg-white/30 text-white'
          }`}
        >
          {previewMode ? '✅ Modalità Anteprima' : '👁️ Anteprima'}
        </button>
      </div>

      {/* Theme Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4 mb-6">
        {themes.map((theme) => (
          <div
            key={theme.id}
            className={`relative group cursor-pointer rounded-lg overflow-hidden transition-all duration-300 ${
              selectedTheme === theme.id
                ? 'ring-4 ring-white/60 scale-105'
                : 'hover:scale-102 hover:ring-2 hover:ring-white/30'
            }`}
            onClick={() => handleThemeChange(theme.id)}
          >
            {/* Preview thumbnail */}
            <div className="aspect-video bg-gradient-to-br from-gray-800 via-gray-700 to-gray-900 relative overflow-hidden">
              {/* Theme-specific preview */}
              {theme.id === 'laboratory' && (
                <div className="absolute inset-0 bg-gradient-to-b from-blue-900/50 via-purple-900/50 to-blue-800/50">
                  <div className="absolute top-2 left-2 w-3 h-3 rounded-full bg-green-400 animate-pulse"></div>
                  <div className="absolute top-4 right-4 w-2 h-2 rounded-full bg-blue-400 animate-ping"></div>
                  <div className="absolute bottom-3 left-1/2 transform -translate-x-1/2 w-8 h-8 border border-green-400/50 rounded-full flex items-center justify-center">
                    <div className="w-3 h-3 bg-green-400/70 rounded-full animate-pulse"></div>
                  </div>
                </div>
              )}

              {theme.id === 'gaming1' && (
                <div className="absolute inset-0 bg-gradient-to-br from-orange-900/60 via-gray-900 to-orange-800/40">
                  <div className="absolute top-1 left-1 right-1 h-px bg-orange-400/50"></div>
                  <div className="absolute top-3 left-3 w-2 h-2 border border-orange-400/60 rotate-45"></div>
                  <div className="absolute bottom-2 right-2 w-4 h-px bg-orange-400/40"></div>
                  <div className="absolute bottom-4 left-4 w-1 h-4 bg-orange-400/30"></div>
                </div>
              )}

              {theme.id === 'gaming2' && (
                <div className="absolute inset-0 bg-gradient-to-r from-orange-900/50 via-gray-900 to-orange-700/50">
                  <div className="absolute inset-0 opacity-30">
                    <div className="absolute top-2 left-2 w-1 h-1 bg-orange-400 rounded-full"></div>
                    <div className="absolute top-4 left-6 w-1 h-1 bg-orange-400 rounded-full"></div>
                    <div className="absolute top-6 left-4 w-1 h-1 bg-orange-400 rounded-full"></div>
                    {/* Neural network lines */}
                    <svg className="absolute inset-0 w-full h-full" viewBox="0 0 100 60">
                      <line x1="10" y1="15" x2="30" y2="35" stroke="#ff8c00" strokeWidth="0.5" opacity="0.4"/>
                      <line x1="70" y1="15" x2="50" y2="35" stroke="#ff8c00" strokeWidth="0.5" opacity="0.4"/>
                    </svg>
                  </div>
                  <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-6 h-6 rounded-full bg-orange-400/20 animate-pulse"></div>
                </div>
              )}

              {theme.id === 'gaming3' && (
                <div className="absolute inset-0 bg-gradient-to-br from-orange-900/60 via-black to-orange-800/40">
                  <div className="absolute top-1 left-1 right-1 h-px bg-orange-400/60 animate-pulse"></div>
                  <div className="absolute bottom-1 left-1 right-1 h-px bg-orange-500/40"></div>
                  <div className="absolute top-3 right-3 w-3 h-3 border border-orange-400/50">
                    <div className="absolute inset-1 bg-orange-400/30 animate-ping"></div>
                  </div>
                  <div className="absolute bottom-3 left-3 w-2 h-6 bg-orange-400/40"></div>
                  <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
                    <div className="w-4 h-4 border border-orange-400/40 rotate-45 animate-spin"></div>
                  </div>
                </div>
              )}

              {theme.id === 'original' && (
                <div className="absolute inset-0 bg-gradient-to-b from-indigo-900/60 via-purple-900/50 to-blue-900/60">
                  <div className="absolute top-2 left-2 w-2 h-2 rounded-full bg-cyan-400 animate-pulse"></div>
                  <div className="absolute top-3 right-3 w-1 h-1 rounded-full bg-purple-400 animate-ping"></div>
                  <div className="absolute bottom-4 left-4 w-4 h-4 border border-cyan-400/50 rounded-full">
                    <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-1 h-1 bg-cyan-400 rounded-full animate-pulse"></div>
                  </div>
                  <div className="absolute bottom-2 right-6 w-3 h-1 bg-purple-400/40"></div>
                </div>
              )}

              {/* Selection indicator */}
              {selectedTheme === theme.id && (
                <div className="absolute inset-0 bg-white/10 flex items-center justify-center">
                  <div className="w-8 h-8 rounded-full bg-white/90 flex items-center justify-center">
                    <svg className="w-5 h-5 text-gray-800" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                  </div>
                </div>
              )}
            </div>

            {/* Theme info */}
            <div className="p-3 bg-gray-900/80 backdrop-blur-sm">
              <h4 className="font-semibold text-white text-sm mb-1 truncate">
                {theme.name}
              </h4>
              <p className="text-white/70 text-xs line-clamp-2">
                {theme.description}
              </p>

              {/* Color palette */}
              <div className="flex gap-1 mt-2">
                <div
                  className="w-3 h-3 rounded-full border border-white/20"
                  style={{ backgroundColor: theme.colors.primary }}
                  title={`Primario: ${theme.colors.primary}`}
                ></div>
                <div
                  className="w-3 h-3 rounded-full border border-white/20"
                  style={{ backgroundColor: theme.colors.secondary }}
                  title={`Secondario: ${theme.colors.secondary}`}
                ></div>
                <div
                  className="w-3 h-3 rounded-full border border-white/20"
                  style={{ backgroundColor: theme.colors.accent }}
                  title={`Accento: ${theme.colors.accent}`}
                ></div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Current selection info */}
      <div className="bg-white/5 rounded-lg p-4 border border-white/10">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-white/10 to-white/5 flex items-center justify-center">
            🎯
          </div>
          <div>
            <h4 className="font-medium text-white">
              Tema Selezionato: {themes.find(t => t.id === selectedTheme)?.name}
            </h4>
            <p className="text-white/70 text-sm">
              {themes.find(t => t.id === selectedTheme)?.description}
            </p>
          </div>
        </div>
      </div>

      {previewMode && (
        <div className="mt-4 p-3 bg-blue-500/20 border border-blue-400/30 rounded-lg">
          <div className="flex items-center gap-2">
            <svg className="w-5 h-5 text-blue-400" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
            </svg>
            <span className="text-blue-300 font-medium">Modalità Anteprima Attiva</span>
          </div>
          <p className="text-blue-200/80 text-sm mt-1">
            Le modifiche sono applicate in tempo reale. Testa il gioco per vedere il tema completo.
          </p>
        </div>
      )}
    </div>
  )
}