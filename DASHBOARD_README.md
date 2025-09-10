# Dashboard Rahoot - Guida Completa

## 🎯 Panoramica

La Dashboard Rahoot è un sistema completo per la gestione dei quiz interattivi, progettato specificamente per insegnanti e educatori. Offre tutte le funzionalità necessarie per creare, gestire e analizzare quiz educativi.

## 🚀 Come Accedere

### ⚡ NUOVO COMANDO DI AVVIO RAPIDO
```bash
npm run rahoot
```
Questo comando mostra tutti i link e informazioni utili all'avvio!

### Metodo 1: Dalla Home Page
1. Avvia Rahoot: `npm run rahoot` o `npm run all-dev`
2. Vai a: `http://localhost:3000`
3. Clicca su "👨‍🏫 Dashboard" in alto a destra
4. Oppure clicca su "🎓 Dashboard Insegnanti" nella sezione principale

### Metodo 2: URL Diretto
- Vai direttamente a: `http://localhost:3000/dashboard`

### Credenziali di Accesso
- **Password predefinita**: `admin123`
- (È possibile modificarla nel codice della dashboard)

### Comandi Disponibili
- `npm run rahoot` - Avvio rapido con info complete
- `npm run all-dev` - Avvio classico (dev + socket)
- `npm run dev` - Solo interfaccia web
- `npm run socket` - Solo server socket

## 📋 Funzionalità Principali

### 1. **Gestione Quiz** (Tab "I Miei Quiz")
- **Visualizzazione**: Lista di tutti i quiz creati
- **Azioni disponibili**:
  - 🚀 **Usa nel Gioco**: Imposta il quiz come attivo
  - ✏️ **Modifica**: Modifica domande e impostazioni
  - 📋 **Duplica**: Crea una copia del quiz
  - 🗑️ **Elimina**: Rimuove il quiz (con conferma)
- **Informazioni mostrate**: Numero di domande, data di creazione, tempo stimato

### 2. **Creazione Quiz** (Tab "Crea Quiz")
- **Informazioni Generali**:
  - Titolo del quiz
  - Password per il gioco
- **Editor Domande**:
  - Testo della domanda
  - 4 opzioni di risposta
  - Selezione risposta corretta
  - Tempo per rispondere (5-120 secondi)
  - Pausa tra domande (0-30 secondi)
  - Immagine opzionale (URL)
- **Anteprima**: Visualizzazione delle domande create
- **Salvataggio**: Salva nel browser (localStorage)

### 3. **Statistiche e Report** (Tab "Statistiche")
- **Metriche Generali**:
  - 🎮 Giochi totali giocati
  - 👥 Numero totale di giocatori
  - 📈 Punteggio medio
  - 🏆 Quiz più popolare
- **Record Assoluto**: Migliore performance di tutti i tempi
- **Cronologia Dettagliata**: Lista di tutte le partite giocate con:
  - Classifica finale
  - Statistiche per domanda
  - Percentuale di risposte corrette
- **Export**: Scarica tutti i dati in formato JSON
- **Pulizia**: Cancella tutta la cronologia

### 4. **Lancia Gioco** (Tab "Lancia Gioco")
- **Selezione Quiz**: Scegli quale quiz utilizzare
- **Configurazioni di Gioco**:
  - Password personalizzata
  - Accesso tardivo
  - Visualizzazione classifica
  - Mescola domande
  - Mescola risposte
- **Aggiornamento Configurazione**:
  - 📥 Scarica file config.mjs aggiornato
  - 📋 Copia configurazione negli appunti
  - ⚙️ Aggiornamento automatico
- **Lancio**: Avvia il gioco con le impostazioni selezionate

## 🔧 Configurazione Tecnica

### File Coinvolti
```
src/pages/dashboard.js              # Pagina principale dashboard
src/components/dashboard/
├── QuizManager.jsx                 # Gestione quiz esistenti
├── QuizCreator.jsx                # Creazione nuovi quiz
├── Statistics.jsx                  # Statistiche e report
├── GameLauncher.jsx               # Configurazione e lancio giochi
└── ConfigUpdater.jsx              # Utility per aggiornare config
```

