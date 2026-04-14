# LexOra — REST API Design

> This document defines all API endpoints exposed by LexOra. The current implementation uses Next.js Route Handlers backed by Supabase. The planned Spring Boot backend will implement the same contract, allowing a transparent migration. All endpoints require a valid Supabase session cookie unless otherwise noted.

---

## Base URL

| Environment | Base URL |
|---|---|
| Local development | `http://localhost:3000/api` |
| Production (AWS) | `https://lexora.yourdomain.com/api` |
| Spring Boot (planned) | `http://localhost:8080/api` (proxied via Next.js or Nginx) |

---

## Authentication

LexOra uses Supabase Auth for identity. The frontend exchanges an email and password for a JWT session, which is stored in an HTTP-only cookie by the `@supabase/ssr` library. All API route handlers on the server validate this session by calling `supabase.auth.getUser()`.

When the Spring Boot backend is introduced, it will validate the same Supabase-issued JWT using the project's JWT secret, making authentication transparent across both services.

### Login

```
POST /login
```

This is handled by the Supabase Auth client directly in the browser — not by a Route Handler. The Supabase `signInWithPassword` SDK method is called client-side and the resulting session cookie is set automatically.

**Request body:**
```json
{
  "email": "advocate@lawfirm.com",
  "password": "your-secure-password"
}
```

**Success response:** Session cookie set, user redirected to `/dashboard`.

**Error response:**
```json
{
  "error": "Invalid login credentials"
}
```

### Logout

Logout is performed by calling `supabase.auth.signOut()` directly in the browser, which clears the session cookie. No server-side route handler is required.

---

## Clients

### GET /api/clients

Returns a list of all client records, ordered by most recently created.

**Authentication:** Required

**Response: `200 OK`**
```json
[
  {
    "id": 1,
    "fullName": "Arjun Mehta",
    "email": "arjun@mehta.com",
    "phone": "9876543210",
    "address": "12 MG Road, Bangalore",
    "companyName": "Mehta Industries",
    "notes": "Long-standing corporate client",
    "created_at": "2026-04-14T10:00:00Z"
  }
]
```

---

### POST /api/clients

Creates a new client record.

**Authentication:** Required

**Request body:**
```json
{
  "fullName": "Arjun Mehta",
  "email": "arjun@mehta.com",
  "phone": "9876543210",
  "address": "12 MG Road, Bangalore",
  "companyName": "Mehta Industries",
  "notes": "Referred by Justice Kapoor"
}
```

**Validation rules:**
- `fullName` — required, non-empty string
- `phone` — required, non-empty string
- `address` — required, non-empty string
- `email`, `companyName`, `notes` — optional

**Response: `201 Created`**
```json
{
  "id": 2,
  "fullName": "Arjun Mehta",
  "email": "arjun@mehta.com",
  "phone": "9876543210",
  "address": "12 MG Road, Bangalore",
  "companyName": "Mehta Industries",
  "notes": "Referred by Justice Kapoor",
  "created_at": "2026-04-14T11:30:00Z"
}
```

**Error response: `500 Internal Server Error`**
```json
{
  "error": "null value in column \"fullName\" of relation \"clients\" violates not-null constraint",
  "details": "...",
  "hint": "..."
}
```

---

## Cases (Matters)

### GET /api/cases

Returns all matters with the associated client name resolved from the `clients` table via foreign key join.

**Authentication:** Required

**Response: `200 OK`**
```json
[
  {
    "id": 1,
    "caseNumber": "SUIT-2024-001",
    "title": "Mehta vs State of Karnataka",
    "description": "Property dispute arising from...",
    "status": "IN_PROGRESS",
    "courtName": "Karnataka High Court",
    "judgeName": "Justice R.K. Sharma",
    "filingDate": "2024-03-10",
    "nextHearingDate": "2026-05-20",
    "clientId": 1,
    "clientName": "Arjun Mehta",
    "created_at": "2024-03-10T09:00:00Z"
  }
]
```

---

### POST /api/cases

Opens a new legal matter.

**Authentication:** Required

**Request body:**
```json
{
  "caseNumber": "SUIT-2025-004",
  "title": "Singh vs Patel Builders",
  "description": "Breach of construction contract",
  "status": "OPEN",
  "courtName": "Delhi District Court",
  "judgeName": "Hon. Justice A. Verma",
  "filingDate": "2025-01-15",
  "nextHearingDate": "2025-03-01",
  "clientId": 3
}
```

**Validation rules:**
- `caseNumber`, `title`, `courtName`, `judgeName`, `filingDate` — required
- `status` — must be one of: `OPEN`, `IN_PROGRESS`, `ON_HOLD`, `CLOSED`
- `clientId` — required, must reference an existing client

**Response: `201 Created`** — Returns the full matter record including resolved `clientName`.

---

### PATCH /api/cases/:id

Updates one or more fields of an existing matter. Primarily used for status transitions.

**Authentication:** Required

**Request body (partial update):**
```json
{
  "status": "CLOSED"
}
```

**Response: `200 OK`** — Returns the full updated matter record with `clientName` resolved.

**Error response: `500`** if the case ID does not exist or a DB error occurs.

---

### DELETE /api/cases/:id

