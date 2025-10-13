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
