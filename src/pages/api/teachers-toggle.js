import { toggleTeacherStatus } from '@/utils/teacherDatabase'

export default function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Metodo non consentito' })
  }

  const { teacherId } = req.body

  if (!teacherId) {
    return res.status(400).json({ 
      error: 'ID insegnante richiesto',
      success: false 
    })
  }

  try {
    const updatedTeacher = toggleTeacherStatus(teacherId)
    
    if (!updatedTeacher) {
      return res.status(404).json({ 
        error: 'Insegnante non trovato o non modificabile',
        success: false 
      })
    }

    res.status(200).json({
      success: true,
      teacher: {
        id: updatedTeacher.id,
        name: updatedTeacher.name,
        active: updatedTeacher.active
      }
    })

  } catch (error) {
    console.error('Errore nel toggle stato insegnante:', error)
    res.status(500).json({ 
      error: 'Errore interno del server',
      success: false 
    })
  }
}