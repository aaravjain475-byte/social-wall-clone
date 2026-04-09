import { v4 as uuidv4 } from 'uuid';

// ConquestBits Instagram posts content
const conquestBitsPosts = [
  {
    content: "We are happy to announce Mr. Sachin Bhatia, Founder and CGO at Exotel, will be joining us for a fireside chat at The Conquest Mixer 2026.\n\nSachin is a seasoned entrepreneur and Co-founder of @exotel_com , a leading cloud communication platform empowering businesses to seamlessly engage with their customers at scale. With years of experience building and scaling startups, Sachin has played a pivotal role in shaping India's SaaS and telecom infrastructure landscape.\n\nThe fireside chat will feature insights on building resilient startups, navigating product-market fit, and lessons from his journey of scaling Exotel into a category-defining company.\n\n📍 @venturexindia , Sector 67, Gurgaon\nRegister now. Link in bio #conquestmixer2026 #firesidechat #sachinbhatia #exotel #startup #entrepreneur",
    image: "https://picsum.photos/seed/sachin-bhatia-exotel/400/500.jpg"
  },
  {
    content: "Check out our latest post! https://www.instagram.com/p/DW5obaekbz0/?utm_source=ig_web_copy_link&igsh=MzRlODBiNWFlZA== #conquestbits #latest #instagram",
    image: "https://picsum.photos/seed/conquestbits-special/400/500.jpg"
  },
  {
    content: "Excited to announce our latest feature update! Now you can track your progress in real-time with our new dashboard. What do you think? #conquestbits #update #feature",
    image: "https://picsum.photos/seed/conquestbits1/400/500.jpg"
  },
  {
    content: "Behind the scenes at ConquestBits! Our team working hard to bring you the best experience. Coffee fueled coding sessions! #team #startuplife #coding",
    image: "https://picsum.photos/seed/conquestbits2/400/500.jpg"
  },
  {
    content: "New milestone reached! Thank you to our amazing community for all the support. We couldn't have done it without you! #milestone #community #grateful",
    image: "https://picsum.photos/seed/conquestbits3/400/500.jpg"
  },
  {
    content: "Quick tip: Did you know you can customize your dashboard? Personalize your experience with our new theme options! #tips #customization #dashboard",
    image: "https://picsum.photos/seed/conquestbits4/400/500.jpg"
  },
  {
    content: "Weekend vibes at ConquestBits HQ! Taking a break to recharge and plan our next big move. What are you working on this weekend? #weekend #startup #hustle",
    image: "https://picsum.photos/seed/conquestbits5/400/500.jpg"
  },
  {
    content: "Productivity hack: Start your day with our new quick-start guide. Get more done in less time! Link in bio for the full guide. #productivity #tips #guide",
    image: "https://picsum.photos/seed/conquestbits6/400/500.jpg"
  },
  {
    content: "Meet the team! Introducing Sarah, our lead designer. She's the creative genius behind our beautiful interface! #team #designer #meettheteam",
    image: "https://picsum.photos/seed/conquestbits7/400/500.jpg"
  },
  {
    content: "New integration alert! We now connect with your favorite tools. Seamless workflow guaranteed! #integration #tools #workflow",
    image: "https://picsum.photos/seed/conquestbits8/400/500.jpg"
  },
  {
    content: "Learning never stops at ConquestBits. Our team is always exploring new technologies to serve you better! #learning #technology #innovation",
    image: "https://picsum.photos/seed/conquestbits9/400/500.jpg"
  },
  {
    content: "User feedback Friday! We love hearing from you. What features would you like to see next? Let us know in the comments! #feedback #community #features",
    image: "https://picsum.photos/seed/conquestbits10/400/500.jpg"
  },
  {
    content: "Coffee and code - the perfect combination! Our developers are brewing some amazing features for you. Stay tuned! #coffee #coding #development",
    image: "https://picsum.photos/seed/conquestbits11/400/500.jpg"
  },
  {
    content: "Did you see our latest update? We've made performance improvements across the board. Faster, smoother, better! #update #performance #speed",
    image: "https://picsum.photos/seed/conquestbits12/400/500.jpg"
  },
  {
    content: "Office tour! This is where the magic happens at ConquestBits. Creative space for creative minds! #office #workspace #behindthescenes",
    image: "https://picsum.photos/seed/conquestbits13/400/500.jpg"
  },
  {
    content: "Pro tip: Use keyboard shortcuts to navigate faster. Save time and boost your productivity! #shortcuts #tips #productivity",
    image: "https://picsum.photos/seed/conquestbits14/400/500.jpg"
  },
  {
    content: "Celebrating small wins! Every feature shipped is a step forward. Thank you for being part of our journey! #celebration #progress #journey",
    image: "https://picsum.photos/seed/conquestbits15/400/500.jpg"
  }
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
  
  // Always add fireside chat post first
  posts.push({
    id: uuidv4(),
    username: 'conquestbits',
    platform: 'Instagram',
    content: "We are happy to announce Mr. Sachin Bhatia, Founder and CGO at Exotel, will be joining us for a fireside chat at The Conquest Mixer 2026.\n\nSachin is a seasoned entrepreneur and Co-founder of @exotel_com , a leading cloud communication platform empowering businesses to seamlessly engage with their customers at scale. With years of experience building and scaling startups, Sachin has played a pivotal role in shaping India's SaaS and telecom infrastructure landscape.\n\nThe fireside chat will feature insights on building resilient startups, navigating product-market fit, and lessons from his journey of scaling Exotel into a category-defining company.\n\n📍 @venturexindia , Sector 67, Gurgaon\nRegister now. Link in bio #conquestmixer2026 #firesidechat #sachinbhatia #exotel #startup #entrepreneur",
    image: "https://picsum.photos/seed/sachin-bhatia-exotel/400/500.jpg",
    timestamp: new Date(Date.now() - 1000 * 60 * 0).toISOString(),
    likes: Math.floor(Math.random() * 1000) + 100,
    comments: Math.floor(Math.random() * 100) + 10,
    shares: Math.floor(Math.random() * 50) + 5,
    avatar: 'https://picsum.photos/seed/conquestbits/100/100.jpg'
  });
  
  // Add remaining ConquestBits posts
  for (let i = 1; i < count; i++) {
    const post = conquestBitsPosts[i % conquestBitsPosts.length];
    posts.push({
      id: uuidv4(),
      username: 'conquestbits',
      platform: 'Instagram',
      content: post.content,
      image: post.image,
      timestamp: new Date(Date.now() - 1000 * 60 * i).toISOString(),
      likes: Math.floor(Math.random() * 1000) + 100,
      comments: Math.floor(Math.random() * 100) + 10,
      shares: Math.floor(Math.random() * 50) + 5,
      avatar: 'https://picsum.photos/seed/conquestbits/100/100.jpg'
    });
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
