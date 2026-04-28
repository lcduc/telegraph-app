import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { loadArticlesJson } from "../utils/loadArticlesJson";

export default function ArticleDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [article, setArticle] = useState(null);
  const [articles, setAllArticles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Load articles from JSON file
    loadArticlesJson()
      .then((data) => {
        setAllArticles(data);
        const found = data.find((a) => a.id === parseInt(id));
        if (found) {
          setArticle(found);
        } else {
          setError("Article not found");
        }
      })
      .catch((err) => {
        setError(`Failed to load article: ${err.message}`);
        console.error(err);
      })
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-8">
        <p className="text-gray-500">Loading article...</p>
      </div>
    );
  }

  if (error || !article) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-8">
        <p className="text-red-600">{error || "Article not found"}</p>
        <button
          onClick={() => navigate("/")}
          className="text-blue-600 hover:underline mt-4"
        >
          ← Back to Sport
        </button>
      </div>
    );
  }

  // Find related articles
  const relatedArticles =
    article.relatedArticles && article.relatedArticles.length > 0
      ? article.relatedArticles
          .map((relId) => articles.find((a) => a.id === relId))
          .filter(Boolean)
      : [];

  return (
    <article className="bg-white">
      <div className="max-w-4xl mx-auto px-4 py-8">
        {/* Breadcrumb */}
        <button
          onClick={() => navigate("/")}
          className="text-blue-600 hover:underline text-sm mb-4"
        >
          ← Back to Sport
        </button>

        {/* Category and Title */}
        <span
          className="text-xs text-red-600 font-black uppercase block mb-2"
        >
          {article.category}
        </span>
        <h1
          className="text-5xl font-black text-gray-900 mb-4 leading-tight"
        >
          {article.title}
        </h1>

        {/* Article Meta */}
        <div
          className="flex items-center gap-6 py-6 border-b-2 border-gray-200 mb-8"
        >
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-full bg-gray-300" />
            <div>
              <p className="font-bold text-gray-900">{article.author}</p>
              <p className="text-xs text-gray-600">{article.authorTitle}</p>
            </div>
          </div>
          <div>
            <p className="text-sm text-gray-600">Published {article.date}</p>
          </div>
        </div>

        {/* Article Body - with HTML formatting preserved */}
        <div
          className="prose prose-sm max-w-none mb-12"
        >
          {/* Split HTML by image placeholder and render with image */}
          {(() => {
            const sections = [];
            const imagePlaceholders = [...(article.body.matchAll(/[[{]img(\d+)[\]}]/g) || [])];
            const parts = article.body.split(/[[{]img\d+[\]}]/);
            
            // Combine parts with image numbers
            for (let i = 0; i < parts.length; i++) {
              sections.push({
                content: parts[i],
                imageNum: imagePlaceholders[i]?.[1],
              });
            }

            return sections.map((section, idx) => {
              // First, do all the text replacements and styling BEFORE rendering
              let html = section.content
                // IMPORTANT: Process captions FIRST before any other p tag styling
                // Only center SHORT <p> with only italic text (image captions, typically < 150 chars)
                .replace(
                  /<p[^>]*>\s*(?:<em[^>]*>[^<]{1,100}<\/em>\s*)+<\/p>/g,
                  (match) => {
                    const emContent = match.match(/<em[^>]*>[^<]*<\/em>/)[0];
                    return `<p class="text-center italic text-sm text-gray-600 mb-6">${emContent}</p>`;
                  },
                )

                // Convert style="text-align: center" to class
                .replace(
                  /style="[^"]*text-align:\s*center[^"]*"/g,
                  'class="text-center"',
                )
                .replace(/align="center"/g, 'class="text-center"')

                // Add Tailwind classes to paragraphs (preserve existing classes)
                .replace(/<p([^>]*)>/g, (match, attrs) => {
                  // Skip if already has text-center or text-gray-600 (already styled as caption)
                  if (
                    attrs.includes("text-center") ||
                    attrs.includes("text-gray-600")
                  )
                    return match;
                  if (attrs.includes("class=")) {
                    return `<p${attrs.replace(/class="([^"]*)"/g, 'class="$1 text-base text-gray-700 leading-relaxed mb-6"')}>`;
                  }
                  return `<p${attrs} class="text-base text-gray-700 leading-relaxed mb-6">`;
                })

                // Style other elements
                .replace(/<strong>/g, '<strong class="font-bold">')
                .replace(/<em>/g, '<em class="italic">')
                .replace(/<u>/g, '<u class="underline">')
                .replace(/<h([1-6])([^>]*)>/g, (match, level, attrs) => {
                  const sizes = {
                    1: "text-3xl",
                    2: "text-2xl",
                    3: "text-xl",
                    4: "text-lg",
                    5: "text-base",
                    6: "text-sm",
                  };
                  if (attrs.includes("class=")) {
                    return `<h${level}${attrs.replace(/class="([^"]*)"/g, `class="$1 font-bold ${sizes[level]} text-gray-900 mb-4 mt-6"`)}>`;
                  }
                  return `<h${level}${attrs} class="font-bold ${sizes[level]} text-gray-900 mb-4 mt-6">`;
                })
                // Handle div with text-align
                .replace(
                  /<div([^>]*)style="[^"]*text-align:\s*center[^"]*"([^>]*)>/g,
                  '<div class="text-center my-6">',
                )
                // Remove inline styles that might conflict
                .replace(/style="[^"]*"/g, "");

              return (
                <div key={idx}>
                  {/* Render HTML content with styling */}
                  <div
                    className="html-content"
                    dangerouslySetInnerHTML={{ __html: html }}
                  />

                  {/* Render image if there's a corresponding image in the map */}
                  {section.imageNum &&
                    article.images &&
                    article.images[`img${section.imageNum}`] && (
                      <div className="my-8 rounded-lg overflow-hidden">
                        <img
                          src={article.images[`img${section.imageNum}`]}
                          alt={article.title}
                          className="w-full"
                        />
                      </div>
                    )}
                </div>
              );
            });
          })()}
        </div>

        {/* Share Buttons */}
        <div className="border-y border-gray-200 py-6 mb-8 flex gap-4 items-center">
          <span className="text-sm font-bold text-gray-600">Share:</span>
          <button className="text-blue-600 hover:text-blue-800">Twitter</button>
          <button className="text-blue-600 hover:text-blue-800">
            Facebook
          </button>
          <button className="text-gray-600 hover:text-gray-800">
            Copy link
          </button>
        </div>

        {/* Related Articles */}
        {relatedArticles && relatedArticles.length > 0 && (
          <div
            className="bg-gray-50 p-8 rounded-lg"
          >
            <h3 className="text-xl font-black text-gray-900 mb-6">
              More from {article.category}
            </h3>
            <div className="space-y-4">
              {relatedArticles.map((relatedArticle) => (
                <button
                  key={relatedArticle.id}
                  onClick={() => {
                    navigate(`/article/${relatedArticle.id}`);
                    window.scrollTo(0, 0);
                  }}
                  className="block w-full text-left hover:text-red-600 transition pb-4 border-b border-gray-200 last:border-b-0"
                >
                  <p className="text-xs text-red-600 font-bold uppercase mb-1">
                    {relatedArticle.category}
                  </p>
                  <p className="font-bold text-gray-900 hover:text-red-600">
                    {relatedArticle.title}
                  </p>
                </button>
              ))}
            </div>
          </div>
        )}
      </div>
    </article>
  );
}
