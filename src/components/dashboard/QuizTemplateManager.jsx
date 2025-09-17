import { useState, useEffect } from 'react';
import clsx from 'clsx';

export default function QuizTemplateManager({ onSelectTemplate }) {
  const [templates, setTemplates] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadTemplates();
  }, []);

  const loadTemplates = () => {
    setIsLoading(true);
    // Carica template predefiniti sci-fi
    const sciFilTemplates = getSciFilTemplates();
    setTemplates(sciFilTemplates);
    setIsLoading(false);
  };

  const categories = [
    { id: 'all', name: 'Tutti i Template', icon: '🌟', color: 'cyan' },
    { id: 'chemistry', name: 'Chimica', icon: '🧪', color: 'green' },
    { id: 'medicine', name: 'Medicina', icon: '⚕️', color: 'red' },
    { id: 'physics', name: 'Fisica', icon: '⚛️', color: 'blue' },
    { id: 'biology', name: 'Biologia', icon: '🧬', color: 'purple' },
    { id: 'science', name: 'Scienze Generali', icon: '🔬', color: 'yellow' },
    { id: 'custom', name: 'Personalizzato', icon: '⚙️', color: 'gray' }
  ];

  const filteredTemplates = selectedCategory === 'all'
    ? templates
    : templates.filter(t => t.category === selectedCategory);

  if (isLoading) {
    return <LoadingTemplates />;
  }

  return (
    <div className="space-y-6">
      {/* Header cyberpunk */}
      <div className="relative bg-gradient-to-r from-cyan-900/40 via-purple-900/40 to-pink-900/40 rounded-2xl p-6 border border-cyan-500/30 backdrop-blur-sm">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-purple-400">
              🧬 QUIZ TEMPLATES MATRIX
            </h2>
            <p className="text-cyan-300/80 mt-2 font-mono">
              Template avanzati per creazione rapida quiz scientifici
            </p>
          </div>

          {/* Stats generazione */}
          <div className="text-right">
            <div className="text-2xl font-bold text-cyan-400">{templates.length}</div>
            <div className="text-sm text-cyan-300/60 font-mono">TEMPLATE DISPONIBILI</div>
          </div>
        </div>

        {/* Linee luminose */}
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-cyan-400/60 to-transparent"></div>
        <div className="absolute bottom-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-purple-400/60 to-transparent"></div>
      </div>

      {/* Filtri categoria */}
      <div className="flex gap-2 overflow-x-auto pb-2">
        {categories.map((category) => (
          <button
            key={category.id}
            onClick={() => setSelectedCategory(category.id)}
            className={clsx(
              'px-4 py-3 rounded-xl font-bold transition-all duration-300 whitespace-nowrap',
              'border-2 backdrop-blur-sm',
              selectedCategory === category.id
                ? `border-${category.color}-400 bg-${category.color}-500/20 text-${category.color}-300 shadow-[0_0_20px_rgba(34,211,238,0.5)]`
                : 'border-gray-500/30 bg-gray-900/20 text-gray-300 hover:border-gray-400 hover:bg-gray-500/20'
            )}
          >
            <span className="mr-2">{category.icon}</span>
            {category.name}
          </button>
        ))}
      </div>

      {/* Griglia template */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredTemplates.map((template) => (
          <TemplateCard
            key={template.id}
            template={template}
            onSelect={onSelectTemplate}
          />
        ))}
      </div>

      {filteredTemplates.length === 0 && (
        <div className="text-center py-12">
          <div className="text-6xl mb-4">🔍</div>
          <p className="text-xl text-gray-400">Nessun template trovato per questa categoria</p>
        </div>
      )}
    </div>
  );
}

