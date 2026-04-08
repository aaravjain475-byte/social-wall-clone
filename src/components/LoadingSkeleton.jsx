import React from 'react';
import { motion } from 'framer-motion';

const LoadingSkeleton = ({ layout = 'masonry' }) => {
  const skeletonClasses = {
    masonry: 'max-w-sm',
    grid: '',
    list: 'flex flex-row max-w-2xl'
  };

  const renderSkeleton = () => (
    <div className={`social-card ${skeletonClasses[layout]}`}>
      {/* Header */}
      <div className={`${layout === 'list' ? 'flex-1' : ''} social-header`}>
        <div className="w-10 h-10 loading-skeleton rounded-full" />
        <div className="social-info">
          <div className="h-4 loading-skeleton rounded w-24 mb-2" />
          <div className="h-3 loading-skeleton rounded w-16" />
        </div>
      </div>

      {/* Content */}
      <div className={`${layout === 'list' ? 'flex-1' : ''} social-content`}>
        <div className="space-y-2">
          <div className="h-3 loading-skeleton rounded" />
          <div className="h-3 loading-skeleton rounded w-5/6" />
          <div className="h-3 loading-skeleton rounded w-4/6" />
        </div>
        
        {/* Random image placeholder */}
        {Math.random() > 0.5 && (
          <div className={`mt-3 ${layout === 'list' ? 'w-48 h-48' : 'h-48'} loading-skeleton rounded-lg`} />
        )}
      </div>

      {/* Footer */}
      <div className={`${layout === 'list' ? 'flex-col' : ''} social-footer`}>
        <div className={`${layout === 'list' ? 'w-full' : ''} social-stats`}>
          <div className="h-4 loading-skeleton rounded w-8" />
          <div className="h-4 loading-skeleton rounded w-8" />
          <div className="h-4 loading-skeleton rounded w-8" />
        </div>
      </div>
    </div>
  );

  const renderMultipleSkeletons = () => {
    const count = layout === 'list' ? 3 : layout === 'grid' ? 4 : 5;
    return Array.from({ length: count }, (_, i) => (
      <motion.div
        key={i}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ delay: i * 0.1 }}
        className={layout === 'masonry' ? 'masonry-item' : ''}
      >
        {renderSkeleton()}
      </motion.div>
    ));
  };

  return (
    <div className={layout === 'masonry' ? 'masonry-grid' : layout === 'grid' ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6' : 'space-y-4 max-w-4xl mx-auto'}>
      {renderMultipleSkeletons()}
    </div>
  );
};

export default LoadingSkeleton;
