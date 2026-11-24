import React from 'react';
import SectionWrapper from '../ui/SectionWrapper';
import type { Forfait } from '../../types/homepage';
import { useNavigate } from 'react-router-dom';

interface OffersSectionProps {
  offers: Forfait[];
  isLoading: boolean;
  filters: { type: string; date: string; pilgrims: number; budget: number };
}

const OffersSection: React.FC<OffersSectionProps> = ({ offers: _offers, isLoading: _isLoading, filters: _filters }) => {
  const navigate = useNavigate();

  return (
    <SectionWrapper id="offres" bgColor="light">
      {/* 1. Trust Bar / Value Proposition Strip */}
      <div className="bg-white rounded-2xl border border-[#E8E2D5] p-5 mb-12 shadow-sm">
        <div className="grid grid-cols-2 md:grid-cols-5 gap-6 divide-y md:divide-y-0 md:divide-x divide-[#E8E2D5]">
          {/* Item 1 */}
          <div className="flex items-center gap-3 pt-2 md:pt-0">
            <div className="w-10 h-10 rounded-xl bg-[#EBF2EE] text-[#2D5A4C] flex items-center justify-center text-xl shrink-0 font-bold">
              🛂
            </div>
            <div>
              <h4 className="text-xs font-bold text-[#1F2937]">Visa garanti</h4>
              <p className="text-[11px] text-[#4B5563] font-medium">Obtention rapide</p>
            </div>
          </div>

          {/* Item 2 */}
          <div className="flex items-center gap-3 pt-2 md:pt-0 md:pl-4">
            <div className="w-10 h-10 rounded-xl bg-[#EBF2EE] text-[#2D5A4C] flex items-center justify-center text-xl shrink-0 font-bold">
              🏷️
            </div>
            <div>
              <h4 className="text-xs font-bold text-[#1F2937]">Prix transparents</h4>
              <p className="text-[11px] text-[#4B5563] font-medium">Aucun frais caché</p>
            </div>
          </div>

          {/* Item 3 */}
          <div className="flex items-center gap-3 pt-2 md:pt-0 md:pl-4">
            <div className="w-10 h-10 rounded-xl bg-[#EBF2EE] text-[#2D5A4C] flex items-center justify-center text-xl shrink-0 font-bold">
              👥
            </div>
            <div>
              <h4 className="text-xs font-bold text-[#1F2937]">Accompagnement</h4>
              <p className="text-[11px] text-[#4B5563] font-medium">Avant, pendant et après</p>
            </div>
          </div>

          {/* Item 4 */}
          <div className="flex items-center gap-3 pt-2 md:pt-0 md:pl-4">
            <div className="w-10 h-10 rounded-xl bg-[#EBF2EE] text-[#2D5A4C] flex items-center justify-center text-xl shrink-0 font-bold">
              🏢
            </div>
            <div>
              <h4 className="text-xs font-bold text-[#1F2937]">Hôtels de qualité</h4>
              <p className="text-[11px] text-[#4B5563] font-medium">Sélection rigoureuse</p>
            </div>
          </div>

          {/* Item 5 */}
          <div className="flex items-center gap-3 pt-2 md:pt-0 md:pl-4">
            <div className="w-10 h-10 rounded-xl bg-[#EBF2EE] text-[#2D5A4C] flex items-center justify-center text-xl shrink-0 font-bold">
              🎧
            </div>
            <div>
              <h4 className="text-xs font-bold text-[#1F2937]">Support 24h/24</h4>
              <p className="text-[11px] text-[#4B5563] font-medium">Toujours à votre écoute</p>
            </div>
          </div>
        </div>
      </div>

      {/* 2. Main Content Grid (8 cols Offers + 4 cols Sidebars) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Area: Nos offres populaires (8 cols) */}
        <div className="lg:col-span-8 space-y-6">
          <div className="flex items-center justify-between">
            <h3 className="text-xl font-bold text-[#2D5A4C]">Nos offres populaires</h3>
            <a href="#toutes-offres" className="text-xs font-bold text-[#B45309] hover:text-[#92400E] flex items-center gap-1 transition-colors">
              Voir toutes les offres ➔
            </a>
          </div>

          {/* Offers Cards Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {/* Card 1 */}
            <div className="asemaou-card overflow-hidden group">
              <div className="relative h-44 overflow-hidden">
                <img
                  src="https://images.unsplash.com/photo-1564769625905-50e93615e769?auto=format&fit=crop&w=800&q=80"
                  alt="Omra Économique"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <span className="absolute top-3 left-3 bg-[#2D5A4C] text-[#FDFBF7] text-[10px] font-bold px-3 py-1 rounded-full shadow-sm">
                  12 jours
                </span>
                <span className="absolute top-3 right-3 bg-white/95 backdrop-blur-md text-[#1F2937] text-[11px] font-bold px-2.5 py-0.5 rounded-md border border-[#E8E2D5]">
                  Omra Économique
                </span>
              </div>
              <div className="p-4 space-y-3">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-[#B45309] font-bold flex items-center gap-1">
                    ★ 4.8 <span className="text-slate-400 font-normal">(120)</span>
                  </span>
                  <span className="font-extrabold text-[#2D5A4C] text-sm">1 200 000 FCFA</span>
                </div>
                <p className="text-[11px] text-[#4B5563] font-medium border-t border-[#E8E2D5] pt-2">
                  Départ : Chaque semaine
                </p>
              </div>
            </div>

            {/* Card 2 */}
            <div className="asemaou-card overflow-hidden group">
              <div className="relative h-44 overflow-hidden">
                <img
                  src="https://images.unsplash.com/photo-1591604021695-0c69b7c05981?auto=format&fit=crop&w=800&q=80"
                  alt="Omra Confort"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <span className="absolute top-3 left-3 bg-[#2D5A4C] text-[#FDFBF7] text-[10px] font-bold px-3 py-1 rounded-full shadow-sm">
                  14 jours
                </span>
                <span className="absolute top-3 right-3 bg-white/95 backdrop-blur-md text-[#1F2937] text-[11px] font-bold px-2.5 py-0.5 rounded-md border border-[#E8E2D5]">
                  Omra Confort
                </span>
              </div>
              <div className="p-4 space-y-3">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-[#B45309] font-bold flex items-center gap-1">
                    ★ 4.9 <span className="text-slate-400 font-normal">(98)</span>
                  </span>
                  <span className="font-extrabold text-[#2D5A4C] text-sm">1 800 000 FCFA</span>
                </div>
                <p className="text-[11px] text-[#4B5563] font-medium border-t border-[#E8E2D5] pt-2">
                  Départ : Chaque semaine
                </p>
              </div>
            </div>

            {/* Card 3 */}
            <div className="asemaou-card overflow-hidden group">
              <div className="relative h-44 overflow-hidden">
                <img
                  src="https://images.unsplash.com/photo-1580674684081-7617fbf3d745?auto=format&fit=crop&w=800&q=80"
                  alt="Omra Premium"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <span className="absolute top-3 left-3 bg-[#2D5A4C] text-[#FDFBF7] text-[10px] font-bold px-3 py-1 rounded-full shadow-sm">
                  14 jours
                </span>
                <span className="absolute top-3 right-3 bg-white/95 backdrop-blur-md text-[#1F2937] text-[11px] font-bold px-2.5 py-0.5 rounded-md border border-[#E8E2D5]">
                  Omra Premium
                </span>
              </div>
              <div className="p-4 space-y-3">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-[#B45309] font-bold flex items-center gap-1">
                    ★ 4.9 <span className="text-slate-400 font-normal">(156)</span>
                  </span>
                  <span className="font-extrabold text-[#2D5A4C] text-sm">2 400 000 FCFA</span>
                </div>
                <p className="text-[11px] text-[#4B5563] font-medium border-t border-[#E8E2D5] pt-2">
                  Départ : Chaque semaine
                </p>
              </div>
            </div>

            {/* Card 4 */}
            <div className="asemaou-card overflow-hidden group">
              <div className="relative h-44 overflow-hidden">
                <img
                  src="https://images.unsplash.com/photo-1604999333679-b86d54738315?auto=format&fit=crop&w=800&q=80"
                  alt="Omra VIP"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <span className="absolute top-3 left-3 bg-[#2D5A4C] text-[#FDFBF7] text-[10px] font-bold px-3 py-1 rounded-full shadow-sm">
                  14 jours
                </span>
                <span className="absolute top-3 right-3 bg-white/95 backdrop-blur-md text-[#1F2937] text-[11px] font-bold px-2.5 py-0.5 rounded-md border border-[#E8E2D5]">
                  Omra VIP
                </span>
              </div>
              <div className="p-4 space-y-3">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-[#B45309] font-bold flex items-center gap-1">
                    ★ 5.0 <span className="text-slate-400 font-normal">(78)</span>
                  </span>
                  <span className="font-extrabold text-[#2D5A4C] text-sm">3 200 000 FCFA</span>
                </div>
                <p className="text-[11px] text-[#4B5563] font-medium border-t border-[#E8E2D5] pt-2">
                  Départ : Chaque semaine
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Right Area: Sidebars (4 cols) */}
        <div className="lg:col-span-4 space-y-6">
          {/* Sidecard 1: Pourquoi nous choisir ? */}
          <div className="bg-white rounded-3xl border border-[#E8E2D5] p-6 relative overflow-hidden shadow-sm">
            <h4 className="text-base font-bold text-[#2D5A4C] mb-4">Pourquoi nous choisir ?</h4>
            
            <ul className="space-y-3 text-xs font-semibold text-[#1F2937] relative z-10">
              <li className="flex items-center gap-2">
                <span className="w-4 h-4 rounded-full bg-[#EBF2EE] text-[#2D5A4C] flex items-center justify-center text-[10px] font-bold">✓</span>
                Agence agréée et expérimentée
              </li>
              <li className="flex items-center gap-2">
                <span className="w-4 h-4 rounded-full bg-[#EBF2EE] text-[#2D5A4C] flex items-center justify-center text-[10px] font-bold">✓</span>
                Meilleurs prix du marché
              </li>
              <li className="flex items-center gap-2">
                <span className="w-4 h-4 rounded-full bg-[#EBF2EE] text-[#2D5A4C] flex items-center justify-center text-[10px] font-bold">✓</span>
                Paiement sécurisé
              </li>
              <li className="flex items-center gap-2">
                <span className="w-4 h-4 rounded-full bg-[#EBF2EE] text-[#2D5A4C] flex items-center justify-center text-[10px] font-bold">✓</span>
                Guides francophones expérimentés
              </li>
              <li className="flex items-center gap-2">
                <span className="w-4 h-4 rounded-full bg-[#EBF2EE] text-[#2D5A4C] flex items-center justify-center text-[10px] font-bold">✓</span>
                Hôtels proches des lieux saints
              </li>
            </ul>

            {/* Background Mosque Dome graphic */}
            <div className="absolute -bottom-4 -right-4 w-28 h-28 opacity-20 pointer-events-none text-[#2D5A4C] text-7xl flex items-center justify-center">
              🕌
            </div>
          </div>

          {/* Sidecard 2: Offre spéciale Ramadan Banner (Vert Sauge Foncé avec CTA Terre Cuite) */}
          <div className="bg-[#2D5A4C] rounded-3xl p-6 text-white relative overflow-hidden shadow-lg flex flex-col justify-between min-h-[160px]">
            <div className="relative z-10">
              <div className="flex items-center gap-2 text-[#FEF3C7] text-xs font-bold uppercase tracking-wider mb-2">
                <span>🌙</span> Offre spéciale Ramadan
              </div>
              <h3 className="text-3xl font-black tracking-tight text-[#FDFBF7] mb-1">
                -10% <span className="text-sm font-normal text-[#FDFBF7]/80">Sur toutes nos formules Omra</span>
              </h3>
            </div>

            <div className="pt-4 relative z-10">
              <button
                onClick={() => navigate('/inscription')}
                className="btn-primary !py-2.5 !px-5 !text-xs shadow-md cursor-pointer"
              >
                Profiter de l'offre
              </button>
            </div>

            {/* Decorative Gold Lantern / Crescent Graphic */}
            <div className="absolute top-2 right-3 text-4xl opacity-30 text-[#FEF3C7] pointer-events-none">
              🏮
            </div>
          </div>
        </div>
      </div>
    </SectionWrapper>
  );
};

export default OffersSection;
