// src/pages/Profile.tsx
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { AxiosError } from "axios";

import { authService } from "../services/auth.service";
import { followService } from "../services/follow.service";

import { Loader } from "../components/shared/Loader";
import EditProfileModal from "../components/profile/EditProfileModal";
import BackButton from "../components/shared/BackButton";
import ProfileTabs from "../components/profile/ProfileTabs";

import { BackendErrorResponse } from "../types/error.types";
import { UserProfile } from "../types/user.types";
import { FollowUser } from "../types/follow.types";

/**
 * Safe avatar helper
 */
const getAvatarUrl = (url?: string | null) => {
  if (!url) return "https://via.placeholder.com/40";

  return url.startsWith("http")
    ? url
    : `http://localhost:3000${url}`;
};

export default function Profile() {
  const [editOpen, setEditOpen] = useState(false);

  // PROFILE
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

  // FOLLOWERS
  const { data: followers = [] } = useQuery<FollowUser[]>({
    queryKey: ["followers", user?.id],
    queryFn: () => followService.getFollowers(user!.id),
    enabled: !!user?.id,
  });

  // FOLLOWING
  const { data: following = [] } = useQuery<FollowUser[]>({
    queryKey: ["following", user?.id],
    queryFn: () => followService.getFollowing(user!.id),
    enabled: !!user?.id,
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

  const renderUser = (u: FollowUser) => (
    <div key={u.id} className="flex items-center gap-3">
      <img
        src={getAvatarUrl(u.avatar_url)}
        className="w-8 h-8 rounded-full object-cover"
        alt={u.username}
      />
      <p className="text-sm font-medium">{u.username}</p>
    </div>
  );

  return (
    <div className="p-6 max-w-2xl mx-auto">
      <BackButton />

      {/* PROFILE CARD */}
      <div className="bg-white rounded-xl shadow p-6">
        {/* HEADER */}
        <div className="flex items-center gap-4">
          <img
            src={getAvatarUrl(user.avatar_url)}
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
        <div className="mt-4 text-gray-700">
          {user.bio || "No bio yet..."}
        </div>

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
      {editOpen && (
        <EditProfileModal user={user} onClose={() => setEditOpen(false)} />
      )}

      {/* FOLLOW TABS */}
      <ProfileTabs
        followersCount={followers.length}
        followingCount={following.length}
        followers={
          <div className="space-y-3">
            {followers.length === 0 ? (
              <p className="text-sm text-gray-400 text-center py-6">
                You don’t have any followers yet.
              </p>
            ) : (
              followers.map(renderUser)
            )}
          </div>
        }
        following={
          <div className="space-y-3">
            {following.length === 0 ? (
              <p className="text-sm text-gray-400 text-center py-6">
                You are not following anyone yet.
              </p>
            ) : (
              following.map(renderUser)
            )}
          </div>
        }
      />
    </div>
  );
}