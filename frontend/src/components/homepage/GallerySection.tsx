import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import SectionWrapper from '../ui/SectionWrapper';
import type { CmsGalleryItem } from '../../types/homepage';
import { CompassOutlined, PlusOutlined, CloseOutlined } from '@ant-design/icons';

interface GallerySectionProps {
  galleryItems: CmsGalleryItem[];
}

const GallerySection: React.FC<GallerySectionProps> = ({ galleryItems }) => {
  const [activeCategory, setActiveCategory] = useState('tous');
  const [selectedImage, setSelectedImage] = useState<CmsGalleryItem | null>(null);

  const items = galleryItems.length > 0
    ? galleryItems.filter(item => item.is_active)
    : [
        { id: 1, image_path: 'https://images.unsplash.com/photo-1591604021695-0c69b7c05981?auto=format&fit=crop&w=800&q=80', caption: 'La Mosquée du Prophète, Médine', category: 'medine', album: 'Départ 2024', sort_order: 1, is_active: true },
        { id: 2, image_path: 'https://images.unsplash.com/photo-1564769625905-50e93615e769?auto=format&fit=crop&w=800&q=80', caption: 'La sainte Kaaba, La Mecque', category: 'mecque', album: 'Départ 2024', sort_order: 2, is_active: true },
        { id: 3, image_path: 'https://images.unsplash.com/photo-1580674684081-7617fbf3d745?auto=format&fit=crop&w=800&q=80', caption: 'Le Dôme Vert, Médine', category: 'medine', album: 'Départ 2023', sort_order: 3, is_active: true },
        { id: 4, image_path: 'https://images.unsplash.com/photo-1604999333679-b86d54738315?auto=format&fit=crop&w=800&q=80', caption: 'Esplanade du Haram, La Mecque', category: 'mecque', album: 'Départ 2024', sort_order: 4, is_active: true },
        { id: 5, image_path: 'https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&w=800&q=80', caption: 'Pèlerins rassemblés à Arafat', category: 'rites', album: 'Départ 2024', sort_order: 5, is_active: true },
        { id: 6, image_path: 'https://images.unsplash.com/photo-1576085898312-d27878aa3c95?auto=format&fit=crop&w=800&q=80', caption: 'Montagne de la Lumière (Jabal al-Nour)', category: 'rites', album: 'Départ 2023', sort_order: 6, is_active: true },
      ];

  const categories = [
    { key: 'tous', label: 'Tout' },
    { key: 'mecque', label: 'La Mecque' },
    { key: 'medine', label: 'Médine' },
    { key: 'rites', label: 'Rites & Lieux Saints' },
  ];

  const filteredItems = activeCategory === 'tous'
    ? items
    : items.filter(item => item.category.toLowerCase() === activeCategory);

  return (
    <SectionWrapper id="galerie" bgColor="light">
      {/* Header */}
      <div className="text-center max-w-3xl mx-auto mb-12">
        <span className="text-emerald-600 dark:text-emerald-400 text-sm font-bold uppercase tracking-wider">
          En Images
        </span>
        <h2 className="text-3xl md:text-4xl font-extrabold text-zinc-900 dark:text-white tracking-tight mt-2">
          Galerie Souvenirs & Rites
        </h2>
        <p className="mt-4 text-lg text-zinc-550 dark:text-zinc-400">
          Revivez en images les précieux moments de foi et de fraternité partagés lors de nos précédents départs.
        </p>
      </div>

      {/* Filter categories */}
      <div className="flex flex-wrap justify-center gap-3 mb-12">
        {categories.map((cat) => (
          <button
            key={cat.key}
            onClick={() => setActiveCategory(cat.key)}
            className={`px-5 py-2.5 rounded-full text-sm font-semibold transition-all cursor-pointer ${
              activeCategory === cat.key
                ? 'bg-emerald-600 text-white shadow-lg shadow-emerald-600/20'
                : 'bg-zinc-50 hover:bg-zinc-100 text-zinc-650 dark:bg-zinc-900 dark:text-zinc-300 dark:hover:bg-zinc-800'
            }`}
          >
            {cat.label}
          </button>
        ))}
      </div>

      {/* Masonry / Grid */}
      <motion.div 
        layout
        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
      >
        <AnimatePresence mode="popLayout">
          {filteredItems.map((item, index) => (
            <motion.div
              layout
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              transition={{ duration: 0.3 }}
              key={item.id || index}
              className="relative aspect-4/3 rounded-3xl overflow-hidden shadow-sm hover:shadow-xl group cursor-pointer"
              onClick={() => setSelectedImage(item)}
            >
              <img
                src={item.image_path}
                alt={item.caption || ''}
                loading="lazy"
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              />
              {/* Overlay on hover */}
              <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-6 z-10 text-white">
                <span className="text-[10px] uppercase font-bold tracking-widest text-emerald-400">
                  {item.album || 'Convoi'}
                </span>
                <h4 className="font-bold text-base mt-1 line-clamp-1">{item.caption}</h4>
                <div className="absolute top-6 right-6 w-9 h-9 rounded-full bg-white/10 backdrop-blur-sm border border-white/20 flex items-center justify-center">
                  <PlusOutlined style={{ fontSize: 14 }} />
                </div>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </motion.div>

      {/* Lightbox Modal */}
      <AnimatePresence>
        {selectedImage && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/90 backdrop-blur-sm flex items-center justify-center p-4"
            onClick={() => setSelectedImage(null)}
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              transition={{ type: 'spring', damping: 25, stiffness: 300 }}
              className="relative max-w-4xl w-full rounded-2xl overflow-hidden bg-zinc-950/40 p-1"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Close button */}
              <button
                onClick={() => setSelectedImage(null)}
                className="absolute top-4 right-4 w-10 h-10 rounded-full bg-black/60 hover:bg-black/80 text-white border border-white/15 flex items-center justify-center cursor-pointer z-15 hover:scale-105 transition-all"
              >
                <CloseOutlined style={{ fontSize: 16 }} />
              </button>

              <img
                src={selectedImage.image_path}
                alt={selectedImage.caption || ''}
                className="w-full max-h-[80vh] object-contain rounded-xl"
              />

              {/* Caption details */}
              <div className="p-5 text-white bg-gradient-to-t from-black/90 via-black/50 to-transparent pt-12 mt-[-50px] relative z-10">
                <span className="text-xs uppercase font-bold tracking-widest text-emerald-400">
                  {selectedImage.album} • {selectedImage.category}
                </span>
                <p className="mt-1.5 font-bold text-lg">{selectedImage.caption}</p>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </SectionWrapper>
  );
};

export default GallerySection;
