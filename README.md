# TravelPal

A React Native application built with Expo, featuring Supabase authentication, React Query for data management, and Zustand for state management.

## Setup

### Prerequisites

- Node.js (v18 or higher)
- npm or yarn
- Expo CLI (will be installed via npx)

### Installation

1. Clone the repository:
```bash
git clone https://github.com/mfainidf/TravelPal.git
cd TravelPal
```

2. Install dependencies:
```bash
npm install
```

3. Configure Supabase:
   - Copy `.env.example` to `.env`
   - Update the Supabase URL and anon key with your project credentials:
     ```
     EXPO_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
     EXPO_PUBLIC_SUPABASE_ANON_KEY=your-anon-key-here
     ```

### Running the App

Start the development server:
```bash
npm start
```

Then choose your platform:
- Press `i` for iOS simulator
- Press `a` for Android emulator
- Press `w` for web browser
- Scan the QR code with Expo Go app on your physical device

## Architecture

### Services

- **src/services/supabase.ts**: Singleton Supabase client configured with AsyncStorage for session persistence
- **src/services/queryClient.ts**: React Query client with AsyncStorage persistence for offline data caching

### State Management

- **src/stores/authStore.ts**: Zustand store managing user authentication state and session

### Key Features

1. **Supabase Integration**
   - Authentication with session persistence
   - Automatic token refresh
   - AsyncStorage integration for React Native

2. **React Query**
   - Data fetching and caching
   - Offline persistence with AsyncStorage
   - Automatic cache invalidation

3. **Zustand State Management**
   - Lightweight state management for auth
   - Easy-to-use hooks
   - Automatic re-renders on state changes

## Project Structure

```
TravelPal/
├── App.tsx                      # Main app component with providers
├── src/
│   ├── services/
│   │   ├── supabase.ts         # Supabase client configuration
│   │   └── queryClient.ts      # React Query client with persistence
│   └── stores/
│       └── authStore.ts        # Zustand auth store
├── package.json
├── tsconfig.json
├── app.json
└── .env.example
```

## Technologies

- **React Native** (0.73.0) - Mobile app framework
- **Expo** (~50.0.0) - React Native development platform
- **TypeScript** (^5.1.3) - Type-safe JavaScript
- **Supabase** (@supabase/supabase-js) - Backend as a service
- **React Query** (@tanstack/react-query) - Data fetching and caching
- **Zustand** - State management
- **AsyncStorage** (@react-native-async-storage/async-storage) - Local storage

## License

MIT
