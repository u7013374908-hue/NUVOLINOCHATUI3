#!/bin/bash

# Script di deployment per Nuvolino UI Chat
echo "🚀 Avvio deployment di Nuvolino UI Chat..."

# Installa dipendenze con legacy peer deps
echo "📦 Installazione dipendenze..."
npm install --legacy-peer-deps

# Build dell'applicazione
echo "🔨 Build dell'applicazione..."
npm run build

echo "✅ Deployment completato!"
