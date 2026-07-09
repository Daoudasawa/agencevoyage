import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import SectionWrapper from '../ui/SectionWrapper';
import type { CmsFaq } from '../../types/homepage';
import { PlusOutlined, MinusOutlined } from '@ant-design/icons';

interface FaqSectionProps {
  faqs: CmsFaq[];
}

const FaqSection: React.FC<FaqSectionProps> = ({ faqs }) => {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const activeFaqs = faqs.length > 0
    ? faqs.filter(f => f.is_active)
    : [
        { id: 1, question: 'Quelles sont les conditions pour accomplir le Hajj 2026 ?', answer: 'Vous devez posséder un passeport biométrique valide au moins 6 mois après votre date de retour, être vacciné contre la méningite ACYW135 et être déclaré médicalement apte au pèlerinage.', category: 'hajj', sort_order: 1, is_active: true },
        { id: 2, question: 'Quelle est la différence entre le Hajj et l\'Omra ?', answer: 'Le Hajj est le grand pèlerinage obligatoire une fois dans sa vie pour tout musulman qui en a les moyens physiques et financiers, se déroulant à des dates fixes (mois de Dhul-Hijjah). L\'Omra est le petit pèlerinage, facultatif, réalisable à n\'importe quel moment de l\'année.', category: 'general', sort_order: 2, is_active: true },
        { id: 3, question: 'Est-il possible de payer son forfait en plusieurs fois ?', answer: 'Oui, nous autorisons le paiement échelonné en plusieurs tranches. Un acompte initial est obligatoire pour réserver votre billet d\'avion et votre hébergement, et le solde restant doit être réglé au plus tard 30 jours avant le départ.', category: 'paiements', sort_order: 3, is_active: true },
        { id: 4, question: 'Quel est l\'encadrement médical prévu sur place ?', answer: 'Notre convoi comprend une équipe médicale (médecins et infirmiers) burkinabè agréée. Ils disposent d\'une pharmacie de premier secours à nos hôtels à La Mecque et Médine pour assurer les soins de base des pèlerins.', category: 'sante', sort_order: 4, is_active: true },
        { id: 5, question: 'Combien de kilos de bagages puis-je emporter ?', answer: 'La franchise bagages dépend de la compagnie aérienne (en général 2 valises de 23 kg en soute et 1 bagage à main de 7 kg). Les détails précis vous seront communiqués lors des réunions d\'information collectives.', category: 'bagages', sort_order: 5, is_active: true },
      ];

  const toggleFaq = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <SectionWrapper id="faq" bgColor="gray">
      {/* Title */}
      <div className="text-center max-w-3xl mx-auto mb-16">
        <span className="text-emerald-600 dark:text-emerald-400 text-sm font-bold uppercase tracking-wider">
          Des Réponses à vos Questions
        </span>
        <h2 className="text-3xl md:text-4xl font-extrabold text-zinc-900 dark:text-white tracking-tight mt-2">
          Foire Aux Questions (FAQ)
        </h2>
        <p className="mt-4 text-lg text-zinc-550 dark:text-zinc-400">
          Retrouvez les réponses aux questions les plus fréquemment posées concernant l'organisation administrative et spirituelle.
        </p>
      </div>

      {/* Accordion list */}
      <div className="max-w-3xl mx-auto space-y-4">
        {activeFaqs.map((faq, index) => {
          const isOpen = openIndex === index;
          
          return (
            <div
              key={faq.id || index}
              className="bg-white dark:bg-zinc-900 rounded-2xl border border-gray-105 dark:border-zinc-800 shadow-sm overflow-hidden transition-all duration-300"
            >
              {/* Question Trigger */}
              <button
                onClick={() => toggleFaq(index)}
                className="w-full px-6 py-5 flex items-center justify-between text-left gap-4 font-bold text-zinc-850 dark:text-zinc-100 hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors cursor-pointer"
              >
                <span className="text-base md:text-lg">{faq.question}</span>
                <span className="w-8 h-8 rounded-full bg-zinc-50 dark:bg-zinc-800 flex items-center justify-center shrink-0 text-zinc-550 dark:text-zinc-350">
                  {isOpen ? <MinusOutlined className="text-xs" /> : <PlusOutlined className="text-xs" />}
                </span>
              </button>

              {/* Answer Content */}
              <AnimatePresence initial={false}>
                {isOpen && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.3, ease: 'easeInOut' }}
                  >
                    <div className="px-6 pb-6 pt-1 text-sm md:text-base text-zinc-500 dark:text-zinc-400 leading-relaxed border-t border-gray-50 dark:border-zinc-800/40">
                      {faq.answer}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          );
        })}
      </div>
    </SectionWrapper>
  );
};

export default FaqSection;
