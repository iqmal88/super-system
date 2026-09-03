"use client";

import { useState, useEffect } from "react";
import { Component, Search, X, Loader2 } from "lucide-react";

type StudentData = { id: string; name: string; form: string; class: string };
type ClubData = { id: string; name: string; type: string; students: StudentData[] };

export default function Dashboard() {
  const [clubs, setClubs] = useState<ClubData[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedClub, setSelectedClub] = useState<ClubData | null>(null);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const res = await fetch("/api/dashboard");
        if (res.ok) {
          const data = await res.json();
          setClubs(data);
        }
      } catch (error) {
        console.error("Failed to load clubs");
      } finally {
        setIsLoading(false);
      }
    };
    fetchDashboardData();
  }, []);

  const filteredClubs = clubs.filter(club => 
    club.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900">
      
      {/* Main Dashboard Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
          <div>
            <h1 className="text-2xl font-bold text-slate-900">Club & Organization Overview</h1>
            <p className="text-sm text-slate-500 mt-1">Select a club to view its assigned students.</p>
          </div>
          
          <div className="relative w-full md:w-72">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input 
              type="text" 
              placeholder="Search clubs..." 
              className="w-full pl-10 pr-4 py-2 border border-slate-200 rounded-lg outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent text-sm"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>

        {/* Loading State or Clubs Grid */}
        {isLoading ? (
          <div className="flex justify-center items-center py-20 text-purple-600">
            <Loader2 className="w-8 h-8 animate-spin" />
          </div>
        ) : filteredClubs.length === 0 ? (
          <div className="text-center py-20 bg-white border border-slate-200 rounded-2xl">
            <Component className="w-12 h-12 text-slate-300 mx-auto mb-3" />
            <h3 className="text-lg font-medium text-slate-900">No clubs found</h3>
            <p className="text-slate-500 mt-1 text-sm">Head over to the Clubs & Orgs module to create one.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredClubs.map((club) => (
              <div 
                key={club.id} 
                onClick={() => setSelectedClub(club)}
                className="bg-white border border-slate-200 p-6 rounded-2xl shadow-sm hover:shadow-md hover:border-purple-300 transition-all cursor-pointer group"
              >
                <div className="flex justify-between items-start mb-4">
                  <div className="bg-purple-100 text-purple-700 text-xs font-bold px-3 py-1 rounded-full">
                    {club.type}
                  </div>
                  <div className="bg-slate-50 text-slate-600 text-xs font-semibold px-3 py-1 rounded-lg border border-slate-100">
                    {club.students.length} Students
                  </div>
                </div>
                <h3 className="text-lg font-bold text-slate-900 group-hover:text-purple-700 transition-colors">
                  {club.name}
                </h3>
              </div>
            ))}
          </div>
        )}
      </main>

      {/* Student List Modal */}
      {selectedClub && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-2xl overflow-hidden flex flex-col max-h-[85vh]">
            
            <div className="p-6 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
              <div>
                <h2 className="text-xl font-bold text-slate-900">{selectedClub.name}</h2>
                <p className="text-sm text-slate-500 mt-1">Student Enrollment List</p>
              </div>
              <button 
                onClick={() => setSelectedClub(null)}
                className="p-2 hover:bg-slate-200 rounded-full transition-colors text-slate-500"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="overflow-y-auto p-6">
              <table className="w-full text-left text-sm text-slate-600">
                <thead className="text-xs text-slate-400 uppercase bg-slate-50 rounded-lg">
                  <tr>
                    <th className="px-4 py-3 font-semibold rounded-l-lg">ID</th>
                    <th className="px-4 py-3 font-semibold">Name</th>
                    <th className="px-4 py-3 font-semibold">Form</th>
                    <th className="px-4 py-3 font-semibold rounded-r-lg">Class</th>
                  </tr>
                </thead>
                <tbody>
                  {selectedClub.students.length > 0 ? (
                    selectedClub.students.map((student, idx) => (
                      <tr key={idx} className="border-b border-slate-50 hover:bg-slate-50/50 transition-colors">
                        <td className="px-4 py-3 font-medium text-slate-900">{student.id}</td>
                        <td className="px-4 py-3">{student.name}</td>
                        <td className="px-4 py-3">{student.form}</td>
                        <td className="px-4 py-3">{student.class}</td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={4} className="px-4 py-8 text-center text-slate-400">
                        No students assigned yet.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}