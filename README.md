# React + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Babel](https://babeljs.io/) for Fast Refresh
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/) for Fast Refresh

## Authentication and API handling

The application now includes a simple JWT-based authentication flow with separation of concerns to make the codebase easier to read and maintain.

Authentication logic lives in `src/services/authService.js`:

- helpers for `login`, `register`, `logout`
- token/user storage helpers and axios header management
- keeping API details out of components makes it trivial to switch libraries or add features (refresh tokens, cookie storage, etc.)

The `AuthContext`/`useAuth` hook wraps those services and exposes the state to React components. Components (like `AuthPage`, `Header`, `ProtectedRoute`) only call `login`, `register`, `logout` from the hook and read `isAuthenticated`/`user`—no axios calls or localStorage shenanigans spread across the app.

Protected routes (home, checkout, orders, tracking) use a small `ProtectedRoute` component that redirects unauthenticated users to `/`.

- **API endpoints:**
  - `POST /api/UserAuth/register`
  - `POST /api/UserAuth/login`
  - Both should return `{ token, user }`.

On successful authentication the user is sent to `/home`. The header updates to show orders/cart links and a logout button; the JWT is automatically added to all subsequent requests. Token persistence across refreshes is handled by reading from `localStorage` during provider initialization.

## Expanding the ESLint configuration

If you are developing a production application, we recommend using TypeScript with type-aware lint rules enabled. Check out the [TS template](https://github.com/vitejs/vite/tree/main/packages/create-vite/template-react-ts) for information on how to integrate TypeScript and [`typescript-eslint`](https://typescript-eslint.io) in your project.
