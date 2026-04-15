import { create } from 'zustand';
import * as SecureStore from 'expo-secure-store';
import { authApi } from '@/api/auth';
import type { User, TokenPair } from '@/api/types';

interface AuthState {
  user: User | null;
  tokenPair: TokenPair | null;
  isLoading: boolean;
  isInitialized: boolean;

  login: (email: string, password: string) => Promise<void>;
  register: (email: string, password: string, name: string) => Promise<void>;
  logout: () => Promise<void>;
  restoreSession: () => Promise<void>;
  setUser: (user: User) => void;
}

const TOKEN_KEY = 'notelic_auth_token';

// Non-reactive token access for API client
let _currentToken: TokenPair | null = null;
export function getToken() {
  return _currentToken;
}
export function setToken(pair: TokenPair) {
  _currentToken = pair;
}
export function clearToken() {
  _currentToken = null;
}

export const useAuthStore = create<AuthState>((set, get) => ({
  user: null,
  tokenPair: null,
  isLoading: false,
  isInitialized: false,

  login: async (email: string, password: string) => {
    set({ isLoading: true });
    try {
      const res = await authApi.login(email, password);
      _currentToken = { token: res.token, refreshToken: res.refreshToken };
      await SecureStore.setItemAsync(TOKEN_KEY, JSON.stringify(_currentToken));
      set({ user: res.user, tokenPair: _currentToken, isLoading: false });
    } catch (error) {
      set({ isLoading: false });
      throw error;
    }
  },

  register: async (email: string, password: string, name: string) => {
    set({ isLoading: true });
    try {
      const res = await authApi.register(email, password, name);
      _currentToken = { token: res.token, refreshToken: res.refreshToken };
      await SecureStore.setItemAsync(TOKEN_KEY, JSON.stringify(_currentToken));
      set({ user: res.user, tokenPair: _currentToken, isLoading: false });
    } catch (error) {
      set({ isLoading: false });
      throw error;
    }
  },

  logout: async () => {
    _currentToken = null;
    await SecureStore.deleteItemAsync(TOKEN_KEY);
    set({ user: null, tokenPair: null });
  },

  restoreSession: async () => {
    try {
      const stored = await SecureStore.getItemAsync(TOKEN_KEY);
      if (!stored) {
        set({ isInitialized: true });
        return;
      }
      const pair: TokenPair = JSON.parse(stored);
      _currentToken = pair;
      set({ tokenPair: pair });
      // Validate token by fetching profile
      try {
        const user = await authApi.getProfile();
        set({ user, isInitialized: true });
      } catch {
        // Token invalid — clear it
        _currentToken = null;
        await SecureStore.deleteItemAsync(TOKEN_KEY);
        set({ tokenPair: null, user: null, isInitialized: true });
      }
    } catch {
      set({ isInitialized: true });
    }
  },

  setUser: (user: User) => set({ user }),
}));
