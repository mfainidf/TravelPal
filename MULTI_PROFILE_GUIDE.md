# Multi-Profile Implementation Guide

## Overview
This document describes the implementation of the S1.4 multi-profile feature for TravelPal.

## Requirements Met

### ✅ Memorizzare lista profili in AsyncStorage
- Implemented in `src/services/profileStorage.ts`
- Stores profiles array, active profile ID, and sessions
- Uses keys: `@travelpal:profiles`, `@travelpal:active_profile`, `@travelpal:sessions`

### ✅ UI selettore rapido (avatar + nome)
- Implemented in `src/components/ProfileSelector.tsx`
- Horizontal scrollable list with profile cards
- Shows avatar (or initials), name, and email
- Visual indicator for active profile (blue border + checkmark)
- Add profile button included
- Remove profile button (X icon) on each card

### ✅ Switch profilo con cambio sessione Supabase
- Implemented in `src/stores/profileStore.ts`
- `switchProfile(profileId)` method handles profile switching
- Restores Supabase session from storage
- Updates active profile timestamp
- Maintains separate sessions for each profile

## Architecture

### Data Flow
```
User Action → ProfileStore → ProfileStorageService → AsyncStorage
                ↓
           Supabase Auth
```

### Key Components

#### 1. Types (`src/types/profile.ts`)
```typescript
interface UserProfile {
  id: string;              // Supabase user ID
  email: string;           // User email
  name: string;            // Display name
  avatar?: string;         // Optional avatar URL
  createdAt: string;       // ISO timestamp
  lastActiveAt: string;    // ISO timestamp
}

interface ProfileSession {
  profileId: string;
  accessToken: string;
  refreshToken: string;
  expiresAt: number;
}
```

#### 2. Storage Service (`src/services/profileStorage.ts`)
Static methods for AsyncStorage operations:
- `getProfiles()` - Get all profiles
- `saveProfiles(profiles)` - Save profiles array
- `addOrUpdateProfile(profile)` - Add or update single profile
- `removeProfile(profileId)` - Remove profile and its session
- `getActiveProfileId()` - Get current active profile
- `setActiveProfileId(profileId)` - Set active profile
- `getSessions()` / `saveSession()` - Session management
- `getProfilesState()` - Get complete state
- `clearAll()` - Clear all data (for debugging)

#### 3. Profile Store (`src/stores/profileStore.ts`)
Zustand store with methods:
- `loadProfiles()` - Load profiles on app start
- `switchProfile(profileId)` - Switch to different profile
- `addProfile(email, password, name)` - Sign in and add new profile
- `removeProfile(profileId)` - Remove profile
- `updateActiveProfile(updates)` - Update current profile
- `logout()` - Sign out current profile

#### 4. UI Component (`src/components/ProfileSelector.tsx`)
- Renders horizontal scrollable profile cards
- Shows avatar (image or initials from name)
- Active profile has visual indicator
- Supports add and remove actions
- Loading state handling

### Integration Points

#### Home Screen (`app/(tabs)/index.tsx`)
```typescript
useEffect(() => {
  loadProfiles();  // Load on mount
}, []);

<ProfileSelector onAddProfile={handleAddProfile} />
```

#### Profile Screen (`app/(tabs)/profilo.tsx`)
```typescript
// Shows active profile details
// Includes ProfileSelector for switching
// Logout button
```

#### Add Profile Screen (`app/profile/add.tsx`)
```typescript
// Modal form for adding new profile
// Email, password, name inputs
// Calls addProfile() from store
```

## Usage Scenarios

### Scenario 1: First Time User
1. App opens with no profiles
2. User sees "Aggiungi Profilo" button
3. User enters credentials and name
4. Profile created and set as active
5. User sees home screen with profile selector

### Scenario 2: Switching Profiles
1. User has multiple profiles stored
2. User taps different profile in selector
3. App switches Supabase session
4. UI updates to show new active profile
5. User data for new profile loaded

### Scenario 3: Adding Second Profile
1. User with one profile wants to add another
2. Taps "+" button in ProfileSelector
3. Enters different account credentials
4. New profile added to list
5. Can switch between both profiles

### Scenario 4: Removing Profile
1. User taps X button on a profile card
2. Profile removed from storage
3. If active profile removed, switches to another
4. If last profile removed, shows empty state

## Storage Keys

- `@travelpal:profiles` - Array of UserProfile objects
- `@travelpal:active_profile` - String (profile ID)
- `@travelpal:sessions` - Object mapping profile IDs to sessions

## Error Handling

All async operations include try-catch blocks:
- Storage errors logged to console
- User-facing errors shown in `error` state
- Failed operations don't crash the app

## Security Considerations

1. Sessions stored in AsyncStorage (encrypted by OS)
2. Tokens never logged or exposed
3. Each profile has isolated session
4. Sign-out clears active session
5. Profile removal deletes associated session

## Testing

See `src/__tests__/profileFeature.test.ts` for example usage and test cases.

To manually test:
1. Start app: `npm start`
2. Add multiple profiles with different Supabase accounts
3. Switch between profiles
4. Verify data isolation
5. Remove profiles
6. Test logout functionality

## Future Enhancements

Possible improvements:
- Profile avatars (upload/camera)
- Last active timestamp display
- Profile search/filter
- Biometric authentication per profile
- Profile data backup/restore
- Profile theme preferences
- Offline mode improvements

## Dependencies

- `@react-native-async-storage/async-storage` - Local storage
- `@supabase/supabase-js` - Authentication backend
- `zustand` - State management
- `react-native-paper` - UI components
- `expo-router` - Navigation

## Estimated Implementation Time

✓ Completed in ~30 minutes as per requirement S1.4
