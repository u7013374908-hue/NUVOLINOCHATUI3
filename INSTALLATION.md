# 🐶 Installazione di Nuvolino UI Chat

Guida completa per installare e configurare Nuvolino UI Chat sul tuo sistema.

## 📋 Prerequisiti

Prima di iniziare, assicurati di avere:

- **Node.js** 18.0 o superiore
- **npm** 8.0 o superiore (o yarn)
- **Git** per clonare il repository
- Un account **Supabase** (gratuito)

## 🚀 Installazione Rapida

### 1. Clona il repository

```bash
git clone https://github.com/tuonome/nuvolino-ui-chat.git
cd nuvolino-ui-chat
```

### 2. Installa le dipendenze

```bash
npm install
# oppure
yarn install
```

### 3. Configura Supabase

#### 3.1 Crea un progetto Supabase

1. Vai su [supabase.com](https://supabase.com)
2. Clicca su "New Project"
3. Scegli un nome per il progetto (es. "nuvolino-chat")
4. Scegli una password sicura per il database
5. Seleziona una regione vicina a te
6. Clicca su "Create new project"

#### 3.2 Configura il database

1. Vai al **SQL Editor** nel dashboard di Supabase
2. Clicca su "New query"
3. Copia e incolla tutto il contenuto del file `database-schema.sql`
4. Clicca su "Run" per eseguire lo script
5. Verifica che tutte le tabelle siano state create

#### 3.3 Ottieni le chiavi API

1. Vai a **Settings** > **API**
2. Copia:
   - **Project URL** (es. `https://xxxxx.supabase.co`)
   - **anon public** key (inizia con `eyJ...`)

### 4. Configura le variabili d'ambiente

Crea un file `.env.local` nella root del progetto:

```env
REACT_APP_SUPABASE_URL=https://your-project.supabase.co
REACT_APP_SUPABASE_ANON_KEY=your-anon-key
REACT_APP_APP_NAME=Nuvolino UI Chat
REACT_APP_APP_VERSION=1.0.0
```

**⚠️ Importante**: Sostituisci `your-project` e `your-anon-key` con i valori reali del tuo progetto Supabase.

### 5. Avvia l'applicazione

```bash
npm start
# oppure
yarn start
```

L'applicazione sarà disponibile su `http://localhost:3000`

## 🔧 Configurazione Avanzata

### Configurazione dell'autenticazione

1. Vai a **Authentication** > **Settings** in Supabase
2. Configura le impostazioni di email:
   - **Enable email confirmations**: Attiva se vuoi confermare le email
   - **Enable email change confirmations**: Attiva per confermare i cambi email
3. Configura i provider OAuth (opzionale):
   - Google
   - GitHub
   - Discord
   - etc.

### Configurazione dello storage

1. Vai a **Storage** in Supabase
2. Crea un bucket chiamato `avatars`
3. Configura le policy RLS per il bucket:

```sql
-- Policy per permettere agli utenti di caricare i propri avatar
CREATE POLICY "Users can upload their own avatar" ON storage.objects
FOR INSERT WITH CHECK (
  bucket_id = 'avatars' AND
  auth.uid()::text = (storage.foldername(name))[1]
);

-- Policy per permettere la lettura pubblica degli avatar
CREATE POLICY "Avatar images are publicly accessible" ON storage.objects
FOR SELECT USING (bucket_id = 'avatars');
```

### Configurazione delle notifiche push

1. Vai a **Settings** > **API** in Supabase
2. Abilita **Realtime** se non è già attivo
3. Configura le notifiche push nel browser:

```javascript
// Nel tuo componente React
const requestNotificationPermission = async () => {
  if ('Notification' in window && Notification.permission === 'default') {
    const permission = await Notification.requestPermission()
    return permission === 'granted'
  }
  return Notification.permission === 'granted'
}
```

## 🎨 Personalizzazione

### Tema e colori

Modifica `tailwind.config.js` per personalizzare i colori:

```javascript
theme: {
  extend: {
    colors: {
      'nuvolino': {
        50: '#f0f9ff',
        100: '#e0f2fe',
        // ... altri colori
      }
    }
  }
}
```

### Font personalizzati

1. Aggiungi i font in `public/index.html`:

```html
<link href="https://fonts.googleapis.com/css2?family=YourFont:wght@300;400;500;600;700&display=swap" rel="stylesheet">
```

2. Aggiorna `tailwind.config.js`:

```javascript
fontFamily: {
  'custom': ['YourFont', 'sans-serif'],
}
```

### Logo e icone

1. Sostituisci `public/favicon.ico` con il tuo logo
2. Aggiorna `public/manifest.json` con le tue icone
3. Modifica il componente `StartupAnimation.tsx` per il tuo logo

## 🐛 Risoluzione Problemi

### Problema: "Module not found"

```bash
# Pulisci la cache e reinstalla
rm -rf node_modules package-lock.json
npm install
```

### Problema: "Supabase connection failed"

1. Verifica che le variabili d'ambiente siano corrette
2. Controlla che il progetto Supabase sia attivo
3. Verifica che le chiavi API siano valide

### Problema: "Database schema error"

1. Assicurati di aver eseguito tutto lo script `database-schema.sql`
2. Controlla che non ci siano errori nella console di Supabase
3. Verifica che RLS sia abilitato per tutte le tabelle

### Problema: "Build failed"

1. Controlla che tutte le dipendenze siano installate
2. Verifica che Node.js sia versione 18+
3. Controlla i log di build per errori specifici

### Problema: "WebRTC not working"

1. Assicurati di usare HTTPS in produzione
2. Verifica che il browser supporti WebRTC
3. Controlla i permessi per microfono e camera

## 📱 Test su dispositivi mobili

### Test locale

1. Trova il tuo IP locale:
   ```bash
   ipconfig  # Windows
   ifconfig  # macOS/Linux
   ```

2. Avvia l'app con l'IP:
   ```bash
   npm start -- --host 0.0.0.0
   ```

3. Accedi da mobile: `http://YOUR_IP:3000`

### Test in produzione

1. Deploy su Vercel/Netlify
2. Testa su diversi dispositivi
3. Usa gli strumenti di sviluppo del browser per simulare dispositivi

## 🔒 Sicurezza

### Configurazione RLS

Verifica che tutte le policy RLS siano attive:

```sql
-- Controlla le policy attive
SELECT schemaname, tablename, policyname, permissive, roles, cmd, qual
FROM pg_policies
WHERE schemaname = 'public';
```

### Variabili d'ambiente

- **Non committare** mai il file `.env.local`
- Usa variabili d'ambiente diverse per sviluppo e produzione
- Ruota regolarmente le chiavi API

### HTTPS

- Usa sempre HTTPS in produzione
- Configura redirect da HTTP a HTTPS
- Usa certificati SSL validi

## 📊 Monitoraggio

### Log di sviluppo

```bash
# Avvia con log dettagliati
DEBUG=* npm start
```

### Log di produzione

1. Monitora i log di Supabase
2. Usa servizi come Sentry per error tracking
3. Configura alert per errori critici

## 🚀 Deploy

Vedi `DEPLOYMENT.md` per istruzioni dettagliate sul deployment.

## 🤝 Contribuire

1. Fork del repository
2. Crea un branch per la feature
3. Fai commit delle modifiche
4. Apri una Pull Request

## 📞 Supporto

- **GitHub Issues**: Per bug e feature request
- **Discord**: [Server ufficiale](https://discord.gg/nuvolino)
- **Email**: support@nuvolinochat.com

## 📄 Licenza

Questo progetto è sotto licenza MIT. Vedi `LICENSE` per maggiori dettagli.

---

Fatto con ❤️ e ☁️ da Nuvolino UI Chat

Se hai problemi con l'installazione, non esitare a chiedere aiuto! 🐶
