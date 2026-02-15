# TravelPal - Supabase Database

Questo directory contiene la configurazione e le migrazioni del database PostgreSQL per TravelPal.

## Struttura

```
supabase/
├── config.toml              # Configurazione Supabase locale
├── migrations/              # Migrazioni database SQL
│   └── 20240101000000_initial_schema.sql
├── seed.sql                 # Dati di esempio per testing
└── .gitignore              # File da ignorare
```

## Setup Locale

### Prerequisiti
- Docker Desktop
- Supabase CLI

### Installare Supabase CLI

```bash
# macOS
brew install supabase/tap/supabase

# Windows (via Scoop)
scoop bucket add supabase https://github.com/supabase/scoop-bucket.git
scoop install supabase

# Linux
brew install supabase/tap/supabase
```

### Avviare Supabase Locale

1. Assicurarsi che Docker Desktop sia in esecuzione

2. Avviare Supabase:
```bash
cd /path/to/TravelPal
supabase start
```

3. La prima volta verranno scaricate le immagini Docker (può richiedere qualche minuto)

4. Una volta avviato, vedrai output simile a:
```
Started supabase local development setup.

         API URL: http://localhost:54321
          DB URL: postgresql://postgres:postgres@localhost:54322/postgres
      Studio URL: http://localhost:54323
    Inbucket URL: http://localhost:54324
      JWT secret: your-super-secret-jwt-token
        anon key: your-anon-key
service_role key: your-service-role-key
```

### Applicare le Migrazioni

Le migrazioni vengono applicate automaticamente quando si avvia Supabase con `supabase start`.

Per applicare manualmente nuove migrazioni:
```bash
supabase db push
```

### Accedere a Supabase Studio

Apri il browser e vai a: http://localhost:54323

Qui puoi:
- Visualizzare e modificare i dati
- Testare query SQL
- Gestire le policy RLS
- Visualizzare i log

## Schema Database

Il database include le seguenti tabelle:

1. **profiles** - Profili utente
2. **trips** - Viaggi
3. **trip_members** - Membri dei viaggi (condivisione)
4. **trip_days** - Giorni del viaggio
5. **activities** - Attività giornaliere
6. **diary_entries** - Diario di viaggio
7. **preparations** - Checklist preparativi
8. **packing_items** - Lista bagagli
9. **expenses** - Gestione spese

Per dettagli completi, vedere `docs/03-specifiche-tecniche.md`.

## Sicurezza

### Row Level Security (RLS)

Tutte le tabelle hanno RLS abilitato con policy che garantiscono:
- Gli utenti possono vedere solo i loro viaggi o viaggi condivisi con loro
- Solo i proprietari possono eliminare viaggi
- I membri possono modificare contenuti in base al loro ruolo
- Gli utenti possono modificare solo i propri contenuti (diary, expenses)

### Trigger Automatici

1. **updated_at**: Aggiorna automaticamente il timestamp quando una riga viene modificata
2. **on_auth_user_created**: Crea automaticamente un profilo quando un utente si registra

## Creare Nuove Migrazioni

```bash
# Creare una nuova migrazione vuota
supabase migration new nome_migrazione

# Esempio: aggiungere una nuova colonna
supabase migration new add_budget_to_trips
```

Poi modifica il file SQL creato in `supabase/migrations/`.

## Reset Database

⚠️ **ATTENZIONE**: Questo cancellerà tutti i dati locali!

```bash
supabase db reset
```

## Fermare Supabase

```bash
supabase stop
```

## Testing

### Seed Data

Per popolare il database con dati di esempio:

```bash
psql postgresql://postgres:postgres@localhost:54322/postgres < supabase/seed.sql
```

Nota: I dati in `seed.sql` sono commentati di default. Decommentare le sezioni necessarie per il testing.

## Connessione al Database

### Connection String Locale
```
postgresql://postgres:postgres@localhost:54322/postgres
```

### Con psql
```bash
psql postgresql://postgres:postgres@localhost:54322/postgres
```

### Con pgAdmin o altri client
- Host: localhost
- Port: 54322
- Database: postgres
- User: postgres
- Password: postgres

## Deploy in Produzione

1. Creare un progetto su [Supabase Cloud](https://app.supabase.com/)

2. Linkare il progetto locale:
```bash
supabase link --project-ref your-project-ref
```

3. Push delle migrazioni:
```bash
supabase db push
```

## Troubleshooting

### Errore "Docker not found"
Assicurati che Docker Desktop sia installato e in esecuzione.

### Porta già in uso
Se le porte di default sono occupate, modificale in `config.toml`:
```toml
[api]
port = 54321  # Cambia se necessario

[db]
port = 54322  # Cambia se necessario
```

### Reset completo
```bash
supabase stop
supabase start --reset
```

## Risorse

- [Supabase Docs](https://supabase.com/docs)
- [Supabase CLI Reference](https://supabase.com/docs/reference/cli)
- [PostgreSQL Docs](https://www.postgresql.org/docs/)
- [Row Level Security](https://supabase.com/docs/guides/auth/row-level-security)
