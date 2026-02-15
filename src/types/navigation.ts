/**
 * Navigation parameter types for TravelPal
 * Type-safe navigation with Expo Router
 */

import type { UUID } from './database';

// Root Stack Navigator
export type RootStackParamList = {
  '(auth)': undefined;
  '(tabs)': undefined;
  '+not-found': undefined;
};

// Auth Stack Navigator
export type AuthStackParamList = {
  login: undefined;
  register: undefined;
  'forgot-password': undefined;
};

// Tabs Navigator
export type TabsParamList = {
  home: undefined;
  viaggi: undefined;
  profilo: undefined;
};

// Trip Stack Navigator
export type TripStackParamList = {
  'trip/new': undefined;
  'trip/[id]': TripDetailParams;
  'trip/[id]/edit': TripEditParams;
  'trip/[id]/members': TripMembersParams;
  'trip/[id]/itinerary': TripItineraryParams;
  'trip/[id]/itinerary/new': TripItineraryNewParams;
  'trip/[id]/itinerary/[itemId]': TripItineraryItemParams;
  'trip/[id]/expenses': TripExpensesParams;
  'trip/[id]/expenses/new': TripExpenseNewParams;
  'trip/[id]/expenses/[expenseId]': TripExpenseDetailParams;
  'trip/[id]/bookings': TripBookingsParams;
  'trip/[id]/bookings/new': TripBookingNewParams;
  'trip/[id]/bookings/[bookingId]': TripBookingDetailParams;
};

// Parameter types for each route
export interface TripDetailParams {
  id: UUID;
}

export interface TripEditParams {
  id: UUID;
}

export interface TripMembersParams {
  id: UUID;
}

export interface TripItineraryParams {
  id: UUID;
}

export interface TripItineraryNewParams {
  id: UUID;
  day?: number;
}

export interface TripItineraryItemParams {
  id: UUID;
  itemId: UUID;
}

export interface TripExpensesParams {
  id: UUID;
}

export interface TripExpenseNewParams {
  id: UUID;
}

export interface TripExpenseDetailParams {
  id: UUID;
  expenseId: UUID;
}

export interface TripBookingsParams {
  id: UUID;
}

export interface TripBookingNewParams {
  id: UUID;
  type?: 'flight' | 'hotel' | 'car' | 'train' | 'activity' | 'other';
}

export interface TripBookingDetailParams {
  id: UUID;
  bookingId: UUID;
}

// Profile Stack Navigator
export type ProfileStackParamList = {
  'profilo/edit': undefined;
  'profilo/settings': undefined;
};

// Combined App Navigator
export type AppParamList = RootStackParamList &
  AuthStackParamList &
  TabsParamList &
  TripStackParamList &
  ProfileStackParamList;

// Type helpers for navigation
export type RouteName = keyof AppParamList;
export type RouteParams<T extends RouteName> = AppParamList[T];

// Navigation prop types (for use with useNavigation hook)
declare global {
  namespace ReactNavigation {
    interface RootParamList extends AppParamList {}
  }
}
