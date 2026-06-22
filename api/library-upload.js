const { createClient } = require('@supabase/supabase-js');
const { parse } = require('url');

module.exports = async (req, res) => {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  const authHeader = req.headers.authorization;
  if (!authHeader) return res.status(401).json({ error: 'Unauthorized' });

  const supabase = createClient(
    process.env.SUPABASE_URL,
    process.env.SUPABASE_SERVICE_ROLE_KEY
  );

  const token = authHeader.replace('Bearer ', '');
  const { data: { user }, error: authError } = await supabase.auth.getUser(token);
  if (authError || !user) return res.status(401).json({ error: 'Unauthorized' });

  try {
    const buffers = [];
    for await (const chunk of req) buffers.push(chunk);
    const rawBody = Buffer.concat(buffers);

    const contentType = req.headers['content-type'] || '';
    if (!contentType.includes('multipart/form-data')) {
      return res.status(400).json({ error: 'Expected multipart/form-data' });
    }

    const boundary = contentType.split('boundary=')[1];
    if (!boundary) return res.status(400).json({ error: 'No boundary found' });

    const parts = [];
    const sections = rawBody.toString('latin1').split(`--${boundary}`);

    for (const section of sections) {
      if (section.includes('Content-Disposition')) {
        const headerEnd = section.indexOf('\r\n\r\n');
        if (headerEnd === -1) continue;
        const headers = section.substring(0, headerEnd);
        const body = section.substring(headerEnd + 4);
        const finalBody = body.replace(/\r\n--$/, '').trim();

        const nameMatch = headers.match(/name="([^"]+)"/);
        const filenameMatch = headers.match(/filename="([^"]+)"/);
        const name = nameMatch ? nameMatch[1] : null;

        if (filenameMatch && filenameMatch[1]) {
          parts.push({ name, filename: filenameMatch[1], isFile: true, data: Buffer.from(finalBody, 'latin1') });
        } else if (name) {
          parts.push({ name, isFile: false, value: finalBody });
        }
      }
    }

    const getField = (name) => { const p = parts.find(p => p.name === name && !p.isFile); return p ? p.value : ''; };
    const getFile = (name) => parts.find(p => p.name === name && p.isFile);

    const title = getField('title');
    const author = getField('author') || 'St. John Paul II SS Nakuwadde';
    const subject = getField('subject');
    const class_level = getField('class_level') || 'All Levels';
    const category = getField('category') || 'Revision Notes';
    const description = getField('description');

    if (!title || !subject) {
      return res.status(400).json({ error: 'Missing required fields: title, subject' });
    }

    const pdfFile = getFile('file');
    const coverFile = getFile('cover');

    let file_url = '';
    let cover_url = '';

    if (pdfFile) {
      const ext = pdfFile.filename.split('.').pop();
      const filePath = `resources/${Date.now()}_${Math.random().toString(36).slice(2)}.${ext}`;
      const { error: uploadError } = await supabase.storage.from('library').upload(filePath, pdfFile.data, {
        contentType: pdfFile.filename.endsWith('.pdf') ? 'application/pdf' : 'application/octet-stream',
        upsert: false
      });
      if (uploadError) return res.status(500).json({ error: uploadError.message });
      const { data: { publicUrl } } = supabase.storage.from('library').getPublicUrl(filePath);
      file_url = publicUrl;
    }

    if (coverFile) {
      const ext = coverFile.filename.split('.').pop();
      const coverPath = `covers/${Date.now()}_${Math.random().toString(36).slice(2)}.${ext}`;
      const { error: coverUploadError } = await supabase.storage.from('library').upload(coverPath, coverFile.data, {
        contentType: coverFile.filename.endsWith('.png') ? 'image/png' : 'image/jpeg',
        upsert: false
      });
      if (!coverUploadError) {
        const { data: { publicUrl } } = supabase.storage.from('library').getPublicUrl(coverPath);
        cover_url = publicUrl;
      }
    }

    const { data, error } = await supabase
      .from('library_resources')
      .insert([{ title, author, subject, class_level, category, description, file_url, file_type: 'pdf', cover_url }])
      .select();

    if (error) return res.status(500).json({ error: error.message });
    return res.status(201).json(data[0]);

  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
};
