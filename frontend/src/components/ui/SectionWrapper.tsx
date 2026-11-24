import React from 'react';
import { motion } from 'framer-motion';

interface SectionWrapperProps {
  children: React.ReactNode;
  id?: string;
  className?: string;
  bgColor?: 'light' | 'dark' | 'gray' | 'gradient';
}

const SectionWrapper: React.FC<SectionWrapperProps> = ({
  children,
  id,
  className = '',
  bgColor = 'light',
}) => {
  const getBgClass = () => {
    switch (bgColor) {
      case 'gray':
        // Nuance structurante (Sable légèrement plus marqué)
        return 'bg-[#F5F0E6]';
      case 'dark':
        // Fond contrasté (Sable très doux)
        return 'bg-[#FAF6EE]';
      case 'gradient':
        // Dégradé naturel Crème Sable vers nuance structurante
        return 'bg-gradient-to-b from-[#FDFBF7] to-[#F5F0E6]';
      case 'light':
      default:
        // Fond principal 60% Crème Sable
        return 'bg-[#FDFBF7]';
    }
  };

  return (
    <motion.section
      id={id}
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-100px' }}
      transition={{ duration: 0.6, ease: 'easeOut' }}
      className={`py-16 md:py-24 px-4 sm:px-6 lg:px-8 overflow-hidden transition-colors duration-300 ${getBgClass()} ${className}`}
    >
      <div className="max-w-7xl mx-auto w-full">
        {children}
      </div>
    </motion.section>
  );
};

export default SectionWrapper;
