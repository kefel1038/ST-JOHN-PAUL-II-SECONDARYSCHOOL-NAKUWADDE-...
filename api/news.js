const { createClient } = require('@supabase/supabase-js');

module.exports = async (req, res) => {
  const supabase = createClient(
    process.env.SUPABASE_URL,
    process.env.SUPABASE_SERVICE_ROLE_KEY
  );

  if (req.method === 'GET') {
    const { data, error } = await supabase
      .from('news_articles')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) return res.status(500).json({ error: error.message });
    return res.status(200).json(data);
  }

  const authHeader = req.headers.authorization;
  if (!authHeader) return res.status(401).json({ error: 'Unauthorized' });

  const token = authHeader.replace('Bearer ', '');
  const { data: { user }, error: authError } = await supabase.auth.getUser(token);

  if (authError || !user) return res.status(401).json({ error: 'Unauthorized' });

  if (req.method === 'POST') {
    const { cat, title, date, author, img, text } = req.body;
    if (!cat || !title || !date || !text) {
      return res.status(400).json({ error: 'Missing required fields: cat, title, date, text' });
    }

    const { data, error } = await supabase
      .from('news_articles')
      .insert([{ cat, title, date, author: author || 'Admin', img: img || '../hero_classroom.png', text }])
      .select();

    if (error) return res.status(500).json({ error: error.message });
    return res.status(201).json(data[0]);
  }

  if (req.method === 'PUT') {
    const { id, cat, title, date, author, img, text } = req.body;
    if (!id) return res.status(400).json({ error: 'Missing id' });

    const updates = {};
    if (cat !== undefined) updates.cat = cat;
    if (title !== undefined) updates.title = title;
    if (date !== undefined) updates.date = date;
    if (author !== undefined) updates.author = author;
    if (img !== undefined) updates.img = img;
    if (text !== undefined) updates.text = text;
    updates.updated_at = new Date().toISOString();

    const { data, error } = await supabase
      .from('news_articles')
      .update(updates)
      .eq('id', id)
      .select();

    if (error) return res.status(500).json({ error: error.message });
    return res.status(200).json(data[0]);
  }

  if (req.method === 'DELETE') {
    const { id } = req.query;
    if (!id) return res.status(400).json({ error: 'Missing id query parameter' });

    const { error } = await supabase
      .from('news_articles')
      .delete()
      .eq('id', id);

    if (error) return res.status(500).json({ error: error.message });
    return res.status(200).json({ success: true });
  }

  return res.status(405).json({ error: 'Method not allowed' });
};
