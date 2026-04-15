
---

# 📱 Social Connect Platform Backend API

A scalable **REST API backend** for a social media platform built with **Node.js, Express, TypeScript, Prisma, and PostgreSQL**, featuring authentication, posts, likes, comments, and follow system with full integration test coverage.

---

## 🚀 Features

* 🔐 JWT Authentication (Register / Login / Me)
* 📝 Posts (Create, Read, Delete)
* ❤️ Likes system (toggle like/unlike)
* 👥 Follow system (toggle follow/unfollow)
* 💬 Comments system
* 📊 Aggregated counts (likes, comments, followers)
* 🧪 Fully tested with Jest + Supertest (integration tests)
* 🗄️ Prisma ORM with PostgreSQL
* ⚡ Clean layered architecture (Controller → Model → DB)

---

## 🏗️ Tech Stack

* **Node.js v18+**
* **Express.js v4.x**
* **TypeScript v5.x**
* **Prisma ORM v5.x**
* **PostgreSQL v14+**
* **JWT (Authentication) jsonwebtoken v9.x**
* **bcryptjs (Password hashing) v2.x**
* **Jest + Supertest (Testing) jest v29.x / supertest v6.x**

---

## 📁 Project Structure

```
src/
│
├── controllers/        # Request handlers
├── models/             # Database logic (Prisma queries)
├── routes/             # API routes
├── middlewares/        # Auth + error handling
├── utils/              # Helpers (JWT, Prisma instance)
├── types/              # TypeScript interfaces
├── app.ts              # Express app (no listen)
├── server.ts           # Server entry point
```

---


## 🔗 Database Relationships (Entities)

### 👤 User → Post

* **Type:** One-to-Many
* A user can create many posts
* Each post belongs to one user

---

### 👤 User → Comment → Post

* **Type:** One-to-Many (both sides)

* A user can write many comments

* A post can have many comments

* Each comment belongs to:

  * one user
  * one post

---

### 👤 User → Like → Post

* **Type:** Many-to-Many (via Like entity)

* A user can like many posts

* A post can be liked by many users

* Each like connects:

  * one user
  * one post

---

### 👤 User → Follow → User (Self-Referencing)

* **Type:** Many-to-Many (self-relation)

* A user can follow many users

* A user can have many followers

* Each follow record connects:

  * `follower` (user who follows)
  * `following` (user being followed)

---

## 📊 Relationship Summary

| Entity               | Relationship                    |
| -------------------- | ------------------------------- |
| User → Post          | One-to-Many                     |
| User → Comment       | One-to-Many                     |
| Post → Comment       | One-to-Many                     |
| User → Like → Post   | Many-to-Many                    |
| User → Follow → User | Many-to-Many (Self-referencing) |

---

## 🧠 Key Design Idea

* **Posts, Comments → ownership-based relationships**
* **Likes → interaction (many-to-many)**
* **Follows → social graph (self-referencing network)**

---

## ⚙️ Installation

### 1. Clone repository

```bash
git clone https://github.com/your-username/social-platform-backend.git
cd social-platform-backend
```

### 2. Install dependencies

```bash
npm install
```

### 3. Setup environment variables

Create `.env` file:

```env
DATABASE_URL=postgresql://user:password@localhost:5432/social_db
JWT_SECRET=your_secret_key
PORT=3000
```

---

## 🗄️ Database Setup

Run Prisma migrations:

```bash
npx prisma migrate dev
```

Generate Prisma client:

```bash
npx prisma generate
```

---

## ▶️ Running the Server

### Development

```bash
npm run dev
```

### Production

```bash
npm run build
npm start
```

---

## 🧪 Running Tests

```bash
npm test
```

### Test coverage includes:

* Authentication (register/login)
* Posts CRUD
* Likes toggle behavior
* Follow/unfollow system
* Unauthorized access handling
* Database state validation

---

## 📡 API Endpoints

### Auth

```
POST /api/auth/register
POST /api/auth/login
GET  /api/auth/me
```

### Posts

```
POST   /api/posts
GET    /api/posts
GET    /api/posts/:id
DELETE /api/posts/:id
```

### Likes

```
POST /api/likes/:postId   (toggle like/unlike)
```

### Follows

```
POST   /api/follows/:userId   (toggle follow/unfollow)
GET    /api/follows/followers/:userId
GET    /api/follows/following/:userId
```

---

## 🔐 Authentication

All protected routes require:

```
Authorization: Bearer <JWT_TOKEN>
```

---

## 🧠 Architecture Notes

* Controllers handle HTTP logic only
* Models handle database logic (Prisma)
* Middleware handles authentication & errors
* Clean separation for testability & scalability

---

## 🧪 Testing Strategy

* Full integration tests (API-level)
* Real database validation (Prisma)
* Isolated test cleanup using `beforeAll` / `beforeEach`
* Supertest for HTTP simulation

     ![Tests Results](docs/images/tests.png)

---

## ⚡ Key Design Decisions

* Toggle-based likes & follows (no duplicate endpoints)
* Centralized error handling middleware
* Prisma as single source of truth for DB
* Stateless JWT authentication
* Modular folder structure for scalability

---

## 📌 Future Improvements

* Real-time notifications (WebSockets)
* Redis caching (feed optimization)
* Pagination + infinite scroll
* Media uploads (Cloudinary/S3)
* Rate limiting & security hardening
* Dockerization

---

## 👨‍💻 Author

Built by **Elaine**
Backend Developer — Node.js / TypeScript / Prisma

---

## 📄 License

This project is licensed under the MIT License.

---
