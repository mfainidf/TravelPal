# TravelPal TypeScript Types

This directory contains all TypeScript type definitions for the TravelPal application.

## Files

### `database.ts`
Database entity types for all Supabase tables:
- **Profiles**: User profile information
- **Trips**: Travel trip entities
- **Trip Members**: Trip participant management
- **Itinerary Items**: Daily itinerary activities
- **Expenses**: Trip expense tracking
- **Bookings**: Travel booking details (flights, hotels, etc.)

Each entity includes:
- Base interface (Row)
- Insert interface (for creating new records)
- Update interface (for updating existing records)

### `api.ts`
API request/response types for Edge Functions:
- Authentication (login, register, token refresh)
- Profile management
- Trip CRUD operations
- Member management
- Itinerary operations
- Expense tracking
- Booking management
- Search and filtering

### `navigation.ts`
Navigation parameter types for Expo Router:
- Route parameter definitions for type-safe navigation
- Stack navigator param lists
- Tab navigator param lists
- Global ReactNavigation type augmentation

## Usage

```typescript
// Import specific types
import { Trip, Profile } from '@/types/database';
import { CreateTripRequest, CreateTripResponse } from '@/types/api';
import { TripDetailParams } from '@/types/navigation';

// Or import all types
import * as Types from '@/types';

// Using database types
const trip: Trip = {
  id: '123',
  owner_id: 'user-456',
  title: 'Summer Vacation',
  destination: 'Italy',
  start_date: '2026-07-01',
  end_date: '2026-07-15',
  description: 'Exploring Italian cities',
  image_url: null,
  created_at: new Date().toISOString(),
  updated_at: null,
};

// Using API types
const createTrip = async (data: CreateTripRequest): Promise<CreateTripResponse> => {
  // API call implementation
};

// Using navigation types with Expo Router
import { useLocalSearchParams } from 'expo-router';

function TripDetailScreen() {
  const params = useLocalSearchParams<TripDetailParams>();
  const tripId = params.id; // Fully typed!
}
```

## Type Safety

All types follow strict TypeScript conventions:
- Required fields are non-optional
- Optional fields use `?` syntax
- Nullable fields use `| null` union type
- Enums for fixed value sets
- Generic types for reusable patterns

## Database Schema

The database types are designed to work with Supabase PostgreSQL schema. Each table should have corresponding SQL migrations defining:
- Primary keys (UUID)
- Foreign keys with proper relationships
- Indexes for query performance
- Row Level Security (RLS) policies
