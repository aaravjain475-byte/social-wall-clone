const express = require('express');
const cors = require('cors');
const fs = require('fs');
const path = require('path');
const { v4: uuidv4 } = require('uuid');

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors());
app.use(express.json());
app.use('/scraped_images', express.static(path.join(__dirname, 'scraped_images')));

// Mock data storage
let posts = [];
let connections = new Set();

// Function to parse date from filename
const parseDateFromFilename = (filename) => {
  const match = filename.match(/post_(\d{4})(\d{2})(\d{2})_/);
  if (match) {
    const [, year, month, day] = match;
    return new Date(`${year}-${month}-${day}`);
  }
  return new Date(0); // Default to earliest date if no match
};

// Function to read and parse scraped files
const loadScrapedPosts = async () => {
  try {
    const scrapedDir = path.join(__dirname, 'scraped_images');
    const files = fs.readdirSync(scrapedDir);
    
    // Group files by basename
    const fileGroups = {};
    files.forEach(file => {
      const ext = path.extname(file);
      const basename = path.basename(file, ext);
      
      if (!fileGroups[basename]) {
        fileGroups[basename] = {};
      }
      fileGroups[basename][ext] = file;
    });
    
    // Create posts from grouped files
    const scrapedPosts = [];
    
    Object.keys(fileGroups).forEach(basename => {
      const group = fileGroups[basename];
      
      if (group['.jpg'] && group['.txt']) {
        const imagePath = `/scraped_images/${group['.jpg']}`;
        const textPath = path.join(scrapedDir, group['.txt']);
        
        try {
          const content = fs.readFileSync(textPath, 'utf8');
          const fileDate = parseDateFromFilename(basename);
          
          const post = {
            id: uuidv4(),
            platform: 'instagram', // Default platform
            username: 'conquest', // Updated username
            content: content.trim(),
            avatar: `https://picsum.photos/seed/conquest/100/100.jpg`, // Temporary placeholder
            image: imagePath,
            likes: Math.floor(Math.random() * 1000) + 10,
            comments: Math.floor(Math.random() * 100) + 1,
            shares: Math.floor(Math.random() * 50) + 1,
            timestamp: fileDate.toISOString(),
            basename: basename // Store basename for reference
          };
          
          scrapedPosts.push(post);
        } catch (error) {
          console.error(`Error reading text file ${textPath}:`, error);
        }
      }
    });
    
    // Sort posts by date (newest first)
    scrapedPosts.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
    
    console.log(`Loaded ${scrapedPosts.length} posts from scraped_images folder`);
    return scrapedPosts;
    
  } catch (error) {
    console.error('Error loading scraped posts:', error);
    return [];
  }
};

// Initialize posts with scraped data
const initializePosts = async () => {
  posts = await loadScrapedPosts();
  
  // If no scraped posts, generate mock data as fallback
  if (posts.length === 0) {
    console.log('No scraped posts found, generating mock data...');
    posts = generateMockPosts(20);
  }
};

// Mock data generation (fallback)
const generateMockPosts = (count = 20) => {
  const mockPosts = [];
  const sampleTexts = [
    "Just launched our new product! So excited to share this with everyone. #innovation #tech",
    "Beautiful sunset today. Sometimes you need to pause and appreciate the little things in life. #sunset #nature",
    "Working on something amazing! Can't wait to show you all what we've been building. #startup #entrepreneur",
    "Coffee and code - the perfect combination for a productive morning! #programming #developer",
    "Amazing team meeting today. Great ideas flowing and exciting projects ahead! #teamwork #success"
  ];
  
  const sampleUsernames = [
    "TechInnovator", "CreativeMind", "BusinessGuru", "DigitalNomad", "StartupFounder",
    "CodeMaster", "DesignThinker", "DataScientist", "ProductManager", "MarketingExpert"
  ];
  
  const platforms = ['instagram', 'twitter', 'facebook', 'linkedin'];
  
  for (let i = 0; i < count; i++) {
    const platform = platforms[Math.floor(Math.random() * platforms.length)];
    const username = sampleUsernames[Math.floor(Math.random() * sampleUsernames.length)];
    const content = sampleTexts[Math.floor(Math.random() * sampleTexts.length)];
    const hasImage = Math.random() > 0.3;
    
    const newPost = {
      id: uuidv4(),
      platform,
      username: 'conquest', // Use conquest for all mock posts
      content,
      avatar: `https://picsum.photos/seed/conquest-${i}/100/100.jpg`,
      image: hasImage ? `https://picsum.photos/seed/post-${i}/400/${200 + Math.floor(Math.random() * 200)}.jpg` : null,
      likes: Math.floor(Math.random() * 1000) + 10,
      comments: Math.floor(Math.random() * 100) + 1,
      shares: Math.floor(Math.random() * 50) + 1,
      timestamp: new Date(Date.now() - Math.random() * 24 * 60 * 60 * 1000).toISOString()
    };
    mockPosts.push(newPost);
  }
  return mockPosts;
};

