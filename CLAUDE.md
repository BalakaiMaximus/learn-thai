# CLAUDE.md - AI Development Guide

This document provides essential context for AI-assisted development on this React Native + Express full-stack application.

## Project Overview

**Purpose**: Rapid development starter for subscription-based cross-platform mobile applications with blockchain integration.

**Architecture**: Full-stack monorepo with separate client (React Native/Expo) and server (Node.js/Express) applications.

## Key Technologies & Patterns

### Client (React Native + Expo)

**Framework**: Expo SDK 49, React Native 0.72.10, TypeScript
**State Management**: React hooks (no Redux/MobX - uses local component state)
**Navigation**: Not currently implemented (add as needed)
**Styling**: Inline styles (no styled-components or style library)

**Key Files**:
- `client/EntryApp.tsx` - Application entry point
- `client/App.tsx` - Main app component
- `client/config/environment.ts` - Environment configuration with auto-detection
- `client/components/` - Reusable React components

**Important Patterns**:
1. Environment auto-detection via `__DEV__` global
2. TypeScript interfaces in `client/types/`
3. Custom hooks in `client/hooks/`
4. Component-level state management

### Server (Express + MongoDB)

**Framework**: Express.js, Mongoose ODM
**Authentication**: JWT tokens (23-hour expiration), bcrypt password hashing
**Database**: MongoDB with Mongoose schemas
**File Uploads**: Multer + AWS S3

**Key Files**:
- `server/server.js` - Express app configuration and startup
- `server/routes/` - API route definitions
- `server/controllers/` - Request handlers
- `server/models/` - Mongoose schemas
- `server/services/` - Business logic (Stripe, AWS, email)
- `server/db/conn.js` - MongoDB connection setup

**Important Patterns**:
1. MVC-like structure (routes → controllers → models)
2. Service layer for third-party integrations
3. Middleware for auth verification
4. Environment variables via dotenv

## Data Models

### User Model (`server/models/User.js`)
```javascript
{
  username: String (unique),
  email: String (unique, required),
  password: String (hashed with bcrypt),
  googleId: String (optional),
  solanaPublicKey: String (optional),
  role: String (enum: 'user', 'reader', 'admin'),
  profileImage: String (URL),
  isVerified: Boolean,
  verificationToken: String,
  resetPasswordToken: String,
  resetPasswordExpires: Date,
  tokens: Number (default: 0),
  subscriptionId: ObjectId (ref: Subscription),
  subscriptionStatus: String,
  stripeCustomerId: String,
  createdAt: Date,
  updatedAt: Date
}
```

### Subscription Model (`server/models/Subscription.js`)
```javascript
{
  userId: ObjectId (ref: User),
  tier: String (enum: 'Free', 'Paid'),
  status: String (enum: 'active', 'inactive', 'cancelled'),
  startDate: Date,
  endDate: Date,
  autoRenew: Boolean,
  stripePriceId: String,
  stripeSubscriptionId: String,
  tokensPerMonth: Number,
  price: Number,
  createdAt: Date,
  updatedAt: Date
}
```

### TokenTransaction Model (`server/models/TokenTransaction.js`)
```javascript
{
  userId: ObjectId (ref: User),
  transactionType: String (enum: 'credit', 'debit'),
  amount: Number,
  balance: Number (after transaction),
  reason: String,
  metadata: Object,
  createdAt: Date
}
```

## API Routes

### Authentication (`server/routes/authRoutes.js`)
- `POST /api/auth/register` - Create account with email/password
- `POST /api/auth/login` - Login with email/password
- `POST /api/auth/google` - Google OAuth authentication
- `POST /api/auth/solana` - Solana wallet authentication (Sign-In With Solana)
- `POST /api/auth/verify-email` - Verify email with token
- `POST /api/auth/forgot-password` - Request password reset
- `POST /api/auth/reset-password` - Reset password with token

### Subscriptions (`server/routes/subscriptionRoutes.js`)
- `GET /api/subscriptions` - List all subscription plans
- `POST /api/subscriptions` - Create new subscription
- `GET /api/subscriptions/user/:userId` - Get user's subscription
- `PUT /api/subscriptions/:id` - Update subscription
- `DELETE /api/subscriptions/:id` - Cancel subscription

### Stripe Webhooks (`server/routes/stripeRoutes.js`)
- `POST /api/stripe/webhook` - Handle Stripe events

### User Routes (define as needed)
- User profile management
- Token transaction history

## Authentication Flow

### JWT Authentication
1. User logs in via email/password, Google, or Solana
2. Server validates credentials
3. Server generates JWT token (expires in 23 hours)
4. Client stores token and includes in Authorization header: `Bearer <token>`
5. Server middleware verifies token on protected routes

**Auth Middleware**: Check `server/controllers/authController.js` for `verifyToken` function

