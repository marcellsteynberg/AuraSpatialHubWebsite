/*
# Lock down site_content writes to authenticated users only

## Purpose
The site_content table stores all editable website content. Previously, both anon
and authenticated roles could read AND write. Now we lock it down so:
- Anyone (anon) can READ the content — this is the published website.
- Only authenticated users (the site owner) can CREATE, UPDATE, or DELETE content.

## Changes
1. SELECT policy: kept open to anon + authenticated (public read for the live site).
2. INSERT policy: restricted to authenticated only.
3. UPDATE policy: restricted to authenticated only.
4. DELETE policy: restricted to authenticated only.

## Security
- RLS remains enabled on site_content.
- No data is lost — only policies change.
- The frontend admin panel will be gated behind Supabase email/password auth,
  so only the owner can sign in and get an authenticated session to perform writes.
*/

-- SELECT: anyone can read the published site content
DROP POLICY IF EXISTS "anon_select_site_content" ON site_content;
CREATE POLICY "anon_select_site_content" ON site_content
  FOR SELECT TO anon, authenticated USING (true);

-- INSERT: only authenticated users can create content
DROP POLICY IF EXISTS "anon_insert_site_content" ON site_content;
CREATE POLICY "authenticated_insert_site_content" ON site_content
  FOR INSERT TO authenticated WITH CHECK (true);

-- UPDATE: only authenticated users can update content
DROP POLICY IF EXISTS "anon_update_site_content" ON site_content;
CREATE POLICY "authenticated_update_site_content" ON site_content
  FOR UPDATE TO authenticated USING (true) WITH CHECK (true);

-- DELETE: only authenticated users can delete content
DROP POLICY IF EXISTS "anon_delete_site_content" ON site_content;
CREATE POLICY "authenticated_delete_site_content" ON site_content
  FOR DELETE TO authenticated USING (true);
