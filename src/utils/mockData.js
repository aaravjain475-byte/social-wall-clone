import { v4 as uuidv4 } from 'uuid';

const sampleTexts = [
  "🎬 NEW REEL ALERT! Just dropped this amazing Instagram reel showing my morning routine. Watch till the end for the surprise transition! This is how content creators really start their day... #reel #instagram #morningroutine",
  "Just launched our new product! So excited to share this with everyone. #innovation #tech",
  "Beautiful sunset today. Sometimes you need to pause and appreciate the little things in life. #sunset #nature",
  "Working on something amazing! Can't wait to show you all what we've been building. #startup #entrepreneur",
  "Coffee and code - the perfect combination for a productive morning! #programming #developer",
  "Amazing team meeting today. Great ideas flowing and exciting projects ahead! #teamwork #success",
  "Weekend vibes! Time to recharge and get ready for another productive week. #weekend #relax",
  "Just completed a marathon! The feeling of accomplishment is incredible. #fitness #achievement",
  "New blog post is live! Sharing my thoughts on the future of technology. #blog #tech",
  "Beautiful weather for outdoor activities. Making the most of this amazing day! #outdoors #active",
  "Grateful for all the support from our community. You guys are amazing! #gratitude #community",
  "Just launched our new product! 🚀 So excited to share this with everyone. The response has been incredible!",
  "Beautiful sunset from my office window today. Sometimes it's the little things that make the day special.",
  "Working on something big... 🤫 Can't wait to show you all what we've been building. Stay tuned!",
  "Coffee and code - the perfect combination for a productive Sunday morning ☕💻",
  "Just hit our 10k follower milestone! Thank you all for the amazing support and engagement!",
  "New reel alert! 🎬 Check out this amazing transition I discovered. What do you think?",
  "Behind the scenes of our latest photoshoot. The team worked so hard on this one! 📸",
  "Video content is changing the game! Here's my latest reel showing my morning routine.",
  "Quick tutorial on how I edit my photos. Let me know if you want more content like this!",
  "Reel time! ✨ Watch till the end for the surprise. This took me forever to perfect!",
  "Weekend vibes with the team. Great people make great products! 🎉",
  "Just shipped a major update to our app. Your feedback made this possible! 🙏",
  "New reel dropping tomorrow! Here's a sneak peek of what's coming. Get ready! 🎥",
  "Sometimes the best ideas come at 3 AM. This is one of those times! 🌙",
  "Video editing tips that nobody talks about. This reel changed my workflow completely!",
  "Grateful for this community. Your comments and messages mean the world to me! ❤️",
  "Watch this reel to see how I create content from scratch. Process is everything! 🎬",
  "New feature alert! We've been working on this for months and it's finally live!",
  "Reel showing my workspace setup. Every detail has a purpose! 📱💻",
  "Thank you for 100k views on my last reel! Here's what I learned from it..."
];

const sampleUsernames = [
  "TechInnovator", "CreativeMind", "BusinessGuru", "DigitalNomad", "StartupFounder",
  "CodeMaster", "DesignThinker", "DataScientist", "ProductManager", "MarketingExpert",
  "GrowthHacker", "CloudArchitect", "DevOpsEngineer", "UXDesigner", "ContentCreator",
  "SocialMediaGuru", "BrandStrategist", "SalesExpert", "CustomerSuccess", "ProductDesigner"
];

const platformDistribution = {
  instagram: 0.4,
  twitter: 0.3,
  facebook: 0.2,
  linkedin: 0.1
};

const getRandomPlatform = () => {
  const random = Math.random();
  let cumulative = 0;
  
  for (const [platform, probability] of Object.entries(platformDistribution)) {
    cumulative += probability;
    if (random <= cumulative) {
      return platform;
    }
  }
  return 'instagram';
};

