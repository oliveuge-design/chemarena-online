import { useState } from 'react'
import Image from 'next/image'
import Form from '@/components/Form'
import Input from '@/components/Input'
import Button from '@/components/Button'
import toast from 'react-hot-toast'
import logo from '@/assets/logo.svg'

export default function TeacherAuth({ onAuthSuccess }) {
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  })
  const [loading, setLoading] = useState(false)

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
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(formData)
      })

      const data = await response.json()

      if (data.success) {
        toast.success(data.message)
        
        localStorage.setItem('teacher-auth', JSON.stringify(data.teacher))
        
        if (onAuthSuccess) {
          onAuthSuccess(data.teacher)
        }
      } else {
        toast.error(data.error)
      }
    } catch (error) {
      console.error('Errore di autenticazione:', error)
      toast.error('Errore di connessione')
    } finally {
      setLoading(false)
    }
  }

  const handleKeyDown = (event) => {
    if (event.key === 'Enter') {
      handleSubmit(event)
    }
  }

  return (
    <section className="relative flex min-h-screen flex-col items-center justify-center">
      <div className="absolute h-full w-full overflow-hidden">
        <div className="absolute -left-[15vmin] -top-[15vmin] min-h-[75vmin] min-w-[75vmin] rounded-full bg-primary/15"></div>
        <div className="absolute -bottom-[15vmin] -right-[15vmin] min-h-[75vmin] min-w-[75vmin] rotate-45 bg-primary/15"></div>
      </div>

      <Image src={logo} className="mb-6 h-32" alt="logo" />
      
      <div className="mb-6 text-center">
        <h1 className="text-2xl font-bold text-gray-800 mb-2">🎓 Accesso Insegnanti</h1>
        <p className="text-gray-600">Inserisci le tue credenziali per accedere</p>
      </div>

      <Form onSubmit={handleSubmit}>
        <div className="space-y-4 mb-6">
          <Input
            type="email"
            placeholder="📧 Email insegnante"
            value={formData.email}
            onChange={(value) => handleInputChange('email', value)}
            onKeyDown={handleKeyDown}
            required
            autoComplete="email"
          />
          
          <Input
            type="password"
            placeholder="🔐 Password"
            value={formData.password}
            onChange={(value) => handleInputChange('password', value)}
            onKeyDown={handleKeyDown}
            required
            autoComplete="current-password"
          />
        </div>

        <Button
          type="submit"
          disabled={loading || !formData.email || !formData.password}
          className="w-full py-4 text-lg"
        >
          {loading ? '🔄 Verifica in corso...' : '🚀 Accedi come Insegnante'}
        </Button>

        <div className="mt-6 text-center">
          <div className="bg-gray-50 p-4 rounded-lg">
            <p className="text-sm text-gray-600 mb-2">📋 <strong>Credenziali di esempio:</strong></p>
            <div className="text-xs text-gray-500 space-y-1">
              <div>📧 mario.rossi@scuola.edu - 🔐 Matem123!</div>
              <div>📧 laura.bianchi@scuola.edu - 🔐 Storia456!</div>
              <div>📧 giuseppe.verdi@scuola.edu - 🔐 Scienze789!</div>
              <div>📧 anna.neri@scuola.edu - 🔐 Italiano123!</div>
              <div>📧 marco.blu@scuola.edu - 🔐 Inglese456!</div>
            </div>
          </div>
        </div>
      </Form>
    </section>
  )
}