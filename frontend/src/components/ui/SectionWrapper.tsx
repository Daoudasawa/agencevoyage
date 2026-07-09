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
        return 'bg-gray-50 dark:bg-zinc-900';
      case 'dark':
        return 'bg-zinc-950 text-white dark:bg-black';
      case 'gradient':
        return 'bg-gradient-to-b from-white to-gray-50 dark:from-zinc-950 dark:to-zinc-900';
      case 'light':
      default:
        return 'bg-white dark:bg-zinc-950';
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
