import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import PostCard from './components/PostCard';
import LoadingSkeleton from './components/LoadingSkeleton';
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

    // Initial 3-second delay before first popup
    const initialTimeout = setTimeout(() => {
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
      }, 5000); // 5 seconds between popups

      return () => clearInterval(popupInterval);
    }, 3000); // 3 second initial delay

    return () => clearTimeout(initialTimeout);
  }, [posts]);

  const loadInitialPosts = async () => {
    try {
      setLoading(true);
      const response = await fetch('http://localhost:3001/api/posts');
      const data = await response.json();
      setPosts(data.posts);
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
      const response = await fetch(`http://localhost:3001/api/posts?page=${Math.floor(posts.length / 20) + 1}`);
      const data = await response.json();
      setPosts(prev => [...prev, ...data.posts]);
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
      const response = await fetch('http://localhost:3001/api/posts');
      const data = await response.json();
      setPosts(data.posts);
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
    <div className="min-h-screen bg-black">
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
              className="bg-gray-900 rounded-xl max-w-7xl w-full max-h-[98vh] overflow-y-auto"
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
      <div className="flex" style={{ height: '800px' }}>
        {/* Left Side - Image or Video */}
        <div className="flex-1 bg-gray-800 p-0 flex items-center justify-center">
          {post.image ? (
            post.mediaType === 'video' ? (
              <video
                src={post.image}
                alt="Post video"
                className="w-full h-full object-contain"
                autoPlay
                loop
                muted
                playsInline
              />
            ) : (
              <img
                src={post.image}
                alt="Post image"
                className="w-full h-full object-contain"
              />
            )
          ) : (
            <div className="text-gray-400 text-center">
              <p>No media available</p>
            </div>
          )}
        </div>

        {/* Right Side - Content */}
        <div className="flex-1 bg-gray-900 p-4 flex flex-col" style={{ height: '800px' }}>
          {/* Header */}
          <div className="flex items-center mb-4">
            <img
              src={post.avatar}
              alt={post.username}
              className="w-12 h-12 rounded-full object-cover mr-3"
            />
            <div>
              <h3 className="font-semibold text-white text-xl">{post.username}</h3>
              <div className="flex items-center space-x-2">
                <span className="text-base text-gray-400">{post.platform}</span>
                <span className="text-base text-gray-400">
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
              <p className="text-gray-200 text-lg leading-relaxed whitespace-pre-wrap">
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
  <div className="uniform-grid">
    <AnimatePresence>
      {posts.map((post, index) => (
        <motion.div
          key={post.id}
          ref={index === posts.length - 1 ? lastElementRef : null}
          className="uniform-grid-item"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.8 }}
          transition={{ duration: 0.5, delay: index * 0.1 }}
        >
          <PostCard post={post} layout="uniform" onClick={() => onPostClick(post)} />
        </motion.div>
      ))}
    </AnimatePresence>
    {loading && <LoadingSkeleton layout="uniform" />}
  </div>
);

export default App;
