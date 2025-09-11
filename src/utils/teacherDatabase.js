import fs from 'fs'
import path from 'path'

const DB_PATH = path.join(process.cwd(), 'data', 'teachers-database.json')

// Carica database dal file JSON
export function loadTeachersDatabase() {
  try {
    if (fs.existsSync(DB_PATH)) {
      const data = fs.readFileSync(DB_PATH, 'utf8')
      return JSON.parse(data)
    } else {
      // Crea database vuoto se non esiste
      const emptyDb = {
        teachers: [],
        metadata: {
          version: "1.0",
          lastUpdate: new Date().toISOString().split('T')[0],
          totalTeachers: 0,
          activeTeachers: 0
        }
      }
      saveTeachersDatabase(emptyDb)
      return emptyDb
    }
  } catch (error) {
    console.error('❌ Errore caricamento database:', error)
    throw new Error('Impossibile caricare il database degli insegnanti')
  }
}

// Salva database su file JSON
export function saveTeachersDatabase(database) {
  try {
    // Aggiorna metadata
    database.metadata.lastUpdate = new Date().toISOString().split('T')[0]
    database.metadata.totalTeachers = database.teachers.length
    database.metadata.activeTeachers = database.teachers.filter(t => t.active).length

    fs.writeFileSync(DB_PATH, JSON.stringify(database, null, 2))
    return true
  } catch (error) {
    console.error('❌ Errore salvataggio database:', error)
    throw new Error('Impossibile salvare il database degli insegnanti')
  }
}

// Trova insegnante per email/nome e password
export function findTeacherByCredentials(identifier, password) {
  try {
    const database = loadTeachersDatabase()
    return database.teachers.find(teacher => 
      (teacher.email === identifier || teacher.name === identifier) && 
      teacher.password === password && 
      teacher.active
    )
  } catch (error) {
    console.error('❌ Errore ricerca credenziali:', error)
    return null
  }
}

// Trova insegnante per ID
export function findTeacherById(id) {
  try {
    const database = loadTeachersDatabase()
    return database.teachers.find(teacher => teacher.id === id && teacher.active)
  } catch (error) {
    console.error('❌ Errore ricerca ID:', error)
    return null
  }
}

// Aggiorna ultimo accesso
export function updateTeacherLastLogin(teacherId) {
  try {
    const database = loadTeachersDatabase()
    const teacher = database.teachers.find(t => t.id === teacherId)
    
    if (teacher) {
      teacher.lastLogin = new Date().toISOString()
      saveTeachersDatabase(database)
      return teacher
    }
    
    return null
  } catch (error) {
    console.error('❌ Errore aggiornamento login:', error)
    return null
  }
}

// Registra nuovo insegnante
export function registerNewTeacher(teacherData) {
  try {
    const database = loadTeachersDatabase()
    const { name, email, password, subject } = teacherData
    
    // Controlla se email già esiste
    const existingTeacher = database.teachers.find(t => t.email === email)
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
      createdAt: new Date().toISOString().split('T')[0],
      acceptedPrivacy: true,
      privacyDate: new Date().toISOString().split('T')[0]
    }

    database.teachers.push(newTeacher)
    saveTeachersDatabase(database)
    
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
  } catch (error) {
    console.error('❌ Errore registrazione:', error)
    return { success: false, error: 'Errore durante la registrazione' }
  }
}

// Ottieni tutti gli insegnanti attivi
export function getAllActiveTeachers() {
  try {
    const database = loadTeachersDatabase()
    return database.teachers.filter(teacher => teacher.active)
  } catch (error) {
    console.error('❌ Errore caricamento insegnanti:', error)
    return []
  }
}

// Controlla se è admin
export function isAdmin(teacherId) {
  const teacher = findTeacherById(teacherId)
  return teacher && teacher.role === 'admin'
}

// Controlla se è insegnante
export function isTeacher(teacherId) {
  const teacher = findTeacherById(teacherId)
  return teacher && teacher.role === 'teacher'
}

// Validazione formato email
export function validateEmailFormat(email) {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return emailRegex.test(email)
}

// Validazione forza password
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

// Elimina insegnante (disattiva)
export function deactivateTeacher(teacherId) {
  try {
    const database = loadTeachersDatabase()
    const teacher = database.teachers.find(t => t.id === teacherId)
    
    if (teacher) {
      teacher.active = false
      teacher.deactivatedAt = new Date().toISOString().split('T')[0]
      saveTeachersDatabase(database)
      return { success: true }
    }
    
    return { success: false, error: 'Insegnante non trovato' }
  } catch (error) {
    console.error('❌ Errore disattivazione:', error)
    return { success: false, error: 'Errore durante la disattivazione' }
  }
}

// Statistiche database
export function getDatabaseStats() {
  try {
    const database = loadTeachersDatabase()
    const now = new Date()
    const oneMonthAgo = new Date(now.getFullYear(), now.getMonth() - 1, now.getDate())
    
    const recentLogins = database.teachers.filter(teacher => 
      teacher.lastLogin && new Date(teacher.lastLogin) > oneMonthAgo
    ).length

    return {
      totalTeachers: database.teachers.length,
      activeTeachers: database.teachers.filter(t => t.active).length,
      admins: database.teachers.filter(t => t.role === 'admin').length,
      teachers: database.teachers.filter(t => t.role === 'teacher').length,
      recentLogins: recentLogins,
      lastUpdate: database.metadata.lastUpdate
    }
  } catch (error) {
    console.error('❌ Errore statistiche:', error)
    return null
  }
}