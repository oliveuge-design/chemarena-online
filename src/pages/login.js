import { useState, useEffect } from "react"
import { useRouter } from "next/router"
import Image from "next/image"
import logo from "@/assets/logo.svg"
import Button from "@/components/Button"
import toast from 'react-hot-toast'

export default function LoginPage() {
  const router = useRouter()
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  })
  const [loading, setLoading] = useState(false)

  // Controlla se l'utente è già autenticato
  useEffect(() => {
    const savedAuth = localStorage.getItem('teacher-auth')
    if (savedAuth) {
      const teacher = JSON.parse(savedAuth)
      if (teacher.role === 'admin') {
        router.push('/dashboard')
      } else {
        router.push('/teacher-dashboard')
      }
    }
  }, [router])

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)

    try {
      const response = await fetch('/api/teacher-auth', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData)
      })

      const data = await response.json()

      if (data.success) {
        // Salva i dati dell'insegnante
        localStorage.setItem('teacher-auth', JSON.stringify(data.teacher))
        
        toast.success(`Benvenuto/a ${data.teacher.name}! 🎉`)
        
        // Reindirizza in base al ruolo
        setTimeout(() => {
          if (data.teacher.role === 'admin') {
            router.push('/dashboard')
          } else {
            router.push('/teacher-dashboard')
          }
        }, 1000)
        
      } else {
        toast.error(data.error || 'Credenziali non valide')
      }
    } catch (error) {
      console.error('Errore login:', error)
      toast.error('Errore di connessione')
    }

    setLoading(false)
  }

  const isFormValid = formData.email && formData.password

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-400 via-purple-500 to-pink-500 flex items-center justify-center px-4">
      <div className="bg-white rounded-2xl shadow-2xl p-8 w-full max-w-md">
        <div className="text-center mb-8">
          <Image
            src={logo}
            alt="Rahoot Logo"
            width={120}
            height={40}
            className="mx-auto mb-4"
          />
          <h1 className="text-2xl font-bold text-gray-800">
            Accesso Insegnanti
          </h1>
          <p className="text-gray-600 text-sm mt-2">
            Entra con le tue credenziali
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Email
            </label>
            <input
              type="email"
              value={formData.email}
              onChange={(e) => handleInputChange('email', e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="mario.rossi@scuola.edu"
              autoComplete="email"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Password
            </label>
            <input
              type="password"
              value={formData.password}
              onChange={(e) => handleInputChange('password', e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="La tua password"
              autoComplete="current-password"
              required
            />
          </div>

          <Button
            type="submit"
            disabled={loading || !isFormValid}
            className="w-full bg-gradient-to-r from-green-400 to-blue-500 text-white font-semibold py-2 px-4 rounded-lg hover:from-green-500 hover:to-blue-600 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
          >
            {loading ? "Accesso..." : "🚀 Accedi"}
          </Button>
        </form>

        <div className="mt-6 text-center">
          <p className="text-sm text-gray-600">
            Non hai un account?{" "}
            <button
              onClick={() => router.push('/register')}
              className="text-blue-600 hover:text-blue-700 font-medium"
            >
              Registrati qui
            </button>
          </p>
        </div>

        <div className="mt-6 p-4 bg-gray-50 rounded-lg">
          <h3 className="font-medium text-gray-800 mb-2">🔐 Accesso Demo:</h3>
          <div className="text-sm text-gray-600 space-y-1">
            <p><strong>Admin:</strong> admin@rahoot.edu / admin123</p>
            <p><strong>Insegnante:</strong> mario.rossi@scuola.edu / Matem123!</p>
          </div>
        </div>
      </div>
    </div>
  )
}