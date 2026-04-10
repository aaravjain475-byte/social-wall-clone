const fs = require('fs');
const path = require('path');
const { v4: uuidv4 } = require('uuid');

const parseDateFromFilename = (filename) => {
  const match = filename.match(/post_(\d{4})(\d{2})(\d{2})_/);
  if (match) {
    const [, year, month, day] = match;
    return new Date(`${year}-${month}-${day}`);
  }
  return new Date(0);
};

const loadScrapedPosts = () => {
  try {
    const scrapedDir = path.join(__dirname, '../public/scraped_images');
    if (!fs.existsSync(scrapedDir)) {
      return [];
    }
    const files = fs.readdirSync(scrapedDir);
    
    const fileGroups = {};
    files.forEach(file => {
      const ext = path.extname(file);
      const basename = path.basename(file, ext);
      if (!fileGroups[basename]) {
        fileGroups[basename] = {};
      }
      fileGroups[basename][ext] = file;
    });
    
    const scrapedPosts = [];
    Object.keys(fileGroups).forEach(basename => {
      const group = fileGroups[basename];
      if ((group['.jpg'] || group['.png'] || group['.mp4']) && group['.txt']) {
        let mediaPath;
        let mediaType;
        
        if (group['.mp4']) {
          mediaPath = `/scraped_images/${group['.mp4']}`;
          mediaType = 'video';
        } else if (group['.jpg']) {
          mediaPath = `/scraped_images/${group['.jpg']}`;
          mediaType = 'image';
        } else if (group['.png']) {
          mediaPath = `/scraped_images/${group['.png']}`;
          mediaType = 'image';
        }
        
        const textPath = path.join(scrapedDir, group['.txt']);
        try {
          const content = fs.readFileSync(textPath, 'utf8');
          const fileDate = parseDateFromFilename(basename);
          
          const post = {
            id: uuidv4(),
            platform: 'instagram',
            username: 'conquest',
            content: content.trim(),
            avatar: '/scraped_images/conquest_logo.png',
            image: mediaPath,
            mediaType: mediaType,
            likes: Math.floor(Math.random() * 1000) + 10,
            comments: Math.floor(Math.random() * 100) + 1,
            shares: Math.floor(Math.random() * 50) + 1,
            timestamp: fileDate.toISOString(),
            basename: basename
          };
          scrapedPosts.push(post);
        } catch (error) {
          console.error(`Error reading text file ${textPath}:`, error);
        }
      }
    });
    
    scrapedPosts.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
    return scrapedPosts;
    
  } catch (error) {
    console.error('Error loading scraped posts:', error);
    return [];
  }
};

const generateMockPosts = (count = 20) => {
  const mockPosts = [];
  const sampleTexts = [
    "Just launched our new product! So excited to share this with everyone.",
    "Beautiful sunset today. Sometimes you need to pause.",
    "Working on something amazing! Can't wait to show you all.",
    "Coffee and code - the perfect combination for a productive morning!",
    "Amazing team meeting today."
  ];
  const sampleUsernames = ["TechInnovator", "CreativeMind", "StartupFounder"];
  const platforms = ['instagram', 'twitter', 'facebook', 'linkedin'];
  
  for (let i = 0; i < count; i++) {
    const platform = platforms[Math.floor(Math.random() * platforms.length)];
    const username = sampleUsernames[Math.floor(Math.random() * sampleUsernames.length)];
    const content = sampleTexts[Math.floor(Math.random() * sampleTexts.length)];
    const hasImage = Math.random() > 0.3;
    
    mockPosts.push({
      id: uuidv4(),
      platform,
      username: 'conquest',
      content,
      avatar: '/scraped_images/conquest_logo.png',
      image: hasImage ? `https://picsum.photos/seed/post-${i}/400/${200 + Math.floor(Math.random() * 200)}.jpg` : null,
      likes: Math.floor(Math.random() * 1000) + 10,
      comments: Math.floor(Math.random() * 100) + 1,
      shares: Math.floor(Math.random() * 50) + 1,
      timestamp: new Date(Date.now() - Math.random() * 24 * 60 * 60 * 1000).toISOString()
    });
  }
  return mockPosts;
};

const run = () => {
  let posts = loadScrapedPosts();
  if (posts.length === 0) {
    posts = generateMockPosts(20);
  }
  
  const publicDir = path.join(__dirname, '../public');
  if (!fs.existsSync(publicDir)) {
    fs.mkdirSync(publicDir);
  }
  
  fs.writeFileSync(path.join(publicDir, 'posts.json'), JSON.stringify({ posts }, null, 2));
  console.log(`Generated posts.json with ${posts.length} posts`);
};

run();
