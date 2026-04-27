-- ============================================================
-- Migration: Align library purchases, RLS, and admin metadata
-- Run this in: Supabase Dashboard -> SQL Editor -> New Query
-- ============================================================

CREATE TABLE IF NOT EXISTS public.purchases (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  resource_id UUID REFERENCES public.resources(id) ON DELETE SET NULL,
  created_at TIMESTAMPTZ DEFAULT now()
);

ALTER TABLE public.purchases
  ALTER COLUMN resource_id DROP NOT NULL;

ALTER TABLE public.purchases
  ADD COLUMN IF NOT EXISTS blog_id UUID REFERENCES public.blogs(id) ON DELETE SET NULL,
  ADD COLUMN IF NOT EXISTS razorpay_order_id TEXT,
  ADD COLUMN IF NOT EXISTS razorpay_payment_id TEXT,
  ADD COLUMN IF NOT EXISTS amount NUMERIC(10, 2),
  ADD COLUMN IF NOT EXISTS currency TEXT DEFAULT 'INR';

ALTER TABLE public.purchases ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Users can read own purchases" ON public.purchases;
CREATE POLICY "Users can read own purchases"
  ON public.purchases
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

ALTER TABLE public.purchases DROP CONSTRAINT IF EXISTS purchases_content_check;
ALTER TABLE public.purchases
  ADD CONSTRAINT purchases_content_check CHECK (
    (resource_id IS NOT NULL AND blog_id IS NULL) OR
    (blog_id IS NOT NULL AND resource_id IS NULL)
  );

CREATE UNIQUE INDEX IF NOT EXISTS idx_purchases_user_resource_unique
  ON public.purchases (user_id, resource_id)
  WHERE resource_id IS NOT NULL;

CREATE UNIQUE INDEX IF NOT EXISTS idx_purchases_user_blog_unique
  ON public.purchases (user_id, blog_id)
  WHERE blog_id IS NOT NULL;

DROP POLICY IF EXISTS "Authenticated users can read paid blogs" ON public.blogs;
DROP POLICY IF EXISTS "Paid blogs readable by purchasers" ON public.blogs;
CREATE POLICY "Paid blogs readable by purchasers"
  ON public.blogs
  FOR SELECT
  TO authenticated
  USING (
    is_paid = false OR
    EXISTS (
      SELECT 1 FROM public.purchases
      WHERE purchases.user_id = auth.uid()
        AND purchases.blog_id = blogs.id
    )
  );

DROP POLICY IF EXISTS "Public can view all guide chapters" ON public.guide_chapters;
DROP POLICY IF EXISTS "Guide chapters readable by purchasers" ON public.guide_chapters;
CREATE POLICY "Guide chapters readable by purchasers"
  ON public.guide_chapters
  FOR SELECT
  USING (
    EXISTS (
      SELECT 1
      FROM public.resources r
      WHERE r.id = guide_chapters.resource_id
        AND (
          r.is_paid = false OR
          EXISTS (
            SELECT 1
            FROM public.purchases p
            WHERE p.user_id = auth.uid()
              AND p.resource_id = r.id
          )
        )
    )
  );

ALTER TABLE public.resources
  ADD COLUMN IF NOT EXISTS badge TEXT,
  ADD COLUMN IF NOT EXISTS like_count INTEGER DEFAULT 0;

ALTER TABLE public.portfolio_videos
  ADD COLUMN IF NOT EXISTS client TEXT;

CREATE TABLE IF NOT EXISTS public.resource_likes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  resource_id UUID NOT NULL REFERENCES public.resources(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ DEFAULT now(),
  UNIQUE(user_id, resource_id)
);

ALTER TABLE public.resource_likes ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Users can view all likes" ON public.resource_likes;
DROP POLICY IF EXISTS "Users can like" ON public.resource_likes;
DROP POLICY IF EXISTS "Users can unlike" ON public.resource_likes;

CREATE POLICY "Users can view all likes"
  ON public.resource_likes
  FOR SELECT
  USING (true);

CREATE POLICY "Users can like"
  ON public.resource_likes
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can unlike"
  ON public.resource_likes
  FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);
