-- ============================================================
-- Purchase & Access System — Database Schema Rebuild
-- Run this in Supabase SQL Editor BEFORE deploying code changes
-- ============================================================

-- ============================================================
-- 1. PURCHASES TABLE (Drop & Recreate)
-- ============================================================
DROP TABLE IF EXISTS public.purchases;

CREATE TABLE public.purchases (
  id                  UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id             UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  resource_id         UUID REFERENCES public.resources(id) ON DELETE SET NULL,
  blog_id             UUID REFERENCES public.blogs(id) ON DELETE SET NULL,
  razorpay_order_id   TEXT,
  razorpay_payment_id TEXT,
  amount              NUMERIC(10, 2),
  currency            TEXT DEFAULT 'INR',
  created_at          TIMESTAMPTZ DEFAULT now(),

  -- Ensure exactly one of resource_id or blog_id is set (not both, not neither)
  CONSTRAINT purchases_content_check CHECK (
    (resource_id IS NOT NULL AND blog_id IS NULL) OR
    (blog_id IS NOT NULL AND resource_id IS NULL)
  ),

  -- Prevent duplicate purchases
  CONSTRAINT purchases_unique_resource UNIQUE (user_id, resource_id),
  CONSTRAINT purchases_unique_blog     UNIQUE (user_id, blog_id)
);

-- Enable Row Level Security
ALTER TABLE public.purchases ENABLE ROW LEVEL SECURITY;

-- Users can read ONLY their own purchases
CREATE POLICY "Users can read own purchases"
  ON public.purchases FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

-- Inserts happen server-side via service role key (bypasses RLS).
-- No INSERT policy needed for authenticated users.

-- ============================================================
-- 2. RESOURCES TABLE — Ensure required columns exist
-- ============================================================
ALTER TABLE public.resources ADD COLUMN IF NOT EXISTS is_paid          BOOLEAN DEFAULT false;
ALTER TABLE public.resources ADD COLUMN IF NOT EXISTS price            NUMERIC(10, 2) DEFAULT 0;
ALTER TABLE public.resources ADD COLUMN IF NOT EXISTS currency         TEXT DEFAULT 'INR';
ALTER TABLE public.resources ADD COLUMN IF NOT EXISTS status           TEXT DEFAULT 'published';
ALTER TABLE public.resources ADD COLUMN IF NOT EXISTS file_url         TEXT;
ALTER TABLE public.resources ADD COLUMN IF NOT EXISTS cover_image      TEXT;
ALTER TABLE public.resources ADD COLUMN IF NOT EXISTS excerpt          TEXT;
ALTER TABLE public.resources ADD COLUMN IF NOT EXISTS content          TEXT;
ALTER TABLE public.resources ADD COLUMN IF NOT EXISTS type             TEXT;
ALTER TABLE public.resources ADD COLUMN IF NOT EXISTS tags             TEXT[] DEFAULT '{}';
ALTER TABLE public.resources ADD COLUMN IF NOT EXISTS difficulty       TEXT;
ALTER TABLE public.resources ADD COLUMN IF NOT EXISTS duration_minutes INTEGER DEFAULT 0;

-- ============================================================
-- 3. BLOGS TABLE — Ensure required columns exist
-- ============================================================
ALTER TABLE public.blogs ADD COLUMN IF NOT EXISTS is_paid  BOOLEAN DEFAULT false;
ALTER TABLE public.blogs ADD COLUMN IF NOT EXISTS price    NUMERIC(10, 2) DEFAULT 0;
ALTER TABLE public.blogs ADD COLUMN IF NOT EXISTS currency TEXT DEFAULT 'INR';
ALTER TABLE public.blogs ADD COLUMN IF NOT EXISTS status   TEXT DEFAULT 'published';
