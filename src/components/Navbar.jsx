import { Link, useLocation } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { Menu, X } from 'lucide-react';
import kuromi_nav from '../assets/kuromi-nav.png';

const navigation = [
  { name: 'Home', href: '/' },
  { name: 'Notes', href: '/notes' },
  { name: 'Ano to?', href: '/anniversary' },
  { name: 'About Us', href: '/about' },
];

export default function Navbar() {
  const location = useLocation();
  const [isAnniversaryShining, setIsAnniversaryShining] = useState(true);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    setIsAnniversaryShining(true);
  }, []);

  const handleAnniversaryClick = () => {
    setIsAnniversaryShining(false);
    setIsMobileMenuOpen(false);
  };

  const handleNavClick = () => {
    setIsMobileMenuOpen(false);
  };

  return (
    <nav className="sticky top-0 z-50 bg-gradient-to-r from-purple-100 via-pink-50 to-indigo-100 shadow-md">
      <div className="hidden md:flex justify-center py-4">
        <ul className="flex space-x-2 lg:space-x-4 bg-white/40 backdrop-blur-sm px-4 lg:px-6 py-3 rounded-full shadow-lg shadow-pink-200/50">
          {navigation.map((item) => (
            <li key={item.name} className="relative">
              <Link
                to={item.href}
                onClick={
                  item.name === 'Ano to?' ? handleAnniversaryClick : undefined
                }
                className={`px-3 lg:px-4 py-2 rounded-full font-medium transition-all duration-200 relative inline-block text-sm lg:text-base ${
                  location.pathname === item.href
                    ? 'bg-pink-200 text-purple-800 shadow-inner'
                    : 'text-purple-700 hover:bg-pink-100 hover:text-purple-900'
                } ${
                  item.name === 'Ano to?' && isAnniversaryShining
                    ? 'bg-gradient-to-r from-purple-500 via-pink-500 to-purple-500 text-white shadow-lg animate-pulse'
                    : ''
                }`}
              >
                {item.name}

                {item.name === 'Ano to?' && isAnniversaryShining && (
                  <>
                    <span className="absolute -top-1 -left-1 text-yellow-400 animate-ping">
                      ✨
                    </span>
                    <span
                      className="absolute -top-1 -right-1 text-pink-400 animate-bounce"
                      style={{ animationDelay: '0.2s' }}
                    >
                      🎉
                    </span>
                    <span
                      className="absolute -bottom-1 -left-1 text-purple-400 animate-bounce"
                      style={{ animationDelay: '0.4s' }}
                    >
                      💕
                    </span>
                    <span
                      className="absolute -bottom-1 -right-1 text-pink-300 animate-ping"
                      style={{ animationDelay: '0.3s' }}
                    >
                      ⭐
                    </span>
                    <span className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-3 text-purple-400 text-xs animate-bounce">
                      🎊
                    </span>
                    <span
                      className="absolute bottom-0 left-1/4 translate-y-3 text-pink-400 text-xs animate-pulse"
                      style={{ animationDelay: '0.5s' }}
                    >
                      💖
                    </span>
                  </>
                )}
              </Link>
            </li>
          ))}
        </ul>
      </div>

      <div className="md:hidden">
        <div className="flex items-center justify-between px-4 py-3">
          <div className="flex items-center">
            <img
              src={kuromi_nav}
              alt="CouPal Icon"
              className="w-12 h-12 mr-2"
            />
            <h1 className="text-lg font-bold text-purple-900">Coupal App</h1>
          </div>

          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="p-2 rounded-lg bg-white/40 backdrop-blur-sm text-purple-700 hover:bg-pink-100 transition-colors"
          >
            {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {isMobileMenuOpen && (
          <div className="absolute top-full left-0 right-0 bg-white/95 backdrop-blur-md shadow-lg border-t border-purple-100">
            <ul className="py-2">
              {navigation.map((item) => (
                <li key={item.name} className="relative">
                  <Link
                    to={item.href}
                    onClick={
                      item.name === 'Ano to?'
                        ? handleAnniversaryClick
                        : handleNavClick
                    }
                    className={`block px-6 py-3 font-medium transition-all duration-200 ${
                      location.pathname === item.href
                        ? 'bg-pink-200 text-purple-800'
                        : 'text-purple-700 hover:bg-pink-50'
                    } ${
                      item.name === 'Ano to?' && isAnniversaryShining
                        ? 'bg-gradient-to-r from-purple-500 via-pink-500 to-purple-500 text-white'
                        : ''
                    }`}
                  >
                    <span className="flex items-center justify-between">
                      {item.name}
                      {item.name === 'Ano to?' && isAnniversaryShining && (
                        <span className="flex gap-1">
                          <span className="animate-bounce">🎉</span>
                          <span className="animate-pulse">💕</span>
                        </span>
                      )}
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>

      <style jsx>{`
        @keyframes shine {
          0%,
          100% {
            background-position: 0% 50%;
          }
          50% {
            background-position: 100% 50%;
          }
        }
      `}</style>
    </nav>
  );
}
