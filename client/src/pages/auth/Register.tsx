// src/pages/auth/Register.tsx
import RegisterForm from "../../components/auth/RegisterForm";

export default function Register() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-purple-50">

      <div className="w-full max-w-4xl bg-white shadow-xl rounded-lg flex overflow-hidden">

        {/* Left branding */}
        <div className="w-1/2 bg-gradient-to-br from-purple-600 to-purple-800 text-white p-10 hidden md:flex flex-col justify-center">
          <h1 className="text-3xl font-bold mb-4">MySocial</h1>
          <p className="text-purple-100 text-lg">
            Connect, share posts, like, comment, and follow people you care about.
          </p>
        </div>

        {/* Right form */}
        <div className="w-full md:w-1/2 p-10">

          <h2 className="text-2xl font-bold text-purple-700 mb-6">
            Create Account
          </h2>

          <RegisterForm />

          <p className="mt-4 text-sm text-center">
            Already have an account?{" "}
            <a href="/login" className="text-purple-600 hover:underline">
              Login
            </a>
          </p>

        </div>
      </div>
    </div>
  );
}