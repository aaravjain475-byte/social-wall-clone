import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import PostCard from './components/PostCard';
import LoadingSkeleton from './components/LoadingSkeleton';
import { generateMockPosts } from './utils/mockData';
import { useInfiniteScroll } from './hooks/useInfiniteScroll';
import { useAutoRefresh } from './hooks/useAutoRefresh';
import { useAutoScroll } from './hooks/useAutoScroll';

function App() {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedPost, setSelectedPost] = useState(null);
  const [isPaused, setIsPaused] = useState(false);
  const containerRef = useRef(null);

  // Load initial posts
  useEffect(() => {
    loadInitialPosts();
  }, []);

  // Auto popup functionality - always enabled
  useEffect(() => {
    if (posts.length === 0) return;

    const popupInterval = setInterval(() => {
      // Select a random post
      const randomIndex = Math.floor(Math.random() * posts.length);
      const randomPost = posts[randomIndex];
      
      // Show the popup
      setSelectedPost(randomPost);
      
      // Hide after 10 seconds
      const hideTimeout = setTimeout(() => {
        setSelectedPost(null);
      }, 10000); // 10 seconds
      
      return () => clearTimeout(hideTimeout);
    }, 15000); // 10 seconds display + 5 seconds delay = 15 seconds total cycle

    return () => clearInterval(popupInterval);
  }, [posts]);

  const loadInitialPosts = async () => {
    try {
      setLoading(true);
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      const initialPosts = generateMockPosts(20);
      setPosts(initialPosts);
      setLoading(false);
    } catch (err) {
      setError('Failed to load posts');
      setLoading(false);
    }
  };

  // Infinite scroll
  const loadMorePosts = async () => {
    if (loading || isPaused) return;
    
    try {
      setLoading(true);
      await new Promise(resolve => setTimeout(resolve, 800));
      const newPosts = generateMockPosts(10, posts.length);
      setPosts(prev => [...prev, ...newPosts]);
      setLoading(false);
    } catch (err) {
      setError('Failed to load more posts');
      setLoading(false);
    }
  };

  // Auto refresh
  const refreshPosts = async () => {
    if (isPaused) return;
    
    try {
      const newPosts = generateMockPosts(5, posts.length);
      setPosts(prev => [ ...newPosts, ...prev.slice(0, -5) ]);
    } catch (err) {
      console.error('Failed to refresh posts:', err);
    }
  };

  // Custom hooks
  const { lastElementRef } = useInfiniteScroll(loadMorePosts, loading);
  const { containerRef: autoScrollRef, handleMouseEnter, handleMouseLeave } = useAutoScroll(true, 0.25);

  // No filtering - show all posts
  const filteredPosts = posts;

  const handlePostClick = (post) => {
    setSelectedPost(post);
  };

  const handleCloseModal = () => {
    setSelectedPost(null);
  };

  const handlePauseToggle = () => {
    setIsPaused(!isPaused);
  };

  if (error) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-white mb-4">Oops! Something went wrong</h2>
          <p className="text-gray-400 mb-6">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      <main 
        className="container mx-auto px-4 py-8 overflow-hidden" 
        ref={autoScrollRef}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        style={{ height: 'calc(100vh - 50px)', overflowY: 'hidden' }}
      >
        <AnimatePresence>
          <MasonryLayout posts={filteredPosts} loading={loading} lastElementRef={lastElementRef} onPostClick={handlePostClick} />
        </AnimatePresence>
      </main>

      {/* Post Modal */}
      <AnimatePresence>
        {selectedPost && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black bg-opacity-90 z-50 flex items-center justify-center p-0"
            onClick={handleCloseModal}
          >
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              className="bg-white rounded-xl max-w-7xl w-full max-h-[98vh] overflow-y-auto"
              onClick={(e) => e.stopPropagation()}
            >
              <PostModal post={selectedPost} onClose={handleCloseModal} />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

// Post Modal Component - Simple split layout
const PostModal = ({ post, onClose }) => {
  const [contentHeight, setContentHeight] = useState(0);
  const [needsScroll, setNeedsScroll] = useState(false);
  const contentRef = useRef(null);

  useEffect(() => {
    if (contentRef.current) {
      const scrollHeight = contentRef.current.scrollHeight;
      const clientHeight = contentRef.current.clientHeight;
      setContentHeight(scrollHeight);
      setNeedsScroll(scrollHeight > clientHeight);
    }
  }, [post]);

  // Calculate dynamic dimensions based on text content with no padding
  const calculateDynamicDimensions = () => {
    if (contentRef.current) {
      const scrollWidth = contentRef.current.scrollWidth;
      const scrollHeight = contentRef.current.scrollHeight;
      const headerHeight = 50; // Minimal header height
      const padding = 8; // No padding (p-0 = 0px * 2)
      const effectiveWidth = Math.min(Math.max(scrollWidth + padding + 5, 200), 300); // Min 200px, max 300px
      const effectiveHeight = Math.min(Math.max(scrollHeight + headerHeight + padding, 120), 400); // Min 120px, max 400px
      return { width: effectiveWidth, height: effectiveHeight };
    }
    return { width: 250, height: 300 }; // Fallback dimensions
  };

  const dynamicDimensions = calculateDynamicDimensions();

  return (
    <div className="relative">
      {/* Close Button */}
      <button
        onClick={onClose}
        className="absolute top-4 right-4 z-10 p-2 bg-black bg-opacity-50 text-white rounded-full hover:bg-opacity-70 transition-all"
      >
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
        </svg>
      </button>

      {/* Split Layout - Left Image, Right Content */}
      <div className="flex" style={{ height: `${dynamicDimensions.height}px` }}>
        {/* Left Side - Image */}
        <div className="bg-gray-100 p-0" style={{ width: `${(dynamicDimensions.height * 4) / 5}px` }}>
          {post.image ? (
            <img
              src={post.image}
              alt="Post image"
              className="w-full h-full object-contain"
            />
          ) : (
            <div className="text-gray-400 text-center">
              <p>No image available</p>
            </div>
          )}
        </div>

        {/* Right Side - Content */}
        <div className="bg-white p-0 flex flex-col" style={{ width: `${dynamicDimensions.width}px`, height: `${dynamicDimensions.height}px` }}>
          {/* Header */}
          <div className="flex items-center mb-2">
            <img
              src={post.avatar}
              alt={post.username}
              className="w-10 h-10 rounded-full object-cover mr-2"
            />
            <div>
              <h3 className="font-semibold text-gray-900 text-sm">{post.username}</h3>
              <div className="flex items-center space-x-1">
                <span className="text-xs text-gray-500">{post.platform}</span>
                <span className="text-xs text-gray-500">
                  {new Date(post.timestamp).toLocaleDateString()}
                </span>
              </div>
            </div>
          </div>

          {/* Content with Conditional Auto-scroll */}
          <div className="flex-1 overflow-hidden">
            <div 
              ref={contentRef}
              className="h-full"
              style={{
                overflow: 'hidden',
                animation: needsScroll ? 'scroll 20s linear infinite' : 'none'
              }}
            >
              <p className="text-gray-800 text-base leading-relaxed whitespace-pre-wrap">
                {post.content}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Add CSS for auto-scroll animation */}
      <style jsx>{`
        @keyframes scroll {
          0% { transform: translateY(0); }
          100% { transform: translateY(-50%); }
        }
      `}</style>
    </div>
  );
};

// Masonry Layout Component
const MasonryLayout = ({ posts, loading, lastElementRef, onPostClick }) => (
  <div className="masonry-grid">
    <AnimatePresence>
      {posts.map((post, index) => (
        <motion.div
          key={post.id}
          ref={index === posts.length - 1 ? lastElementRef : null}
          className="masonry-item"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.8 }}
          transition={{ duration: 0.5, delay: index * 0.1 }}
        >
          <PostCard post={post} layout="masonry" onClick={() => onPostClick(post)} />
        </motion.div>
      ))}
    </AnimatePresence>
    {loading && <LoadingSkeleton layout="masonry" />}
  </div>
);

export default App;
