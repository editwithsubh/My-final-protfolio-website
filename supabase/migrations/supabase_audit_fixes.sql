-- ============================================================
-- PRODUCTION AUDIT FIXES — Run in Supabase SQL Editor
-- Date: 2026-03-31
-- ============================================================

-- ─── SEC-01: Fix blogs RLS — require purchase for paid blogs ───
-- Drop the overly permissive policy
DROP POLICY IF EXISTS "Authenticated users can read paid blogs" ON public.blogs;

-- Ensure the anon/public read policy for free blogs still works
DROP POLICY IF EXISTS "Anyone can read free blogs" ON public.blogs;
CREATE POLICY "Anyone can read free blogs"
  ON public.blogs FOR SELECT
  USING (is_paid = false OR is_paid IS NULL);

-- Paid blogs: only readable by users who have a purchase record
DROP POLICY IF EXISTS "Paid blogs readable by purchasers" ON public.blogs;
CREATE POLICY "Paid blogs readable by purchasers"
  ON public.blogs FOR SELECT
  TO authenticated
  USING (
    is_paid = false
    OR is_paid IS NULL
    OR EXISTS (
      SELECT 1 FROM public.purchases
      WHERE purchases.user_id = auth.uid()
        AND purchases.blog_id = blogs.id
    )
  );


-- ─── SEC-02: Fix guide_chapters RLS — require purchase for paid guide chapters ───
DROP POLICY IF EXISTS "Public can view guide chapters" ON public.guide_chapters;

CREATE POLICY "Guide chapters readable by purchasers or if guide is free"
  ON public.guide_chapters FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.resources r
      WHERE r.id = guide_chapters.resource_id
        AND (
          r.is_paid = false
          OR r.is_paid IS NULL
          OR EXISTS (
            SELECT 1 FROM public.purchases p
            WHERE p.user_id = auth.uid()
              AND p.resource_id = r.id
          )
        )
    )
  );


-- ─── DB-01: Ensure purchases table has correct schema ───
-- Add blog_id column if missing (safe — does nothing if already exists)
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_schema = 'public'
      AND table_name = 'purchases'
      AND column_name = 'blog_id'
  ) THEN
    ALTER TABLE public.purchases ADD COLUMN blog_id UUID REFERENCES public.blogs(id);
  END IF;
END $$;

-- Make resource_id nullable if it isn't already (for blog purchases)
ALTER TABLE public.purchases ALTER COLUMN resource_id DROP NOT NULL;

-- Add amount + currency columns if missing
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_schema = 'public'
      AND table_name = 'purchases'
      AND column_name = 'amount'
  ) THEN
    ALTER TABLE public.purchases ADD COLUMN amount NUMERIC;
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_schema = 'public'
      AND table_name = 'purchases'
      AND column_name = 'currency'
  ) THEN
    ALTER TABLE public.purchases ADD COLUMN currency TEXT DEFAULT 'INR';
  END IF;
END $$;


-- ─── PAY-01: Create contact_submissions table ───
CREATE TABLE IF NOT EXISTS public.contact_submissions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  project_type TEXT,
  budget TEXT,
  message TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT now()
);

ALTER TABLE public.contact_submissions ENABLE ROW LEVEL SECURITY;

-- Allow anyone (including anon) to insert contact submissions
CREATE POLICY "Anyone can submit contact form"
  ON public.contact_submissions FOR INSERT
  WITH CHECK (true);

-- Only authenticated admin can read submissions (app-level check)
CREATE POLICY "Authenticated users can read contact submissions"
  ON public.contact_submissions FOR SELECT
  TO authenticated
  USING (true);


-- ============================================================
-- Done! Verify by running:
-- SELECT policyname, cmd, qual FROM pg_policies WHERE tablename IN ('blogs', 'guide_chapters', 'purchases', 'contact_submissions');
-- ============================================================
