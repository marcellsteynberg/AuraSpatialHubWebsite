/*
# Seed typography section for site-wide text style presets

## Overview
Adds a `typography` row to the existing `site_content` table to persist the
user's chosen text style preset. The `typography` section stores a single
`preset` string matching one of: editorial | modern | classic | mono | display.

## 1. New Tables
- None (uses existing `site_content` table).

## 2. Security
- No changes. Existing anon+authenticated CRUD policies on `site_content`
  already cover the new row.

## 3. Seed Data
- One new row: section='typography', data={"preset":"editorial"}

## 4. Notes
- ON CONFLICT DO NOTHING means re-running won't overwrite a saved choice.
*/

INSERT INTO site_content (section, data) VALUES
  ('typography', '{"preset":"editorial"}'::jsonb)
ON CONFLICT (section) DO NOTHING;
