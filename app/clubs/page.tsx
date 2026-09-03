"use client";

import { useState, useEffect } from "react";
import { Plus, UserPlus, CheckCircle2, AlertCircle, Loader2 } from "lucide-react";

type Assignment = { club: { category: string } };
type Student = { id: string; studentId: string; name: string; assignments: Assignment[] };
type ClassRoom = { id: string; name: string; form: string; students: Student[] };
type Club = { id: string; name: string; category: string };

export default function ClubsPage() {
  const [clubs, setClubs] = useState<Club[]>([]);
  const [classes, setClasses] = useState<ClassRoom[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Form states for Creating a Club
  const [newClubName, setNewClubName] = useState("");
  const [newClubCategory, setNewClubCategory] = useState("");
  const [clubStatus, setClubStatus] = useState<{ type: "success" | "error" | ""; message: string }>({ type: "", message: "" });

  // Form states for Assigning Students
  const [assignForm, setAssignForm] = useState("");
  const [assignClassId, setAssignClassId] = useState("");
  const [assignClubId, setAssignClubId] = useState("");
  const [assignStudentIds, setAssignStudentIds] = useState<string[]>([]); // Array for multiple students
  const [assignStatus, setAssignStatus] = useState<{ type: "success" | "error" | ""; message: string }>({ type: "", message: "" });

  const fetchData = async () => {
    try {
      const res = await fetch("/api/clubs");
      if (res.ok) {
        const data = await res.json();
        setClubs(data.clubs);
        setClasses(data.classes);
      }
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleCreateClub = async (e: React.FormEvent) => {
    e.preventDefault();
    setClubStatus({ type: "", message: "" });
    const res = await fetch("/api/clubs", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name: newClubName, category: newClubCategory }),
    });
    const data = await res.json();
    if (res.ok) {
      setClubStatus({ type: "success", message: data.message });
      setNewClubName("");
      setNewClubCategory("");
      fetchData();
    } else {
      setClubStatus({ type: "error", message: data.error });
    }
  };

  const handleAssignStudents = async (e: React.FormEvent) => {
    e.preventDefault();
    setAssignStatus({ type: "", message: "" });

    if (assignStudentIds.length === 0) {
      setAssignStatus({ type: "error", message: "Please select at least one student." });
      return;
    }

    const res = await fetch("/api/assignments", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ studentIds: assignStudentIds, clubId: assignClubId }),
    });

    const data = await res.json();
    if (res.ok) {
      setAssignStatus({ type: "success", message: data.message });
      setAssignStudentIds([]); // Clear selection
      fetchData(); // Refresh data to immediately hide the assigned students
    } else {
      setAssignStatus({ type: "error", message: data.error });
    }
  };

  // --- FILTERING LOGIC ---
  const selectedClub = clubs.find(c => c.id === assignClubId);
  const availableForms = Array.from(new Set(classes.map((c) => c.form)));
  const availableClasses = classes.filter((c) => c.form === assignForm);
  
  // Only show students who DO NOT have an assignment in the SAME category as the selected club
  const availableStudents = classes
    .find((c) => c.id === assignClassId)?.students
    .filter((student) => {
      if (!selectedClub) return true;
      const hasSameCategory = student.assignments.some(a => a.club.category === selectedClub.category);
      return !hasSameCategory; 
    }) || [];

  // --- MULTI-SELECT HANDLERS ---
  const handleSelectAll = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.checked) setAssignStudentIds(availableStudents.map(s => s.id));
    else setAssignStudentIds([]);
  };

  const handleSelectStudent = (id: string, checked: boolean) => {
    if (checked) setAssignStudentIds(prev => [...prev, id]);
    else setAssignStudentIds(prev => prev.filter(sId => sId !== id));
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-slate-50 flex justify-center items-center">
        <Loader2 className="w-8 h-8 animate-spin text-purple-600" />
      </div>
    );
  }

  return (
    <div className="min-h-[calc(100vh-64px)] bg-slate-50 text-slate-900 p-6 md:p-12">
      <div className="max-w-6xl mx-auto">
        <div className="mb-10">
          <h1 className="text-3xl font-bold text-slate-900">Clubs & Organizations</h1>
          <p className="text-slate-500 mt-2">Manage school clubs and assign students.</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          
          {/* Card 1: Create a Club */}
          <div className="bg-white p-8 rounded-3xl shadow-sm border border-slate-200 h-fit">
            <h2 className="text-xl font-bold text-slate-900 mb-6 flex items-center gap-2">
              <Plus className="w-5 h-5 text-purple-600" />
              Create New Club
            </h2>

            <form onSubmit={handleCreateClub} className="flex flex-col gap-5">
              <div>
                <label className="block text-sm font-semibold mb-2 text-slate-700">Club Name</label>
                <input type="text" placeholder="e.g., Kelab Bola Sepak" className="bg-slate-50 border border-slate-200 text-slate-900 p-3 rounded-xl w-full outline-none focus:bg-white focus:ring-2 focus:ring-purple-600 transition-all" value={newClubName} onChange={(e) => setNewClubName(e.target.value)} required />
              </div>
              <div>
                <label className="block text-sm font-semibold mb-2 text-slate-700">Category</label>
                <select className="bg-slate-50 border border-slate-200 text-slate-900 p-3 rounded-xl w-full outline-none focus:bg-white focus:ring-2 focus:ring-purple-600 transition-all" value={newClubCategory} onChange={(e) => setNewClubCategory(e.target.value)} required >
                  <option value="" disabled>Select Category...</option>
                  <option value="Uniform Body">Uniform Body</option>
                  <option value="Academic Club">Academic Club</option>
                  <option value="Sports & Games">Sports & Games</option>
                  <option value="Society & Association">Society & Association</option>
                </select>
              </div>

              {clubStatus.type && (
                <div className={`p-4 rounded-xl flex items-center gap-3 text-sm font-medium ${clubStatus.type === 'success' ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'}`}>
                  {clubStatus.type === 'success' ? <CheckCircle2 className="w-5 h-5" /> : <AlertCircle className="w-5 h-5" />}
                  {clubStatus.message}
                </div>
              )}
              <button type="submit" className="mt-2 bg-slate-900 text-white font-semibold px-4 py-3.5 rounded-xl hover:bg-slate-800 transition-all shadow-md">
                Save Club
              </button>
            </form>
          </div>

          {/* Card 2: Assign Students to Club */}
          <div className="bg-white p-8 rounded-3xl shadow-sm border border-slate-200 h-fit">
            <h2 className="text-xl font-bold text-slate-900 mb-6 flex items-center gap-2">
              <UserPlus className="w-5 h-5 text-purple-600" />
              Assign Students (Bulk)
            </h2>

            <form onSubmit={handleAssignStudents} className="flex flex-col gap-5">
              <div>
                <label className="block text-sm font-semibold mb-2 text-slate-700">Select Club</label>
                <select className="bg-slate-50 border border-slate-200 text-slate-900 p-3 rounded-xl w-full outline-none focus:bg-white focus:ring-2 focus:ring-purple-600 transition-all" 
                  value={assignClubId} 
                  onChange={(e) => {
                    setAssignClubId(e.target.value);
                    setAssignStudentIds([]); // clear selection if club changes
                  }} required>
                  <option value="" disabled>Choose a club...</option>
                  {clubs.map((club) => (
                    <option key={club.id} value={club.id}>{club.name} ({club.category})</option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold mb-2 text-slate-700">Form</label>
                  <select className="bg-slate-50 border border-slate-200 text-slate-900 p-3 rounded-xl w-full outline-none focus:bg-white focus:ring-2 focus:ring-purple-600 transition-all" value={assignForm} onChange={(e) => { setAssignForm(e.target.value); setAssignClassId(""); setAssignStudentIds([]); }} required>
                    <option value="" disabled>Form...</option>
                    {availableForms.map((form, idx) => <option key={idx} value={form}>{form}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-semibold mb-2 text-slate-700">Class</label>
                  <select className="bg-slate-50 border border-slate-200 text-slate-900 p-3 rounded-xl w-full outline-none focus:bg-white focus:ring-2 focus:ring-purple-600 transition-all disabled:opacity-50" value={assignClassId} onChange={(e) => { setAssignClassId(e.target.value); setAssignStudentIds([]); }} disabled={!assignForm} required>
                    <option value="" disabled>Class...</option>
                    {availableClasses.map((cls) => <option key={cls.id} value={cls.id}>{cls.name}</option>)}
                  </select>
                </div>
              </div>

              {/* Multi-Select Checkboxes */}
              <div>
                <div className="flex justify-between items-end mb-2">
                  <label className="block text-sm font-semibold text-slate-700">Select Students</label>
                  {availableStudents.length > 0 && assignClubId && (
                    <label className="flex items-center gap-2 text-sm text-purple-600 font-bold cursor-pointer hover:text-purple-700 transition-colors">
                      <input 
                        type="checkbox" 
                        className="accent-purple-600 cursor-pointer w-4 h-4"
                        checked={assignStudentIds.length === availableStudents.length && availableStudents.length > 0}
                        onChange={handleSelectAll}
                      />
                      Select All
                    </label>
                  )}
                </div>

                <div className="bg-slate-50 border border-slate-200 rounded-xl p-3 h-48 overflow-y-auto">
                  {!assignClubId ? (
                    <p className="text-sm text-slate-500 text-center mt-16">Please select a club first.</p>
                  ) : !assignClassId ? (
                    <p className="text-sm text-slate-500 text-center mt-16">Please select a form and class.</p>
                  ) : availableStudents.length === 0 ? (
                    <p className="text-sm text-emerald-600 font-medium text-center mt-16">All students in this class are already assigned to a {selectedClub?.category}!</p>
                  ) : (
                    <div className="flex flex-col gap-1">
                      {availableStudents.map(student => (
                        <label key={student.id} className="flex items-center gap-3 p-2 hover:bg-purple-50 rounded-lg cursor-pointer transition-colors border border-transparent hover:border-purple-100">
                          <input 
                            type="checkbox" 
                            className="accent-purple-600 w-4 h-4 cursor-pointer"
                            checked={assignStudentIds.includes(student.id)}
                            onChange={(e) => handleSelectStudent(student.id, e.target.checked)}
                          />
                          <span className="text-sm font-medium text-slate-700">{student.name}</span>
                          <span className="text-xs text-slate-400 ml-auto">{student.studentId}</span>
                        </label>
                      ))}
                    </div>
                  )}
                </div>
                <p className="text-xs text-slate-500 mt-2 text-right">{assignStudentIds.length} student(s) selected</p>
              </div>

              {assignStatus.type && (
                <div className={`p-4 rounded-xl flex items-center gap-3 text-sm font-medium ${assignStatus.type === 'success' ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'}`}>
                  {assignStatus.type === 'success' ? <CheckCircle2 className="w-5 h-5" /> : <AlertCircle className="w-5 h-5" />}
                  {assignStatus.message}
                </div>
              )}

              <button type="submit" className="mt-2 bg-purple-600 text-white font-semibold px-4 py-3.5 rounded-xl hover:bg-purple-700 transition-all shadow-md">
                Assign {assignStudentIds.length > 0 ? assignStudentIds.length : ""} Students
              </button>
            </form>
          </div>

        </div>
      </div>
    </div>
  );
}