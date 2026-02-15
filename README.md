# TravelPal

A travel planning app built with React Native and Expo Router.

## Project Structure

This project uses Expo Router for navigation with the following structure:

### Navigation Layout

- **Root Layout** (`app/_layout.tsx`): Main app container with Stack navigation
  - **Auth Flow** (`app/(auth)/_layout.tsx`): Authentication screens
    - Login (`login.tsx`)
    - Register (`register.tsx`)
  - **Tabs Navigation** (`app/(tabs)/_layout.tsx`): Main app tabs
    - Home (`index.tsx`): Home screen
    - Viaggi (`viaggi.tsx`): Trips list screen
    - Profilo (`profilo.tsx`): User profile screen
  - **Trip Stack** (`app/trip/`): Trip-related screens
    - New Trip (`new.tsx`): Create new trip
    - Trip Details (`[id]/index.tsx`): View trip details with dynamic ID

### 404 Screen

- `app/+not-found.tsx`: Handles unknown routes

## Getting Started

### Prerequisites

- Node.js (v18 or later)
- npm or yarn
- Expo CLI (optional, will be run via npx)

### Installation

```bash
npm install
```

### Development

```bash
# Start development server
npm start

# Run on iOS
npm run ios

# Run on Android
npm run android

# Run on web
npm run web
```

## Tech Stack

- **React Native**: 0.76.9
- **Expo**: ~52.0.0
- **Expo Router**: ~4.0.0
- **TypeScript**: ^5.9.3
- **React Navigation**: ^7.0.14

## Navigation Features

- Tab-based navigation for main app sections
- Stack-based navigation for authentication flow
- Dynamic routing for trip details (using `[id]` parameter)
- 404 error handling for unknown routes
- Type-safe navigation with TypeScript

## Development Notes

- All navigation is file-based using Expo Router
- Screens are automatically registered based on file structure
- TypeScript is fully configured for type checking
- Icons use Ionicons from `@expo/vector-icons`

## Issue Reference

This project structure was implemented according to issue S0.4: "Navigazione Expo Router (tab + stack layout)"
