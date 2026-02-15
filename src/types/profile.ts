export interface UserProfile {
  id: string;
  email: string;
  name: string;
  avatar?: string;
  createdAt: string;
  lastActiveAt: string;
}

export interface ProfileSession {
  profileId: string;
  accessToken: string;
  refreshToken: string;
  expiresAt: number;
}

export interface ProfilesState {
  profiles: UserProfile[];
  activeProfileId: string | null;
  sessions: Record<string, ProfileSession>;
}
