import { findTeacherByCredentials, updateTeacherLastLogin } from '@/utils/teacherDatabase'

export default function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Metodo non consentito' })
  }

  try {
    const { email, name, password } = req.body

    // Supporta sia email (per retrocompatibilità admin) che nome
    const identifier = email || name
    
    if (!identifier || !password) {
      return res.status(400).json({ 
        error: 'Nome/Email e password sono obbligatori',
        success: false 
      })
    }

    const teacher = findTeacherByCredentials(identifier, password)
    
    if (!teacher) {
      return res.status(401).json({ 
        error: 'Credenziali non valide',
        success: false 
      })
    }

    const updatedTeacher = updateTeacherLastLogin(teacher.id)

    const teacherData = {
      id: updatedTeacher.id,
      name: updatedTeacher.name,
      email: updatedTeacher.email,
      subject: updatedTeacher.subject,
      role: updatedTeacher.role,
      lastLogin: updatedTeacher.lastLogin
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