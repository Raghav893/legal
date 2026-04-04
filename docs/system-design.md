# System Design

## 1. Problem Statement

Small and mid-size law firms need one system to handle:

- client records
- legal matters
- upcoming hearings
- case-linked documents
- role-based visibility and actions

## 2. High-Level Architecture

```text
Next.js UI
   |
   +--> Next.js Route Handlers (/api/*)
   |
   +--> Local JSON repository
```

## 3. Main Roles

- `ADMIN`: user management, full access, reporting
- `ADVOCATE`: case ownership, hearings, documents, client work
- `ASSISTANT`: client intake, hearing coordination, document support

## 4. Core Domain Entities

- `UserAccount`
- `Client`
- `CaseFile`
- `Hearing`
- `CaseDocument`

## 5. Production Considerations

- JWT-based session auth
- validation at API boundary
- Dockerized deployment
- single runtime to deploy and maintain
