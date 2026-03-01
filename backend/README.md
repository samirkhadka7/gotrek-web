# GoTrek Backend API

Backend service for **GoTrek** built with Node.js, Express, TypeScript, MongoDB, and Socket.IO.

This backend powers:
- user authentication (JWT + Google OAuth)
- trail and group management
- real-time group chat
- checklist generation and step tracking
- subscription + eSewa payment flow
- AI chatbot for trekking guidance
- admin analytics/activity and notifications

---

## Tech Stack

- Node.js + Express 5
- TypeScript
- MongoDB + Mongoose
- JWT + Passport Google OAuth2
- Socket.IO
- Multer (file uploads)
- Nodemailer (OTP email)
- Jest + Supertest

---

## Project Structure

```txt
backend/
├── src/
│   ├── config/            # DB config
│   ├── controllers/       # Route handlers
│   │   └── admin/         # Admin-specific controllers
│   ├── data/              # Static/supporting data
│   ├── middlewares/       # Auth, subscriptions, uploads, etc.
│   ├── models/            # Mongoose models
│   ├── routers/           # API routes
│   │   └── admin/         # Admin user routes
│   ├── scripts/           # Utility scripts (create-admin)
│   ├── types/             # Type definitions (socket, express user)
│   ├── utils/             # OAuth, socket helpers, email helpers
│   └── index.ts           # Main entry point
├── uploads/               # Uploaded files (served statically)
├── dist/                  # Build output
├── package.json
└── tsconfig.json
```

---

## Environment Variables

Create `.env` inside `backend/`:

```env
# Core
PORT=5050
MONGODB_URI=mongodb://127.0.0.1:27017/gotrek
SECRET=your_jwt_secret

# Frontend/Backend URLs
API_URL=http://localhost:5050/api
FRONTEND_URL=http://localhost:3000
BASE_URL=http://localhost:3000

# Google OAuth
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret

# eSewa
ESEWA_MERCHANT_CODE=EPAYTEST
ESEWA_SECRET_KEY=your_esewa_secret

# AI Chatbot (Gemini)
GEMINI_API_KEY=your_gemini_api_key

# Email (OTP)
EMAIL_USER=your_email@gmail.com
EMAIL_PASS=your_app_password
```

---

## Install & Run

```bash
cd backend
npm install
```

### Development

```bash
npm run dev
```

### Build

```bash
npm run build
```

### Production

```bash
npm run start
```

### Tests

```bash
npm test
```

### Create Admin User

```bash
npm run create-admin -- user@example.com
```

---

## Backend Features (Detailed)

### 1) Authentication & Account Security
- JWT-based login/register for normal users.
- Google OAuth login flow using Passport.
- Change password for logged-in users.
- Forgot password with OTP email and reset password flow.
- Role-based authorization (`admin`, `guide`, normal user).

### 2) User Profile & Admin User Management
- User can view/update own profile (`/api/user/me`).
- User can update profile picture with file upload support.
- User can deactivate own account.
- Admin can create, list, view, update, delete users, and update user role.

### 3) Trail Management (Trekking Core)
- Public trail listing for browsing trekking options.
- Protected trail detail endpoint for logged-in user context.
- Admin CRUD for trails with multi-image upload.
- User trail participation flow:
	- join a trail with date
	- mark joined trail complete
	- cancel joined trail

### 4) Group Management (Community Trekking)
- Guide/Admin can create trekking groups with media.
- Public group listing and detail endpoints.
- Protected group update flow.
- Admin-only group deletion.
- Group join request workflow:
	- request to join
	- admin approve/deny
	- view pending requests
- Member can leave joined group.
- Group photo upload support.

### 5) Real-time Group Chat
- Socket.IO based real-time chat.
- User socket registration for online mapping.
- Join/leave room per group.
- Persist message to DB, then broadcast to group room.
- HTTP endpoint to fetch group message history.

### 6) Checklist & Trek Preparation
- Generate trekking checklist from selected inputs.
- Save checklist per user.
- Get current user checklist.
- Update checklist item status.

### 7) Step Tracking
- Save user step entries.
- Calculate/fetch total steps for a user.