### Google OAuth Flow
1. Client initiates Google sign-in
2. Receives Google ID token
3. Sends token to `/api/auth/google`
4. Server verifies with Google OAuth library
5. Creates/updates user with `googleId`
6. Returns JWT token

### Solana Wallet Flow
1. Client uses Solana Mobile Wallet Adapter
2. Requests signature of authentication message
3. Sends signature to `/api/auth/solana`
4. Server verifies signature
5. Creates/updates user with `solanaPublicKey`
6. Returns JWT token

## Subscription & Payment Flow

### Stripe Integration
1. **Subscription Creation**:
   - Client calls `/api/subscriptions` with Stripe payment method
   - Server creates Stripe customer (or uses existing)
   - Server creates Stripe subscription
   - Server creates local Subscription record
   - Tokens credited via TokenTransaction

2. **Webhook Handling**:
   - Stripe sends events to `/api/stripe/webhook`
   - Server validates webhook signature
   - Updates subscription status based on events:
     - `customer.subscription.created` - Activate subscription
     - `customer.subscription.updated` - Update status/tier
     - `customer.subscription.deleted` - Cancel subscription
     - `invoice.payment_succeeded` - Credit tokens

3. **Token System**:
   - Each subscription tier grants tokens per month
   - Tokens credited on subscription creation and renewal
   - Token usage tracked via TokenTransaction model
   - Balance updates after each transaction

**Service File**: `server/services/stripeService.js`

## Email System (AWS SES)

**Service File**: `server/services/emailService.js`

Email templates and functions:
- `sendVerificationEmail(email, token)` - Welcome + email verification
- `sendPasswordResetEmail(email, token)` - Password reset link

**Configuration**:
- Uses AWS SES via `@aws-sdk/client-ses`
- HTML email templates with inline styles
- From address configured via `AWS_SES_FROM_EMAIL` env var

## File Upload (AWS S3)

**Service File**: `server/services/s3Service.js`

- Uses `multer-s3` for direct S3 uploads
- File size limit: 10MB
- Memory storage for processing before S3

**Configuration**:
- Bucket and credentials via environment variables
- File naming convention: `${timestamp}-${originalname}`

## Solana Integration

**Client Files**:
- `client/components/WalletConnection.tsx` - Wallet adapter UI
- Uses Solana Mobile Wallet Adapter Protocol

**Features**:
- Connect to Solana mobile wallets
- Sign messages for authentication
- Transaction signing capability
- Devnet (development) / Mainnet-beta (production)

**RPC Endpoints**:
- Development: `https://api.devnet.solana.com`
- Production: `https://api.mainnet-beta.solana.com`

## Environment Configuration

### Server Environment Variables

**Required**:
- `ATLAS_URI` - MongoDB connection string
- `SECRET_KEY` - JWT signing key
- `STRIPE_SECRET_KEY` - Stripe API key
- `STRIPE_WEBHOOK_SECRET` - Stripe webhook signing secret

**Optional**:
- `GOOGLE_CLIENT_ID` - For Google OAuth
- `GOOGLE_CLIENT_SECRET` - For Google OAuth
- `AWS_ACCESS_KEY_ID` - For S3/SES
- `AWS_SECRET_ACCESS_KEY` - For S3/SES
- `AWS_REGION` - AWS region
- `AWS_SES_FROM_EMAIL` - Email sender address
- `GEMINI_API` - Google Gemini API key
- `DB_NAME` - Database name (default: 'bootstrap_app')
- `PORT` - Server port (default: 5001)
- `NODE_ENV` - Environment mode

### Client Configuration

**File**: `client/config/environment.ts`

Auto-detects environment via `__DEV__` global.

**Key Config**:
- `SERVER_URL` - Backend API URL (different for dev/prod)
- `SOLANA_RPC_URL` - Solana network endpoint

## Common Development Tasks

### Adding a New API Endpoint

1. Create route in `server/routes/`
2. Create controller function in `server/controllers/`
3. Add Mongoose model if needed in `server/models/`
4. Add route to `server/server.js`

Example:
```javascript
// server/routes/exampleRoutes.js
const router = require('express').Router();
const { exampleController } = require('../controllers/exampleController');

router.get('/api/example', exampleController);

module.exports = router;
```

### Adding a New Client Component

1. Create component in `client/components/`
2. Use TypeScript with proper typing
3. Import and use in `App.tsx` or other components

### Adding a New Subscription Tier

1. Create subscription plan in Stripe Dashboard
2. Get Stripe Price ID
3. Create subscription record via `/api/subscriptions` with:
   - `tier` name
   - `stripePriceId`
   - `tokensPerMonth`
   - `price`

### Modifying Email Templates

Edit functions in `server/services/emailService.js`:
- HTML structure is inline
- Update styles and content as needed
- Test emails in development (SES sandbox)

## Development Workflow

### Starting Development

