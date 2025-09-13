# 🚀 DEPLOYMENT GUIDE - CHEMARENA SU RAILWAY

## 📋 PREREQUISITI

1. **Account GitHub** con il progetto pushato
2. **Account Railway** gratuito → [railway.app](https://railway.app)
3. **Git configurato** localmente

## 🛠️ SETUP DEPLOYMENT

### 1. **Push del Progetto su GitHub**

```bash
# Se non hai ancora un repo GitHub, crealo prima
cd "C:\Users\linea\Downloads\ChemArena-main\ChemArena"

# Inizializza git (se non già fatto)
git init
git add .
git commit -m "🚀 Prepare project for Railway deployment

✅ Added Railway configuration files
✅ Environment variables setup  
✅ Production-ready CORS settings
✅ Standalone Next.js build
✅ WebSocket production config

🎯 Ready for online deployment!"

# Collega al tuo repository GitHub
git remote add origin https://github.com/TUO_USERNAME/rahoot-deploy.git
git push -u origin main
```

### 2. **Setup Railway Dashboard**

1. **Vai su** → [railway.app](https://railway.app)
2. **Login** con GitHub
3. **"New Project"** → **"Deploy from GitHub repo"**
4. **Seleziona** il repository `rahoot-deploy`
5. **Deploy automatico** inizierà!

### 3. **Configurazione Variabili d'Ambiente**

Nel **Railway Dashboard** → **Variables**:

```env
NODE_ENV=production
WEBSOCKET_PUBLIC_URL=https://YOUR-PROJECT-NAME.up.railway.app/
PORT=5505
NEXT_PUBLIC_WEBSOCKET_URL=https://YOUR-PROJECT-NAME.up.railway.app/
```

⚠️ **IMPORTANTE**: Sostituisci `YOUR-PROJECT-NAME` con il nome effettivo del tuo progetto Railway!

### 4. **Verifica Deployment**

✅ **Build Success**: Railway mostrerà "Deployed"
✅ **URL Generato**: `https://your-project-name.up.railway.app`
✅ **Logs Check**: Verifica nei logs che socket server si avvii correttamente

## 🎯 TEST FUNZIONALITÀ ONLINE

### **URL di Accesso:**
- 🎮 **Studenti**: `https://your-project-name.up.railway.app`
- 👨‍🏫 **Login Insegnanti**: `https://your-project-name.up.railway.app/login`
- 📝 **Registrazione**: `https://your-project-name.up.railway.app/register`
- 📊 **Dashboard Insegnanti**: `https://your-project-name.up.railway.app/teacher-dashboard`
- ⚙️ **Dashboard Admin**: `https://your-project-name.up.railway.app/dashboard`
- 🎯 **Manager**: `https://your-project-name.up.railway.app/manager`

### **Test Sistema Autenticazione:**
1. **Registrazione Insegnante**: `/register` → Crea nuovo account
2. **Login Insegnante**: `/login` → Accesso con credenziali
3. **Dashboard Limitata**: Auto-redirect a `/teacher-dashboard` per insegnanti
4. **Admin Access**: `/dashboard` → Solo per admin (`admin@rahoot.edu` / `admin123`)

### **Test QR Code Mobile:**
1. **Login Insegnante** → Dashboard limitata
2. **Lancia Gioco** → Seleziona quiz esistente  
3. **Manager** → Genera PIN e QR Code
4. **Smartphone** → Scansiona QR → Auto-join!
5. **Statistiche** → Visualizza risultati dopo il gioco

## 🚨 TROUBLESHOOTING

### **Problemi Comuni:**

**❌ Build Failed:**
```bash
# Testa localmente prima
npm run build
npm run all
```

**❌ WebSocket Connection Failed:**
- Verifica che `WEBSOCKET_PUBLIC_URL` sia corretto
- Controlla CORS settings in `socket/index.js`

**❌ Images Not Loading:**
- Railway include storage persistente
- Verifica che `data/images/` sia nel repository

**❌ Database Non Carica:**
- Controlla che `data/quiz-archive.json` sia presente
- Verifica permessi di scrittura

### **Logs Debugging:**
```bash
# Nel Railway Dashboard
Deployments → View Logs → Controlla errori
```

## 📊 MONITORAGGIO

**Railway Free Plan:**
- ✅ **$5 crediti/mese** (sufficiente per test)
- ✅ **Uptime monitoring** automatico
- ✅ **SSL certificati** inclusi
- ✅ **Custom domains** disponibili

## 🎉 RISULTATO FINALE

**URL PUBBLICO**: `https://your-project-name.up.railway.app`

**Funzionalità Online:**
- 🔐 **Sistema Autenticazione Insegnanti**
- 👥 **Ruoli Admin e Teacher distinti**
- 📝 **Registrazione automatica insegnanti**
- 📊 **Dashboard personalizzate per ruolo**
- 📱 **QR Code** per smartphone
- 🎮 **Real-time gaming** con WebSocket
- 🖼️ **Immagini nelle risposte**
- 📈 **Statistiche automatiche**

**🚀 PRONTO PER USO IN CLASSE!**