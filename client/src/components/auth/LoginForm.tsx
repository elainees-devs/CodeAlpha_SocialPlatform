// src/components/auth/LoginForm.tsx
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { LoginInput } from "../../types/auth.types";
import { authService } from "../../services/auth.service";
import { Loader } from "../shared/Loader";
import { BackendErrorResponse } from "../../types/error.types";
import { AxiosError } from "axios";
import { useAuthStore } from "../../store/auth.store";

export default function LoginForm() {
  const navigate = useNavigate();

  // zustand auth store
  const loginStore = useAuthStore((state) => state.login);

  const [form, setForm] = useState<LoginInput>({
    email: "",
    password: "",
  });

  const [error, setError] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (error) setError("");

    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!form.email || !form.password) {
      setError("Please fill in all fields");
      return;
    }

    setLoading(true);

    try {
      const response = await authService.login(form);

      console.log("Login successful:", response);

      //SAVE AUTH STATE 
      loginStore(response.user, response.token);

      //Redirect to Feed page
      navigate("/feed");

    } catch (err) {
      const error = err as AxiosError<BackendErrorResponse>;

      const message =
        error.response?.data?.message || "Invalid credentials";

      setError(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative">

      {/* Loader overlay */}
      {loading && <Loader />}

      <form
        onSubmit={handleSubmit}
        className={`space-y-4 transition-opacity ${
          loading ? "opacity-50 pointer-events-none" : "opacity-100"
        }`}
      >

        {/* ERROR MESSAGE */}
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-600 px-3 py-2 rounded text-sm">
            {error}
          </div>
        )}

        {/* EMAIL */}
        <input
          type="email"
          name="email"
          placeholder="Email"
          required
          value={form.email}
          onChange={handleChange}
          className="w-full border border-gray-200 rounded-md px-3 py-2
                     focus:outline-none focus:ring-2 focus:ring-purple-500"
        />

        {/* PASSWORD */}
        <input
          type="password"
          name="password"
          placeholder="Password"
          required
          value={form.password}
          onChange={handleChange}
          className="w-full border border-gray-200 rounded-md px-3 py-2
                     focus:outline-none focus:ring-2 focus:ring-purple-500"
        />

        {/* BUTTON */}
        <button
          type="submit"
          disabled={loading}
          className="w-full bg-purple-600 hover:bg-purple-700 text-white py-2.5 rounded-md 
                     transition flex items-center justify-center min-h-[44px]"
        >
          {loading ? <Loader size="sm" /> : "Login"}
        </button>

      </form>
    </div>
  );
}