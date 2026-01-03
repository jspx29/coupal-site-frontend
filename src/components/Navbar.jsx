import { Link, useLocation } from 'react-router-dom';
import { useState, useEffect, useRef } from 'react';
import { Menu, X, LogOut, ChevronDown } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import cat_nav from '../assets/cat-nav.png';

const navigation = [
  { name: 'Home', href: '/' },
  { name: 'Notes', href: '/notes' },
  { name: 'Tracker', href: '/tracker' },
  {
    name: 'Occasions',
    isDropdown: true,
    items: [
      { name: 'Anniversary', href: '/anniversary' },
      { name: 'New Year', href: '/newyear' },
    ],
  },
  { name: 'About Us', href: '/about' },
];

export default function Navbar() {
  const location = useLocation();
  const { logout } = useAuth();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [desktopDropdownOpen, setDesktopDropdownOpen] = useState(false);
  const [mobileDropdownOpen, setMobileDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);

  // Close desktop dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setDesktopDropdownOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleNavClick = () => {
    setIsMobileMenuOpen(false);
    setMobileDropdownOpen(false);
  };

  const isOccasionActive = () => {
    const occasionsItem = navigation.find((item) => item.isDropdown);
    return occasionsItem?.items.some((item) => location.pathname === item.href);
  };

  return (
    <nav className="sticky top-0 z-50 bg-gradient-to-r from-purple-100 via-pink-50 to-indigo-100 shadow-md">
      {/* Desktop Navigation */}
      <div className="hidden md:flex items-center justify-between px-6 lg:px-12 py-4">
        {/* Left Side: Brand/Logo */}
        <div className="flex items-center w-1/4">
          <img
            src={cat_nav}
            alt="Cat Icon"
            className="w-[62px] h-[62px] mr-2"
          />
          <h1 className="text-xl font-bold text-purple-900">Notes App</h1>
        </div>

        {/* Center: Navigation Links */}
        <div className="flex justify-center flex-1">
          <ul className="flex space-x-2 lg:space-x-4 bg-white/40 backdrop-blur-sm px-4 lg:px-6 py-3 rounded-full shadow-lg shadow-pink-200/50 border border-white/20">
            {navigation.map((item) => (
              <li
                key={item.name}
                className="relative"
                ref={item.isDropdown ? dropdownRef : null}
              >
                {item.isDropdown ? (
                  <>
                    <button
                      onClick={() =>
                        setDesktopDropdownOpen(!desktopDropdownOpen)
                      }
                      className={`px-3 lg:px-4 py-2 rounded-full font-medium transition-all duration-200 text-sm lg:text-base flex items-center gap-1 ${
                        isOccasionActive()
                          ? 'bg-pink-200 text-purple-800 shadow-inner'
                          : 'text-purple-700 hover:bg-pink-100 hover:text-purple-900'
                      }`}
                    >
                      {item.name}
                      <ChevronDown
                        size={16}
                        className={`transition-transform duration-200 ${
                          desktopDropdownOpen ? 'rotate-180' : ''
                        }`}
                      />
                    </button>

                    {/* Desktop Dropdown Menu */}
                    {desktopDropdownOpen && (
                      <div className="absolute top-full mt-2 left-0 bg-white rounded-lg shadow-xl border border-purple-100 py-2 min-w-[160px] z-50">
                        {item.items.map((subItem) => (
                          <Link
                            key={subItem.name}
                            to={subItem.href}
                            onClick={() => setDesktopDropdownOpen(false)}
                            className={`block px-4 py-2 text-sm transition-colors ${
                              location.pathname === subItem.href
                                ? 'bg-pink-100 text-purple-800 font-semibold'
                                : 'text-purple-700 hover:bg-purple-50'
                            }`}
                          >
                            {subItem.name}
                          </Link>
                        ))}
                      </div>
                    )}
                  </>
                ) : (
                  <Link
                    to={item.href}
                    className={`px-3 lg:px-4 py-2 rounded-full font-medium transition-all duration-200 relative inline-block text-sm lg:text-base ${
                      location.pathname === item.href
                        ? 'bg-pink-200 text-purple-800 shadow-inner'
                        : 'text-purple-700 hover:bg-pink-100 hover:text-purple-900'
                    }`}
                  >
                    {item.name}
                  </Link>
                )}
              </li>
            ))}
          </ul>
        </div>

        {/* Right Side: Logout Button */}
        <div className="flex justify-end w-1/4">
          <button
            onClick={logout}
            className="flex items-center gap-2 px-4 py-2 text-sm font-semibold text-purple-700 bg-white/40 hover:bg-red-100 hover:text-red-600 rounded-full transition-all duration-300 border border-white/20 shadow-sm"
          >
            <LogOut size={16} />
            <span>Logout</span>
          </button>
        </div>
      </div>

      {/* Mobile Navigation */}
      <div className="md:hidden">
        <div className="flex items-center justify-between px-4 py-3">
          <div className="flex items-center">
            <img src={cat_nav} alt="Cat Icon" className="w-12 h-12 mr-2" />
            <h1 className="text-lg font-bold text-purple-900">Notes App</h1>
          </div>

          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="p-2 rounded-lg bg-white/40 backdrop-blur-sm text-purple-700 hover:bg-pink-100 transition-colors"
          >
            {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {isMobileMenuOpen && (
          <div className="absolute top-full left-0 right-0 bg-white/95 backdrop-blur-md shadow-lg border-t border-purple-100 transition-all duration-300 ease-in-out">
            <ul className="py-2">
              {navigation.map((item) => (
                <li key={item.name}>
                  {item.isDropdown ? (
                    <>
                      <button
                        onClick={() =>
                          setMobileDropdownOpen(!mobileDropdownOpen)
                        }
                        className={`w-full flex items-center justify-between px-6 py-3 font-medium transition-all duration-200 text-sm ${
                          isOccasionActive()
                            ? 'bg-pink-200 text-purple-800'
                            : 'text-purple-700 hover:bg-pink-50'
                        }`}
                      >
                        <span>{item.name}</span>
                        <ChevronDown
                          size={16}
                          className={`transition-transform duration-200 ${
                            mobileDropdownOpen ? 'rotate-180' : ''
                          }`}
                        />
                      </button>

                      {/* Mobile Dropdown Items */}
                      {mobileDropdownOpen && (
                        <div className="bg-purple-50/50">
                          {item.items.map((subItem) => (
                            <Link
                              key={subItem.name}
                              to={subItem.href}
                              onClick={handleNavClick}
                              className={`block pl-12 pr-6 py-2.5 text-sm transition-colors ${
                                location.pathname === subItem.href
                                  ? 'bg-pink-100 text-purple-800 font-semibold'
                                  : 'text-purple-600 hover:bg-pink-50'
                              }`}
                            >
                              {subItem.name}
                            </Link>
                          ))}
                        </div>
                      )}
                    </>
                  ) : (
                    <Link
                      to={item.href}
                      onClick={handleNavClick}
                      className={`block px-6 py-3 font-medium transition-all duration-200 text-sm ${
                        location.pathname === item.href
                          ? 'bg-pink-200 text-purple-800'
                          : 'text-purple-700 hover:bg-pink-50'
                      }`}
                    >
                      {item.name}
                    </Link>
                  )}
                </li>
              ))}

              <li className="mt-1 border-t border-purple-50">
                <button
                  onClick={() => {
                    handleNavClick();
                    logout();
                  }}
                  className="w-full flex items-center justify-between px-6 py-3 text-sm font-medium text-red-500 hover:bg-red-50 transition-colors"
                >
                  Logout
                  <LogOut size={16} />
                </button>
              </li>
            </ul>
          </div>
        )}
      </div>
    </nav>
  );
}
