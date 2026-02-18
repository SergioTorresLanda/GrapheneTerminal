import { QueryClient } from '@tanstack/react-query';
import { AppState, AppStateStatus } from 'react-native';
import { focusManager } from '@tanstack/react-query';

// 1. The Engine
export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      // The Graphene Protocol demands high freshness. 
      // Data is considered "stale" immediately, forcing background refetches.
      staleTime: 0, 
      gcTime: 1000 * 60 * 60 * 24, // Keep inactive data in memory for 24 hours
      retry: 2,
      refetchOnWindowFocus: true, // Crucial for the background -> foreground requirement
    },
  },
});

// 2. The AppState Listener (The 200ms Requirement)
// This strictly listens to the Native OS for background/foreground transitions.
// The millisecond the user brings the app back, we invalidate and refetch.
AppState.addEventListener('change', (status: AppStateStatus) => {
  focusManager.setFocused(status === 'active');
});

// TODO: Offline-First architecture, 
// `onlineManager` here to listen to the device's NetInfo (Wi-Fi/Cellular state),
// but for hackathon delivery, focus management is the primary target.