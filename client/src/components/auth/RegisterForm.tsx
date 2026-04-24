// src/components/auth/RegisterForm.tsx
import { useState } from "react";
import { AxiosError } from "axios";
import { authService } from "../../services/auth.service";
import RegisterButton from "./RegisterButton";

type FormData = {
  name: string;
  username: string;
  email: string;
  password: string;
  confirmPassword: string;
};

type ApiErrorResponse = {
  message: string;
};

export default function RegisterForm() {
  const [form, setForm] = useState<FormData>({
    name: "",
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const [error, setError] = useState<string>("");
  const [success, setSuccess] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;

    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    setError("");
    setSuccess("");

    if (form.password !== form.confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    try {
      setLoading(true);

      const payload = {
        name: form.name,
        username: form.username,
        email: form.email,
        password: form.password,
      };

      await authService.register(payload);

      setSuccess("Account created successfully!");

      setForm({
        name: "",
        username: "",
        email: "",
        password: "",
        confirmPassword: "",
      });
    } catch (err: unknown) {
      if (err instanceof AxiosError) {
        const data = err.response?.data as ApiErrorResponse | undefined;
        setError(data?.message || "Registration failed. Try again.");
      } else {
        setError("Something went wrong. Try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="space-y-4 bg-white p-6 rounded-xl shadow-md border border-purple-100"
    >
      {/* Success message */}
      {success && (
        <div className="bg-green-50 border border-green-200 text-green-700 px-3 py-2 rounded-md text-sm">
          {success}
        </div>
      )}

      {/* Error message */}
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-600 px-3 py-2 rounded-md text-sm">
          {error}
        </div>
      )}

      {/* Inputs */}
      <div className="space-y-3">
        <input
          name="name"
          value={form.name}
          onChange={handleChange}
          placeholder="Full Name"
          className="input"
        />

        <input
          name="username"
          value={form.username}
          onChange={handleChange}
          placeholder="Username"
          className="input"
        />

        <input
          name="email"
          value={form.email}
          onChange={handleChange}
          placeholder="Email"
          className="input"
        />

        <input
          name="password"
          type="password"
          value={form.password}
          onChange={handleChange}
          placeholder="Password"
          className="input"
        />

        <input
          name="confirmPassword"
          type="password"
          value={form.confirmPassword}
          onChange={handleChange}
          placeholder="Confirm Password"
          className="input"
        />
      </div>

      <RegisterButton loading={loading} />
    </form>
  );
}