import React from 'react';
import { motion } from 'framer-motion';
import SectionWrapper from '../ui/SectionWrapper';
import type { CmsDeparture } from '../../types/homepage';
import { CalendarOutlined, TeamOutlined, CreditCardOutlined, ArrowRightOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';

interface DeparturesSectionProps {
  departures: CmsDeparture[];
}

const DeparturesSection: React.FC<DeparturesSectionProps> = ({ departures }) => {
  const navigate = useNavigate();

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('fr-FR', {
      style: 'currency',
      currency: 'XOF',
      maximumFractionDigits: 0,
    }).format(price);
  };

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString('fr-FR', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    });
  };

  // Get places badge styles
  const getSlotsBadge = (remaining: number, total: number) => {
    const ratio = remaining / total;
    if (remaining === 0) {
      return (
        <span className="bg-red-50 dark:bg-red-950/20 text-red-600 dark:text-red-400 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider">
          Complet
        </span>
      );
    } else if (ratio < 0.25) {
      return (
        <span className="bg-amber-50 dark:bg-amber-950/20 text-amber-600 dark:text-amber-400 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider animate-pulse">
          Dernières places ({remaining})
        </span>
      );
    } else {
      return (
        <span className="bg-emerald-50 dark:bg-emerald-950/20 text-emerald-600 dark:text-emerald-400 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider">
          Disponible ({remaining} places)
        </span>
      );
    }
  };

  return (
    <SectionWrapper id="departs" bgColor="light">
      {/* Header */}
      <div className="text-center max-w-3xl mx-auto mb-16">
        <span className="text-emerald-600 dark:text-emerald-400 text-sm font-bold uppercase tracking-wider">
          Planifiez votre Voyage
        </span>
        <h2 className="text-3xl md:text-4xl font-extrabold text-zinc-900 dark:text-white tracking-tight mt-2">
          Calendrier des Départs Organisés
        </h2>
        <p className="mt-4 text-lg text-zinc-550 dark:text-zinc-400">
          Retrouvez les dates de nos prochains convois au départ de Ouagadougou. Réservez votre place dès aujourd'hui.
        </p>
      </div>

      {/* Desktop Table view / Mobile Card view */}
      <div className="bg-white dark:bg-zinc-900 rounded-3xl border border-gray-150 dark:border-zinc-800 shadow-sm overflow-hidden">
        {/* Table Header (hidden on mobile) */}
        <div className="hidden md:grid grid-cols-5 gap-6 p-6 bg-zinc-50 dark:bg-zinc-800/50 border-b border-gray-100 dark:border-zinc-800 text-sm font-bold text-zinc-550 dark:text-zinc-400">
          <div>Date de Départ</div>
          <div>Type de Séjour</div>
          <div>Forfait Associé</div>
          <div>Disponibilité</div>
          <div className="text-right">Tarif</div>
        </div>

        {/* Departure Rows */}
        <div className="divide-y divide-gray-100 dark:divide-zinc-800">
          {departures.length === 0 ? (
            <div className="p-12 text-center text-zinc-450 dark:text-zinc-500">
              Aucun départ de convoi programmé actuellement. Contactez l'agence pour plus d'informations.
            </div>
          ) : (
            departures.map((dep, index) => (
              <motion.div
                key={dep.id || index}
                initial={{ opacity: 0, x: -10 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: index * 0.05 }}
                className="grid grid-cols-1 md:grid-cols-5 gap-4 md:gap-6 p-6 items-center hover:bg-zinc-50/50 dark:hover:bg-zinc-800/30 transition-colors"
              >
                {/* Date */}
                <div className="flex items-center gap-3">
                  <CalendarOutlined className="text-emerald-600 text-lg md:hidden" />
                  <div>
                    <span className="font-bold text-zinc-800 dark:text-zinc-200 block">
                      {formatDate(dep.date)}
                    </span>
                    <span className="text-xs text-zinc-400 dark:text-zinc-500 md:hidden">
                      Départ programmé
                    </span>
                  </div>
                </div>

                {/* Type */}
                <div className="flex items-center">
                  <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider text-white ${
                    dep.type === 'hajj' ? 'bg-amber-600' : 'bg-emerald-600'
                  }`}>
                    {dep.type}
                  </span>
                </div>

                {/* Forfait */}
                <div className="text-sm font-medium text-zinc-600 dark:text-zinc-350">
                  {dep.forfait?.nom || 'Convoi Spécial'}
                </div>

                {/* Slots */}
                <div className="flex items-center">
                  {getSlotsBadge(dep.places_remaining, dep.places_total)}
                </div>

                {/* Price & Action */}
                <div className="flex md:flex-col items-center md:items-end justify-between md:justify-center gap-4 mt-4 md:mt-0">
                  <div className="md:text-right">
                    <span className="text-[10px] font-semibold text-zinc-400 dark:text-zinc-550 uppercase tracking-widest block md:hidden">Tarif</span>
                    <span className="text-lg font-black text-emerald-600 dark:text-emerald-400 tabular-nums">
                      {formatPrice(dep.price)}
                    </span>
                  </div>
                  
                  {dep.places_remaining > 0 ? (
                    <button
                      onClick={() => navigate('/inscription')}
                      className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs px-4 py-2 rounded-xl flex items-center gap-1.5 transition-all hover:scale-105 active:scale-95 cursor-pointer"
                    >
                      S'inscrire
                      <ArrowRightOutlined className="text-[10px]" />
                    </button>
                  ) : (
                    <button
                      disabled
                      className="bg-zinc-200 dark:bg-zinc-800 text-zinc-400 dark:text-zinc-650 font-bold text-xs px-4 py-2 rounded-xl cursor-not-allowed"
                    >
                      Fermé
                    </button>
                  )}
                </div>
              </motion.div>
            ))
          )}
        </div>
      </div>
    </SectionWrapper>
  );
};

export default DeparturesSection;