```bash
# Terminal 1 - Server
cd server
npm run dev  # nodemon for auto-reload

# Terminal 2 - Client
cd client
npx expo start
```

### Testing Authentication

1. Register test user via `/api/auth/register`
2. Verify email via `/api/auth/verify-email` (get token from logs)
3. Login via `/api/auth/login`
4. Use returned JWT in Authorization header

### Testing Stripe Integration

Use Stripe test mode:
- Test card: `4242 4242 4242 4242`
- Any future expiry date
- Any CVC

Use Stripe CLI for webhooks:
```bash
stripe listen --forward-to localhost:5001/api/stripe/webhook
```

### Debugging

**Server**:
- Check console logs (morgan HTTP logging enabled)
- MongoDB connection status on startup
- JWT verification errors logged

**Client**:
- Use `envLog()` helper for environment-specific logging
- React Native debugger for component inspection
- Network tab for API calls

## Security Considerations

### Current Security Features
- Password hashing with bcrypt (salt rounds: 10)
- JWT token expiration (23 hours)
- Email verification required
- Stripe webhook signature verification
- Environment variable separation

### Security To-Dos (Implement as needed)
- Rate limiting on API endpoints
- Input validation middleware
- CORS configuration for production
- Helmet.js for security headers
- Request sanitization
- SQL injection prevention (using Mongoose helps)
- XSS protection

## Known Patterns & Conventions

### Code Style
- Use `const` over `let` where possible
- Async/await over promise chains
- Descriptive variable names
- Comments for complex logic

### File Naming
- React components: PascalCase (e.g., `WalletConnection.tsx`)
- Utilities/services: camelCase (e.g., `emailService.js`)
- Models: PascalCase (e.g., `User.js`)

### Error Handling
- Server: Return appropriate HTTP status codes
- Client: Handle errors gracefully with user feedback
- Log errors for debugging

### Database Queries
- Use Mongoose methods
- Handle errors with try/catch
- Close connections properly (handled by Mongoose)

## Extending the Application

### Adding New Features

**Example: Adding a Profile Picture Upload**

1. **Server**:
   ```javascript
   // Add route in server/routes/userRoutes.js
   router.post('/api/user/:id/avatar', upload.single('avatar'), uploadAvatar);

   // Controller in server/controllers/userController.js
   const uploadAvatar = async (req, res) => {
     const userId = req.params.id;
     const imageUrl = req.file.location; // S3 URL
     await User.findByIdAndUpdate(userId, { profileImage: imageUrl });
     res.json({ profileImage: imageUrl });
   };
   ```

2. **Client**:
   ```typescript
   // Component for image selection
   import * as ImagePicker from 'expo-image-picker';

   const uploadAvatar = async () => {
     const result = await ImagePicker.launchImageLibraryAsync();
     if (!result.canceled) {
       const formData = new FormData();
       formData.append('avatar', result.assets[0]);
       await fetch(`${SERVER_URL}/api/user/${userId}/avatar`, {
         method: 'POST',
         body: formData,
       });
     }
   };
   ```

### Modifying Subscription Logic

All subscription logic is in:
- `server/controllers/subscriptionController.js` - CRUD operations
- `server/services/stripeService.js` - Stripe interactions
- Webhook handler updates subscription status automatically

### Adding Third-Party Integrations

1. Install package in appropriate directory (client/server)
2. Add configuration to environment variables
3. Create service file in `server/services/` or utility in `client/utils/`
4. Document new environment variables in `.env.example`

## Deployment Checklist

- [ ] Update `SERVER_URL` in client config
- [ ] Set all environment variables on hosting platform
- [ ] Configure MongoDB Atlas IP whitelist
- [ ] Set up Stripe webhook endpoint (production)
- [ ] Verify AWS SES production access
- [ ] Update Google OAuth redirect URIs
- [ ] Build mobile app with EAS
- [ ] Test authentication flow
- [ ] Test payment/subscription flow
- [ ] Verify email sending
- [ ] Check error logging

## Quick Reference

### Important File Locations
- **Auth Logic**: `server/controllers/authController.js`
- **Stripe Integration**: `server/services/stripeService.js`
- **Email Templates**: `server/services/emailService.js`
- **Database Models**: `server/models/`
- **Environment Config**: `client/config/environment.ts`
- **API Routes**: `server/routes/`

### Port Configuration
- **Server**: 5001 (default, configurable via PORT env var)
- **Expo Dev**: 8081 (automatic)
- **MongoDB Local**: 27017 (default)

### Token Defaults
- JWT expiration: 23 hours
- Default user tokens: 0
- Tokens granted by subscription plan

---

**For AI Assistants**: This document provides comprehensive context for development. When making changes:
1. Follow existing patterns and conventions
2. Update environment configuration as needed
3. Add error handling for new features
4. Document new environment variables
5. Test authentication and payment flows after changes
6. Consider security implications of changes

Start building and extending your application with confidence!
