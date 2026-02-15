export interface TravelPreferences {
  budget?: 'low' | 'medium' | 'high';
  travelStyle?: 'adventure' | 'relaxation' | 'culture' | 'nature';
  accommodation?: 'hotel' | 'hostel' | 'airbnb' | 'camping';
  transportation?: 'flight' | 'train' | 'car' | 'bus';
}

export interface Profile {
  id: string;
  email: string;
  full_name: string | null;
  avatar_url: string | null;
  travel_preferences: TravelPreferences;
  created_at: string;
  updated_at: string;
}

export interface ProfileUpdate {
  full_name?: string;
  avatar_url?: string;
  travel_preferences?: TravelPreferences;
}
