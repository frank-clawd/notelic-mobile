## Task: Notelic Mobile — Phase 0 (Scaffolding + Auth + Navigation)

Build the full project foundation for the Notelic mobile app. This is NOT a throwaway — this becomes the production codebase.

## Working Directory
`/home/jnevins/Projects/notelic-mobile/`

There is already an Expo project here from the POC. **Start fresh** — delete all POC code and reinitialize.

## Step 1: Clean Slate
1. Remove all files except `.git/` directory
2. Reinitialize: `npx create-expo-app . --template tabs` (the tabs template gives us Expo Router + tab navigation out of the box)
3. Ensure TypeScript is configured

## Step 2: Install Core Dependencies
```
npx expo install expo-secure-store expo-constants expo-linking expo-auth-session expo-web-browser
npx expo install @10play/tentap-editor
npm install zustand
```

## Step 3: File Structure
Create this structure:

```
app/
  _layout.tsx          — Root layout (auth gate: check token → show tabs or login)
  (auth)/
    _layout.tsx        — Auth stack layout
    login.tsx          — Login screen (email/password + Google OAuth button + passkey button)
    register.tsx       — Registration screen
  (tabs)/
    _layout.tsx        — Tab navigator (Notes, Capture, Settings)
    index.tsx          — Notes list screen (mock data for now)
    capture.tsx        — Quick capture screen (blank note, cursor focused)
    settings.tsx       — Settings screen (dark mode toggle, account info, sign out)
  note/
    [id].tsx           — Note editor screen (TenTap editor, placeholder for now)
src/
  api/
    client.ts          — API client base (baseURL, auth headers, error handling)
    auth.ts            — Auth API calls (login, register, refresh, google, passkey)
    notes.ts           — Notes API calls (list, get, create, update, delete, search)
    types.ts           — TypeScript types (Note, User, AuthResponse, etc.)
  stores/
    authStore.ts       — Zustand store for auth state (token, user, login/logout actions)
  components/
    NoteCard.tsx        — Note list item (title, preview, date, tags)
    SearchBar.tsx       — Search input
    TagChips.tsx        — Tag filter chips
  theme/
    colors.ts          — Color tokens (light + dark mode)
    typography.ts       — Font sizes, weights, line heights
constants/
  config.ts            — API_BASE_URL, app version, etc.
```

## Step 4: Auth Implementation
Build a complete auth flow:

1. **Auth store** (Zustand + expo-secure-store):
   - `token`, `user` state
   - `login(email, password)` — POST to `/api/auth/login`, store JWT in SecureStore
   - `register(email, password, name)` — POST to `/api/auth/register`
   - `logout()` — clear token from SecureStore
   - `restoreSession()` — check SecureStore on app launch
   - `refreshToken()` — intercept 401s, refresh, retry

2. **Login screen:**
   - Email + password fields
   - "Sign in with Google" button (expo-auth-session, placeholder — just console.log for POC)
   - "Sign in with Passkey" button (placeholder)
   - Link to register screen
   - Error display
   - Loading state during auth

3. **Root layout auth gate:**
   - On mount, call `restoreSession()`
   - If token exists and valid → show tab navigator
   - If no token → show auth stack
   - Splash/loading screen while checking

4. **API client:**
   - Base URL: `https://notelic.com/api`
   - Auto-attach JWT from auth store
   - 401 interceptor → try refresh → retry or logout
   - Consistent error handling

## Step 5: Notes List Screen
1. Mock data for now (5-10 sample notes with titles, content, tags, dates)
2. Scrollable list using FlatList
3. NoteCard component showing title, preview text, date, tags
4. Tap card → navigate to `note/[id]`
5. Search bar at top (visual only, no backend yet)
6. Pull-to-refresh gesture

## Step 6: Quick Capture Screen
1. Simple text input, auto-focused on mount
2. "Save" button → console.log for now
3. Placeholder for future TenTap integration

## Step 7: Settings Screen
1. Account info section (email from auth store)
2. Dark mode toggle (store preference in AsyncStorage)
3. Notification preferences (placeholder)
4. Sign out button → calls authStore.logout()
5. App version display

## Step 8: Theming
1. Light and dark color schemes in `src/theme/colors.ts`
2. Use React Navigation's theme system
3. Dark mode toggle in settings persists to AsyncStorage
4. All components use theme colors (no hardcoded values)

## Step 9: Editor Screen (Placeholder)
1. `note/[id].tsx` — receives note ID from params
2. Shows note title (editable) and content area
3. Placeholder for TenTap — just show "Editor will go here" with note data
4. Auto-save indicator (visual only)

## Style Guidelines
- Clean, minimal design — inspired by Bear/Apollo/Things
- 16px base font size
- Generous padding (16px horizontal)
- Card-based note list with subtle shadows
- Smooth transitions between screens
- System font (no custom fonts in v1)

## Git
- Branch: `feat/phase0-scaffolding-auth`
- Commit: `feat: Phase 0 — project scaffolding, auth, navigation, theming`
- Push to origin

## Success Criteria
- `npx expo start` runs cleanly
- Can navigate between all screens via tabs
- Login/register forms render and call API (will fail without real credentials — that's OK)
- Auth gate works: logged out → login screen, logged in → tabs
- Dark mode toggle works and persists
- Notes list shows mock data
- TypeScript compiles with zero errors
- No external native modules beyond what Expo provides
