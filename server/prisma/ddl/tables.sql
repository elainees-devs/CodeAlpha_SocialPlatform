-- =========================================================
-- CLEANUP (DEVELOPMENT ONLY)
-- Drops tables in correct dependency order to avoid FK issues
-- =========================================================
DROP TABLE IF EXISTS follows CASCADE;
DROP TABLE IF EXISTS likes CASCADE;
DROP TABLE IF EXISTS comments CASCADE;
DROP TABLE IF EXISTS posts CASCADE;
DROP TABLE IF EXISTS users CASCADE;

-- =========================================================
-- USERS TABLE
-- Core identity table for authentication and profiles
-- =========================================================
CREATE TABLE users (
  id SERIAL PRIMARY KEY,
  username TEXT NOT NULL,
  email TEXT UNIQUE NOT NULL,
  password_hash TEXT NOT NULL,
  bio TEXT,
  avatar_url TEXT,
  is_online BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Fast username lookup (profile pages, search, mentions)
CREATE INDEX idx_users_username ON users(username);

-- Real-time presence filtering (chat, active users, status indicators)
CREATE INDEX idx_users_is_online ON users(is_online);


-- =========================================================
-- POSTS TABLE
-- Stores user-generated content (feed items)
-- =========================================================
CREATE TABLE posts (
  id SERIAL PRIMARY KEY,
  user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
  content TEXT NOT NULL,
  image_url TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Fetch posts for a specific user ordered by newest first (profile page)
CREATE INDEX idx_posts_user_created ON posts(user_id, created_at DESC);

-- Global feed ordering (timeline / home feed)
CREATE INDEX idx_posts_created_at ON posts(created_at DESC);


-- =========================================================
-- COMMENTS TABLE
-- Stores user discussions under posts
-- =========================================================
CREATE TABLE comments (
  id SERIAL PRIMARY KEY,
  user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
  post_id INTEGER REFERENCES posts(id) ON DELETE CASCADE,
  content TEXT NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Fetch comments for a post in chronological order (thread view)
CREATE INDEX idx_comments_post_created ON comments(post_id, created_at DESC);

-- User activity tracking (comments made by a specific user)
CREATE INDEX idx_comments_user_id ON comments(user_id);


-- =========================================================
-- LIKES TABLE
-- Stores post reactions (many-to-many relationship)
-- =========================================================
CREATE TABLE likes (
  id SERIAL PRIMARY KEY,
  user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
  post_id INTEGER REFERENCES posts(id) ON DELETE CASCADE,
  UNIQUE(user_id, post_id) -- Prevent duplicate likes per user per post
);

-- Fast lookup for like counts per post
CREATE INDEX idx_likes_post_id ON likes(post_id);


-- =========================================================
-- FOLLOWS TABLE
-- Represents social graph relationships between users
-- =========================================================
CREATE TABLE follows (
  id SERIAL PRIMARY KEY,
  follower_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
  following_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
  UNIQUE(follower_id, following_id) -- Prevent duplicate follow relationships
);

-- Fetch followers of a user (inbound connections)
CREATE INDEX idx_follows_following_id ON follows(following_id);

-- Check follow relationship efficiently (bidirectional lookup optimization)
CREATE INDEX idx_follows_following_follower ON follows(following_id, follower_id);