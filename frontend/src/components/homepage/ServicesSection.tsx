import React from 'react';
import SectionWrapper from '../ui/SectionWrapper';
import type { CmsService } from '../../types/homepage';

interface ServicesSectionProps {
  services: CmsService[];
}

const ServicesSection: React.FC<ServicesSectionProps> = ({ services: _services }) => {
  return (
    <SectionWrapper id="services" bgColor="light">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
        {/* Left: Nos services inclus (7 cols) */}
        <div className="lg:col-span-7 bg-white rounded-3xl border border-[#E8E2D5] p-6 sm:p-8 shadow-sm space-y-6">
          <h3 className="text-xl font-bold text-[#2D5A4C]">Nos services inclus</h3>

          <div className="grid grid-cols-3 sm:grid-cols-6 gap-4 text-center">
            {/* Vol */}
            <div className="flex flex-col items-center gap-2 group cursor-pointer">
              <div className="w-14 h-14 rounded-full bg-[#EBF2EE] group-hover:bg-[#2D5A4C] text-[#2D5A4C] group-hover:text-white flex items-center justify-center text-xl transition-all shadow-sm">
                ✈️
              </div>
              <span className="text-[11px] font-bold text-[#1F2937]">Vols</span>
            </div>

            {/* Hôtel */}
            <div className="flex flex-col items-center gap-2 group cursor-pointer">
              <div className="w-14 h-14 rounded-full bg-[#EBF2EE] group-hover:bg-[#2D5A4C] text-[#2D5A4C] group-hover:text-white flex items-center justify-center text-xl transition-all shadow-sm">
                🏨
              </div>
              <span className="text-[11px] font-bold text-[#1F2937]">Hôtels</span>
            </div>

            {/* Transport */}
            <div className="flex flex-col items-center gap-2 group cursor-pointer">
              <div className="w-14 h-14 rounded-full bg-[#EBF2EE] group-hover:bg-[#2D5A4C] text-[#2D5A4C] group-hover:text-white flex items-center justify-center text-xl transition-all shadow-sm">
                🚌
              </div>
              <span className="text-[11px] font-bold text-[#1F2937]">Transports</span>
            </div>

            {/* Restauration */}
            <div className="flex flex-col items-center gap-2 group cursor-pointer">
              <div className="w-14 h-14 rounded-full bg-[#EBF2EE] group-hover:bg-[#2D5A4C] text-[#2D5A4C] group-hover:text-white flex items-center justify-center text-xl transition-all shadow-sm">
                🍽️
              </div>
              <span className="text-[11px] font-bold text-[#1F2937]">Repas</span>
            </div>

            {/* Guide */}
            <div className="flex flex-col items-center gap-2 group cursor-pointer">
              <div className="w-14 h-14 rounded-full bg-[#EBF2EE] group-hover:bg-[#2D5A4C] text-[#2D5A4C] group-hover:text-white flex items-center justify-center text-xl transition-all shadow-sm">
                🕌
              </div>
              <span className="text-[11px] font-bold text-[#1F2937]">Guides</span>
            </div>

            {/* Assistance */}
            <div className="flex flex-col items-center gap-2 group cursor-pointer">
              <div className="w-14 h-14 rounded-full bg-[#EBF2EE] group-hover:bg-[#2D5A4C] text-[#2D5A4C] group-hover:text-white flex items-center justify-center text-xl transition-all shadow-sm">
                📷
              </div>
              <span className="text-[11px] font-bold text-[#1F2937]">Visites</span>
            </div>
          </div>
        </div>

        {/* Right: Ils nous font confiance (5 cols) */}
        <div className="lg:col-span-5 bg-white rounded-3xl border border-[#E8E2D5] p-6 sm:p-8 shadow-sm space-y-6">
          <h3 className="text-xl font-bold text-[#2D5A4C]">Ils nous font confiance</h3>

          <div className="flex items-center justify-between flex-wrap gap-4">
            {/* Avatars Stack */}
            <div className="flex -space-x-3 overflow-hidden">
              <img className="inline-block h-10 w-10 rounded-full ring-2 ring-white object-cover" src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=100&q=80" alt="Pèlerin" />
              <img className="inline-block h-10 w-10 rounded-full ring-2 ring-white object-cover" src="https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=100&q=80" alt="Pèlerin" />
              <img className="inline-block h-10 w-10 rounded-full ring-2 ring-white object-cover" src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=100&q=80" alt="Pèlerin" />
              <img className="inline-block h-10 w-10 rounded-full ring-2 ring-white object-cover" src="https://images.unsplash.com/photo-1492562080023-ab3db95bfbce?auto=format&fit=crop&w=100&q=80" alt="Pèlerin" />
              <img className="inline-block h-10 w-10 rounded-full ring-2 ring-white object-cover" src="https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=100&q=80" alt="Pèlerin" />
            </div>

            {/* Rating Box */}
            <div className="text-right">
              <div className="flex items-center gap-1 justify-end text-[#B45309] text-sm">
                <span>★★★★★</span>
                <span className="font-extrabold text-[#2D5A4C] text-base ml-1">4.9</span>
                <span className="text-[#4B5563] font-bold text-xs">/ 5</span>
              </div>
              <p className="text-[11px] text-[#4B5563] font-semibold mt-0.5">Basé sur 452 avis pèlerins</p>
            </div>
          </div>
        </div>
      </div>
    </SectionWrapper>
  );
};

export default ServicesSection;
