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
  useAutoRefresh(refreshPosts, 10000); // Refresh every 10 seconds
  const { containerRef: autoScrollRef, handleMouseEnter, handleMouseLeave } = useAutoScroll(!isPaused, 0.2);

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
      {/* Floating Pause Button */}
      <motion.button
        onClick={handlePauseToggle}
        className={`fixed top-4 right-4 z-40 px-4 py-2 rounded-lg text-sm font-medium transition-all ${
          isPaused
            ? 'bg-green-600 hover:bg-green-700 text-white'
            : 'bg-red-600 hover:bg-red-700 text-white'
        }`}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
      >
        {isPaused ? (
          <>
            <svg className="w-4 h-4 inline-block mr-2" fill="currentColor" viewBox="0 0 24 24">
              <path d="M8 5v14l11-7z"/>
            </svg>
            Resume
          </>
        ) : (
          <>
            <svg className="w-4 h-4 inline-block mr-2" fill="currentColor" viewBox="0 0 24 24">
              <path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z"/>
            </svg>
            Pause
          </>
        )}
      </motion.button>
      
      <main 
        className="container mx-auto px-4 py-8 overflow-hidden" 
        ref={autoScrollRef}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        style={{ height: 'calc(100vh - 100px)', overflowY: 'hidden' }}
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
            className="fixed inset-0 bg-black bg-opacity-90 z-50 flex items-center justify-center p-4"
            onClick={handleCloseModal}
          >
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              className="bg-white rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto"
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

// Post Modal Component
const PostModal = ({ post, onClose }) => {
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

      {/* Post Content */}
      <div className="p-6">
        {/* Header */}
        <div className="flex items-center mb-4">
          <img
            src={post.avatar}
            alt={post.username}
            className="w-12 h-12 rounded-full object-cover mr-3"
          />
          <div>
            <h3 className="font-semibold text-gray-900">{post.username}</h3>
            <p className="text-sm text-gray-500">{post.platform}</p>
          </div>
        </div>

        {/* Content */}
        <div className="mb-4">
          <p className="text-gray-800 leading-relaxed">{post.content}</p>
        </div>

        {/* Image */}
        {post.image && (
          <div className="mb-4">
            <img
              src={post.image}
              alt="Post image"
              className="w-full rounded-lg object-cover"
            />
          </div>
        )}

        {/* Engagement */}
        <div className="flex items-center justify-between pt-4 border-t border-gray-200">
          <div className="flex items-center space-x-4 text-sm text-gray-500">
            <span className="flex items-center">
              <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/>
              </svg>
              {post.likes}
            </span>
            <span className="flex items-center">
              <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
              </svg>
              {post.comments}
            </span>
            <span className="flex items-center">
              <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m9.032 4.026a9.001 9.001 0 01-7.432 0m9.032-4.026A9.001 9.001 0 0112 3c-4.474 0-8.268 3.12-9.032 7.326m0 0A9.001 9.001 0 0012 21c4.474 0 8.268-3.12 9.032-7.326" />
              </svg>
              {post.shares}
            </span>
          </div>
        </div>
      </div>
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
