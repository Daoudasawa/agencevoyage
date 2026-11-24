import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import SectionWrapper from '../ui/SectionWrapper';
import StarRating from '../ui/StarRating';
import type { CmsTestimonial } from '../../types/homepage';
import { LeftOutlined, RightOutlined } from '@ant-design/icons';

interface TestimonialsSectionProps {
  testimonials: CmsTestimonial[];
}

const TestimonialsSection: React.FC<TestimonialsSectionProps> = ({ testimonials }) => {
  const [activeIndex, setActiveIndex] = useState(0);
  const timerRef = useRef<any>(null);

  const activeTestimonials = testimonials.length > 0
    ? testimonials.filter(t => t.status === 'published')
    : [
        { id: 1, name: 'Moussa Kabore', country: 'Burkina Faso', review: "Un pèlerinage exceptionnel. Les imams nous ont guidés à chaque étape avec une patience infinie. L'hôtel était parfait.", rating: 5, photo: null, status: 'published', sort_order: 1 },
        { id: 2, name: 'Aissata Sawadogo', country: 'Burkina Faso', review: "L'organisation médicale et logistique de l'agence était rassurante. Nous étions logés très près du Haram.", rating: 5, photo: null, status: 'published', sort_order: 2 },
        { id: 3, name: 'El Hadj Ousmane Traore', country: 'Burkina Faso', review: "Je recommande chaleureusement cette agence. De l'inscription à Ouagadougou jusqu'au retour de Jeddah, tout était irréprochable.", rating: 5, photo: null, status: 'published', sort_order: 3 },
      ];

  const nextTestimonial = () => {
    setActiveIndex((prev) => (prev + 1) % activeTestimonials.length);
  };

  const prevTestimonial = () => {
    setActiveIndex((prev) => (prev - 1 + activeTestimonials.length) % activeTestimonials.length);
  };

  useEffect(() => {
    timerRef.current = setInterval(nextTestimonial, 6000);
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [activeTestimonials.length]);

  const handleManualNav = (dir: 'prev' | 'next') => {
    if (timerRef.current) clearInterval(timerRef.current);
    if (dir === 'next') {
      nextTestimonial();
    } else {
      prevTestimonial();
    }
    timerRef.current = setInterval(nextTestimonial, 6000);
  };

  const current = activeTestimonials[activeIndex];

  return (
    <SectionWrapper id="temoignages" bgColor="light">
      {/* Title */}
      <div className="text-center max-w-3xl mx-auto mb-16">
        <span className="text-[#B45309] text-[11px] font-bold uppercase tracking-[0.2em]">
          Témoignages
        </span>
        <h2 className="text-3xl md:text-5xl font-extrabold text-[#2D5A4C] tracking-tight mt-3">
          Leur Retour d'Expérience Spirituelle
        </h2>
        <p className="mt-5 text-lg text-[#4B5563] font-light leading-relaxed">
          Découvrez les avis et émotions partagés par les pèlerins que nous avons eu le privilège d'accompagner aux lieux saints.
        </p>
      </div>

      {/* Carousel */}
      <div className="relative max-w-4xl mx-auto px-4">
        {activeTestimonials.length > 0 && current && (
          <motion.div
            key={activeIndex}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className="min-h-[300px] flex flex-col items-center justify-between text-center bg-white border border-[#E8E2D5] rounded-2xl shadow-sm p-8 md:p-12"
          >
            {/* Stars */}
            <div className="flex justify-center text-[#B45309]">
              <StarRating rating={current.rating} size={22} />
            </div>

            {/* Review content */}
            <div className="mt-6 md:mt-8 max-w-2xl">
              <p className="text-lg md:text-xl font-medium text-[#1F2937] italic leading-relaxed">
                "{current.review}"
              </p>
            </div>

            {/* Profile */}
            <div className="mt-8 flex flex-col items-center">
              <div className="w-16 h-16 rounded-full bg-[#2D5A4C] flex items-center justify-center font-bold text-[#FEF3C7] text-xl border-2 border-[#B45309]/30 shadow-md">
                {current.name.split(' ').map((n) => n[0]).join('')}
              </div>
              <h4 className="mt-4 text-base font-bold text-[#2D5A4C]">
                {current.name}
              </h4>
              <span className="text-[10px] text-[#4B5563] mt-1 uppercase tracking-widest font-semibold">
                {current.country}
              </span>
            </div>
          </motion.div>
        )}

        {/* Navigation Arrows */}
        {activeTestimonials.length > 1 && (
          <>
            <button
              onClick={() => handleManualNav('prev')}
              className="absolute left-0 md:-left-6 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-white border border-[#E8E2D5] shadow-md flex items-center justify-center text-[#2D5A4C] hover:bg-[#2D5A4C] hover:text-white hover:border-[#2D5A4C] transition-all cursor-pointer z-10"
            >
              <LeftOutlined style={{ fontSize: 16 }} />
            </button>
            <button
              onClick={() => handleManualNav('next')}
              className="absolute right-0 md:-right-6 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-white border border-[#E8E2D5] shadow-md flex items-center justify-center text-[#2D5A4C] hover:bg-[#2D5A4C] hover:text-white hover:border-[#2D5A4C] transition-all cursor-pointer z-10"
            >
              <RightOutlined style={{ fontSize: 16 }} />
            </button>
          </>
        )}

        {/* Indicators Dots */}
        {activeTestimonials.length > 1 && (
          <div className="flex justify-center space-x-2 mt-8">
            {activeTestimonials.map((_, idx) => (
              <button
                key={idx}
                onClick={() => {
                  if (timerRef.current) clearInterval(timerRef.current);
                  setActiveIndex(idx);
                  timerRef.current = setInterval(nextTestimonial, 6000);
                }}
                className={`h-2 rounded-full transition-all duration-300 cursor-pointer ${
                  idx === activeIndex ? 'bg-[#2D5A4C] w-8' : 'bg-[#E8E2D5] w-2 hover:bg-[#d6ccba]'
                }`}
              />
            ))}
          </div>
        )}
      </div>
    </SectionWrapper>
  );
};

export default TestimonialsSection;
