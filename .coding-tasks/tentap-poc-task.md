## Task
Build a TenTap (10tap-editor) proof-of-concept React Native app using Expo. This is a throwaway POC to validate that TenTap works well enough for a future Notelic mobile app. The app does NOT need to connect to any backend.

### Must-haves:
1. Initialize Expo project with TypeScript template
2. Install and configure TenTap editor (`@10play/10tap-editor`)
3. Single screen with a TenTap rich text editor
4. Editor toolbar with: bold, italic, heading, bullet list, task list (checklist)
5. Checklist items must be toggleable (checkbox tap)
6. App must build and run without errors on iOS simulator (`npx expo start`)

### Nice-to-haves (if time allows):
- Draggable checklist reordering via `react-native-draggable-flatlist`
- Dark mode toggle
- A second "note list" screen with mock data

## Project Conventions
New project — no existing conventions. Use:
- TypeScript throughout
- Expo managed workflow
- Functional components with hooks
- Clean file structure under `app/` and `src/`

## What Stays the Same
N/A — new project

## Not in Scope
- Backend connection / API integration
- Authentication
- Offline support
- App Store / Play Store builds
- Any production-ready features

## Success Criteria
- `npx expo start` launches without errors
- Editor renders with a toolbar
- Can type, bold, italicize, create headings
- Can create checklist items and toggle them
- No TypeScript errors

## Git Standards
- Initialize git repo
- Single commit: `feat: tentap poc - basic rich text editor with checklist support`
- Push to GitHub repo `justinnevins/notelic-mobile` (create if needed)
