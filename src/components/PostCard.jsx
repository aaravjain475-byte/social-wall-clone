import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { formatDistanceToNow } from 'date-fns';

const PostCard = ({ post, layout = 'masonry', onClick }) => {
  const [isLiked, setIsLiked] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const [imageError, setImageError] = useState(false);

  const handleLike = () => {
    setIsLiked(!isLiked);
  };

  const handleImageClick = () => {
    setIsExpanded(!isExpanded);
  };

  const getPlatformIcon = (platform) => {
    const icons = {
      instagram: (
        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
          <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zM5.838 12a6.162 6.162 0 1112.324 0 6.162 6.162 0 01-12.324 0zM12 16a4 4 0 110-8 4 4 0 010 8zm4.965-10.405a1.44 1.44 0 112.881.001 1.44 1.44 0 01-2.881-.001z"/>
        </svg>
      ),
      twitter: (
        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
          <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z"/>
        </svg>
      ),
      facebook: (
        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
          <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
        </svg>
      ),
      linkedin: (
        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
          <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
        </svg>
      )
    };
    return icons[platform] || icons.instagram;
  };

  const getPlatformColor = (platform) => {
    const colors = {
      instagram: 'text-pink-500',
      twitter: 'text-blue-400',
      facebook: 'text-blue-600',
      linkedin: 'text-blue-700'
    };
    return colors[platform] || 'text-gray-500';
  };

  const formatTime = (timestamp) => {
    try {
      return formatDistanceToNow(new Date(timestamp), { addSuffix: true });
    } catch {
      return 'just now';
    }
  };

  const truncateText = (text, maxLength = 100) => {
    if (text.length <= maxLength) return text;
    return text.substring(0, maxLength) + '...';
  };

  return (
    <motion.div
      className={`social-card ${layout === 'list' ? 'flex-row' : layout === 'uniform' ? 'uniform-card' : ''}`}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.8 }}
      transition={{ duration: 0.5 }}
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      onClick={onClick}
    >
      {/* Header */}
      <div className={`${layout === 'list' ? 'flex-1' : ''} social-header`}>
        <img
          src={post.avatar}
          alt={post.username}
          className="social-avatar"
          onError={(e) => {
            e.target.src = `https://picsum.photos/seed/${post.username}/40/40.jpg`;
          }}
        />
        <div className="social-info">
          <h3 className="social_username">{post.username}</h3>
          <div className="flex items-center space-x-2">
            <span className={`social-platform ${getPlatformColor(post.platform)}`}>
              {getPlatformIcon(post.platform)}
            </span>
            <span className="text-xs text-gray-400">{formatTime(post.timestamp)}</span>
          </div>
        </div>
        {layout !== 'list' && (
          <motion.button
            className="text-gray-400 hover:text-gray-200"
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
          >
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 5V1L7 6l5 5V7c3.31 0 6 2.69 6 6s-2.69 6-6 6-6-2.69-6-6H4c0 4.42 3.58 8 8 8s8-3.58 8-8-3.58-8-8-8z"/>
            </svg>
          </motion.button>
        )}
      </div>

      {/* Content */}
      <div className={`${layout === 'list' ? 'flex-1' : ''} social-content`}>
        <p className="social-text">
          {layout === 'list' || !post.image ? post.content : truncateText(post.content)}
        </p>

        {/* Image or Video */}
        {post.image && !imageError && (
          <div className={`${layout === 'list' ? 'w-48 h-48 ml-4' : ''} relative flex items-center justify-center`}>
            {post.mediaType === 'video' ? (
              <video
                src={post.image}
                alt="Post video"
                className={`${layout === 'list' ? 'w-full h-full' : 'social-image'}`}
                onClick={handleImageClick}
                autoPlay
                loop
                muted
                playsInline
                onError={() => setImageError(true)}
              />
            ) : (
              <img
                src={post.image}
                alt="Post image"
                className={`${layout === 'list' ? 'w-full h-full' : 'social-image'}`}
                onClick={handleImageClick}
                onError={() => setImageError(true)}
              />
            )}
          </div>
        )}

        {/* Image Overlay */}
        <AnimatePresence>
          {isExpanded && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black bg-opacity-90 z-50 flex items-center justify-center p-4"
              onClick={handleImageClick}
            >
              {post.mediaType === 'video' ? (
                <motion.video
                  src={post.image}
                  alt="Expanded post video"
                  className="max-w-full max-h-full object-contain rounded-lg"
                  autoPlay
                  loop
                  muted
                  playsInline
                  initial={{ scale: 0.8 }}
                  animate={{ scale: 1 }}
                  exit={{ scale: 0.8 }}
                />
              ) : (
                <motion.img
                  src={post.image}
                  alt="Expanded post image"
                  className="max-w-full max-h-full object-contain rounded-lg"
                  initial={{ scale: 0.8 }}
                  animate={{ scale: 1 }}
                  exit={{ scale: 0.8 }}
                />
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
};

export default PostCard;
