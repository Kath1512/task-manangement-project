# Task Management System

A web-based Task Management System for teams to create, assign, and track projects and staff. The project consists of an Angular frontend and an ASP.NET Core backend; the backend was recently migrated from raw SQL to Entity Framework Core for improved maintainability and features.

## Description

This repository implements a team-focused task and project management application. It provides:
- User authentication and authorization
- Project CRUD and task assignment
- Team / staff management and profile pages
- A modern single-page frontend built with Angular
- A server API built with ASP.NET Core and Entity Framework Core

Why these technologies:
- **ASP.NET Core + EF Core**: Rapid development, strong typing, and maintainable data access. The newer `server/` code uses EF Core; this replaced the older `old-server/` implementation which relied on raw SQL and lacked many features.
- **Angular**: A structured frontend framework that supports modular features, routing, and production-ready builds.
- **Docker**: Optional containerized deployment via `docker-compose.yml` for consistent development and production environments.

Challenges & future work:
- Database migration from raw SQL to EF Core required mapping and migrations; some legacy behaviors were reimplemented.
- Future features: richer RBAC, audit logging, push notifications, and improved test coverage.

## Table of Contents
- Installation
- Running (development)
- Running with Docker
- Database setup
- Usage examples
- Project structure
- Contributing

## Installation (Prerequisites)
- .NET SDK (recommended: latest LTS)
- Node.js (14+ recommended) and npm or yarn
- (Optional) Docker & docker-compose
- A SQL database server (use the dump files in `db/` to seed data)

## How to Run (Development)

1. Server (API)

```bash
cd server
dotnet restore
dotnet build
dotnet run
# By default the API will bind to the URL(s) configured in server/Properties/launchSettings.json
```

2. Client (Angular)

```bash
cd client
npm install
# Start dev server
npm start
# or if you use Angular CLI: ng serve
```

3. From a browser open the Angular dev server (usually http://localhost:4200) and you should be able to interact with the app; the frontend will call the API (default server address configured in `client/src/environments`).

## Running with Docker

This repository includes a ready-to-run Docker Compose configuration at [docker-compose.yml](docker-compose.yml). The compose file launches four services: Postgres (`db`), Redis (`redis`), the ASP.NET Core API (`server`) and the Angular frontend (`client`).

Quick start (development):

```bash
# from the repository root
docker-compose up --build
# or run detached
docker-compose up --build -d
```

Useful commands:

```bash
docker-compose logs -f server    # stream server logs
docker-compose exec server bash # open a shell in the server container
docker-compose down -v         # stop and remove volumes (cleans DB data)
```

Compose notes (what the file does):
- `db` — Postgres 15, environment: `POSTGRES_USER=postgres`, `POSTGRES_PASSWORD=postgres1512`, `POSTGRES_DB=taskmanagement`. The mounted `./db/dump_latest.sql` is copied into the DB init folder so the DB is seeded on first container start.
- `redis` — Redis 7 (cache/pub-sub).
- `server` — built from `server/Dockerfile`. Environment variables set in compose include `ASPNETCORE_ENVIRONMENT=Development` and the connection strings used by the app:
  - `ConnectionStrings__DefaultConnection=Host=db;Port=5432;Database=taskmanagement;Username=postgres;Password=postgres1512`
  - `ConnectionStrings__RedisConnection=redis:6379`
- `client` — built from `client/Dockerfile` and served on port `4200` (host mapping `4200:80`). The Angular app will call the `server` API using the configuration present in `client/src/environments`.

Exposed host ports (defaults from compose):
- Postgres: `5432`
- Redis: `6379`
- Server API: `5050`
- Client (Angular): `4200`

Migrations / DB updates

If you need to run EF Core migrations against the database started by compose, either run them locally against the container DB or execute them inside the `server` container. Example (from repo root):

```bash
# Run EF migrations from the server container
docker-compose exec server dotnet ef database update

# Or run locally pointing at the container DB
DOTNET_ENVIRONMENT=Development \
  dotnet ef database update --project server
```

Security / production

The compose file is intended for local development. Before deploying to production:
- Replace all hard-coded credentials (e.g., `postgres1512`) with secure secrets or environment-based injection.
- Use managed database services or external volumes for persistent DB storage.
- Configure HTTPS and proper CORS/allowed origins for the `server` API.

Adjust service connection strings in `server/appsettings.json` and the `client` environment files as needed.

## Database setup / Seeding

- A SQL dump is available in the `db/` folder (`dump.sql`, `dump_latest.sql`, `dump_21_1_2026.sql`). Import these using your database client. Example (SQL Server using `sqlcmd`):

```bash
# Example: import into SQL Server (adapt connection parameters)
# sqlcmd -S <server> -U <user> -P <password> -i db/dump_latest.sql
```

- For EF Core migrations (recommended for the `server/` project):

```bash
cd server
dotnet tool install --global dotnet-ef # if not installed
dotnet ef database update
```

Update the connection string in `server/appsettings.json` before running migrations or the app.

## How to Use (Examples)

- The API controllers live in the `server/Controllers` folder: `AuthController`, `ProjectsController`, `UsersController`.
- Typical endpoints (base path `api`):
  - `POST /api/auth/login` — authenticate and receive a token
  - `POST /api/auth/register` — register a new user (if enabled)
  - `GET /api/projects` — list projects
  - `POST /api/projects` — create a project
  - `GET /api/users` — list users

Example cURL (login):

```bash
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"username":"dev@example.com","password":"Password123"}'
```

If the frontend requires seeded credentials, import `db/dump_latest.sql` or create a user via the registration endpoint.

## Project Structure (high level)
- `server/` — ASP.NET Core API using EF Core; preferred, actively developed backend.
- `old-server/` — legacy backend that used raw SQL; kept for reference but not recommended for new work.
- `client/` — Angular single-page application.
- `db/` — SQL dump files for initial data seeding.

## Migration Note
The `old-server/` implementation uses raw SQL and lacks functionality present in the newer `server/` codebase. The `server/` directory is the actively maintained backend, using Entity Framework Core for data access, better abstractions, and easier migrations. For new development, only use `server/`.

## Contributing
- Please open issues for bugs or feature requests.
- For code changes, fork the repo, create a feature branch, and open a PR with tests and a concise description.

