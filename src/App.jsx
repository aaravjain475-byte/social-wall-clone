import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import PostCard from './components/PostCard';
import LoadingSkeleton from './components/LoadingSkeleton';
import { useInfiniteScroll } from './hooks/useInfiniteScroll';
import { useAutoRefresh } from './hooks/useAutoRefresh';
import { useAutoScroll } from './hooks/useAutoScroll';

function App() {
  const [posts, setPosts] = useState([]);
  const [allPosts, setAllPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedPost, setSelectedPost] = useState(null);
  const [isPaused, setIsPaused] = useState(false);
  const [displayedPosts, setDisplayedPosts] = useState([]);
  const [currentCycle, setCurrentCycle] = useState('initial');
  const containerRef = useRef(null);

  // Load initial posts
  useEffect(() => {
    loadInitialPosts();
  }, []);

  // Auto-popup functionality - play video for entire duration with gaps
  useEffect(() => {
    if (posts.length === 0) return;
    let isActive = true;
    let timeoutId = null;

    const showNextPopup = () => {
      if (!isActive) return;
      const randomIndex = Math.floor(Math.random() * allPosts.length);
      const randomPost = allPosts.length > 0 ? allPosts[randomIndex] : posts[randomIndex];
      setSelectedPost(randomPost);
      
      if (randomPost.mediaType === 'video') {
        const handleVideoEnded = () => {
           if (!isActive) return;
           setSelectedPost(null);
           timeoutId = setTimeout(showNextPopup, 8000);
        };
        window.addEventListener('current-video-ended', handleVideoEnded, { once: true });
      } else {
        timeoutId = setTimeout(() => {
          if (!isActive) return;
          setSelectedPost(null);
          timeoutId = setTimeout(showNextPopup, 8000);
        }, 10000);
      }
    };

    timeoutId = setTimeout(showNextPopup, 3000);

    return () => {
      isActive = false;
      clearTimeout(timeoutId);
    };
  }, [posts.length, allPosts.length]);

  // User interaction handled by existing handlePostClick function
  // Note: Modal system disabled - using tile-based popups instead

  const loadInitialPosts = async () => {
    try {
      setLoading(true);
      const response = await fetch('/posts.json');
      const data = await response.json();
      setAllPosts(data.posts || []);
      const initial = (data.posts || []).slice(0, 20).map((p, i) => ({...p, uniqueId: p.id + '-init-' + i}));
      setPosts(initial);
      setLoading(false);
    } catch (err) {
      setError('Failed to load posts');
      setLoading(false);
    }
  };

  // Infinite scroll (Cyclic)
  const loadMorePosts = async () => {
    if (loading || isPaused || allPosts.length === 0) return;
    
    try {
      setLoading(true);
      setTimeout(() => {
        setPosts(prev => {
          const nextIndex = prev.length % allPosts.length;
          let newChunk = [];
          if (nextIndex + 20 <= allPosts.length) {
            newChunk = allPosts.slice(nextIndex, nextIndex + 20);
          } else {
            newChunk = [
              ...allPosts.slice(nextIndex),
              ...allPosts.slice(0, 20 - (allPosts.length - nextIndex))
            ];
          }
          const chunkWithUniqueIds = newChunk.map((p, i) => ({
            ...p, 
            uniqueId: p.id + '-' + (prev.length + i)
          }));
          return [...prev, ...chunkWithUniqueIds];
        });
        setLoading(false);
      }, 300);
    } catch (err) {
      setError('Failed to load more posts');
      setLoading(false);
    }
  };

  // Auto refresh
  const refreshPosts = async () => {
    if (isPaused) return;
    
    try {
      const response = await fetch('/posts.json');
      const data = await response.json();
      setAllPosts(data.posts || []);
      const currentCount = Math.max(posts.length, 20);
      setPosts((data.posts || []).slice(0, currentCount));
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
    setIsPaused(true);
    setSelectedPost(post);
  };

  const handleCloseModal = () => {
    setSelectedPost(null);
    setIsPaused(false);
    // Unbind any dangling event listners in case closed manually
    const dummyEvent = new Event('current-video-ended');
    window.dispatchEvent(dummyEvent);
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
    <div className="min-h-screen" style={{ backgroundColor: '#111213' }}>
      <main 
        className="container mx-auto px-4 py-8 overflow-hidden" 
        ref={autoScrollRef}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        style={{ height: 'calc(100vh - 50px)', overflowY: 'hidden' }}
      >
        <AnimatePresence>
          <MasonryLayout posts={filteredPosts} loading={loading} lastElementRef={lastElementRef} onPostClick={handlePostClick} layout="masonry" />
        </AnimatePresence>
      </main>

      {/* Post Modal */}
      <AnimatePresence>
        {selectedPost && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5, ease: "easeInOut" }}
            className="fixed inset-0 bg-black bg-opacity-90 z-50 flex items-center justify-center p-0"
            onClick={handleCloseModal}
          >
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              transition={{ duration: 0.4, ease: "easeOut" }}
              className="max-w-7xl w-full max-h-[98vh] overflow-y-auto"
              style={{ 
                backgroundColor: '#111213',
                border: '1px solid #2a2a2a',
                borderRadius: '16px'
              }}
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
  const videoRef = useRef(null);

  useEffect(() => {
    if (contentRef.current) {
      const scrollHeight = contentRef.current.scrollHeight;
      const clientHeight = contentRef.current.clientHeight;
      setContentHeight(scrollHeight);
      setNeedsScroll(scrollHeight > clientHeight);
    }
    
    // Ensure video plays from beginning when modal opens
    if (post.mediaType === 'video' && videoRef.current) {
      const video = videoRef.current;
      video.currentTime = 0;
      
      // Ensure video plays and loops through entire duration
      const playVideo = () => {
        video.play().catch(e => {
          console.log('Video play failed:', e);
        });
      };
      
      // Try to play immediately
      playVideo();
      
      // Also try after a short delay to ensure it's ready
      setTimeout(playVideo, 100);
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
        <div className="flex-1 p-0 flex items-center justify-center" style={{ backgroundColor: '#111213' }}>
          {post.image ? (
            post.mediaType === 'video' ? (
              <video
                ref={videoRef}
                src={post.image}
                alt="Post video"
                className="w-full h-full object-contain"
                style={{ maxHeight: '100%', width: 'auto' }}
                autoPlay
                loop
                muted
                playsInline
                controls={false}
                onEnded={() => window.dispatchEvent(new Event('current-video-ended'))}
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
        <div className="flex-1 p-4 flex flex-col" style={{ backgroundColor: '#111213', height: '800px' }}>
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
const MasonryLayout = ({ posts, loading, lastElementRef, onPostClick, layout }) => (
  <div className="masonry-grid">
    <AnimatePresence>
      {posts.map((post, index) => (
        <motion.div
          key={post.uniqueId || post.id}
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
