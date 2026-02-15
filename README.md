# TravelPal

Un'app React Native per la gestione dei viaggi, costruita con Expo, TypeScript e Supabase.

## Features

- 🔐 Autenticazione con Email/Password
- 🌐 OAuth con Google
- 📱 Design Material Design 3 con React Native Paper
- 🎨 Sistema di spaziatura a 8px
- 🌍 Supporto italiano
- 🔄 State management con Zustand
- ⚡ Data fetching con React Query

## Setup

### Prerequisiti

- Node.js 18+
- npm o yarn
- Expo CLI
- Supabase account (opzionale per test locali)

### Installazione

1. Clona il repository:
```bash
git clone https://github.com/mfainidf/TravelPal.git
cd TravelPal
```

2. Installa le dipendenze:
```bash
npm install
```

3. Configura le variabili d'ambiente:
```bash
cp .env.example .env
```

Modifica `.env` con le tue credenziali Supabase:
```
EXPO_PUBLIC_SUPABASE_URL=your-supabase-url
EXPO_PUBLIC_SUPABASE_ANON_KEY=your-supabase-anon-key
```

### Avvio del progetto

```bash
# Avvia il dev server
npm start

# Avvia su iOS
npm run ios

# Avvia su Android
npm run android

# Avvia su Web (richiede installazione di react-native-web)
npm run web
```

## Struttura del progetto

```
TravelPal/
├── app/                    # Expo Router app directory
│   ├── (auth)/            # Schermate di autenticazione
│   │   ├── login.tsx      # Schermata di login
│   │   └── register.tsx   # Schermata di registrazione
│   ├── (tabs)/            # Schermate con navigazione a tab
│   │   ├── index.tsx      # Home
│   │   ├── viaggi.tsx     # Viaggi
│   │   └── profilo.tsx    # Profilo
│   └── _layout.tsx        # Layout root
├── src/
│   ├── services/          # Servizi (Supabase, React Query)
│   ├── stores/            # Zustand stores
│   ├── theme/             # Configurazione tema
│   ├── i18n/              # Traduzioni
│   └── components/        # Componenti riutilizzabili
└── assets/                # Risorse statiche
```

## Login Screen Features

La schermata di login (`app/(auth)/login.tsx`) include:

✅ **Form Email + Password**
- Validazione con Zod
- Gestione errori con react-hook-form
- Feedback visivo con HelperText

✅ **Bottone "Accedi con Google"**
- OAuth flow con expo-web-browser
- Gestione redirect automatica
- Supporto deep linking

✅ **Gestione errori**
- Credenziali non valide
- Errori di rete
- Errori sconosciuti

✅ **Redirect automatico**
- Dopo login riuscito → Home (gestito dal root layout)
- Link alla registrazione

## Scripts

- `npm start` - Avvia il dev server Expo
- `npm run lint` - Esegue il linter
- `npm run format` - Formatta il codice con Prettier

## Tecnologie utilizzate

- **Expo** - Framework React Native
- **TypeScript** - Type safety
- **React Native Paper** - UI Component library (Material Design 3)
- **Expo Router** - File-based routing
- **Supabase** - Backend as a Service (Auth, Database)
- **Zustand** - State management
- **React Query** - Data fetching e caching
- **React Hook Form** - Form management
- **Zod** - Schema validation

## Autenticazione

Il sistema di autenticazione è gestito da:

1. **Supabase Client** (`src/services/supabase.ts`) - Configurazione client Supabase con AsyncStorage
2. **Auth Store** (`src/stores/authStore.ts`) - Store Zustand per gestione stato auth
3. **Root Layout** (`app/_layout.tsx`) - Gestione redirect basato su stato auth

### Flusso di autenticazione:

1. Utente inserisce credenziali nella schermata di login
2. Supabase valida le credenziali
3. Auth store aggiorna lo stato della sessione
4. Root layout reindirizza automaticamente alla home

## Prossimi passi

- [ ] Implementare schermata di registrazione completa
- [ ] Aggiungere reset password
- [ ] Implementare gestione viaggi
- [ ] Aggiungere test automatizzati

## Licenza

Questo progetto è stato generato con GitHub Copilot.
