const { createClient } = require('@supabase/supabase-js');

module.exports = async (req, res) => {
  const supabase = createClient(
    process.env.SUPABASE_URL,
    process.env.SUPABASE_SERVICE_ROLE_KEY
  );

  if (req.method === 'GET') {
    const { subject, class_level, category, search } = req.query;
    let query = supabase.from('library_resources').select('*');

    if (subject && subject !== 'all') query = query.eq('subject', subject);
    if (class_level && class_level !== 'all') query = query.eq('class_level', class_level);
    if (category && category !== 'all') query = query.eq('category', category);
    if (search) query = query.or(`title.ilike.%${search}%,author.ilike.%${search}%,subject.ilike.%${search}%,description.ilike.%${search}%`);

    const { data, error } = await query.order('created_at', { ascending: false });

    if (error) return res.status(500).json({ error: error.message });
    return res.status(200).json(data);
  }

  if (req.method === 'POST') {
    const authHeader = req.headers.authorization;
    if (!authHeader) return res.status(401).json({ error: 'Unauthorized' });

    const token = authHeader.replace('Bearer ', '');
    const { data: { user }, error: authError } = await supabase.auth.getUser(token);
    if (authError || !user) return res.status(401).json({ error: 'Unauthorized' });

    const { title, author, subject, class_level, category, description, file_url, file_type, cover_url } = req.body;
    if (!title || !subject || !file_url) {
      return res.status(400).json({ error: 'Missing required fields: title, subject, file_url' });
    }

    const { data, error } = await supabase
      .from('library_resources')
      .insert([{
        title, author: author || 'St. John Paul II SS Nakuwadde',
        subject, class_level: class_level || 'All Levels',
        category: category || 'Revision Notes',
        description: description || '',
        file_url, file_type: file_type || 'pdf',
        cover_url: cover_url || ''
      }])
      .select();

    if (error) return res.status(500).json({ error: error.message });
    return res.status(201).json(data[0]);
  }

  if (req.method === 'PUT') {
    const authHeader = req.headers.authorization;
    if (!authHeader) return res.status(401).json({ error: 'Unauthorized' });

    const token = authHeader.replace('Bearer ', '');
    const { data: { user }, error: authError } = await supabase.auth.getUser(token);
    if (authError || !user) return res.status(401).json({ error: 'Unauthorized' });

    const { id, title, author, subject, class_level, category, description, file_url, file_type, cover_url } = req.body;
    if (!id) return res.status(400).json({ error: 'Missing id' });

    const updates = {};
    if (title !== undefined) updates.title = title;
    if (author !== undefined) updates.author = author;
    if (subject !== undefined) updates.subject = subject;
    if (class_level !== undefined) updates.class_level = class_level;
    if (category !== undefined) updates.category = category;
    if (description !== undefined) updates.description = description;
    if (file_url !== undefined) updates.file_url = file_url;
    if (file_type !== undefined) updates.file_type = file_type;
    if (cover_url !== undefined) updates.cover_url = cover_url;
    updates.updated_at = new Date().toISOString();

    const { data, error } = await supabase
      .from('library_resources')
      .update(updates)
      .eq('id', id)
      .select();

    if (error) return res.status(500).json({ error: error.message });
    return res.status(200).json(data[0]);
  }

  if (req.method === 'DELETE') {
    const authHeader = req.headers.authorization;
    if (!authHeader) return res.status(401).json({ error: 'Unauthorized' });

    const token = authHeader.replace('Bearer ', '');
    const { data: { user }, error: authError } = await supabase.auth.getUser(token);
    if (authError || !user) return res.status(401).json({ error: 'Unauthorized' });

    const { id } = req.query;
    if (!id) return res.status(400).json({ error: 'Missing id query parameter' });

    const { error } = await supabase
      .from('library_resources')
      .delete()
      .eq('id', id);

    if (error) return res.status(500).json({ error: error.message });
    return res.status(200).json({ success: true });
  }

  if (req.method === 'PATCH') {
    const { id } = req.query;
    if (!id) return res.status(400).json({ error: 'Missing id query parameter' });

    const { error } = await supabase.rpc('increment_download_count', { resource_id: parseInt(id) });

    if (error) return res.status(500).json({ error: error.message });
    return res.status(200).json({ success: true });
  }

  return res.status(405).json({ error: 'Method not allowed' });
};
