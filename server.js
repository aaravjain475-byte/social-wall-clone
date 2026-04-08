const express = require('express');
const cors = require('cors');
const { v4: uuidv4 } = require('uuid');

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors());
app.use(express.json());

// Mock data storage
let posts = [];
let connections = new Set();

// Sample data generation
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

// Generate initial mock posts
const generateMockPosts = (count = 20) => {
  const mockPosts = [];
  for (let i = 0; i < count; i++) {
    const platform = platforms[Math.floor(Math.random() * platforms.length)];
    const username = sampleUsernames[Math.floor(Math.random() * sampleUsernames.length)];
    const content = sampleTexts[Math.floor(Math.random() * sampleTexts.length)];
    const hasImage = Math.random() > 0.3;
    
    const mockPosts = {
      id: uuidv4(),
      platform,
      username,
      content,
      avatar: `https://picsum.photos/seed/${username}-${i}/100/100.jpg`,
      image: hasImage ? `https://picsum.photos/seed/post-${i}/400/${200 + Math.floor(Math.random() * 200)}.jpg` : null,
      likes: Math.floor(Math.random() * 1000) + 10,
      comments: Math.floor(Math.random() * 100) + 1,
      shares: Math.floor(Math.random() * 50) + 1,
      timestamp: new Date(Date.now() - Math.random() * 24 * 60 * 60 * 1000).toISOString()
    };
    mockPosts.push(mockPosts);
  }
  return mockPosts;
};

// Initialize posts
posts = generateMockPosts(50);

// WebSocket-like simulation for real-time updates
const sendUpdateToAll = (update) => {
  connections.forEach(connection => {
    if (connection.res && !connection.res.writableEnded) {
      connection.res.write(`data: ${JSON.stringify(update)}\n\n`);
    }
  });
};

// Generate random updates
setInterval(() => {
  if (connections.size > 0) {
    const platform = platforms[Math.floor(Math.random() * platforms.length)];
    const username = sampleUsernames[Math.floor(Math.random() * sampleUsernames.length)];
    const content = sampleTexts[Math.floor(Math.random() * sampleTexts.length)];
    
    const newPost = {
      id: uuidv4(),
      platform,
      username,
      content,
      avatar: `https://picsum.photos/seed/${username}-${Date.now()}/100/100.jpg`,
      image: Math.random() > 0.3 ? `https://picsum.photos/seed/post-${Date.now()}/400/${200 + Math.floor(Math.random() * 200)}.jpg` : null,
      likes: Math.floor(Math.random() * 1000) + 10,
      comments: Math.floor(Math.random() * 100) + 1,
      shares: Math.floor(Math.random() * 50) + 1,
      timestamp: new Date().toISOString()
    };
    
    posts.unshift(newPost);
    if (posts.length > 100) {
      posts = posts.slice(0, 100);
    }
    
    sendUpdateToAll({
      type: 'new_post',
      data: newPost
    });
  }
}, 10000); // Every 10 seconds

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

app.listen(PORT, () => {
  console.log(`Social Wall API server running on port ${PORT}`);
  console.log(`Health check: http://localhost:${PORT}/api/health`);
  console.log(`Real-time events: http://localhost:${PORT}/api/events`);
});
