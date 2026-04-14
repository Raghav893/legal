# LexOra — Database Schema

> This document defines the full relational schema used by LexOra. The database is currently hosted on Supabase (managed PostgreSQL). When the Spring Boot backend is introduced, the database will migrate to AWS RDS PostgreSQL. The schema is designed to be compatible with both environments.

---

## Overview

LexOra's data model is organized around the central concept of a **legal matter** (`cases` table). Every other entity in the system — clients, hearings, and documents — is related to a case. The `auth.users` table is managed by Supabase Auth and stores user identity and session information.

```
auth.users
    │
    ├── documents.uploadedBy (FK)
    │
clients
    │
    └── cases.clientId (FK)
            │
            ├── hearings.caseId (FK)
            │
            └── documents.caseId (FK)
```

Row Level Security (RLS) is enabled on all tables. Current policies grant full access to authenticated users. More granular role-based policies (by `user_metadata.role`) will be added in the Spring Boot phase.

---

## Tables

---

### `clients`

Stores individual client profiles for the law firm. Each client may be linked to one or more cases.

```sql
create table if not exists public.clients (
  id            bigserial primary key,
  "fullName"    text not null,
  email         text,
  phone         text not null,
  address       text not null,
  "companyName" text,
  notes         text,
  created_at    timestamptz default now()
);
```

| Column | Type | Constraints | Description |
|---|---|---|---|
| `id` | `bigserial` | Primary key | Auto-incrementing unique identifier |
| `fullName` | `text` | Not null | Full legal name of the client |
| `email` | `text` | Optional | Contact email address |
| `phone` | `text` | Not null | Primary contact phone number |
| `address` | `text` | Not null | Residential or registered business address |
| `companyName` | `text` | Optional | Associated company or organization |
| `notes` | `text` | Optional | Internal notes visible only to firm staff |
| `created_at` | `timestamptz` | Default: `now()` | Record creation timestamp |

**RLS Policy:**
```sql
alter table public.clients enable row level security;

create policy "Allow authenticated users full access on clients"
  on public.clients
  for all
  to authenticated
  using (true)
  with check (true);
```

**Indexes (recommended):**
- Primary key index on `id` (auto-created)
- Index on `email` for lookup: `create index idx_clients_email on public.clients(email);`

---

### `cases`

The central entity. Represents a legal matter, from initial intake through resolution. Each case is assigned to a client and optionally to an advocate.

```sql
create table if not exists public.cases (
  id                 bigserial primary key,
  "caseNumber"       text not null,
  title              text not null,
  description        text,
  status             text not null default 'OPEN',
  "courtName"        text not null,
  "judgeName"        text not null,
  "filingDate"       date not null,
  "nextHearingDate"  date,
  "clientId"         bigint references public.clients(id) on delete set null,
  "advocateId"       bigint,
  created_at         timestamptz default now()
);
```

| Column | Type | Constraints | Description |
|---|---|---|---|
| `id` | `bigserial` | Primary key | Auto-incrementing unique identifier |
| `caseNumber` | `text` | Not null | Unique case or file reference number (e.g., `SUIT-2024-001`) |
| `title` | `text` | Not null | Descriptive title of the matter |
| `description` | `text` | Optional | Internal summary or objectives of the matter |
| `status` | `text` | Not null, default `OPEN` | Matter lifecycle status (see values below) |
| `courtName` | `text` | Not null | Name of the presiding court |
| `judgeName` | `text` | Not null | Name of the presiding judge |
| `filingDate` | `date` | Not null | Date the matter was filed |
| `nextHearingDate` | `date` | Optional | Next scheduled hearing date (also tracked in `hearings`) |
| `clientId` | `bigint` | FK → `clients.id` | Client this matter belongs to |
| `advocateId` | `bigint` | Optional | Will reference `auth.users` via Spring Boot user service |
| `created_at` | `timestamptz` | Default: `now()` | Record creation timestamp |

**Status values:**

| Value | Label | Meaning |
|---|---|---|
| `OPEN` | Open | Newly filed, proceedings not yet formally started |
| `IN_PROGRESS` | Active | Matter is actively being litigated |
| `ON_HOLD` | On Hold | Proceedings paused (e.g., awaiting evidence) |
| `CLOSED` | Closed | Matter resolved, archived |

**RLS Policy:**
```sql
alter table public.cases enable row level security;

create policy "Allow authenticated users full access on cases"
  on public.cases
  for all
  to authenticated
  using (true)
  with check (true);
```

**Indexes (recommended):**
- `create index idx_cases_status on public.cases(status);`
- `create index idx_cases_clientId on public.cases("clientId");`
- `create unique index idx_cases_caseNumber on public.cases("caseNumber");`

---

### `hearings`

Tracks scheduled courtroom appearances for each matter. A single case may have many hearings over its lifetime.

```sql
create table if not exists public.hearings (
  id                bigserial primary key,
  "caseId"          bigint references public.cases(id) on delete cascade,
  "hearingDateTime" timestamptz not null,
  courtroom         text not null,
  agenda            text not null,
  outcome           text,
  "reminderSent"    boolean default false,
  created_at        timestamptz default now()
);
```

