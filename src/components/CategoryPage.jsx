import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import ArticleSection from "./ArticleSection";
import BrandingAd from "./BrandingAd";
import { loadArticlesJson } from "../utils/loadArticlesJson";
import { getCategoryLabel } from "../utils/getCategoryLabel";

export default function CategoryPage() {
  const navigate = useNavigate();
  const { categoryName } = useParams();
  const [categoryArticles, setCategoryArticles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [now, setNow] = useState(new Date());
  const ARTICLES_PER_PAGE = 10;

  const normalizeCategory = (value) =>
    value
      .toString()
      .trim()
      .toLowerCase()
      .replace(/[-_\s]+/g, "");

  useEffect(() => {
    const clock = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(clock);
  }, []);

  useEffect(() => {
    const categoryAliases = {
      racing: "f1",
      formula1: "f1",
    };

    // Load articles from JSON file
    loadArticlesJson()
      .then((data) => {
        const normalizedParam = normalizeCategory(categoryName);
        const normalizedTarget =
          categoryAliases[normalizedParam] || normalizedParam;

        // Filter by category using a normalized slug so small data variations still match
        const filtered = data.filter(
          (a) => normalizeCategory(a.category) === normalizedTarget,
        );
        // Sort by date descending (latest first)
        filtered.sort((a, b) => new Date(b.date) - new Date(a.date));

        if (filtered.length === 0) {
          setError(`No articles found for ${categoryName}`);
        } else {
          setCategoryArticles(filtered);
        }
      })
      .catch((err) => {
        setError(`Failed to load articles: ${err.message}`);
        console.error(err);
      })
      .finally(() => setLoading(false));
  }, [categoryName]);

  useEffect(() => {
    setCurrentPage(1);
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
            onClick={() => navigate("/")}
            className="text-blue-600 hover:underline mt-4"
          >
            ← Trở về trang chủ
          </button>
        </div>
      </section>
    );
  }

  // Keep one grid section, stream the rest with pagination
  const firstSection = categoryArticles.slice(0, 6);
  const streamArticles = categoryArticles.slice(6);
  const totalPages = Math.ceil(streamArticles.length / ARTICLES_PER_PAGE);
  const startIndex = (currentPage - 1) * ARTICLES_PER_PAGE;
  const endIndex = startIndex + ARTICLES_PER_PAGE;
  const paginatedArticles = streamArticles.slice(startIndex, endIndex);

  return (
    <section className="bg-white">
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-3xl font-black text-gray-900">
            {getCategoryLabel(categoryName)}
          </h1>
          <button
            onClick={() => navigate("/")}
            className="text-blue-600 hover:underline text-sm font-bold hover:text-blue-800 transition-colors duration-300"
          >
            ← Trở về trang chủ
          </button>
        </div>

        {/* First section (grid) - full width */}
        {firstSection.length > 0 && (
          <div className="mb-12 w-full">
            <ArticleSection articles={firstSection} />
          </div>
        )}

        {/* Two Column Layout */}
        <div className="flex gap-6">
          {/* Left Column - 65% */}
          <div className="flex-1 min-w-0">
            {/* Streamed articles - larger layout */}
            {paginatedArticles.length > 0 && (
              <div className="space-y-4">
                {paginatedArticles.map((article) => (
                  <div
                    key={article.id}
                    className="border border-gray-200 rounded-lg overflow-hidden hover:shadow-md transition bg-white group flex gap-4 p-0"
                  >
                    {/* Image - left side */}
                    <button
                      onClick={() => {
                        navigate(`/article/${article.id}`);
                        window.scrollTo(0, 0);
                      }}
                      className="w-[300px] shrink-0 overflow-hidden bg-gray-100"
                      style={{ height: "187.5px" }}
                    >
                      <img
                        src={article.image}
                        alt={article.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        loading="lazy"
                      />
                    </button>

                    {/* Content - right side */}
                    <div className="p-4 flex-1 flex flex-col">
                      {/* Time - top right */}
                      <div className="text-xs text-gray-500 mb-2">
                        {article.date}
                      </div>

                      {/* Title */}
                      <h3 className="mb-2">
                        <button
                          onClick={() => {
                            navigate(`/article/${article.id}`);
                            window.scrollTo(0, 0);
                          }}
                          className="text-base font-bold text-gray-900 leading-snug line-clamp-2 hover:text-red-600 transition text-left w-full"
                        >
                          {article.title}
                        </button>
                      </h3>

                      {/* Description */}
                      <p className="text-sm text-gray-600 line-clamp-2 mb-2 flex-1">
                        {article.excerpt ||
                          article.sapo ||
                          article.description ||
                          article.body?.substring(0, 150) ||
                          ""}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex justify-center gap-2 py-8">
                <button
                  onClick={() => {
                    setCurrentPage(1);
                    window.scrollTo(0, 0);
                  }}
                  disabled={currentPage === 1}
                  className="px-4 py-2 rounded border border-gray-300 text-gray-700 disabled:opacity-50 hover:bg-gray-100 font-medium"
                >
                  ← Previous
                </button>

                {Array.from({ length: totalPages }, (_, i) => i + 1).map(
                  (page) => (
                    <button
                      key={page}
                      onClick={() => {
                        setCurrentPage(page);
                        window.scrollTo(0, 0);
                      }}
                      className={`px-4 py-2 rounded border transition font-medium ${
                        currentPage === page
                          ? "bg-red-600 text-white border-red-600"
                          : "border-gray-300 text-gray-700 hover:bg-gray-100"
                      }`}
                    >
                      {page}
                    </button>
                  ),
                )}

                <button
                  onClick={() => {
                    setCurrentPage(currentPage + 1);
                    window.scrollTo(0, 0);
                  }}
                  disabled={currentPage === totalPages}
                  className="px-4 py-2 rounded border border-gray-300 text-gray-700 disabled:opacity-50 hover:bg-gray-100 font-medium"
                >
                  Next →
                </button>
              </div>
            )}
          </div>

          {/* Right Column - 35% Sidebar */}
          <div className="w-80 shrink-0">
            {/* Ads */}
            <div className="mb-6">
              <BrandingAd adKey="branding" />
            </div>

            {/* Sticky wrapper for utilities + ad */}
            <div className="sticky top-[50px] z-30 space-y-6">
              {/* Utilities Card */}
              <div className="bg-white border border-gray-200 rounded-xl overflow-hidden">
                <div className="px-4 py-3 border-b border-gray-200">
                  <span className="text-lg font-black text-gray-900">
                    Tiện ích
                  </span>
                </div>

                <div className="p-4 space-y-4">
                  <div className="border border-gray-100 rounded-lg p-3">
                    <h3 className="text-sm font-bold text-gray-900 uppercase mb-2">
                      Thời tiết
                    </h3>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-semibold text-gray-800">
                        Hà Nội
                      </span>
                      <span className="text-xs text-gray-500">
                        {now.toLocaleDateString("vi-VN", {
                          weekday: "long",
                          day: "2-digit",
                          month: "2-digit",
                          year: "numeric",
                        })}
                      </span>
                    </div>
                    <div className="flex items-center gap-3">
                      <img
                        src="https://static.mediacdn.vn/thethaovanhoa/web_images/tien_ich/wea_am-may-nhieu.png"
                        alt="Thời tiết"
                        className="w-10 h-10"
                      />
                      <div>
                        <p className="text-2xl font-black text-gray-900">25°C</p>
                        <p className="text-xs text-gray-600">Nhiều mây</p>
                      </div>
                    </div>
                  </div>

                  <div className="border border-gray-100 rounded-lg p-3">
                    <h3 className="text-sm font-bold text-gray-900 uppercase mb-2">
                      Giá vàng
                    </h3>
                    <p className="text-xs text-gray-600 mb-2">
                      SJC Hà Nội (nghìn đồng/lượng)
                    </p>
                    <div className="space-y-1 text-sm">
                      <div className="flex items-center justify-between">
                        <span className="text-gray-700">Mua vào</span>
                        <span className="font-semibold text-gray-900">
                          169,700
                        </span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-gray-700">Bán ra</span>
                        <span className="font-semibold text-gray-900">
                          172,700
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="border border-gray-100 rounded-lg p-3">
                    <h3 className="text-sm font-bold text-gray-900 uppercase mb-2">
                      Giá xăng (VNĐ/Lít)
                    </h3>
                    <div className="space-y-1 text-sm">
                      <div className="flex items-center justify-between">
                        <span className="text-gray-700">Xăng RON 95-V</span>
                        <span className="font-semibold text-gray-900">
                          24.380
                        </span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-gray-700">Xăng E5 RON 92-II</span>
                        <span className="font-semibold text-gray-900">
                          22.340
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="border border-gray-100 rounded-lg p-3">
                    <h3 className="text-sm font-bold text-gray-900 uppercase mb-2">
                      Tỷ giá ngoại tệ (VNĐ)
                    </h3>
                    <div className="space-y-1 text-sm">
                      <div className="flex items-center justify-between">
                        <span className="text-gray-700">USD</span>
                        <span className="font-semibold text-gray-900">
                          26,130
                        </span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-gray-700">EUR</span>
                        <span className="font-semibold text-gray-900">
                          30,332
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div>
                <BrandingAd adKey="dhc" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
