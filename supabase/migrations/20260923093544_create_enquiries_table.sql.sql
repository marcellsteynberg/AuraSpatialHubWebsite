/*
# Create enquiries table for contact form submissions

1. New Tables
- `enquiries`
  - `id` (uuid, primary key)
  - `name` (text, not null) — submitter's full name
  - `email` (text, not null) — submitter's email address
  - `phone` (text) — optional phone number
  - `company` (text) — optional company/agency name
  - `inquiry_type` (text, not null) — which service they're asking about
  - `message` (text, not null) — their enquiry details
  - `created_at` (timestamptz, defaults to now())

2. Security
- Enable RLS on `enquiries`.
- Allow anon + authenticated INSERT only (the contact form is public, no sign-in).
- No SELECT/UPDATE/DELETE for anon — only the service role (edge function) can read these.
*/

CREATE TABLE IF NOT EXISTS enquiries (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  email text NOT NULL,
  phone text,
  company text,
  inquiry_type text NOT NULL,
  message text NOT NULL,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE enquiries ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "anon_insert_enquiries" ON enquiries;
CREATE POLICY "anon_insert_enquiries"
  ON enquiries FOR INSERT
  TO anon, authenticated
  WITH CHECK (true);
