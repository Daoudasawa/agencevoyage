import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api from '../services/api';
import type { HomepageData, CmsFaq, CmsGalleryItem, CmsBlogPost, Forfait, CmsDeparture } from '../types/homepage';

// Public hooks
export const useHomepageData = () => {
  return useQuery<HomepageData>({
    queryKey: ['homepage'],
    queryFn: async () => {
      const response = await api.get('/homepage');
      return response.data;
    },
    staleTime: 1000 * 60 * 10, // 10 minutes cache
  });
};

export const usePublicFaqs = () => {
  return useQuery<CmsFaq[]>({
    queryKey: ['faqs'],
    queryFn: async () => {
      const response = await api.get('/faqs');
      return response.data;
    },
    staleTime: 1000 * 60 * 30,
  });
};

export const usePublicGallery = () => {
  return useQuery<CmsGalleryItem[]>({
    queryKey: ['gallery'],
    queryFn: async () => {
      const response = await api.get('/gallery');
      return response.data;
    },
    staleTime: 1000 * 60 * 15,
  });
};

export const usePublicBlog = () => {
  return useQuery<CmsBlogPost[]>({
    queryKey: ['blog'],
    queryFn: async () => {
      const response = await api.get('/blog');
      return response.data;
    },
    staleTime: 1000 * 60 * 5,
  });
};

// Admin/Agent CMS Management hooks
export const useAdminCmsMutations = () => {
  const queryClient = useQueryClient();

  const updateSection = useMutation({
    mutationFn: async ({ key, data }: { key: string; data: any }) => {
      const response = await api.put(`/admin/cms/sections/${key}`, data);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['homepage'] });
    },
  });

  const updateContact = useMutation({
    mutationFn: async (data: Record<string, string>) => {
      const response = await api.put('/admin/cms/contact', data);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['homepage'] });
    },
  });

  return {
    updateSection,
    updateContact,
  };
};
