import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { loadArticlesJson } from '../utils/loadArticlesJson';

export default function MainLayout() {
  const navigate = useNavigate();
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [multimediaIndex, setMultimediaIndex] = useState(0);
  const [carouselResetToken, setCarouselResetToken] = useState(0);
  const [now, setNow] = useState(new Date());

  useEffect(() => {
    const clock = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(clock);
  }, []);

  useEffect(() => {
    loadArticlesJson()
      .then(data => {
        const sorted = [...data].sort((a, b) => new Date(b.date) - new Date(a.date));
        setArticles(sorted);
        setError(null);
      })
      .catch(err => {
        console.error(err);
        setError(`Failed to load articles: ${err.message}`);
      })
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    const multimediaLength = articles.slice(14, 20).length;
    if (multimediaLength === 0) return;

    setMultimediaIndex(prev => prev % multimediaLength);

    const timer = setInterval(() => {
      setMultimediaIndex(prev => (prev + 1) % multimediaLength);
    }, 4500);

    return () => clearInterval(timer);
  }, [articles, carouselResetToken]);

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-8">
        <p className="text-gray-500">Loading layout...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-8">
        <p className="text-red-600">{error}</p>
      </div>
    );
  }

  // Slice articles for different sections
  // Based on HTML structure:
  // left-top: 2 small (sub), 1 big
  // left-bot: 2 articles stacked 
  // spotlight: 3 articles
  // sidebar (right): 5 articles
  
  const subFeatured = articles.slice(0, 2);
  const mainFeatured = articles[2];
  const listFeatured = articles.slice(3, 5);
  const spotlight = articles.slice(6, 9);
  const sidebarLatest = articles.slice(9, 14);
  const usedFirstSectionIds = new Set([
    ...subFeatured.map(article => article.id),
    ...(mainFeatured ? [mainFeatured.id] : []),
    ...listFeatured.map(article => article.id),
    ...spotlight.map(article => article.id),
    ...sidebarLatest.map(article => article.id)
  ]);
  const footballSection = articles
    .filter(article => article.category === 'FOOTBALL' && !usedFirstSectionIds.has(article.id))
    .slice(0, 5);
  const sportSection = articles
    .filter(article => ['F1', 'TENNIS'].includes(article.category) && !usedFirstSectionIds.has(article.id))
    .slice(0, 5);
  const multimediaArticles = articles.slice(14, 20);
  const multimediaCount = multimediaArticles.length;
  const currentArticle = multimediaCount > 0 ? multimediaArticles[multimediaIndex % multimediaCount] : null;
  const getMultimediaArticle = offset => multimediaCount > 0 ? multimediaArticles[(multimediaIndex + offset + multimediaCount) % multimediaCount] : null;
  const farPrevArticle = getMultimediaArticle(-2);
  const prevArticle = getMultimediaArticle(-1);
  const nextArticle = getMultimediaArticle(1);
  const farNextArticle = getMultimediaArticle(2);
  const shiftMultimediaIndex = offset => {
    if (multimediaCount === 0) return;
    setMultimediaIndex(prev => (prev + offset + multimediaCount) % multimediaCount);
    setCarouselResetToken(prev => prev + 1);
  };

  const goToMultimediaIndex = index => {
    setMultimediaIndex(index);
    setCarouselResetToken(prev => prev + 1);
  };
  const liveDateTime = now.toLocaleDateString('vi-VN', {
    weekday: 'long',
    day: '2-digit',
    month: '2-digit',
    year: 'numeric'
  });

  return (
    <section className="bg-white">
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="flex flex-col lg:flex-row gap-8">
          
          {/* LEFT COLUMN */}
          <div className="lg:w-[68%] flex flex-col gap-10">
            
            {/* Left Top */}
            <div className="flex flex-col md:flex-row gap-6">
              {/* Sub Articles (2 items) */}
              <div className="flex flex-col gap-6 md:w-1/3">
                {subFeatured.map(article => (
                  <div key={article.id} className="flex flex-col gap-2 group cursor-pointer" onClick={() => navigate(`/article/${article.id}`)}>
                    <div className="overflow-hidden rounded h-32 bg-gray-100">
                      <img 
                        src={article.image} 
                        alt={article.title} 
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        loading="lazy"
                      />
                    </div>
                    <div>
                      <h3 className="font-bold text-gray-900 group-hover:text-red-600 leading-tight line-clamp-3 text-[15px]">
                        {article.title}
                      </h3>
                      <div className="flex items-center justify-between mt-1 mb-2">
                        <span className="text-xs text-red-600 font-bold uppercase">{article.category}</span>
                      </div>
                      <p className="text-sm text-gray-600 line-clamp-3 leading-snug">
                        {article.excerpt}
                      </p>
                    </div>
                  </div>
                ))}
              </div>

              {/* Big Article */}
              {mainFeatured && (
                <div className="md:w-2/3 group cursor-pointer flex flex-col" onClick={() => navigate(`/article/${mainFeatured.id}`)}>
                  <div className="overflow-hidden rounded h-52 md:h-[24rem] bg-gray-100 mb-3">
                    <img 
                      src={mainFeatured.image} 
                      alt={mainFeatured.title} 
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      loading="lazy"
                    />
                  </div>
                  <h3 className="font-black text-2xl text-gray-900 group-hover:text-red-600 leading-tight mb-2">
                    {mainFeatured.title}
                  </h3>
                  <div className="flex items-center gap-4 mb-2">
                    <span className="text-xs text-red-600 font-bold uppercase">{mainFeatured.category}</span>
                  </div>
                  <p className="text-gray-600 leading-relaxed line-clamp-3">
                    {mainFeatured.excerpt}
                  </p>
                </div>
              )}
            </div>

            <div className="border-t border-gray-200"></div>

            {/* Left Bot */}
            <div className="flex flex-col gap-6">
              {listFeatured.map(article => (
                <div key={article.id} className="flex gap-4 group cursor-pointer items-start" onClick={() => navigate(`/article/${article.id}`)}>
                  <div className="w-40 sm:w-64 shrink-0 overflow-hidden rounded bg-gray-100 aspect-[16/10]">
                    <img 
                      src={article.image} 
                      alt={article.title} 
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      loading="lazy"
                    />
                  </div>
                  <div className="flex flex-col">
                    <h3 className="font-bold text-gray-900 sm:text-lg group-hover:text-red-600 leading-tight mb-1 sm:mb-2 line-clamp-3">
                      {article.title}
                    </h3>
                    <div className="flex items-center gap-4 mb-1 sm:mb-2">
                      <span className="text-xs text-red-600 font-bold uppercase hidden sm:block">{article.category}</span>
                    </div>
                    <p className="text-sm text-gray-600 line-clamp-2 sm:line-clamp-3 hidden sm:block">
                      {article.excerpt}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            {/* Spotlight section */}
            <div className="bg-gray-50 p-4 rounded-xl">
              <div className="flex items-center gap-2 mb-4 border-b border-gray-200 pb-2">
                <span className="text-red-600">
                  <svg width="17" height="16" viewBox="0 0 17 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M8.35211 0.468994L10.4273 5.78519L16.1245 6.116L11.7098 9.7324L13.1557 15.253L8.35211 12.1719L3.54848 15.253L4.99442 9.7324L0.579674 6.116L6.27694 5.78519L8.35211 0.468994Z" fill="#ED1C24"></path>
                  </svg>
                </span>
                <h2 className="text-xl font-black text-gray-900 uppercase">Tiêu điểm - Spotlight</h2>
              </div>
              
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                {spotlight.map(article => (
                  <div key={article.id} className="flex flex-col gap-2 group cursor-pointer" onClick={() => navigate(`/article/${article.id}`)}>
                    <div className="overflow-hidden rounded aspect-[16/10] bg-gray-100">
                      <img 
                        src={article.image} 
                        alt={article.title} 
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        loading="lazy"
                      />
                    </div>
                    <h3 className="font-bold text-gray-900 group-hover:text-red-600 leading-tight text-sm sm:text-[15px] line-clamp-3">
                      {article.title}
                    </h3>
                  </div>
                ))}
              </div>
            </div>

          </div>

          {/* RIGHT COLUMN (Sidebar) */}
          <div className="lg:w-[32%] flex flex-col gap-8">
            
            {/* 24h News */}
            <div className="flex flex-col">
              <div className="border-b-2 border-red-600 mb-4">
                <h2 className="text-lg font-black text-gray-900 uppercase py-1 inline-block">Sự kiện nổi bật</h2>
              </div>
              <div className="flex flex-col gap-4">
                {sidebarLatest.map((article, idx) => (
                  <div key={article.id} className={`flex gap-3 group cursor-pointer items-start ${idx !== sidebarLatest.length - 1 ? 'border-b border-gray-100 pb-4' : ''}`} onClick={() => navigate(`/article/${article.id}`)}>
                    <div className="w-24 shrink-0 overflow-hidden rounded aspect-square bg-gray-100">
                      <img 
                        src={article.image} 
                        alt={article.title} 
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        loading="lazy"
                      />
                    </div>
                    <div className="flex flex-col">
                      <h3 className="font-bold text-gray-900 text-sm sm:text-base group-hover:text-red-600 leading-snug line-clamp-3">
                        {article.title}
                      </h3>
                      <p className="text-xs text-red-600 mt-1 uppercase font-bold">
                        {article.category}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* ADVERTISEMENT PLACEHOLDER */}
            <div className="mt-4">
              <div className="w-full h-[600px] bg-gray-100 border-2 border-dashed border-gray-300 flex flex-col items-center justify-center text-gray-400 rounded-lg select-none">
                <svg className="w-12 h-12 mb-3 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z" />
                </svg>
                <p className="font-bold text-sm tracking-widest uppercase">Advertisement</p>
                <p className="text-xs mt-1">300 x 600</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-[#1d2b44]">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 mb-10">
            <div className="flex flex-col md:flex-row md:items-center gap-3 md:gap-6">
              <h3 className="text-white text-2xl font-black">
                <span>Multimedia</span>
              </h3>
              <div className="flex flex-wrap gap-2">
                <span className="text-xs sm:text-sm font-bold uppercase text-[#1d2b44] bg-white/95 px-3 py-1 rounded-full">Video</span>
                <span className="text-xs sm:text-sm font-bold uppercase text-[#1d2b44] bg-white/95 px-3 py-1 rounded-full">Infographic</span>
                <span className="text-xs sm:text-sm font-bold uppercase text-[#1d2b44] bg-white/95 px-3 py-1 rounded-full">E-Magazine</span>
                <span className="text-xs sm:text-sm font-bold uppercase text-[#1d2b44] bg-white/95 px-3 py-1 rounded-full">Ảnh</span>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <span className="text-sm text-white/80">Theo dõi báo trên</span>
              <div className="flex items-center gap-2">
                <span className="w-8 h-8 rounded-full bg-white/20 text-white flex items-center justify-center" aria-label="Facebook">
                  <svg viewBox="0 0 24 24" className="w-4 h-4 fill-current" aria-hidden="true">
                    <path d="M13.5 21v-7h2.3l.4-3h-2.7V9.2c0-.9.3-1.5 1.6-1.5H16V5.1c-.2 0-.9-.1-1.8-.1-1.8 0-3 1.1-3 3.2V11H9v3h2.4v7h2.1z" />
                  </svg>
                </span>
                <span className="w-8 h-8 rounded-full bg-white/20 text-white flex items-center justify-center" aria-label="YouTube">
                  <svg viewBox="0 0 24 24" className="w-4 h-4 fill-current" aria-hidden="true">
                    <path d="M21.8 8.3c-.2-1-1-1.8-2-2C18 6 12 6 12 6s-6 0-7.8.3c-1 .2-1.8 1-2 2C2 10.1 2 12 2 12s0 1.9.2 3.7c.2 1 1 1.8 2 2C6 18 12 18 12 18s6 0 7.8-.3c1-.2 1.8-1 2-2 .2-1.8.2-3.7.2-3.7s0-1.9-.2-3.7zM10 15V9l5 3-5 3z" />
                  </svg>
                </span>
                <span className="w-8 h-8 rounded-full bg-white/20 text-white flex items-center justify-center" aria-label="TikTok">
                  <svg viewBox="0 0 24 24" className="w-4 h-4 fill-current" aria-hidden="true">
                    <path d="M14.2 4h2.5c.2 1 .8 1.9 1.6 2.5.8.6 1.7 1 2.7 1.1v2.6c-1.4-.1-2.8-.5-4-1.2v6.1c0 1.5-.6 2.9-1.7 3.9s-2.5 1.6-4 1.5a5.6 5.6 0 0 1-3.5-1.5 5.2 5.2 0 0 1-1.6-3.8c0-1.5.6-2.9 1.7-3.9 1-.9 2.3-1.4 3.7-1.5v2.7c-.7.1-1.3.3-1.7.8-.5.5-.8 1.2-.8 1.9 0 .7.3 1.4.8 1.9.5.5 1.1.8 1.9.8s1.4-.3 1.9-.8c.5-.5.8-1.2.8-1.9V4z" />
                  </svg>
                </span>
                <span className="w-8 h-8 rounded-full bg-white/20 text-white flex items-center justify-center" aria-label="Zalo">
                  <svg viewBox="0 0 24 24" className="w-4 h-4 fill-current" aria-hidden="true">
                    <path d="M4 6h16v2L8.5 18H20v2H4v-2L15.5 8H4V6z" />
                  </svg>
                </span>
              </div>
            </div>
          </div>

          <div className="max-w-5xl mx-auto">
            <div className="relative flex items-start justify-center gap-4 sm:gap-6 min-h-[22rem] sm:min-h-[24rem]">
              {farPrevArticle && (
                <div
                  onClick={() => shiftMultimediaIndex(-2)}
                  className="hidden xl:block w-[10%] rounded-xl overflow-hidden border border-white/20 bg-white/85 cursor-pointer opacity-25 blur-[6px] hover:opacity-50 transition-all"
                >
                  <div className="h-52 sm:h-64 md:h-72 bg-gray-100 overflow-hidden">
                    <img
                      src={farPrevArticle.image}
                      alt={farPrevArticle.title}
                      className="w-full h-full object-cover scale-[1.1]"
                      loading="lazy"
                    />
                  </div>
                </div>
              )}

              {prevArticle && (
                <div
                  onClick={() => shiftMultimediaIndex(-1)}
                  className="hidden md:block w-[10%] rounded-xl overflow-hidden border border-white/20 bg-white/85 cursor-pointer opacity-40 blur-[5px] hover:opacity-70 transition-all"
                >
                  <div className="h-52 sm:h-64 md:h-72 bg-gray-100 overflow-hidden">
                    <img
                      src={prevArticle.image}
                      alt={prevArticle.title}
                      className="w-full h-full object-cover scale-[1.08]"
                      loading="lazy"
                    />
                  </div>
                </div>
              )}

              {currentArticle && (
                <div
                  onClick={() => navigate(`/article/${currentArticle.id}`)}
                  className="group cursor-pointer w-full md:w-[60%] flex flex-col items-center"
                >
                  <div className="h-52 sm:h-64 md:h-72 rounded-xl overflow-hidden border border-white/15 bg-white shadow-lg flex items-center justify-center">
                    <img
                      src={currentArticle.image}
                      alt={currentArticle.title}
                      className="w-full h-full object-cover scale-[1.12] group-hover:scale-[1.16] transition-transform duration-300"
                      loading="lazy"
                    />
                  </div>
                  <h4 className="m-0 p-0 mt-0 text-center font-bold text-white text-lg line-clamp-3 group-hover:text-red-300 leading-snug">
                    {currentArticle.title}
                  </h4>
                </div>
              )}

              {nextArticle && (
                <div
                  onClick={() => shiftMultimediaIndex(1)}
                  className="hidden md:block w-[10%] rounded-xl overflow-hidden border border-white/20 bg-white/85 cursor-pointer opacity-40 blur-[5px] hover:opacity-70 transition-all"
                >
                  <div className="h-52 sm:h-64 md:h-72 bg-gray-100 overflow-hidden">
                    <img
                      src={nextArticle.image}
                      alt={nextArticle.title}
                      className="w-full h-full object-cover scale-[1.08]"
                      loading="lazy"
                    />
                  </div>
                </div>
              )}

              {farNextArticle && (
                <div
                  onClick={() => shiftMultimediaIndex(2)}
                  className="hidden xl:block w-[10%] rounded-xl overflow-hidden border border-white/20 bg-white/85 cursor-pointer opacity-25 blur-[6px] hover:opacity-50 transition-all"
                >
                  <div className="h-52 sm:h-64 md:h-72 bg-gray-100 overflow-hidden">
                    <img
                      src={farNextArticle.image}
                      alt={farNextArticle.title}
                      className="w-full h-full object-cover scale-[1.1]"
                      loading="lazy"
                    />
                  </div>
                </div>
              )}
            </div>

            <div className="flex justify-center gap-2 mt-3">
              {multimediaArticles.map((article, index) => (
                <button
                  key={article.id}
                  onClick={() => goToMultimediaIndex(index)}
                  className={`h-2 rounded-full transition-all ${index === multimediaIndex ? 'w-6 bg-white' : 'w-2 bg-white/45 hover:bg-white/70'}`}
                  aria-label={`Go to multimedia slide ${index + 1}`}
                />
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="flex flex-col lg:flex-row gap-8">
          <div className="lg:w-[68%] flex flex-col gap-10">
            <div className="bg-white border border-gray-200 rounded-xl overflow-hidden">
              <div className="px-4 py-4 border-b border-gray-200">
                <div className="flex flex-col gap-3">
                  <h2 className="text-2xl font-black text-gray-900">
                    <span className="border-l-4 border-red-600 pl-3">Bóng đá Việt Nam</span>
                  </h2>
                  <div className="flex flex-wrap gap-2 text-xs font-bold uppercase text-gray-600">
                    {['V-League', 'Các ĐTQG', 'Lịch thi đấu', 'Kết quả', 'Bảng xếp hạng'].map(item => (
                      <span key={item} className="px-3 py-1 rounded-full bg-gray-100">
                        {item}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              <div className="p-4 grid grid-cols-1 md:grid-cols-2 gap-4">
                {footballSection.map((article, index) => (
                  <div
                    key={article.id}
                    className={`group cursor-pointer ${index === 0 ? 'md:col-span-2 flex flex-col md:flex-row gap-4' : 'flex gap-4'}`}
                    onClick={() => navigate(`/article/${article.id}`)}
                  >
                    <div className={`${index === 0 ? 'md:w-1/2' : 'w-24 sm:w-28'} shrink-0 overflow-hidden rounded bg-gray-100 ${index === 0 ? 'aspect-[16/10]' : 'aspect-square'}`}>
                      <img
                        src={article.image}
                        alt={article.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        loading="lazy"
                      />
                    </div>
                    <div className="flex flex-col">
                      <h3 className={`font-bold text-gray-900 group-hover:text-red-600 leading-snug line-clamp-3 ${index === 0 ? 'text-lg sm:text-2xl' : 'text-sm sm:text-base'}`}>
                        {article.title}
                      </h3>
                      <p className="text-xs text-gray-600 mt-1 line-clamp-2">
                        {article.excerpt}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-white border border-gray-200 rounded-xl overflow-hidden">
              <div className="px-4 py-4 border-b border-gray-200">
                <div className="flex flex-col gap-3">
                  <h2 className="text-2xl font-black text-gray-900">
                    <span className="border-l-4 border-red-600 pl-3">Thể thao</span>
                  </h2>
                  <div className="flex flex-wrap gap-2 text-xs font-bold uppercase text-gray-600">
                    {['Bóng chuyền', 'Pickleball', 'Chạy', 'Tennis', 'Billiards Snooker', 'Golf'].map(item => (
                      <span key={item} className="px-3 py-1 rounded-full bg-gray-100">
                        {item}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              <div className="p-4 grid grid-cols-1 sm:grid-cols-2 gap-4">
                {sportSection.map((article, index) => (
                  <div
                    key={article.id}
                    className={`group cursor-pointer ${index === 0 ? 'sm:col-span-2 flex flex-col sm:flex-row gap-4' : 'flex gap-4'}`}
                    onClick={() => navigate(`/article/${article.id}`)}
                  >
                    <div className={`${index === 0 ? 'sm:w-1/2' : 'w-24'} shrink-0 overflow-hidden rounded bg-gray-100 ${index === 0 ? 'aspect-[16/10]' : 'aspect-square'}`}>
                      <img
                        src={article.image}
                        alt={article.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        loading="lazy"
                      />
                    </div>
                    <div className="flex flex-col">
                      <h3 className={`font-bold text-gray-900 group-hover:text-red-600 leading-snug line-clamp-3 ${index === 0 ? 'text-lg sm:text-2xl' : 'text-sm sm:text-base'}`}>
                        {article.title}
                      </h3>
                      <p className="text-xs text-gray-600 mt-1 line-clamp-2">
                        {article.excerpt}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="lg:w-[32%] flex flex-col gap-8 sticky top-[50px] z-30 h-fit max-h-[calc(100vh-70px)] overflow-y-auto">
            <div className="bg-white border border-gray-200 rounded-xl overflow-hidden">
              <div className="px-4 py-3 border-b border-gray-200">
                <span className="text-lg font-black text-gray-900">
                  Tiện ích
                </span>
              </div>

              <div className="p-4 space-y-4">
                <div className="border border-gray-100 rounded-lg p-3">
                  <h3 className="text-sm font-bold text-gray-900 uppercase mb-2">Thời tiết</h3>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-semibold text-gray-800">Hà Nội</span>
                    <span className="text-xs text-gray-500">{liveDateTime}</span>
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
                  <h3 className="text-sm font-bold text-gray-900 uppercase mb-2">Giá vàng</h3>
                  <p className="text-xs text-gray-600 mb-2">SJC Hà Nội (nghìn đồng/lượng)</p>
                  <div className="space-y-1 text-sm">
                    <div className="flex items-center justify-between">
                      <span className="text-gray-700">Mua vào</span>
                      <span className="font-semibold text-gray-900">169,700</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-gray-700">Bán ra</span>
                      <span className="font-semibold text-gray-900">172,700</span>
                    </div>
                  </div>
                </div>

                <div className="border border-gray-100 rounded-lg p-3">
                  <h3 className="text-sm font-bold text-gray-900 uppercase mb-2">Giá xăng (VNĐ/Lít)</h3>
                  <div className="space-y-1 text-sm">
                    <div className="flex items-center justify-between">
                      <span className="text-gray-700">Xăng RON 95-V</span>
                      <span className="font-semibold text-gray-900">24.380</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-gray-700">Xăng E5 RON 92-II</span>
                      <span className="font-semibold text-gray-900">22.340</span>
                    </div>
                  </div>
                </div>

                <div className="border border-gray-100 rounded-lg p-3">
                  <h3 className="text-sm font-bold text-gray-900 uppercase mb-2">Tỷ giá ngoại tệ (VNĐ)</h3>
                  <div className="space-y-1 text-sm">
                    <div className="flex items-center justify-between">
                      <span className="text-gray-700">USD</span>
                      <span className="font-semibold text-gray-900">26,130</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-gray-700">EUR</span>
                      <span className="font-semibold text-gray-900">30,332</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-gray-100 border-2 border-dashed border-gray-300 rounded-lg flex flex-col items-center justify-center text-gray-400 h-[250px] select-none">
              <p className="font-bold text-sm tracking-widest uppercase">Advertisement</p>
              <p className="text-xs mt-1">300 x 250</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}