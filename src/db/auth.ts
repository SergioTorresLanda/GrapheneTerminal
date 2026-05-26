import { create } from 'zustand';

interface AuthState {
  isAuthenticated: boolean;
  user: { email: string; id: string } | null;
  // Actions
  signIn: (email: string) => void;
  signOut: () => void;
}

/**
 * ARCHITECT NOTE: We use a flat store structure. 
 * Zustand lives outside the React lifecycle, so the state is 
 * preserved even if the UI components unmount/remount.
 */
export const useAuthStore = create<AuthState>((set) => ({
  isAuthenticated: false,
  user: null,

  signIn: (email) => {
    // Dummy logic: In production, this would be a TurboModule call or SecureStore write
    set({ 
      isAuthenticated: true, 
      user: { email, id: 'uuid-graphene-1' } 
    });
  },

  signOut: () => {
    set({ isAuthenticated: false, user: null });
  },
}));

//notice the use of a "selector-ready" structure to minimize memory leaks and unnecessary re-computations.