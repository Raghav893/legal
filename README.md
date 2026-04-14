# LexOra — Legal Operations Platform

> A modern, cloud-native legal management platform built for small and mid-size law firms. LexOra centralizes client relationships, matter tracking, hearing schedules, and document management into a single, high-trust collaborative workspace.

---

## Table of Contents

1. [Overview](#overview)
2. [Technology Stack](#technology-stack)
3. [Project Structure](#project-structure)
4. [Core Modules](#core-modules)
5. [Getting Started (Local Development)](#getting-started-local-development)
6. [Environment Variables](#environment-variables)
7. [Authentication & Roles](#authentication--roles)
8. [API Overview](#api-overview)
9. [Database](#database)
10. [File Storage](#file-storage)
11. [Deployment (AWS)](#deployment-aws)
12. [Roadmap](#roadmap)
13. [Contributing](#contributing)

---

## Overview

LexOra is a legal operations platform designed to eliminate the fragmentation that plagues most law firm workflows. Lawyers, paralegals, and clerks typically work across disconnected tools — spreadsheets for client lists, email for document sharing, paper calendars for hearings, and separate billing software. LexOra brings all of this into a single, unified, auditable system.

The platform is built for real operational use: it supports client intake, full matter lifecycle management (from filing to closure), hearing scheduling with courtroom details, and a document registry backed by cloud object storage. Role-based access control ensures that each team member sees and acts on only what they are permitted to.

LexOra is intentionally simple to deploy and maintain. The frontend is a Next.js application that can be hosted as a Docker container or directly on AWS. The backend is being developed in Spring Boot and will handle complex business logic, role enforcement, and document processing. Authentication and real-time data are powered by Supabase, allowing the system to be fully functional before the Spring Boot backend is complete.

---

## Technology Stack

### Frontend
- **Framework:** Next.js 14 (App Router)
- **Language:** TypeScript
- **Styling:** Tailwind CSS with a custom design system
- **Component Library:** Radix UI primitives with custom CVA variants
- **Animations:** Framer Motion
- **Date Utilities:** date-fns, react-day-picker

### Backend (Current)
- **Auth & Database:** Supabase (PostgreSQL under the hood)
- **API Routes:** Next.js Route Handlers (`/app/api/*`)
- **File Storage:** Supabase Storage (S3-compatible object storage)
- **Session Management:** Supabase SSR with cookie-based sessions

### Backend (Planned — Spring Boot)
- **Framework:** Spring Boot 3.x (Java 21)
- **ORM:** Spring Data JPA + Hibernate
- **Database:** PostgreSQL (migrating from Supabase-managed to RDS on AWS)
- **Auth Integration:** JWT verification against Supabase Auth tokens
- **API Contract:** REST, documented with Springdoc OpenAPI (Swagger)
- **Business Logic:** Document processing, audit logging, scheduled hearing reminders

### Infrastructure
- **Cloud Provider:** AWS
- **Container Runtime:** Docker + Docker Compose
- **Reverse Proxy:** Nginx
- **CI/CD:** GitHub Actions
- **Domain & SSL:** AWS ACM + CloudFront or Nginx with Let's Encrypt

---

## Project Structure

```text
LexOra/
├── frontend/                  # Next.js application
│   ├── app/                   # App Router pages and API routes
│   │   ├── api/               # Next.js Route Handlers (Supabase-backed)
│   │   │   ├── clients/       # GET, POST /api/clients
│   │   │   ├── cases/         # GET, POST /api/cases
│   │   │   │   └── [id]/      # PATCH, DELETE /api/cases/:id
│   │   │   ├── hearings/      # GET, POST /api/hearings
│   │   │   └── documents/     # GET, POST /api/documents
│   │   ├── dashboard/         # Dashboard page (server component)
│   │   ├── clients/           # Clients page
│   │   ├── cases/             # Matters page
│   │   ├── hearings/          # Hearings page
│   │   ├── documents/         # Documents page
│   │   ├── login/             # Login page
│   │   └── signup/            # Signup page
│   ├── components/            # React components
│   │   ├── screens/           # Full-page screen components
│   │   ├── ui/                # Reusable design system components
│   │   └── app-shell.tsx      # Sidebar + topbar layout wrapper
│   ├── utils/
│   │   └── supabase/          # Supabase client/server/middleware helpers
│   ├── middleware.ts           # Auth route protection middleware
│   ├── Dockerfile             # Production Docker image
│   └── package.json
├── docs/                      # Architecture and operational documentation
│   ├── system-design.md
│   ├── api-design.md
│   ├── database-schema.md
│   └── deployment-guide.md
├── .env                       # Root environment variables (Docker)
├── .env.example               # Template for new developers
└── README.md
```

---

## Core Modules

### Client Management
Create and maintain detailed client profiles including contact information, associated company or organization, and internal notes. Each client is linked to one or more matters, providing a complete relationship view from intake to resolution.

### Matter (Case) Management
Open new legal matters with case numbers, titles, assigned clients, presiding judge, and court details. Track matter status through the full lifecycle: `OPEN` → `IN_PROGRESS` → `ON_HOLD` → `CLOSED`. The matter detail panel shows all metadata at a glance and allows one-click status transitions.

### Hearing Scheduler
Schedule courtroom appearances against any open matter. Each hearing entry captures the courtroom identifier, date/time, and agenda. The dashboard shows all upcoming hearings sorted chronologically to aid in weekly preparation.

### Document Registry
Upload case files, agreements, evidence bundles, court orders, and invoices. Files are stored in Supabase Storage (S3-compatible) and linked to a specific matter. The document viewer supports PDF and image previews directly in the browser.

### Dashboard Analytics
The main dashboard provides at-a-glance operational health metrics: total client count, open matter count, closed matter count, and upcoming hearing count. Data is fetched live from the database on each render.

### Role-Based Access Control
Four roles are supported: `admin`, `advocate`, `paralegal`, and `clerk`. User roles are set in Supabase Auth user metadata and enforced at both the UI and API level.

---

## Getting Started (Local Development)

### Prerequisites
- Node.js 18 or higher
- npm or yarn
- A Supabase project (free tier is sufficient)

### Steps

```bash
# 1. Clone the repository
git clone https://github.com/your-org/lexora.git
cd lexora

# 2. Install frontend dependencies
cd frontend
npm install

# 3. Set environment variables
cp .env.example .env.local
# Fill in NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY

# 4. Start the development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### Supabase Setup
1. Create a project at [supabase.com](https://supabase.com)
2. Go to SQL Editor and run the schema in `docs/database-schema.md`
3. Go to Storage → New Bucket → name it `documents` → enable Public
4. Copy your Project URL and anon key into `.env.local`

---

## Environment Variables

### `frontend/.env.local`

| Variable | Description |
|---|---|
| `NEXT_PUBLIC_SUPABASE_URL` | Your Supabase project URL |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Your Supabase anonymous/public key |

### Root `.env` (Docker / AWS deployment)

| Variable | Description |
|---|---|
| `DOMAIN_NAME` | Your production domain e.g. `lexora.yourdomain.com` |
| `NEXT_PUBLIC_SUPABASE_URL` | Supabase project URL |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Supabase anon key |

---

## Authentication & Roles

Authentication is handled entirely by Supabase Auth. Users sign up or log in with email and password. Sessions are managed via HTTP-only cookies using the `@supabase/ssr` package, which means sessions survive page refreshes and work correctly with Next.js server components and middleware.

The `middleware.ts` file protects all routes except `/`, `/login`, and `/signup`. Any unauthenticated request to a protected route is redirected to `/login`. Authenticated users visiting `/login` are redirected to `/dashboard`.

Roles are stored in Supabase Auth user metadata (`user_metadata.role`) and displayed in the sidebar. Available roles: `admin`, `advocate`, `paralegal`, `clerk`.

---

## API Overview

The current API is implemented as Next.js Route Handlers in `frontend/app/api/`. Each handler creates a Supabase server client and performs authenticated database operations.

| Method | Route | Description |
|---|---|---|
| `GET` | `/api/clients` | List all clients |
| `POST` | `/api/clients` | Create a new client |
| `GET` | `/api/cases` | List all matters with client names |
| `POST` | `/api/cases` | Open a new matter |
| `PATCH` | `/api/cases/:id` | Update matter status or fields |
| `DELETE` | `/api/cases/:id` | Delete a matter |
| `GET` | `/api/hearings` | List all hearings |
| `POST` | `/api/hearings` | Schedule a hearing |
| `GET` | `/api/documents` | List all documents |
| `POST` | `/api/documents` | Upload a document to storage + register in DB |

See `docs/api-design.md` for full request/response schemas.

---

## Database

LexOra uses Supabase (PostgreSQL) as its primary data store. Row Level Security (RLS) is enabled on all tables, ensuring authenticated users can only access data they are permitted to. See `docs/database-schema.md` for the full table definitions, column types, and relationships.

---

## File Storage

Document files are stored in Supabase Storage in a bucket named `documents`. Files are uploaded from the browser via the `/api/documents` route handler, which uploads the binary to Supabase Storage and inserts a metadata record in the `documents` table. Public URLs are generated for previewing files directly in the browser.

---

## Deployment (AWS)

LexOra is designed to run on AWS EC2 or ECS using Docker containers. See `docs/deployment-guide.md` for the full step-by-step guide covering EC2 setup, Nginx reverse proxy, SSL termination, and GitHub Actions CI/CD.

---

## Roadmap

- [ ] Spring Boot backend with full REST API
- [ ] PostgreSQL on AWS RDS (replacing Supabase-managed DB)
- [ ] Document AI summarization (AWS Textract or OpenAI)
- [ ] Billing and invoice generation
- [ ] Email notifications for upcoming hearings
- [ ] Audit log for all data mutations
- [ ] Mobile-responsive improvements
- [ ] Multi-tenant firm isolation

---

## Contributing

Pull requests are welcome. For major changes, open an issue first to discuss what you'd like to change. All code must pass TypeScript type checking and ESLint before merging.
