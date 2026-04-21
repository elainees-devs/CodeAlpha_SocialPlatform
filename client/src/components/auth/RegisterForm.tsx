// src/components/auth/RegisterForm.tsx
import { useState } from "react";

type FormData = {
  name: string;
  username: string;
  email: string;
  password: string;
  confirmPassword: string;
};

export default function RegisterForm() {
  const [form, setForm] = useState<FormData>({
    name: "",
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const [error, setError] = useState("");

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (form.password !== form.confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    console.log("Register data:", form);
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="space-y-4 bg-white p-6 rounded-xl shadow-md border border-purple-100"
    >

      {/* Error message */}
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-600 px-3 py-2 rounded-md text-sm">
          {error}
        </div>
      )}

      {/* Input group */}
      <div className="space-y-3">

        <input
          type="text"
          name="name"
          placeholder="Full Name"
          value={form.name}
          onChange={handleChange}
          className="w-full px-3 py-2 border border-gray-200 rounded-md 
                     focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition"
        />

        <input
          type="text"
          name="username"
          placeholder="Username"
          value={form.username}
          onChange={handleChange}
          className="w-full px-3 py-2 border border-gray-200 rounded-md 
                     focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition"
        />

        <input
          type="email"
          name="email"
          placeholder="Email"
          value={form.email}
          onChange={handleChange}
          className="w-full px-3 py-2 border border-gray-200 rounded-md 
                     focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition"
        />

        <input
          type="password"
          name="password"
          placeholder="Password"
          value={form.password}
          onChange={handleChange}
          className="w-full px-3 py-2 border border-gray-200 rounded-md 
                     focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition"
        />

        <input
          type="password"
          name="confirmPassword"
          placeholder="Confirm Password"
          value={form.confirmPassword}
          onChange={handleChange}
          className="w-full px-3 py-2 border border-gray-200 rounded-md 
                     focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition"
        />
      </div>

      {/* Button */}
      <button
        type="submit"
        className="w-full bg-purple-600 hover:bg-purple-700 active:scale-[0.99]
                   text-white font-medium py-2.5 rounded-md transition"
      >
        Create Account
      </button>
    </form>
  );
}