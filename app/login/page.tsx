"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Users, LayoutList, ShieldCheck, GraduationCap } from "lucide-react";

export default function LoginPage() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const res = await fetch("/api/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username, password }),
    });

    if (res.ok) {
      router.push("/");
    } else {
      setError("Invalid username or password");
    }
  };

  return (
    <main className="min-h-screen bg-slate-50 flex items-center justify-center p-6 md:p-12 text-slate-800 selection:bg-purple-200">
      <div className="max-w-6xl w-full grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-24 items-center">
        
        {/* Left Column: Branding & Features */}
        <div className="flex flex-col justify-center">
          <div className="flex items-center gap-3 mb-6">
            <div className="bg-purple-600 w-12 h-12 rounded-xl flex items-center justify-center shadow-md shadow-purple-600/20">
              <GraduationCap className="text-white w-7 h-7" />
            </div>
            <div>
              <h2 className="text-2xl font-extrabold tracking-tight text-slate-900">SuPer COAS</h2>
              <p className="text-sm font-semibold text-purple-600">SMK Sungai Puteri Club & Organization Assignment System</p>
            </div>
          </div>

          <h1 className="text-4xl md:text-5xl font-bold text-slate-900 leading-tight mb-6">
            Welcome to <br />
            <span className="text-purple-700">
              SMK Sungai Puteri
            </span>
          </h1>
          
          <p className="text-slate-500 text-lg mb-10 max-w-md leading-relaxed">
            Streamline your school's co-curricular assignments with a modern digital solution designed to prevent duplicate enrollments.
          </p>

          {/* Feature Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
            <div className="bg-white p-5 rounded-2xl shadow-sm border border-slate-100 hover:shadow-md transition-shadow">
              <div className="bg-purple-100 w-10 h-10 rounded-lg flex items-center justify-center mb-4 text-purple-700">
                <Users className="w-5 h-5" />
              </div>
              <h3 className="font-semibold text-slate-900 text-sm mb-1">Student Import</h3>
              <p className="text-xs text-slate-500 leading-relaxed">Upload class lists instantly via Excel integration.</p>
            </div>

            <div className="bg-white p-5 rounded-2xl shadow-sm border border-slate-100 hover:shadow-md transition-shadow">
              <div className="bg-purple-100 w-10 h-10 rounded-lg flex items-center justify-center mb-4 text-purple-700">
                <LayoutList className="w-5 h-5" />
              </div>
              <h3 className="font-semibold text-slate-900 text-sm mb-1">Smart Allocation</h3>
              <p className="text-xs text-slate-500 leading-relaxed">Assign clubs efficiently while tracking capacity limits.</p>
            </div>

            <div className="bg-white p-5 rounded-2xl shadow-sm border border-slate-100 hover:shadow-md transition-shadow">
              <div className="bg-purple-100 w-10 h-10 rounded-lg flex items-center justify-center mb-4 text-purple-700">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <h3 className="font-semibold text-slate-900 text-sm mb-1">Data Integrity</h3>
              <p className="text-xs text-slate-500 leading-relaxed">Automated constraints prevent duplicate assignments.</p>
            </div>
          </div>
        </div>

        {/* Right Column: Login Card */}
        <div className="relative">
          {/* Decorative background blur */}
          <div className="absolute -inset-4 bg-purple-600/5 blur-2xl -z-10 rounded-full" />
          
          <div className="bg-white p-8 sm:p-10 rounded-3xl shadow-lg shadow-slate-200/50 border border-slate-100">
            <h2 className="text-2xl font-bold text-slate-900 mb-2 text-center">Sign In</h2>
            <p className="text-sm text-slate-500 mb-8 text-center">Enter your teacher credentials to access COAS</p>
            
            <form onSubmit={handleLogin} className="flex flex-col gap-6">
              <div>
                <label className="block text-sm font-semibold mb-2 text-slate-700">Username</label>
                <input
                  type="text"
                  placeholder="Enter your username"
                  className="bg-slate-50 border border-slate-200 text-slate-900 p-3.5 rounded-xl w-full outline-none focus:bg-white focus:ring-2 focus:ring-purple-600 focus:border-transparent transition-all placeholder:text-slate-400"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  required
                />
              </div>
              
              <div>
                <label className="block text-sm font-semibold mb-2 text-slate-700">Password</label>
                <input
                  type="password"
                  placeholder="Enter your password"
                  className="bg-slate-50 border border-slate-200 text-slate-900 p-3.5 rounded-xl w-full outline-none focus:bg-white focus:ring-2 focus:ring-purple-600 focus:border-transparent transition-all placeholder:text-slate-400"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>

              {error && (
                <div className="bg-red-50 text-red-600 text-sm font-medium p-3 rounded-lg text-center border border-red-100">
                  {error}
                </div>
              )}
              
              <button 
                type="submit" 
                className="mt-2 bg-purple-600 text-white font-semibold text-lg px-4 py-3.5 rounded-xl hover:bg-purple-700 active:scale-[0.98] transition-all shadow-md shadow-purple-600/20"
              >
                Sign In
              </button>
            </form>

            <p className="text-xs text-slate-400 text-center mt-8">
              Authorized school personnel only. Contact the system administrator for access issues.
            </p>
          </div>
        </div>

      </div>
    </main>
  );
}