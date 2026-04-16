import { api } from './client';
import type { MeResponse } from './types';

interface LoginResponse {
  success: boolean;
  user: {
    id: string;
    email: string;
    displayName: string;
  };
  requiresTOTP?: boolean;
  totpToken?: string;
}

interface RegisterResponse {
  success: boolean;
  user: {
    id: string;
    email: string;
    displayName: string;
  };
}

export const authApi = {
  // Password login — sets session cookie on success
  login: (email: string, password: string) =>
    api.post<LoginResponse>('/auth/login/password', { email, password }),

  // TOTP verification after password login returns requiresTOTP
  verifyTotp: (totpToken: string, code: string) =>
    api.post<LoginResponse>('/auth/login/totp', { totpToken, code }),

  // Passkey login step 1 — get authentication options
  passkeyStart: () =>
    api.post<{ options: any }>('/auth/login/options', {}),

  // Passkey login step 2 — verify assertion
  passkeyVerify: (credential: any) =>
    api.post<LoginResponse>('/auth/login/passkey/verify', credential),

  // Register with password
  register: (email: string, password: string, displayName: string) =>
    api.post<RegisterResponse>('/auth/register/with-password', { email, password, displayName }),

  // Get current user profile (validates session)
  getProfile: () => api.get<MeResponse>('/auth/me'),
};
