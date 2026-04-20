export interface User {
  id: string;
  name: string;
  username: string;
  avatar: string;
}

export interface Post {
  id: string;
  author: User;
  content: string;
  image?: string;
  createdAt: string;
  likes: number;
  comments: number;
  shares: number;
  liked?: boolean;
}
