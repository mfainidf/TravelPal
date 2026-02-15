# TravelPal Database Schema - Visual Overview

## Entity Relationship Diagram

```
┌─────────────────────┐
│   auth.users        │  (Supabase Auth)
│  ─────────────      │
│  • id (UUID)        │
│  • email            │
│  • password         │
└──────────┬──────────┘
           │ 1:1
           │ (trigger: on_auth_user_created)
           ↓
┌─────────────────────┐
│   profiles          │  User Profiles
│  ─────────────      │
│  • id (PK, FK)      │
│  • email            │
│  • full_name        │
│  • avatar_url       │
│  • created_at       │
│  • updated_at       │
└──────────┬──────────┘
           │ 1:N
           ↓
┌─────────────────────┐              ┌─────────────────────┐
│   trips             │◄─────────────│  trip_members       │
│  ─────────────      │   N:N        │  ─────────────      │
│  • id (PK)          │              │  • id (PK)          │
│  • owner_id (FK)    │              │  • trip_id (FK)     │
│  • title            │              │  • user_id (FK)     │
│  • description      │              │  • role             │
│  • destination      │              │    - owner          │
│  • start_date       │              │    - editor         │
│  • end_date         │              │    - viewer         │
│  • cover_image_url  │              │    - member         │
│  • created_at       │              │  • joined_at        │
│  • updated_at       │              └─────────────────────┘
└──────────┬──────────┘
           │ 1:N
           ├─────────────────────────┐
           │                         │
           ↓                         ↓
┌─────────────────────┐   ┌─────────────────────┐
│  trip_days          │   │  diary_entries      │
│  ─────────────      │   │  ─────────────      │
│  • id (PK)          │   │  • id (PK)          │
│  • trip_id (FK)     │   │  • trip_id (FK)     │
│  • day_date         │   │  • user_id (FK)     │
│  • title            │   │  • title            │
│  • notes            │   │  • content          │
│  • created_at       │   │  • entry_date       │
│  • updated_at       │   │  • mood             │
└──────────┬──────────┘   │  • photos (JSONB)   │
           │ 1:N          │  • created_at       │
           ↓              │  • updated_at       │
┌─────────────────────┐   └─────────────────────┘
│  activities         │
│  ─────────────      │   ┌─────────────────────┐
│  • id (PK)          │   │  preparations       │
│  • trip_day_id (FK) │   │  ─────────────      │
│  • title            │   │  • id (PK)          │
│  • description      │   │  • trip_id (FK)     │
│  • location         │   │  • title            │
│  • start_time       │   │  • description      │
│  • end_time         │   │  • category         │
│  • activity_type    │   │  • due_date         │
│  • cost             │   │  • is_completed     │
│  • booking_ref      │   │  • completed_at     │
│  • notes            │   │  • completed_by     │
│  • created_at       │   │  • created_at       │
│  • updated_at       │   │  • updated_at       │
└─────────────────────┘   └─────────────────────┘
                                      △
                          ┌───────────┴───────────┐
                          │                       │
           ┌─────────────────────┐   ┌─────────────────────┐
           │  packing_items      │   │  expenses           │
           │  ─────────────      │   │  ─────────────      │
           │  • id (PK)          │   │  • id (PK)          │
           │  • trip_id (FK)     │   │  • trip_id (FK)     │
           │  • item_name        │   │  • user_id (FK)     │
           │  • category         │   │  • title            │
           │  • quantity         │   │  • amount           │
           │  • is_packed        │   │  • currency         │
           │  • notes            │   │  • category         │
           │  • created_at       │   │  • expense_date     │
           │  • updated_at       │   │  • notes            │
           └─────────────────────┘   │  • receipt_url      │
                                     │  • created_at       │
                                     │  • updated_at       │
                                     └─────────────────────┘
```

## Key Features

### 🔒 Security (Row Level Security)

All tables have RLS enabled with comprehensive policies:

| Table | Policies | Access Control |
|-------|----------|----------------|
| profiles | 3 | Public view, own edit |
| trips | 4 | Owner + members view, owner delete |
| trip_members | 4 | Members view, owner manages |
| trip_days | 4 | Members edit, owners delete |
| activities | 4 | Members edit, owners delete |
| diary_entries | 4 | Members view, author edits |
| preparations | 4 | Members edit, owners delete |
| packing_items | 4 | Members edit, owners delete |
| expenses | 4 | Members view, author/owner edits |

**Total: 35 RLS policies**

### ⚡ Triggers

1. **Auto-update timestamps** (8 triggers)
   - Automatically updates `updated_at` on every row modification
   - Applied to: profiles, trips, trip_days, activities, diary_entries, preparations, packing_items, expenses

2. **Auto-create profile** (1 trigger)
   - Creates profile in `profiles` table when user signs up via Supabase Auth
   - Copies email, full_name, and avatar_url from auth metadata

### 🔍 Indexes

11 indexes for optimal query performance:
- Foreign key indexes on all relationships
- Composite indexes for common query patterns

### 🎭 Roles & Permissions

Trip members can have 4 roles:
- **owner**: Full control (create, edit, delete everything)
- **editor**: Can edit content but not delete trip
- **viewer**: Can view but not edit
- **member**: Can add/edit content (activities, diary, expenses)

## Data Flow Examples

### Example 1: Creating a Trip
```
1. User creates trip → trips table (owner_id = user.id)
2. Automatically added as owner → trip_members (role = 'owner')
3. Can now add days → trip_days (trip_id = trip.id)
4. Can add activities → activities (trip_day_id = day.id)
```

### Example 2: Sharing a Trip
```
1. Owner invites friend → trip_members (user_id = friend.id, role = 'editor')
2. Friend can now:
   - View trip details (trips)
   - Add diary entries (diary_entries)
   - Add expenses (expenses)
   - Edit activities (activities)
   - Update packing list (packing_items)
```

### Example 3: Automatic Profile Creation
```
1. User signs up via Supabase Auth → auth.users
2. Trigger fires: on_auth_user_created
3. Profile created automatically → profiles
   - Copies: id, email, full_name, avatar_url
```

## Tables Summary

| # | Table | Purpose | Records/Trip |
|---|-------|---------|--------------|
| 1 | profiles | User profiles | 1/user |
| 2 | trips | Trip details | 1 |
| 3 | trip_members | Shared members | 1-N |
| 4 | trip_days | Daily itinerary | 1-30 |
| 5 | activities | Daily activities | 1-10/day |
| 6 | diary_entries | Travel journal | 0-N |
| 7 | preparations | Pre-trip tasks | 10-50 |
| 8 | packing_items | Packing list | 20-100 |
| 9 | expenses | Budget tracking | 10-100 |

## Technical Details

- **Database**: PostgreSQL 15
- **Extensions**: uuid-ossp
- **Constraints**: Foreign keys with CASCADE delete
- **Unique constraints**: (trip_id, user_id) on trip_members, (trip_id, day_date) on trip_days
- **Check constraints**: role enum on trip_members
- **Default values**: UUID generation, timestamps, booleans

## Migration File

📄 **File**: `supabase/migrations/20240101000000_initial_schema.sql`  
📊 **Size**: 779 lines of SQL  
✅ **Status**: Ready to deploy

## Usage

```bash
# Apply migration
supabase start  # Auto-applies migrations

# Or manually
supabase db push

# Verify
./scripts/verify-migration.sh
```

---

**Schema Version**: 1.0.0  
**Last Updated**: 2024-02-15  
**Status**: Production Ready ✅