### Storage dei Dati
I dati vengono salvati nel `localStorage` del browser:
- `rahoot-quizzes`: Array dei quiz creati
- `rahoot-game-history`: Cronologia delle partite
- `current-game-quiz`: Quiz attualmente attivo
- `game-settings`: Impostazioni dell'ultimo gioco

### Integrazione con il Sistema Esistente
- La dashboard si integra perfettamente con il sistema Rahoot esistente
- Modifica dinamicamente il file `config.mjs` per aggiornare i quiz
- Mantiene compatibilità con il sistema socket esistente

## 📖 Guida d'Uso Passo-Passo

### Creare il Primo Quiz
1. **Accedi** alla dashboard con password `admin123`
2. Vai al tab **"Crea Quiz"**
3. **Inserisci** titolo e password del quiz
4. **Aggiungi domande**:
   - Scrivi la domanda
   - Inserisci le 4 risposte
   - Seleziona quella corretta (radio button)
   - Imposta tempo e pausa
   - Aggiungi immagine se necessario
5. **Clicca** "Aggiungi Domanda"
6. **Ripeti** per tutte le domande
7. **Salva** il quiz

### Lanciare un Gioco
1. Vai al tab **"Lancia Gioco"**
2. **Seleziona** il quiz da utilizzare
3. **Configura** le impostazioni:
   - Cambia password se necessario
   - Abilita/disabilita opzioni
4. **Scarica** il file di configurazione aggiornato
5. **Sostituisci** il file `config.mjs` nella root del progetto
6. **Riavvia** il server: `npm run socket`
7. **Clicca** "Lancia Gioco"
8. **Condividi** la password con gli studenti

### Analizzare i Risultati
1. Dopo ogni partita, i risultati vengono salvati automaticamente
2. Vai al tab **"Statistiche"**
3. **Visualizza**:
   - Metriche generali
   - Record personali
   - Cronologia dettagliata
4. **Esporta** i dati per analisi esterne
5. **Pulisci** la cronologia quando necessario

## 🛠️ Personalizzazione

### Modificare la Password di Accesso
Nel file `src/pages/dashboard.js`, cambia:
```javascript
if (password === "admin123") {
```
Con la tua password preferita.

### Aggiungere Nuove Funzionalità
La struttura modulare permette di aggiungere facilmente:
- Nuovi tipi di domande
- Sistemi di autenticazione più avanzati
- Integrazione con database esterni
- Export in formati diversi

### Temi e Styling
La dashboard usa Tailwind CSS. Puoi personalizzare:
- Colori nei file dei componenti
- Layout modificando le classi
- Aggiungere nuove sezioni

## 🚨 Risoluzione Problemi

### "Nessun quiz creato"
- Verifica di aver salvato il quiz dopo averlo creato
- Controlla il localStorage del browser

### "Password non corretta"
- Assicurati di usare `admin123` come password
- Verifica di non aver modificato la password di default

### Quiz non si aggiorna nel gioco
- Assicurati di aver scaricato il nuovo file `config.mjs`
- Sostituisci il file nella root del progetto
- Riavvia il server socket con `npm run socket`

### Statistiche mancanti
- Le statistiche si salvano automaticamente dopo ogni partita
- Verifica che il browser permetta il localStorage
- Non usare modalità incognito per garantire la persistenza

## 🎓 Consigli per l'Uso Didattico

### Preparazione
- **Crea quiz diversi** per argomenti specifici
- **Testa sempre** i quiz prima dell'uso in classe
- **Prepara domande** con diversi livelli di difficoltà
- **Usa immagini** per rendere più coinvolgenti i quiz

### Durante la Lezione
- **Spiega** le regole prima di iniziare
- **Monitora** la partecipazione attraverso le statistiche
- **Usa** la modalità "mescola domande" per evitare copie
- **Controlla** che tutti riescano ad accedere

### Dopo la Lezione
- **Analizza** i risultati nelle statistiche
- **Identifica** domande troppo facili o difficili
- **Esporta** i dati per valutazioni future
- **Modifica** i quiz basandoti sui risultati

## 📞 Supporto

Per problemi o domande:
1. Controlla questa guida
2. Verifica i messaggi di errore nella console del browser
3. Assicurati che tutti i file siano stati creati correttamente
4. Riavvia il server in caso di problemi di connessione

---

**Dashboard Rahoot** - Sistema completo per quiz educativi interattivi 🎓✨