-- ============================================================================
-- Property Ally OS — Module Tables
-- Run this ONCE in Supabase Dashboard → SQL Editor → New Query → Run.
-- Safe to re-run (uses IF NOT EXISTS + idempotent seed).
-- ============================================================================

-- ----------------------------------------------------------------------------
-- FRONTEND: Property CRM — leads
-- ----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS crm_leads (
  id          bigint GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  name        text NOT NULL,
  phone       text,
  budget      bigint DEFAULT 0,
  type        text DEFAULT 'Apartment',
  location    text,
  stage       int DEFAULT 0,           -- 0 New, 1 Contacted, 2 Site Visit, 3 Negotiation, 4 Closed
  source      text DEFAULT 'Website',
  hot         boolean DEFAULT false,
  created_at  timestamptz DEFAULT now()
);

-- ----------------------------------------------------------------------------
-- FRONTEND: Transaction Layer — deals
-- ----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS deals (
  id          bigint GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  deal_code   text,
  property    text NOT NULL,
  buyer       text,
  value       bigint DEFAULT 0,
  stage       int DEFAULT 0,           -- 0 Interested .. 4 Registered
  agent       text,
  deal_date   date DEFAULT now(),
  created_at  timestamptz DEFAULT now()
);

-- ----------------------------------------------------------------------------
-- ADMIN: Channel Partner Network
-- ----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS channel_partners (
  id          bigint GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  name        text NOT NULL,
  owner       text,
  city        text,
  tier        text DEFAULT 'Silver',   -- Bronze, Silver, Gold, Platinum
  deals       int DEFAULT 0,
  commission  bigint DEFAULT 0,
  rating      numeric DEFAULT 4.0,
  phone       text,
  email       text,
  active      boolean DEFAULT true,
  joined      date DEFAULT now(),
  created_at  timestamptz DEFAULT now()
);

CREATE TABLE IF NOT EXISTS cp_leads (
  id          bigint GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  cp          text NOT NULL,
  buyer       text,
  project     text,
  value       bigint DEFAULT 0,
  stage       text DEFAULT 'Interested',
  comm        numeric DEFAULT 2,
  lead_date   date DEFAULT now(),
  created_at  timestamptz DEFAULT now()
);

-- ----------------------------------------------------------------------------
-- ADMIN: Builder ERP
-- ----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS builder_projects (
  id          bigint GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  name        text NOT NULL,
  location    text,
  total_units int DEFAULT 0,
  booked      int DEFAULT 0,
  available   int DEFAULT 0,
  price_range text,
  possession  text,
  status      text DEFAULT 'Under Construction',
  completion  int DEFAULT 0,
  rera        text,
  type        text DEFAULT 'Residential',
  created_at  timestamptz DEFAULT now()
);

CREATE TABLE IF NOT EXISTS builder_bookings (
  id           bigint GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  booking_code text,
  buyer        text NOT NULL,
  unit         text,
  project      text,
  value        bigint DEFAULT 0,
  token        bigint DEFAULT 0,
  status       text DEFAULT 'Active',
  booking_date date DEFAULT now(),
  phone        text,
  created_at   timestamptz DEFAULT now()
);

-- ----------------------------------------------------------------------------
-- ADMIN: Society OS
-- ----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS society_visitors (
  id          bigint GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  name        text NOT NULL,
  purpose     text DEFAULT 'Personal Visit',
  flat        text,
  visit_time  text,
  status      text DEFAULT 'Inside',
  created_at  timestamptz DEFAULT now()
);

CREATE TABLE IF NOT EXISTS society_bills (
  id          bigint GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  flat        text NOT NULL,
  resident    text,
  amount      bigint DEFAULT 0,
  month       text,
  status      text DEFAULT 'Due',
  created_at  timestamptz DEFAULT now()
);

CREATE TABLE IF NOT EXISTS society_complaints (
  id          bigint GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  title       text NOT NULL,
  category    text DEFAULT 'General',
  flat        text,
  status      text DEFAULT 'Open',
  comp_date   date DEFAULT now(),
  votes       int DEFAULT 1,
  created_at  timestamptz DEFAULT now()
);

-- ----------------------------------------------------------------------------
-- ADMIN: Property Management
-- ----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS pm_screenings (
  id             bigint GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  name           text NOT NULL,
  employment     text,
  income         bigint DEFAULT 0,
  id_verified    boolean DEFAULT false,
  rental_history text,
  credit_score   int DEFAULT 0,
  status         text DEFAULT 'Review',
  created_at     timestamptz DEFAULT now()
);

CREATE TABLE IF NOT EXISTS pm_inspections (
  id          bigint GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  unit        text NOT NULL,
  type        text DEFAULT 'Periodic',
  insp_date   date DEFAULT now(),
  status      text DEFAULT 'Scheduled',
  inspector   text,
  created_at  timestamptz DEFAULT now()
);

