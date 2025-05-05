"use client";

import { Worker, Viewer } from "@react-pdf-viewer/core";
import "@react-pdf-viewer/core/lib/styles/index.css";
import "@react-pdf-viewer/default-layout/lib/styles/index.css";

export default function ResumePreview({ fileUrl }) {
  return (
    <aside className="fixed top-20 right-0 w-[50%] h-[calc(100vh-5rem)] bg-white shadow-2xl border-l-2 z-50 p-6 overflow-hidden">
      <div className="flex flex-col h-full">
        <h2 className="text-3xl font-bold text-gray-800 mb-4 border-b pb-2">📄 Resume Preview</h2>

        <div className="flex-1 bg-gray-50 rounded-lg border-2 border-dashed border-gray-300 overflow-hidden">
          {!fileUrl ? (
            <div className="w-full h-full flex flex-col items-center justify-center text-center text-gray-500 p-6">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-12 w-12 text-gray-400 animate-pulse mb-2"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
              <p className="text-lg font-medium">No resume selected for preview.</p>
              <p className="text-sm text-gray-400 mt-1">Upload a .pdf or .docx file to preview here.</p>
            </div>
          ) : (
            <Worker workerUrl="https://unpkg.com/pdfjs-dist@3.11.174/build/pdf.worker.min.js">
              <div className="w-full h-full overflow-auto">
                <Viewer fileUrl={fileUrl} defaultScale={1.1} renderMode="svg" />
              </div>
            </Worker>
          )}
        </div>
      </div>
    </aside>
  );
}
