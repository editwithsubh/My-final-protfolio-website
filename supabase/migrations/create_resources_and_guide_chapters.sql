-- ============================================================
-- Migration: Create public.resources + public.guide_chapters
--            + Storage bucket RLS policies
-- Run this in: Supabase Dashboard → SQL Editor → New Query
-- ============================================================

-- 1. Enable uuid-ossp extension (safe to repeat)
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ============================================================
-- PART A — resources table
-- ============================================================

CREATE TABLE IF NOT EXISTS public.resources (
  id          UUID            PRIMARY KEY DEFAULT uuid_generate_v4(),
  title       TEXT            NOT NULL,
  description TEXT,
  type        TEXT,                                -- 'Article', 'PDF', 'File', 'Video', 'Guide'
  content     TEXT,
  file_url    TEXT,
  is_paid     BOOLEAN         DEFAULT false,
  price       DECIMAL(10,2)   DEFAULT 0,
  created_at  TIMESTAMPTZ     DEFAULT NOW()
);

ALTER TABLE public.resources ENABLE ROW LEVEL SECURITY;

-- Anyone can view all resources (public portfolio/shop page)
CREATE POLICY "Public can view all resources"
  ON public.resources
  FOR SELECT
  USING (true);

-- Authenticated users can INSERT
CREATE POLICY "Admins can insert resources"
  ON public.resources
  FOR INSERT
  TO authenticated
  WITH CHECK (true);

-- Authenticated users can UPDATE
CREATE POLICY "Admins can update resources"
  ON public.resources
  FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

-- Authenticated users can DELETE
CREATE POLICY "Admins can delete resources"
  ON public.resources
  FOR DELETE
  TO authenticated
  USING (true);

-- Index for faster ordering
CREATE INDEX IF NOT EXISTS idx_resources_created_at
  ON public.resources (created_at DESC);

-- ============================================================
-- PART B — guide_chapters table
-- ============================================================

CREATE TABLE IF NOT EXISTS public.guide_chapters (
  id            UUID            PRIMARY KEY DEFAULT uuid_generate_v4(),
  resource_id   UUID            NOT NULL REFERENCES public.resources(id) ON DELETE CASCADE,
  title         TEXT            NOT NULL,
  slug          TEXT,
  content       TEXT,
  order_index   INTEGER         DEFAULT 0,
  created_at    TIMESTAMPTZ     DEFAULT NOW()
);

ALTER TABLE public.guide_chapters ENABLE ROW LEVEL SECURITY;

-- Anyone can read chapters (they follow the parent resource visibility)
CREATE POLICY "Public can view all guide chapters"
  ON public.guide_chapters
  FOR SELECT
  USING (true);

-- Authenticated users can manage chapters
CREATE POLICY "Admins can insert guide chapters"
  ON public.guide_chapters
  FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Admins can update guide chapters"
  ON public.guide_chapters
  FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Admins can delete guide chapters"
  ON public.guide_chapters
  FOR DELETE
  TO authenticated
  USING (true);

-- Indexes for guide reader performance
CREATE INDEX IF NOT EXISTS idx_guide_chapters_resource_id
  ON public.guide_chapters (resource_id);
CREATE INDEX IF NOT EXISTS idx_guide_chapters_order
  ON public.guide_chapters (resource_id, order_index ASC);

-- ============================================================
-- PART C — Storage bucket RLS policies
-- (Run AFTER creating the "resources" bucket in the Dashboard)
-- ============================================================
-- These policies go on the storage.objects table for the 'resources' bucket.

-- Anyone can read/download files from the resources bucket
CREATE POLICY "Public can read resource files"
  ON storage.objects
  FOR SELECT
  USING (bucket_id = 'resources');

-- Authenticated users can upload files
CREATE POLICY "Admins can upload resource files"
  ON storage.objects
  FOR INSERT
  TO authenticated
  WITH CHECK (bucket_id = 'resources');

-- Authenticated users can update files
CREATE POLICY "Admins can update resource files"
  ON storage.objects
  FOR UPDATE
  TO authenticated
  USING (bucket_id = 'resources');

-- Authenticated users can delete files
CREATE POLICY "Admins can delete resource files"
  ON storage.objects
  FOR DELETE
  TO authenticated
  USING (bucket_id = 'resources');
