-- ============================================================
-- Migration: Add currency columns to paid blogs/resources
-- Run this in: Supabase Dashboard -> SQL Editor -> New Query
-- ============================================================

ALTER TABLE public.blogs
  ADD COLUMN IF NOT EXISTS currency TEXT DEFAULT 'INR';

ALTER TABLE public.resources
  ADD COLUMN IF NOT EXISTS currency TEXT DEFAULT 'INR';

UPDATE public.blogs SET currency = 'INR' WHERE currency IS NULL;
UPDATE public.resources SET currency = 'INR' WHERE currency IS NULL;
