import { useNavigate } from 'react-router-dom';

export default function Header() {
  const navigate = useNavigate();

  const handleTelegraphClick = () => {
    navigate('/');
    window.scrollTo(0, 0);
  };

  return (
    <>
      {/* Top Bar */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 py-2 flex items-center justify-between text-xs">
          <div className="flex gap-6 items-center">
            <button onClick={handleTelegraphClick} className="font-bold hover:text-teal-600 transition-colors duration-300 cursor-pointer bg-none border-none p-0 text-lg tracking-wider">The Telegraph</button>
            <nav className="hidden md:flex gap-6 text-gray-600">
            </nav>
          </div>
          <div className="flex gap-4 items-center">
            <button className="text-gray-600 hover:text-gray-900">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </button>
            <button className="bg-teal-500 text-white px-3 py-1 rounded text-xs font-bold hover:bg-teal-600">Subscribe now</button>
            <button className="text-gray-600 hover:text-gray-900 text-xs">Log in</button>
          </div>
        </div>
      </div>

      {/* Sport Categories Bar */}
      <div className="bg-blue-900 text-white sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex gap-6 overflow-x-auto py-2 text-xs font-bold whitespace-nowrap">
            <button className="hover:text-yellow-300 transition-colors duration-300 hover:scale-110 transform">Football</button>
            <button className="hover:text-yellow-300 transition-colors duration-300 hover:scale-110 transform">Rugby Union</button>
            <button className="hover:text-yellow-300 transition-colors duration-300 hover:scale-110 transform">Cricket</button>
            <button className="hover:text-yellow-300 transition-colors duration-300 hover:scale-110 transform">Golf</button>
            <button className="hover:text-yellow-300 transition-colors duration-300 hover:scale-110 transform">Tennis</button>
            <button className="hover:text-yellow-300 transition-colors duration-300 hover:scale-110 transform">Boxing</button>
            <button className="hover:text-yellow-300 transition-colors duration-300 hover:scale-110 transform">Water Polo</button>
            <button className="hover:text-yellow-300 transition-colors duration-300 hover:scale-110 transform">Cycling</button>
            <button className="hover:text-yellow-300 transition-colors duration-300 hover:scale-110 transform">Sailing</button>
            <button className="hover:text-yellow-300 transition-colors duration-300 hover:scale-110 transform">Racing</button>
          </div>
        </div>
      </div>
    </>
  );
}
