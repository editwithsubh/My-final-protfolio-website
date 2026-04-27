-- ============================================================
-- Migration: Support purchases for both resources and blogs
-- Run this in: Supabase Dashboard -> SQL Editor -> New Query
-- ============================================================

ALTER TABLE public.purchases
  ALTER COLUMN resource_id DROP NOT NULL;

ALTER TABLE public.purchases
  ADD COLUMN IF NOT EXISTS blog_id UUID REFERENCES public.blogs(id) ON DELETE CASCADE;

CREATE UNIQUE INDEX IF NOT EXISTS idx_purchases_user_resource_unique
  ON public.purchases (user_id, resource_id)
  WHERE resource_id IS NOT NULL;

CREATE UNIQUE INDEX IF NOT EXISTS idx_purchases_user_blog_unique
  ON public.purchases (user_id, blog_id)
  WHERE blog_id IS NOT NULL;
