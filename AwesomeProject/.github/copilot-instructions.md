## Copilot / AI Agent Instructions for AwesomeProject

Purpose: give an AI coding agent the minimal, actionable context to be immediately productive in this repo.

1) Big-picture architecture
- Mobile app: React Native TypeScript app at repository root. Entry: [App.tsx](App.tsx). Navigation and screens live under `core/`:
  - `core/navigations/*` — navigation containers and stacks (see [core/navigations/stack.tsx](core/navigations/stack.tsx)).
  - `core/src/*` — screen components (e.g. `SocketTest.tsx`, `onBoard.tsx`, `logIn.tsx`).
  - `core/auth/AuthContext.tsx` — single source of auth state using `@react-native-async-storage/async-storage` and exported `useAuth()` hook.

- Backend dev helper: `nomnom-socket-server/` — an express + Socket.IO dev server that also contains hardcoded SQL Server config (`nomnom-socket-server/server.js`). The RN app's socket client points to `http://10.0.2.2:3000` for Android emulator (see [core/src/SocketTest.tsx](core/src/SocketTest.tsx)).

2) Key integration points & data flows
- Auth: `AuthContext` persists a single user under the key `@nomnom_user` in AsyncStorage. Sign-in / sign-up are synchronous functions that read/write this key — changing this affects most auth flows.
- Navigation: Root stack defined in `core/navigations/stack.tsx`. Keep only `Stack.Screen`, `Group`, or similar components in the stack file (author comment enforces this pattern).
- Socket I/O: client uses `socket.io-client` (`core/src/SocketTest.tsx`). On Android emulator use `10.0.2.2`. The server listens on port `3000` in `nomnom-socket-server/server.js` and exposes REST endpoints like `/recipes` that query SQL Server.

3) Developer workflows & commands
- Start Metro: `npm start` (root). Build/run Android: `npm run android`. iOS: `npm run ios` (requires CocoaPods and macOS). Tests: `npm test`. Lint: `npm run lint`.
- Socket server (local dev):
  - Install: `cd nomnom-socket-server && npm install`
  - Run: `node server.js` (server logs show SQL connection attempts and Socket.IO events).
- Emulator networking: remember Android emulator -> host machine is `10.0.2.2`. For a physical device, replace with LAN IP (e.g. `http://192.168.x.x:3000`).

4) Project-specific conventions and patterns
- Minimal local auth: the project stores a single registered user and password in AsyncStorage (see `STORAGE_KEY` in `core/auth/AuthContext.tsx`). Don't assume a remote auth API unless adding one intentionally.
- TypeScript + React Native: most files are TSX. Follow existing typing patterns (e.g. `RootStackParamList` in `core/navigations/stack.tsx`).
- Comments contain Vietnamese notes and developer hints (preserve or ask before removing).
- UI/navigation transitions are centralized in `stack.tsx` (transitionSpec, cardStyleInterpolator). If changing animation behavior, update there.

5) External dependencies to be aware of
- `socket.io-client` in the mobile app and `socket.io` in the dev server — protocol versions align in package.jsons.
- `mssql` and an on-premises SQL Server are referenced by `nomnom-socket-server/server.js` (dbConfig hard-coded). Agents should not change credentials; prefer adding env var support if instructed.
- React Navigation v7 and associated packages (`@react-navigation/native`, `stack`, `bottom-tabs`).

6) Safe edit guidelines for AI agents (project-specific)
- Make minimal, focused changes. Respect `AuthContext` storage semantics — altering the storage key or shape breaks auth across the app.
- When touching socket code, maintain the emulator/LAN switch comment pattern in `core/src/SocketTest.tsx` so developers know where to change the URL.
- Do not change SQL credentials in `nomnom-socket-server/server.js` without explicit instruction; instead add environment variable support and keep defaults as a non-breaking change.
- Keep navigation declarations inside `core/navigations/stack.tsx`; avoid moving screens out of the stack without updating the stack file.

7) Helpful file references
- App entry: [App.tsx](App.tsx)
- Auth: [core/auth/AuthContext.tsx](core/auth/AuthContext.tsx)
- Navigation: [core/navigations/stack.tsx](core/navigations/stack.tsx) and [core/navigations/index.tsx](core/navigations/index.tsx)
- Socket client example: [core/src/SocketTest.tsx](core/src/SocketTest.tsx)
- Backend server: [nomnom-socket-server/server.js](nomnom-socket-server/server.js)
- Root scripts: [package.json](package.json)

If anything in these notes is unclear or you want me to expand a particular section (e.g., auth flow code paths, SQL schemas, or test setup), tell me which area to expand and I'll update this file.
