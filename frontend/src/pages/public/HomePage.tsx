import React, { useState } from 'react';
import Header from '../../components/homepage/Header';
import HeroSection from '../../components/homepage/HeroSection';
import SearchWidget from '../../components/homepage/SearchWidget';
import StatsSection from '../../components/homepage/StatsSection';
import OffersSection from '../../components/homepage/OffersSection';
import ServicesSection from '../../components/homepage/ServicesSection';
import DeparturesSection from '../../components/homepage/DeparturesSection';
import WhyChooseUsSection from '../../components/homepage/WhyChooseUsSection';
import TestimonialsSection from '../../components/homepage/TestimonialsSection';
import GallerySection from '../../components/homepage/GallerySection';
import BlogSection from '../../components/homepage/BlogSection';
import FaqSection from '../../components/homepage/FaqSection';
import ContactSection from '../../components/homepage/ContactSection';
import Footer from '../../components/homepage/Footer';

import { useHomepageData, usePublicFaqs, usePublicGallery, usePublicBlog } from '../../hooks/useHomepage';

const HomePage: React.FC = () => {
  const { data: homepageData, isLoading: isHomepageLoading } = useHomepageData();
  const { data: faqs = [] } = usePublicFaqs();
  const { data: gallery = [] } = usePublicGallery();
  const { data: blogPosts = [] } = usePublicBlog();

  const [searchFilters, setSearchFilters] = useState({
    type: 'tous',
    date: '',
    pilgrims: 1,
    budget: 5000000,
  });

  const handleSearch = (filters: { type: string; date: string; pilgrims: number; budget: number }) => {
    setSearchFilters(filters);
  };

  const heroData = homepageData?.hero || null;
  const statsData = homepageData?.stats || null;
  const services = homepageData?.services || [];
  const whyChooseUs = homepageData?.whyChooseUs || [];
  const contact = homepageData?.contact || {};
  const testimonials = homepageData?.testimonials || [];
  const featuredOffers = homepageData?.featuredOffers || [];
  const departures = homepageData?.departures || [];

  return (
    <div className="min-h-screen bg-white dark:bg-zinc-950 transition-colors duration-305">
      {/* 1. Header Sticky */}
      <Header />

      {/* 2. Hero Section */}
      <HeroSection sectionData={heroData} />

      {/* 3. Search Engine / Filter Widget */}
      <SearchWidget onSearch={handleSearch} />

      {/* 4. Agency Overview (Stats) */}
      <StatsSection sectionData={statsData} />

      {/* 5. Popular Offers Section */}
      <OffersSection 
        offers={featuredOffers} 
        isLoading={isHomepageLoading} 
        filters={searchFilters} 
      />

      {/* 6. Included Services */}
      <ServicesSection services={services} />

      {/* 7. Why Choose Us */}
      <WhyChooseUsSection items={whyChooseUs} />

      {/* 8. Departure Schedule */}
      <DeparturesSection departures={departures} />

      {/* 9. Customer Testimonials */}
      <TestimonialsSection testimonials={testimonials} />

      {/* 10. Galerie */}
      <GallerySection galleryItems={gallery} />

      {/* 11. Blog & News */}
      <BlogSection posts={blogPosts} />

      {/* 12. FAQ Accordion */}
      <FaqSection faqs={faqs} />

      {/* 13. Contact Section */}
      <ContactSection contactInfo={contact} />

      {/* 14. Footer */}
      <Footer contactInfo={contact} />
    </div>
  );
};

export default HomePage;
