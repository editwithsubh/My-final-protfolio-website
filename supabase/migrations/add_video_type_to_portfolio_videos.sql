-- Add video_type column to portfolio_videos table
-- Values: 'long' (16:9 landscape) or 'short' (9:16 vertical)
ALTER TABLE public.portfolio_videos
  ADD COLUMN IF NOT EXISTS video_type TEXT NOT NULL DEFAULT 'long'
  CHECK (video_type IN ('long', 'short'));

-- Update existing Short-Form category videos to 'short' type automatically
UPDATE public.portfolio_videos SET video_type = 'short' WHERE category = 'Short-Form';
