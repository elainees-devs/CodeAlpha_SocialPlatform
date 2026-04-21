import { useState } from "react";
import { LoginData } from "../../types/auth.types";


export default function LoginForm() {
  const [form, setForm] = useState<LoginData>({
    email: "",
    password: "",
  });

  const [error, setError] = useState("");

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!form.email || !form.password) {
      setError("Please fill in all fields");
      return;
    }

    console.log("Login data:", form);
    // later: call login API
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-600 px-3 py-2 rounded text-sm">
          {error}
        </div>
      )}

      <input
        type="email"
        name="email"
        placeholder="Email"
        value={form.email}
        onChange={handleChange}
        className="w-full border border-gray-200 rounded-md px-3 py-2
                   focus:outline-none focus:ring-2 focus:ring-purple-500"
      />

      <input
        type="password"
        name="password"
        placeholder="Password"
        value={form.password}
        onChange={handleChange}
        className="w-full border border-gray-200 rounded-md px-3 py-2
                   focus:outline-none focus:ring-2 focus:ring-purple-500"
      />

      <button
        type="submit"
        className="w-full bg-purple-600 hover:bg-purple-700 text-white py-2.5 rounded-md transition"
      >
        Login
      </button>

    </form>
  );
}