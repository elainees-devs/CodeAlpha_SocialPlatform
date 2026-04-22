/* ======================
   RESET DATA (optional)
====================== */
TRUNCATE TABLE
  likes,
  comments,
  follows,
  posts,
  users
RESTART IDENTITY CASCADE;


/* ======================
   USERS
====================== */
INSERT INTO users (
  username,
  email,
  password_hash,
  bio,
  avatar_url,
  is_online,
  created_at,
  updated_at
)
VALUES
(
  'john_doe',
  'john@example.com',
  '$2b$10$mx5GKsZgbu6sBIapUADM4.6/a/8/7FgRUT1KQQbxeh3qK3FeDDqwW',
  'Tech enthusiast 🚀',
  'https://i.pravatar.cc/150?img=12',
  true,
  NOW(),
  NOW()
),
(
  'sarah_dev',
  'sarah@example.com',
  '$2b$10$mx5GKsZgbu6sBIapUADM4.6/a/8/7FgRUT1KQQbxeh3qK3FeDDqwW',
  'Fullstack developer 👩‍💻',
  'https://i.pravatar.cc/150?img=47',
  true,
  NOW(),
  NOW()
),
(
  'mike_art',
  'mike@example.com',
  '$2b$10$mx5GKsZgbu6sBIapUADM4.6/a/8/7FgRUT1KQQbxeh3qK3FeDDqwW',
  'Digital artist 🎨',
  'https://i.pravatar.cc/150?img=33',
  false,
  NOW(),
  NOW()
);


/* ======================
   POSTS
====================== */
INSERT INTO posts (
  user_id,
  content,
  image_url,
  likes_count,
  comments_count,
  shares_count,
  created_at,
  updated_at
)
VALUES
(
  1,
  'Building my new social media app with Prisma + React 🔥',
  'https://images.unsplash.com/photo-1555066931-4365d14bab8c',
  0,
  0,
  0,
  NOW(),
  NOW()
),
(
  2,
  'Just shipped a full-stack feature today 🚀',
  'https://images.unsplash.com/photo-1521737604893-d14cc237f11d',
  0,
  0,
  0,
  NOW(),
  NOW()
),
(
  3,
  'Design inspiration from nature 🌿',
  'https://images.unsplash.com/photo-1500530855697-b586d89ba3ee',
  0,
  0,
  0,
  NOW(),
  NOW()
);


/* ======================
   COMMENTS
====================== */
INSERT INTO comments (
  user_id,
  post_id,
  content,
  created_at
)
VALUES
(2, 1, 'This looks amazing! 🔥', NOW()),
(3, 2, 'Great progress! Keep going 🚀', NOW());


/* ======================
   LIKES
====================== */
INSERT INTO likes (
  user_id,
  post_id
)
VALUES
(2, 1),
(3, 1),
(1, 2);


/* ======================
   FOLLOW RELATIONSHIPS
====================== */
INSERT INTO follows (
  follower_id,
  following_id
)
VALUES
(1, 2),
(2, 3),
(3, 1);