CREATE TABLE IF NOT EXISTS pm_leases (
  id          bigint GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  unit        text NOT NULL,
  tenant      text,
  lease_end   date,
  rent        bigint DEFAULT 0,
  status      text DEFAULT 'Active',
  created_at  timestamptz DEFAULT now()
);

-- ----------------------------------------------------------------------------
-- ADMIN: Investment opportunities (shared with frontend Investment Layer)
-- ----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS investments (
  id            bigint GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  name          text NOT NULL,
  type          text DEFAULT 'Residential',
  location      text,
  total         bigint DEFAULT 0,
  min_invest    bigint DEFAULT 0,
  yield         numeric DEFAULT 0,
  appreciation  numeric DEFAULT 0,
  funded        int DEFAULT 0,
  investors     int DEFAULT 0,
  tenure        text,
  status        text DEFAULT 'Open',
  created_at    timestamptz DEFAULT now()
);

-- ============================================================================
-- Row-Level Security — permissive (anon read + write), matching properties table
-- ============================================================================
DO $$
DECLARE t text;
BEGIN
  FOREACH t IN ARRAY ARRAY[
    'crm_leads','deals','channel_partners','cp_leads','builder_projects',
    'builder_bookings','society_visitors','society_bills','society_complaints',
    'pm_screenings','pm_inspections','pm_leases','investments'
  ] LOOP
    EXECUTE format('ALTER TABLE %I ENABLE ROW LEVEL SECURITY;', t);
    EXECUTE format('DROP POLICY IF EXISTS "anon_all_%1$s" ON %1$I;', t);
    EXECUTE format('CREATE POLICY "anon_all_%1$s" ON %1$I FOR ALL USING (true) WITH CHECK (true);', t);
  END LOOP;
END $$;

-- ============================================================================
-- Seed data (only inserts if table is empty)
-- ============================================================================
INSERT INTO channel_partners (name, owner, city, tier, deals, commission, rating, phone, email, active, joined)
SELECT * FROM (VALUES
  ('Rajiv Properties','Rajiv Mehta','Gurgaon','Platinum',42,2850000,4.9,'+91 98765 43210','rajiv@rajivprop.com',true,DATE '2024-01-15'),
  ('Priya Real Estate','Priya Sharma','Delhi','Gold',28,1420000,4.7,'+91 87654 32109','priya@priyare.com',true,DATE '2024-03-22'),
  ('NRI Connect','Amit Gupta','Mumbai','Silver',12,680000,4.5,'+91 76543 21098','amit@nriconnect.in',true,DATE '2024-06-10'),
  ('Capital Realty','Vivek Jain','Gurgaon','Gold',19,980000,4.6,'+91 54321 09876','vivek@capitalrealty.co',true,DATE '2024-02-18')
) v WHERE NOT EXISTS (SELECT 1 FROM channel_partners);

INSERT INTO builder_projects (name, location, total_units, booked, available, price_range, possession, status, completion, rera, type)
SELECT * FROM (VALUES
  ('DLF Privana South','Sector 77, SPR',320,198,112,'₹6.5Cr–₹9Cr','Dec 2028','Under Construction',42,'HR/RERA/GUR/2025/301','Residential'),
  ('Godrej Aristocrat','Sector 49, Golf Course Ext',180,142,32,'₹3.2Cr–₹5Cr','Jun 2029','Under Construction',28,'HR/RERA/GUR/2025/302','Residential'),
  ('M3M Antalya Hills','Sector 79, SPR',450,310,120,'₹1.8Cr–₹3.5Cr','Mar 2027','Under Construction',68,'HR/RERA/GUR/2024/189','Residential')
) v WHERE NOT EXISTS (SELECT 1 FROM builder_projects);

INSERT INTO crm_leads (name, phone, budget, type, location, stage, source, hot)
SELECT * FROM (VALUES
  ('Arjun Sharma','+91 98765 43210',7500000,'Apartment','Gurgaon',0,'Website',true),
  ('Priya Nair','+91 87654 32109',15000000,'Villa','DLF Phase 5',2,'Referral',true),
  ('Rohit Verma','+91 76543 21098',5000000,'Apartment','Noida',1,'Facebook Ad',false)
) v WHERE NOT EXISTS (SELECT 1 FROM crm_leads);

INSERT INTO investments (name, type, location, total, min_invest, yield, appreciation, funded, investors, tenure, status)
SELECT * FROM (VALUES
  ('DLF Privana — Fractional','Residential','Sector 77, Gurgaon',75000000,1000000,8.2,14,68,42,'5 yrs','Open'),
  ('Cyber City Grade-A Office','Commercial','DLF Cyber City',120000000,500000,9.5,10,84,128,'7 yrs','Filling Fast'),
  ('Logistics Park — IMT Manesar','Warehouse','IMT Manesar',95000000,2000000,11,12,45,23,'6 yrs','Open')
) v WHERE NOT EXISTS (SELECT 1 FROM investments);

-- Done. Refresh your apps — modules now persist to Supabase.
