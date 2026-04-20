import { useEffect, useState } from "react";
import { useAppStore } from "@/app/store";
import { createPostApi, fetchPosts } from "@/features/posts/api/posts.api";

export function usePosts() {
  const { posts, setPosts, addPost, user } = useAppStore();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let active = true;
    setLoading(true);
    fetchPosts().then((data) => {
      if (active) {
        setPosts(data);
        setLoading(false);
      }
    });
    return () => {
      active = false;
    };
  }, [setPosts]);

  const createPost = async (content: string, image_url?: string | null) => {
    const post = await createPostApi({
      user_id: user.id,
      content,
      image_url: image_url ?? null,
    });
    addPost(post);
  };

  return { posts, loading, createPost };
}
