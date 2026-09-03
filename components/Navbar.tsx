"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { 
  LayoutDashboard, Users, Component, FileText, 
  LogOut, GraduationCap, Menu, X 
} from "lucide-react";

export default function Navbar() {
  const pathname = usePathname();
  const router = useRouter();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // Hide the navbar entirely on the login page (which is now "/")
  if (pathname === "/") return null;

  const handleLogout = async () => {
    setIsMobileMenuOpen(false);
    
    // 1. Tell the server to delete the cookie
    await fetch("/api/logout", { method: "POST" });
    
    // 2. Push the user to the login page
    router.push("/");
    
    // 3. Force Next.js to refresh so the middleware recognizes the cookie is gone
    router.refresh(); 
  };

  const navLinkClass = (path: string) => {
    const isActive = pathname === path;
    return `flex items-center gap-2 px-4 py-2 rounded-md font-medium text-sm transition-colors ${
      isActive ? "bg-purple-50 text-purple-700" : "text-slate-600 hover:bg-slate-50 hover:text-purple-600"
    }`;
  };

  const mobileNavLinkClass = (path: string) => {
    const isActive = pathname === path;
    return `flex items-center gap-3 px-4 py-3 rounded-xl font-medium text-base transition-colors ${
      isActive ? "bg-purple-50 text-purple-700" : "text-slate-600 hover:bg-slate-50 hover:text-purple-600"
    }`;
  };

  return (
    <nav className="bg-white border-b border-slate-200 sticky top-0 z-40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          
          <div className="flex items-center gap-8">
            <div className="flex items-center gap-2">
              <div className="bg-purple-600 p-2 rounded-lg">
                <GraduationCap className="w-5 h-5 text-white" />
              </div>
              <span className="font-bold text-xl tracking-tight text-slate-900">COAS</span>
            </div>

            <div className="hidden md:flex space-x-1">
              {/* Updated Dashboard Link */}
              <Link href="/dashboard" className={navLinkClass("/dashboard")}>
                <LayoutDashboard className="w-4 h-4" />
                Dashboard
              </Link>
              <Link href="/classes" className={navLinkClass("/classes")}>
                <Users className="w-4 h-4" />
                Class Module
              </Link>
              <Link href="/clubs" className={navLinkClass("/clubs")}>
                <Component className="w-4 h-4" />
                Clubs & Orgs
              </Link>
              <Link href="/reports" className={navLinkClass("/reports")}>
                <FileText className="w-4 h-4" />
                Reports
              </Link>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button onClick={handleLogout} className="hidden md:flex items-center gap-2 text-slate-500 hover:text-red-600 font-medium text-sm px-3 py-2 rounded-md transition-colors">
              <LogOut className="w-4 h-4" />
              Logout
            </button>
            <button onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)} className="md:hidden p-2 rounded-lg text-slate-500 hover:bg-slate-50 hover:text-purple-600 transition-colors">
              {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {isMobileMenuOpen && (
        <div className="md:hidden bg-white border-t border-slate-100 shadow-lg absolute w-full left-0">
          <div className="px-4 pt-2 pb-4 space-y-2 flex flex-col">
            <Link href="/dashboard" onClick={() => setIsMobileMenuOpen(false)} className={mobileNavLinkClass("/dashboard")}>
              <LayoutDashboard className="w-5 h-5" />
              Dashboard
            </Link>
            <Link href="/classes" onClick={() => setIsMobileMenuOpen(false)} className={mobileNavLinkClass("/classes")}>
              <Users className="w-5 h-5" />
              Class Module
            </Link>
            <Link href="/clubs" onClick={() => setIsMobileMenuOpen(false)} className={mobileNavLinkClass("/clubs")}>
              <Component className="w-5 h-5" />
              Clubs & Orgs
            </Link>
            <Link href="/reports" onClick={() => setIsMobileMenuOpen(false)} className={mobileNavLinkClass("/reports")}>
              <FileText className="w-5 h-5" />
              Reports
            </Link>
            <div className="border-t border-slate-100 my-2 pt-2">
              <button onClick={handleLogout} className="w-full flex items-center gap-3 px-4 py-3 rounded-xl font-medium text-base text-red-600 hover:bg-red-50 transition-colors">
                <LogOut className="w-5 h-5" />
                Logout
              </button>
            </div>
          </div>
        </div>
      )}
    </nav>
  );
}