# Legal Case & Client Management System

Production-ready starter for small and mid-size law firms using:

- `App:` Next.js fullstack with App Router + Route Handlers
- `Auth:` JWT session cookie
- `Storage:` file-backed JSON data store
- `Infra:` Docker + Docker Compose

## Project Structure

```text
frontend/  Next.js fullstack app (UI + API routes + data store)
docs/      System design, schema, API, deployment guide
```

## Quick Start

1. Copy `.env.example` to `.env`
2. Run:

```bash
docker-compose up --build
```

3. Open:

- Frontend: [http://localhost:3000](http://localhost:3000)
- App: [http://localhost:3000](http://localhost:3000)

## Default Credentials

- Email: `admin@legalcase.local`
- Password: `Admin@123`

## Core Modules

- Client management
- Case management
- Hearing scheduler
- Document storage
- Role-based access control
- Dashboard analytics

## API Highlights

- `POST /api/auth/login`
- `POST /api/auth/logout`
- `GET/POST /api/clients`
- `GET/POST /api/cases`
- `GET/POST /api/hearings`
- `GET /api/documents`
- `GET /api/dashboard/summary`

## Notes

- Data persists in [db.json](C:\Users\RAGHAV ARORA\OneDrive\Documents\Playground\frontend\data\db.json).
- `docker-compose` mounts `frontend/data` into the container so changes persist.
- This repo is now Next.js-only with Spring Boot removed.
