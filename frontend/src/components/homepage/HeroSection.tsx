import React from 'react';
import { motion } from 'framer-motion';
import type { CmsSection } from '../../types/homepage';

interface HeroSectionProps {
  sectionData: CmsSection | null;
}

const HeroSection: React.FC<HeroSectionProps> = ({ sectionData }) => {
  const title = sectionData?.title || 'Vivez votre Omra';
  const subtitle = sectionData?.subtitle || 'Nous facilitons votre voyage pour vivre votre adoration en toute sérénité avec un encadrement médical et religieux sur-mesure.';

  return (
    <section id="accueil" className="bg-[#FDFBF7] pt-36 pb-12 overflow-hidden relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          {/* Left Text Content (6 cols) */}
          <div className="lg:col-span-6 space-y-6 text-left">
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="text-4xl sm:text-5xl md:text-6xl font-extrabold text-[#2D5A4C] tracking-tight leading-[1.15]"
            >
              {title} <br />
              <span className="font-serif-heading italic text-[#B45309] font-normal">
                en toute sérénité
              </span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="text-lg text-[#4B5563] font-normal max-w-lg leading-relaxed"
            >
              {subtitle}
            </motion.p>

            {/* Action Buttons */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="flex flex-wrap items-center gap-4 pt-2"
            >
              <a href="#offres" className="btn-primary">
                Découvrir nos offres
                <span className="text-base">➔</span>
              </a>
              <a href="#contact" className="btn-outline">
                <span>🎧</span>
                Parler à un conseiller
              </a>
            </motion.div>
          </div>

          {/* Right Image Section (6 cols) */}
          <div className="lg:col-span-6 relative">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8 }}
              className="relative rounded-3xl overflow-hidden shadow-2xl border-4 border-[#E8E2D5]"
            >
              <img
                src={sectionData?.media_url || "https://images.unsplash.com/photo-1564769625905-50e93615e769?auto=format&fit=crop&w=1200&q=80"}
                alt="La Mecque - Kaaba & Clock Tower"
                className="w-full h-[420px] sm:h-[480px] object-cover"
              />
              {/* Subtle lighting gradient */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent" />
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
