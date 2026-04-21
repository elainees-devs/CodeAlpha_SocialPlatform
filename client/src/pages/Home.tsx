// src/pages/Home.tsx
import { Link } from "react-router-dom";

export default function Home() {
  return (
    <div className="min-h-screen bg-purple-50 flex flex-col items-center justify-center">

      <h1 className="text-4xl font-bold text-purple-700">
        MySocial Home
      </h1>

      <p className="text-gray-600 mt-2">
        Welcome to your social feed - where you can see posts from people you follow, like, comment, and share your thoughts!
      </p>

      <Link
        to="/register"
        className="mt-6 bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded"
      >
        Go to Register
      </Link>

    </div>
  );
}