/*
# Seed layout section for draggable element positions

## Overview
Adds a `layout` row to the existing `site_content` table to persist user-
rearranged positions of text/button elements when "Move Mode" is active.
The `layout` section stores a `positions` JSONB object mapping element IDs
to `{x, y}` offsets. Starts empty (all elements in their original positions).

## 1. New Tables
- None (uses existing `site_content` table).

## 2. Security
- No changes. The existing anon+authenticated CRUD policies on
  `site_content` already cover the new row.

## 3. Seed Data
- One new row: section='layout', data={"positions":{}}

## 4. Notes
- ON CONFLICT DO NOTHING means re-running won't overwrite saved positions.
*/

INSERT INTO site_content (section, data) VALUES
  ('layout', '{"positions":{}}'::jsonb)
ON CONFLICT (section) DO NOTHING;
