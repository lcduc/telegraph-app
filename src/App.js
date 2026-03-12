import './App.css';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Header from './components/Header';
import HeroSection from './components/HeroSection';
import NewsGrid from './components/NewsGrid';
import ArticleDetail from './components/ArticleDetail';
import CategoryPage from './components/CategoryPage';

function App() {
  return (
    <BrowserRouter>
      <div className="bg-white min-h-screen">
        <Header />
        <Routes>
          <Route path="/" element={
            <>
              <HeroSection />
              <NewsGrid />
            </>
          } />
          <Route path="/article/:id" element={<ArticleDetail />} />
          <Route path="/category/:categoryName" element={<CategoryPage />} />
        </Routes>
        
        {/* Footer */}
        <footer className="bg-gray-900 text-gray-300 py-16 border-t-4 border-yellow-400">
          <div className="max-w-7xl mx-auto px-4 mb-12">
            <div className="grid grid-cols-4 gap-8">
              {/* Sport Links */}
              <div>
                <h4 className="text-white font-black text-lg mb-4 uppercase">Sport</h4>
                <ul className="space-y-2 text-sm">
                  <li><button className="hover:text-yellow-400 transition font-light">Football</button></li>
                  <li><button className="hover:text-yellow-400 transition font-light">Cricket</button></li>
                  <li><button className="hover:text-yellow-400 transition font-light">Rugby</button></li>
                  <li><button className="hover:text-yellow-400 transition font-light">Golf</button></li>
                </ul>
              </div>

              {/* About Links */}
              <div>
                <h4 className="text-white font-black text-lg mb-4 uppercase">About</h4>
                <ul className="space-y-2 text-sm">
                  <li><button className="hover:text-yellow-400 transition font-light">About Us</button></li>
                  <li><button className="hover:text-yellow-400 transition font-light">Careers</button></li>
                  <li><button className="hover:text-yellow-400 transition font-light">Contact</button></li>
                  <li><button className="hover:text-yellow-400 transition font-light">Advertise</button></li>
                </ul>
              </div>

              {/* Legal Links */}
              <div>
                <h4 className="text-white font-black text-lg mb-4 uppercase">Legal</h4>
                <ul className="space-y-2 text-sm">
                  <li><button className="hover:text-yellow-400 transition font-light">Privacy Policy</button></li>
                  <li><button className="hover:text-yellow-400 transition font-light">Terms & Conditions</button></li>
                  <li><button className="hover:text-yellow-400 transition font-light">Cookies</button></li>
                  <li><button className="hover:text-yellow-400 transition font-light">Complaints</button></li>
                </ul>
              </div>

              {/* Follow Links */}
              <div>
                <h4 className="text-white font-black text-lg mb-4 uppercase">Follow</h4>
                <ul className="space-y-2 text-sm">
                  <li><button className="hover:text-yellow-400 transition font-light">Facebook</button></li>
                  <li><button className="hover:text-yellow-400 transition font-light">Twitter</button></li>
                  <li><button className="hover:text-yellow-400 transition font-light">Instagram</button></li>
                  <li><button className="hover:text-yellow-400 transition font-light">YouTube</button></li>
                </ul>
              </div>
            </div>
          </div>

          {/* Copyright */}
          <div className="border-t border-gray-700 pt-8 max-w-7xl mx-auto px-4">
            <p className="text-gray-400 text-sm font-light">
              © 2024 Telegraph Media Group. All rights reserved.
            </p>
          </div>
        </footer>
      </div>
    </BrowserRouter>
  );
}

export default App;
