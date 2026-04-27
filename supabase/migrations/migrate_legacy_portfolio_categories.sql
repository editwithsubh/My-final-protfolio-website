-- ============================================================
-- Migration: Map legacy portfolio category values to new ones
-- Run this in: Supabase Dashboard → SQL Editor → New Query
-- 
-- The CATEGORIES constant was changed from web-dev labels to
-- video-editing labels. This updates any existing rows.
-- ============================================================

UPDATE public.portfolio_videos SET category = 'YouTube'         WHERE category = 'Web Development';
UPDATE public.portfolio_videos SET category = 'Short-Form'      WHERE category = 'Mobile App';
UPDATE public.portfolio_videos SET category = 'Motion Graphics'  WHERE category = 'UI/UX Design';
-- 'Other' stays as 'Other' (no change needed)
