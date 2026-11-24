import React from 'react';
import { motion } from 'framer-motion';
import SectionWrapper from '../ui/SectionWrapper';
import type { CmsWhyChooseUs } from '../../types/homepage';
import {
  FaAward,
  FaBookOpen,
  FaShield,
  FaWallet,
  FaHandshakeAngle
} from 'react-icons/fa6';

interface WhyChooseUsSectionProps {
  items: CmsWhyChooseUs[];
}

const iconMap: Record<string, React.ComponentType<any>> = {
  award: FaAward,
  religion: FaBookOpen,
  security: FaShield,
  payment: FaWallet,
  support: FaHandshakeAngle,
};

const WhyChooseUsSection: React.FC<WhyChooseUsSectionProps> = ({ items }) => {
  const activeItems = items.length > 0
    ? items.filter(item => item.is_active)
    : [
        { id: 1, icon: 'award', title: 'Agrément Officiel', description: "Une agence de voyage certifiée et reconnue officiellement par le Ministère de l'Administration Territoriale du Burkina Faso.", is_active: true, sort_order: 1 },
        { id: 2, icon: 'religion', title: 'Encadrement Spirituel', description: "Des imams et guides certifiés vous accompagnent tout au long du séjour pour vous guider dans l'accomplissement correct de vos rites.", is_active: true, sort_order: 2 },
        { id: 3, icon: 'security', title: 'Sécurité & Confort', description: 'Nous collaborons avec les meilleurs transporteurs et prestataires de services médicaux pour garantir votre entière sécurité physique.', is_active: true, sort_order: 3 },
        { id: 4, icon: 'payment', title: 'Paiements Sécurisés', description: 'Modalités de paiements flexibles en plusieurs tranches, via virement bancaire, chèque ou solutions de paiements mobiles locales.', is_active: true, sort_order: 4 },
        { id: 5, icon: 'support', title: 'Support Permanent 24/7', description: "Une équipe dévouée d'agents logistiques et spirituels à votre entière disposition à Ouagadougou, La Mecque et Médine.", is_active: true, sort_order: 5 },
      ];

  const getIcon = (iconName: string) => {
    const IconComponent = iconMap[iconName.toLowerCase()];
    return IconComponent ? <IconComponent className="text-3xl text-[#B45309]" /> : <FaAward className="text-3xl text-[#B45309]" />;
  };

  return (
    <SectionWrapper id="pourquoi-nous-choisir" bgColor="gray">
      {/* Title */}
      <div className="text-center max-w-3xl mx-auto mb-16">
        <span className="text-[#B45309] text-[11px] font-bold uppercase tracking-[0.2em]">
          Faites-nous Confiance
        </span>
        <h2 className="text-3xl md:text-5xl font-extrabold text-[#2D5A4C] tracking-tight mt-3">
          Pourquoi Choisir notre Agence ?
        </h2>
        <p className="mt-5 text-lg text-[#4B5563] font-light leading-relaxed">
          Nous mettons notre professionnalisme au service de votre dévotion pour vous offrir le séjour le plus harmonieux possible.
        </p>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {activeItems.map((item, index) => (
          <motion.div
            key={item.id || index}
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.4, delay: index * 0.05 }}
            className="bg-white border border-[#E8E2D5] rounded-2xl shadow-sm p-8 flex items-start gap-6 group hover:shadow-lg hover:-translate-y-1 transition-all duration-300"
          >
            {/* Icon Wrapper */}
            <div className="w-14 h-14 rounded-2xl bg-[#FEF3C7] flex items-center justify-center shrink-0 group-hover:scale-110 group-hover:bg-[#B45309]/20 transition-all duration-300">
              {getIcon(item.icon)}
            </div>

            {/* Content */}
            <div>
              <h3 className="text-lg font-bold text-[#1F2937] group-hover:text-[#2D5A4C] transition-colors">
                {item.title}
              </h3>
              <p className="text-[#4B5563] text-sm mt-3 leading-relaxed font-light">
                {item.description}
              </p>
            </div>
          </motion.div>
        ))}
      </div>
    </SectionWrapper>
  );
};

export default WhyChooseUsSection;