// Componente Template Card
function TemplateCard({ template, onSelect }) {
  const colorMap = {
    chemistry: 'from-green-500 to-emerald-600',
    medicine: 'from-red-500 to-pink-600',
    physics: 'from-blue-500 to-cyan-600',
    biology: 'from-purple-500 to-violet-600',
    science: 'from-yellow-500 to-orange-600',
    custom: 'from-gray-500 to-slate-600'
  };

  return (
    <div className="group relative">
      <div className="bg-gradient-to-br from-black/60 to-gray-900/60 rounded-2xl border-2 border-gray-700/50 p-6 transition-all duration-300 hover:border-cyan-400/50 hover:shadow-[0_0_30px_rgba(34,211,238,0.3)] backdrop-blur-sm">

        {/* Header template */}
        <div className="flex items-start justify-between mb-4">
          <div className="flex-1">
            <h3 className="text-xl font-bold text-white mb-2">{template.title}</h3>
            <p className="text-gray-400 text-sm line-clamp-2">{template.description}</p>
          </div>

          {/* Badge categoria */}
          <div className={clsx(
            'px-3 py-1 rounded-full text-xs font-bold ml-3',
            `bg-gradient-to-r ${colorMap[template.category]} text-white`
          )}>
            {template.icon} {template.categoryName}
          </div>
        </div>

        {/* Statistiche template */}
        <div className="grid grid-cols-3 gap-4 mb-6">
          <div className="text-center">
            <div className="text-lg font-bold text-cyan-400">{template.questionCount}</div>
            <div className="text-xs text-gray-500">Domande</div>
          </div>
          <div className="text-center">
            <div className="text-lg font-bold text-purple-400">{template.estimatedTime}</div>
            <div className="text-xs text-gray-500">Minuti</div>
          </div>
          <div className="text-center">
            <div className={clsx(
              'text-lg font-bold',
              template.difficulty === 'facile' ? 'text-green-400' :
              template.difficulty === 'medio' ? 'text-yellow-400' : 'text-red-400'
            )}>
              {template.difficulty === 'facile' ? '●' : template.difficulty === 'medio' ? '●●' : '●●●'}
            </div>
            <div className="text-xs text-gray-500">Difficoltà</div>
          </div>
        </div>

        {/* Features template */}
        <div className="space-y-2 mb-6">
          {template.features.slice(0, 3).map((feature, index) => (
            <div key={index} className="flex items-center gap-2 text-sm text-cyan-300">
              <span className="text-cyan-400">▸</span>
              {feature}
            </div>
          ))}
        </div>

        {/* Pulsante selezione */}
        <button
          onClick={() => onSelect(template)}
          className="w-full bg-gradient-to-r from-cyan-500 to-purple-600 hover:from-cyan-400 hover:to-purple-500 text-white font-bold py-3 px-4 rounded-xl transition-all duration-300 transform hover:scale-105"
        >
          <span className="mr-2">🚀</span>
          USA QUESTO TEMPLATE
        </button>

        {/* Particelle decorative */}
        <div className="absolute top-2 right-2 w-2 h-2 bg-cyan-400 rounded-full animate-ping opacity-60"></div>
        <div className="absolute bottom-2 left-2 w-1.5 h-1.5 bg-purple-400 rounded-full animate-ping opacity-40"
             style={{animationDelay: '0.5s'}}></div>

        {/* Glow al hover */}
        <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-cyan-400/10 to-purple-400/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"></div>
      </div>
    </div>
  );
}

// Loading cyberpunk
function LoadingTemplates() {
  return (
    <div className="min-h-[400px] flex items-center justify-center">
      <div className="text-center">
        <div className="relative w-32 h-32 mx-auto mb-6">
          {/* Scanner rotante */}
          <div className="absolute inset-0 border-4 border-cyan-400/30 rounded-full animate-spin">
            <div className="absolute top-0 left-1/2 w-1 h-8 bg-cyan-400 -translate-x-1/2 -translate-y-1"></div>
          </div>

          {/* Pulsazioni interne */}
          <div className="absolute inset-4 border-2 border-purple-400/20 rounded-full animate-ping"></div>
          <div className="absolute inset-8 bg-gradient-to-br from-cyan-400 to-purple-500 rounded-full animate-pulse"></div>
        </div>

        <p className="text-cyan-400 font-mono text-lg animate-pulse">
          CARICAMENTO MATRIX TEMPLATE...
        </p>
      </div>
    </div>
  );
}

