import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

export default function NewsGrid() {
  const navigate = useNavigate();
  const [categoryArticles, setCategoryArticles] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Load articles from JSON file
    fetch('/articles.json')
      .then(res => res.json())
      .then(data => {
        // Group articles by category
        const grouped = {};
        
        data.forEach(article => {
          if (!grouped[article.category]) {
            grouped[article.category] = [];
          }
          grouped[article.category].push(article);
        });

        // Transform into featured + sidebar structure
        const categoryData = {};
        const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
        
        
        Object.entries(grouped).forEach(([category, articles]) => {
          // Sort articles within category by date (newest first)
          const sorted = articles.sort((a, b) => {
            const parseDate = (dateStr) => {
              const [day, month, year] = dateStr.split(' ');
              const monthIndex = monthNames.indexOf(month);
              return new Date(year, monthIndex, day);
            };
            return parseDate(b.date) - parseDate(a.date);
          });
          
          categoryData[category] = {
            featured: sorted.slice(0, 2),
            sidebar: sorted.slice(2, 6) // Max 6 items: 2 featured + 4 sidebar
          };
        });

        setCategoryArticles(categoryData);
      })
      .catch(err => {
        setError('Failed to load articles');
        console.error(err);
      })
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <section className="bg-white">
        <div className="max-w-7xl mx-auto px-4 py-8">
          <p className="text-gray-500">Loading articles...</p>
        </div>
      </section>
    );
  }

  if (error || Object.keys(categoryArticles).length === 0) {
    return (
      <section className="bg-white">
        <div className="max-w-7xl mx-auto px-4 py-8">
          <p className="text-red-600">{error || 'No articles found'}</p>
        </div>
      </section>
    );
  }

  return (
    <section className="bg-white">
      <div className="max-w-7xl mx-auto px-4 py-8">
        {Object.entries(categoryArticles).map(([category, { featured, sidebar }], catIndex) => (
          <div key={category} className="mb-12">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-black text-gray-900">{category}</h2>
              <button 
                onClick={() => navigate(`/category/${category.toLowerCase()}`)}
                className="text-blue-900 font-bold hover:underline text-sm hover:text-blue-600 transition-colors duration-300"
              >
                {category} →
              </button>
            </div>

            <div className="grid grid-cols-3 gap-6">
              {/* Left Column - Featured Article 1 */}
              {featured[0] && (
                <article 
                  onClick={() => {
                    navigate(`/article/${featured[0].id}`);
                    window.scrollTo(0, 0);
                  }}
                  className="border border-gray-200 rounded overflow-hidden hover:shadow-lg transition-shadow cursor-pointer hover:scale-105 transition-transform duration-300"
                >
                  <div className="h-48 bg-gradient-to-br from-gray-400 to-gray-500 overflow-hidden">
                    <img src={featured[0].image} alt={featured[0].title} className="w-full h-full object-cover" />
                  </div>
                  <div className="p-4">
                    <p className="text-xs text-red-600 font-black uppercase mb-2">
                      {featured[0].category}
                    </p>
                    <h3 className="font-black text-sm leading-tight text-gray-900 mb-3 line-clamp-3">
                      {featured[0].title}
                    </h3>
                    <p className="text-xs text-gray-600 mb-4 line-clamp-2">
                      {featured[0].excerpt}
                    </p>
                    <div className="flex items-center gap-2">
                      <div className="w-6 h-6 rounded-full bg-gray-300" />
                      <span className="text-xs font-semibold text-gray-700">
                        {featured[0].author}
                      </span>
                    </div>
                  </div>
                </article>
              )}

              {/* Middle Column - Featured Article 2 */}
              {featured[1] && (
                <article 
                  onClick={() => {
                    navigate(`/article/${featured[1].id}`);
                    window.scrollTo(0, 0);
                  }}
                  className="border border-gray-200 rounded overflow-hidden hover:shadow-lg transition-shadow cursor-pointer hover:scale-105 transition-transform duration-300"
                >
                  <div className="h-48 bg-gradient-to-br from-gray-400 to-gray-500 overflow-hidden">
                    <img src={featured[1].image} alt={featured[1].title} className="w-full h-full object-cover" />
                  </div>
                  <div className="p-4">
                    <p className="text-xs text-red-600 font-black uppercase mb-2">
                      {featured[1].category}
                    </p>
                    <h3 className="font-black text-sm leading-tight text-gray-900 mb-3 line-clamp-3">
                      {featured[1].title}
                    </h3>
                    <p className="text-xs text-gray-600 mb-4 line-clamp-2">
                      {featured[1].excerpt}
                    </p>
                    <div className="flex items-center gap-2">
                      <div className="w-6 h-6 rounded-full bg-gray-300" />
                      <span className="text-xs font-semibold text-gray-700">
                        {featured[1].author}
                      </span>
                    </div>
                  </div>
                </article>
              )}

              {/* Right Column - Sidebar Articles */}
              {sidebar.length > 0 && (
                <div className="flex flex-col border border-gray-200 rounded overflow-hidden">
                  {sidebar.map((article, index) => (
                    <button
                      key={article.id}
                      onClick={() => {
                        navigate(`/article/${article.id}`);
                        window.scrollTo(0, 0);
                      }}
                      className={`flex-1 p-4 hover:bg-red-50 transition text-left flex flex-col justify-center hover:text-red-600 ${
                        index !== sidebar.length - 1 ? 'border-b border-gray-200' : ''
                      }`}
                    >
                      <p className="text-xs text-red-600 font-black uppercase mb-2">
                        {article.category}
                      </p>
                      <h4 className="text-sm font-black text-gray-900 line-clamp-3 hover:text-red-600">
                        {article.title}
                      </h4>
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
