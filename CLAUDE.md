# CLAUDE.md

Guidance for Claude Code (claude.ai/code) when working with AppHub.

---

## Project Overview

**AppHub** is a full-stack job search management tool. It's a monorepo with separate client and server packages.

---

## Change Philosophy

This is an unfinished pet project. Preserve the existing product concept and architecture.

When fixing existing functionality:
- Prefer the smallest correct change.
- Preserve existing behavior unless it is clearly incorrect.
- Do not refactor unrelated code.
- Do not introduce new abstractions without a concrete need.
- Do not replace an existing pattern simply because another pattern is considered more modern.

Before making architectural changes:
1. Identify the concrete problem with the current approach.
2. Explain the consequences of keeping it.
3. Propose the alternative.
4. Wait for explicit approval before implementing the architectural change.

When there are multiple valid solutions, prefer the one that is:
- simpler
- consistent with the existing codebase
- easier to understand
- easier to maintain
- smaller in scope

---

## Commands

```bash
npm install              # Install all dependencies
npm start                # Start everything: client, server, worker
npm run infra:up         # Start Docker containers (Redis)
```

Individual services:

```bash
npm run start:client     # React dev server on http://localhost:5173
npm run start:server     # Express server on http://localhost:5000
npm run start:worker     # Bull job worker
```

Build:

```bash
cd client && npm run build
cd server && npm run build
```

---

## Conventions

### Code Style

* Use TypeScript for all new code.
* Follow the existing code style and patterns in surrounding files.
* Prefer clear, simple implementations over unnecessary abstractions.
* Avoid `any` unless there is a specific reason.
* Reuse existing components, helpers, services, and utilities before creating new ones.

### Naming

* Use `camelCase` for variables, functions, and methods.
* Use `PascalCase` for React components, classes, and TypeScript types/interfaces.
* Follow existing naming conventions for files and folders.
* Keep names descriptive and consistent with existing domain terminology.

### Backend

* Follow the `router → controller → service` pattern.
* Keep business logic in services, not routers.
* Controllers should handle HTTP concerns and delegate business logic to services.
* Use existing Sequelize models and associations when working with the database.
* Do not introduce a different database access pattern without a clear reason.

### Frontend

* Organize new functionality by feature/domain.
* Use RTK Query for server state and API communication.
* Use Redux slices only for client-side state that needs to be shared.
* Reuse existing UI components before creating new ones.
* Keep components focused and avoid putting unrelated business logic inside UI components.

### Changes

* Inspect the existing implementation before changing it and follow established patterns.
* Prefer small, focused changes over unnecessary refactoring.
* Do not introduce new dependencies unless necessary.
* Do not rewrite working code without a clear reason.
* Do not modify `.env` files, secrets, or deployment configuration unless explicitly requested.

---

## Architecture

### Backend Layers

```text
routers/       → API endpoints
controllers/   → Request handlers
services/      → Business logic
db/models/     → Sequelize models
queue/         → Bull queue & worker
scrapping/     → Job scraping (Adzuna API)
```

Backend request flow:

```text
Router → Controller → Service → Database
```

### Frontend Structure

```text
features/      → Feature-specific Redux slices & RTK Query APIs
pages/         → Route components
components/    → Reusable UI components
redux/         → Store, hooks, reducers
shared/api/    → RTK Query base API
shared/helpers/ → Shared helpers
shared/constants/ → Shared constants
```

---

## Key Patterns

### Authentication

* Backend protected routes use `isAuth` middleware.
* `isNotAuth` is used for routes that should only be accessible to unauthenticated users.
* JWT access tokens are short-lived.
* Refresh tokens are long-lived.
* Tokens are stored in cookies.
* Authentication middleware handles token refresh.

### State Management

* RTK Query is used for server state and API communication.
* Redux slices are used for shared client-side state.
* Use `useAppDispatch` and `useAppSelector` for type-safe Redux access.

### Async Jobs

* Bull is used for background tasks such as job scraping and email sending.
* Jobs are processed by a separate worker.
* Redis is required for the queue.

### Database

* Sequelize is used for database access.
* Development uses Sequelize schema synchronization with `alter: true`.
* Be careful when changing production database schema.
* Existing models and associations should be reused whenever possible.

---

## Common Tasks

### Add a New API Endpoint

1. Create the router in `server/src/routers/`.
2. Create the controller in `server/src/controllers/`.
3. Create the service in `server/src/services/`.
4. Register the router in `server/src/index.ts`.

Follow the existing `router → controller → service` pattern.

### Add a Frontend Feature

1. Create or extend the appropriate feature folder in `client/src/features/`.
2. Add a Redux slice only if shared client-side state is required.
3. Add RTK Query endpoints for API communication.
4. Create or reuse pages/components.
5. Add routing in `client/src/App.tsx`.

### Enqueue an Async Job

1. Define the job in `server/src/queue/jobQueue.ts`.
2. Add the handler in `server/src/queue/jobWorker.ts`.
3. Enqueue the job from the appropriate service.

---

## Environment

* Backend and frontend environment variables are stored in `.env` files.
* Never commit secrets, API keys, passwords, or `.env` files.
* If a required environment variable is missing, do not invent a production value.
* Frontend API URL is configured through `VITE_API_URL`.
* Backend requires database, JWT, email, and Redis configuration.

---

## Git Rules

* Do not create commits unless explicitly requested.
* Do not push to the remote repository unless explicitly requested.
* Do not reset, rebase, or force-push without explicit permission.
* Keep changes limited to the requested task.
* Do not modify unrelated files unless required for the task.

---

## Verification

After making changes:

1. Run the relevant lint, typecheck, build, or test commands when available.
2. Verify affected functionality when practical.
3. Check for TypeScript errors after TypeScript changes.
4. Do not claim that a change works without verifying it.

---

## Deployment

* Frontend is deployed to Vercel.
* Backend, PostgreSQL, Redis, and the worker are deployed through Railway.
* Frontend uses `VITE_API_URL` to connect to the backend.
* Backend requires database, JWT, email, and Redis environment variables.

---

## Important Notes

* **CORS:** Configure `allowedOrigins` in `server/src/index.ts` when adding new frontend domains.
* **Redis:** Must be running for Bull queues and the worker.
* **Cookies:** Authentication uses cookies and requires appropriate CORS `credentials` configuration.
* **Database:** Avoid destructive schema changes and treat production database changes carefully.
