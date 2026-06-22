CREATE TABLE library_resources (
  id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  title TEXT NOT NULL,
  author TEXT NOT NULL DEFAULT 'St. John Paul II SS Nakuwadde',
  subject TEXT NOT NULL,
  class_level TEXT NOT NULL DEFAULT 'All Levels',
  category TEXT NOT NULL DEFAULT 'Revision Notes',
  description TEXT DEFAULT '',
  file_url TEXT NOT NULL,
  file_type TEXT NOT NULL DEFAULT 'pdf',
  cover_url TEXT DEFAULT '',
  download_count BIGINT NOT NULL DEFAULT 0
);

ALTER TABLE library_resources ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view library resources"
  ON library_resources
  FOR SELECT
  TO anon
  USING (true);

CREATE POLICY "Authenticated users can insert library resources"
  ON library_resources
  FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Authenticated users can update library resources"
  ON library_resources
  FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Authenticated users can delete library resources"
  ON library_resources
  FOR DELETE
  TO authenticated
  USING (true);

CREATE OR REPLACE FUNCTION increment_download_count(resource_id BIGINT)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  UPDATE library_resources
  SET download_count = download_count + 1
  WHERE id = resource_id;
END;
$$;

INSERT INTO storage.buckets (id, name, public, avif_autodetection, file_size_limit, allowed_mime_types)
VALUES ('library', 'library', true, false, 52428800, ARRAY['application/pdf', 'image/png', 'image/jpeg', 'image/webp', 'image/gif'])
ON CONFLICT (id) DO NOTHING;

CREATE POLICY "Public can view library files"
  ON storage.objects
  FOR SELECT
  TO public
  USING (bucket_id = 'library');

CREATE POLICY "Authenticated users can upload library files"
  ON storage.objects
  FOR INSERT
  TO authenticated
  WITH CHECK (bucket_id = 'library');

CREATE POLICY "Authenticated users can update library files"
  ON storage.objects
  FOR UPDATE
  TO authenticated
  USING (bucket_id = 'library');

CREATE POLICY "Authenticated users can delete library files"
  ON storage.objects
  FOR DELETE
  TO authenticated
  USING (bucket_id = 'library');
