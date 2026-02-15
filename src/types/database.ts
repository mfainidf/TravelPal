/**
 * Database entity types for TravelPal
 * Generated types for all Supabase database tables
 */

// Base types
export type UUID = string;
export type Timestamp = string;

// Enums
export enum TripMemberRole {
  OWNER = 'owner',
  MEMBER = 'member',
}

export enum TripMemberStatus {
  INVITED = 'invited',
  CONFIRMED = 'confirmed',
  LEFT = 'left',
}

export enum BookingType {
  FLIGHT = 'flight',
  HOTEL = 'hotel',
  CAR = 'car',
  TRAIN = 'train',
  ACTIVITY = 'activity',
  OTHER = 'other',
}

// Profiles table
export interface Profile {
  id: UUID;
  username: string | null;
  email: string;
  avatar_url: string | null;
  created_at: Timestamp;
  updated_at: Timestamp | null;
}

export interface ProfileInsert {
  id?: UUID;
  username?: string | null;
  email: string;
  avatar_url?: string | null;
  created_at?: Timestamp;
  updated_at?: Timestamp | null;
}

export interface ProfileUpdate {
  username?: string | null;
  email?: string;
  avatar_url?: string | null;
  updated_at?: Timestamp | null;
}

// Trips table
export interface Trip {
  id: UUID;
  owner_id: UUID;
  title: string;
  destination: string;
  start_date: string;
  end_date: string;
  description: string | null;
  image_url: string | null;
  created_at: Timestamp;
  updated_at: Timestamp | null;
}

export interface TripInsert {
  id?: UUID;
  owner_id: UUID;
  title: string;
  destination: string;
  start_date: string;
  end_date: string;
  description?: string | null;
  image_url?: string | null;
  created_at?: Timestamp;
  updated_at?: Timestamp | null;
}

export interface TripUpdate {
  title?: string;
  destination?: string;
  start_date?: string;
  end_date?: string;
  description?: string | null;
  image_url?: string | null;
  updated_at?: Timestamp | null;
}

// Trip Members table
export interface TripMember {
  id: UUID;
  trip_id: UUID;
  user_id: UUID;
  role: TripMemberRole;
  status: TripMemberStatus;
  created_at: Timestamp;
}

export interface TripMemberInsert {
  id?: UUID;
  trip_id: UUID;
  user_id: UUID;
  role?: TripMemberRole;
  status?: TripMemberStatus;
  created_at?: Timestamp;
}

export interface TripMemberUpdate {
  role?: TripMemberRole;
  status?: TripMemberStatus;
}

// Itinerary Items table
export interface ItineraryItem {
  id: UUID;
  trip_id: UUID;
  day: number;
  title: string;
  details: string | null;
  location: string | null;
  start_time: Timestamp | null;
  end_time: Timestamp | null;
  created_at: Timestamp;
  updated_at: Timestamp | null;
}

export interface ItineraryItemInsert {
  id?: UUID;
  trip_id: UUID;
  day: number;
  title: string;
  details?: string | null;
  location?: string | null;
  start_time?: Timestamp | null;
  end_time?: Timestamp | null;
  created_at?: Timestamp;
  updated_at?: Timestamp | null;
}

export interface ItineraryItemUpdate {
  day?: number;
  title?: string;
  details?: string | null;
  location?: string | null;
  start_time?: Timestamp | null;
  end_time?: Timestamp | null;
  updated_at?: Timestamp | null;
}

// Expenses table
export interface Expense {
  id: UUID;
  trip_id: UUID;
  payer_id: UUID;
  amount: number;
  currency: string;
  description: string;
  split_between: UUID[];
  category: string | null;
  created_at: Timestamp;
  updated_at: Timestamp | null;
}

export interface ExpenseInsert {
  id?: UUID;
  trip_id: UUID;
  payer_id: UUID;
  amount: number;
  currency: string;
  description: string;
  split_between: UUID[];
  category?: string | null;
  created_at?: Timestamp;
  updated_at?: Timestamp | null;
}

export interface ExpenseUpdate {
  payer_id?: UUID;
  amount?: number;
  currency?: string;
  description?: string;
  split_between?: UUID[];
  category?: string | null;
  updated_at?: Timestamp | null;
}

// Bookings table
export interface Booking {
  id: UUID;
  trip_id: UUID;
  type: BookingType;
  provider: string | null;
  booking_reference: string | null;
  details: Record<string, any> | null;
  start_date: Timestamp;
  end_date: Timestamp | null;
  created_at: Timestamp;
  updated_at: Timestamp | null;
}

export interface BookingInsert {
  id?: UUID;
  trip_id: UUID;
  type: BookingType;
  provider?: string | null;
  booking_reference?: string | null;
  details?: Record<string, any> | null;
  start_date: Timestamp;
  end_date?: Timestamp | null;
  created_at?: Timestamp;
  updated_at?: Timestamp | null;
}

export interface BookingUpdate {
  type?: BookingType;
  provider?: string | null;
  booking_reference?: string | null;
  details?: Record<string, any> | null;
  start_date?: Timestamp;
  end_date?: Timestamp | null;
  updated_at?: Timestamp | null;
}

// Database schema type
export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: Profile;
        Insert: ProfileInsert;
        Update: ProfileUpdate;
      };
      trips: {
        Row: Trip;
        Insert: TripInsert;
        Update: TripUpdate;
      };
      trip_members: {
        Row: TripMember;
        Insert: TripMemberInsert;
        Update: TripMemberUpdate;
      };
      itinerary_items: {
        Row: ItineraryItem;
        Insert: ItineraryItemInsert;
        Update: ItineraryItemUpdate;
      };
      expenses: {
        Row: Expense;
        Insert: ExpenseInsert;
        Update: ExpenseUpdate;
      };
      bookings: {
        Row: Booking;
        Insert: BookingInsert;
        Update: BookingUpdate;
      };
    };
  };
}
