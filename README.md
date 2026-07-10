# SkillBridge 🤝

> Trade skills. Grow together.

A full-stack MERN application where users exchange skills peer-to-peer — no money needed. Teach what you know, learn what you don't.

## Tech Stack

| Layer | Tech |
|-------|------|
| Frontend | React 18 + Vite + Tailwind CSS + Redux Toolkit |
| Backend | Node.js + Express.js |
| Database | MongoDB + Mongoose |
| Auth | JWT + bcryptjs |
| Real-time | Socket.io |
| State | Redux Toolkit |
| Routing | React Router v6 |

## Features

- **Auth** — Register/Login with JWT
- **Smart Matching** — Algorithm scores compatibility between users based on skills offered/wanted
- **Browse** — Search users by skill with pagination
- **Match Requests** — Send/accept/decline match requests
- **Real-time Chat** — Socket.io powered chat with typing indicators
- **Session Scheduling** — Book and manage skill exchange sessions
- **Reviews & Ratings** — Rate peers after sessions
- **User Profiles** — Full profiles with skills, bio, rating

## Project Structure

```
skillbridge/
├── server/               ← Express API
│   ├── models/           ← Mongoose schemas (User, Match, Message, Session, Review)
│   ├── routes/           ← REST API routes
│   ├── controllers/      ← Business logic
│   ├── middleware/       ← JWT auth middleware
│   ├── socket/           ← Socket.io event handlers
│   └── index.js          ← Server entry point
│
└── client/               ← React app
    └── src/
        ├── pages/        ← Route components (Dashboard, Browse, Chat, etc.)
        ├── components/   ← Reusable UI components
        ├── store/        ← Redux slices (auth, matches)
        └── utils/        ← Axios instance + Socket.io client
```

## Getting Started

### 1. Clone and install

```bash
# Backend
cd server
npm install

# Frontend
cd client
npm install
```

### 2. Set up environment variables

```bash
cd server
cp .env.example .env
# Fill in your MongoDB URI, JWT secret, and Cloudinary keys
```

### 3. Run development servers

```bash
# Terminal 1 — Backend (port 5000)
cd server && npm run dev

# Terminal 2 — Frontend (port 5173)
cd client && npm run dev
```

### 4. Open in browser

```
http://localhost:5173
```

## API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | /api/auth/register | Register new user |
| POST | /api/auth/login | Login |
| GET | /api/auth/me | Get current user |
| GET | /api/users | Browse all users |
| GET | /api/users/suggestions | Smart match suggestions |
| GET | /api/users/:id | Get user profile |
| PUT | /api/users/profile | Update own profile |
| POST | /api/matches | Send match request |
| GET | /api/matches | Get all my matches |
| PATCH | /api/matches/:id | Accept/decline match |
| GET | /api/messages/:matchId | Get chat messages |
| POST | /api/messages | Send a message |
| GET | /api/sessions | Get my sessions |
| POST | /api/sessions | Create session |
| POST | /api/reviews | Leave a review |
| GET | /api/reviews/:userId | Get user reviews |

## Socket.io Events

| Event | Direction | Description |
|-------|-----------|-------------|
| user:online | Client → Server | User connects |
| chat:join | Client → Server | Join a match room |
| chat:message | Both | Send/receive messages |
| chat:typing | Client → Server | Typing indicator |
| users:online | Server → Client | Online users list |

## Deployment

- **Frontend** → Vercel (`npm run build` → deploy `/dist`)
- **Backend** → Render (set environment variables in dashboard)
- **Database** → MongoDB Atlas (free tier)

## Resume Highlights

- Built a MERN stack peer skill-exchange platform with JWT authentication and role-based access
- Implemented a compatibility scoring algorithm that matches users based on complementary skill sets
- Integrated Socket.io for real-time chat with room-based messaging and typing indicators
- Designed RESTful API with 15+ endpoints across 6 resource types using Express.js and Mongoose
- Deployed full-stack app to Vercel + Render with Vite build pipeline
