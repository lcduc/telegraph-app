import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import ArticleSection from './ArticleSection';

export default function CategoryPage() {
  const navigate = useNavigate();
  const { categoryName } = useParams();
  const [categoryArticles, setCategoryArticles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Load articles from JSON file
    fetch('/articles.json')
      .then(res => res.json())
      .then(data => {
        // Filter by category (case-insensitive)
        const filtered = data.filter(a => a.category === categoryName.toUpperCase());
        
        // Sort by date descending (latest first) with proper date parsing
        const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
        filtered.sort((a, b) => {
          const parseDate = (dateStr) => {
            const [day, month, year] = dateStr.split(' ');
            const monthIndex = monthNames.indexOf(month);
            return new Date(year, monthIndex, day);
          };
          return parseDate(b.date) - parseDate(a.date);
        });
        
        if (filtered.length === 0) {
          setError(`No articles found for ${categoryName}`);
        } else {
          setCategoryArticles(filtered);
        }
      })
      .catch(err => {
        setError('Failed to load articles');
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
