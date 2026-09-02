"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Call our login API
    const res = await fetch("/api/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username, password }),
    });

    if (res.ok) {
      // If successful, redirect to the upload page (homepage)
      router.push("/");
    } else {
      setError("Invalid username or password");
    }
  };

  return (
    <main className="min-h-screen bg-gray-50 flex items-center justify-center p-6 text-black">
      <div className="bg-white p-8 rounded-xl shadow-md w-full max-w-sm">
        <h1 className="text-2xl font-bold mb-6 text-center text-gray-800">SMK SUNGAI PUTERI</h1>
        
        <form onSubmit={handleLogin} className="flex flex-col gap-4">
          <div>
            <label className="block text-sm font-semibold mb-1 text-gray-700">Username</label>
            <input
              type="text"
              className="border border-gray-300 p-2.5 rounded-lg w-full outline-none focus:ring-2 focus:ring-blue-500"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />
          </div>
          
          <div>
            <label className="block text-sm font-semibold mb-1 text-gray-700">Password</label>
            <input
              type="password"
              className="border border-gray-300 p-2.5 rounded-lg w-full outline-none focus:ring-2 focus:ring-blue-500"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>

          {error && <p className="text-red-500 text-sm font-medium text-center">{error}</p>}
          
          <button type="submit" className="mt-4 bg-blue-600 text-white font-semibold px-4 py-2.5 rounded-lg hover:bg-blue-700">
            Login
          </button>
        </form>
      </div>
    </main>
  );
}