// WebSocket-like simulation for real-time updates
const sendUpdateToAll = (update) => {
  connections.forEach(connection => {
    if (connection.res && !connection.res.writableEnded) {
      connection.res.write(`data: ${JSON.stringify(update)}\n\n`);
    }
  });
};

// API Routes
app.get('/api/posts', (req, res) => {
  const { page = 1, limit = 20, platform = 'all' } = req.query;
  
  let filteredPosts = posts;
  if (platform !== 'all') {
    filteredPosts = posts.filter(post => post.platform === platform);
  }
  
  const startIndex = (page - 1) * limit;
  const endIndex = startIndex + parseInt(limit);
  const paginatedPosts = filteredPosts.slice(startIndex, endIndex);
  
  res.json({
    posts: paginatedPosts,
    pagination: {
      page: parseInt(page),
      limit: parseInt(limit),
      total: filteredPosts.length,
      pages: Math.ceil(filteredPosts.length / limit)
    }
  });
});

app.get('/api/posts/:id', (req, res) => {
  const post = posts.find(p => p.id === req.params.id);
  if (!post) {
    return res.status(404).json({ error: 'Post not found' });
  }
  res.json(post);
});

app.post('/api/posts/:id/like', (req, res) => {
  const post = posts.find(p => p.id === req.params.id);
  if (!post) {
    return res.status(404).json({ error: 'Post not found' });
  }
  
  post.likes += 1;
  
  sendUpdateToAll({
    type: 'post_updated',
    data: post
  });
  
  res.json({ likes: post.likes });
});

app.post('/api/posts/:id/comment', (req, res) => {
  const post = posts.find(p => p.id === req.params.id);
  if (!post) {
    return res.status(404).json({ error: 'Post not found' });
  }
  
  post.comments += 1;
  
  sendUpdateToAll({
    type: 'post_updated',
    data: post
  });
  
  res.json({ comments: post.comments });
});

app.get('/api/analytics', (req, res) => {
  const totalPosts = posts.length;
  const totalEngagement = posts.reduce((sum, post) => sum + post.likes + post.comments + post.shares, 0);
  
  const platforms = ['instagram', 'twitter', 'facebook', 'linkedin'];
  const platformStats = platforms.map(platform => ({
    platform,
    posts: posts.filter(p => p.platform === platform).length,
    engagement: posts.filter(p => p.platform === platform).reduce((sum, post) => sum + post.likes + post.comments + post.shares, 0)
  }));
  
  res.json({
    totalPosts,
    totalEngagement,
    platformStats,
    engagementRate: ((totalEngagement / totalPosts) / 10).toFixed(2)
  });
});

// Server-Sent Events for real-time updates
app.get('/api/events', (req, res) => {
  res.writeHead(200, {
    'Content-Type': 'text/event-stream',
    'Cache-Control': 'no-cache',
    'Connection': 'keep-alive',
    'Access-Control-Allow-Origin': '*'
  });
  
  const connection = { req, res };
  connections.add(connection);
  
  // Send initial data
  res.write(`data: ${JSON.stringify({ type: 'connected', message: 'Connected to real-time updates' })}\n\n`);
  
  // Remove connection on disconnect
  req.on('close', () => {
    connections.delete(connection);
  });
  
  // Send periodic heartbeat
  const heartbeat = setInterval(() => {
    if (!res.writableEnded) {
      res.write(`data: ${JSON.stringify({ type: 'heartbeat', timestamp: new Date().toISOString() })}\n\n`);
    } else {
      clearInterval(heartbeat);
    }
  }, 30000);
});

// Health check
app.get('/api/health', (req, res) => {
  res.json({ 
    status: 'ok', 
    timestamp: new Date().toISOString(),
    connections: connections.size,
    posts: posts.length
  });
});

// Error handling
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Something went wrong!' });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({ error: 'Route not found' });
});

// Start server
app.listen(PORT, async () => {
  console.log(`Social Wall API server running on port ${PORT}`);
  console.log(`Health check: http://localhost:${PORT}/api/health`);
  console.log(`Real-time events: http://localhost:${PORT}/api/events`);
  
  // Initialize posts when server starts
  await initializePosts();
});
