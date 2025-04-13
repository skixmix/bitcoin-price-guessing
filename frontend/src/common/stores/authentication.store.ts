import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface AuthenticationState {
    isAuthenticated: boolean;
    setAuthenticated: (authStatus: boolean) => void;
}

export const useAuthStore = create<AuthenticationState>()(
    persist(
        (set) => ({
            isAuthenticated: false,
            setAuthenticated: (authStatus: boolean) => set({ isAuthenticated: authStatus }),
        }),
        {
            name: 'auth-storage',
        },
    ),
);
