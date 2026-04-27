-- Migration: Add featured_home column to portfolio_videos
ALTER TABLE public.portfolio_videos
ADD COLUMN IF NOT EXISTS featured_home BOOLEAN DEFAULT false;
