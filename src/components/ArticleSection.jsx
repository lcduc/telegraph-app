import { useNavigate } from 'react-router-dom';

export default function ArticleSection({ articles }) {
  const navigate = useNavigate();

  if (!articles || articles.length === 0) return null;

  const [left, middle, ...sidebar] = articles;

  return (
    <div className="grid grid-cols-3 gap-6">
      {/* Left Column - Featured Article 1 */}
      {left && (
        <article 
          onClick={() => {
            navigate(`/article/${left.id}`);
            window.scrollTo(0, 0);
          }}
          className="border border-gray-200 rounded overflow-hidden hover:shadow-lg transition-shadow cursor-pointer animate-slide-up hover:scale-105 transition-transform duration-300"
          style={{ animationDelay: '0.1s' }}
        >
          <div className="h-48 bg-gradient-to-br from-gray-400 to-gray-500 overflow-hidden">
            <img src={left.image} alt={left.title} className="w-full h-full object-cover" />
          </div>
          <div className="p-4">
            <p className="text-xs text-red-600 font-black uppercase mb-2">
              {left.category}
            </p>
            <h3 className="font-black text-sm leading-tight text-gray-900 mb-3 line-clamp-3">
              {left.title}
            </h3>
            <p className="text-xs text-gray-600 mb-4 line-clamp-2">
              {left.excerpt}
            </p>
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 rounded-full bg-gray-300" />
              <span className="text-xs font-semibold text-gray-700">
                {left.author}
              </span>
            </div>
          </div>
        </article>
      )}

      {/* Middle Column - Featured Article 2 */}
      {middle && (
        <article 
          onClick={() => {
            navigate(`/article/${middle.id}`);
            window.scrollTo(0, 0);
          }}
          className="border border-gray-200 rounded overflow-hidden hover:shadow-lg transition-shadow cursor-pointer animate-slide-up hover:scale-105 transition-transform duration-300"
          style={{ animationDelay: '0.2s' }}
        >
          <div className="h-48 bg-gradient-to-br from-gray-400 to-gray-500 overflow-hidden">
            <img src={middle.image} alt={middle.title} className="w-full h-full object-cover" />
          </div>
          <div className="p-4">
            <p className="text-xs text-red-600 font-black uppercase mb-2">
              {middle.category}
            </p>
            <h3 className="font-black text-sm leading-tight text-gray-900 mb-3 line-clamp-3">
              {middle.title}
            </h3>
            <p className="text-xs text-gray-600 mb-4 line-clamp-2">
              {middle.excerpt}
            </p>
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 rounded-full bg-gray-300" />
              <span className="text-xs font-semibold text-gray-700">
                {middle.author}
              </span>
            </div>
          </div>
        </article>
      )}

      {/* Right Column - Sidebar Articles */}
      {sidebar.length > 0 && (
        <div className="flex flex-col border border-gray-200 rounded overflow-hidden animate-slide-up" style={{ animationDelay: '0.3s' }}>
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
              style={{ animationDelay: `${0.3 + index * 0.05}s` }}
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
  );
}
