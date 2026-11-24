import React from 'react';
import { motion } from 'framer-motion';
import SectionWrapper from '../ui/SectionWrapper';
import type { CmsDeparture } from '../../types/homepage';
import { CalendarOutlined, ArrowRightOutlined } from '@ant-design/icons';
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

  const getSlotsBadge = (remaining: number, total: number) => {
    const ratio = remaining / total;
    if (remaining === 0) {
      return (
        <span className="bg-red-50 text-red-600 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider">
          Complet
        </span>
      );
    } else if (ratio < 0.25) {
      return (
        <span className="bg-[#FEF3C7] text-[#B45309] px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider animate-pulse">
          Dernières places ({remaining})
        </span>
      );
    } else {
      return (
        <span className="bg-[#EBF2EE] text-[#2D5A4C] px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider">
          Disponible ({remaining} places)
        </span>
      );
    }
  };

  return (
    <SectionWrapper id="departs" bgColor="light">
      {/* Header */}
      <div className="text-center max-w-3xl mx-auto mb-16">
        <span className="text-[#B45309] text-[11px] font-bold uppercase tracking-[0.2em]">
          Planifiez votre Voyage
        </span>
        <h2 className="text-3xl md:text-5xl font-extrabold text-[#2D5A4C] tracking-tight mt-3">
          Calendrier des Départs Organisés
        </h2>
        <p className="mt-5 text-lg text-[#4B5563] font-light leading-relaxed">
          Retrouvez les dates de nos prochains convois au départ de Ouagadougou. Réservez votre place dès aujourd'hui.
        </p>
      </div>

      {/* Desktop Table view / Mobile Card view */}
      <div className="bg-white border border-[#E8E2D5] rounded-2xl shadow-sm overflow-hidden">
        {/* Table Header */}
        <div className="hidden md:grid grid-cols-5 gap-6 p-6 bg-[#F5F0E6] border-b border-[#E8E2D5] text-[11px] font-bold text-[#2D5A4C] uppercase tracking-wider">
          <div>Date de Départ</div>
          <div>Type de Séjour</div>
          <div>Forfait Associé</div>
          <div>Disponibilité</div>
          <div className="text-right">Tarif</div>
        </div>

        {/* Departure Rows */}
        <div className="divide-y divide-[#E8E2D5]">
          {departures.length === 0 ? (
            <div className="p-12 text-center text-[#4B5563]">
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
                className="grid grid-cols-1 md:grid-cols-5 gap-4 md:gap-6 p-6 items-center hover:bg-[#FAF6EE] transition-colors"
              >
                {/* Date */}
                <div className="flex items-center gap-3">
                  <CalendarOutlined className="text-[#2D5A4C] text-lg md:hidden" />
                  <div>
                    <span className="font-bold text-[#1F2937] block">
                      {formatDate(dep.date)}
                    </span>
                    <span className="text-xs text-[#4B5563] md:hidden">
                      Départ programmé
                    </span>
                  </div>
                </div>

                {/* Type */}
                <div className="flex items-center">
                  <span className={`px-4 py-1.5 rounded-full text-[10px] font-bold uppercase tracking-widest text-white shadow-sm ${
                    dep.type === 'hajj' ? 'bg-[#B45309]' : 'bg-[#2D5A4C]'
                  }`}>
                    {dep.type}
                  </span>
                </div>

                {/* Forfait */}
                <div className="text-sm font-medium text-[#4B5563]">
                  {dep.forfait?.nom || 'Convoi Spécial'}
                </div>

                {/* Slots */}
                <div className="flex items-center">
                  {getSlotsBadge(dep.places_remaining, dep.places_total)}
                </div>

                {/* Price & Action */}
                <div className="flex md:flex-col items-center md:items-end justify-between md:justify-center gap-4 mt-4 md:mt-0">
                  <div className="md:text-right">
                    <span className="text-[10px] font-semibold text-[#4B5563] uppercase tracking-widest block md:hidden">Tarif</span>
                    <span className="text-lg font-black text-[#2D5A4C] tabular-nums">
                      {formatPrice(dep.price)}
                    </span>
                  </div>

                  {dep.places_remaining > 0 ? (
                    <button
                      onClick={() => navigate('/inscription')}
                      className="btn-primary !py-2 !px-5 !text-xs rounded-full flex items-center gap-2 transition-all hover:scale-105 active:scale-95 cursor-pointer"
                    >
                      S'inscrire
                      <ArrowRightOutlined className="text-[10px]" />
                    </button>
                  ) : (
                    <button
                      disabled
                      className="bg-[#F5F0E6] text-slate-400 font-bold text-xs px-4 py-2 rounded-xl cursor-not-allowed"
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
