# Data Schema

The current Next.js-only version stores records in `frontend/data/db.json`, but the model remains structured like relational tables for an easy future migration.

## Collections / Tables

### `users`

- `id` bigint PK
- `full_name` varchar
- `email` varchar unique
- `password` varchar
- `role` enum/string

### `clients`

- `id` bigint PK
- `full_name` varchar
- `email` varchar
- `phone` varchar
- `address` varchar
- `company_name` varchar
- `notes` text

### `cases`

- `id` bigint PK
- `case_number` varchar unique
- `title` varchar
- `description` text
- `court_name` varchar
- `judge_name` varchar
- `status` varchar
- `filing_date` date
- `next_hearing_date` date
- `client_id` bigint FK -> clients.id
- `advocate_id` bigint FK -> users.id
- `created_at` timestamp
- `updated_at` timestamp

### `hearings`

- `id` bigint PK
- `case_id` bigint FK -> cases.id
- `hearing_date_time` timestamp
- `courtroom` varchar
- `agenda` varchar
- `outcome` text
- `reminder_sent` boolean

### `case_documents`

- `id` bigint PK
- `file_name` varchar
- `stored_file_name` varchar unique
- `content_type` varchar
- `size_bytes` bigint
- `document_type` varchar
- `case_id` bigint FK -> cases.id
- `uploaded_by` bigint FK -> users.id
- `uploaded_at` timestamp
