"use client";

import { useState } from "react";
import {
  TwitterIcon,
  Heart,
  MessageCircle,
  Share2,
  LogOut,
} from "lucide-react";
import { useRouter } from "next/navigation";

interface Post {
  id: number;
  content: string;
  likes: number;
  comments: number;
  shares: number;
}

export default function FeedPage() {
  const [error, setError] = useState("");
  const [posts, setPosts] = useState<Post[]>([]);
  const [newPost, setNewPost] = useState("");
  const router = useRouter();

  const handlePostSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (newPost.trim()) {
      const post: Post = {
        id: Date.now(),
        content: newPost,
        likes: 0,
        comments: 0,
        shares: 0,
      };
      setPosts([post, ...posts]);
      setNewPost("");
    }
  };

  const handleLike = (id: number) => {
    setPosts(
      posts.map((post) =>
        post.id === id ? { ...post, likes: post.likes + 1 } : post
      )
    );
  };

  const handleLogout = async () => {
    setError("");
    try {
      const res = await fetch("/api/auth/logout", {
        method: "POST",
        credentials: "include",
      });

      if (!res.ok) {
        const data = await res.json();
        setError(data.error || "Logout failed");
        return;
      }
      alert("Logout successful");
      router.push("/");
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900">
      <header className="bg-white dark:bg-gray-800 shadow">
        <div className="max-w-3xl mx-auto py-4 px-4 sm:px-6 lg:px-8 flex items-center justify-between">
          <div className="flex items-center">
            <TwitterIcon className="h-8 w-8 text-blue-500 mr-4" />
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
              Feed
            </h1>
          </div>
          <button
            onClick={handleLogout}
            className="flex items-center text-gray-500 hover:text-red-500"
          >
            <LogOut className="h-5 w-5 mr-1" />
            Logout
          </button>
        </div>
      </header>
      <main className="max-w-3xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="bg-white dark:bg-gray-800 shadow sm:rounded-lg">
          <form onSubmit={handlePostSubmit} className="p-4">
            <textarea
              value={newPost}
              onChange={(e) => setNewPost(e.target.value)}
              placeholder="What's happening?"
              className="w-full p-2 border border-gray-300 dark:border-gray-700 rounded-lg focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
              rows={3}
            />
            <button
              type="submit"
              className="mt-2 px-4 py-2 bg-blue-500 text-white rounded-full hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
            >
              Post
            </button>
          </form>
        </div>
        <div className="mt-6 space-y-4">
          {posts.map((post) => (
            <div
              key={post.id}
              className="bg-white dark:bg-gray-800 shadow sm:rounded-lg p-4"
            >
              <p className="text-gray-900 dark:text-white">{post.content}</p>
              <div className="mt-4 flex justify-between items-center">
                <button
                  onClick={() => handleLike(post.id)}
                  className="flex items-center text-gray-500 hover:text-red-500"
                >
                  <Heart className="h-5 w-5 mr-1" />
                  <span>{post.likes}</span>
                </button>
                <button className="flex items-center text-gray-500 hover:text-blue-500">
                  <MessageCircle className="h-5 w-5 mr-1" />
                  <span>{post.comments}</span>
                </button>
                <button className="flex items-center text-gray-500 hover:text-green-500">
                  <Share2 className="h-5 w-5 mr-1" />
                  <span>{post.shares}</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}
