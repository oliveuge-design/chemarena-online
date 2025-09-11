import { findTeacherByCredentials, updateTeacherLastLogin } from '@/data/teachers'

export default function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Metodo non consentito' })
  }

  try {
    const { email, password } = req.body

    if (!email || !password) {
      return res.status(400).json({ 
        error: 'Email e password sono obbligatori',
        success: false 
      })
    }

    const teacher = findTeacherByCredentials(email, password)
    
    if (!teacher) {
      return res.status(401).json({ 
        error: 'Credenziali non valide',
        success: false 
      })
    }

    updateTeacherLastLogin(teacher.id)

    const teacherData = {
      id: teacher.id,
      name: teacher.name,
      email: teacher.email,
      subject: teacher.subject,
      lastLogin: teacher.lastLogin
    }

    res.status(200).json({
      success: true,
      teacher: teacherData,
      message: `Benvenuto/a ${teacher.name}!`
    })

  } catch (error) {
    console.error('Errore nell\'autenticazione insegnante:', error)
    res.status(500).json({ 
      error: 'Errore interno del server',
      success: false 
    })
  }
}