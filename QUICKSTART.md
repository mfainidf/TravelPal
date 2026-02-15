# TravelPal - Quick Start Guide 🚀

## Prerequisites Setup

### 1. Install Docker Desktop

**macOS:**
```bash
# Download from https://www.docker.com/products/docker-desktop
# Or via Homebrew
brew install --cask docker
```

**Windows:**
```bash
# Download from https://www.docker.com/products/docker-desktop
# Run the installer and follow the setup wizard
```

**Linux:**
```bash
# Follow instructions at https://docs.docker.com/engine/install/
```

### 2. Install Supabase CLI

**macOS/Linux:**
```bash
# Via Homebrew
brew install supabase/tap/supabase

# Or via npm
npm install -g supabase
```

**Windows:**
```bash
# Via Scoop
scoop bucket add supabase https://github.com/supabase/scoop-bucket.git
scoop install supabase

# Or via npm
npm install -g supabase
```

## Starting the Project

### Step 1: Start Supabase

```bash
cd TravelPal
supabase start
```

**What this does:**
- Starts PostgreSQL database
- Applies all migrations automatically
- Starts Supabase Studio (web UI)
- Starts all necessary services

**First time?** This will download Docker images (~2-3 GB). It may take a few minutes.

### Step 2: Access Supabase Studio

Once started, open your browser and go to:
```
http://localhost:54323
```

You can now:
- View all tables and data
- Run SQL queries
- Test RLS policies
- Manage authentication

### Step 3: Verify the Setup

Run the verification script:
```bash
./scripts/verify-migration.sh
```

You should see:
```
✅ All 9 tables created
✅ RLS enabled on all tables
✅ 35 RLS policies created
✅ 11 indexes created
✅ 9 triggers created
✅ 2 functions created
```

## Connection Details

After `supabase start`, you'll see output like:

```
API URL: http://localhost:54321
DB URL: postgresql://postgres:postgres@localhost:54322/postgres
Studio URL: http://localhost:54323
Inbucket URL: http://localhost:54324 (for testing emails)
```

### Connect with psql

```bash
psql postgresql://postgres:postgres@localhost:54322/postgres
```

### Connect with your app

Use the connection details shown in the terminal after `supabase start`.

## Common Commands

### Stop Supabase
```bash
supabase stop
```

### Reset Database (⚠️ Deletes all data)
```bash
supabase db reset
```

### View Logs
```bash
supabase logs
```

### Generate TypeScript Types
```bash
supabase gen types typescript --local > types/database.types.ts
```

## Database Tables Overview

| Table | Purpose |
|-------|---------|
| **profiles** | User profiles |
| **trips** | Trip details |
| **trip_members** | Shared trip members |
| **trip_days** | Daily itinerary |
| **activities** | Planned activities |
| **diary_entries** | Travel journal |
| **preparations** | Pre-trip checklist |
| **packing_items** | Packing list |
| **expenses** | Budget tracking |

## Testing the Database

### Create a Test User (via Supabase Studio)

1. Go to http://localhost:54323
2. Click "Authentication" in the sidebar
3. Click "Add user" → "Create new user"
4. Enter email and password
5. The trigger will automatically create a profile!

### Insert Test Data

You can use the seed data from `supabase/seed.sql` or insert via Studio:

1. Go to "Table Editor"
2. Select a table
3. Click "Insert" → "Insert row"
4. Fill in the data and save

### Test RLS Policies

1. Go to "SQL Editor"
2. Run queries as different users
3. Policies automatically restrict access

Example:
```sql
-- This will only show trips the user owns or is a member of
SELECT * FROM trips;
```

## Troubleshooting

### Docker not running
```
Error: Cannot connect to the Docker daemon
```
**Solution:** Start Docker Desktop

### Port already in use
```
Error: Port 54321 is already in use
```
**Solution:** Stop other services using these ports or modify `supabase/config.toml`

### Migration errors
```
Error applying migrations
```
**Solution:** 
```bash
supabase db reset  # This will reapply all migrations
```

### Can't connect to database
**Solution:** Make sure Supabase is running:
```bash
supabase status  # Check if services are running
supabase start   # Start if not running
```

## Next Steps

1. ✅ Start Supabase: `supabase start`
2. ✅ Verify setup: `./scripts/verify-migration.sh`
3. ✅ Open Studio: http://localhost:54323
4. ✅ Create test user
5. ✅ Insert test data
6. 🚀 Start building your app!

## Need Help?

- 📖 [Full Documentation](docs/03-specifiche-tecniche.md)
- 🔧 [Supabase Guide](supabase/README.md)
- 💬 [Open an Issue](https://github.com/mfainidf/TravelPal/issues)

---

Happy coding! 🎉
