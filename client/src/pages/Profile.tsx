// src/pages/Profile.tsx
import { useQuery } from "@tanstack/react-query";
import { authService } from "../services/auth.service";
import { Loader } from "../components/shared/Loader";
import { UserProfile } from "../types/user.types";



export default function Profile() {
  const {
    data: user,
    isLoading,
    isError,
    error,
  } = useQuery<UserProfile>({
    queryKey: ["profile"],
    queryFn: authService.getCurrentUser,
    staleTime: 5 * 60 * 1000, // cache for 5 min
  });

  if (isLoading) return <Loader />;

  if (isError) {
    return (
      <div className="p-6 text-red-500">
        {(error as Error).message || "Failed to load profile"}
      </div>
    );
  }

  if (!user) return null;

  return (
    <div className="p-6 max-w-2xl mx-auto">

      <div className="bg-white rounded-xl shadow p-6">

        {/* HEADER */}
        <div className="flex items-center gap-4">

          <img
            src={
              user.avatar_url ??
              "https://i.pravatar.cc/150"
            }
            className="w-20 h-20 rounded-full border"
            alt="avatar"
          />

          <div>
            <h1 className="text-2xl font-bold">
              {user.username}
            </h1>

            <p className="text-gray-500 text-sm">
              {user.email}
            </p>

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
        <div className="mt-4 text-gray-700">
          {user.bio || "No bio yet..."}
        </div>

        {/* META */}
        <div className="mt-4 text-sm text-gray-400">
          Joined:{" "}
          {new Date(
            user.created_at
          ).toLocaleDateString()}
        </div>

        {/* ACTIONS */}
        <div className="mt-6 flex gap-3">
          <button className="px-4 py-2 bg-purple-500 text-white rounded-lg">
            Edit Profile
          </button>

          <button className="px-4 py-2 border rounded-lg">
            Follow
          </button>
        </div>
      </div>
    </div>
  );
}