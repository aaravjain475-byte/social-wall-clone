const express = require('express');
const path = require('path');
const cors = require('cors');
const fs = require('fs');
const { v4: uuidv4 } = require('uuid');
const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, 'dist')));

// API Routes
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// Load posts from scraped_images
const loadPosts = () => {
  const postsDir = path.join(__dirname, 'scraped_images');
  const posts = [];
  
  if (fs.existsSync(postsDir)) {
    const files = fs.readdirSync(postsDir);
    
    files.forEach(file => {
      if (file.startsWith('post_') && file.endsWith('.txt')) {
        const postId = file.replace('.txt', '');
        const txtPath = path.join(postsDir, file);
        const imagePath = path.join(postsDir, postId + '.jpg');
        const videoPath = path.join(postsDir, postId + '.mp4');
        
        try {
          const content = fs.readFileSync(txtPath, 'utf8');
          const lines = content.split('\n');
          
          const post = {
            id: postId,
            username: lines[0] || 'User',
            content: lines[1] || '',
            timestamp: lines[2] || new Date().toISOString(),
            platform: lines[3] || 'instagram',
            likes: parseInt(lines[4]) || Math.floor(Math.random() * 1000) + 100,
            comments: parseInt(lines[5]) || Math.floor(Math.random() * 100) + 10,
            shares: parseInt(lines[6]) || Math.floor(Math.random() * 50) + 5,
            avatar: '/conquest_logo.png'
          };
          
          // Check for image or video
          if (fs.existsSync(imagePath)) {
            post.image = `/scraped_images/${postId}.jpg`;
            post.mediaType = 'image';
          } else if (fs.existsSync(videoPath)) {
            post.image = `/scraped_images/${postId}.mp4`;
            post.mediaType = 'video';
          }
          
          posts.push(post);
        } catch (error) {
          console.error(`Error reading ${file}:`, error);
        }
      }
    });
  }
  
  return posts.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
};

app.get('/api/posts', (req, res) => {
  try {
    const posts = loadPosts();
    res.json(posts);
  } catch (error) {
    res.status(500).json({ error: 'Failed to load posts' });
  }
});

// Serve the React app for all other routes
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'dist', 'index.html'));
});

// Start server
app.listen(PORT, () => {
  console.log(`Social wall server running on port ${PORT}`);
  console.log(`Environment: ${process.env.NODE_ENV || 'development'}`);
});
