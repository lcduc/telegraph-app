import { useNavigate } from "react-router-dom";

export default function Header() {
  const navigate = useNavigate();

  const goToCategory = (categorySlug) => {
    navigate(`/category/${categorySlug}`);
    window.scrollTo(0, 0);
  };


  return (
    <>
      {/* Top Bar */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 py-2 flex items-center justify-end gap-4 text-xs">
          <button className="text-gray-600 hover:text-gray-900">
            <svg
              className="w-4 h-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              />
            </svg>
          </button>
          <button className="bg-blue-600 text-white px-3 py-1 rounded text-xs font-bold hover:bg-blue-700">
            Subscribe now
          </button>
          <button className="text-gray-600 hover:text-gray-900 text-xs">
            Log in
          </button>
        </div>
      </div>

      {/* Centered Logo Section */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 flex justify-center my-4 md:my-6">
          <button
            onClick={() => {
              navigate("/");
              window.scrollTo(0, 0);
            }}
            className="hover:opacity-80 transition-opacity duration-300 cursor-pointer bg-none border-none p-0"
          >
            <img
              src="/images/z7837973747700_c3bd5440ee25f4cf0a65aa77d20a943c.jpg"
              alt="Logo"
              className="h-24 md:h-28 w-auto object-contain"
            />
          </button>
        </div>
      </div>

      {/* Sport Categories Bar */}
      <div className="bg-blue-900 text-white sticky top-0 z-50 shadow-lg">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex gap-6 overflow-x-auto py-2 text-xs font-bold whitespace-nowrap">
            <button
              type="button"
              onClick={() => {
                navigate("/");
                window.scrollTo(0, 0);
              }}
              className="inline-block origin-left hover:text-yellow-300 transition-colors duration-300 hover:scale-110 transform"
            >
              Trang chủ
            </button>
            <button
              type="button"
              onClick={() => goToCategory("football")}
              className="inline-block origin-left hover:text-yellow-300 transition-colors duration-300 hover:scale-110 transform"
            >
              Bóng đá
            </button>
            <button
              type="button"
              onClick={() => goToCategory("basketball")}
              className="inline-block origin-left hover:text-yellow-300 transition-colors duration-300 hover:scale-110 transform"
            >
              Bóng rổ
            </button>
            <button
              type="button"
              className="inline-block origin-left hover:text-yellow-300 transition-colors duration-300 hover:scale-110 transform"
            >
              Golf
            </button>
            <button
              type="button"
              className="inline-block origin-left hover:text-yellow-300 transition-colors duration-300 hover:scale-110 transform"
            >
              Đấm bốc
            </button>
            <button
              type="button"
              onClick={() => goToCategory("tennis")}
              className="inline-block origin-left hover:text-yellow-300 transition-colors duration-300 hover:scale-110 transform"
            >
              Tennis
            </button>
            <button
              type="button"
              className="inline-block origin-left hover:text-yellow-300 transition-colors duration-300 hover:scale-110 transform"
            >
              Đạp xe
            </button>
            <button
              type="button"
              onClick={() => goToCategory("f1")}
              className="inline-block origin-left hover:text-yellow-300 transition-colors duration-300 hover:scale-110 transform"
            >
              F1
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
