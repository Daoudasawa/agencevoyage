import React from 'react';
import { motion } from 'framer-motion';
import SectionWrapper from '../ui/SectionWrapper';
import CountUp from '../ui/CountUp';
import type { CmsSection } from '../../types/homepage';

interface StatsSectionProps {
  sectionData: CmsSection | null;
}

const StatsSection: React.FC<StatsSectionProps> = ({ sectionData }) => {
  const title = sectionData?.title || 'Notre expertise au service de votre foi';
  const subtitle = sectionData?.subtitle || "Quelques chiffres clés qui témoignent de notre engagement pour la réussite de votre pèlerinage.";
  const content = sectionData?.content || {};

  const stats = [
    {
      value: content.stat1_value || 15,
      label: content.stat1_label || "Années d'expérience",
      suffix: ' ans',
      color: 'from-emerald-500 to-teal-600',
    },
    {
      value: content.stat2_value || 5000,
      label: content.stat2_label || 'Pèlerins accompagnés',
      suffix: '+',
      color: 'from-amber-500 to-yellow-600',
    },
    {
      value: content.stat3_value || 200,
      label: content.stat3_label || 'Départs organisés',
      suffix: '+',
      color: 'from-emerald-600 to-green-700',
    },
    {
      value: content.stat4_value || 98,
      label: content.stat4_label || 'Taux de satisfaction',
      suffix: '%',
      color: 'from-amber-600 to-amber-700',
    },
  ];

  return (
    <SectionWrapper id="stats" bgColor="gradient" className="relative">
      <div className="text-center max-w-3xl mx-auto mb-16">
        <h2 className="text-3xl md:text-4xl font-extrabold text-zinc-900 dark:text-white tracking-tight">
          {title}
        </h2>
        <p className="mt-4 text-lg text-zinc-550 dark:text-zinc-400">
          {subtitle}
        </p>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 md:gap-12">
        {stats.map((stat, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
            className="bg-white dark:bg-zinc-900 rounded-3xl border border-gray-100 dark:border-zinc-800 p-8 shadow-sm flex flex-col items-center justify-center text-center transition-all hover:shadow-md group"
          >
            {/* Stat Value */}
            <span className={`text-4xl md:text-5xl font-black bg-gradient-to-r ${stat.color} bg-clip-text text-transparent group-hover:scale-110 transition-transform duration-300`}>
              <CountUp end={stat.value} suffix={stat.suffix} />
            </span>
            
            {/* Stat Label */}
            <span className="mt-3 text-sm md:text-base font-semibold text-zinc-500 dark:text-zinc-400 group-hover:text-zinc-800 dark:group-hover:text-zinc-200 transition-colors duration-300">
              {stat.label}
            </span>
          </motion.div>
        ))}
      </div>
    </SectionWrapper>
  );
};

export default StatsSection;
