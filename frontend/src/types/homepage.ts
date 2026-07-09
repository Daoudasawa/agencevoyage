export interface CmsSection {
  id: number;
  key: string;
  title: string;
  subtitle: string;
  content: any; // JSON fields specific to each section
  media_url: string | null;
  sort_order: number;
  is_active: boolean;
}

export interface CmsService {
  id: number;
  icon: string;
  title: string;
  description: string;
  sort_order: number;
  is_active: boolean;
}

export interface CmsTestimonial {
  id: number;
  name: string;
  country: string;
  photo: string | null;
  review: string;
  rating: number;
  status: 'pending' | 'published' | 'archived';
  sort_order: number;
}

export interface CmsGalleryItem {
  id: number;
  image_path: string;
  caption: string | null;
  category: string;
  album: string | null;
  sort_order: number;
  is_active: boolean;
}

export interface CmsBlogPost {
  id: number;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  image: string | null;
  author?: {
    id: number;
    nom: string;
    prenom: string;
  };
  status: 'draft' | 'published' | 'scheduled';
  published_at: string | null;
  created_at: string;
}

export interface CmsFaq {
  id: number;
  question: string;
  answer: string;
  category: string;
  sort_order: number;
  is_active: boolean;
}

export interface CmsContactInfo {
  id: number;
  key: string;
  value: string;
}

export interface CmsDeparture {
  id: number;
  date: string;
  type: 'hajj' | 'omra';
  forfait_id: number | null;
  forfait?: {
    id: number;
    nom: string;
    prix: number;
  };
  places_total: number;
  places_remaining: number;
  price: number;
  is_active: boolean;
}

export interface CmsWhyChooseUs {
  id: number;
  icon: string;
  title: string;
  description: string;
  sort_order: number;
  is_active: boolean;
}

export interface Forfait {
  id: number;
  nom: string;
  type: 'hajj' | 'omra';
  prix: number;
  duree: number;
  description: string | null;
  services_inclus: string | null;
  actif: boolean;
  types_documents?: Array<{
    id: number;
    nom: string;
    obligatoire: boolean;
    description: string | null;
  }>;
}

export interface HomepageData {
  hero: CmsSection | null;
  stats: CmsSection | null;
  services: CmsService[];
  whyChooseUs: CmsWhyChooseUs[];
  contact: Record<string, string>;
  testimonials: CmsTestimonial[];
  featuredOffers: Forfait[];
  departures: CmsDeparture[];
}
