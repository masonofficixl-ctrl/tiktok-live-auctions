# TikTok Live Auctions 🎯

A real-time auction platform integrated with TikTok Live streams. Users can bid on items during TikTok live sessions with real-time updates and live chat.

## Features ✨

- **Real-time Bidding**: Live bid updates using WebSocket
- **TikTok Live Integration**: Embed TikTok live streams directly in auctions
- **Live Chat**: Chat with other bidders during auctions
- **Responsive Design**: Works seamlessly on mobile and desktop
- **Dashboard**: Create and manage auctions
- **Bid History**: Track all bids in real-time
- **Gift Integration**: Track TikTok gifts as bids (optional)

## Tech Stack 🛠️

**Backend:**
- Node.js with Express
- Socket.io for real-time communication
- PostgreSQL database
- TikTok API integration

**Frontend:**
- React with React Router
- Socket.io-client for real-time updates
- CSS Grid & Flexbox for responsive design

## Setup 🚀

### Prerequisites
- Node.js 16+
- PostgreSQL 12+
- TikTok Developer Account (for API access)

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/yourusername/tiktok-live-auctions.git
   cd tiktok-live-auctions
   ```

2. **Setup Database**
   ```bash
   psql -U postgres -f server/db/schema.sql
   ```

3. **Install dependencies**
   ```bash
   npm install
   cd client && npm install && cd ..
   ```

4. **Configure environment**
   ```bash
   cp .env.example .env
   # Edit .env with your TikTok API credentials
   ```

5. **Start the application**
   ```bash
   npm run dev
   ```

The app will be available at:
- Frontend: http://localhost:3000
- Backend: http://localhost:5000

## API Endpoints 📡

### Auctions
- `GET /api/auctions` - Get all active auctions
- `GET /api/auctions/:id` - Get auction details
- `POST /api/auctions` - Create new auction
- `PUT /api/auctions/:id` - Update auction

### Bidding
- `POST /api/bidding/place-bid` - Place a bid
- `GET /api/bidding/auction/:auctionId` - Get bids for auction

### TikTok
- `POST /api/tiktok/connect` - Connect TikTok Live
- `GET /api/tiktok/comments/:liveId` - Get live comments
- `GET /api/tiktok/gifts/:liveId` - Get gift events

## Real-time Events 🔔

### Client Events
- `join-auction` - Join an auction room
- `place-bid` - Place a bid
- `send-chat` - Send a chat message

### Server Events
- `bid-update` - New bid placed
- `chat-message` - New chat message
- `auction-joined` - User joined auction

## TikTok Integration 🎵

To enable TikTok Live integration:

1. Apply for TikTok Developer Access at https://developer.tiktok.com/
2. Create an application and get your credentials
3. Add credentials to `.env`:
   ```
   TIKTOK_CLIENT_ID=your_client_id
   TIKTOK_CLIENT_SECRET=your_client_secret
   ```

## Mobile Optimization 📱

The platform is fully responsive and optimized for:
- iPhone (iOS)
- Android devices
- Tablets
- Desktop browsers

## Contributing 🤝

Contributions are welcome! Please feel free to submit a Pull Request.

## License 📄

MIT License - feel free to use this project for your own purposes.

## Support 💬

For issues and questions, please open an issue on GitHub.

---

Built with ❤️ for the TikTok community
