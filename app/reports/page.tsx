"use client";

import { useState, useEffect } from "react";
import { FileDown, FileText, Loader2, Search } from "lucide-react";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

type StudentData = { studentId: string; name: string; form: string; className: string };
type ClubReportData = { id: string; name: string; category: string; students: StudentData[] };

export default function ReportsPage() {
  const [clubs, setClubs] = useState<ClubReportData[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    const fetchReports = async () => {
      try {
        const res = await fetch("/api/reports");
        if (res.ok) setClubs(await res.json());
      } catch (error) {
        console.error("Failed to load reports");
      } finally {
        setIsLoading(false);
      }
    };
    fetchReports();
  }, []);

  const generatePDF = (club: ClubReportData) => {
    const doc = new jsPDF();
    
    // PDF Header
    doc.setFontSize(18);
    doc.setTextColor(147, 51, 234); // Purple color
    doc.text("SMK SUNGAI PUTERI", 14, 22);
    
    doc.setFontSize(12);
    doc.setTextColor(71, 85, 105); // Slate color
    doc.text(`Co-Curricular Roster: ${club.name}`, 14, 30);
    doc.text(`Category: ${club.category}`, 14, 36);
    doc.text(`Total Enrolled: ${club.students.length} Students`, 14, 42);

    // Table Setup
    const tableColumns = ["No.", "Student ID", "Name", "Form", "Class"];
    const tableRows = club.students.map((student, index) => [
      index + 1,
      student.studentId,
      student.name,
      student.form,
      student.className
    ]);

    autoTable(doc, {
      startY: 48,
      head: [tableColumns],
      body: tableRows,
      theme: 'grid',
      headStyles: { fillColor: [147, 51, 234], textColor: 255 },
      styles: { fontSize: 10, cellPadding: 4 },
      alternateRowStyles: { fillColor: [248, 250, 252] },
    });

    // Save File
    const safeFilename = club.name.replace(/[^a-z0-9]/gi, '_').toLowerCase();
    doc.save(`${safeFilename}_roster.pdf`);
  };

  const filteredClubs = clubs.filter(club => 
    club.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="min-h-[calc(100vh-64px)] bg-slate-50 text-slate-900 p-6 md:p-12">
      <div className="max-w-6xl mx-auto">
        
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
          <div>
            <h1 className="text-3xl font-bold text-slate-900">System Reports</h1>
            <p className="text-slate-500 mt-2">Generate and download PDF rosters for any club.</p>
          </div>
          
          <div className="relative w-full md:w-80">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input 
              type="text" 
              placeholder="Search to download..." 
              className="w-full pl-10 pr-4 py-3 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent text-sm shadow-sm"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>

        {isLoading ? (
          <div className="flex justify-center items-center py-20">
            <Loader2 className="w-8 h-8 animate-spin text-purple-600" />
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredClubs.map((club) => (
              <div key={club.id} className="bg-white border border-slate-200 p-6 rounded-2xl shadow-sm flex flex-col justify-between h-full">
                <div>
                  <div className="flex items-center gap-3 mb-3">
                    <div className="bg-purple-100 p-2.5 rounded-lg text-purple-700">
                      <FileText className="w-5 h-5" />
                    </div>
                    <h3 className="text-lg font-bold text-slate-900 leading-tight">{club.name}</h3>
                  </div>
                  <p className="text-sm font-medium text-slate-500 mb-6">{club.students.length} Students Assigned</p>
                </div>
                
                <button
                  onClick={() => generatePDF(club)}
                  disabled={club.students.length === 0}
                  className="w-full flex items-center justify-center gap-2 bg-slate-900 text-white font-semibold px-4 py-2.5 rounded-xl hover:bg-slate-800 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <FileDown className="w-4 h-4" />
                  {club.students.length === 0 ? "No Students" : "Download PDF"}
                </button>
              </div>
            ))}
          </div>
        )}

      </div>
    </div>
  );
}