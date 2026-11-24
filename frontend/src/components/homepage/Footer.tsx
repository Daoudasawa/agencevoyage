import React from 'react';

interface FooterProps {
  contactInfo?: Record<string, string>;
}

const Footer: React.FC<FooterProps> = ({ contactInfo = {} }) => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-[#2D5A4C] text-[#FDFBF7]/80 pt-16 pb-8 border-t border-[#23473C] relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
        {/* About */}
        <div className="space-y-4">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-[#23473C] rounded-xl flex items-center justify-center text-lg border border-[#B45309]/40 shrink-0 text-[#FDFBF7]">
              🕋
            </div>
            <div>
              <span className="block text-base font-black text-white uppercase font-sans">
                ASEMAOU
              </span>
              <span className="block text-[8px] font-bold text-[#FEF3C7] uppercase tracking-wider">
                Voyage et Tourisme HDJ
              </span>
            </div>
          </div>
          <p className="text-xs text-[#FDFBF7]/75 leading-relaxed font-normal">
            Votre agence de voyage et de tourisme agréée au Burkina Faso pour l'organisation de vos pèlerinages Hajj et Omra. Sécurité, rigueur et sérénité.
          </p>
        </div>

        {/* Quick Links */}
        <div>
          <h3 className="text-white font-bold text-xs uppercase tracking-wider mb-5">Liens Rapides</h3>
          <ul className="space-y-2.5 text-xs font-medium">
            <li><a href="#accueil" className="hover:text-[#FEF3C7] transition-colors">Accueil</a></li>
            <li><a href="#offres" className="hover:text-[#FEF3C7] transition-colors">Nos Formules Omra</a></li>
            <li><a href="#hajj" className="hover:text-[#FEF3C7] transition-colors">Formules Hajj</a></li>
            <li><a href="#services" className="hover:text-[#FEF3C7] transition-colors">Services Inclus</a></li>
            <li><a href="#contact" className="hover:text-[#FEF3C7] transition-colors">Contact</a></li>
          </ul>
        </div>

        {/* Support */}
        <div>
          <h3 className="text-white font-bold text-xs uppercase tracking-wider mb-5">Support & Légal</h3>
          <ul className="space-y-2.5 text-xs font-medium">
            <li><a href="#faq" className="hover:text-[#FEF3C7] transition-colors">Foire Aux Questions</a></li>
            <li><a href="/mentions-legales" className="hover:text-[#FEF3C7] transition-colors">Mentions Légales</a></li>
            <li><a href="/confidentialite" className="hover:text-[#FEF3C7] transition-colors">Politique de Confidentialité</a></li>
            <li><a href="/conditions" className="hover:text-[#FEF3C7] transition-colors">CGV / Conditions de Vente</a></li>
          </ul>
        </div>

        {/* Contact Info */}
        <div>
          <h3 className="text-white font-bold text-xs uppercase tracking-wider mb-5">Contactez-nous</h3>
          <ul className="space-y-3 text-xs font-medium">
            <li className="flex items-start gap-2.5">
              <span className="text-[#FEF3C7]">📍</span>
              <span>{contactInfo.address || "Avenue Kwamé N'Krumah, Ouagadougou, Burkina Faso"}</span>
            </li>
            <li className="flex items-center gap-2.5">
              <span className="text-[#FEF3C7]">📞</span>
              <a href={`tel:${contactInfo.phone || '+966545126462'}`} className="hover:text-[#FEF3C7] transition-colors">
                {contactInfo.phone || '+966 545 126 462'}
              </a>
            </li>
            <li className="flex items-center gap-2.5">
              <span className="text-[#FEF3C7]">✉️</span>
              <a href={`mailto:${contactInfo.email || 'asemaouvoyage1448@gmail.com'}`} className="hover:text-[#FEF3C7] transition-colors">
                {contactInfo.email || 'asemaouvoyage1448@gmail.com'}
              </a>
            </li>
          </ul>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-12 pt-6 border-t border-[#23473C] flex flex-col sm:flex-row items-center justify-between gap-4 text-[11px] text-[#FDFBF7]/60">
        <p>&copy; {currentYear} ASEMAOU Voyage et Tourisme HDJ. Tous droits réservés.</p>
        <p className="flex gap-3">
          <span>Burkina Faso</span>
          <span>•</span>
          <span>Licence Officielle Agréée</span>
        </p>
      </div>
    </footer>
  );
};

export default Footer;
