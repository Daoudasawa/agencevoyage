import React from 'react';
import { motion } from 'framer-motion';
import type { CmsSection } from '../../types/homepage';

interface HeroSectionProps {
  sectionData: CmsSection | null;
}

const HeroSection: React.FC<HeroSectionProps> = ({ sectionData }) => {
  const title = sectionData?.title || 'Accomplissez votre pèlerinage en toute sérénité';
  const subtitle = sectionData?.subtitle || 'Une agence agréée par l\'État burkinabè pour vous accompagner à chaque étape du voyage le plus important de votre vie.';
  
  // Safe extraction of content properties
  const content = sectionData?.content || {};
  const btn1Text = content.btn1_text || 'Découvrir les offres';
  const btn1Link = content.btn1_link || '#offres';
  const btn2Text = content.btn2_text || 'Demander un devis';
  const btn2Link = content.btn2_link || '#contact';
  
  // Premium Mecca photo placeholder
  const bgImage = sectionData?.media_url || 'https://images.unsplash.com/photo-1591604021695-0c69b7c05981?auto=format&fit=crop&w=1920&q=80';

  return (
    <section id="accueil" className="relative h-screen w-full flex items-center justify-center overflow-hidden">
      {/* Background Image with Ken Burns zoom effect */}
      <motion.div 
        initial={{ scale: 1.1 }}
        animate={{ scale: 1 }}
        transition={{ duration: 10, ease: 'easeOut' }}
        className="absolute inset-0 z-0 bg-cover bg-center"
        style={{ backgroundImage: `url("${bgImage}")` }}
      />
      
      {/* Overlay */}
      <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/50 to-black/80 z-10" />

      {/* Content Container */}
      <div className="relative z-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center text-white mt-16">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="space-y-6 max-w-4xl mx-auto"
        >
          {/* Tag */}
          <motion.span
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2, duration: 0.6 }}
            className="inline-block px-4 py-1.5 bg-amber-500/20 border border-amber-500/40 text-amber-400 text-xs font-semibold rounded-full uppercase tracking-wider backdrop-blur-sm"
          >
            🕌 Agréé Officiellement • Hajj & Omra 2026
          </motion.span>
          
          {/* Main Title */}
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold tracking-tight leading-tight md:leading-none">
            {title.split(' ').map((word, i) => {
              const isHighlight = ['pèlerinage', 'sérénité', 'serenity', 'pilgrimage'].includes(word.toLowerCase().replace(/[^a-zA-Z]/g, ''));
              return (
                <span key={i} className={isHighlight ? 'text-amber-400 block sm:inline' : ''}>
                  {word}{' '}
                </span>
              );
            })}
          </h1>
          
          {/* Subtitle */}
          <p className="text-lg sm:text-xl text-zinc-350 max-w-2xl mx-auto leading-relaxed">
            {subtitle}
          </p>

          {/* CTA Buttons */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.8 }}
            className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-6"
          >
            <a
              href={btn1Link}
              className="w-full sm:w-auto bg-emerald-600 hover:bg-emerald-700 text-white px-8 py-3.5 rounded-full font-bold text-base shadow-xl shadow-emerald-900/30 transition-all hover:scale-105 active:scale-95 text-center"
            >
              {btn1Text}
            </a>
            <a
              href={btn2Link}
              className="w-full sm:w-auto bg-white/10 hover:bg-white/20 text-white border border-white/20 hover:border-white/40 px-8 py-3.5 rounded-full font-bold text-base transition-all hover:scale-105 active:scale-95 backdrop-blur-sm text-center"
            >
              {btn2Text}
            </a>
          </motion.div>
        </motion.div>
      </div>

      {/* Elegant scroll indicator */}
      <motion.div 
        animate={{ y: [0, 10, 0] }}
        transition={{ repeat: Infinity, duration: 1.5 }}
        className="absolute bottom-8 left-1/2 transform -translate-x-1/2 z-20 hidden md:block cursor-pointer"
      >
        <a href="#search" className="flex flex-col items-center text-white/50 hover:text-white transition-colors">
          <span className="text-xs uppercase tracking-widest mb-2 font-medium">Découvrir</span>
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 14l-7 7m0 0l-7-7m7 7V3" />
          </svg>
        </a>
      </motion.div>
    </section>
  );
};

export default HeroSection;
