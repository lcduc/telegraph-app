import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import ArticleSection from './ArticleSection';
import { loadArticlesJson } from '../utils/loadArticlesJson';

export default function CategoryPage() {
  const navigate = useNavigate();
  const { categoryName } = useParams();
  const [categoryArticles, setCategoryArticles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const normalizeCategory = value => value.toString().trim().toLowerCase().replace(/[-_\s]+/g, '');

  useEffect(() => {
    const categoryAliases = {
      racing: 'f1',
      formula1: 'f1'
    };

    // Load articles from JSON file
    loadArticlesJson()
      .then(data => {
        const normalizedParam = normalizeCategory(categoryName);
        const normalizedTarget = categoryAliases[normalizedParam] || normalizedParam;

        // Filter by category using a normalized slug so small data variations still match
        const filtered = data.filter(a => normalizeCategory(a.category) === normalizedTarget);
        // Sort by date descending (latest first)
        filtered.sort((a, b) => new Date(b.date) - new Date(a.date));
        
        if (filtered.length === 0) {
          setError(`No articles found for ${categoryName}`);
        } else {
          setCategoryArticles(filtered);
        }
      })
      .catch(err => {
        setError(`Failed to load articles: ${err.message}`);
        console.error(err);
      })
      .finally(() => setLoading(false));
  }, [categoryName]);

  if (loading) {
    return (
      <section className="bg-white">
        <div className="max-w-7xl mx-auto px-4 py-8">
          <p className="text-gray-500">Loading articles...</p>
        </div>
      </section>
    );
  }

  if (error) {
    return (
      <section className="bg-white">
        <div className="max-w-7xl mx-auto px-4 py-8">
          <p className="text-red-600">{error}</p>
          <button 
            onClick={() => navigate('/')}
            className="text-blue-600 hover:underline mt-4"
          >
            ← Back to Main
          </button>
        </div>
      </section>
    );
  }

  // Group articles into sections of 6
  const sections = [];
  for (let i = 0; i < categoryArticles.length; i += 6) {
    sections.push(categoryArticles.slice(i, i + 6));
  }

  return (
    <section className="bg-white">
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-3xl font-black text-gray-900">{categoryName.toUpperCase()}</h1>
          <button 
            onClick={() => navigate('/')}
            className="text-blue-600 hover:underline text-sm font-bold hover:text-blue-800 transition-colors duration-300"
          >
            ← Back
          </button>
        </div>

        {/* Sections */}
        {sections.map((sectionArticles, sectionIdx) => (
          <div key={sectionIdx} className="mb-12">
            <ArticleSection articles={sectionArticles} />
            
            {/* Divider between sections */}
            {sectionIdx < sections.length - 1 && (
              <div className="border-t border-gray-200 my-8" />
            )}
          </div>
        ))}
      </div>
    </section>
  );
}
