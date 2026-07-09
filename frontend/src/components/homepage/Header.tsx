import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { MenuOutlined, CloseOutlined, UserOutlined, DashboardOutlined, LogoutOutlined } from '@ant-design/icons';

const Header: React.FC = () => {
  const { user, token, logout } = useAuth();
  const navigate = useNavigate();
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 20) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleBookNow = () => {
    if (token) {
      if (user?.role === 'pelerin') {
        navigate('/pelerin/dashboard');
      } else if (user?.role === 'agent' || user?.role === 'admin') {
        navigate('/agent/dashboard');
      }
    } else {
      navigate('/inscription');
    }
  };

  const navLinks = [
    { label: 'Accueil', href: '#accueil' },
    { label: 'Hajj', href: '#hajj' },
    { label: 'Omra', href: '#omra' },
    { label: 'Offres', href: '#offres' },
    { label: 'Services', href: '#services' },
    { label: 'Témoignages', href: '#temoignages' },
    { label: 'Blog', href: '#blog' },
    { label: 'Contact', href: '#contact' },
  ];

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled
          ? 'bg-white/95 dark:bg-zinc-950/95 backdrop-blur-md shadow-md py-4'
          : 'bg-transparent py-6'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2">
            <span className="text-2xl font-bold bg-gradient-to-r from-emerald-600 to-amber-500 bg-clip-text text-transparent">
              HajjOmra BF
            </span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center space-x-8">
            {navLinks.map((link) => (
              <a
                key={link.label}
                href={link.href}
                className={`text-sm font-medium transition-colors hover:text-emerald-600 ${
                  isScrolled ? 'text-zinc-700 dark:text-zinc-300' : 'text-white hover:text-emerald-200'
                }`}
              >
                {link.label}
              </a>
            ))}
          </nav>

          {/* Actions */}
          <div className="hidden lg:flex items-center space-x-4">
            {token ? (
              <div className="flex items-center space-x-3">
                <Link
                  to={user?.role === 'pelerin' ? '/pelerin/dashboard' : '/agent/dashboard'}
                  className={`flex items-center gap-1.5 px-4 py-2 rounded-full text-sm font-medium transition-all ${
                    isScrolled
                      ? 'bg-zinc-100 text-zinc-800 hover:bg-zinc-200 dark:bg-zinc-900 dark:text-zinc-200 dark:hover:bg-zinc-800'
                      : 'bg-white/10 text-white hover:bg-white/20 backdrop-blur-sm'
                  }`}
                >
                  <DashboardOutlined />
                  Tableau de bord
                </Link>
                <button
                  onClick={logout}
                  className={`p-2 rounded-full hover:bg-red-50 hover:text-red-600 transition-colors ${
                    isScrolled ? 'text-zinc-500' : 'text-white/80 hover:bg-white/10'
                  }`}
                  title="Déconnexion"
                >
                  <LogoutOutlined className="text-lg" />
                </button>
              </div>
            ) : (
              <Link
                to="/connexion"
                className={`text-sm font-semibold transition-colors ${
                  isScrolled ? 'text-zinc-700 dark:text-zinc-300 hover:text-emerald-600' : 'text-white hover:text-emerald-200'
                }`}
              >
                Connexion
              </Link>
            )}

            <button
              onClick={handleBookNow}
              className="bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-sm px-6 py-2.5 rounded-full shadow-lg shadow-emerald-600/20 transition-all hover:scale-105 active:scale-95"
            >
              Réserver maintenant
            </button>
          </div>

          {/* Mobile Menu Button */}
          <div className="flex lg:hidden items-center space-x-3">
            <button
              onClick={handleBookNow}
              className="bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-xs px-4 py-2 rounded-full shadow-md transition-all"
            >
              Réserver
            </button>
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className={`p-2 rounded-lg transition-colors ${
                isScrolled ? 'text-zinc-800 dark:text-white' : 'text-white hover:bg-white/10'
              }`}
            >
              {isMobileMenuOpen ? <CloseOutlined style={{ fontSize: 20 }} /> : <MenuOutlined style={{ fontSize: 20 }} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu Panel */}
      {isMobileMenuOpen && (
        <div className="lg:hidden absolute top-full left-0 right-0 bg-white dark:bg-zinc-950 shadow-xl border-t border-zinc-100 dark:border-zinc-900 py-4 px-6 space-y-4">
          <nav className="flex flex-col space-y-3">
            {navLinks.map((link) => (
              <a
                key={link.label}
                href={link.href}
                onClick={() => setIsMobileMenuOpen(false)}
                className="text-zinc-700 dark:text-zinc-300 text-base font-medium hover:text-emerald-600 py-1"
              >
                {link.label}
              </a>
            ))}
          </nav>
          
          <div className="border-t border-zinc-100 dark:border-zinc-900 pt-4 flex flex-col gap-3">
            {token ? (
              <>
                <Link
                  to={user?.role === 'pelerin' ? '/pelerin/dashboard' : '/agent/dashboard'}
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="flex items-center justify-center gap-2 bg-zinc-100 dark:bg-zinc-900 text-zinc-800 dark:text-zinc-200 py-2.5 rounded-xl font-medium text-sm"
                >
                  <DashboardOutlined />
                  Tableau de bord
                </Link>
                <button
                  onClick={() => {
                    setIsMobileMenuOpen(false);
                    logout();
                  }}
                  className="flex items-center justify-center gap-2 text-red-600 py-2 rounded-xl text-sm font-medium hover:bg-red-50"
                >
                  <LogoutOutlined />
                  Se déconnecter
                </button>
              </>
            ) : (
              <Link
                to="/connexion"
                onClick={() => setIsMobileMenuOpen(false)}
                className="text-center text-zinc-700 dark:text-zinc-300 py-2 text-sm font-semibold border border-zinc-200 dark:border-zinc-800 rounded-xl"
              >
                Connexion
              </Link>
            )}
          </div>
        </div>
      )}
    </header>
  );
};

export default Header;
