-- ============================================================================
-- Migration: Fix reels table schema and RLS policies
-- Run this in the Supabase SQL Editor
-- ============================================================================

-- 1. Add missing columns to the reels table
ALTER TABLE reels ADD COLUMN IF NOT EXISTS duration TEXT DEFAULT '00:15';
ALTER TABLE reels ADD COLUMN IF NOT EXISTS tags JSONB DEFAULT '[]'::jsonb;
ALTER TABLE reels ADD COLUMN IF NOT EXISTS agent_name TEXT DEFAULT '';

-- 2. Add anon-friendly RLS policies for the admin panel (which uses anon key)
-- The admin panel uses raw fetch with anon key, so we need policies that allow anon writes
-- DROP existing authenticated-only policies first
DROP POLICY IF EXISTS "Authenticated can insert reels" ON reels;
DROP POLICY IF EXISTS "Authenticated can update reels" ON reels;
DROP POLICY IF EXISTS "Authenticated can delete reels" ON reels;

-- Create new policies that allow both authenticated AND anon writes
CREATE POLICY "Anyone can insert reels" ON reels FOR INSERT WITH CHECK (true);
CREATE POLICY "Anyone can update reels" ON reels FOR UPDATE USING (true);
CREATE POLICY "Anyone can delete reels" ON reels FOR DELETE USING (true);

-- Also fix properties RLS for consistency (admin panel writes properties too)
DROP POLICY IF EXISTS "Authenticated can insert properties" ON properties;
DROP POLICY IF EXISTS "Authenticated can update properties" ON properties;
DROP POLICY IF EXISTS "Authenticated can delete properties" ON properties;

CREATE POLICY "Anyone can insert properties" ON properties FOR INSERT WITH CHECK (true);
CREATE POLICY "Anyone can update properties" ON properties FOR UPDATE USING (true);
CREATE POLICY "Anyone can delete properties" ON properties FOR DELETE USING (true);