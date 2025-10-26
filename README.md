# ☁️ Nuvolino UI Chat

Una piattaforma sociale in tempo reale ispirata a Discord ma con un design unico, tenero e ottimizzato. Il tema è basato sul cagnolino bianco maltese "Nuvolino", mascotte ufficiale dell'app, che rappresenta gentilezza, calma e amicizia.

## ✨ Caratteristiche

### 🎨 Design e UI
- **Palette colori estesa** con azzurro Nuvolino (#87CEEB) e accenti pastello
- **Animazioni avanzate** con micro-interazioni, ripple effects e glow effects
- **Nuvolino animato** con stati diversi (idle, happy, sleeping, excited)
- **Particelle fluttuanti** opzionali per l'atmosfera
- **Layout responsive** avanzato per desktop, tablet e mobile
- **Dark mode** con accenti azzurro neon

### 💬 Chat Avanzata
- **Chat in tempo reale** con Supabase Realtime
- **Thread/Risposte** per organizzare discussioni
- **Markdown completo** (grassetto, corsivo, codice, link, citazioni, liste)
- **Menzioni** (@username, @everyone, @here)
- **Comandi** (/gioco, /sondaggio, /remind)
- **Editor WYSIWYG** con toolbar di formattazione
- **Reazioni multiple** e messaggi vocali
- **Sticker e GIF** con integrazione Giphy API

### 🎮 Mini-giochi Integrati
- **5 giochi** (Nuvolino Run, Memory Cloud, Trivia Time, Tic-Tac-Toe, Dadi e Moneta)
- **Leaderboard globale** con classifiche realtime
- **Sistema multiplayer** per giochi di gruppo
- **Achievement** per vittorie e partecipazione

### 🏆 Sistema Gamification
- **Livelli e XP** con calcolo automatico
- **Achievement** con 8 tipi diversi (chat, social, games, server, special)
- **Badge** con rarità (common, rare, epic, legendary)
- **Daily streaks** e bonus di login
- **Sistema prestigio** per utenti avanzati

### 🛍️ Marketplace e Shop
- **Sistema NuvoCoins** per acquisti virtuali
- **Shop completo** con temi, badge, cornici avatar, effetti sonori
- **Sistema premium** "Nuvolino Premium ☁️✨" (€4.99/mese)
- **Sistema regali** tra utenti
- **Inventario personale** con articoli acquistati

### 📱 Feed Pubblico
- **Feed tipo Twitter** con post pubblici
- **Moderazione AI** per contenuti inappropriati
- **Hashtag trending** e sistema di like/condivisioni
- **Commenti** e interazioni sociali
- **Filtri** per contenuti (tutti, seguiti, trending, verificati)

### 🏠 Server Ufficiale Nuvolino HQ
- **Server predefinito** con canali specializzati
- **Ruoli personalizzati** (Fondatore, Staff, Premium, Veterano, etc.)
- **Eventi settimanali** (Quiz Night, Movie Night, Game Tournament)
- **Sistema di moderazione** con log e warning
- **Statistiche realtime** del server

### ⚡ Performance Ottimizzate
- **Compressione immagini** automatica (WebP, 3 dimensioni)
- **Lazy loading** con IntersectionObserver
- **Virtual scrolling** per liste lunghe
- **Cache intelligente** per messaggi e profili
- **Service Worker** per funzionalità offline

### 🔐 Sicurezza e Moderazione
- **Moderazione AI** per contenuti testuali e immagini
- **Sistema di report** e flag per contenuti inappropriati
- **Log di moderazione** con azioni tracciabili
- **Support tickets** per assistenza utenti
- **GDPR compliance** con gestione privacy

## 🛠️ Stack Tecnologico

- **Frontend**: React + TypeScript + TailwindCSS + Framer Motion
- **Backend**: Supabase (Auth, Database, Storage, Realtime)
- **Chiamate**: WebRTC
- **Deployment**: Vercel/Netlify

## 🚀 Installazione

### Prerequisiti

- Node.js 18+ 
- npm o yarn
- Account Supabase

### 1. Clona il repository

```bash
git clone https://github.com/tuonome/nuvolino-ui-chat.git
cd nuvolino-ui-chat
```

### 2. Installa le dipendenze

```bash
npm install
```

### 3. Configura Supabase

1. Crea un nuovo progetto su [Supabase](https://supabase.com)
2. Vai al SQL Editor e esegui il contenuto del file `database-schema.sql`
3. Vai alle impostazioni del progetto e copia:
   - URL del progetto
   - Chiave anonima (anon key)

### 4. Configura le variabili d'ambiente

Crea un file `.env.local` nella root del progetto:

```env
REACT_APP_SUPABASE_URL=your_supabase_url
REACT_APP_SUPABASE_ANON_KEY=your_supabase_anon_key
```

### 5. Avvia l'applicazione

```bash
npm start
```

L'applicazione sarà disponibile su `http://localhost:3000`

## 📁 Struttura del Progetto

```
src/
├── components/          # Componenti React
│   ├── auth/           # Autenticazione
│   ├── chat/           # Sistema di chat
│   ├── layout/         # Layout e sidebar
│   ├── profile/        # Profilo utente
│   ├── server/         # Gestione server
│   └── ui/             # Componenti UI base
├── contexts/           # Context React
├── lib/               # Configurazione Supabase
└── index.css          # Stili globali
```

## 🎨 Design System

### Colori

- **Nuvolino**: Gradiente azzurro (#0ea5e9)
- **Cloud**: Grigi pastello per testi e sfondi
- **Vetro**: Effetti di trasparenza e blur

### Componenti

- **Button**: Pulsanti con animazioni e varianti
- **Input**: Campi di input con validazione
- **Card**: Carte con effetto vetro
- **Avatar**: Avatar utente con status

## 🔧 Funzionalità Principali

### Autenticazione
- Registrazione con email e password
- Login sicuro
- Profilo utente personalizzabile
- Gestione sessione persistente

### Chat
- Messaggi in tempo reale
- Supporto per testo, immagini, audio e file
- Reazioni ai messaggi
- Notifiche push

### Server e Canali
- Creazione e gestione server
- Canali testuali e vocali
- Inviti con codice univoco
- Ruoli e permessi

### Chiamate
- Chiamate audio e video
- WebRTC per connessioni dirette
- Interfaccia chiamata intuitiva

## 🚀 Deployment

### Vercel (Raccomandato)

1. Connetti il repository a Vercel
2. Aggiungi le variabili d'ambiente:
   - `REACT_APP_SUPABASE_URL`
   - `REACT_APP_SUPABASE_ANON_KEY`
3. Deploy automatico

### Netlify

1. Connetti il repository a Netlify
2. Build command: `npm run build --legacy-peer-deps`
3. Publish directory: `build`
4. Aggiungi le variabili d'ambiente
5. Node version: 18

### Risoluzione Problemi Deployment

Se incontri errori di dipendenze durante il deployment:

```bash
# Installa con legacy peer deps
npm install --legacy-peer-deps

# Oppure usa il flag force
npm install --force
```

### Variabili d'Ambiente Richieste

```env
REACT_APP_SUPABASE_URL=your_supabase_url
REACT_APP_SUPABASE_ANON_KEY=your_supabase_anon_key
REACT_APP_GIPHY_API_KEY=your_giphy_api_key (opzionale)
```

## 🤝 Contribuire

1. Fork del progetto
2. Crea un branch per la feature (`git checkout -b feature/AmazingFeature`)
3. Commit delle modifiche (`git commit -m 'Add some AmazingFeature'`)
4. Push al branch (`git push origin feature/AmazingFeature`)
5. Apri una Pull Request

## 📝 Licenza

Distribuito sotto licenza MIT. Vedi `LICENSE` per maggiori informazioni.

## 🐶 Su Nuvolino

Nuvolino è il cagnolino bianco maltese mascotte di questa app. Rappresenta gentilezza, calma e amicizia - valori che vogliamo trasmettere attraverso la nostra piattaforma di chat.

## 📞 Supporto

Per supporto o domande:
- Apri una issue su GitHub
- Email: support@nuvolinochat.com
- Discord: [Server ufficiale](https://discord.gg/nuvolino)

---

Fatto con ❤️ e ☁️ da Nuvolino UI Chat
