import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Header from './components/Header';
import PostCard from './components/PostCard';
import LoadingSkeleton from './components/LoadingSkeleton';
import { generateMockPosts } from './utils/mockData';
import { useInfiniteScroll } from './hooks/useInfiniteScroll';
import { useAutoRefresh } from './hooks/useAutoRefresh';

function App() {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [layout, setLayout] = useState('masonry'); // masonry, grid, list
  const [filter, setFilter] = useState('all'); // all, instagram, twitter, facebook, linkedin
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

  // Filter posts
  const filteredPosts = posts.filter(post => {
    if (filter === 'all') return true;
    return post.platform.toLowerCase() === filter;
  });

  const handleLayoutChange = (newLayout) => {
    setLayout(newLayout);
  };

  const handleFilterChange = (newFilter) => {
    setFilter(newFilter);
  };

  const handlePauseToggle = () => {
    setIsPaused(!isPaused);
  };

  const handleRefresh = () => {
    loadInitialPosts();
  };

  if (error) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-white mb-4">Oops! Something went wrong</h2>
          <p className="text-gray-400 mb-6">{error}</p>
          <button
            onClick={handleRefresh}
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
      <Header
        layout={layout}
        filter={filter}
        onLayoutChange={handleLayoutChange}
        onFilterChange={handleFilterChange}
        isPaused={isPaused}
        onPauseToggle={handlePauseToggle}
        onRefresh={handleRefresh}
        postCount={filteredPosts.length}
      />
      
      <main className="container mx-auto px-4 py-8" ref={containerRef}>
        <AnimatePresence>
          {layout === 'masonry' ? (
            <MasonryLayout posts={filteredPosts} loading={loading} lastElementRef={lastElementRef} />
          ) : layout === 'grid' ? (
            <GridLayout posts={filteredPosts} loading={loading} lastElementRef={lastElementRef} />
          ) : (
            <ListLayout posts={filteredPosts} loading={loading} lastElementRef={lastElementRef} />
          )}
        </AnimatePresence>
      </main>
    </div>
  );
}

// Masonry Layout Component
const MasonryLayout = ({ posts, loading, lastElementRef }) => (
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
          <PostCard post={post} layout="masonry" />
        </motion.div>
      ))}
    </AnimatePresence>
    {loading && <LoadingSkeleton layout="masonry" />}
  </div>
);

// Grid Layout Component
const GridLayout = ({ posts, loading, lastElementRef }) => (
  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
    <AnimatePresence>
      {posts.map((post, index) => (
        <motion.div
          key={post.id}
          ref={index === posts.length - 1 ? lastElementRef : null}
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.8 }}
          transition={{ duration: 0.3, delay: index * 0.05 }}
        >
          <PostCard post={post} layout="grid" />
        </motion.div>
      ))}
    </AnimatePresence>
    {loading && <LoadingSkeleton layout="grid" />}
  </div>
);

// List Layout Component
const ListLayout = ({ posts, loading, lastElementRef }) => (
  <div className="space-y-4 max-w-4xl mx-auto">
    <AnimatePresence>
      {posts.map((post, index) => (
        <motion.div
          key={post.id}
          ref={index === posts.length - 1 ? lastElementRef : null}
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: 20 }}
          transition={{ duration: 0.3, delay: index * 0.05 }}
        >
          <PostCard post={post} layout="list" />
        </motion.div>
      ))}
    </AnimatePresence>
    {loading && <LoadingSkeleton layout="list" />}
  </div>
);

export default App;
