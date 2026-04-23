// src/components/user/WhoToFollow.tsx
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { FollowUser } from "../../types/follow.types";
import { followService } from "../../services/follow.service";

export default function WhoToFollow() {
  const queryClient = useQueryClient();

  const { data: users = [] } = useQuery<FollowUser[]>({
    queryKey: ["followSuggestions"],
    queryFn: () => followService.getSuggestions(),

    // prevent unnecessary refetches
    refetchOnWindowFocus: false,
    refetchOnMount: false,
  });

  const followMutation = useMutation({
    mutationFn: async (userId: number) => {
      await followService.toggleFollow(userId);
      return userId;
    },

    onSuccess: (userId) => {
      queryClient.setQueryData<FollowUser[]>(["followSuggestions"], (old) => {
        if (!old) return [];
        return old.filter((user) => user.id !== userId);
      });
    },
  });

  return (
    <div className="bg-white border rounded-lg p-4 w-full max-w-sm">
      <h2 className="font-bold text-lg mb-4">Who to follow</h2>

      <div className="space-y-4">
        {users.map((user) => (
          <div key={user.id} className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <img
                src={
                  user.avatar_url
                    ? user.avatar_url.startsWith("http")
                      ? user.avatar_url
                      : `http://localhost:3000${user.avatar_url}`
                    : "https://via.placeholder.com/40"
                }
                className="w-9 h-9 rounded-full object-cover"
                alt="avatar"
              />

              <div className="leading-tight">
                <p className="font-semibold text-sm">{user.username}</p>
                <p className="text-xs text-gray-400">suggested</p>
              </div>
            </div>

            <button
              disabled={followMutation.isPending}
              onClick={() => followMutation.mutate(user.id)}
              className="text-blue-500 text-sm font-medium hover:underline disabled:opacity-50"
            >
              Follow
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
