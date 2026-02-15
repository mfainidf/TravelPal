# TravelPal

App per la gestione di viaggi con supporto multi-profilo.

## Funzionalità S1.4 - Selettore Multi-Profilo

Questa implementazione permette la gestione di profili multipli sullo stesso dispositivo con:

### Caratteristiche principali

- **Memorizzazione profili in AsyncStorage**: I profili utente vengono salvati localmente con le loro informazioni
- **UI selettore rapido**: Componente visuale con avatar e nome per switchare tra profili
- **Switch profilo con sessione Supabase**: Il cambio profilo mantiene le sessioni separate per ogni utente

### Struttura

#### Servizi
- `src/services/profileStorage.ts` - Gestione AsyncStorage per profili e sessioni
- `src/services/supabase.ts` - Configurazione client Supabase

#### Store
- `src/stores/profileStore.ts` - Store Zustand per gestione stato profili

#### Componenti
- `src/components/ProfileSelector.tsx` - UI selettore profili con avatar

#### Schermate
- `app/(tabs)/index.tsx` - Home con selettore profili
- `app/(tabs)/profilo.tsx` - Schermata profilo con gestione multi-profilo
- `app/profile/add.tsx` - Aggiunta nuovo profilo

### Configurazione

1. Copia `.env.example` in `.env` e configura le variabili Supabase:
```bash
cp .env.example .env
```

2. Installa le dipendenze:
```bash
npm install
```

3. Avvia l'app:
```bash
npm start
```

### Uso

1. **Aggiungere un profilo**: Dalla home o dal profilo, tocca il pulsante "Aggiungi Profilo"
2. **Switchare profilo**: Tocca un profilo nel selettore orizzontale
3. **Rimuovere profilo**: Tocca l'icona X su un profilo nel selettore

### Dipendenze chiave

- `@react-native-async-storage/async-storage` - Storage locale
- `@supabase/supabase-js` - Autenticazione e backend
- `zustand` - State management
- `expo-router` - Navigazione
- `react-native-paper` - UI Components (Material Design 3) 
