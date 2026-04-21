// src/pages/auth/Login.tsx
import { Link } from "react-router-dom";
import LoginForm from "../../components/auth/LoginForm";

export default function Login() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-purple-50">

      <div className="w-full max-w-4xl bg-white shadow-xl rounded-lg flex overflow-hidden">

        {/* Left branding */}
        <div className="w-1/2 bg-gradient-to-br from-purple-600 to-purple-800 text-white p-10 hidden md:flex flex-col justify-center">
          <h1 className="text-3xl font-bold mb-4">MySocial</h1>
          <p className="text-purple-100 text-lg">
            Connect with friends, share posts, and explore new content.
          </p>
        </div>

        {/* Right login */}
        <div className="w-full md:w-1/2 p-10">

          <h2 className="text-2xl font-bold text-purple-700 mb-6">
            Welcome Back
          </h2>

          <LoginForm />

          <p className="mt-4 text-sm text-center">
            Don’t have an account?{" "}
            <Link
              to="/register"
              className="text-purple-600 hover:underline"
            >
              Register
            </Link>
          </p>

        </div>
      </div>

    </div>
  );
}