Permanently deletes a matter and all its associated foreign key references. This action is irreversible.

**Authentication:** Required

**Response: `200 OK`**
```json
{ "success": true }
```

---

## Hearings

### GET /api/hearings

Returns all hearing records ordered by `hearingDateTime` ascending, with `caseTitle` resolved from the `cases` table.

**Authentication:** Required

**Response: `200 OK`**
```json
[
  {
    "id": 1,
    "caseId": 1,
    "caseTitle": "Mehta vs State of Karnataka",
    "hearingDateTime": "2026-05-20T10:00:00Z",
    "courtroom": "Court Hall 3 — Block B",
    "agenda": "Cross-examination of star witness",
    "outcome": null,
    "reminderSent": false,
    "created_at": "2026-04-14T08:00:00Z"
  }
]
```

---

### POST /api/hearings

Schedules a new hearing for a matter.

**Authentication:** Required

**Request body:**
```json
{
  "caseId": 1,
  "hearingDateTime": "2026-05-20T10:00:00.000Z",
  "courtroom": "Court Hall 3 — Block B",
  "agenda": "Cross-examination of star witness",
  "reminderSent": false
}
```

**Validation rules:**
- `caseId` — required, must reference an existing case
- `hearingDateTime` — required, ISO 8601 timestamp
- `courtroom` — required
- `agenda` — required

**Response: `201 Created`** — Returns the full hearing record with `caseTitle` resolved.

---

## Documents

### GET /api/documents

Returns all document records ordered by most recent, with `caseTitle` resolved via foreign key join.

**Authentication:** Required

**Response: `200 OK`**
```json
[
  {
    "id": 1,
    "fileName": "witness_statement.pdf",
    "documentType": "EVIDENCE",
    "contentType": "application/pdf",
    "sizeBytes": 204800,
    "documentUrl": "https://xxxx.supabase.co/storage/v1/object/public/documents/...",
    "summary": "Written statement from primary witness",
    "caseId": 1,
    "caseTitle": "Mehta vs State of Karnataka",
    "uploadedBy": "3c0098c6-10b4-4313-8924-5e3555255634",
    "uploadedByName": "raghavarora2309@gmail.com",
    "created_at": "2026-04-14T09:00:00Z"
  }
]
```

---

### POST /api/documents

Uploads a document file to Supabase Storage and inserts a metadata record in the database. Accepts `multipart/form-data`.

**Authentication:** Required

**Form fields:**

| Field | Type | Required | Description |
|---|---|---|---|
| `file` | File | Yes | The binary file to upload |
| `documentType` | string | Yes | One of: `CASE_FILE`, `AGREEMENT`, `EVIDENCE`, `COURT_ORDER`, `INVOICE`, `OTHER` |
| `summary` | string | No | Internal note about the document |
| `caseId` | number | Yes | ID of the case this document belongs to |

**Response: `201 Created`** — Returns the full document record including the public storage URL.

**Error responses:**
- `400 Bad Request` — No file provided
- `500 Internal Server Error` — Storage upload failed (check bucket RLS policies) or DB insert failed

---

## Dashboard

### Data Source

The dashboard does not have a dedicated API route. The dashboard page (`/app/dashboard/page.tsx`) is a Next.js server component that runs 4 parallel Supabase queries on the server at render time:

1. `COUNT(*)` from `clients`
2. `COUNT(*)` from `cases` where status IN (`OPEN`, `IN_PROGRESS`)
3. `COUNT(*)` from `cases` where status = `CLOSED`
4. Upcoming hearings from `hearings` where `hearingDateTime >= now()`, ordered ascending, with case details joined

This data is passed as props to the `DashboardScreen` client component for rendering.

### Planned Spring Boot Endpoint

```
GET /api/dashboard/summary
```

**Response:**
```json
{
  "totalClients": 14,
  "activeCases": 7,
  "closedCases": 3,
  "upcomingHearingsCount": 4,
  "upcomingHearings": [
    {
      "id": 1,
      "caseNumber": "SUIT-2024-001",
      "caseTitle": "Mehta vs State",
      "hearingDateTime": "2026-05-20T10:00:00Z",
      "courtroom": "Court Hall 3"
    }
  ]
}
```

---

## Error Handling

All API route handlers return errors in a consistent format:

```json
{
  "error": "Human-readable error message",
  "details": "Optional additional detail from the database",
  "hint": "Optional suggestion from the database driver"
}
```

HTTP status codes used:

| Code | Meaning |
|---|---|
| `200` | Success (GET, PATCH, DELETE) |
| `201` | Created (POST) |
| `400` | Bad request — missing required fields |
| `401` | Unauthenticated — no valid session |
| `500` | Server error — DB or storage failure |

---

## Spring Boot Migration Plan

When the Spring Boot API is ready, the migration will follow this sequence:

1. Deploy Spring Boot service alongside Next.js on AWS
2. Update Next.js Route Handlers to proxy calls to `http://spring-backend:8080/api/*`
3. Verify parity between current and new responses
4. Switch frontend fetch calls directly to Spring Boot (via Nginx routing at `/api/*`)
5. Remove Next.js Route Handlers
6. Spring Boot takes full ownership of the API layer
