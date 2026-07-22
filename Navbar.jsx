import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Activity, Sun, Moon, Menu, X, User as UserIcon } from 'lucide-react';
import useAuthStore from '../store/authStore';
import { useTheme } from '../context/ThemeContext';
import { motion, AnimatePresence } from 'framer-motion';

const Navbar = () => {
  const { isAuthenticated, user, logout } = useAuthStore();
  const { theme, toggleTheme } = useTheme();
  const navigate = useNavigate();
  const location = useLocation();
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    setMobileMenuOpen(false);
  }, [location.pathname]);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const navLinks = [
    { name: 'Home', path: '/' },
    { name: 'Find Doctors', path: '/doctors' },
  ];

  return (
    <>
      <header 
        className={`fixed top-0 w-full z-50 transition-all duration-300 ${
          isScrolled 
            ? 'glass py-3' 
            : 'bg-transparent py-5'
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center">
            {/* Logo */}
            <Link to="/" className="flex items-center gap-2 group">
              <div className="p-2 bg-primary-100 dark:bg-primary-900/50 rounded-xl group-hover:scale-105 transition-transform">
                <Activity className="h-6 w-6 text-primary-600 dark:text-primary-400" />
              </div>
              <span className="font-bold text-2xl tracking-tight text-slate-900 dark:text-white">
                Health<span className="text-secondary">Sphere</span>
              </span>
            </Link>

            {/* Desktop Navigation */}
            <nav className="hidden md:flex items-center gap-8">
              {navLinks.map((link) => (
                <Link 
                  key={link.name} 
                  to={link.path}
                  className={`font-medium text-sm transition-colors hover:text-primary-600 dark:hover:text-primary-400 ${
                    location.pathname === link.path 
                      ? 'text-primary-600 dark:text-primary-400 font-semibold' 
                      : 'text-slate-600 dark:text-slate-300'
                  }`}
                >
                  {link.name}
                </Link>
              ))}
            </nav>

            {/* Actions */}
            <div className="hidden md:flex items-center gap-4">
              <button 
                onClick={toggleTheme} 
                className="p-2 text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white transition-colors rounded-full hover:bg-slate-100 dark:hover:bg-slate-800"
                aria-label="Toggle Dark Mode"
              >
                {theme === 'dark' ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
              </button>

              <div className="w-px h-6 bg-slate-200 dark:bg-slate-700 mx-2"></div>

              {isAuthenticated ? (
                <div className="flex items-center gap-4">
                  <Link 
                    to={`/${user?.role}-dashboard`}
                    className="flex items-center gap-2 text-sm font-medium text-slate-700 dark:text-slate-200 hover:text-primary-600 dark:hover:text-primary-400 transition-colors"
                  >
                    <div className="w-8 h-8 rounded-full bg-primary-100 dark:bg-primary-900/50 flex items-center justify-center text-primary-600 dark:text-primary-400">
                      <UserIcon className="w-4 h-4" />
                    </div>
                    {user?.name.split(' ')[0]}
                  </Link>
                  <button 
                    onClick={handleLogout}
                    className="text-sm font-medium text-red-500 hover:text-red-700 transition-colors px-3 py-1.5 rounded-md hover:bg-red-50 dark:hover:bg-red-500/10"
                  >
                    Logout
                  </button>
                </div>
              ) : (
                <div className="flex items-center gap-3">
                  <Link 
                    to="/login" 
                    className="text-sm font-medium text-slate-700 dark:text-slate-200 hover:text-primary-600 dark:hover:text-primary-400 px-4 py-2"
                  >
                    Log in
                  </Link>
                  <Link 
                    to="/register" 
                    className="bg-primary-600 hover:bg-primary-700 text-white px-5 py-2.5 rounded-xl font-medium text-sm transition-all shadow-md hover:shadow-lg transform hover:-translate-y-0.5"
                  >
                    Sign up
                  </Link>
                </div>
              )}
            </div>

            {/* Mobile menu button */}
            <div className="md:hidden flex items-center gap-4">
              <button onClick={toggleTheme} className="p-2 text-slate-500 dark:text-slate-400">
                {theme === 'dark' ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
              </button>
              <button 
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white"
              >
                {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Mobile Menu */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="fixed inset-0 z-40 bg-white dark:bg-dark-bg pt-20 px-4"
          >
            <div className="flex flex-col gap-6 text-center mt-10">
              {navLinks.map((link) => (
                <Link 
                  key={link.name} 
                  to={link.path}
                  className="text-2xl font-semibold text-slate-900 dark:text-white"
                >
                  {link.name}
                </Link>
              ))}
              
              <div className="h-px bg-slate-200 dark:bg-slate-800 w-1/2 mx-auto my-4"></div>
              
              {isAuthenticated ? (
                <>
                  <Link 
                    to={`/${user?.role}-dashboard`}
                    className="text-xl font-medium text-primary-600 dark:text-primary-400"
                  >
                    Dashboard
                  </Link>
                  <button 
                    onClick={handleLogout}
                    className="text-xl font-medium text-red-500"
                  >
                    Logout
                  </button>
                </>
              ) : (
                <div className="flex flex-col gap-4 mt-4">
                  <Link 
                    to="/login" 
                    className="text-xl font-medium text-slate-700 dark:text-slate-200 bg-slate-100 dark:bg-slate-800 py-3 rounded-xl mx-8"
                  >
                    Log in
                  </Link>
                  <Link 
                    to="/register" 
                    className="text-xl font-medium text-white bg-primary-600 py-3 rounded-xl mx-8"
                  >
                    Sign up
                  </Link>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default Navbar;
