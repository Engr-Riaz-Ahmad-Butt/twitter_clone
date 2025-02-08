
// import { useState } from "react";
// import { useMutation } from "@tanstack/react-query";
// import axios from "axios";
// import { useRouter } from "next/router";

// interface SignupData {
//   name: string;
//   email: string;
//   password: string;
// }

// export function SignupForm() {
//   const [name, setName] = useState("");
//   const [email, setEmail] = useState("");
//   const [password, setPassword] = useState("");
//   const [error, setError] = useState("");

//   const router = useRouter();

//   const signupFn = async (userData: SignupData) => {
//     console.log("Sending payload:", userData);
//     try {
//       await axios.post("/api/auth/signup", userData, {
//         headers: {
//           "Content-Type": "application/json",
//         },
//       });
//     } catch (error: any) {
//       throw new Error(
//         error.response?.data?.error || "An unexpected error occurred"
//       );
//     }
//   };

//   const { mutate, isPending } = useMutation<unknown, Error, SignupData>({
//     mutationFn: signupFn,
//   });

//   const handleSubmit = (e: React.FormEvent) => {
//     e.preventDefault();
//     setError("");

//     mutate(
//       { name, email, password },
//       {
//         onSuccess: () => {
//           router.push("/login");
//           alert("Signup successful");
//         },
//         onError: (err) => {
//           setError(err.message);
//         },
//       }
//     );
//   };

//   return (
//     <form onSubmit={handleSubmit} className="space-y-4">
//       <div className="space-y-2">
//         <label
//           htmlFor="name"
//           className="block text-sm font-medium text-gray-700 dark:text-gray-200"
//         >
//           Name
//         </label>
//         <input
//           id="name"
//           type="text"
//           className="w-full rounded-md border border-gray-300 px-3 py-2 text-gray-900 placeholder-gray-500 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 dark:border-gray-700 dark:bg-gray-800 dark:text-white dark:placeholder-gray-400"
//           placeholder="John Doe"
//           value={name}
//           onChange={(e) => setName(e.target.value)}
//           required
//         />
//       </div>
//       <div className="space-y-2">
//         <label
//           htmlFor="email"
//           className="block text-sm font-medium text-gray-700 dark:text-gray-200"
//         >
//           Email
//         </label>
//         <input
//           id="email"
//           type="email"
//           className="w-full rounded-md border border-gray-300 px-3 py-2 text-gray-900 placeholder-gray-500 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 dark:border-gray-700 dark:bg-gray-800 dark:text-white dark:placeholder-gray-400"
//           placeholder="name@example.com"
//           value={email}
//           onChange={(e) => setEmail(e.target.value)}
//           required
//         />
//       </div>
//       <div className="space-y-2">
//         <label
//           htmlFor="password"
//           className="block text-sm font-medium text-gray-700 dark:text-gray-200"
//         >
//           Password
//         </label>
//         <input
//           id="password"
//           type="password"
//           className="w-full rounded-md border border-gray-300 px-3 py-2 text-gray-900 placeholder-gray-500 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 dark:border-gray-700 dark:bg-gray-800 dark:text-white dark:placeholder-gray-400"
//           value={password}
//           onChange={(e) => setPassword(e.target.value)}
//           required
//         />
//       </div>
//       {error && <p className="text-red-500 text-sm">{error}</p>}
//       <button
//         type="submit"
//         className="w-full rounded-md bg-blue-500 py-2 px-4 font-semibold text-white hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
//         disabled={isPending}
//       >
//         {isPending ? "Signing up..." : "Sign up"}
//       </button>
//     </form>
//   );
// }



"use client"; // Ensure this runs on the client side

import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import axios from "axios";
import { useRouter } from "next/navigation"; // Use next/navigation in App Router (app directory)

interface SignupData {
  name: string;
  email: string;
  password: string;
}

export function SignupForm() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const router = useRouter(); // ✅ No conditional useRouter

  const signupFn = async (userData: SignupData) => {
    console.log("Sending payload:", userData);
    try {
      await axios.post("/api/auth/signup", userData, {
        headers: {
          "Content-Type": "application/json",
        },
      });
    }catch (error: unknown) {
      if (axios.isAxiosError(error) && error.response) {
        throw new Error(error.response.data?.error || "An unexpected error occurred");
      } else {
        throw new Error("An unexpected error occurred");
      }
    }
  };

  const { mutate, isPending } = useMutation<unknown, Error, SignupData>({
    mutationFn: signupFn,
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    mutate(
      { name, email, password },
      {
        onSuccess: () => {
          router.push("/"); 
          alert("Signup successful");
        },
        onError: (err) => {
          setError(err.message);
        },
      }
    );
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <label htmlFor="name" className="block text-sm font-medium text-gray-700 dark:text-gray-200">
          Name
        </label>
        <input
          id="name"
          type="text"
          className="w-full rounded-md border border-gray-300 px-3 py-2 text-gray-900 placeholder-gray-500 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 dark:border-gray-700 dark:bg-gray-800 dark:text-white dark:placeholder-gray-400"
          placeholder="John Doe"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />
      </div>
      <div className="space-y-2">
        <label htmlFor="email" className="block text-sm font-medium text-gray-700 dark:text-gray-200">
          Email
        </label>
        <input
          id="email"
          type="email"
          className="w-full rounded-md border border-gray-300 px-3 py-2 text-gray-900 placeholder-gray-500 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 dark:border-gray-700 dark:bg-gray-800 dark:text-white dark:placeholder-gray-400"
          placeholder="name@example.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
      </div>
      <div className="space-y-2">
        <label htmlFor="password" className="block text-sm font-medium text-gray-700 dark:text-gray-200">
          Password
        </label>
        <input
          id="password"
          type="password"
          className="w-full rounded-md border border-gray-300 px-3 py-2 text-gray-900 placeholder-gray-500 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 dark:border-gray-700 dark:bg-gray-800 dark:text-white dark:placeholder-gray-400"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
      </div>
      {error && <p className="text-red-500 text-sm">{error}</p>}
      <button
        type="submit"
        className="w-full rounded-md bg-blue-500 py-2 px-4 font-semibold text-white hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
        disabled={isPending}
      >
        {isPending ? "Signing up..." : "Sign up"}
      </button>
    </form>
  );
}








