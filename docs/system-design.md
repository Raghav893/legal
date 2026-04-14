# LexOra — System Design

> This document describes the high-level architecture, component responsibilities, data flow, and engineering decisions behind the LexOra legal operations platform. It is intended for engineers joining the project and for reference during architectural decision-making.

---

## 1. Problem Statement

Small and mid-size law firms operate in a highly document-heavy, deadline-driven environment. Most firms today rely on a patchwork of disconnected tools: spreadsheets for client records, email chains for matter coordination, shared network drives for documents, and paper registers for hearing schedules. This fragmentation leads to missed deadlines, duplicated effort, version conflicts in documents, and poor visibility across the team.

LexOra is built to solve this by providing a single operational surface that handles the complete lifecycle of legal work: from client intake, through matter management and court appearances, to document storage and archival. The system must be reliable, auditable, role-aware, and fast enough to use during an active courtroom session.

---

## 2. High-Level Architecture

LexOra follows a layered architecture with a clear separation between the user-facing frontend, the API layer, the data persistence layer, and cloud infrastructure.

```
┌───────────────────────────────────────────────┐
│               User Browser                    │
│          (Next.js React Frontend)             │
└─────────────────────┬─────────────────────────┘
                      │ HTTPS
          ┌───────────▼──────────┐
          │     Nginx (Reverse   │
          │     Proxy + SSL)     │
          │     AWS EC2 / ECS    │
          └──────┬───────────────┘
                 │
    ┌────────────▼────────────┐
    │   Next.js App Server    │
    │  (App Router + Route    │
    │   Handlers /api/*)      │
    └──────────┬──────────────┘
               │         │
    ┌──────────▼───┐  ┌───▼──────────────────┐
    │  Supabase    │  │  Spring Boot Backend  │
    │  Auth + DB   │  │  (Java 21, REST API)  │
    │  + Storage   │  │  AWS EC2 / ECS        │
    └──────────────┘  └───────────┬───────────┘
                                  │
                        ┌─────────▼──────────┐
                        │  PostgreSQL on AWS  │
                        │  RDS (planned)      │
                        └────────────────────┘
```

### Component Responsibilities

| Component | Responsibility |
|---|---|
| **Next.js Frontend** | Server-side rendered UI, client-side interactivity, route protection via middleware |
| **Next.js Route Handlers** | Current API layer, proxies auth-protected requests to Supabase |
| **Supabase Auth** | Email/password authentication, JWT issuance, session cookies |
| **Supabase PostgreSQL** | Primary relational database (clients, cases, hearings, documents) |
| **Supabase Storage** | S3-compatible binary file storage for uploaded documents |
| **Spring Boot Backend** | Planned: business logic, scheduled jobs, complex queries, third-party integrations |
| **AWS RDS PostgreSQL** | Planned: production-grade managed database replacing Supabase-managed Postgres |
| **Nginx** | Reverse proxy, SSL termination, static asset caching |
| **AWS EC2 / ECS** | Container runtime for Next.js and Spring Boot services |

---

## 3. Authentication and Session Management

Authentication is handled by Supabase Auth using the email/password provider. The `@supabase/ssr` library is used to make Supabase Auth work correctly with Next.js server components, middleware, and API route handlers — all of which run in different execution contexts.

### Session Flow

1. User submits email + password on the `/login` page
2. The `supabase.auth.signInWithPassword()` call is made from the browser using the Supabase browser client
3. Supabase returns a JWT access token + refresh token, which `@supabase/ssr` stores in HTTP-only cookies
4. On every subsequent request, the Next.js middleware calls `updateSession()`, which reads the cookies, validates the JWT, and refreshes it if needed
5. Server components create a Supabase server client using the cookie store and call `supabase.auth.getUser()` to verify the session
6. Protected routes redirect to `/login` if no valid session is found

### Route Protection

The `middleware.ts` file runs on every request. It uses the following logic:

- If the route is `/api/auth/*`, pass through without restriction
- If the user is not authenticated and the route is not `/`, `/login`, or `/signup`, redirect to `/login`
- If the user is authenticated and visits `/login` or `/signup`, redirect to `/dashboard`

### Role Management

User roles are stored in Supabase Auth `user_metadata` as a `role` string field. The available roles are:

| Role | Access Level | Description |
|---|---|---|
| `admin` | Full access | User management, all data, reporting, configuration |
| `advocate` | Operational access | Case ownership, hearings, client work, documents |
| `paralegal` | Support access | Case preparation, document uploads, hearing coordination |
| `clerk` | Limited access | Document and record management, viewing only |

---

## 4. Data Layer Design

### Current: Supabase PostgreSQL

The database is hosted on Supabase's managed PostgreSQL. All tables have Row Level Security (RLS) enabled. Current policies grant full CRUD access to authenticated users. More granular role-based policies will be introduced with the Spring Boot migration.

