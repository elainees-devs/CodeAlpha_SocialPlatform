// src/pages/Profile.tsx
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { AxiosError } from "axios";
import { authService } from "../services/auth.service";
import { Loader } from "../components/shared/Loader";
import EditProfileModal from "../components/profile/EditProfileModal";
import { BackendErrorResponse } from "../types/error.types";
import { UserProfile } from "../types/user.types";
import BackButton from "../components/shared/BackButton";
export default function Profile() {
  const [editOpen, setEditOpen] = useState(false);

  const {
    data: user,
    isLoading,
    isError,
    error,
  } = useQuery<UserProfile>({
    queryKey: ["profile"],
    queryFn: authService.getCurrentUser,
    staleTime: 5 * 60 * 1000,
  });

  if (isLoading) return <Loader />;

  if (isError) {
    const err = error as AxiosError<BackendErrorResponse>;

    return (
      <div className="p-6 text-red-500">
        {err.response?.data?.message || "Failed to load profile"}
      </div>
    );
  }

  if (!user) return null;

  return (
    <div className="p-6 max-w-2xl mx-auto">
      <BackButton />
      {/* PROFILE CARD */}
      <div className="bg-white rounded-xl shadow p-6">
        {/* HEADER */}
        <div className="flex items-center gap-4">
          <img
            src={
              user.avatar_url
                ? `http://localhost:3000${user.avatar_url}`
                : "https://i.pravatar.cc/150"
            }
            className="w-20 h-20 rounded-full border object-cover"
            alt="avatar"
          />

          <div>
            <h1 className="text-2xl font-bold">{user.username}</h1>

            <p className="text-gray-500 text-sm">{user.email}</p>

            <span
              className={`text-xs px-2 py-1 rounded-full ${
                user.is_online
                  ? "bg-green-100 text-green-600"
                  : "bg-gray-100 text-gray-500"
              }`}
            >
              {user.is_online ? "Online" : "Offline"}
            </span>
          </div>
        </div>

        {/* BIO */}
        <div className="mt-4 text-gray-700">{user.bio || "No bio yet..."}</div>

        {/* META */}
        <div className="mt-4 text-sm text-gray-400">
          Joined: {new Date(user.created_at).toLocaleDateString()}
        </div>

        {/* ACTIONS */}
        <div className="mt-6 flex gap-3">
          <button
            onClick={() => setEditOpen(true)}
            className="px-4 py-2 bg-purple-500 text-white rounded-lg"
          >
            Edit Profile
          </button>
        </div>
      </div>

      {/* MODAL */}
      {editOpen && user && (
        <EditProfileModal user={user} onClose={() => setEditOpen(false)} />
      )}
    </div>
  );
}
