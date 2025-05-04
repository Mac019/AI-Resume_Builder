"use client";

import { Worker, Viewer } from "@react-pdf-viewer/core";
import "@react-pdf-viewer/core/lib/styles/index.css";
import "@react-pdf-viewer/default-layout/lib/styles/index.css";

export default function ResumePreview({ fileUrl }) {
  return (
    <aside className="w-full flex flex-col h-full border-l pl-6 overflow-hidden">
      <h2 className="text-2xl font-semibold mb-2">Resume Preview</h2>
      <div className="w-full h-full border rounded shadow overflow-hidden">
        {!fileUrl ? (
          <div className="w-full h-full flex items-center justify-center">
            <p className="text-gray-500">No resume selected for preview.</p>
          </div>
        ) : (
          <Worker workerUrl="https://unpkg.com/pdfjs-dist@3.11.174/build/pdf.worker.min.js">
            <div className="w-full h-full">
              <Viewer
                fileUrl={fileUrl}
                defaultScale={1.0} // Set scale to 1 for natural scaling
                renderMode="svg"  // Optional: Use SVG rendering for better scaling
              />
            </div>
          </Worker>
        )}
      </div>
    </aside>
  );
}
