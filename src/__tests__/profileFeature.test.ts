/**
 * Test file to verify multi-profile functionality
 * 
 * This file demonstrates how the multi-profile system works:
 * 
 * 1. Profile Storage:
 *    - Profiles are stored in AsyncStorage under '@travelpal:profiles'
 *    - Active profile ID stored under '@travelpal:active_profile'
 *    - Sessions stored under '@travelpal:sessions'
 * 
 * 2. Profile Structure:
 *    - id: Supabase user ID
 *    - email: User email
 *    - name: Display name
 *    - avatar: Optional avatar URL
 *    - createdAt: Profile creation timestamp
 *    - lastActiveAt: Last time profile was active
 * 
 * 3. Session Management:
 *    - Each profile has its own Supabase session
 *    - When switching profiles, the session is restored
 *    - Sessions include access token, refresh token, and expiry
 * 
 * 4. UI Components:
 *    - ProfileSelector: Horizontal scrollable list of profiles
 *    - Shows avatar/initials, name, and email
 *    - Active profile has blue border and checkmark
 *    - Supports adding and removing profiles
 * 
 * Usage flow:
 * 1. User opens app -> loadProfiles() called
 * 2. User sees ProfileSelector in home or profile screen
 * 3. User can tap a profile to switch -> switchProfile(id)
 * 4. User can add new profile -> addProfile(email, password, name)
 * 5. User can remove profile -> removeProfile(id)
 */

// Example usage of ProfileStorageService
import { ProfileStorageService } from '../services/profileStorage';
import { UserProfile } from '../types/profile';

export async function testProfileStorage() {
  // Create a test profile
  const testProfile: UserProfile = {
    id: 'test-user-id',
    email: 'test@example.com',
    name: 'Test User',
    createdAt: new Date().toISOString(),
    lastActiveAt: new Date().toISOString(),
  };

  try {
    // Add profile
    await ProfileStorageService.addOrUpdateProfile(testProfile);
    console.log('✓ Profile added');

    // Get profiles
    const profiles = await ProfileStorageService.getProfiles();
    console.log('✓ Profiles retrieved:', profiles.length);

    // Set active profile
    await ProfileStorageService.setActiveProfileId(testProfile.id);
    console.log('✓ Active profile set');

    // Get active profile
    const activeId = await ProfileStorageService.getActiveProfileId();
    console.log('✓ Active profile ID:', activeId);

    // Clean up
    await ProfileStorageService.removeProfile(testProfile.id);
    console.log('✓ Profile removed');

    return true;
  } catch (error) {
    console.error('✗ Test failed:', error);
    return false;
  }
}

// Example usage of useProfileStore
/*
import { useProfileStore } from '../stores/profileStore';

function MyComponent() {
  const { profiles, activeProfile, switchProfile, addProfile } = useProfileStore();

  // Load profiles on mount
  useEffect(() => {
    loadProfiles();
  }, []);

  // Switch to another profile
  const handleSwitch = async (profileId: string) => {
    await switchProfile(profileId);
  };

  // Add a new profile
  const handleAdd = async () => {
    await addProfile('email@example.com', 'password', 'Name');
  };

  return (
    <ProfileSelector onAddProfile={handleAdd} />
  );
}
*/
