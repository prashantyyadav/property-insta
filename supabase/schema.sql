-- ============================================================================
-- PropertyInsta – Supabase Database Schema
-- Run this in the Supabase SQL Editor: https://app.supabase.com
-- ============================================================================

-- 1. Properties table (main data store for all listings)
CREATE TABLE IF NOT EXISTS properties (
  id            BIGINT PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
  title         TEXT NOT NULL,
  location      TEXT NOT NULL,
  price         BIGINT NOT NULL,
  beds          INT DEFAULT 1,
  baths         INT DEFAULT 1,
  sqft          INT DEFAULT 500,
  type          TEXT DEFAULT 'Apartment',
  status        TEXT DEFAULT 'sale',
  builder       TEXT,
  rera_id       TEXT,
  possession_status TEXT DEFAULT 'Ready to Move',
  floor         TEXT,
  furnishing    TEXT,
  emi_estimate  BIGINT,
  bank_offers   BOOLEAN DEFAULT false,
  images        JSONB DEFAULT '[]'::jsonb,
  amenities     JSONB DEFAULT '[]'::jsonb,
  featured      BOOLEAN DEFAULT false,
  hot           BOOLEAN DEFAULT false,
  badge         TEXT,
  open_house    BOOLEAN DEFAULT false,
  facing        TEXT,
  parking       TEXT,
  price_per_sqft INT,
  verified      BOOLEAN DEFAULT false,
  views         INT DEFAULT 0,
  description   TEXT,
  agent_id      TEXT,
  agent_name    TEXT,
  agent_avatar  TEXT,
  agent_rating  NUMERIC(2,1),
  agent_sales   INT DEFAULT 0,
  agent_phone   TEXT,
  agent_email   TEXT,
  post_date     TEXT,
  comments      INT DEFAULT 0,
  shares        INT DEFAULT 0,
  lat           NUMERIC(10,7),
  lng           NUMERIC(10,7),
  neighborhood  JSONB DEFAULT '[]'::jsonb,
  floor_plan    TEXT,
  trending      BOOLEAN DEFAULT false,
  age           TEXT DEFAULT 'New',
  media_aspect_ratio TEXT DEFAULT '4/3',
  listing_status TEXT DEFAULT 'Ready to Move',
  created_at    TIMESTAMPTZ DEFAULT NOW(),
  updated_at    TIMESTAMPTZ DEFAULT NOW()
);

-- 2. Reels table
CREATE TABLE IF NOT EXISTS reels (
  id            BIGINT PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
  property_id   BIGINT REFERENCES properties(id) ON DELETE CASCADE,
  title         TEXT NOT NULL,
  location      TEXT NOT NULL,
  price         BIGINT NOT NULL,
  category      TEXT DEFAULT 'premium',
  video         TEXT NOT NULL,
  thumbnail     TEXT,
  description   TEXT,
  views         INT DEFAULT 0,
  likes         INT DEFAULT 0,
  status        TEXT DEFAULT 'Ready to Move',
  builder       TEXT,
  rera_id       TEXT,
  possession_date TEXT,
  sqft          INT DEFAULT 1000,
  furnishing    TEXT,
  floor         TEXT,
  emi_estimate  BIGINT,
  bank_offers   BOOLEAN DEFAULT false,
  created_at    TIMESTAMPTZ DEFAULT NOW()
);

-- 3. Stories table
CREATE TABLE IF NOT EXISTS stories (
  id            BIGINT PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
  property_id   BIGINT REFERENCES properties(id) ON DELETE CASCADE,
  image         TEXT NOT NULL,
  label         TEXT,
  agent_name    TEXT,
  created_at    TIMESTAMPTZ DEFAULT NOW()
);

-- 4. Builders table (for the "Builders" section in header)
CREATE TABLE IF NOT EXISTS builders (
  id            BIGINT PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
  name          TEXT NOT NULL,
  logo          TEXT,
  project_count INT DEFAULT 0,
  rating        NUMERIC(2,1),
  description   TEXT,
  website       TEXT,
  created_at    TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================================
-- Indexes
-- ============================================================================
CREATE INDEX IF NOT EXISTS idx_properties_status ON properties(status);
CREATE INDEX IF NOT EXISTS idx_properties_type ON properties(type);
CREATE INDEX IF NOT EXISTS idx_properties_price ON properties(price);
CREATE INDEX IF NOT EXISTS idx_properties_location ON properties(location);
CREATE INDEX IF NOT EXISTS idx_properties_featured ON properties(featured);
CREATE INDEX IF NOT EXISTS idx_properties_trending ON properties(trending);
CREATE INDEX IF NOT EXISTS idx_reels_category ON reels(category);

-- ============================================================================
-- Row-Level Security (RLS)
-- ============================================================================
ALTER TABLE properties ENABLE ROW LEVEL SECURITY;
ALTER TABLE reels ENABLE ROW LEVEL SECURITY;
ALTER TABLE stories ENABLE ROW LEVEL SECURITY;
ALTER TABLE builders ENABLE ROW LEVEL SECURITY;

-- Anyone can read (public main site)
CREATE POLICY "Public can read properties" ON properties FOR SELECT USING (true);
CREATE POLICY "Public can read reels"     ON reels     FOR SELECT USING (true);
CREATE POLICY "Public can read stories"   ON stories   FOR SELECT USING (true);
CREATE POLICY "Public can read builders"  ON builders  FOR SELECT USING (true);

-- Only authenticated users (admin panel) can insert/update/delete
CREATE POLICY "Authenticated can insert properties" ON properties FOR INSERT WITH CHECK (auth.role() = 'authenticated');
CREATE POLICY "Authenticated can update properties" ON properties FOR UPDATE USING (auth.role() = 'authenticated');
CREATE POLICY "Authenticated can delete properties" ON properties FOR DELETE USING (auth.role() = 'authenticated');

CREATE POLICY "Authenticated can insert reels" ON reels FOR INSERT WITH CHECK (auth.role() = 'authenticated');
CREATE POLICY "Authenticated can update reels" ON reels FOR UPDATE USING (auth.role() = 'authenticated');
CREATE POLICY "Authenticated can delete reels" ON reels FOR DELETE USING (auth.role() = 'authenticated');

CREATE POLICY "Authenticated can insert stories" ON stories FOR INSERT WITH CHECK (auth.role() = 'authenticated');
CREATE POLICY "Authenticated can update stories" ON stories FOR UPDATE USING (auth.role() = 'authenticated');
CREATE POLICY "Authenticated can delete stories" ON stories FOR DELETE USING (auth.role() = 'authenticated');

CREATE POLICY "Authenticated can insert builders" ON builders FOR INSERT WITH CHECK (auth.role() = 'authenticated');
CREATE POLICY "Authenticated can update builders" ON builders FOR UPDATE USING (auth.role() = 'authenticated');
CREATE POLICY "Authenticated can delete builders" ON builders FOR DELETE USING (auth.role() = 'authenticated');

-- ============================================================================
-- Auto-update updated_at trigger
-- ============================================================================
CREATE OR REPLACE FUNCTION update_modified_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER set_updated_at BEFORE UPDATE ON properties
  FOR EACH ROW EXECUTE FUNCTION update_modified_column();

-- ============================================================================
-- Enable real-time for all tables (for live UI updates)
-- ============================================================================
ALTER PUBLICATION supabase_realtime ADD TABLE properties;
ALTER PUBLICATION supabase_realtime ADD TABLE reels;
ALTER PUBLICATION supabase_realtime ADD TABLE stories;
ALTER PUBLICATION supabase_realtime ADD TABLE builders;