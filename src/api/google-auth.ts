import * as Google from 'expo-auth-session/providers/google';
import * as WebBrowser from 'expo-web-browser';
import { makeRedirectUri } from 'expo-auth-session';
import * as SecureStore from 'expo-secure-store';
import { useEffect } from 'react';
import { useAuthStore } from '@/stores/authStore';

WebBrowser.maybeCompleteAuthSession();

const GOOGLE_CLIENT_ID = '539876364851-d4jveolfgfult42vhsivv1fcj4sd4tp1.apps.googleusercontent.com';

export function useGoogleAuth() {
  const [request, response, promptAsync] = Google.useAuthRequest(
    {
      clientId: GOOGLE_CLIENT_ID,
      scopes: ['email', 'profile'],
    },
    {
      redirectUri: makeRedirectUri({
        scheme: 'notelicmobile',
      }),
    }
  );

  useEffect(() => {
    if (response?.type === 'success' && response.authentication?.accessToken) {
      exchangeGoogleToken(response.authentication.accessToken);
    }
  }, [response]);

  return { promptAsync, isLoading: !request };
}

async function exchangeGoogleToken(accessToken: string) {
  try {
    const existingToken = await SecureStore.getItemAsync('notelic_session_active');
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
    };
    if (existingToken && existingToken !== 'true') {
      headers['X-Session-Token'] = existingToken;
    }

    // Send Google access token to our server to create a session
    const res = await fetch('https://notelic.com/auth/google/mobile', {
      method: 'POST',
      headers,
      credentials: 'include',
      body: JSON.stringify({ accessToken }),
    });

    if (!res.ok) {
      const body = await res.json().catch(() => ({}));
      throw new Error(body.error || 'Google sign-in failed');
    }

    const data = await res.json();
    if (data.token) await SecureStore.setItemAsync('notelic_session_active', data.token);
    useAuthStore.setState({
      user: {
        id: data.user.id,
        email: data.user.email,
        name: data.user.displayName,
        plan: 'free',
        createdAt: new Date().toISOString(),
      },
    });
  } catch (err: any) {
    console.error('Google auth exchange failed:', err);
    throw err;
  }
}