// Template predefiniti sci-fi
function getSciFilTemplates() {
  return [
    {
      id: 'chemistry-basic',
      title: 'Chimica di Base',
      description: 'Template per quiz di chimica generale con elementi fondamentali',
      category: 'chemistry',
      categoryName: 'Chimica',
      icon: '🧪',
      questionCount: 10,
      estimatedTime: 8,
      difficulty: 'facile',
      features: [
        'Tavola periodica interattiva',
        'Formule chimiche con rendering LaTeX',
        'Reazioni bilanciate automatiche',
        'Immagini molecole 3D'
      ],
      questions: [
        {
          question: "Qual è il simbolo chimico dell'oro?",
          answers: ["Au", "Ag", "Al", "Ar"],
          correct: 0,
          explanation: "Il simbolo Au deriva dal latino 'aurum'",
          autoImage: true,
          imageQuery: "gold chemistry element"
        },
        {
          question: "Quanti protoni ha l'atomo di carbonio?",
          answers: ["6", "12", "14", "8"],
          correct: 0,
          explanation: "Il carbonio ha numero atomico 6, quindi 6 protoni",
          autoImage: true,
          imageQuery: "carbon atom structure"
        }
        // Altri template di domande...
      ]
    },
    {
      id: 'medicine-anatomy',
      title: 'Anatomia Umana',
      description: 'Quiz completo sui sistemi anatomici del corpo umano',
      category: 'medicine',
      categoryName: 'Medicina',
      icon: '⚕️',
      questionCount: 15,
      estimatedTime: 12,
      difficulty: 'medio',
      features: [
        'Mappe anatomiche interattive',
        'Immagini radiologiche reali',
        'Sezioni istologiche',
        'Correlazioni funzionali'
      ],
      questions: [
        {
          question: "Qual è l'osso più lungo del corpo umano?",
          answers: ["Femore", "Tibia", "Omero", "Radio"],
          correct: 0,
          explanation: "Il femore è l'osso della coscia e il più lungo",
          autoImage: true,
          imageQuery: "femur bone anatomy"
        }
      ]
    },
    {
      id: 'physics-quantum',
      title: 'Fisica Quantistica',
      description: 'Esplora i misteri della meccanica quantistica',
      category: 'physics',
      categoryName: 'Fisica',
      icon: '⚛️',
      questionCount: 12,
      estimatedTime: 15,
      difficulty: 'difficile',
      features: [
        'Esperimenti quantistici virtuali',
        'Visualizzazioni onde-particella',
        'Calcoli probabilistici',
        'Paradossi quantistici'
      ],
      questions: [
        {
          question: "Cosa afferma il principio di indeterminazione di Heisenberg?",
          answers: [
            "Non si possono determinare simultaneamente posizione e velocità",
            "La luce è sempre un'onda",
            "Gli elettroni sono sempre particelle",
            "Il tempo è relativo"
          ],
          correct: 0,
          explanation: "Principio fondamentale della meccanica quantistica",
          autoImage: true,
          imageQuery: "heisenberg uncertainty principle quantum"
        }
      ]
    },
    {
      id: 'biology-genetics',
      title: 'Genetica Molecolare',
      description: 'DNA, RNA e i meccanismi dell\'ereditarietà',
      category: 'biology',
      categoryName: 'Biologia',
      icon: '🧬',
      questionCount: 14,
      estimatedTime: 11,
      difficulty: 'medio',
      features: [
        'Sequenze DNA interattive',
        'Alberi genealogici dinamici',
        'Mutazioni visualizzate',
        'Tecniche biotecnologiche'
      ],
      questions: [
        {
          question: "Quale base azotata si appaia con l'adenina nel DNA?",
          answers: ["Timina", "Citosina", "Guanina", "Uracile"],
          correct: 0,
          explanation: "Nel DNA: A-T e G-C sono le coppie complementari",
          autoImage: true,
          imageQuery: "DNA base pairing adenine thymine"
        }
      ]
    },
    {
      id: 'science-lab',
      title: 'Tecniche di Laboratorio',
      description: 'Strumentazione e metodologie scientifiche',
      category: 'science',
      categoryName: 'Scienze',
      icon: '🔬',
      questionCount: 8,
      estimatedTime: 6,
      difficulty: 'facile',
      features: [
        'Strumenti di laboratorio 3D',
        'Procedure passo-passo',
        'Misure e precisione',
        'Sicurezza in laboratorio'
      ],
      questions: [
        {
          question: "Quale strumento si usa per misurare volumi precisi di liquidi?",
          answers: ["Pipetta", "Beuta", "Provetta", "Imbuto"],
          correct: 0,
          explanation: "La pipetta permette misure volumetriche precise",
          autoImage: true,
          imageQuery: "laboratory pipette volumetric measurement"
        }
      ]
    },
    {
      id: 'custom-blank',
      title: 'Template Personalizzato',
      description: 'Inizia da zero con struttura base personalizzabile',
      category: 'custom',
      categoryName: 'Custom',
      icon: '⚙️',
      questionCount: 5,
      estimatedTime: 5,
      difficulty: 'facile',
      features: [
        'Struttura base vuota',
        'Tutti i tipi di domanda',
        'Completamente personalizzabile',
        'Export/Import facile'
      ],
      questions: [
        {
          question: "",
          answers: ["", "", "", ""],
          correct: 0,
          explanation: "",
          autoImage: false
        }
      ]
    }
  ];
}