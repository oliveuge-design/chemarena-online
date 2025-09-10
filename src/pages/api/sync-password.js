import fs from 'fs'
import path from 'path'

export default function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' })
  }

  try {
    const { password } = req.body

    if (!password) {
      return res.status(400).json({ 
        success: false, 
        message: 'Password is required' 
      })
    }

    // Leggi il file config.mjs corrente
    const configPath = path.join(process.cwd(), 'config.mjs')
    
    if (!fs.existsSync(configPath)) {
      return res.status(404).json({ 
        success: false, 
        message: 'File config.mjs not found' 
      })
    }

    let configContent = fs.readFileSync(configPath, 'utf8')
    
    // Sostituisci solo la password mantenendo tutto il resto
    const passwordRegex = /password:\s*"[^"]*"/
    configContent = configContent.replace(passwordRegex, `password: "${password}"`)

    // Backup del file esistente
    const backupPath = path.join(process.cwd(), 'config.mjs.backup')
    fs.copyFileSync(configPath, backupPath)

    // Scrive il file aggiornato
    fs.writeFileSync(configPath, configContent, 'utf8')

    console.log(`✅ Password sincronizzata: ${password}`)

    res.status(200).json({ 
      success: true, 
      message: 'Password sincronizzata con successo',
      password: password
    })

  } catch (error) {
    console.error('❌ Errore durante la sincronizzazione password:', error)
    
    res.status(500).json({ 
      success: false, 
      message: 'Errore durante la sincronizzazione della password',
      error: error.message 
    })
  }
}