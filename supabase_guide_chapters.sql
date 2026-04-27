-- Guide Chapters table: stores chapters linked to resources of type 'Guide'
CREATE TABLE IF NOT EXISTS public.guide_chapters (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  resource_id UUID NOT NULL REFERENCES public.resources(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  slug TEXT NOT NULL,
  content TEXT DEFAULT '',
  order_index INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Index for fast lookups
CREATE INDEX idx_guide_chapters_resource_id ON public.guide_chapters(resource_id);
CREATE UNIQUE INDEX idx_guide_chapters_resource_slug ON public.guide_chapters(resource_id, slug);

-- RLS Policies
ALTER TABLE public.guide_chapters ENABLE ROW LEVEL SECURITY;

-- Anyone can read chapters
CREATE POLICY "Public can view guide chapters"
  ON public.guide_chapters FOR SELECT
  USING (true);

-- Authenticated users can insert (admin check done at app level)
CREATE POLICY "Authenticated users can insert guide chapters"
  ON public.guide_chapters FOR INSERT
  TO authenticated
  WITH CHECK (true);

-- Authenticated users can update
CREATE POLICY "Authenticated users can update guide chapters"
  ON public.guide_chapters FOR UPDATE
  TO authenticated
  USING (true);

-- Authenticated users can delete
CREATE POLICY "Authenticated users can delete guide chapters"
  ON public.guide_chapters FOR DELETE
  TO authenticated
  USING (true);
