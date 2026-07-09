import React from 'react';

interface SkeletonCardProps {
  type?: 'offer' | 'blog' | 'testimonial' | 'row';
}

const SkeletonCard: React.FC<SkeletonCardProps> = ({ type = 'offer' }) => {
  if (type === 'row') {
    return (
      <div className="w-full flex items-center space-x-4 py-4 border-b border-gray-100 animate-pulse">
        <div className="h-6 bg-gray-200 dark:bg-zinc-800 rounded w-1/4"></div>
        <div className="h-6 bg-gray-200 dark:bg-zinc-800 rounded w-1/6"></div>
        <div className="h-6 bg-gray-200 dark:bg-zinc-800 rounded w-1/12"></div>
        <div className="h-6 bg-gray-200 dark:bg-zinc-800 rounded w-1/6"></div>
        <div className="h-8 bg-gray-300 dark:bg-zinc-700 rounded w-1/12 ml-auto"></div>
      </div>
    );
  }

  if (type === 'testimonial') {
    return (
      <div className="bg-white dark:bg-zinc-900 p-6 rounded-2xl border border-gray-100 dark:border-zinc-800 shadow-sm animate-pulse flex flex-col justify-between h-64">
        <div className="space-y-3">
          <div className="flex gap-1">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="h-4 w-4 bg-gray-200 dark:bg-zinc-800 rounded-full"></div>
            ))}
          </div>
          <div className="h-4 bg-gray-200 dark:bg-zinc-800 rounded w-full"></div>
          <div className="h-4 bg-gray-200 dark:bg-zinc-800 rounded w-5/6"></div>
          <div className="h-4 bg-gray-200 dark:bg-zinc-800 rounded w-4/6"></div>
        </div>
        <div className="flex items-center space-x-3 mt-4">
          <div className="h-10 w-10 bg-gray-250 dark:bg-zinc-800 rounded-full"></div>
          <div className="space-y-2 flex-1">
            <div className="h-4 bg-gray-200 dark:bg-zinc-800 rounded w-1/3"></div>
            <div className="h-3 bg-gray-100 dark:bg-zinc-805 rounded w-1/4"></div>
          </div>
        </div>
      </div>
    );
  }

  if (type === 'blog') {
    return (
      <div className="bg-white dark:bg-zinc-900 rounded-2xl overflow-hidden border border-gray-100 dark:border-zinc-800 shadow-sm animate-pulse h-96">
        <div className="h-48 bg-gray-200 dark:bg-zinc-800"></div>
        <div className="p-6 space-y-4">
          <div className="h-3 bg-gray-100 dark:bg-zinc-805 rounded w-1/4"></div>
          <div className="h-5 bg-gray-200 dark:bg-zinc-800 rounded w-3/4"></div>
          <div className="space-y-2">
            <div className="h-4 bg-gray-200 dark:bg-zinc-800 rounded w-full"></div>
            <div className="h-4 bg-gray-200 dark:bg-zinc-800 rounded w-5/6"></div>
          </div>
          <div className="h-8 bg-gray-300 dark:bg-zinc-700 rounded w-1/3 pt-2"></div>
        </div>
      </div>
    );
  }

  // Default: offer
  return (
    <div className="bg-white dark:bg-zinc-900 rounded-2xl overflow-hidden border border-gray-100 dark:border-zinc-800 shadow-sm animate-pulse flex flex-col h-[480px]">
      <div className="h-56 bg-gray-200 dark:bg-zinc-800"></div>
      <div className="p-6 flex-1 flex flex-col justify-between">
        <div className="space-y-3">
          <div className="flex justify-between">
            <div className="h-4 bg-gray-250 dark:bg-zinc-800 rounded w-1/4"></div>
            <div className="h-4 bg-gray-250 dark:bg-zinc-800 rounded w-1/6"></div>
          </div>
          <div className="h-6 bg-gray-200 dark:bg-zinc-800 rounded w-3/4"></div>
          <div className="h-4 bg-gray-200 dark:bg-zinc-800 rounded w-full"></div>
          <div className="h-4 bg-gray-200 dark:bg-zinc-800 rounded w-5/6"></div>
        </div>
        <div className="space-y-4 pt-4 border-t border-gray-50 dark:border-zinc-800">
          <div className="flex justify-between items-center">
            <div className="h-6 bg-gray-200 dark:bg-zinc-800 rounded w-1/3"></div>
            <div className="h-8 bg-gray-300 dark:bg-zinc-700 rounded w-1/3"></div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SkeletonCard;
