import React from 'react';
import { motion } from 'framer-motion';
import SectionWrapper from '../ui/SectionWrapper';
import SkeletonCard from '../ui/SkeletonCard';
import type { Forfait } from '../../types/homepage';
import { CalendarOutlined, HomeOutlined, CompassOutlined, ArrowRightOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';

interface OffersSectionProps {
  offers: Forfait[];
  isLoading: boolean;
  filters: { type: string; date: string; pilgrims: number; budget: number };
}

const OffersSection: React.FC<OffersSectionProps> = ({ offers, isLoading, filters }) => {
  const navigate = useNavigate();

  // Filter packages based on SearchWidget selections
  const filteredOffers = offers.filter((offer) => {
    // 1. Filter by Type
    if (filters.type !== 'tous' && offer.type !== filters.type) {
      return false;
    }
    // 2. Filter by Budget
    if (offer.prix > filters.budget) {
      return false;
    }
    return true;
  });

  const getPackageImage = (offer: Forfait) => {
    if (offer.type === 'hajj') {
      return offer.prix > 3000000
        ? 'https://images.unsplash.com/photo-1564769625905-50e93615e769?auto=format&fit=crop&w=800&q=80' // Kaaba premium
        : 'https://images.unsplash.com/photo-1591604021695-0c69b7c05981?auto=format&fit=crop&w=800&q=80'; // Medina
    }
    return offer.prix > 1000000
      ? 'https://images.unsplash.com/photo-1580674684081-7617fbf3d745?auto=format&fit=crop&w=800&q=80' // Medina dome
      : 'https://images.unsplash.com/photo-1604999333679-b86d54738315?auto=format&fit=crop&w=800&q=80'; // Mecca road
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('fr-FR', {
      style: 'currency',
      currency: 'XOF',
      maximumFractionDigits: 0,
    }).format(price);
  };

  return (
    <SectionWrapper id="offres" bgColor="light">
      {/* Section Title */}
      <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-6">
        <div className="max-w-2xl">
          <span className="text-emerald-600 dark:text-emerald-400 text-sm font-bold uppercase tracking-wider">
            Nos Séjours
          </span>
          <h2 className="text-3xl md:text-4xl font-extrabold text-zinc-900 dark:text-white tracking-tight mt-2">
            Forfaits Populaires Hajj & Omra
          </h2>
          <p className="mt-4 text-lg text-zinc-550 dark:text-zinc-400">
            Découvrez nos offres tout compris adaptées à vos besoins, avec des hébergements de qualité et un accompagnement complet.
          </p>
        </div>
      </div>

      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {[...Array(3)].map((_, i) => (
            <SkeletonCard key={i} type="offer" />
          ))}
        </div>
      ) : filteredOffers.length === 0 ? (
        <div className="text-center py-16 bg-zinc-50 dark:bg-zinc-900 rounded-3xl border border-dashed border-zinc-250 dark:border-zinc-800">
          <CompassOutlined className="text-5xl text-zinc-350 dark:text-zinc-600 mb-4" />
          <h3 className="text-xl font-bold text-zinc-700 dark:text-zinc-300">Aucun forfait disponible</h3>
          <p className="text-zinc-500 dark:text-zinc-500 mt-2 max-w-md mx-auto">
            Nous n'avons trouvé aucun forfait correspondant à vos critères de recherche. Essayez d'augmenter votre budget ou de changer de filtre.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredOffers.map((offer, index) => (
            <motion.div
              key={offer.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="bg-white dark:bg-zinc-900 rounded-3xl overflow-hidden border border-gray-100 dark:border-zinc-800 shadow-sm hover:shadow-xl transition-all duration-300 group flex flex-col h-[520px]"
            >
              {/* Card Image */}
              <div className="relative h-60 overflow-hidden bg-zinc-100">
                <img
                  src={getPackageImage(offer)}
                  alt={offer.nom}
                  loading="lazy"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                
                {/* Type Badge */}
                <span className={`absolute top-4 left-4 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider text-white shadow-md z-10 ${
                  offer.type === 'hajj' ? 'bg-amber-600' : 'bg-emerald-600'
                }`}>
                  {offer.type}
                </span>

                {/* Duration Badge */}
                <span className="absolute bottom-4 right-4 bg-black/60 backdrop-blur-sm px-3.5 py-1.5 rounded-xl text-xs font-bold text-white flex items-center gap-1.5 z-10">
                  <CalendarOutlined />
                  {offer.duree} Jours
                </span>
                
                {/* Visual Gradient overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
              </div>

              {/* Card Body */}
              <div className="p-6 flex-1 flex flex-col justify-between">
                <div>
                  <h3 className="text-xl font-bold text-zinc-900 dark:text-white line-clamp-1 group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors duration-300">
                    {offer.nom}
                  </h3>
                  
                  {/* Description */}
                  <p className="text-zinc-500 dark:text-zinc-400 text-sm mt-3 line-clamp-3 leading-relaxed">
                    {offer.description || 'Description complète du séjour spirituel.'}
                  </p>
                  
                  {/* Key details list */}
                  <div className="mt-4 flex flex-wrap gap-y-2 gap-x-4 text-xs font-medium text-zinc-400 dark:text-zinc-500">
                    <span className="flex items-center gap-1">
                      <HomeOutlined className="text-emerald-600" />
                      Hôtels inclus
                    </span>
                    <span className="flex items-center gap-1">
                      ✈️ Vol Aller-Retour
                    </span>
                    <span className="flex items-center gap-1">
                      🛂 Visa compris
                    </span>
                  </div>
                </div>

                {/* Price and Action */}
                <div className="pt-4 border-t border-gray-50 dark:border-zinc-800 flex items-center justify-between mt-6">
                  <div>
                    <span className="text-[10px] font-semibold text-zinc-450 dark:text-zinc-500 uppercase tracking-widest block">Tarif</span>
                    <span className="text-xl font-black text-emerald-600 dark:text-emerald-400 tabular-nums">
                      {formatPrice(offer.prix)}
                    </span>
                  </div>
                  
                  <button
                    onClick={() => navigate('/inscription')}
                    className="flex items-center gap-2 bg-emerald-50 hover:bg-emerald-600 text-emerald-700 hover:text-white font-bold text-sm px-5 py-2.5 rounded-2xl transition-all hover:scale-105 active:scale-95 group/btn cursor-pointer"
                  >
                    Réserver
                    <ArrowRightOutlined className="text-xs group-hover/btn:translate-x-1 transition-transform" />
                  </button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </SectionWrapper>
  );
};

export default OffersSection;
