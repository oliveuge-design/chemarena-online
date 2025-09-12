import { deleteTeacher } from '@/utils/teacherDatabase'

export default function handler(req, res) {
  if (req.method !== 'DELETE') {
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
    const deleted = deleteTeacher(teacherId)
    
    if (!deleted) {
      return res.status(404).json({ 
        error: 'Insegnante non trovato o non eliminabile',
        success: false 
      })
    }

    res.status(200).json({
      success: true,
      message: 'Insegnante eliminato con successo'
    })

  } catch (error) {
    console.error('Errore nell\'eliminazione insegnante:', error)
    res.status(500).json({ 
      error: 'Errore interno del server',
      success: false 
    })
  }
}