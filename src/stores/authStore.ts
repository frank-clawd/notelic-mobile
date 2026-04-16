import { create } from 'zustand';
import * as SecureStore from 'expo-secure-store';
import { authApi } from '@/api/auth';
import type { User } from '@/api/types';

interface AuthState {
  user: User | null;
  isLoading: boolean;
  isInitialized: boolean;
  pendingTotpToken: string | null;

  login: (email: string, password: string) => Promise<void>;
  verifyTotp: (code: string) => Promise<void>;
  register: (email: string, password: string, name: string) => Promise<void>;
  logout: () => Promise<void>;
  restoreSession: () => Promise<void>;
  setUser: (user: User) => void;
}

const SESSION_KEY = 'notelic_session_active';

export const useAuthStore = create<AuthState>((set, get) => ({
  user: null,
  isLoading: false,
  isInitialized: false,
  pendingTotpToken: null,

  login: async (email: string, password: string) => {
    set({ isLoading: true });
    try {
      const res = await authApi.login(email, password);
      if (res.requiresTOTP && res.totpToken) {
        set({ pendingTotpToken: res.totpToken, isLoading: false });
        return;
      }
      if (res.token) await SecureStore.setItemAsync(SESSION_KEY, res.token);
      set({
        user: {
          id: res.user.id,
          email: res.user.email,
          name: res.user.displayName,
          plan: 'free',
          createdAt: new Date().toISOString(),
        },
        isLoading: false,
      });
    } catch (error) {
      set({ isLoading: false });
      throw error;
    }
  },

  verifyTotp: async (code: string) => {
    const { pendingTotpToken } = get();
    if (!pendingTotpToken) throw new Error('No pending TOTP session');
    set({ isLoading: true });
    try {
      const res = await authApi.verifyTotp(pendingTotpToken, code);
      if (res.token) await SecureStore.setItemAsync(SESSION_KEY, res.token);
      set({
        user: {
          id: res.user.id,
          email: res.user.email,
          name: res.user.displayName,
          plan: 'free',
          createdAt: new Date().toISOString(),
        },
        pendingTotpToken: null,
        isLoading: false,
      });
    } catch (error) {
      set({ isLoading: false });
      throw error;
    }
  },

  register: async (email: string, password: string, name: string) => {
    set({ isLoading: true });
    try {
      const res = await authApi.register(email, password, name);
      await SecureStore.setItemAsync(SESSION_KEY, 'true');
      set({
        user: {
          id: res.user.id,
          email: res.user.email,
          name: res.user.displayName,
          plan: 'free',
          createdAt: new Date().toISOString(),
        },
        isLoading: false,
      });
    } catch (error) {
      set({ isLoading: false });
      throw error;
    }
  },

  logout: async () => {
    await SecureStore.deleteItemAsync(SESSION_KEY);
    set({ user: null });
  },

  restoreSession: async () => {
    try {
      const hasSession = await SecureStore.getItemAsync(SESSION_KEY);
      if (!hasSession) {
        set({ isInitialized: true });
        return;
      }
      // Validate session by fetching profile
      const profile = await authApi.getProfile();
      set({
        user: {
          id: profile.user.id,
          email: profile.user.email,
          name: profile.user.displayName,
          plan: profile.user.plan || 'free',
          createdAt: new Date().toISOString(),
        },
        isInitialized: true,
      });
    } catch {
      // Session invalid
      await SecureStore.deleteItemAsync(SESSION_KEY);
      set({ user: null, isInitialized: true });
    }
  },

  setUser: (user: User) => set({ user }),
}));
