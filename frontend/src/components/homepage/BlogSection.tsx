import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import SectionWrapper from '../ui/SectionWrapper';
import type { CmsBlogPost } from '../../types/homepage';
import { CalendarOutlined, UserOutlined, ArrowRightOutlined, CloseOutlined } from '@ant-design/icons';

interface BlogSectionProps {
  posts: CmsBlogPost[];
}

const BlogSection: React.FC<BlogSectionProps> = ({ posts }) => {
  const [selectedPost, setSelectedPost] = useState<CmsBlogPost | null>(null);

  const activePosts = posts.length > 0
    ? posts.filter(p => p.status === 'published')
    : [
        { id: 1, title: 'Comment bien se préparer spirituellement au Hajj', slug: 'preparation-spirituelle-hajj', excerpt: 'Conseils pratiques et invocations essentielles pour vivre sereinement les rites sacrés.', content: "Le Hajj est le voyage d'une vie. Pour en tirer les plus grands bienfaits, il convient de se préparer spirituellement bien avant le départ. Pensez à réviser sincèrement votre repentir, à acquérir la connaissance théorique des rites (Tawaf, Sa'i, Arafat) et à purifier vos intentions. Notre agence organise des sessions de formation collectives à Ouagadougou animées par des guides religieux expérimentés pour vous guider.", image: 'https://images.unsplash.com/photo-1591604021695-0c69b7c05981?auto=format&fit=crop&w=800&q=80', status: 'published', published_at: '2026-06-15T10:00:00Z', created_at: '2026-06-15T10:00:00Z', author: { id: 1, nom: 'Diallo', prenom: 'Imam Amadou' } },
        { id: 2, title: 'Les vaccins obligatoires et recommandations médicales', slug: 'vaccins-recommandations-medicales', excerpt: "Tout savoir sur la méningite ACYW135, le certificat médical d'aptitude et les conseils santé.", content: "Pour voyager en toute sécurité vers l'Arabie Saoudite, certaines règles de santé publique s'appliquent. Le vaccin contre la méningite ACYW135 est strictement obligatoire pour l'obtention du visa. Il est également recommandé d'effectuer un bilan de santé général et d'emporter votre traitement habituel dans vos bagages à main, accompagné de l'ordonnance correspondante.", image: 'https://images.unsplash.com/photo-1584036561566-baf8f5f1b144?auto=format&fit=crop&w=800&q=80', status: 'published', published_at: '2026-06-18T14:30:00Z', created_at: '2026-06-18T14:30:00Z', author: { id: 1, nom: 'Ouedraogo', prenom: 'Fatima' } },
        { id: 3, title: 'Les nouveautés administratives pour la saison 2026', slug: 'nouveautes-administratives-2026', excerpt: 'Découvrez les nouvelles procédures de visa et de transport local mises en place par le Ministère.', content: 'Pour la saison de pèlerinage 2026, les autorités saoudiennes et burkinabè ont introduit plusieurs simplifications administratives. Les visas sont désormais délivrés sous forme électronique (e-visa) directement rattachés à votre passeport biométrique.', image: 'https://images.unsplash.com/photo-1604999333679-b86d54738315?auto=format&fit=crop&w=800&q=80', status: 'published', published_at: '2026-06-20T09:00:00Z', created_at: '2026-06-20T09:00:00Z', author: { id: 1, nom: 'Traore', prenom: 'Ibrahim' } },
      ];

  const formatDate = (dateStr: string | null) => {
    if (!dateStr) return '';
    return new Date(dateStr).toLocaleDateString('fr-FR', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
    });
  };

  return (
    <SectionWrapper id="blog" bgColor="gradient">
      {/* Title */}
      <div className="text-center max-w-3xl mx-auto mb-16">
        <span className="text-[#B45309] text-[11px] font-bold uppercase tracking-[0.2em]">
          Actualités
        </span>
        <h2 className="text-3xl md:text-5xl font-extrabold text-[#2D5A4C] tracking-tight mt-3">
          Conseils, Actualités & Guides Pratiques
        </h2>
        <p className="mt-5 text-lg text-[#4B5563] font-light leading-relaxed">
          Suivez notre blog pour rester informé sur l'actualité du Hajj & Omra et préparer au mieux votre futur séjour spirituel.
        </p>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {activePosts.map((post, index) => (
          <motion.article
            key={post.id || index}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
            className="bg-white border border-[#E8E2D5] rounded-2xl overflow-hidden shadow-sm hover:shadow-lg transition-all duration-300 group flex flex-col h-[480px]"
          >
            {/* Image */}
            <div className="relative h-52 overflow-hidden bg-slate-100">
              <img
                src={post.image || 'https://images.unsplash.com/photo-1591604021695-0c69b7c05981?auto=format&fit=crop&w=800&q=80'}
                alt={post.title}
                loading="lazy"
                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700 ease-in-out"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
            </div>

            {/* Body */}
            <div className="p-7 flex-1 flex flex-col justify-between bg-white">
              <div>
                {/* Meta */}
                <div className="flex items-center gap-4 text-[10px] font-bold uppercase tracking-wider text-[#4B5563] mb-4">
                  <span className="flex items-center gap-1.5">
                    <CalendarOutlined className="text-[#B45309]" />
                    {formatDate(post.published_at)}
                  </span>
                  <span className="flex items-center gap-1.5">
                    <UserOutlined className="text-[#B45309]" />
                    {post.author ? `${post.author.prenom} ${post.author.nom}` : 'Rédaction'}
                  </span>
                </div>

                <h3 className="text-xl font-bold text-[#1F2937] line-clamp-2 leading-snug group-hover:text-[#2D5A4C] transition-colors duration-300">
                  {post.title}
                </h3>

                <p className="text-[#4B5563] text-sm mt-3 line-clamp-3 leading-relaxed font-light">
                  {post.excerpt}
                </p>
              </div>

              {/* Action Button */}
              <div className="pt-5 border-t border-[#E8E2D5] mt-5 flex items-center">
                <button
                  onClick={() => setSelectedPost(post)}
                  className="text-[#2D5A4C] hover:text-[#B45309] font-bold text-sm flex items-center gap-2 cursor-pointer transition-colors duration-300 group/btn"
                >
                  Lire la suite
                  <ArrowRightOutlined className="text-xs group-hover/btn:translate-x-1 transition-transform" />
                </button>
              </div>
            </div>
          </motion.article>
        ))}
      </div>

      {/* Article Detail Modal */}
      <AnimatePresence>
        {selectedPost && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-[#1F2937]/70 backdrop-blur-sm flex items-center justify-center p-4"
            onClick={() => setSelectedPost(null)}
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="relative max-w-2xl w-full bg-white rounded-3xl overflow-hidden shadow-2xl border border-[#E8E2D5] flex flex-col max-h-[85vh]"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Close Button */}
              <button
                onClick={() => setSelectedPost(null)}
                className="absolute top-4 right-4 w-10 h-10 rounded-full bg-white/90 hover:bg-white text-[#1F2937] border border-[#E8E2D5] flex items-center justify-center cursor-pointer z-20 hover:scale-105 transition-all shadow-md"
              >
                <CloseOutlined style={{ fontSize: 16 }} />
              </button>

              {/* Cover Image */}
              <div className="h-64 relative shrink-0">
                <img
                  src={selectedPost.image || 'https://images.unsplash.com/photo-1591604021695-0c69b7c05981?auto=format&fit=crop&w=800&q=80'}
                  alt={selectedPost.title}
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#2D5A4C]/90 via-[#2D5A4C]/40 to-transparent" />
                <div className="absolute bottom-6 left-6 right-6 text-white">
                  <span className="text-xs uppercase font-bold tracking-widest text-[#FEF3C7]">
                    Conseil Spirituel
                  </span>
                  <h2 className="text-xl md:text-2xl font-black mt-1 leading-tight text-[#FDFBF7]">{selectedPost.title}</h2>
                </div>
              </div>

              {/* Article Content */}
              <div className="p-6 md:p-8 overflow-y-auto space-y-4 text-[#1F2937]">
                {/* Meta */}
                <div className="flex gap-4 text-xs font-semibold text-[#4B5563] pb-4 border-b border-[#E8E2D5]">
                  <span>📅 Publié le {formatDate(selectedPost.published_at)}</span>
                  <span>👤 Par {selectedPost.author ? `${selectedPost.author.prenom} ${selectedPost.author.nom}` : 'Rédaction'}</span>
                </div>
                <div className="text-base leading-relaxed space-y-4 whitespace-pre-line pt-2 text-[#4B5563]">
                  {selectedPost.content}
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </SectionWrapper>
  );
};

export default BlogSection;
