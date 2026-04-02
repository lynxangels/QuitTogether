# QuitTogether — React Native + Expo

## Quick Start

```bash
# 1. Install dependencies
npm install

# 2. Start Expo dev server
npx expo start

# 3. Scan QR code with Expo Go app on your phone
```

## Screens
- **Home** (`app/(tabs)/index.tsx`) — Timer, tree, stats, companion card
- **Statistics** (`app/(tabs)/statistics.tsx`) — Calendar + craving history per hari
- **Companion** (`app/(tabs)/companion.tsx`) — My companion + empty state
- **Profile** (`app/(tabs)/profile.tsx`) — Data pribadi, kebiasaan merokok, referral code

## FAB "I'm Craving"
Tombol hijau di tengah bottom nav — membuka 6-step craving flow modal (global, ada di semua screen).
