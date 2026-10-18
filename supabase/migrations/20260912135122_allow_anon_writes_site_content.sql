-- Allow the anon role to write to site_content so the admin panel
-- works without requiring owner login.
CREATE POLICY "anon_insert_site_content" ON site_content FOR INSERT
  TO anon, authenticated WITH CHECK (true);

CREATE POLICY "anon_update_site_content" ON site_content FOR UPDATE
  TO anon, authenticated USING (true) WITH CHECK (true);

CREATE POLICY "anon_delete_site_content" ON site_content FOR DELETE
  TO anon, authenticated USING (true);
