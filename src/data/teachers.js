// DEPRECATO: Questo file è mantenuto per retrocompatibilità
// Il nuovo sistema utilizza database persistente JSON in /utils/teacherDatabase.js

import { 
  findTeacherByCredentials as dbFindByCredentials,
  findTeacherById as dbFindById,
  updateTeacherLastLogin as dbUpdateLogin,
  getAllActiveTeachers as dbGetAllActive,
  registerNewTeacher as dbRegisterNew,
  isAdmin as dbIsAdmin,
  isTeacher as dbIsTeacher,
  validateEmailFormat as dbValidateEmail,
  validatePasswordStrength as dbValidatePassword
} from '@/utils/teacherDatabase'

// Wrapper functions per retrocompatibilità
export function findTeacherByCredentials(email, password) {
  return dbFindByCredentials(email, password)
}

export function findTeacherById(id) {
  return dbFindById(id)
}

export function updateTeacherLastLogin(teacherId) {
  return dbUpdateLogin(teacherId)
}

export function getAllActiveTeachers() {
  return dbGetAllActive()
}

export function registerNewTeacher(teacherData) {
  return dbRegisterNew(teacherData)
}

export function isAdmin(teacherId) {
  return dbIsAdmin(teacherId)
}

export function isTeacher(teacherId) {
  return dbIsTeacher(teacherId)
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