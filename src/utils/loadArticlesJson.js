export async function loadArticlesJson() {
  const publicUrl = process.env.PUBLIC_URL || '';
  const candidates = [
    `${publicUrl}/articles.json`,
    '/articles.json',
    'articles.json',
    './articles.json'
  ];

  const tried = new Set();

  for (const rawUrl of candidates) {
    const url = rawUrl.replace(/\/+/g, '/');
    if (tried.has(url)) continue;
    tried.add(url);

    try {
      const res = await fetch(url, { cache: 'no-store' });
      if (!res.ok) {
        throw new Error(`HTTP status ${res.status}`);
      }

      const data = await res.json();
      if (!Array.isArray(data)) {
        throw new Error('articles.json is not an array');
      }
      return data;
    } catch (e) {
      console.error(`Fetch failed for ${url}:`, e);
    }
  }

  throw new Error('Could not fetch articles.json from any known path');
}
