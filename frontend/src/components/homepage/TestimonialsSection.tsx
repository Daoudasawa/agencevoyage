import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
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
        { id: 1, name: 'Moussa Kabore', country: 'Burkina Faso', review: 'Un pèlerinage exceptionnel. Les imams nous ont guidés à chaque étape avec une patience infinie. L\'hôtel était parfait.', rating: 5, photo: null, status: 'published', sort_order: 1 },
        { id: 2, name: 'Aissata Sawadogo', country: 'Burkina Faso', review: 'L\'organisation médicale et logistique de l\'agence était rassurante. Nous étions logés très près du Haram.', rating: 5, photo: null, status: 'published', sort_order: 2 },
        { id: 3, name: 'El Hadj Ousmane Traore', country: 'Burkina Faso', review: 'Je recommande chaleureusement cette agence. De l\'inscription à Ouagadougou jusqu\'au retour de Jeddah, tout était irréprochable.', rating: 5, photo: null, status: 'published', sort_order: 3 },
      ];

  const nextTestimonial = () => {
    setActiveIndex((prev) => (prev + 1) % activeTestimonials.length);
  };

  const prevTestimonial = () => {
    setActiveIndex((prev) => (prev - 1 + activeTestimonials.length) % activeTestimonials.length);
  };

  useEffect(() => {
    // Autoplay interval
    timerRef.current = setInterval(nextTestimonial, 6000);
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [activeTestimonials.length]);

  const handleManualNav = (dir: 'prev' | 'next') => {
    // Reset autoplay timer when manually navigating
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
        <span className="text-emerald-600 dark:text-emerald-400 text-sm font-bold uppercase tracking-wider">
          Témoignages
        </span>
        <h2 className="text-3xl md:text-4xl font-extrabold text-zinc-900 dark:text-white tracking-tight mt-2">
          Leur Retour d'Expérience Spirituelle
        </h2>
        <p className="mt-4 text-lg text-zinc-550 dark:text-zinc-400">
          Découvrez les avis et émotions partagés par les pèlerins que nous avons eu le privilège d'accompagner aux lieux saints.
        </p>
      </div>

      {/* Carousel */}
      <div className="relative max-w-4xl mx-auto px-4">
        {activeTestimonials.length > 0 && current && (
          <div className="min-h-[300px] flex flex-col items-center justify-between text-center bg-zinc-50 dark:bg-zinc-900 rounded-3xl border border-gray-100 dark:border-zinc-800 p-8 md:p-12 shadow-sm">
            {/* Stars */}
            <div className="flex justify-center">
              <StarRating rating={current.rating} size={22} />
            </div>

            {/* Review content */}
            <div className="mt-6 md:mt-8 max-w-2xl">
              <p className="text-lg md:text-xl font-medium text-zinc-700 dark:text-zinc-300 italic leading-relaxed">
                "{current.review}"
              </p>
            </div>

            {/* Profile */}
            <div className="mt-8 flex flex-col items-center">
              <div className="w-16 h-16 rounded-full bg-emerald-100 dark:bg-emerald-950 flex items-center justify-center font-bold text-emerald-700 dark:text-emerald-300 text-xl border-2 border-emerald-500 shadow-md">
                {current.name.split(' ').map((n) => n[0]).join('')}
              </div>
              <h4 className="mt-3 text-base font-bold text-zinc-900 dark:text-white">
                {current.name}
              </h4>
              <span className="text-xs text-zinc-400 dark:text-zinc-500 mt-1 uppercase tracking-widest font-semibold">
                {current.country}
              </span>
            </div>
          </div>
        )}

        {/* Navigation Arrows */}
        {activeTestimonials.length > 1 && (
          <>
            <button
              onClick={() => handleManualNav('prev')}
              className="absolute left-0 md:-left-6 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-white dark:bg-zinc-800 border border-gray-100 dark:border-zinc-750 shadow-md flex items-center justify-center text-zinc-600 dark:text-zinc-300 hover:bg-emerald-600 hover:text-white transition-all cursor-pointer"
            >
              <LeftOutlined style={{ fontSize: 14 }} />
            </button>
            <button
              onClick={() => handleManualNav('next')}
              className="absolute right-0 md:-right-6 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-white dark:bg-zinc-800 border border-gray-100 dark:border-zinc-750 shadow-md flex items-center justify-center text-zinc-600 dark:text-zinc-300 hover:bg-emerald-600 hover:text-white transition-all cursor-pointer"
            >
              <RightOutlined style={{ fontSize: 14 }} />
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
                className={`w-2.5 h-2.5 rounded-full transition-all duration-300 cursor-pointer ${
                  idx === activeIndex ? 'bg-emerald-600 w-6' : 'bg-gray-300 dark:bg-zinc-800 hover:bg-zinc-400'
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
