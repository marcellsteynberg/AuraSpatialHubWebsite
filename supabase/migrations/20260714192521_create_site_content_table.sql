/*
# Create site_content table for editable site content

## Overview
This migration creates a single-tenant `site_content` table that stores every
editable section of the Aura Spatial Hub website as a JSONB row. The site has
no sign-in screen, so policies allow the anon-key frontend to read and write
all rows (the data is intentionally public/shared). The table is seeded with
the default content matching the shipped site.

## 1. New Tables
- `site_content`
  - `section` (text, primary key) — e.g. 'hero', 'services', 'portfolio'
  - `data` (jsonb, not null) — the full content object for that section
  - `updated_at` (timestamptz) — last edit timestamp

## 2. Security (RLS)
- RLS enabled on `site_content`.
- Four separate CRUD policies (select/insert/update/delete) scoped to
  `anon, authenticated` because this is a no-auth single-tenant site whose
  data is intentionally public/shared. This is documented and intentional.

## 3. Seed Data
- One row per section (hero, services, portfolio, about, why, testimonials,
  contact) with the default content matching the production site.

## 4. Notes
- Uses `jsonb` so partial section updates are easy.
- `updated_at` auto-updates via a trigger so every edit is timestamped.
- Idempotent: safe to re-run (IF NOT EXISTS + DROP POLICY IF EXISTS).
*/

