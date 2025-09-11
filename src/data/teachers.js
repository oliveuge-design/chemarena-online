export const TEACHERS_DATABASE = [
  {
    id: 'admin_001',
    name: 'Admin Rahoot',
    email: 'admin@rahoot.edu',
    password: 'admin123',
    subject: 'Amministrazione',
    role: 'admin',
    active: true,
    lastLogin: null,
    createdAt: '2024-01-15'
  },
  {
    id: 'teacher_001',
    name: 'Prof. Mario Rossi',
    email: 'mario.rossi@scuola.edu',
    password: 'Matem123!',
    subject: 'Matematica',
    role: 'teacher',
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
    role: 'teacher',
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
    role: 'teacher',
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
    role: 'teacher',
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
    role: 'teacher',
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

export function registerNewTeacher(teacherData) {
  const { name, email, password, subject } = teacherData
  
  // Controlla se email già esiste
  const existingTeacher = TEACHERS_DATABASE.find(t => t.email === email)
  if (existingTeacher) {
    return { success: false, error: 'Email già registrata' }
  }

  // Genera nuovo ID
  const newId = 'teacher_' + String(Date.now()).slice(-6)
  
  const newTeacher = {
    id: newId,
    name: name.trim(),
    email: email.toLowerCase().trim(),
    password: password,
    subject: subject.trim(),
    role: 'teacher',
    active: true,
    lastLogin: null,
    createdAt: new Date().toISOString().split('T')[0]
  }

  TEACHERS_DATABASE.push(newTeacher)
  
  return { 
    success: true, 
    teacher: {
      id: newTeacher.id,
      name: newTeacher.name,
      email: newTeacher.email,
      subject: newTeacher.subject,
      role: newTeacher.role
    }
  }
}

export function isAdmin(teacherId) {
  const teacher = findTeacherById(teacherId)
  return teacher && teacher.role === 'admin'
}

export function isTeacher(teacherId) {
  const teacher = findTeacherById(teacherId)
  return teacher && teacher.role === 'teacher'
}

export function validateEmailFormat(email) {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return emailRegex.test(email)
}

export function validatePasswordStrength(password) {
  if (password.length < 6) {
    return { valid: false, error: 'Password deve avere almeno 6 caratteri' }
  }
  if (!/[A-Z]/.test(password)) {
    return { valid: false, error: 'Password deve contenere almeno una maiuscola' }
  }
  if (!/[0-9]/.test(password)) {
    return { valid: false, error: 'Password deve contenere almeno un numero' }
  }
  return { valid: true }
}