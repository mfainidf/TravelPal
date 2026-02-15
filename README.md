# TravelPal 🌍✈️

A modern travel planning and management application built with Supabase.

## Features

- 🗺️ **Trip Planning**: Create and manage detailed travel itineraries
- 👥 **Collaborative Planning**: Share trips with friends and family
- 📅 **Day-by-Day Itinerary**: Plan activities for each day of your trip
- 📔 **Travel Journal**: Document your experiences with diary entries
- ✅ **Preparation Checklist**: Track pre-trip tasks
- 🎒 **Packing List**: Never forget essential items
- 💰 **Expense Tracking**: Manage trip budget and expenses

## Tech Stack

- **Database**: PostgreSQL (via Supabase)
- **Backend**: Supabase (Auth, Database, Storage)
- **Security**: Row Level Security (RLS) policies

## Database Schema

The application uses a comprehensive PostgreSQL schema with 9 main tables:

1. **profiles** - User profiles (extends Supabase Auth)
2. **trips** - Trip information
3. **trip_members** - Shared trip members
4. **trip_days** - Daily itinerary
5. **activities** - Planned activities
6. **diary_entries** - Travel journal
7. **preparations** - Pre-trip checklist
8. **packing_items** - Packing list
9. **expenses** - Budget tracking

All tables have Row Level Security enabled with comprehensive policies for data protection.

## Getting Started

### Prerequisites

- [Docker Desktop](https://www.docker.com/products/docker-desktop)
- [Supabase CLI](https://supabase.com/docs/guides/cli)

### Installation

1. Clone the repository:
```bash
git clone https://github.com/mfainidf/TravelPal.git
cd TravelPal
```

2. Start Supabase locally:
```bash
supabase start
```

3. The migrations will be applied automatically. You can access:
   - Supabase Studio: http://localhost:54323
   - API: http://localhost:54321
   - Database: postgresql://postgres:postgres@localhost:54322/postgres

### Verify Migration

Run the verification script to ensure the schema is correctly set up:
```bash
./scripts/verify-migration.sh
```

## Documentation

- [Technical Specifications](docs/03-specifiche-tecniche.md) - Detailed database schema and architecture
- [Supabase Setup Guide](supabase/README.md) - Local development setup

## Project Structure

```
TravelPal/
├── docs/                       # Documentation
│   └── 03-specifiche-tecniche.md
├── supabase/                   # Supabase configuration
│   ├── config.toml            # Supabase config
│   ├── migrations/            # Database migrations
│   │   └── 20240101000000_initial_schema.sql
│   ├── seed.sql              # Sample data
│   └── README.md             # Supabase guide
├── scripts/                   # Utility scripts
│   └── verify-migration.sh   # Migration verification
└── README.md
```

## Development

### Database Migrations

To create a new migration:
```bash
supabase migration new migration_name
```

To apply migrations:
```bash
supabase db push
```

To reset the database:
```bash
supabase db reset
```

### Testing

The database schema includes sample seed data for testing. See `supabase/seed.sql` for more details.

## Security

- All tables have Row Level Security (RLS) enabled
- Comprehensive policies ensure users can only access their own data or shared trips
- Automatic profile creation on user signup
- Automatic timestamp updates

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

This project is open source and available under the MIT License.

## Support

For issues and questions, please open an issue on GitHub. 
