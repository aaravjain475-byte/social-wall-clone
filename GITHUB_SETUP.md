# GitHub Setup Instructions

## Step 1: Create GitHub Repository

1. **Go to GitHub**: https://github.com
2. **Login** with your credentials:
   - Username: aaravjain475-byte
   - Email: aarav.jain475@gmail.com
3. **Create New Repository**:
   - Click the "+" icon in the top right corner
   - Select "New repository"
4. **Repository Details**:
   - Repository name: `social-wall-clone`
   - Description: `Pixel-perfect recreation of Social Walls with real-time social media feed aggregation`
   - Make it **Public** (so others can see your work)
   - **DO NOT** initialize with README, .gitignore, or license (we already have these)
5. **Click "Create repository"**

## Step 2: Push the Code

Once the repository is created, run these commands in your terminal:

```bash
cd C:\Users\aarav\CascadeProjects\social_wall
git push -u origin main
```

## Step 3: Verify the Upload

1. **Visit your repository**: https://github.com/aaravjain475-byte/social-wall-clone
2. **Check that all files are uploaded**
3. **Verify the README.md is displayed properly**

## Step 4: Deploy (Optional)

### Netlify Deployment (Easiest)
1. Go to https://netlify.com
2. Sign up with GitHub
3. Click "New site from Git"
4. Select your `social-wall-clone` repository
5. Build settings:
   - Build command: `npm run build`
   - Publish directory: `dist`
6. Click "Deploy site"

### Vercel Deployment
1. Go to https://vercel.com
2. Sign up with GitHub
3. Import your `social-wall-clone` repository
4. Click "Deploy"

## Project Features

Your GitHub repository contains:

### Frontend (React + Vite)
- **Modern React 18** with hooks and concurrent features
- **Tailwind CSS** for styling
- **Framer Motion** for animations
- **Custom hooks** for infinite scroll and auto-refresh
- **Responsive design** with multiple layout options

### Backend (Mock API)
- **Express.js** server with RESTful API
- **Server-Sent Events** for real-time updates
- **Mock data generation** for realistic social media posts

### Key Features
- Real-time social media feed
- Multiple layout options (Masonry, Grid, List)
- Platform filtering (Instagram, Twitter, Facebook, LinkedIn)
- Infinite scroll and auto-refresh
- Interactive elements (like, comment, share)
- Image lightbox with smooth animations
- Loading states and error handling
- Performance optimizations

## Files Structure

```
social-wall-clone/
src/
  components/
    Header.jsx          # Navigation and controls
    PostCard.jsx        # Social media post component
    LoadingSkeleton.jsx # Loading state components
  hooks/
    useInfiniteScroll.js # Infinite scroll logic
    useAutoRefresh.js   # Auto-refresh functionality
  utils/
    mockData.js         # Mock data generation
  App.jsx              # Main application
  main.jsx             # Entry point
  index.css            # Global styles
server.js              # Mock API server
package.json           # Dependencies
README.md              # Documentation
```

## Next Steps

1. **Create the GitHub repository** (Step 1 above)
2. **Push the code** using the provided command
3. **Deploy to Netlify/Vercel** for live demo
4. **Share your project** with the world!

## Support

If you encounter any issues:
- Check that you're logged into GitHub with the correct account
- Ensure the repository name matches exactly: `social-wall-clone`
- Make sure you have internet connectivity
- Try running `git remote -v` to verify the remote URL

Your project is ready to showcase your React development skills!
