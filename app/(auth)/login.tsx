import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  Pressable,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  Alert,
} from 'react-native';
import { useRouter } from 'expo-router';
import Colors from '@/constants/Colors';
import { useColorScheme } from '@/components/useColorScheme';
import { useAuthStore } from '@/stores/authStore';
import { useGoogleAuth } from '@/api/google-auth';

export default function LoginScreen() {
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? 'light'];
  const router = useRouter();
  const { login, verifyTotp, isLoading, pendingTotpToken } = useAuthStore();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [totpCode, setTotpCode] = useState('');
  const [error, setError] = useState('');
  const { promptAsync: googleSignIn, isLoading: googleLoading } = useGoogleAuth();
  const totpRef = useRef<TextInput>(null);

  useEffect(() => {
    if (pendingTotpToken) {
      totpRef.current?.focus();
    }
  }, [pendingTotpToken]);

  const handleLogin = async () => {
    if (!email || !password) {
      setError('Please fill in all fields');
      return;
    }
    try {
      setError('');
      await login(email, password);
    } catch (err: any) {
      setError(err.message || 'Login failed');
    }
  };

  const handleTotp = async () => {
    if (!totpCode || totpCode.length < 6) {
      setError('Enter your 6-digit code');
      return;
    }
    try {
      setError('');
      await verifyTotp(totpCode);
    } catch (err: any) {
      setError(err.message || 'Invalid code');
      setTotpCode('');
    }
  };

  const handleGoogleSignIn = async () => {
    try {
      setError('');
      await googleSignIn();
    } catch (err: any) {
      setError(err.message || 'Google sign-in failed');
    }
  };

  const handlePasskey = () => {
    Alert.alert(
      'Passkeys',
      'Passkey login requires a native app build. It will be available when Notelic launches on the App Store.',
      [{ text: 'OK' }]
    );
  };

  // TOTP verification screen
  if (pendingTotpToken) {
    return (
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={[styles.container, { backgroundColor: colors.background }]}
      >
        <View style={styles.content}>
          <Text style={[styles.title, { color: colors.text }]}>Two-Factor Auth</Text>
          <Text style={[styles.subtitle, { color: colors.secondaryText }]}>
            Enter the code from your authenticator app
          </Text>

          {error ? <Text style={[styles.error, { color: colors.error }]}>{error}</Text> : null}

          <TextInput
            ref={totpRef}
            style={[styles.input, styles.totpInput, { backgroundColor: colors.inputBackground, color: colors.text, borderColor: colors.border }]}
            placeholder="000000"
            placeholderTextColor={colors.secondaryText}
            value={totpCode}
            onChangeText={(text) => {
              setTotpCode(text.replace(/[^0-9]/g, '').slice(0, 6));
              setError('');
            }}
            keyboardType="number-pad"
            maxLength={6}
            autoFocus
          />

          <Pressable
            style={[styles.button, { backgroundColor: colors.tint, opacity: isLoading ? 0.7 : 1 }]}
            onPress={handleTotp}
            disabled={isLoading}
          >
            <Text style={styles.buttonText}>
              {isLoading ? 'Verifying...' : 'Verify'}
            </Text>
          </Pressable>
        </View>
      </KeyboardAvoidingView>
    );
  }

  // Login screen
  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={[styles.container, { backgroundColor: colors.background }]}
    >
      <View style={styles.content}>
        <Text style={[styles.title, { color: colors.text }]}>Welcome back</Text>
        <Text style={[styles.subtitle, { color: colors.secondaryText }]}>
          Sign in to your Notelic account
        </Text>

        {error ? <Text style={[styles.error, { color: colors.error }]}>{error}</Text> : null}

        <Pressable
          style={[styles.oauthButton, { borderColor: colors.border }]}
          onPress={handleGoogleSignIn}
          disabled={googleLoading}
        >
          <Text style={[styles.oauthText, { color: colors.text }]}>
            {googleLoading ? 'Opening Google...' : 'G  Sign in with Google'}
          </Text>
        </Pressable>

        <Pressable
          style={[styles.oauthButton, { borderColor: colors.border }]}
          onPress={handlePasskey}
        >
          <Text style={[styles.oauthText, { color: colors.text }]}>🔑 Sign in with Passkey</Text>
        </Pressable>

        <View style={[styles.divider, { borderBottomColor: colors.border }]}>
          <Text style={[styles.dividerText, { color: colors.secondaryText }]}>or</Text>
        </View>

        <TextInput
          style={[styles.input, { backgroundColor: colors.inputBackground, color: colors.text, borderColor: colors.border }]}
          placeholder="Email"
          placeholderTextColor={colors.secondaryText}
          value={email}
          onChangeText={setEmail}
          autoCapitalize="none"
          keyboardType="email-address"
          autoCorrect={false}
        />

        <TextInput
          style={[styles.input, { backgroundColor: colors.inputBackground, color: colors.text, borderColor: colors.border }]}
          placeholder="Password"
          placeholderTextColor={colors.secondaryText}
          value={password}
          onChangeText={setPassword}
          secureTextEntry
        />

        <Pressable
          style={[styles.button, { backgroundColor: colors.tint, opacity: isLoading ? 0.7 : 1 }]}
          onPress={handleLogin}
          disabled={isLoading}
        >
          <Text style={styles.buttonText}>
            {isLoading ? 'Signing in...' : 'Sign In'}
          </Text>
        </Pressable>

        <Pressable onPress={() => router.push('/register')}>
          <Text style={[styles.link, { color: colors.tint }]}>
            Don&apos;t have an account? Sign up
          </Text>
        </Pressable>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    paddingHorizontal: 32,
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
    marginBottom: 6,
  },
  subtitle: {
    fontSize: 16,
    marginBottom: 24,
  },
  error: {
    fontSize: 14,
    marginBottom: 16,
    paddingVertical: 8,
  },
  divider: {
    borderBottomWidth: 1,
    marginBottom: 20,
    marginTop: 12,
    alignItems: 'center',
  },
  dividerText: {
    position: 'absolute',
    top: -10,
    backgroundColor: 'transparent',
    paddingHorizontal: 12,
    fontSize: 14,
  },
  input: {
    height: 50,
    borderRadius: 12,
    paddingHorizontal: 16,
    fontSize: 16,
    marginBottom: 14,
    borderWidth: 1,
  },
  totpInput: {
    textAlign: 'center',
    fontSize: 24,
    letterSpacing: 8,
    fontWeight: '600',
  },
  button: {
    height: 50,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 8,
    marginBottom: 16,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  oauthButton: {
    height: 50,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    marginBottom: 10,
  },
  oauthText: {
    fontSize: 16,
    fontWeight: '500',
  },
  link: {
    fontSize: 14,
    textAlign: 'center',
    marginTop: 16,
  },
});
