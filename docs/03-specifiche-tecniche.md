# TravelPal - Specifiche Tecniche

## Indice
1. [Architettura Generale](#1-architettura-generale)
2. [Stack Tecnologico](#2-stack-tecnologico)
3. [Schema Database](#3-schema-database)
4. [API e Autenticazione](#4-api-e-autenticazione)
5. [Sicurezza](#5-sicurezza)

---

## 1. Architettura Generale

TravelPal è un'applicazione web per la pianificazione e gestione di viaggi, costruita con un'architettura moderna basata su:
- **Frontend**: React/Next.js (da implementare)
- **Backend**: Supabase (PostgreSQL + API REST + Realtime)
- **Autenticazione**: Supabase Auth
- **Storage**: Supabase Storage (per immagini e documenti)

---

## 2. Stack Tecnologico

### Backend
- **Database**: PostgreSQL 15
- **BaaS**: Supabase
- **ORM**: Supabase JS Client
- **Autenticazione**: Supabase Auth (JWT)

### Security Features
- Row Level Security (RLS) su tutte le tabelle
- Politiche di accesso basate su ruoli
- Autenticazione JWT
- HTTPS obbligatorio in produzione

---

## 3. Schema Database

### 3.1 Panoramica Tabelle

Il database è composto da 9 tabelle principali:

1. **profiles** - Profili utente estesi
2. **trips** - Viaggi pianificati
3. **trip_members** - Membri dei viaggi (condivisione)
4. **trip_days** - Giorni del viaggio (itinerario)
5. **activities** - Attività pianificate per ogni giorno
6. **diary_entries** - Diario di viaggio
7. **preparations** - Checklist preparativi
8. **packing_items** - Lista bagagli
9. **expenses** - Gestione spese

### 3.2 Relazioni tra Tabelle

```
auth.users (Supabase Auth)
    ↓
profiles (1:1 con auth.users)
    ↓
trips (1:N - un utente può avere molti viaggi)
    ↓
    ├─ trip_members (N:N - un viaggio può avere molti membri)
    ├─ trip_days (1:N - un viaggio ha molti giorni)
    │      ↓
    │      └─ activities (1:N - un giorno ha molte attività)
    ├─ diary_entries (1:N - un viaggio ha molte voci di diario)
    ├─ preparations (1:N - un viaggio ha molti preparativi)
    ├─ packing_items (1:N - un viaggio ha molti item da imballare)
    └─ expenses (1:N - un viaggio ha molte spese)
```

### 3.3 Dettaglio Tabelle

#### profiles
Estensione del profilo utente di Supabase Auth.

| Campo | Tipo | Descrizione |
|-------|------|-------------|
| id | UUID | PK, FK a auth.users(id) |
| email | TEXT | Email dell'utente |
| full_name | TEXT | Nome completo |
| avatar_url | TEXT | URL avatar |
| created_at | TIMESTAMPTZ | Data creazione |
| updated_at | TIMESTAMPTZ | Data ultimo aggiornamento |

**Trigger**: Creato automaticamente quando un utente si registra via Supabase Auth.

#### trips
Viaggi principali dell'utente.

| Campo | Tipo | Descrizione |
|-------|------|-------------|
| id | UUID | PK |
| owner_id | UUID | FK a profiles(id) - proprietario |
| title | TEXT | Titolo del viaggio |
| description | TEXT | Descrizione |
| destination | TEXT | Destinazione |
| start_date | DATE | Data inizio |
| end_date | DATE | Data fine |
| cover_image_url | TEXT | URL immagine copertina |
| created_at | TIMESTAMPTZ | Data creazione |
| updated_at | TIMESTAMPTZ | Data ultimo aggiornamento |

#### trip_members
Membri che partecipano a un viaggio (per viaggi condivisi).

| Campo | Tipo | Descrizione |
|-------|------|-------------|
| id | UUID | PK |
| trip_id | UUID | FK a trips(id) |
| user_id | UUID | FK a profiles(id) |
| role | TEXT | Ruolo: 'owner', 'editor', 'viewer', 'member' |
| joined_at | TIMESTAMPTZ | Data di aggiunta |

**Constraint**: UNIQUE(trip_id, user_id)

#### trip_days
Giorni del viaggio con itinerario giornaliero.

| Campo | Tipo | Descrizione |
|-------|------|-------------|
| id | UUID | PK |
| trip_id | UUID | FK a trips(id) |
| day_date | DATE | Data del giorno |
| title | TEXT | Titolo del giorno |
| notes | TEXT | Note aggiuntive |
| created_at | TIMESTAMPTZ | Data creazione |
| updated_at | TIMESTAMPTZ | Data ultimo aggiornamento |

**Constraint**: UNIQUE(trip_id, day_date)

#### activities
Attività programmate per ogni giorno.

| Campo | Tipo | Descrizione |
|-------|------|-------------|
| id | UUID | PK |
| trip_day_id | UUID | FK a trip_days(id) |
| title | TEXT | Titolo attività |
| description | TEXT | Descrizione |
| location | TEXT | Luogo |
| start_time | TIME | Ora inizio |
| end_time | TIME | Ora fine |
| activity_type | TEXT | Tipo attività |
| cost | DECIMAL(10,2) | Costo stimato |
| booking_reference | TEXT | Riferimento prenotazione |
| notes | TEXT | Note |
| created_at | TIMESTAMPTZ | Data creazione |
| updated_at | TIMESTAMPTZ | Data ultimo aggiornamento |

#### diary_entries
Diario di viaggio con ricordi e foto.

| Campo | Tipo | Descrizione |
|-------|------|-------------|
| id | UUID | PK |
| trip_id | UUID | FK a trips(id) |
| user_id | UUID | FK a profiles(id) - autore |
| title | TEXT | Titolo entry |
| content | TEXT | Contenuto |
| entry_date | DATE | Data dell'entry |
| mood | TEXT | Umore (emoji/tag) |
| photos | JSONB | Array di URL foto |
| created_at | TIMESTAMPTZ | Data creazione |
| updated_at | TIMESTAMPTZ | Data ultimo aggiornamento |

#### preparations
Checklist dei preparativi pre-viaggio.

| Campo | Tipo | Descrizione |
|-------|------|-------------|
| id | UUID | PK |
| trip_id | UUID | FK a trips(id) |
| title | TEXT | Titolo task |
| description | TEXT | Descrizione |
| category | TEXT | Categoria |
| due_date | DATE | Data scadenza |
| is_completed | BOOLEAN | Completato |
| completed_at | TIMESTAMPTZ | Data completamento |
| completed_by | UUID | FK a profiles(id) |
| created_at | TIMESTAMPTZ | Data creazione |
| updated_at | TIMESTAMPTZ | Data ultimo aggiornamento |

#### packing_items
Lista bagagli per il viaggio.

| Campo | Tipo | Descrizione |
|-------|------|-------------|
| id | UUID | PK |
| trip_id | UUID | FK a trips(id) |
| item_name | TEXT | Nome oggetto |
| category | TEXT | Categoria |
| quantity | INTEGER | Quantità |
| is_packed | BOOLEAN | Imballato |
| notes | TEXT | Note |
| created_at | TIMESTAMPTZ | Data creazione |
| updated_at | TIMESTAMPTZ | Data ultimo aggiornamento |

#### expenses
Gestione spese e budget del viaggio.

| Campo | Tipo | Descrizione |
|-------|------|-------------|
| id | UUID | PK |
| trip_id | UUID | FK a trips(id) |
| user_id | UUID | FK a profiles(id) - chi ha speso |
| title | TEXT | Titolo spesa |
| amount | DECIMAL(10,2) | Importo |
| currency | TEXT | Valuta (default: EUR) |
| category | TEXT | Categoria |
| expense_date | DATE | Data spesa |
| notes | TEXT | Note |
| receipt_url | TEXT | URL ricevuta |
| created_at | TIMESTAMPTZ | Data creazione |
| updated_at | TIMESTAMPTZ | Data ultimo aggiornamento |

### 3.4 Indici

Sono stati creati indici su tutte le foreign key per ottimizzare le query:

- `idx_trips_owner_id` su trips(owner_id)
- `idx_trip_members_trip_id` su trip_members(trip_id)
- `idx_trip_members_user_id` su trip_members(user_id)
- `idx_trip_days_trip_id` su trip_days(trip_id)
- `idx_activities_trip_day_id` su activities(trip_day_id)
- `idx_diary_entries_trip_id` su diary_entries(trip_id)
- `idx_diary_entries_user_id` su diary_entries(user_id)
- `idx_preparations_trip_id` su preparations(trip_id)
- `idx_packing_items_trip_id` su packing_items(trip_id)
- `idx_expenses_trip_id` su expenses(trip_id)
- `idx_expenses_user_id` su expenses(user_id)

### 3.5 Trigger

#### Trigger per updated_at
Tutte le tabelle con campo `updated_at` hanno un trigger che aggiorna automaticamente il timestamp quando una riga viene modificata.

**Funzione**: `handle_updated_at()`

**Tabelle con trigger**:
- profiles
- trips
- trip_days
- activities
- diary_entries
- preparations
- packing_items
- expenses

#### Trigger per creazione automatica profilo
Quando un nuovo utente si registra tramite Supabase Auth, viene automaticamente creata una riga nella tabella `profiles`.

**Funzione**: `handle_new_user()`  
**Trigger**: `on_auth_user_created` su `auth.users`

---

## 4. API e Autenticazione

### 4.1 Autenticazione

Supabase Auth gestisce:
- Registrazione utenti
- Login/Logout
- Reset password
- Token JWT
- Session management

### 4.2 API REST

Supabase genera automaticamente API REST per tutte le tabelle:
- GET: Lettura dati
- POST: Inserimento
- PATCH: Aggiornamento
- DELETE: Cancellazione

Tutte le API rispettano le policy RLS.

---

## 5. Sicurezza

### 5.1 Row Level Security (RLS)

**Tutte le tabelle hanno RLS abilitato.**

### 5.2 Policy RLS

#### profiles
- **SELECT**: Tutti possono vedere tutti i profili
- **INSERT**: Gli utenti possono creare solo il proprio profilo
- **UPDATE**: Gli utenti possono aggiornare solo il proprio profilo

#### trips
- **SELECT**: Proprietari e membri possono vedere i viaggi
- **INSERT**: Gli utenti possono creare viaggi
- **UPDATE**: Proprietari e editor possono modificare
- **DELETE**: Solo i proprietari possono eliminare

#### trip_members
- **SELECT**: Membri del viaggio possono vedere altri membri
- **INSERT**: Solo i proprietari possono aggiungere membri
- **UPDATE**: Solo i proprietari possono modificare ruoli
- **DELETE**: Proprietari possono rimuovere membri, membri possono auto-rimuoversi

#### trip_days
- **SELECT**: Membri del viaggio possono vedere i giorni
- **INSERT/UPDATE**: Proprietari, editor e membri possono creare/modificare
- **DELETE**: Solo proprietari e editor possono eliminare

#### activities
- **SELECT**: Membri del viaggio possono vedere le attività
- **INSERT/UPDATE**: Proprietari, editor e membri possono creare/modificare
- **DELETE**: Solo proprietari e editor possono eliminare

#### diary_entries
- **SELECT**: Membri del viaggio possono vedere le entry
- **INSERT**: Membri possono creare entry per i loro viaggi
- **UPDATE/DELETE**: Gli utenti possono modificare/eliminare solo le proprie entry

#### preparations
- **SELECT**: Membri del viaggio possono vedere i preparativi
- **INSERT/UPDATE**: Proprietari, editor e membri possono creare/modificare
- **DELETE**: Solo proprietari e editor possono eliminare

#### packing_items
- **SELECT**: Membri del viaggio possono vedere gli item
- **INSERT/UPDATE**: Proprietari, editor e membri possono creare/modificare
- **DELETE**: Solo proprietari e editor possono eliminare

#### expenses
- **SELECT**: Membri del viaggio possono vedere le spese
- **INSERT**: Membri possono creare spese per i loro viaggi
- **UPDATE**: Gli utenti possono modificare solo le proprie spese
- **DELETE**: Gli utenti possono eliminare le proprie spese, i proprietari possono eliminare tutte

### 5.3 Best Practices

1. **JWT Tokens**: Tutte le richieste API devono includere un token JWT valido
2. **HTTPS**: Obbligatorio in produzione
3. **Validazione Input**: Validare sempre i dati lato client E server
4. **Sanitizzazione**: Sanitizzare input per prevenire SQL injection (gestito da Supabase)
5. **Rate Limiting**: Implementare rate limiting per prevenire abusi

---

## Appendice A: Comandi Utili

### Inizializzare progetto Supabase locale
```bash
supabase init
```

### Avviare Supabase locale
```bash
supabase start
```

### Applicare migrazioni
```bash
supabase db push
```

### Creare una nuova migrazione
```bash
supabase migration new migration_name
```

### Reset database locale
```bash
supabase db reset
```

### Generare TypeScript types dal database
```bash
supabase gen types typescript --local > types/database.types.ts
```

---

## Appendice B: Risorse

- [Supabase Documentation](https://supabase.com/docs)
- [PostgreSQL Documentation](https://www.postgresql.org/docs/)
- [Row Level Security Guide](https://supabase.com/docs/guides/auth/row-level-security)
