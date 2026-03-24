-- ============================================================
-- Migration: Create public.blogs table + RLS policies
-- Run this in: Supabase Dashboard → SQL Editor → New Query
-- ============================================================

-- 1. Enable uuid-ossp extension (if not already enabled)
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 2. Create the blogs table
CREATE TABLE IF NOT EXISTS public.blogs (
  id          UUID            PRIMARY KEY DEFAULT uuid_generate_v4(),
  title       TEXT            NOT NULL,
  slug        TEXT            UNIQUE NOT NULL,
  content     TEXT,                               -- stores HTML from rich text editor
  is_paid     BOOLEAN         DEFAULT false,
  price       DECIMAL(10,2)   DEFAULT 0,
  created_at  TIMESTAMPTZ     DEFAULT NOW()
);

-- 3. Enable Row Level Security
ALTER TABLE public.blogs ENABLE ROW LEVEL SECURITY;

-- ============================================================
-- RLS Policies (admin = shubhams6068@gmail.com)
-- ============================================================

-- Policy 1: Anyone can read FREE blog posts (is_paid = false)
CREATE POLICY "Public can read free blogs"
  ON public.blogs
  FOR SELECT
  USING (is_paid = false);

-- Policy 2: Authenticated users can read PAID blog posts (paywall gate)
CREATE POLICY "Authenticated users can read paid blogs"
  ON public.blogs
  FOR SELECT
  TO authenticated
  USING (is_paid = true);

-- Policy 3: Only admin can INSERT blogs
CREATE POLICY "Admin can insert blogs"
  ON public.blogs
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.jwt()->>'email' = 'shubhams6068@gmail.com');

-- Policy 4: Only admin can UPDATE blogs
CREATE POLICY "Admin can update blogs"
  ON public.blogs
  FOR UPDATE
  TO authenticated
  USING (auth.jwt()->>'email' = 'shubhams6068@gmail.com')
  WITH CHECK (auth.jwt()->>'email' = 'shubhams6068@gmail.com');

-- Policy 5: Only admin can DELETE blogs
CREATE POLICY "Admin can delete blogs"
  ON public.blogs
  FOR DELETE
  TO authenticated
  USING (auth.jwt()->>'email' = 'shubhams6068@gmail.com');

-- ============================================================
-- Optional: Index on slug for faster lookups (blog detail page)
-- ============================================================
CREATE INDEX IF NOT EXISTS idx_blogs_slug ON public.blogs (slug);
CREATE INDEX IF NOT EXISTS idx_blogs_created_at ON public.blogs (created_at DESC);
