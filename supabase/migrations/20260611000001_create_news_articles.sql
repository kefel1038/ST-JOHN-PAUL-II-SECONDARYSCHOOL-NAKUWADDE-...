CREATE TABLE news_articles (
  id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  cat TEXT NOT NULL,
  title TEXT NOT NULL,
  date TEXT NOT NULL,
  author TEXT NOT NULL DEFAULT 'Admin',
  img TEXT NOT NULL DEFAULT '../hero_classroom.png',
  text TEXT NOT NULL
);

ALTER TABLE news_articles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view news articles"
  ON news_articles
  FOR SELECT
  TO anon
  USING (true);

CREATE POLICY "Authenticated users can insert news articles"
  ON news_articles
  FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Authenticated users can update news articles"
  ON news_articles
  FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Authenticated users can delete news articles"
  ON news_articles
  FOR DELETE
  TO authenticated
  USING (true);
