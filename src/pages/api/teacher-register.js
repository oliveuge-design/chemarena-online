import { registerNewTeacher, validateEmailFormat, validatePasswordStrength } from '@/data/teachers'

export default function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ 
      success: false, 
      error: 'Metodo non consentito' 
    })
  }

  try {
    const { name, email, password, subject } = req.body

    // Validazione campi obbligatori
    if (!name || !email || !password || !subject) {
      return res.status(400).json({
        success: false,
        error: 'Tutti i campi sono obbligatori'
      })
    }

    // Validazione formato email
    if (!validateEmailFormat(email)) {
      return res.status(400).json({
        success: false,
        error: 'Formato email non valido'
      })
    }

    // Validazione forza password
    const passwordCheck = validatePasswordStrength(password)
    if (!passwordCheck.valid) {
      return res.status(400).json({
        success: false,
        error: passwordCheck.error
      })
    }

    // Validazione lunghezza nome
    if (name.trim().length < 2) {
      return res.status(400).json({
        success: false,
        error: 'Il nome deve avere almeno 2 caratteri'
      })
    }

    // Registrazione insegnante
    const result = registerNewTeacher({ name, email, password, subject })
    
    if (!result.success) {
      return res.status(400).json(result)
    }

    return res.status(200).json({
      success: true,
      message: 'Registrazione completata con successo',
      teacher: result.teacher
    })

  } catch (error) {
    console.error('❌ Errore durante la registrazione:', error)
    return res.status(500).json({
      success: false,
      error: 'Errore interno del server',
      details: error.message
    })
  }
}