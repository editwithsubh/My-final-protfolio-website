-- ============================================================
-- Migration: Upgrade blogs/resources for richer admin workflows
-- Run this in: Supabase Dashboard -> SQL Editor -> New Query
-- ============================================================

ALTER TABLE public.blogs
  ADD COLUMN IF NOT EXISTS cover_image TEXT,
  ADD COLUMN IF NOT EXISTS excerpt TEXT,
  ADD COLUMN IF NOT EXISTS tags TEXT[] DEFAULT '{}',
  ADD COLUMN IF NOT EXISTS category TEXT DEFAULT 'General',
  ADD COLUMN IF NOT EXISTS reading_time INT DEFAULT 0,
  ADD COLUMN IF NOT EXISTS status TEXT DEFAULT 'published' CHECK (status IN ('draft', 'published')),
  ADD COLUMN IF NOT EXISTS meta_title TEXT,
  ADD COLUMN IF NOT EXISTS meta_description TEXT,
  ADD COLUMN IF NOT EXISTS published_at TIMESTAMPTZ DEFAULT now();

ALTER TABLE public.resources
  ADD COLUMN IF NOT EXISTS cover_image TEXT,
  ADD COLUMN IF NOT EXISTS tags TEXT[] DEFAULT '{}',
  ADD COLUMN IF NOT EXISTS excerpt TEXT,
  ADD COLUMN IF NOT EXISTS status TEXT DEFAULT 'published' CHECK (status IN ('draft', 'published')),
  ADD COLUMN IF NOT EXISTS difficulty TEXT DEFAULT 'Beginner' CHECK (difficulty IN ('Beginner', 'Intermediate', 'Advanced')),
  ADD COLUMN IF NOT EXISTS duration_minutes INT DEFAULT 0;

CREATE INDEX IF NOT EXISTS idx_blogs_status ON public.blogs (status);
CREATE INDEX IF NOT EXISTS idx_blogs_category ON public.blogs (category);
CREATE INDEX IF NOT EXISTS idx_resources_status ON public.resources (status);
CREATE INDEX IF NOT EXISTS idx_resources_type ON public.resources (type);