CREATE TABLE IF NOT EXISTS site_content (
  section text PRIMARY KEY,
  data jsonb NOT NULL,
  updated_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE site_content ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "anon_select_site_content" ON site_content;
CREATE POLICY "anon_select_site_content"
ON site_content FOR SELECT
TO anon, authenticated USING (true);

DROP POLICY IF EXISTS "anon_insert_site_content" ON site_content;
CREATE POLICY "anon_insert_site_content"
ON site_content FOR INSERT
TO anon, authenticated WITH CHECK (true);

DROP POLICY IF EXISTS "anon_update_site_content" ON site_content;
CREATE POLICY "anon_update_site_content"
ON site_content FOR UPDATE
TO anon, authenticated USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "anon_delete_site_content" ON site_content;
CREATE POLICY "anon_delete_site_content"
ON site_content FOR DELETE
TO anon, authenticated USING (true);

-- Auto-update updated_at on every row change.
CREATE OR REPLACE FUNCTION set_updated_at()
RETURNS trigger
LANGUAGE plpgsql
AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS site_content_updated_at ON site_content;
CREATE TRIGGER site_content_updated_at
BEFORE UPDATE ON site_content
FOR EACH ROW
EXECUTE FUNCTION set_updated_at();

-- Seed default content. ON CONFLICT means re-running won't overwrite edits.
INSERT INTO site_content (section, data) VALUES
  ('hero', '{"eyebrow":"Luxury Real Estate Visualization","title":"Aura Spatial Hub","subtitle":"Firm-Level Architectural Precision for Real Estate.","primaryCta":"View Portfolio","secondaryCta":"Book Consultation","video":"https://videos.pexels.com/video-files/5305710/5305710-uhd_3840_2160_30fps.mp4","poster":"https://images.pexels.com/photos/323780/pexels-photo-323780.jpeg?auto=compress&cs=tinysrgb&w=1920"}'::jsonb),
  ('services', '{"eyebrow":"What We Do","heading":"A complete visual language for every property.","intro":"Five disciplines, one standard of precision. Each service is delivered by a dedicated team and crafted to the brand standard of the world''s finest listings.","items":[{"id":"floorplans","title":"Floorplans","description":"Architecturally precise plans drafted to firm standards — millimetre-accurate, legible, and presentation-ready for the most discerning listings.","video":"https://videos.pexels.com/video-files/3195750/3195750-uhd_2560_1440_30fps.mp4","poster":"https://images.pexels.com/photos/6538833/pexels-photo-6538833.jpeg?auto=compress&cs=tinysrgb&w=1280"},{"id":"walkthroughs","title":"360 Walkthroughs","description":"Matterport-grade immersive walkthroughs that let qualified buyers navigate every room from anywhere — measured, branded, and seamless.","video":"https://videos.pexels.com/video-files/4434267/4434267-hd_1920_1080_30fps.mp4","poster":"https://images.pexels.com/photos/1571460/pexels-photo-1571460.jpeg?auto=compress&cs=tinysrgb&w=1280"},{"id":"staging","title":"Virtual Staging","description":"Photoreal interiors staged with curated furniture and lighting — transforming empty rooms into aspirational spaces without moving a single object.","video":"https://videos.pexels.com/video-files/4108608/4108608-uhd_2560_1440_30fps.mp4","poster":"https://images.pexels.com/photos/1571463/pexels-photo-1571463.jpeg?auto=compress&cs=tinysrgb&w=1280"},{"id":"fixer","title":"Fixer Upper Vision","description":"Reveal the hidden potential of any property — we visualise renovations, extensions, and reconfigurations so buyers see what could be, not just what is.","video":"https://videos.pexels.com/video-files/7578452/7578452-hd_1920_1080_30fps.mp4","poster":"https://images.pexels.com/photos/1396122/pexels-photo-1396122.jpeg?auto=compress&cs=tinysrgb&w=1280"},{"id":"cinematic","title":"Cinematic Videos","description":"Aerial drones, gimbal-grade interiors, and colour-graded editing craft a film that sells a lifestyle — not just a property.","video":"https://videos.pexels.com/video-files/4108608/4108608-uhd_2560_1440_30fps.mp4","poster":"https://images.pexels.com/photos/302769/pexels-photo-302769.jpeg?auto=compress&cs=tinysrgb&w=1280"}]}'::jsonb),
  ('portfolio', '{"eyebrow":"Selected Work","heading":"Properties we have rendered unforgettable.","items":[{"id":"p1","name":"Casa Serena","location":"Marbella, Spain","service":"Cinematic Video","image":"https://images.pexels.com/photos/1396122/pexels-photo-1396122.jpeg?auto=compress&cs=tinysrgb&w=1280","video":"https://videos.pexels.com/video-files/4108608/4108608-uhd_2560_1440_30fps.mp4","span":"tall"},{"id":"p2","name":"The Pavilion","location":"Beverly Hills, CA","service":"360 Walkthrough","image":"https://images.pexels.com/photos/1571460/pexels-photo-1571460.jpeg?auto=compress&cs=tinysrgb&w=1280","video":"https://videos.pexels.com/video-files/4434267/4434267-hd_1920_1080_30fps.mp4","span":"normal"},{"id":"p3","name":"Maison Lumière","location":"Côte d''Azur, France","service":"Virtual Staging","image":"https://images.pexels.com/photos/1571463/pexels-photo-1571463.jpeg?auto=compress&cs=tinysrgb&w=1280","video":"https://videos.pexels.com/video-files/4108608/4108608-uhd_2560_1440_30fps.mp4","span":"wide"},{"id":"p4","name":"Villa Aurelia","location":"Lake Como, Italy","service":"Cinematic Video","image":"https://images.pexels.com/photos/302769/pexels-photo-302769.jpeg?auto=compress&cs=tinysrgb&w=1280","video":"https://videos.pexels.com/video-files/7578452/7578452-hd_1920_1080_30fps.mp4","span":"normal"},{"id":"p5","name":"The Atelier","location":"Tribeca, New York","service":"Fixer Upper Vision","image":"https://images.pexels.com/photos/323780/pexels-photo-323780.jpeg?auto=compress&cs=tinysrgb&w=1280","video":"https://videos.pexels.com/video-files/3195750/3195750-uhd_2560_1440_30fps.mp4","span":"tall"},{"id":"p6","name":"Skyhouse One","location":"Singapore","service":"Floorplans","image":"https://images.pexels.com/photos/6538833/pexels-photo-6538833.jpeg?auto=compress&cs=tinysrgb&w=1280","video":"https://videos.pexels.com/video-files/5305710/5305710-uhd_3840_2160_30fps.mp4","span":"normal"},{"id":"p7","name":"Cliffside Manor","location":"Big Sur, California","service":"Cinematic Video","image":"https://images.pexels.com/photos/1115804/pexels-photo-1115804.jpeg?auto=compress&cs=tinysrgb&w=1280","video":"https://videos.pexels.com/video-files/4108608/4108608-uhd_2560_1440_30fps.mp4","span":"wide"},{"id":"p8","name":"Penthouse Nord","location":"Copenhagen, Denmark","service":"Virtual Staging","image":"https://images.pexels.com/photos/2724749/pexels-photo-2724749.jpeg?auto=compress&cs=tinysrgb&w=1280","video":"https://videos.pexels.com/video-files/4108608/4108608-uhd_2560_1440_30fps.mp4","span":"normal"}]}'::jsonb),
  ('about', '{"eyebrow":"The Studio","heading":"Precision is a discipline, not a finish.","paragraphs":["Aura Spatial Hub was founded on a simple conviction: that the visual presentation of a property should be held to the same exacting standard as the architecture itself.","We are a collective of architects, cinematographers, and visual strategists. Every floorplan is drafted to firm tolerances. Every frame is colour-graded for the light it will be seen in. Every walkthrough is measured to the millimetre.","From a modest penthouse to a nine-figure estate, our work gives buyers the feeling of being there — and gives agents a presentation worthy of the asking price."],"image":"https://images.pexels.com/photos/323780/pexels-photo-323780.jpeg?auto=compress&cs=tinysrgb&w=1400","statFigure":"12+","statLabel":"Years crafting the visual language of luxury real estate.","stats":[{"figure":"480+","label":"Properties Visualised"},{"figure":"38","label":"Countries Served"},{"figure":"4d","label":"Avg. Turnaround"}]}'::jsonb),
  ('why', '{"eyebrow":"Why Aura","heading":"The standard our clients are held to.","items":[{"title":"Photorealistic Rendering","description":"Indistinguishable from photography — down to the grain of the stone and the fall of light.","icon":"Aperture"},{"title":"Fast Turnaround","description":"From brief to delivery in days, not weeks. Dedicated production teams per project.","icon":"Zap"},{"title":"Matterport Specialists","description":"Certified capture and post-production for the industry-leading immersive platform.","icon":"Box"},{"title":"Luxury Marketing","description":"Every asset crafted to match the brand standard of the world''s finest listings.","icon":"Crown"},{"title":"Drone Photography","description":"Licensed aerial cinematography capturing the estate, the setting, and the approach.","icon":"Plane"},{"title":"Architectural Accuracy","description":"Drawings drafted to firm standards — precise, legible, and presentation-ready.","icon":"Compass"}]}'::jsonb),
  ('testimonials', '{"eyebrow":"Client Voices","heading":"Trusted by the world''s finest agencies.","items":[{"quote":"Aura Spatial Hub transformed an empty concrete shell into the most captivating listing we have ever marketed. The offers came within four days.","name":"Isabelle Moreau","title":"Principal, Moreau Estates","location":"Côte d''Azur"},{"quote":"Their cinematic work is genuinely on another level. Our clients felt the property before they ever stepped foot inside it.","name":"James Whitfield","title":"Director, Whitfield & Co.","location":"London"},{"quote":"The architectural accuracy of the floorplans is extraordinary. Every dimension was exact. A truly professional operation.","name":"Sofia Bianchi","title":"Founding Partner, Studio Bianchi","location":"Milan"},{"quote":"We engaged Aura for a nine-figure listing. The Matterport walkthrough alone closed the deal with an overseas buyer who never visited in person.","name":"Daniel Hartmann","title":"Head of Luxury Division, Hartmann Realty","location":"New York"}]}'::jsonb),
  ('contact', '{"eyebrow":"Begin a Project","heading":"Let''s craft something worthy of the address.","description":"Share the details of your listing and our studio will respond within one business day with a tailored proposal.","email":"studio@auraspatialhub.com","phone":"+1 (212) 555-0148","instagram":"https://instagram.com","linkedin":"https://linkedin.com"}'::jsonb)
ON CONFLICT (section) DO NOTHING;
