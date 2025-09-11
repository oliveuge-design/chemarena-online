import { getAllActiveTeachers } from '@/data/teachers'

export default function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Metodo non consentito' })
  }

  try {
    const teachers = getAllActiveTeachers()
    
    const teachersPublic = teachers.map(teacher => ({
      id: teacher.id,
      name: teacher.name,
      email: teacher.email,
      subject: teacher.subject,
      lastLogin: teacher.lastLogin,
      createdAt: teacher.createdAt
    }))

    res.status(200).json({
      success: true,
      teachers: teachersPublic,
      count: teachersPublic.length
    })

  } catch (error) {
    console.error('Errore nel recuperare gli insegnanti:', error)
    res.status(500).json({ 
      error: 'Errore interno del server',
      success: false 
    })
  }
}