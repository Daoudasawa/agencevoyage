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
        { id: 1, icon: 'award', title: 'Agrément Officiel', description: 'Une agence de voyage certifiée et reconnue officiellement par le Ministère de l\'Administration Territoriale du Burkina Faso.', is_active: true, sort_order: 1 },
        { id: 2, icon: 'religion', title: 'Encadrement Spirituel', description: 'Des imams et guides certifiés vous accompagnent tout au long du séjour pour vous guider dans l\'accomplissement correct de vos rites.', is_active: true, sort_order: 2 },
        { id: 3, icon: 'security', title: 'Sécurité & Confort', description: 'Nous collaborons avec les meilleurs transporteurs et prestataires de services médicaux pour garantir votre entière sécurité physique.', is_active: true, sort_order: 3 },
        { id: 4, icon: 'payment', title: 'Paiements Sécurisés', description: 'Modalités de paiements flexibles en plusieurs tranches, via virement bancaire, chèque ou solutions de paiements mobiles locales.', is_active: true, sort_order: 4 },
        { id: 5, icon: 'support', title: 'Support Permanent 24/7', description: 'Une équipe dévouée d\'agents logistiques et spirituels à votre entière disposition à Ouagadougou, La Mecque et Médine.', is_active: true, sort_order: 5 },
      ];

  const getIcon = (iconName: string) => {
    const IconComponent = iconMap[iconName.toLowerCase()];
    return IconComponent ? <IconComponent className="text-3xl text-amber-500" /> : <FaAward className="text-3xl text-amber-500" />;
  };

  return (
    <SectionWrapper id="pourquoi-nous-choisir" bgColor="gray">
      {/* Title */}
      <div className="text-center max-w-3xl mx-auto mb-16">
        <span className="text-emerald-600 dark:text-emerald-400 text-sm font-bold uppercase tracking-wider">
          Faites-nous Confiance
        </span>
        <h2 className="text-3xl md:text-4xl font-extrabold text-zinc-900 dark:text-white tracking-tight mt-2">
          Pourquoi Choisir notre Agence ?
        </h2>
        <p className="mt-4 text-lg text-zinc-550 dark:text-zinc-400">
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
            className="bg-white dark:bg-zinc-900 rounded-3xl border border-gray-100 dark:border-zinc-800 p-8 shadow-sm hover:shadow-lg transition-all duration-300 flex items-start gap-6 group"
          >
            {/* Icon Wrapper */}
            <div className="w-14 h-14 rounded-2xl bg-amber-50 dark:bg-amber-950/20 flex items-center justify-center shrink-0 group-hover:rotate-6 transition-transform duration-300">
              {getIcon(item.icon)}
            </div>

            {/* Content */}
            <div>
              <h3 className="text-lg font-bold text-zinc-900 dark:text-white group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors">
                {item.title}
              </h3>
              <p className="text-zinc-500 dark:text-zinc-400 text-sm mt-2 leading-relaxed">
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
