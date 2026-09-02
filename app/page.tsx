"use client";

import { useState } from "react";

export default function Home() {
  const [file, setFile] = useState<File | null>(null);
  const [className, setClassName] = useState("");
  const [status, setStatus] = useState("");

  const handleUpload = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!file || !className) {
      setStatus("⚠️ Please provide a class name and an Excel file.");
      return;
    }

    setStatus("⏳ Uploading and processing...");
    const formData = new FormData();
    formData.append("file", file);
    formData.append("className", className);

    try {
      const res = await fetch("/api/upload-class", {
        method: "POST",
        body: formData,
      });
      const data = await res.json();
      
      if (res.ok) {
        setStatus(`✅ ${data.message}`);
        setFile(null);
        setClassName("");
      } else {
        setStatus(`❌ ${data.error}`);
      }
    } catch (err) {
      setStatus("❌ An error occurred during upload.");
    }
  };

  return (
    <main className="min-h-screen bg-gray-50 flex items-center justify-center p-6 text-black">
      <div className="bg-white p-8 rounded-xl shadow-md w-full max-w-md">
        <h1 className="text-2xl font-bold mb-6 text-gray-800">Class Setup</h1>
        
        <form onSubmit={handleUpload} className="flex flex-col gap-5">
          <div>
            <label className="block text-sm font-semibold mb-1 text-gray-700">Class Name</label>
            <input
              type="text"
              placeholder="e.g. Class 5A"
              className="border border-gray-300 p-2.5 rounded-lg w-full focus:ring-2 focus:ring-blue-500 outline-none"
              value={className}
              onChange={(e) => setClassName(e.target.value)}
            />
          </div>
          
          <div>
            <label className="block text-sm font-semibold mb-1 text-gray-700">Student List (.xlsx)</label>
            <input
              type="file"
              accept=".xlsx, .xls"
              className="border border-gray-300 p-2 rounded-lg w-full text-sm file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100 cursor-pointer"
              onChange={(e) => setFile(e.target.files?.[0] || null)}
            />
            <p className="text-xs text-gray-500 mt-2">
              Note: Excel file must have columns named exactly <b>studentId</b> and <b>name</b>.
            </p>
          </div>
          
          <button
            type="submit"
            className="mt-2 bg-blue-600 text-white font-semibold px-4 py-2.5 rounded-lg hover:bg-blue-700 transition duration-200"
          >
            Upload and Save
          </button>
        </form>

        {status && (
          <div className="mt-4 p-3 bg-gray-100 rounded-lg text-sm text-center font-medium">
            {status}
          </div>
        )}
      </div>
    </main>
  );
}