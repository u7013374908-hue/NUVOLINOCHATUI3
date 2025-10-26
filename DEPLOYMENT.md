# 🚀 Guida al Deployment - Nuvolino UI Chat

Questa guida ti aiuterà a deployare Nuvolino UI Chat su diverse piattaforme.

## 📋 Prerequisiti

- Account Supabase configurato
- Database schema eseguito
- Variabili d'ambiente configurate

## 🔧 Configurazione Supabase

### 1. Crea un nuovo progetto Supabase

1. Vai su [supabase.com](https://supabase.com)
2. Crea un nuovo progetto
3. Scegli una regione vicina ai tuoi utenti

### 2. Configura il database

1. Vai al SQL Editor
2. Esegui il contenuto del file `database-schema.sql`
3. Verifica che tutte le tabelle siano state create

### 3. Configura l'autenticazione

1. Vai a Authentication > Settings
2. Abilita "Enable email confirmations" se necessario
3. Configura i provider OAuth se desiderato

### 4. Configura RLS (Row Level Security)

Le policy RLS sono già incluse nel file `database-schema.sql` e verranno create automaticamente.

## 🌐 Deployment su Vercel

### 1. Connetti il repository

1. Vai su [vercel.com](https://vercel.com)
2. Connetti il tuo repository GitHub
3. Seleziona il progetto Nuvolino UI Chat

### 2. Configura le variabili d'ambiente

Aggiungi queste variabili in Vercel:

```
REACT_APP_SUPABASE_URL=https://your-project.supabase.co
REACT_APP_SUPABASE_ANON_KEY=your-anon-key
REACT_APP_APP_NAME=Nuvolino UI Chat
REACT_APP_APP_VERSION=1.0.0
```

### 3. Deploy

1. Clicca su "Deploy"
2. Vercel buildera e deployerà automaticamente l'app
3. L'app sarà disponibile su `https://your-app.vercel.app`

## 🌐 Deployment su Netlify

### 1. Connetti il repository

1. Vai su [netlify.com](https://netlify.com)
2. Connetti il tuo repository GitHub
3. Seleziona il progetto Nuvolino UI Chat

### 2. Configura il build

- **Build command**: `npm run build`
- **Publish directory**: `build`

### 3. Configura le variabili d'ambiente

Aggiungi le stesse variabili di Vercel nella sezione "Environment variables"

### 4. Deploy

1. Clicca su "Deploy site"
2. Netlify buildera e deployerà l'app
3. L'app sarà disponibile su `https://your-app.netlify.app`

## 🌐 Deployment su GitHub Pages

### 1. Installa gh-pages

```bash
npm install --save-dev gh-pages
```

### 2. Aggiungi script al package.json

```json
{
  "scripts": {
    "predeploy": "npm run build",
    "deploy": "gh-pages -d build"
  }
}
```

### 3. Configura le variabili d'ambiente

Crea un file `.env.production`:

```
REACT_APP_SUPABASE_URL=https://your-project.supabase.co
REACT_APP_SUPABASE_ANON_KEY=your-anon-key
```

### 4. Deploy

```bash
npm run deploy
```

## 🔒 Configurazione di sicurezza

### 1. CORS

Configura CORS in Supabase per il tuo dominio:

1. Vai a Settings > API
2. Aggiungi il tuo dominio alla lista CORS

### 2. Rate Limiting

Configura rate limiting per le API:

1. Vai a Settings > API
2. Configura i limiti di rate per le chiamate API

### 3. RLS Policies

Verifica che tutte le policy RLS siano attive:

```sql
-- Verifica le policy attive
SELECT schemaname, tablename, policyname, permissive, roles, cmd, qual
FROM pg_policies
WHERE schemaname = 'public';
```

## 📊 Monitoraggio

### 1. Supabase Dashboard

- Monitora l'uso del database
- Controlla le performance delle query
- Verifica i log di autenticazione

### 2. Vercel Analytics

Se usi Vercel, abilita Vercel Analytics per monitorare le performance.

### 3. Error Tracking

Considera l'integrazione con servizi come:
- Sentry per error tracking
- LogRocket per session replay
- Hotjar per user analytics

## 🚀 Ottimizzazioni per la produzione

### 1. Build ottimizzato

```bash
npm run build
```

### 2. Compressione

Abilita la compressione gzip/brotli sul server.

### 3. CDN

Usa un CDN per servire i file statici:
- Cloudflare
- AWS CloudFront
- Vercel Edge Network

### 4. Caching

Configura il caching per:
- File statici (CSS, JS, immagini)
- API responses
- Database queries

## 🔧 Troubleshooting

### Problemi comuni

1. **Errori CORS**: Verifica la configurazione CORS in Supabase
2. **Errori di autenticazione**: Controlla le chiavi API
3. **Errori di database**: Verifica che lo schema sia stato eseguito correttamente
4. **Errori di build**: Controlla le variabili d'ambiente

### Log utili

```bash
# Log di build
npm run build 2>&1 | tee build.log

# Log di Supabase
# Controlla il dashboard di Supabase per i log
```

## 📱 PWA (Progressive Web App)

### 1. Service Worker

Il progetto include già un service worker base.

### 2. Manifest

Il file `public/manifest.json` è già configurato.

### 3. Icone

Aggiungi le icone PWA in `public/`:
- `icon-192x192.png`
- `icon-512x512.png`
- `apple-touch-icon.png`

## 🎯 Performance

### 1. Lighthouse Score

Mira a ottenere:
- Performance: > 90
- Accessibility: > 95
- Best Practices: > 90
- SEO: > 90

### 2. Core Web Vitals

- LCP (Largest Contentful Paint): < 2.5s
- FID (First Input Delay): < 100ms
- CLS (Cumulative Layout Shift): < 0.1

## 🔄 CI/CD

### GitHub Actions

Crea `.github/workflows/deploy.yml`:

```yaml
name: Deploy to Vercel
on:
  push:
    branches: [main]
jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      - uses: actions/setup-node@v2
        with:
          node-version: '18'
      - run: npm ci
      - run: npm run build
      - uses: amondnet/vercel-action@v20
        with:
          vercel-token: ${{ secrets.VERCEL_TOKEN }}
          vercel-org-id: ${{ secrets.ORG_ID }}
          vercel-project-id: ${{ secrets.PROJECT_ID }}
```

## 📞 Supporto

Per problemi di deployment:
1. Controlla i log di build
2. Verifica le variabili d'ambiente
3. Controlla la configurazione di Supabase
4. Apri una issue su GitHub

---

Buon deployment! 🚀☁️
