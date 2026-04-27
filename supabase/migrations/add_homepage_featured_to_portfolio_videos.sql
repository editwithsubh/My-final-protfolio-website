-- ============================================================
-- Migration: Add homepage feature flag to portfolio videos
-- Run this in: Supabase Dashboard -> SQL Editor -> New Query
-- ============================================================

ALTER TABLE public.portfolio_videos
  ADD COLUMN IF NOT EXISTS featured_home BOOLEAN DEFAULT false;

CREATE INDEX IF NOT EXISTS idx_portfolio_videos_featured_home
  ON public.portfolio_videos (featured_home, created_at DESC);
