# Learn Thai 🙏

A full-stack Thai language learning application built with React Native (Expo) and Express.js.

## Project Structure

```
learn-thai/
├── client/                 # React Native mobile app (Expo)
│   ├── components/         # React components
│   ├── config/             # Environment configuration
│   ├── constants/          # App constants
│   ├── hooks/              # Custom React hooks
│   ├── types/              # TypeScript definitions
│   ├── utils/              # Utility functions
│   ├── App.tsx             # Main app component
│   ├── app.json            # Expo configuration
│   └── package.json
│
├── server/                 # Express.js backend
│   ├── controllers/        # Request handlers
│   ├── db/                 # Database connection
│   ├── models/             # Mongoose models
│   ├── routes/             # API routes
│   ├── services/           # Business logic
│   ├── utils/              # Utilities
│   ├── server.js           # Entry point
│   ├── .env                # Environment variables (not in git)
│   └── package.json
│
└── render.yaml             # Render deployment configuration
```

## Features (from base boilerplate)

- **Authentication**: Email/password, Google OAuth
- **Payments**: Stripe subscription management
- **Database**: MongoDB with Mongoose
- **File Storage**: AWS S3
- **Email**: AWS SES
- **Web Support**: React Native Web for browser access
- **Mobile**: iOS and Android via Expo

## Tech Stack

### Frontend
- React Native 0.72.10
- Expo SDK 49
- TypeScript
- React Native Web (for browser)

### Backend
- Node.js 18+
- Express.js
- MongoDB + Mongoose
- JWT Authentication
- Stripe Payments
- AWS S3 & SES

## Development Setup

### Prerequisites
- Node.js 18+
- MongoDB (local or Atlas)
- npm or yarn

### 1. Install Dependencies

```bash
# Server
cd server
npm install

# Client
cd ../client
npm install
```

### 2. Configure Environment

Copy the example environment file and update with your values:

```bash
cd server
cp .env.example .env
```

Required variables:
- `ATLAS_URI` - MongoDB connection string
- `SECRET_KEY` - JWT secret (generate with `openssl rand -base64 32`)
- `STRIPE_SECRET_KEY` - Stripe API key (optional for now)
- `GOOGLE_CLIENT_ID` - Google OAuth (optional for now)

### 3. Start Development Servers

Terminal 1 - Backend:
```bash
cd server
npm run dev
```

Terminal 2 - Frontend (Web):
```bash
cd client
npm run web
```

Or for mobile development:
```bash
cd client
npm start
# Scan QR code with Expo Go app
```

## Deployment

### Render (Recommended)

The project includes a `render.yaml` blueprint for easy deployment:

1. Push code to GitHub
2. Connect your GitHub repo to Render
3. Render will automatically create:
   - `learn-thai-api` - Backend API service
   - `learn-thai-web` - Frontend static site

4. Set required environment variables in Render dashboard:
   - `ATLAS_URI` - MongoDB connection string
   - `SECRET_KEY` - JWT secret
   - Stripe, Google, AWS keys (as needed)

### Manual Deployment

**Backend:**
```bash
cd server
npm install
npm start
```

**Frontend Web:**
```bash
cd client
npm install
npx expo export:web
# Deploy `web-build` folder to any static host
```

## Roadmap

- [ ] Thai alphabet lessons
- [ ] Vocabulary with audio
- [ ] Practice exercises
- [ ] Progress tracking
- [ ] Spaced repetition system
- [ ] Native speaker audio
- [ ] Writing practice (Thai script)

## License

MIT
