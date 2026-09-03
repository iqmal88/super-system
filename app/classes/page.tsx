"use client";

import { useState } from "react";
import Link from "next/link";
import { UploadCloud, ArrowLeft, CheckCircle2, AlertCircle } from "lucide-react";

export default function ClassModulePage() {
  const [file, setFile] = useState<File | null>(null);
  const [formName, setFormName] = useState("");
  const [className, setClassName] = useState("");
  const [status, setStatus] = useState<{ type: "success" | "error" | "loading" | ""; message: string }>({ type: "", message: "" });

  const handleUpload = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!file || !className || !formName) {
      setStatus({ type: "error", message: "Please fill in all fields and select a file." });
      return;
    }

    setStatus({ type: "loading", message: "Uploading and processing students..." });
    const formData = new FormData();
    formData.append("file", file);
    formData.append("form", formName);
    formData.append("className", className);

    try {
      const res = await fetch("/api/upload-class", {
        method: "POST",
        body: formData,
      });
      const data = await res.json();
      
      if (res.ok) {
        setStatus({ type: "success", message: data.message });
        setFile(null);
        setClassName("");
        setFormName("");
      } else {
        setStatus({ type: "error", message: data.error });
      }
    } catch (err) {
      setStatus({ type: "error", message: "An error occurred during upload." });
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 p-6 md:p-12">
      <div className="max-w-2xl mx-auto">

        <div className="bg-white p-8 rounded-3xl shadow-sm border border-slate-200">
          <div className="mb-8">
            <h1 className="text-2xl font-bold text-slate-900">Class Module</h1>
            <p className="text-slate-500 mt-1">Register a new class and upload the student roster.</p>
          </div>
          
          <form onSubmit={handleUpload} className="flex flex-col gap-6">
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-semibold mb-2 text-slate-700">Form</label>
                <select
                  className="bg-slate-50 border border-slate-200 text-slate-900 p-3 rounded-xl w-full outline-none focus:bg-white focus:ring-2 focus:ring-purple-600 focus:border-transparent transition-all"
                  value={formName}
                  onChange={(e) => setFormName(e.target.value)}
                >
                  <option value="" disabled>Select Form...</option>
                  <option value="Form 1">Form 1</option>
                  <option value="Form 2">Form 2</option>
                  <option value="Form 3">Form 3</option>
                  <option value="Form 4">Form 4</option>
                  <option value="Form 5">Form 5</option>
                  <option value="Form 6">Form 6</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-semibold mb-2 text-slate-700">Class Name</label>
                <input
                  type="text"
                  placeholder="e.g. Amanah"
                  className="bg-slate-50 border border-slate-200 text-slate-900 p-3 rounded-xl w-full outline-none focus:bg-white focus:ring-2 focus:ring-purple-600 focus:border-transparent transition-all"
                  value={className}
                  onChange={(e) => setClassName(e.target.value)}
                />
              </div>
            </div>
            
            <div>
              <label className="block text-sm font-semibold mb-2 text-slate-700">Student List (.xlsx)</label>
              <div className="border-2 border-dashed border-slate-200 rounded-xl p-6 text-center hover:bg-slate-50 transition-colors">
                <input
                  type="file"
                  accept=".xlsx, .xls"
                  className="block w-full text-sm text-slate-500 file:mr-4 file:py-2.5 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-purple-50 file:text-purple-700 hover:file:bg-purple-100 cursor-pointer"
                  onChange={(e) => setFile(e.target.files?.[0] || null)}
                />
                <p className="text-xs text-slate-400 mt-4">
                  Excel file must contain headers exactly named <b>studentId</b> and <b>name</b>.
                </p>
              </div>
            </div>

            {status.type && (
              <div className={`p-4 rounded-xl flex items-center gap-3 text-sm font-medium ${
                status.type === 'success' ? 'bg-green-50 text-green-700 border border-green-200' : 
                status.type === 'error' ? 'bg-red-50 text-red-700 border border-red-200' : 
                'bg-blue-50 text-blue-700 border border-blue-200'
              }`}>
                {status.type === 'success' && <CheckCircle2 className="w-5 h-5" />}
                {status.type === 'error' && <AlertCircle className="w-5 h-5" />}
                {status.message}
              </div>
            )}
            
            <button
              type="submit"
              disabled={status.type === "loading"}
              className="mt-2 bg-purple-600 text-white font-semibold px-4 py-3.5 rounded-xl hover:bg-purple-700 transition-all flex justify-center items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed shadow-md shadow-purple-600/20"
            >
              <UploadCloud className="w-5 h-5" />
              Upload and Register Class
            </button>
          </form>

        </div>
      </div>
    </div>
  );
}