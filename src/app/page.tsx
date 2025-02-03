"use client"

import { useState } from "react"
import { TwitterIcon } from "lucide-react"
import { LoginForm } from "./auth/login"
import { SignupForm } from "./auth/signup"

export default function Home() {
  const [isLogin, setIsLogin] = useState(true)
  
  return (
    <div className="flex min-h-screen bg-gray-100 dark:bg-gray-900">
    <div className="m-auto w-full max-w-md">
      <div className="rounded-lg bg-white p-8 shadow-md dark:bg-gray-800">
        <div className="mb-6 flex justify-center">
          <TwitterIcon className="h-12 w-12 text-blue-500" />
        </div>
        <h1 className="mb-6 text-center text-2xl font-bold text-gray-900 dark:text-white">
          {isLogin ? "Log in to Twitter" : "Join Twitter today"}
        </h1>
        {isLogin ? <LoginForm /> : <SignupForm />}
        <div className="mt-6 text-center">
          <button onClick={() => setIsLogin(!isLogin)} className="text-sm text-blue-500 hover:underline">
            {isLogin ? "Don't have an account? Sign up" : "Already have an account? Log in"}
          </button>
        </div>
      </div>
    </div>
  </div>
  );
}
