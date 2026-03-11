# Hono Base Monorepo

Monorepo with shared packages (`@repo/auth`, `@repo/db`, `@repo/config`, `@repo/mail`) and apps sharing a central database and authentication.

## Setup

1. Copy `.env.example` to `.env` at the repo root and fill in values.
2. `pnpm install`
3. `pnpm build`

## Scripts (from root)

### Build
| Script | Description |
|--------|-------------|
| `pnpm build` | Build all packages and apps |
| `pnpm build:backend-api` | Build backend-api and its dependencies |

### Development
| Script | Description |
|--------|-------------|
| `pnpm dev` | Run all apps in dev mode (watch) |
| `pnpm dev:backend-api` | Run backend-api in dev mode |
| `pnpm dev:app` | Run specific app: `APP=backend-api pnpm dev:app` |

### Production
| Script | Description |
|--------|-------------|
| `pnpm start` | Start all built apps |
| `pnpm start:backend-api` | Start backend-api |
| `pnpm start:app` | Start specific app: `APP=backend-api pnpm start:app` |

### Database (central – shared across apps)
| Script | Description |
|--------|-------------|
| `pnpm db:generate` | Generate Drizzle migrations from schema |
| `pnpm db:migrate` | Run migrations from `packages/db/drizzle/` |
| `pnpm db:push` | Push schema to DB (dev only, no migration files) |
| `pnpm db:studio` | Open Drizzle Studio |
| `pnpm db:migrate:revert` | Drop migration file (interactive; DB rollback is manual) |

### Auth
| Script | Description |
|--------|-------------|
| `pnpm auth:generate` | Generate Better Auth schema → `packages/db/src/schema/external/auth-schema.ts` |

## Package layout

- **`@repo/db`** – Drizzle client, schema, migrations. Central point for DB.
- **`@repo/auth`** – Better Auth config. Schema generation via `auth-cli.config.ts`.
- **`@repo/config`** – Validated env from root `.env` (single schema for all apps).
- **`@repo/mail`** – Transactional email.

DB and auth scripts use root `.env`.