const generateRandomPost = (index) => {
  const platform = getRandomPlatform();
  const username = sampleUsernames[Math.floor(Math.random() * sampleUsernames.length)];
  const content = sampleTexts[Math.floor(Math.random() * sampleTexts.length)];
  const hasImage = Math.random() > 0.3;
  
  // Generate different image heights for masonry layout
  const imageHeights = [200, 250, 300, 350, 400, 450];
  const imageHeight = imageHeights[Math.floor(Math.random() * imageHeights.length)];
  
  // Generate random engagement metrics
  const likes = Math.floor(Math.random() * 1000) + 10;
  const comments = Math.floor(Math.random() * 100) + 1;
  const shares = Math.floor(Math.random() * 50) + 1;
  
  // Generate random timestamp within last 24 hours
  const timestamp = new Date(Date.now() - Math.random() * 24 * 60 * 60 * 1000);
  
  return {
    id: uuidv4(),
    platform,
    username,
    content,
    avatar: `https://picsum.photos/seed/${username}-${index}/100/100.jpg`,
    image: hasImage ? `https://picsum.photos/seed/post-${index}/400/${imageHeight}.jpg` : null,
    likes,
    comments,
    shares,
    timestamp: timestamp.toISOString(),
    imageHeight
  };
};

export const generateMockPosts = (count = 20, startIndex = 0) => {
  const posts = [];
  
  // Add specific Instagram reel first
  posts.push({
    id: uuidv4(),
    username: "instagram_user",
    platform: "Instagram",
    content: "Morning routine vibes! ✨ Starting the day right with coffee and positivity. This is my Instagram reel showing how I start my day. What's your morning ritual? #morningroutine #coffeelover #dailyvibes #reel",
    image: "https://www.instagram.com/reel/DVfLu0lgKof/embed",
    timestamp: new Date(Date.now() - 1000 * 60 * 5).toISOString(),
    likes: Math.floor(Math.random() * 1000),
    comments: Math.floor(Math.random() * 100),
    shares: Math.floor(Math.random() * 50)
  });

  // Add remaining posts
  for (let i = 1; i < count; i++) {
    posts.push(generateRandomPost(startIndex + i));
  }
  return posts;
};

export const generateMockUser = (username) => {
  return {
    username,
    avatar: `https://picsum.photos/seed/${username}/100/100.jpg`,
    verified: Math.random() > 0.7,
    followers: Math.floor(Math.random() * 100000) + 1000,
    following: Math.floor(Math.random() * 1000) + 100,
    posts: Math.floor(Math.random() * 500) + 10
  };
};

export const generateMockComments = (postId, count = 5) => {
  const comments = [];
  for (let i = 0; i < count; i++) {
    comments.push({
      id: uuidv4(),
      postId,
      username: sampleUsernames[Math.floor(Math.random() * sampleUsernames.length)],
      content: sampleTexts[Math.floor(Math.random() * sampleTexts.length)],
      timestamp: new Date(Date.now() - Math.random() * 24 * 60 * 60 * 1000).toISOString(),
      likes: Math.floor(Math.random() * 50) + 1
    });
  }
  return comments;
};

export const generateMockAnalytics = () => {
  return {
    totalPosts: Math.floor(Math.random() * 1000) + 500,
    totalEngagement: Math.floor(Math.random() * 10000) + 5000,
    topPlatforms: [
      { platform: 'instagram', posts: Math.floor(Math.random() * 400) + 200 },
      { platform: 'twitter', posts: Math.floor(Math.random() * 300) + 150 },
      { platform: 'facebook', posts: Math.floor(Math.random() * 200) + 100 },
      { platform: 'linkedin', posts: Math.floor(Math.random() * 100) + 50 }
    ],
    engagementRate: (Math.random() * 5 + 2).toFixed(2),
    reach: Math.floor(Math.random() * 50000) + 10000,
    impressions: Math.floor(Math.random() * 100000) + 50000
  };
};

// Simulate API delay
export const simulateApiCall = (data, delay = 1000) => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(data);
    }, delay);
  });
};

// Simulate real-time updates
export const generateRealtimeUpdate = () => {
  return {
    type: 'new_post',
    data: generateRandomPost(Math.floor(Math.random() * 10000)),
    timestamp: new Date().toISOString()
  };
};
