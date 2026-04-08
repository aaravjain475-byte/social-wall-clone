# Social Wall Clone

<div align="center">

![Social Wall Clone](https://img.shields.io/badge/Social_Wall-Clone-blue?style=for-the-badge)
![React](https://img.shields.io/badge/React-18.2.0-61dafb?style=for-the-badge&logo=react&logoColor=white)
![Vite](https://img.shields.io/badge/Vite-4.5.0-646cff?style=for-the-badge&logo=vite&logoColor=white)
![Tailwind CSS](https://img.shields.io/badge/Tailwind-3.3.5-06b6d4?style=for-the-badge&logo=tailwindcss&logoColor=white)
![Framer Motion](https://img.shields.io/badge/Framer_Motion-10.16.4-0055ff?style=for-the-badge&logo=framer&logoColor=white)

**A pixel-perfect recreation of Social Walls with real-time social media feed aggregation, featuring modern React architecture, beautiful animations, and responsive design.**

[![Live Demo](https://img.shields.io/badge/Live_Demo-View_Online-green?style=for-the-badge)](https://your-demo-url.com)
[![GitHub stars](https://img.shields.io/github/stars/aaravjain475-byte/social-wall-clone?style=for-the-badge)](https://github.com/aaravjain475-byte/social-wall-clone/stargazers)
[![GitHub forks](https://img.shields.io/github/forks/aaravjain475-byte/social-wall-clone?style=for-the-badge)](https://github.com/aaravjain475-byte/social-wall-clone/network)
[![GitHub issues](https://img.shields.io/github/issues/aaravjain475-byte/social-wall-clone?style=for-the-badge)](https://github.com/aaravjain475-byte/social-wall-clone/issues)

</div>

## Screenshots

<div align="center">
  <img src="https://via.placeholder.com/800x400/000000/ffffff?text=Social+Wall+Clone+Demo" alt="Social Wall Clone Demo" width="800"/>
</div>

## Features

### Core Functionality
- **Real-time Social Media Feed** - Live updates every 10 seconds
- **Multiple Layout Options** - Masonry, Grid, and List views
- **Platform Filtering** - Instagram, Twitter, Facebook, LinkedIn
- **Infinite Scroll** - Seamless content loading
- **Auto-refresh** - Toggle automatic updates
- **Responsive Design** - Perfect on all devices

### Interactive Elements
- **Like System** - Real-time like updates with animations
- **Comment System** - Comment counter with mock data
- **Share Functionality** - Share button with animations
- **Image Lightbox** - Click to expand images with smooth transitions
- **Hover Effects** - Card lift, scale, and shadow animations
- **Loading States** - Beautiful skeleton loaders

### Advanced Features
- **Custom Hooks** - Reusable infinite scroll and auto-refresh logic
- **Performance Optimization** - Intersection Observer, lazy loading
- **Mock API Server** - Express.js with Server-Sent Events
- **Real-time Updates** - WebSocket-like simulation
- **Analytics Dashboard** - Mock analytics data
- **Error Handling** - Graceful error states and retry mechanisms

## Tech Stack

### Frontend
- **React 18** - Modern React with hooks and concurrent features
- **Vite** - Fast build tool and HMR
- **Tailwind CSS** - Utility-first CSS framework
- **Framer Motion** - Production-ready animations
- **Custom Hooks** - Modular, reusable logic

### Backend (Mock API)
- **Express.js** - RESTful API server
- **Server-Sent Events** - Real-time updates
- **Mock Data** - Realistic social media posts simulation

## Quick Start

### Prerequisites
- Node.js 16+ 
- npm or yarn

### Installation

1. **Clone the repository**
```bash
git clone https://github.com/aaravjain475-byte/social-wall-clone.git
cd social-wall-clone
```

2. **Install dependencies**
```bash
npm install
```

3. **Start the development servers**
```bash
# Start frontend (Vite dev server)
npm run dev

# In a separate terminal, start the mock API server
npm run server
```

4. **Open your browser**
- Frontend: http://localhost:3000
- API Health Check: http://localhost:3001/api/health

## Usage

### Layout Options
- **Masonry**: Pinterest-style staggered layout
- **Grid**: Uniform grid layout
- **List**: Traditional list view

### Platform Filters
- **All**: Show all platforms
- **Instagram**: Instagram-style posts
- **Twitter**: Twitter-style posts  
- **Facebook**: Facebook-style posts
- **LinkedIn**: LinkedIn-style posts

### Controls
- **Refresh**: Manually refresh the feed
- **Pause/Resume**: Toggle auto-refresh
- **Like**: Like posts (updates in real-time)
- **Comments**: View and add comments
- **Share**: Share posts
- **Image Lightbox**: Click images to expand

## Project Structure

```
social-wall-clone/
src/
  components/
    Header.jsx          # Navigation and controls
    PostCard.jsx        # Individual post component
    LoadingSkeleton.jsx # Loading states
  hooks/
    useInfiniteScroll.js # Infinite scroll logic
    useAutoRefresh.js   # Auto-refresh functionality
  utils/
    mockData.js         # Mock data generation
  App.jsx              # Main application component
  main.jsx             # Application entry point
  index.css            # Global styles and Tailwind
server.js              # Mock API server
package.json           # Dependencies and scripts
README.md              # This file
```

## API Endpoints

### REST API
- `GET /api/posts` - Get paginated posts
- `GET /api/posts/:id` - Get specific post
- `POST /api/posts/:id/like` - Like a post
- `POST /api/posts/:id/comment` - Comment on a post
- `GET /api/analytics` - Get analytics data
- `GET /api/health` - Health check

### Real-time Events
- `GET /api/events` - Server-Sent Events for real-time updates

## Performance Features

### Implemented
- **Intersection Observer** for infinite scroll
- **Debounced API calls**
- **Image lazy loading**
- **Component-level state management**
- **Efficient re-renders with React hooks**

### Future Enhancements
- **Virtual scrolling** for large datasets
- **Image optimization** with WebP support
- **Service Worker** for offline functionality
- **Caching strategy** with SWR or React Query

## Deployment

### Netlify (Recommended)
1. Push to GitHub
2. Connect your repository to [Netlify](https://netlify.com)
3. Set build command: `npm run build`
4. Set publish directory: `dist`

### Vercel
1. Push to GitHub
2. Connect your repository to [Vercel](https://vercel.com)
3. Vercel will auto-detect the settings

### Manual Deployment
```bash
npm run build
# Deploy the 'dist' folder to your hosting provider
```

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Acknowledgments

- Inspired by [Social Walls by Taggbox](https://display.socialwalls.com/)
- Built with modern web technologies
- Icons and placeholder images from various sources

## Contact

- **Author**: Aarav Jain
- **Email**: aarav.jain475@gmail.com
- **GitHub**: [@aaravjain475-byte](https://github.com/aaravjain475-byte)

---

<div align="center">

**[Star this repository](https://github.com/aaravjain475-byte/social-wall-clone) if you found it helpful!**

Made with React, Vite, Tailwind CSS, and Framer Motion

</div>
