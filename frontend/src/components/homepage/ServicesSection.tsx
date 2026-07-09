import React from 'react';
import { motion } from 'framer-motion';
import SectionWrapper from '../ui/SectionWrapper';
import type { CmsService } from '../../types/homepage';
import { 
  FaPassport, 
  FaPlane, 
  FaHotel, 
  FaBus, 
  FaPersonPraying, 
  FaClock, 
  FaShieldHeart 
} from 'react-icons/fa6';

interface ServicesSectionProps {
  services: CmsService[];
}

const iconMap: Record<string, React.ComponentType<any>> = {
  visa: FaPassport,
  flight: FaPlane,
  hotel: FaHotel,
  transport: FaBus,
  guide: FaPersonPraying,
  assistance: FaClock,
  insurance: FaShieldHeart,
};

const ServicesSection: React.FC<ServicesSectionProps> = ({ services }) => {
  const activeServices = services.length > 0 
    ? services.filter(s => s.is_active)
    : [
        { id: 1, icon: 'visa', title: 'Obtention du Visa', description: 'Prise en charge complète des démarches d\'obtention des visas Hajj ou Omra.', is_active: true, sort_order: 1 },
        { id: 2, icon: 'flight', title: 'Billets d\'Avion', description: 'Vols réguliers ou charters sur des compagnies de confiance de Ouagadougou à Jeddah.', is_active: true, sort_order: 2 },
        { id: 3, icon: 'hotel', title: 'Hébergement Premium', description: 'Sélection d\'hôtels idéalement situés proches des Harams à La Mecque et Médine.', is_active: true, sort_order: 3 },
        { id: 4, icon: 'transport', title: 'Transports Locaux', description: 'Transferts en bus climatisés modernes pour tous vos trajets en Arabie Saoudite.', is_active: true, sort_order: 4 },
        { id: 5, icon: 'guide', title: 'Guides Religieux', description: 'Accompagnement spirituel par des imams expérimentés pour guider vos rites.', is_active: true, sort_order: 5 },
        { id: 6, icon: 'assistance', title: 'Assistance 24h/24', description: 'Une équipe médicale et d\'encadrement sur place disponible à tout moment.', is_active: true, sort_order: 6 },
        { id: 7, icon: 'insurance', title: 'Assurance Voyage', description: 'Assurance médicale complète couvrant vos frais de santé durant le séjour.', is_active: true, sort_order: 7 },
      ];

  const getIcon = (iconName: string) => {
    const IconComponent = iconMap[iconName.toLowerCase()];
    return IconComponent ? <IconComponent className="text-3xl text-emerald-600 dark:text-emerald-400" /> : <FaPassport className="text-3xl text-emerald-600" />;
  };

  return (
    <SectionWrapper id="services" bgColor="gray">
      {/* Title */}
      <div className="text-center max-w-3xl mx-auto mb-16">
        <span className="text-emerald-600 dark:text-emerald-400 text-sm font-bold uppercase tracking-wider">
          Tout est Compris
        </span>
        <h2 className="text-3xl md:text-4xl font-extrabold text-zinc-900 dark:text-white tracking-tight mt-2">
          Services Inclus dans nos Forfaits
        </h2>
        <p className="mt-4 text-lg text-zinc-550 dark:text-zinc-400">
          Nous veillons à chaque détail logistique et spirituel pour vous permettre de vous consacrer pleinement à votre culte.
        </p>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
        {activeServices.map((service, index) => (
          <motion.div
            key={service.id || index}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: index * 0.05 }}
            className="bg-white dark:bg-zinc-900 rounded-3xl border border-gray-100 dark:border-zinc-800 p-8 shadow-sm hover:shadow-md transition-all duration-300 flex flex-col items-start group"
          >
            {/* Icon Wrapper */}
            <div className="w-14 h-14 rounded-2xl bg-emerald-50 dark:bg-emerald-950/30 flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
              {getIcon(service.icon)}
            </div>

            {/* Title */}
            <h3 className="text-lg font-bold text-zinc-900 dark:text-white mt-6 group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors">
              {service.title}
            </h3>

            {/* Description */}
            <p className="text-zinc-500 dark:text-zinc-400 text-sm mt-3 leading-relaxed">
              {service.description}
            </p>
          </motion.div>
        ))}
      </div>
    </SectionWrapper>
  );
};

export default ServicesSection;
