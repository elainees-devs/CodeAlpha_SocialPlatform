// src/components/profile/UnfollowButton.tsx
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { followService } from "../../services/follow.service";
import { FollowUser } from "../../types/follow.types";

type Props = {
  userId: number;     // current user
  targetId: number;   // user to unfollow
};

export default function UnfollowButton({ userId, targetId }: Props) {
  const queryClient = useQueryClient();

  const { mutate, isPending } = useMutation({
    mutationFn: () => followService.toggleFollow(targetId),

    onMutate: async () => {
      // cancel outgoing requests to avoid race conditions
      await queryClient.cancelQueries({
        queryKey: ["followers", userId],
      });

      await queryClient.cancelQueries({
        queryKey: ["following", userId],
      });

      // snapshot previous state (fully typed)
      const previousFollowers =
        queryClient.getQueryData<FollowUser[]>(["followers", userId]);

      const previousFollowing =
        queryClient.getQueryData<FollowUser[]>(["following", userId]);

      // optimistic update: remove user immediately
      queryClient.setQueryData<FollowUser[]>(
        ["followers", userId],
        (old) =>
          old?.filter((u) => u.id !== targetId) ?? []
      );

      queryClient.setQueryData<FollowUser[]>(
        ["following", userId],
        (old) =>
          old?.filter((u) => u.id !== targetId) ?? []
      );

      return { previousFollowers, previousFollowing };
    },

    onError: (_err, _vars, context) => {
      // rollback if something fails
      if (context?.previousFollowers) {
        queryClient.setQueryData(
          ["followers", userId],
          context.previousFollowers
        );
      }

      if (context?.previousFollowing) {
        queryClient.setQueryData(
          ["following", userId],
          context.previousFollowing
        );
      }
    },

    onSuccess: () => {
      // ensure server sync (optional but safe)
      queryClient.invalidateQueries({
        queryKey: ["followers", userId],
      });

      queryClient.invalidateQueries({
        queryKey: ["following", userId],
      });
    },
  });

  return (
    <button
      onClick={() => mutate()}
      disabled={isPending}
      className="text-xs px-3 py-1 rounded-md bg-red-100 text-red-600 hover:bg-red-200"
    >
      {isPending ? "..." : "Unfollow"}
    </button>
  );
}