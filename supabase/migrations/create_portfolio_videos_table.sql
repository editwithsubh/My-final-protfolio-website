-- ============================================================
-- Migration: Create public.portfolio_videos table + RLS policies
-- Run this in: Supabase Dashboard → SQL Editor → New Query
-- ============================================================

-- 1. Enable uuid-ossp extension (safe to run again if already enabled)
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 2. Create the portfolio_videos table
CREATE TABLE IF NOT EXISTS public.portfolio_videos (
  id          UUID            PRIMARY KEY DEFAULT uuid_generate_v4(),
  title       TEXT            NOT NULL,
  description TEXT,
  youtube_url TEXT,
  video_id    TEXT,                                -- extracted YouTube video ID
  category    TEXT,
  created_at  TIMESTAMPTZ     DEFAULT NOW()
);

-- 3. Enable Row Level Security
ALTER TABLE public.portfolio_videos ENABLE ROW LEVEL SECURITY;

-- ============================================================
-- RLS Policies (admin = shubhams6068@gmail.com)
-- ============================================================

-- Policy 1: Anyone (anon + authenticated) can view all portfolio videos
CREATE POLICY "Public can view all portfolio videos"
  ON public.portfolio_videos
  FOR SELECT
  USING (true);

-- Policy 2: Only admin can INSERT portfolio videos
CREATE POLICY "Admin can insert portfolio videos"
  ON public.portfolio_videos
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.jwt()->>'email' = 'shubhams6068@gmail.com');

-- Policy 3: Only admin can UPDATE portfolio videos
CREATE POLICY "Admin can update portfolio videos"
  ON public.portfolio_videos
  FOR UPDATE
  TO authenticated
  USING (auth.jwt()->>'email' = 'shubhams6068@gmail.com')
  WITH CHECK (auth.jwt()->>'email' = 'shubhams6068@gmail.com');

-- Policy 4: Only admin can DELETE portfolio videos
CREATE POLICY "Admin can delete portfolio videos"
  ON public.portfolio_videos
  FOR DELETE
  TO authenticated
  USING (auth.jwt()->>'email' = 'shubhams6068@gmail.com');

-- ============================================================
-- Index for faster ordering on the portfolio page
-- ============================================================
CREATE INDEX IF NOT EXISTS idx_portfolio_videos_created_at
  ON public.portfolio_videos (created_at DESC);

-- ============================================================
-- Seed data: 3 sample videos so the portfolio page isn't empty
-- ============================================================
INSERT INTO public.portfolio_videos (title, description, youtube_url, video_id, category)
VALUES
  (
    'Cinematic Color Grading Tutorial',
    'Learn how to create a cinematic look for your videos using DaVinci Resolve.',
    'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
    'dQw4w9WgXcQ',
    'YouTube'
  ),
  (
    'Professional Video Editing Workflow',
    'My complete editing workflow from raw footage to final export.',
    'https://www.youtube.com/watch?v=jNQXAC9IVRw',
    'jNQXAC9IVRw',
    'Color Grading'
  ),
  (
    'Mobile App UI Design Breakdown',
    'Breaking down a sleek mobile app design and explaining the thought process.',
    'https://www.youtube.com/watch?v=9bZkp7q19f0',
    '9bZkp7q19f0',
    'Motion Graphics'
  );
