/*
# Create saved_locations table (single-tenant, no auth)

1. New Tables
- `saved_locations`
  - `id` (uuid, primary key)
  - `name` (text, display name of the location, e.g. "London")
  - `latitude` (double precision, geographic latitude)
  - `longitude` (double precision, geographic longitude)
  - `country` (text, country code or name for context)
  - `timezone` (text, IANA timezone identifier)
  - `created_at` (timestamptz, when the location was saved)
2. Security
- Enable RLS on `saved_locations`.
- Allow anon + authenticated CRUD because the data is intentionally shared/public (no sign-in screen).
*/

CREATE TABLE IF NOT EXISTS saved_locations (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  latitude double precision NOT NULL,
  longitude double precision NOT NULL,
  country text,
  timezone text,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE saved_locations ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "anon_select_saved_locations" ON saved_locations;
CREATE POLICY "anon_select_saved_locations" ON saved_locations FOR SELECT
  TO anon, authenticated USING (true);

DROP POLICY IF EXISTS "anon_insert_saved_locations" ON saved_locations;
CREATE POLICY "anon_insert_saved_locations" ON saved_locations FOR INSERT
  TO anon, authenticated WITH CHECK (true);

DROP POLICY IF EXISTS "anon_update_saved_locations" ON saved_locations;
CREATE POLICY "anon_update_saved_locations" ON saved_locations FOR UPDATE
  TO anon, authenticated USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "anon_delete_saved_locations" ON saved_locations;
CREATE POLICY "anon_delete_saved_locations" ON saved_locations FOR DELETE
  TO anon, authenticated USING (true);
