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
      color: 'from-[#2D5A4C] to-[#1B362E]',
    },
    {
      value: content.stat2_value || 5000,
      label: content.stat2_label || 'Pèlerins accompagnés',
      suffix: '+',
      color: 'from-[#B45309] to-[#92400E]',
    },
    {
      value: content.stat3_value || 200,
      label: content.stat3_label || 'Départs organisés',
      suffix: '+',
      color: 'from-[#2D5A4C] to-[#3D6B5D]',
    },
    {
      value: content.stat4_value || 98,
      label: content.stat4_label || 'Taux de satisfaction',
      suffix: '%',
      color: 'from-[#B45309] to-[#D97706]',
    },
  ];

  return (
    <SectionWrapper id="stats" bgColor="light" className="relative">
      <div className="text-center max-w-3xl mx-auto mb-16">
        <h2 className="text-3xl md:text-5xl font-extrabold text-[#2D5A4C] tracking-tight">
          {title}
        </h2>
        <p className="mt-5 text-lg text-[#4B5563] font-light leading-relaxed">
          {subtitle}
        </p>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8">
        {stats.map((stat, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
            className="bg-white border border-[#E8E2D5] rounded-2xl shadow-sm p-8 flex flex-col items-center justify-center text-center group hover:shadow-lg hover:-translate-y-1 transition-all duration-300"
          >
            {/* Stat Value */}
            <span className={`text-4xl md:text-5xl font-black bg-gradient-to-b ${stat.color} bg-clip-text text-transparent group-hover:scale-105 transition-transform duration-500`}>
              <CountUp end={stat.value} suffix={stat.suffix} />
            </span>
            
            {/* Stat Label */}
            <span className="mt-4 text-xs md:text-sm font-semibold uppercase tracking-wider text-[#4B5563] group-hover:text-[#B45309] transition-colors duration-300">
              {stat.label}
            </span>
          </motion.div>
        ))}
      </div>
    </SectionWrapper>
  );
};

export default StatsSection;
