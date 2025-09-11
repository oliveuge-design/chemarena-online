export const TEACHERS_DATABASE = [
  {
    id: 'teacher_001',
    name: 'Prof. Mario Rossi',
    email: 'mario.rossi@scuola.edu',
    password: 'Matem123!',
    subject: 'Matematica',
    active: true,
    lastLogin: null,
    createdAt: '2024-01-15'
  },
  {
    id: 'teacher_002', 
    name: 'Prof.ssa Laura Bianchi',
    email: 'laura.bianchi@scuola.edu',
    password: 'Storia456!',
    subject: 'Storia',
    active: true,
    lastLogin: null,
    createdAt: '2024-01-15'
  },
  {
    id: 'teacher_003',
    name: 'Prof. Giuseppe Verdi',
    email: 'giuseppe.verdi@scuola.edu', 
    password: 'Scienze789!',
    subject: 'Scienze',
    active: true,
    lastLogin: null,
    createdAt: '2024-01-15'
  },
  {
    id: 'teacher_004',
    name: 'Prof.ssa Anna Neri',
    email: 'anna.neri@scuola.edu',
    password: 'Italiano123!',
    subject: 'Italiano',
    active: true,
    lastLogin: null,
    createdAt: '2024-01-15'
  },
  {
    id: 'teacher_005',
    name: 'Prof. Marco Blu',
    email: 'marco.blu@scuola.edu',
    password: 'Inglese456!', 
    subject: 'Inglese',
    active: true,
    lastLogin: null,
    createdAt: '2024-01-15'
  }
]

export function findTeacherByCredentials(email, password) {
  return TEACHERS_DATABASE.find(teacher => 
    teacher.email === email && 
    teacher.password === password && 
    teacher.active
  )
}

export function findTeacherById(id) {
  return TEACHERS_DATABASE.find(teacher => teacher.id === id && teacher.active)
}

export function updateTeacherLastLogin(teacherId) {
  const teacher = TEACHERS_DATABASE.find(t => t.id === teacherId)
  if (teacher) {
    teacher.lastLogin = new Date().toISOString()
  }
  return teacher
}

export function getAllActiveTeachers() {
  return TEACHERS_DATABASE.filter(teacher => teacher.active)
}