// src/components/profile/ProfileTabs.tsx
import { ReactNode, useState } from "react";

type TabKey = "followers" | "following";

type ProfileTabsProps = {
  followers: ReactNode;
  following: ReactNode;
  followersCount: number;
  followingCount: number;
};

export default function ProfileTabs({
  followers,
  following,
  followersCount,
  followingCount,
}: ProfileTabsProps) {
  const [activeTab, setActiveTab] = useState<TabKey>("followers");

  return (
    <div className="mt-6">
      {/* TABS */}
      <div className="border-b flex gap-6">
        <button
          onClick={() => setActiveTab("followers")}
          className={`pb-2 text-sm font-medium flex items-center gap-2 ${
            activeTab === "followers"
              ? "border-b-2 border-purple-500 text-purple-600"
              : "text-gray-500"
          }`}
        >
          Followers
          <span className="text-xs bg-gray-200 text-gray-700 px-2 py-0.5 rounded-full">
            {followersCount}
          </span>
        </button>

        <button
          onClick={() => setActiveTab("following")}
          className={`pb-2 text-sm font-medium flex items-center gap-2 ${
            activeTab === "following"
              ? "border-b-2 border-purple-500 text-purple-600"
              : "text-gray-500"
          }`}
        >
          Following
          <span className="text-xs bg-gray-200 text-gray-700 px-2 py-0.5 rounded-full">
            {followingCount}
          </span>
        </button>
      </div>

      {/* CONTENT */}
      <div className="mt-4">
        {activeTab === "followers" ? followers : following}
      </div>
    </div>
  );
}