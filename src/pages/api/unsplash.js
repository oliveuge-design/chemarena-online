// API per integrazione Unsplash con tema sci-fi/cyberpunk
export default function handler(req, res) {
  const { query, category = 'science', orientation = 'landscape' } = req.query;

  // Keywords sci-fi per ChemArena
  const scienceKeywords = [
    'laboratory', 'chemistry', 'science', 'molecules', 'research',
    'cyberpunk', 'neon', 'futuristic', 'technology', 'digital',
    'hologram', 'plasma', 'laser', 'crystal', 'galaxy', 'space'
  ];

  // Costruisce query con parole chiave sci-fi
  const searchQuery = query || scienceKeywords[Math.floor(Math.random() * scienceKeywords.length)];
  const enhancedQuery = `${searchQuery} ${category === 'science' ? 'laboratory chemistry' : category}`;

  try {
    // Usa Unsplash Source API (gratuito, no key richiesta)
    const unsplashUrl = `https://source.unsplash.com/800x600/?${encodeURIComponent(enhancedQuery)}`;

    // Per evitare CORS, restituiamo l'URL invece di fare proxy
    res.status(200).json({
      success: true,
      imageUrl: unsplashUrl,
      searchQuery: enhancedQuery,
      fallbackUrl: `https://source.unsplash.com/800x600/?${encodeURIComponent(category)}`,
      metadata: {
        source: 'unsplash',
        orientation,
        category,
        enhanced: true
      }
    });

  } catch (error) {
    console.error('Errore Unsplash API:', error);

    // Fallback a gradiente cyberpunk generato
    const fallbackGradient = generateCyberpunkGradient();

    res.status(200).json({
      success: false,
      imageUrl: null,
      fallbackGradient,
      error: 'API non disponibile',
      metadata: {
        source: 'gradient',
        fallback: true
      }
    });
  }
}

// Genera gradienti cyberpunk casuali per fallback
function generateCyberpunkGradient() {
  const colors = [
    'from-cyan-500 via-blue-600 to-purple-700',
    'from-pink-500 via-purple-600 to-indigo-700',
    'from-green-400 via-cyan-500 to-blue-600',
    'from-yellow-400 via-orange-500 to-red-600',
    'from-purple-500 via-pink-500 to-red-500',
    'from-indigo-500 via-blue-500 to-cyan-400'
  ];

  return `bg-gradient-to-br ${colors[Math.floor(Math.random() * colors.length)]}`;
}