### 8) Subscription & Payment (eSewa)
- Initiate eSewa payment from selected plan/amount.
- Verify payment callback and update payment status.
- Update user subscription after successful verification.
- Fetch personal payment history.
- Admin fetch all transaction history.
- User can cancel subscription.
- Middleware auto-checks subscription expiry and downgrades expired plan to `Basic`.

### 9) AI Chatbot (TrailMate)
- Gemini-powered chatbot endpoint.
- Access protected by subscription (`Pro`, `Premium`) or `admin`.
- Combines static trekking guidance with live DB context (trails/groups).
- Supports trekking recommendations, group discovery, and platform guidance.

### 10) Notifications
- Get notifications for current user.
- Get unread notification count.
- Mark single notification as read.
- Mark all notifications as read.

### 11) Admin Insights
- Analytics endpoint for admin dashboard metrics.
- Recent activity endpoint for admin monitoring.

### 12) File Uploads & Static Serving
- Multer middleware for image/file uploads.
- Uploaded files served from `/uploads`.

### 13) Testing & Developer Utility
- Jest + Supertest test setup.
- Script to promote existing user to admin (`create-admin`).

---

## API Route Overview

Base URL: `http://localhost:5050`

### Auth (`/api/auth`)
- `POST /register`
- `POST /login`
- `POST /logi` (temporary alias)
- `POST /change-password` (protected)
- `POST /forgot-password`
- `POST /reset-password`
- `GET /google`
- `GET /google/callback`

### Users (`/api/user`)
- `GET /me` (protected)
- `PUT /me` (protected)
- `PUT /me/picture` (protected)
- `DELETE /me` (protected)
- `POST /create` (admin)
- `GET /` (admin)
- `GET /:id` (admin)
- `PUT /:id` (admin)
- `DELETE /:id` (admin)
- `PUT /role/:userToUpdateId` (admin)

### Trails (`/api/trail`)
- `GET /` (public)
- `GET /:id` (protected)
- `POST /create` (admin)
- `PUT /:id` (admin)
- `DELETE /:id` (admin)
- `POST /:id/join-with-date` (protected)
- `POST /joined/:joinedTrailId/complete` (protected)
- `DELETE /joined/:joinedTrailId/cancel` (protected)

### Groups (`/api/group`)
- `POST /create` (guide/admin)
- `GET /`
- `GET /:id`
- `PUT /:id` (protected)
- `DELETE /:id` (admin)
- `POST /:id/request-join` (protected)
- `POST /:id/leave` (protected)
- `POST /:id/photos` (protected)
- `PATCH /:groupId/requests/:requestId/approve` (admin)
- `PATCH /:groupId/requests/:requestId/deny` (admin)
- `GET /requests/pending` (admin)

### Messages (`/api/messages`)
- `GET /:groupId` (protected)

### Notifications (`/api/notifications`)
- `GET /` (protected)
- `GET /unread-count` (protected)
- `PATCH /read-all` (protected)
- `PATCH /:id/read` (protected)

### Checklist (`/api/checklist`)
- `GET /generate`
- `POST /save` (protected)
- `GET /my` (protected)
- `PUT /item/:itemId` (protected)

### Steps (`/api/step`)
- `POST /` (protected)
- `GET /total/:userId` (protected)

### Payment & Subscription
- `POST /api/payment/initiate` (protected)
- `GET /api/payment/verify`
- `GET /api/payment/history` (protected)
- `GET /api/payment/all-history` (admin)
- `PUT /api/subscription/cancel` (protected)

### Admin Insights
- `GET /api/analytics` (admin)
- `GET /api/activity` (admin)

### Chatbot (`/api/v1/chatbot`)
- `POST /query` (protected, Pro/Premium/Admin)

---

## Real-time Chat (Socket.IO)

Socket events used in server:
- `register` (map userId to socket)
- `joinGroup`
- `leaveGroup`
- `sendMessage` (persists message and emits `newMessage` to group room)

---

## Notes

- Uploaded files are served via `/uploads`.
- Subscription status middleware runs on `/api` routes and auto-downgrades expired plans to `Basic`.
- Keep `node_modules` and generated build caches out of Git commits.
