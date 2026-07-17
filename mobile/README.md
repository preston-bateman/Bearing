# Bearing Mobile App

Expo React Native mobile application for Bearing.

## Prerequisites
- Node.js 20+
- npm 10+
- Expo Go app on device or Android emulator
- macOS + Xcode only if running local iOS simulator

## Setup
1. Install dependencies:
   - npm install
2. Start dev server:
   - npx expo start
3. Run Android:
   - npx expo start --android
4. Run iOS (macOS only):
   - npx expo start --ios

## Project Structure
- app.json: Expo app metadata
- app.config.ts: environment-aware Expo config and app extras
- App.tsx: temporary app entry for M1 baseline
- src/screens: screen-level views
- src/components: shared UI primitives
- src/features: feature modules
- src/services: service and integration layer
- docs: mobile app-specific docs

## Environment Variables
Set values in your shell or environment files before running:
- EXPO_PUBLIC_APP_ENV (development, staging, production)
- EXPO_PUBLIC_FIREBASE_API_KEY
- EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN
- EXPO_PUBLIC_FIREBASE_PROJECT_ID
- EXPO_PUBLIC_FIREBASE_STORAGE_BUCKET
- EXPO_PUBLIC_FIREBASE_MESSAGING_SENDER_ID
- EXPO_PUBLIC_FIREBASE_APP_ID

Do not commit secrets.
