"use client";

import { useQuery } from "@tanstack/react-query";
import { PostData } from "@/lib/types";
import Post from "@/components/posts/Post";
import { Loader2 } from "lucide-react";

export default function ForYouFeed() {
  const { data, status } = useQuery<PostData[]>({
    queryKey: ["post-feed", "for-you"],
    queryFn: async () => {
      const res = await fetch("/api/posts/for-you");
      if (!res.ok) {
        throw new Error(`failed with status code ${res.status}`);
      }
      return await res.json();
    },
  });

  if (status === "pending") {
    return <Loader2 className="mx-auto animate-spin" />;
  }

  if (status === "error") {
    return (
      <p className="text-center text-destructive">
        An error occurred while loading posts.
      </p>
    );
  }

  return (
    <>
      {data.map((post) => (
        <Post key={post.id} post={post} />
      ))}
    </>
  );
}