| Column | Type | Constraints | Description |
|---|---|---|---|
| `id` | `bigserial` | Primary key | Auto-incrementing unique identifier |
| `caseId` | `bigint` | FK → `cases.id` ON DELETE CASCADE | Case this hearing belongs to |
| `hearingDateTime` | `timestamptz` | Not null | Scheduled date and time of the hearing (UTC) |
| `courtroom` | `text` | Not null | Courtroom or hall identifier |
| `agenda` | `text` | Not null | Purpose or agenda of the hearing session |
| `outcome` | `text` | Optional | Notes on the outcome, populated after the hearing |
| `reminderSent` | `boolean` | Default: `false` | Whether an automated reminder was dispatched |
| `created_at` | `timestamptz` | Default: `now()` | Record creation timestamp |

**Notes:**
- When a case is deleted, all associated hearings are automatically deleted (`ON DELETE CASCADE`)
- The `reminderSent` flag will be used by the Spring Boot `NotificationService` to avoid duplicate reminders
- The dashboard queries upcoming hearings by filtering `hearingDateTime >= now()`

**RLS Policy:**
```sql
alter table public.hearings enable row level security;

create policy "Allow authenticated users full access on hearings"
  on public.hearings
  for all
  to authenticated
  using (true)
  with check (true);
```

**Indexes (recommended):**
- `create index idx_hearings_caseId on public.hearings("caseId");`
- `create index idx_hearings_dateTime on public.hearings("hearingDateTime");`

---

### `documents`

Stores metadata about uploaded case documents. The actual file binary is stored in Supabase Storage (or AWS S3 in the Spring Boot phase). Each record links to a case and optionally to the user who uploaded it.

```sql
create table if not exists public.documents (
  id             bigserial primary key,
  "fileName"     text not null,
  "documentType" text not null default 'CASE_FILE',
  "contentType"  text,
  "sizeBytes"    bigint,
  "documentUrl"  text,
  summary        text,
  "caseId"       bigint references public.cases(id) on delete set null,
  "uploadedBy"   uuid references auth.users(id) on delete set null,
  created_at     timestamptz default now()
);
```

| Column | Type | Constraints | Description |
|---|---|---|---|
| `id` | `bigserial` | Primary key | Auto-incrementing unique identifier |
| `fileName` | `text` | Not null | Original filename as uploaded by the user |
| `documentType` | `text` | Not null, default `CASE_FILE` | Classification of the document (see values below) |
| `contentType` | `text` | Optional | MIME type of the file (e.g., `application/pdf`, `image/png`) |
| `sizeBytes` | `bigint` | Optional | File size in bytes |
| `documentUrl` | `text` | Optional | Public URL to retrieve or preview the file |
| `summary` | `text` | Optional | Internal note or description of the document |
| `caseId` | `bigint` | FK → `cases.id` ON DELETE SET NULL | Associated legal matter |
| `uploadedBy` | `uuid` | FK → `auth.users(id)` ON DELETE SET NULL | Supabase Auth user who uploaded the file |
| `created_at` | `timestamptz` | Default: `now()` | Record creation timestamp |

**Document type values:**

| Value | Description |
|---|---|
| `CASE_FILE` | General case document or pleading |
| `AGREEMENT` | Contracts, settlements, or legal agreements |
| `EVIDENCE` | Exhibit or supporting evidence |
| `COURT_ORDER` | Orders or decrees issued by the court |
| `INVOICE` | Billing records or fee receipts |
| `OTHER` | Miscellaneous documents |

**RLS Policy:**
```sql
alter table public.documents enable row level security;

create policy "Allow authenticated users full access on documents"
  on public.documents
  for all
  to authenticated
  using (true)
  with check (true);
```

**Indexes (recommended):**
- `create index idx_documents_caseId on public.documents("caseId");`
- `create index idx_documents_uploadedBy on public.documents("uploadedBy");`

---

## Supabase Storage — `documents` Bucket

In addition to the PostgreSQL tables above, Supabase Storage is used for binary file storage. The bucket `documents` must be created manually in the Supabase dashboard and configured with the following RLS policies:

```sql
-- Allow authenticated users to upload files
create policy "Allow authenticated uploads"
  on storage.objects
  for insert
  to authenticated
  with check (bucket_id = 'documents');

-- Allow authenticated users to read their files
create policy "Allow authenticated reads"
  on storage.objects
  for select
  to authenticated
  using (bucket_id = 'documents');

-- Allow public access to preview documents in the browser
create policy "Allow public reads"
  on storage.objects
  for select
  to public
  using (bucket_id = 'documents');
```

Files are stored with a path of `{timestamp}-{originalFilename}` to avoid collisions.

---

## Spring Boot / AWS RDS Migration Notes

When migrating from Supabase-managed PostgreSQL to AWS RDS PostgreSQL:

1. **Schema migration tool:** Use Flyway or Liquibase in the Spring Boot project to version-control schema migrations. The initial migration script will mirror this schema exactly.

2. **Column naming:** Spring Boot + Hibernate uses snake_case column names by default. The current schema uses quoted camelCase for compatibility with Supabase's PostgREST. When using Hibernate, you can either: (a) keep quoted camelCase with `@Column(name = "\"fullName\"")` annotations, or (b) migrate to snake_case and update the TypeScript types accordingly.

3. **Auth users table:** The `auth.users` table is Supabase-managed and will not exist in RDS. In the Spring Boot phase, user accounts will be managed in a new `users` table in the `public` schema, with Supabase Auth tokens used only for initial verification.

4. **Data migration:** Use `pg_dump` on the Supabase database and `pg_restore` on the RDS instance. Ensure the `auth.users` foreign key references are updated to point to the new `users` table.
