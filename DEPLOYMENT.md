# 🚀 DEPLOYMENT GUIDE - RAHOOT SU RAILWAY

## 📋 PREREQUISITI

1. **Account GitHub** con il progetto pushato
2. **Account Railway** gratuito → [railway.app](https://railway.app)
3. **Git configurato** localmente

## 🛠️ SETUP DEPLOYMENT

### 1. **Push del Progetto su GitHub**

```bash
# Se non hai ancora un repo GitHub, crealo prima
cd "C:\Users\linea\Downloads\Rahoot-main (1)\Rahoot-main\Rahoot"

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
- 👨‍🏫 **Dashboard**: `https://your-project-name.up.railway.app/dashboard`
- 📝 **Manager**: `https://your-project-name.up.railway.app/manager`

### **Test QR Code Mobile:**
1. **Dashboard** → Login (`admin123`)
2. **Carica quiz** dall'archivio
3. **Manager** → Avvia stanza
4. **QR Code** apparirà automaticamente
5. **Smartphone** → Scansiona QR → Auto-join!

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
- 📱 **QR Code** per smartphone
- 🎮 **Real-time gaming** con WebSocket
- 📊 **Dashboard professionale**
- 🖼️ **Immagini nelle risposte**
- 📈 **Statistiche automatiche**

**🚀 PRONTO PER USO IN CLASSE!**