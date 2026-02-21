# Habit Tracker

A mobile habit tracking app built with Expo and React Native. Create daily habits, mark them complete, and track your streaks with a visual heatmap.

Built by [![YouTube](https://img.shields.io/badge/Code%20With%20Nomi-FF0000?style=flat&logo=youtube&logoColor=white)](https://www.youtube.com/@codewithnomi) [![X](https://img.shields.io/badge/@codewithnomi__-000000?style=flat&logo=x&logoColor=white)](https://x.com/codewithnomi_) - follow along for the full tutorial and more React Native content.

## Features

- **Today View** - See all your habits for the day with a progress bar. Tap to mark habits as complete.
- **Add Habits** - Create habits with a custom name, SF Symbol icon, and color. Live preview as you build.
- **Streak Tracking** - Track per-habit and overall "perfect day" streaks (all habits completed).
- **Heatmap** - Visual 7-week heatmap showing your daily completion history.
- **Haptic Feedback** - Tactile feedback on iOS when adding habits.
- **Persistent Storage** - Data stored locally via `expo-sqlite` localStorage, no account required.
- **Animations** - Smooth entry animations and layout transitions with `react-native-reanimated`.

## Tech Stack

- [Expo](https://expo.dev) (SDK 54)
- [Expo Router](https://docs.expo.dev/router/introduction/) (file-based routing with native tabs)
- [React Native Reanimated](https://docs.swmansion.com/react-native-reanimated/)
- [expo-sqlite](https://docs.expo.dev/versions/latest/sdk/sqlite/) (localStorage polyfill for persistence)
- [expo-symbols](https://docs.expo.dev/versions/latest/sdk/symbols/) (SF Symbols for icons)
- [expo-haptics](https://docs.expo.dev/versions/latest/sdk/haptics/)
- TypeScript with React Compiler enabled

## Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/) (LTS recommended)
- [Expo CLI](https://docs.expo.dev/get-started/set-up-your-environment/)
- iOS Simulator (macOS) or Android Emulator, or a physical device with [Expo Go](https://expo.dev/go)

### Installation

1. Clone the repository

   ```bash
   git clone <your-repo-url>
   cd habit-tracker
   ```

2. Install dependencies

   ```bash
   npm install
   ```

3. Start the development server

   ```bash
   npx expo start
   ```

4. Open the app on your device or emulator:
   - Press `i` for iOS Simulator
   - Press `a` for Android Emulator
   - Scan the QR code with Expo Go on a physical device

## Project Structure

```
app/
  _layout.tsx          # Root layout with native tab navigation (Today + Streaks)
  (home)/
    _layout.tsx        # Home tab stack layout
    index.tsx          # Today screen - habit list with progress bar
    add-habit.tsx      # Add new habit form with icon/color pickers
  (streaks)/
    _layout.tsx        # Streaks tab stack layout
    index.tsx          # Streaks screen - heatmap and streak cards
components/
  habit-card.tsx       # Individual habit row with completion toggle
  heatmap.tsx          # 7-week visual heatmap grid
  streak-card.tsx      # Per-habit streak display
  icon-picker.tsx      # SF Symbol icon selector
  color-picker.tsx     # Color selector
hooks/
  use-storage.ts       # Custom hook for reactive localStorage access
utils/
  storage.ts           # localStorage wrapper with caching and subscriptions
  habits.ts            # Habit types, date helpers, and icon/color constants
```
