# Social Wall Clone

A pixel-perfect recreation of the Social Walls website with real-time social media feed aggregation, featuring modern React architecture, beautiful animations, and responsive design.

## Features

- **Real-time Social Media Feed**: Live updates from multiple social platforms
- **Multiple Layout Options**: Masonry, Grid, and List views
- **Platform Filtering**: Filter by Instagram, Twitter, Facebook, LinkedIn
- **Infinite Scroll**: Seamless loading of more content
- **Auto-refresh**: Automatic content updates every 10 seconds
- **Responsive Design**: Perfect on all devices
- **Beautiful Animations**: Smooth transitions using Framer Motion
- **Interactive Elements**: Like, comment, and share functionality
- **Image Lightbox**: Click to expand images
- **Performance Optimized**: Lazy loading and virtualization ready

## Tech Stack

### Frontend
- **React 18** - Modern React with hooks
- **Vite** - Fast build tool and dev server
- **Tailwind CSS** - Utility-first CSS framework
- **Framer Motion** - Production-ready animations
- **Custom Hooks** - Reusable infinite scroll and auto-refresh logic

### Backend (Mock API)
- **Express.js** - RESTful API server
- **Server-Sent Events** - Real-time updates
- **Mock Data** - Realistic social media posts simulation

## Project Structure

```
social_wall/
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
package.json
vite.config.js
tailwind.config.js
postcss.config.js
README.md
```

## Quick Start

### Prerequisites
- Node.js 16+ 
- npm or yarn

### Installation

1. **Clone and install dependencies**
```bash
cd social_wall
npm install
```

2. **Start the development server**
```bash
# Start frontend (Vite dev server)
npm run dev

# In a separate terminal, start the mock API server
npm run server
```

3. **Open your browser**
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

## Customization

### Adding New Platforms
1. Update `platformDistribution` in `src/utils/mockData.js`
2. Add platform icons and colors in `src/components/PostCard.jsx`
3. Update filter options in `src/components/Header.jsx`

### Styling
- Modify `tailwind.config.js` for theme customization
- Update `src/index.css` for global styles
- Component-specific styles are in respective component files

### Animation Timing
- Adjust animation durations in `src/index.css` keyframes
- Modify Framer Motion transitions in components

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

## Browser Support

- Chrome 90+
- Firefox 88+
- Safari 14+
- Edge 90+

## Development

### Available Scripts
```bash
npm run dev      # Start development server
npm run build    # Build for production
npm run preview  # Preview production build
npm run server   # Start mock API server
```

### Environment Variables
```bash
PORT=3001              # API server port
VITE_API_URL=http://localhost:3001  # Frontend API URL
```

## Production Deployment

### Build for Production
```bash
npm run build
```

### Deploy with Docker
```dockerfile
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production
COPY . .
RUN npm run build
EXPOSE 3000
CMD ["npm", "run", "preview"]
```

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## License

MIT License - feel free to use this project for personal or commercial purposes.

## Acknowledgments

- Inspired by Social Walls by Taggbox
- Built with modern web technologies
- Icons and placeholder images from various sources

---

**Note**: This is a demonstration project with mock data. In production, you would integrate with actual social media APIs and implement proper authentication and rate limiting.
