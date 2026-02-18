-- ARCH2ARCH DATABASE SCHEMA
-- Run this in Supabase SQL Editor (supabase.com → your project → SQL Editor)

-- Oura tokens storage
CREATE TABLE IF NOT EXISTS oura_tokens (
  id SERIAL PRIMARY KEY,
  access_token TEXT NOT NULL,
  refresh_token TEXT NOT NULL,
  expires_at TIMESTAMPTZ NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Daily health metrics (from Oura + Apple Watch)
CREATE TABLE IF NOT EXISTS daily_metrics (
  id SERIAL PRIMARY KEY,
  date DATE UNIQUE NOT NULL,
  -- Oura scores
  sleep_score INT,
  readiness_score INT,
  resilience_level TEXT,
  -- Oura sleep contributors
  sleep_deep INT,
  sleep_efficiency INT,
  sleep_latency INT,
  sleep_rem INT,
  sleep_restfulness INT,
  sleep_timing INT,
  sleep_total INT,
  -- Oura readiness contributors
  readiness_hrv_balance INT,
  readiness_resting_hr INT,
  readiness_recovery_index INT,
  readiness_sleep_balance INT,
  readiness_prev_night INT,
  -- Oura body
  spo2_avg DECIMAL(5,2),
  breathing_disturbance_index DECIMAL(5,2),
  temperature_deviation DECIMAL(5,2),
  -- Apple Watch / Oura
  resting_hr DECIMAL(5,1),
  hrv_sdnn DECIMAL(5,1),
  vo2max DECIMAL(5,1),
  -- Apple Watch
  steps INT,
  active_energy_kcal INT,
  exercise_time_min INT,
  body_weight_kg DECIMAL(5,1),
  -- Source tracking
  oura_synced BOOLEAN DEFAULT FALSE,
  apple_synced BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Workouts (from Apple Watch / Health Auto Export)
CREATE TABLE IF NOT EXISTS workouts (
  id SERIAL PRIMARY KEY,
  date DATE NOT NULL,
  start_time TEXT,
  activity TEXT NOT NULL,
  duration_min DECIMAL(6,1),
  distance_km DECIMAL(7,2),
  energy_kcal INT,
  avg_hr INT,
  max_hr INT,
  source TEXT DEFAULT 'apple_watch',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Cumulative training distances
CREATE TABLE IF NOT EXISTS training_totals (
  id SERIAL PRIMARY KEY,
  date DATE UNIQUE NOT NULL,
  run_km DECIMAL(8,1) DEFAULT 0,
  swim_km DECIMAL(8,1) DEFAULT 0,
  bike_km DECIMAL(8,1) DEFAULT 0,
  total_km DECIMAL(8,1) DEFAULT 0,
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Blog posts
CREATE TABLE IF NOT EXISTS blog_posts (
  id SERIAL PRIMARY KEY,
  title TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  content TEXT NOT NULL,
  excerpt TEXT,
  image_url TEXT,
  tags TEXT[],
  published BOOLEAN DEFAULT FALSE,
  published_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Guestbook messages
CREATE TABLE IF NOT EXISTS guestbook (
  id SERIAL PRIMARY KEY,
  name TEXT NOT NULL,
  message TEXT NOT NULL,
  approved BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Bloodwork (private)
CREATE TABLE IF NOT EXISTS bloodwork (
  id SERIAL PRIMARY KEY,
  date DATE NOT NULL,
  marker TEXT NOT NULL,
  value DECIMAL(10,3),
  unit TEXT,
  reference_low DECIMAL(10,3),
  reference_high DECIMAL(10,3),
  status TEXT, -- optimal, normal, watch, attention, flag
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Weekly auto-generated summaries
CREATE TABLE IF NOT EXISTS weekly_summaries (
  id SERIAL PRIMARY KEY,
  week_start DATE UNIQUE NOT NULL,
  week_end DATE NOT NULL,
  sessions INT,
  total_minutes INT,
  swim_km DECIMAL(6,1),
  run_km DECIMAL(6,1),
  bike_km DECIMAL(6,1),
  avg_sleep_score INT,
  avg_readiness_score INT,
  avg_resting_hr DECIMAL(4,1),
  avg_hrv DECIMAL(4,1),
  summary_text TEXT, -- auto-generated narrative
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_daily_metrics_date ON daily_metrics(date);
CREATE INDEX IF NOT EXISTS idx_workouts_date ON workouts(date);
CREATE INDEX IF NOT EXISTS idx_workouts_activity ON workouts(activity);
CREATE INDEX IF NOT EXISTS idx_blog_posts_slug ON blog_posts(slug);
CREATE INDEX IF NOT EXISTS idx_blog_posts_published ON blog_posts(published);
CREATE INDEX IF NOT EXISTS idx_guestbook_approved ON guestbook(approved);
CREATE INDEX IF NOT EXISTS idx_bloodwork_date ON bloodwork(date);
