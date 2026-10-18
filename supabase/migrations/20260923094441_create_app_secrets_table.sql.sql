/*
# Create app_secrets table for storing service API keys

1. New Tables
- `app_secrets`
  - `key` (text, primary key) — the secret name, e.g. RESEND_API_KEY
  - `value` (text, not null) — the secret value
  - `created_at` (timestamptz)

2. Security
- Enable RLS on `app_secrets`.
- No anon or authenticated access — only the service role (used by edge functions) can read/write.
- This ensures API keys are never exposed to the browser.
*/

CREATE TABLE IF NOT EXISTS app_secrets (
  key text PRIMARY KEY,
  value text NOT NULL,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE app_secrets ENABLE ROW LEVEL SECURITY;

-- No policies: only the service role (which bypasses RLS) can access this table.
