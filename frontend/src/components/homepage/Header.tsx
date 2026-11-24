import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { MenuOutlined, CloseOutlined, UserOutlined, DashboardOutlined } from '@ant-design/icons';

const Header: React.FC = () => {
  const { user, token } = useAuth();
  const navigate = useNavigate();
  const [, setIsScrolled] = useState(false);
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
    <header className="fixed top-0 left-0 right-0 z-50 bg-[#FDFBF7] shadow-sm border-b border-[#E8E2D5] transition-all">
      {/* Top Announcement Bar */}
      <div className="bg-[#F5F0E6] border-b border-[#E8E2D5] py-2 text-xs text-[#4B5563]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-wrap items-center justify-between gap-2">
          {/* Left Highlights */}
          <div className="flex items-center space-x-6">
            <span className="flex items-center gap-1.5 font-medium">
              <span>✈</span> 20 ans d'expérience
            </span>
            <span className="hidden sm:flex items-center gap-1.5 font-medium">
              <span>👥</span> +12 000 pèlerins accompagnés
            </span>
            <span className="hidden md:flex items-center gap-1.5 font-medium">
              <span>🛡</span> Licence agréée
            </span>
          </div>

          {/* Right Contact & Client Portal */}
          <div className="flex items-center space-x-4">
            <a
              href="tel:+966545126462"
              className="flex items-center gap-1.5 font-semibold text-[#1F2937] hover:text-[#2D5A4C] transition-colors"
            >
              <span>📞</span> +966 545 126 462
            </a>
            <a
              href="https://wa.me/966545126462"
              target="_blank"
              rel="noopener noreferrer"
              className="w-6 h-6 rounded-full bg-[#EBF2EE] text-[#2D5A4C] flex items-center justify-center hover:bg-[#2D5A4C] hover:text-white transition-all text-xs"
              title="WhatsApp Direct"
            >
              💬
            </a>
            <Link
              to={token ? (user?.role === 'pelerin' ? '/pelerin/dashboard' : '/agent/dashboard') : '/connexion'}
              className="px-3 py-1 bg-[#FDFBF7] border border-[#E8E2D5] hover:border-[#2D5A4C] rounded-full text-[11px] font-bold text-[#1F2937] hover:text-[#2D5A4C] transition-all flex items-center gap-1.5"
            >
              <UserOutlined className="text-[10px]" />
              {token ? 'Mon Espace' : 'Espace client'}
            </Link>
          </div>
        </div>
      </div>

      {/* Main Navbar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3.5">
        <div className="flex items-center justify-between">
          {/* Logo ASEMAOU */}
          <Link to="/" className="flex items-center space-x-3">
            <div className="w-11 h-11 bg-[#2D5A4C] rounded-xl flex items-center justify-center text-xl shadow-md border border-[#B45309]/30 shrink-0 text-[#FDFBF7]">
              🕋
            </div>
            <div>
              <span className="block text-lg font-black text-[#2D5A4C] tracking-tight leading-none uppercase font-sans">
                ASEMAOU
              </span>
              <span className="block text-[9px] font-bold text-[#B45309] uppercase tracking-wider mt-0.5">
                Voyage et Tourisme HDJ
              </span>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center space-x-7">
            {navLinks.map((link, idx) => (
              <a
                key={link.label}
                href={link.href}
                className={`text-sm font-semibold transition-all relative py-1 ${
                  idx === 0
                    ? 'text-[#2D5A4C] after:absolute after:bottom-0 after:left-0 after:right-0 after:h-[2px] after:bg-[#B45309]'
                    : 'text-[#4B5563] hover:text-[#2D5A4C]'
                }`}
              >
                {link.label}
              </a>
            ))}
          </nav>

          {/* Action CTA Button (10% Accent Terre Cuite) */}
          <div className="hidden lg:flex items-center space-x-4">
            <button
              onClick={handleBookNow}
              className="btn-primary !py-2.5 !px-5 shadow-md flex items-center gap-2 cursor-pointer"
            >
              <span>📅</span>
              Réserver maintenant
            </button>
          </div>

          {/* Mobile Menu Button */}
          <div className="flex lg:hidden items-center space-x-3">
            <button
              onClick={handleBookNow}
              className="btn-primary !px-3.5 !py-2 !text-xs"
            >
              Réserver
            </button>
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="p-2 text-[#2D5A4C] hover:bg-[#F5F0E6] rounded-lg transition-colors"
            >
              {isMobileMenuOpen ? <CloseOutlined style={{ fontSize: 20 }} /> : <MenuOutlined style={{ fontSize: 20 }} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu Panel */}
      {isMobileMenuOpen && (
        <div className="lg:hidden bg-[#FDFBF7] shadow-xl border-t border-[#E8E2D5] py-4 px-6 space-y-4">
          <nav className="flex flex-col space-y-3">
            {navLinks.map((link) => (
              <a
                key={link.label}
                href={link.href}
                onClick={() => setIsMobileMenuOpen(false)}
                className="text-[#1F2937] text-sm font-semibold hover:text-[#2D5A4C] py-1"
              >
                {link.label}
              </a>
            ))}
          </nav>
          
          <div className="border-t border-[#E8E2D5] pt-4 flex flex-col gap-2.5">
            {token ? (
              <Link
                to={user?.role === 'pelerin' ? '/pelerin/dashboard' : '/agent/dashboard'}
                onClick={() => setIsMobileMenuOpen(false)}
                className="flex items-center justify-center gap-2 bg-[#F5F0E6] text-[#2D5A4C] py-2.5 rounded-xl font-bold text-xs hover:bg-[#EBF2EE]"
              >
                <DashboardOutlined />
                Tableau de bord
              </Link>
            ) : (
              <Link
                to="/connexion"
                onClick={() => setIsMobileMenuOpen(false)}
                className="text-center text-[#2D5A4C] py-2.5 text-xs font-bold border border-[#E8E2D5] rounded-xl hover:bg-[#F5F0E6]"
              >
                Espace Client / Connexion
              </Link>
            )}
          </div>
        </div>
      )}
    </header>
  );
};

export default Header;
