# Social Connect Platform

Social Connect is a modern, full-stack social media platform designed for seamless interaction and community building. Built with a robust tech stack including React, Node.js, and PostgreSQL, it provides a performant and scalable foundation for social networking.

## 🚀 Tech Stack

### Frontend
- **Framework:** React 19 (TypeScript)
- **Routing:** TanStack Router
- **Data Fetching:** TanStack Query (React Query)
- **Styling:** Tailwind CSS
- **Icons:** Lucide React
- **Build Tool:** Vite

### Backend
- **Runtime:** Node.js
- **Framework:** Express
- **Database:** PostgreSQL (via Prisma ORM)
- **Authentication:** JWT (JSON Web Tokens)
- **Validation:** Zod

---

## 📂 Project Structure

This is a monorepo project split into two main directories:

- [client/](client/) → Frontend React application
- [server/](server/) → Backend Node.js API & Database Schema

Each directory contains its own detailed documentation:
- 📖 **[Frontend Documentation](client/README.md)**
- 📖 **[Backend Documentation](server/README.md)**

---

## ✨ Features

- **User Authentication:** Secure register, login, and logout functionality using JWT.
- **Post Management:** Create, edit, and delete text-based or media-rich posts.
- **Interactions:** Like and comment on posts to engage with other users.
- **Social Graph:** Follow and unfollow users to customize your feed.
- **User Profiles:** Personalized profile pages with user info, bio, and post history.
- **Dynamic Feed:** A real-time timeline displaying posts from followed users.

---

## 🛠️ Getting Started

### 1. Clone the repository
```bash
git clone <repository-url>
cd CodeAlpha_SocialPlatform
```

### 2. Install Dependencies
You need to install packages for both the frontend and backend.

**Frontend:**
```bash
cd client
npm install
```

**Backend:**
```bash
cd server
npm install
```

### 3. Environment Variables
Both the [client](client/README.md) and [server](server/README.md) require specific environment variables to function (e.g., `DATABASE_URL`, `JWT_SECRET`, `VITE_API_URL`).

Please refer to the respective README files in those directories for detailed setup instructions.

---

## 🏃 Running the Application

To run the application locally, you will need to start both the frontend and backend servers.

### Start Backend (Server)
```bash
cd server
npm run dev
```

### Start Frontend (Client)
```bash
cd client
npm run dev
```

The application will typically be available at `http://localhost:5173` (Vite default).

---

## 🔮 Future Improvements

- **Real-time Chat:** Instant messaging between users using WebSockets.
- **Notifications System:** In-app and push notifications for interactions.
- **Media Uploads:** Enhanced image and video processing and storage.
- **Deployment:** Containerization with Docker and deployment to Vercel/Render.

