# Backend Structure

This folder contains the backend service.

Recommended Node.js stack (suggested): Express + Prisma/Mongoose + JWT + Zod + Jest/Supertest.

## Folders

- src/
  - config/ # Env, constants, app config
  - db/ # Database client/connection setup
  - middlewares/ # Auth, validation, error handlers
  - models/ # ORM/ODM models or schema definitions
  - controllers/ # Route handlers (business orchestration)
  - services/ # Business/domain logic
  - routes/ # API routes, mount per resource
  - utils/ # Helpers, shared utilities
- tests/ # Unit/integration tests
- scripts/ # DB seeders, maintenance scripts
- logs/ # App logs (gitignored in practice)
- tmp/ # Temporary files (gitignored in practice)

## Next steps

1. Initialize the project and add dependencies:
   - express, cors, dotenv, zod, jsonwebtoken, bcryptjs
   - dev: nodemon, eslint, jest, supertest, ts-node + typescript (if using TS)
2. Create `src/index.ts|js` to bootstrap the server and `src/routes/index.ts|js` to mount routes.
3. Add `.env` (see `.env.example`) and a `src/config/env.ts|js` loader.
4. Pick a database (PostgreSQL/MySQL with Prisma, or MongoDB with Mongoose) and wire `src/db/`.
5. Add a global error handler in `src/middlewares/` and basic health route.

### Feature flags

- Centralized in `src/config/featureFlags.ts|js`.
- To enable "GPT-5 mini for all clients", set `FEATURE_GPT5_MINI_ENABLED=true` in `.env`.

If you want, I can scaffold the server with Express, a healthcheck route and starter config in one go.

## Social login (Google/Microsoft)

Endpoints added:

- GET `/api/auth/google/start` -> redirige a Google
- GET `/api/auth/google/callback` -> procesa el código y redirige a `${FRONTEND_BASE_URL}/auth/callback?u=...`
- GET `/api/auth/microsoft/start` -> redirige a Microsoft
- GET `/api/auth/microsoft/callback` -> procesa el código y redirige a `${FRONTEND_BASE_URL}/auth/callback?u=...`

Variables de entorno necesarias (ver `.env.example`):

- `FRONTEND_BASE_URL` (por ejemplo: http://localhost:5173)
- Google: `GOOGLE_CLIENT_ID`, `GOOGLE_CLIENT_SECRET`, opcional `GOOGLE_REDIRECT_URI`
- Microsoft: `MICROSOFT_TENANT` (p.ej. `common`), `MICROSOFT_CLIENT_ID`, `MICROSOFT_CLIENT_SECRET`, opcional `MICROSOFT_REDIRECT_URI`

Redirecciones locales por defecto:

- Google: `http://localhost:3000/api/auth/google/callback`
- Microsoft: `http://localhost:3000/api/auth/microsoft/callback`

Configura tus aplicaciones en Google Cloud Console y Microsoft Entra ID con esas URLs, y usa el botón en el frontend para iniciar sesión.
