import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const Header = ({
  layout,
  filter,
  onLayoutChange,
  onFilterChange,
  isPaused,
  onPauseToggle,
  onRefresh,
  postCount
}) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const layoutOptions = [
    { id: 'masonry', icon: 'th', label: 'Masonry' },
    { id: 'grid', icon: 'grid', label: 'Grid' },
    { id: 'list', icon: 'list', label: 'List' }
  ];

  const filterOptions = [
    { id: 'all', icon: 'globe', label: 'All', color: 'text-gray-400' },
    { id: 'instagram', icon: 'camera', label: 'Instagram', color: 'text-pink-500' },
    { id: 'twitter', icon: 'twitter', label: 'Twitter', color: 'text-blue-400' },
    { id: 'facebook', icon: 'facebook', label: 'Facebook', color: 'text-blue-600' },
    { id: 'linkedin', icon: 'linkedin', label: 'LinkedIn', color: 'text-blue-700' }
  ];

  return (
    <motion.header
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      className="bg-black border-b border-gray-800 sticky top-0 z-50 backdrop-blur-xs bg-opacity-90"
    >
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          {/* Logo/Brand */}
          <motion.div
            className="flex items-center space-x-3"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <div className="w-10 h-10 bg-gradient-to-br from-purple-600 to-pink-600 rounded-lg flex items-center justify-center">
              <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
              </svg>
            </div>
            <div>
              <h1 className="text-xl font-bold text-white">Social Wall</h1>
              <p className="text-xs text-gray-400">Live Social Media Feed</p>
            </div>
          </motion.div>

          {/* Desktop Controls */}
          <div className="hidden lg:flex items-center space-x-6">
            {/* Layout Options */}
            <div className="flex items-center space-x-2 bg-gray-900 rounded-lg p-1">
              {layoutOptions.map(option => (
                <motion.button
                  key={option.id}
                  onClick={() => onLayoutChange(option.id)}
                  className={`px-3 py-2 rounded-md text-sm font-medium transition-all ${
                    layout === option.id
                      ? 'bg-white text-black'
                      : 'text-gray-400 hover:text-white'
                  }`}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                    {option.icon === 'th' && (
                      <path d="M3 3h8v8H3zm10 0h8v8h-8zM3 13h8v8H3zm10 0h8v8h-8z"/>
                    )}
                    {option.icon === 'grid' && (
                      <path d="M3 3h6v6H3zm8 0h6v6h-6zM3 11h6v6H3zm8 0h6v6h-6z"/>
                    )}
                    {option.icon === 'list' && (
                      <path d="M3 4h18v2H3zm0 7h18v2H3zm0 7h18v2H3z"/>
                    )}
                  </svg>
                </motion.button>
              ))}
            </div>

            {/* Filter Options */}
            <div className="flex items-center space-x-2">
              {filterOptions.map(option => (
                <motion.button
                  key={option.id}
                  onClick={() => onFilterChange(option.id)}
                  className={`px-3 py-2 rounded-lg text-sm font-medium transition-all ${
                    filter === option.id
                      ? 'bg-gray-800 text-white'
                      : 'text-gray-600 hover:text-white hover:bg-gray-800'
                  }`}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <span className={option.color}>
                    {option.label}
                  </span>
                </motion.button>
              ))}
            </div>

            {/* Action Buttons */}
            <div className="flex items-center space-x-3">
              <motion.button
                onClick={onRefresh}
                className="p-2 text-gray-400 hover:text-white hover:bg-gray-800 rounded-lg transition-all"
                whileHover={{ rotate: 180 }}
                transition={{ duration: 0.3 }}
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                </svg>
              </motion.button>

              <motion.button
                onClick={onPauseToggle}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
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
            </div>

            {/* Post Count */}
            <div className="text-sm text-gray-400">
              <span className="font-medium text-white">{postCount}</span> posts
            </div>
          </div>

          {/* Mobile Menu Button */}
          <motion.button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="lg:hidden p-2 text-gray-400 hover:text-white"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </motion.button>
        </div>

        {/* Mobile Menu */}
        <AnimatePresence>
          {isMenuOpen && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="lg:hidden mt-4 border-t border-gray-800 pt-4"
            >
              <div className="space-y-4">
                {/* Mobile Layout Options */}
                <div>
                  <p className="text-sm text-gray-400 mb-2">Layout</p>
                  <div className="flex space-x-2">
                    {layoutOptions.map(option => (
                      <motion.button
                        key={option.id}
                        onClick={() => {
                          onLayoutChange(option.id);
                          setIsMenuOpen(false);
                        }}
                        className={`px-3 py-2 rounded-md text-sm font-medium transition-all ${
                          layout === option.id
                            ? 'bg-white text-black'
                            : 'text-gray-400 hover:text-white bg-gray-900'
                        }`}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                      >
                        {option.label}
                      </motion.button>
                    ))}
                  </div>
                </div>

                {/* Mobile Filter Options */}
                <div>
                  <p className="text-sm text-gray-400 mb-2">Filter</p>
                  <div className="grid grid-cols-2 gap-2">
                    {filterOptions.map(option => (
                      <motion.button
                        key={option.id}
                        onClick={() => {
                          onFilterChange(option.id);
                          setIsMenuOpen(false);
                        }}
                        className={`px-3 py-2 rounded-lg text-sm font-medium transition-all ${
                          filter === option.id
                            ? 'bg-gray-800 text-white'
                            : 'text-gray-600 hover:text-white hover:bg-gray-800'
                        }`}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                      >
                        <span className={option.color}>
                          {option.label}
                        </span>
                      </motion.button>
                    ))}
                  </div>
                </div>

                {/* Mobile Action Buttons */}
                <div className="flex justify-between items-center pt-4 border-t border-gray-800">
                  <motion.button
                    onClick={() => {
                      onRefresh();
                      setIsMenuOpen(false);
                    }}
                    className="px-4 py-2 bg-gray-800 text-white rounded-lg hover:bg-gray-700 transition-all"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    Refresh
                  </motion.button>

                  <motion.button
                    onClick={() => {
                      onPauseToggle();
                      setIsMenuOpen(false);
                    }}
                    className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                      isPaused
                        ? 'bg-green-600 hover:bg-green-700 text-white'
                        : 'bg-red-600 hover:bg-red-700 text-white'
                    }`}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    {isPaused ? 'Resume' : 'Pause'}
                  </motion.button>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.header>
  );
};

export default Header;
