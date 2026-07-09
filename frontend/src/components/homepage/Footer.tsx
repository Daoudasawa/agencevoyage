import React from 'react';

interface FooterProps {
  contactInfo?: Record<string, string>;
}

const Footer: React.FC<FooterProps> = ({ contactInfo = {} }) => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-zinc-950 text-zinc-400 pt-16 pb-8 border-t border-zinc-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
        {/* About */}
        <div className="space-y-4">
          <span className="text-xl font-bold bg-gradient-to-r from-emerald-500 to-amber-400 bg-clip-text text-transparent">
            HajjOmra BF
          </span>
          <p className="text-sm text-zinc-500 leading-relaxed">
            Votre partenaire spirituel agréé au Burkina Faso pour l'organisation de vos pèlerinages Hajj et Omra. Excellence, sécurité et sérénité.
          </p>
          <div className="flex space-x-4 pt-2">
            {/* Social links */}
            {['facebook', 'twitter', 'instagram', 'youtube'].map((social) => (
              <a
                key={social}
                href={contactInfo[social] || '#'}
                target="_blank"
                rel="noopener noreferrer"
                className="w-9 h-9 rounded-full bg-zinc-900 flex items-center justify-center hover:bg-emerald-600 hover:text-white transition-all text-zinc-500 hover:scale-105"
              >
                <span className="capitalize text-xs">{social.substring(0, 2)}</span>
              </a>
            ))}
          </div>
        </div>

        {/* Quick Links */}
        <div>
          <h3 className="text-white font-semibold text-base mb-6">Liens Rapides</h3>
          <ul className="space-y-3 text-sm">
            <li><a href="#accueil" className="hover:text-emerald-500 transition-colors">Accueil</a></li>
            <li><a href="#hajj" className="hover:text-emerald-500 transition-colors">Offres Hajj</a></li>
            <li><a href="#omra" className="hover:text-emerald-500 transition-colors">Offres Omra</a></li>
            <li><a href="#services" className="hover:text-emerald-500 transition-colors">Nos Services</a></li>
            <li><a href="#blog" className="hover:text-emerald-500 transition-colors">Actualités & Conseils</a></li>
          </ul>
        </div>

        {/* Support */}
        <div>
          <h3 className="text-white font-semibold text-base mb-6">Support & Légal</h3>
          <ul className="space-y-3 text-sm">
            <li><a href="#faq" className="hover:text-emerald-500 transition-colors">Foire Aux Questions</a></li>
            <li><a href="#contact" className="hover:text-emerald-500 transition-colors">Formulaire de Contact</a></li>
            <li><a href="/mentions-legales" className="hover:text-emerald-500 transition-colors">Mentions Légales</a></li>
            <li><a href="/confidentialite" className="hover:text-emerald-500 transition-colors">Politique de Confidentialité</a></li>
            <li><a href="/conditions" className="hover:text-emerald-500 transition-colors">CGV / Conditions de Vente</a></li>
          </ul>
        </div>

        {/* Contact Info */}
        <div>
          <h3 className="text-white font-semibold text-base mb-6">Contactez-nous</h3>
          <ul className="space-y-4 text-sm">
            <li className="flex items-start gap-3">
              <span className="text-emerald-500">📍</span>
              <span className="text-zinc-400">{contactInfo.address || 'Avenue Kwamé N\'Krumah, Ouagadougou, Burkina Faso'}</span>
            </li>
            <li className="flex items-center gap-3">
              <span className="text-emerald-500">📞</span>
              <a href={`tel:${contactInfo.phone}`} className="hover:text-emerald-500 transition-colors">
                {contactInfo.phone || '+226 25 30 00 00'}
              </a>
            </li>
            <li className="flex items-center gap-3">
              <span className="text-emerald-500">💬</span>
              <a
                href={`https://wa.me/${contactInfo.whatsapp?.replace(/[^0-9]/g, '')}`}
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-emerald-500 transition-colors text-emerald-400 font-medium"
              >
                WhatsApp Direct
              </a>
            </li>
            <li className="flex items-center gap-3">
              <span className="text-emerald-500">✉️</span>
              <a href={`mailto:${contactInfo.email}`} className="hover:text-emerald-500 transition-colors">
                {contactInfo.email || 'contact@agencehajjomra.bf'}
              </a>
            </li>
          </ul>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-16 pt-8 border-t border-zinc-900 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-zinc-650">
        <p>&copy; {currentYear} HajjOmra BF. Tous droits réservés. Agréé par le Ministère de l'Administration Territoriale et de la Sécurité.</p>
        <p className="flex gap-4">
          <span> Burkina Faso</span>
          <span>•</span>
          <span>Développé par SamaTECH SARL</span>
        </p>
      </div>
    </footer>
  );
};

export default Footer;