### Planned: AWS RDS PostgreSQL

When the Spring Boot backend is introduced, the database will migrate to AWS RDS PostgreSQL. Spring Boot will connect via Spring Data JPA. The schema will remain compatible, with migrations managed by Flyway or Liquibase.

### Key Design Decisions

**Quoted camelCase column names:** The Supabase JavaScript client interacts with PostgREST, which is case-insensitive by default. To preserve camelCase (matching the TypeScript types used in the frontend), all columns are created with quoted identifiers (e.g., `"fullName"`, `"caseNumber"`). This avoids the need for column mapping in every query.

**Foreign key joins via PostgREST:** Supabase/PostgREST supports inline foreign key joins using the `tableName:foreignKey(columns)` syntax in `.select()`. This is used throughout the API to return related data (e.g., `cases:caseId(title)` in hearings queries) without writing manual JOIN queries.

---

## 5. File Storage Design

Documents are stored in Supabase Storage, which provides an S3-compatible object storage API. The storage bucket is named `documents`.

### Upload Flow

1. User selects a file in the Documents page form
2. The form submits as `multipart/form-data` to `POST /api/documents`
3. The Next.js route handler extracts the file using `request.formData()`
4. The file is uploaded to Supabase Storage with a timestamped path: `{timestamp}-{originalFilename}`
5. A public URL is retrieved using `supabase.storage.from('documents').getPublicUrl(path)`
6. A record is inserted into the `documents` table with the file metadata (name, type, size, case ID, uploader ID, public URL)
7. The route returns the full document record to the client, which adds it to the UI state

### Planned: AWS S3

In the Spring Boot phase, file uploads will transition to AWS S3. The Spring Boot backend will generate pre-signed URLs for direct browser-to-S3 uploads, eliminating the need to stream large files through the application server.

---

## 6. Frontend Architecture

The frontend is built with Next.js 14 using the App Router. The key architectural choices are:

**Server Components for data fetching:** Pages like `/dashboard`, `/clients`, `/cases`, `/hearings`, and `/documents` are server components that fetch initial data from Supabase before rendering. This avoids a loading flash on page load and improves Lighthouse scores.

**Client Components for interactivity:** Screen components (e.g., `ClientsScreen`, `CasesScreen`) are marked `"use client"` and manage local state for forms, filters, and selections. They receive initial data as props from the server component parent.

**Optimistic UI updates:** When a form is submitted (e.g., creating a client or scheduling a hearing), the UI immediately adds the new record to local state from the API response, without requiring a full page reload.

**Route Handlers as the write API:** All create/update/delete operations go through Next.js Route Handlers (`/app/api/*`), which create authenticated Supabase server clients and perform the operation. This ensures the service role key is never exposed to the browser.

---

## 7. Spring Boot Backend Plan

The Spring Boot backend will progressively take over responsibilities from the Next.js route handlers as it is developed. The integration strategy is:

1. Spring Boot runs as a separate Docker service alongside Next.js
2. Next.js route handlers proxy requests to Spring Boot when the corresponding endpoint is ready
3. Spring Boot verifies the Supabase JWT on each request using the Supabase JWT secret
4. Once all endpoints are migrated, the Next.js Route Handlers are removed and the frontend calls Spring Boot directly

### Planned Spring Boot Modules

| Module | Responsibility |
|---|---|
| `AuthFilter` | JWT validation on every request via Supabase secret |
| `ClientController` | CRUD for client profiles with validation |
| `CaseController` | Matter lifecycle management, status transitions |
| `HearingController` | Scheduling, conflict detection, reminder triggers |
| `DocumentController` | Document metadata management, S3 pre-signed URL generation |
| `DashboardController` | Aggregated statistics and upcoming hearing queries |
| `NotificationService` | Scheduled email/SMS reminders for hearings |
| `AuditService` | Immutable audit log for all data mutations |

---

## 8. Scalability and Reliability

### Current Architecture Limitations
- Single Next.js instance handles both UI rendering and API calls
- Supabase free tier has connection and storage limits
- No background job processing

### Planned Improvements
- Horizontal scaling via AWS ECS with an Application Load Balancer
- RDS Multi-AZ for database high availability
- AWS SQS + Spring Boot worker for async notification jobs
- CloudFront CDN for static asset delivery
- AWS CloudWatch for metrics, logs, and alerting

---

## 9. Security Considerations

- All sessions are managed via HTTP-only cookies — JWT tokens are never exposed to JavaScript
- Supabase RLS ensures database-level access control independent of application logic
- Spring Boot will add a second enforcement layer via `@PreAuthorize` annotations
- All file uploads are validated for content type before being accepted by the storage layer
- Production deployments use HTTPS exclusively via AWS ACM and Nginx
- Secrets (Supabase keys, DB passwords) are stored in AWS Secrets Manager and injected as environment variables at container startup
