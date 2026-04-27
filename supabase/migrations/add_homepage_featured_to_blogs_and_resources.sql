-- ============================================================
-- Migration: Add homepage feature flags to blogs and resources
-- Run this in: Supabase Dashboard -> SQL Editor -> New Query
-- ============================================================

ALTER TABLE public.blogs
  ADD COLUMN IF NOT EXISTS featured_home BOOLEAN DEFAULT false;

ALTER TABLE public.resources
  ADD COLUMN IF NOT EXISTS featured_home BOOLEAN DEFAULT false;

CREATE INDEX IF NOT EXISTS idx_blogs_featured_home
  ON public.blogs (featured_home, created_at DESC);

CREATE INDEX IF NOT EXISTS idx_resources_featured_home
  ON public.resources (featured_home, created_at DESC);
