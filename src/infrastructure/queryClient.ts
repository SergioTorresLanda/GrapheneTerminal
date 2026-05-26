import { QueryClient, focusManager, onlineManager } from '@tanstack/react-query';
import { AppState, AppStateStatus } from 'react-native';
import NetInfo from '@react-native-community/netinfo';

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5, // Let's set 5 mins for history (less volatile than ticks)
      gcTime: 1000 * 60 * 60 * 24,
      retry: (failureCount, error: any) => {
        // Don't retry if it's a 404 (Auth/Logic error), only on network drops
        if (error?.status === 404) return false;
        return failureCount < 2;
      },
    },
  },
});

// Sync with Network State
onlineManager.setEventListener((setOnline) => {
  return NetInfo.addEventListener((state) => {
    setOnline(!!state.isConnected);
  });
});

// Sync with App Focus
AppState.addEventListener('change', (status: AppStateStatus) => {
  focusManager.setFocused(status === 'active');
});