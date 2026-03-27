import { useNavigate } from 'react-router-dom';

export default function HeroSection() {
  const navigate = useNavigate();

  return (
    <section className="bg-gray-50 border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="bg-white rounded p-6 cursor-pointer hover:shadow-2xl transition-all duration-500 hover:scale-[1.02]">
          <div className="text-sm font-bold text-red-600 mb-3 uppercase">FA CUP</div>
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-black mb-2">West Ham United 2-2 Brentford</h2>
              <p className="text-sm text-gray-600">Quarter-finals • Match report and analysis</p>
            </div>
            <button className="bg-red-600 text-white px-6 py-2 font-bold hover:bg-red-700 transition-all duration-300 hover:shadow-lg hover:scale-110">
              Read More
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
