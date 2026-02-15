/**
 * API request/response types for TravelPal Edge Functions
 */

import type {
  Profile,
  Trip,
  TripMember,
  ItineraryItem,
  Expense,
  Booking,
  UUID,
} from './database';

// Base API response types
export interface ApiResponse<T = any> {
  data?: T;
  error?: ApiError;
}

export interface ApiError {
  message: string;
  code?: string;
  details?: any;
}

export interface PaginatedResponse<T> {
  data: T[];
  count: number;
  page: number;
  pageSize: number;
  hasMore: boolean;
}

// Auth API types
export interface LoginRequest {
  email: string;
  password: string;
}

export interface LoginResponse {
  user: Profile;
  accessToken: string;
  refreshToken: string;
}

export interface RegisterRequest {
  email: string;
  password: string;
  username?: string;
}

export interface RegisterResponse {
  user: Profile;
  accessToken: string;
  refreshToken: string;
}

export interface RefreshTokenRequest {
  refreshToken: string;
}

export interface RefreshTokenResponse {
  accessToken: string;
  refreshToken: string;
}

// Profile API types
export interface UpdateProfileRequest {
  username?: string;
  avatar_url?: string;
}

export interface UpdateProfileResponse {
  profile: Profile;
}

export interface GetProfileResponse {
  profile: Profile;
}

// Trips API types
export interface CreateTripRequest {
  title: string;
  destination: string;
  start_date: string;
  end_date: string;
  description?: string;
  image_url?: string;
}

export interface CreateTripResponse {
  trip: Trip;
}

export interface UpdateTripRequest {
  title?: string;
  destination?: string;
  start_date?: string;
  end_date?: string;
  description?: string;
  image_url?: string;
}

export interface UpdateTripResponse {
  trip: Trip;
}

export interface GetTripResponse {
  trip: Trip;
  members: TripMember[];
  owner: Profile;
}

export interface ListTripsResponse {
  trips: Trip[];
  total: number;
}

export interface DeleteTripResponse {
  success: boolean;
}

// Trip Members API types
export interface InviteMemberRequest {
  trip_id: UUID;
  user_id: UUID;
  role?: 'owner' | 'member';
}

export interface InviteMemberResponse {
  member: TripMember;
}

export interface UpdateMemberRoleRequest {
  role: 'owner' | 'member';
}

export interface UpdateMemberRoleResponse {
  member: TripMember;
}

export interface RemoveMemberResponse {
  success: boolean;
}

export interface ListMembersResponse {
  members: (TripMember & { profile: Profile })[];
}

// Itinerary API types
export interface CreateItineraryItemRequest {
  trip_id: UUID;
  day: number;
  title: string;
  details?: string;
  location?: string;
  start_time?: string;
  end_time?: string;
}

export interface CreateItineraryItemResponse {
  item: ItineraryItem;
}

export interface UpdateItineraryItemRequest {
  day?: number;
  title?: string;
  details?: string;
  location?: string;
  start_time?: string;
  end_time?: string;
}

export interface UpdateItineraryItemResponse {
  item: ItineraryItem;
}

export interface ListItineraryItemsResponse {
  items: ItineraryItem[];
  total: number;
}

export interface DeleteItineraryItemResponse {
  success: boolean;
}

// Expenses API types
export interface CreateExpenseRequest {
  trip_id: UUID;
  payer_id: UUID;
  amount: number;
  currency: string;
  description: string;
  split_between: UUID[];
  category?: string;
}

export interface CreateExpenseResponse {
  expense: Expense;
}

export interface UpdateExpenseRequest {
  payer_id?: UUID;
  amount?: number;
  currency?: string;
  description?: string;
  split_between?: UUID[];
  category?: string;
}

export interface UpdateExpenseResponse {
  expense: Expense;
}

export interface ListExpensesResponse {
  expenses: (Expense & { payer: Profile })[];
  total: number;
  totalAmount: number;
}

export interface DeleteExpenseResponse {
  success: boolean;
}

export interface ExpenseSummary {
  trip_id: UUID;
  total_amount: number;
  currency: string;
  by_category: Record<string, number>;
  by_payer: Record<UUID, number>;
}

export interface GetExpenseSummaryResponse {
  summary: ExpenseSummary;
}

// Bookings API types
export interface CreateBookingRequest {
  trip_id: UUID;
  type: 'flight' | 'hotel' | 'car' | 'train' | 'activity' | 'other';
  provider?: string;
  booking_reference?: string;
  details?: Record<string, any>;
  start_date: string;
  end_date?: string;
}

export interface CreateBookingResponse {
  booking: Booking;
}

export interface UpdateBookingRequest {
  type?: 'flight' | 'hotel' | 'car' | 'train' | 'activity' | 'other';
  provider?: string;
  booking_reference?: string;
  details?: Record<string, any>;
  start_date?: string;
  end_date?: string;
}

export interface UpdateBookingResponse {
  booking: Booking;
}

export interface ListBookingsResponse {
  bookings: Booking[];
  total: number;
}

export interface DeleteBookingResponse {
  success: boolean;
}

// Search and Filter types
export interface SearchTripsRequest {
  query?: string;
  start_date?: string;
  end_date?: string;
  destination?: string;
  page?: number;
  pageSize?: number;
}

export interface SearchTripsResponse extends PaginatedResponse<Trip> {}

// Upload types
export interface UploadImageRequest {
  file: File | Blob;
  bucket: 'avatars' | 'trip-images';
}

export interface UploadImageResponse {
  url: string;
  path: string;
}
