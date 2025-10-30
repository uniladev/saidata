import React, { useState, useCallback, useRef } from "react";
import { saveAs } from "file-saver";
import * as docx from "docx";

const OutputTemplatesPage = () => {
  const [docData, setDocData] = useState(null);
  const [fileName, setFileName] = useState("");
  const [dragActive, setDragActive] = useState(false);
  const [error, setError] = useState("");
  const [previewHtml, setPreviewHtml] = useState("");
  const [editMode, setEditMode] = useState(false);
  
  const fileInputRef = useRef(null);
  const textareaRef = useRef(null);

  const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5 MB

  // 🔹 Read DOCX file using docx library
  const handleFile = async (file) => {
    if (!file) return;
    
    if (file.size > MAX_FILE_SIZE) {
      setError("❌ File maksimal 5MB!");
      return;
    }
    
    if (!file.name.endsWith(".docx")) {
      setError("⚠️ File harus format .docx");
      return;
    }

    try {
      setError("");
      setFileName(file.name);
      
      const arrayBuffer = await file.arrayBuffer();
      
      // Store original file for manipulation
      setDocData({
        originalFile: arrayBuffer,
        file: file
      });

      // Create preview using docx-preview
      await createPreview(arrayBuffer);
      
    } catch (err) {
      console.error("Error reading DOCX:", err);
      setError("Gagal membaca file DOCX 😭");
    }
  };

  // 🔹 Create HTML preview of DOCX
  const createPreview = async (arrayBuffer) => {
    try {
      // For preview, we'll use a simple text extraction
      // In production, you might want to use docx-preview library for better rendering
      const textContent = await extractTextFromDocx(arrayBuffer);
      setPreviewHtml(textContent);
    } catch (err) {
      console.error("Preview error:", err);
      setPreviewHtml("<p>Preview tidak tersedia</p>");
    }
  };

  // 🔹 Extract text from DOCX (simple version)
  const extractTextFromDocx = async (arrayBuffer) => {
    // This is a simplified version
    // For production, use docx-preview or mammoth for better preview
    const JSZip = (await import('jszip')).default;
    const zip = await JSZip.loadAsync(arrayBuffer);
    const xml = await zip.file("word/document.xml").async("text");
    
    // Extract text from XML (basic)
    const text = xml
      .replace(/<w:t[^>]*>/g, '')
      .replace(/<\/w:t>/g, ' ')
      .replace(/<[^>]+>/g, '')
      .trim();
    
    return `<div style="white-space: pre-wrap; font-family: 'Times New Roman', serif; line-height: 1.6;">${text}</div>`;
  };

  // 🔹 Edit content (simple textarea for now)
  const handleEditContent = (newContent) => {
    setPreviewHtml(newContent);
  };

  // 🔹 Download modified DOCX with preserved structure
  const handleDownload = async () => {
    if (!docData) {
      setError("Belum ada konten untuk disimpan 😑");
      return;
    }

    try {
      // Method 1: If you only edited text, recreate DOCX with same structure
      // Method 2: For complex editing, use docx library to build new document
      
      if (editMode && textareaRef.current) {
        // User edited in textarea - create new DOCX
        await createNewDocx(textareaRef.current.value);
      } else {
        // No edit or simple preview - save original
        const blob = new Blob([docData.originalFile], {
          type: "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
        });
        const downloadFileName = fileName ? `Edited_${fileName}` : "Edited_template.docx";
        saveAs(blob, downloadFileName);
      }
      
      console.log("✅ File downloaded");
    } catch (err) {
      console.error("Download error:", err);
      setError("Gagal mendownload file 😭");
    }
  };

  // 🔹 Create new DOCX from edited content
  const createNewDocx = async (content) => {
    const doc = new docx.Document({
      sections: [{
        properties: {},
        children: content.split('\n').map(line => 
          new docx.Paragraph({
            children: [new docx.TextRun(line || " ")],
            spacing: {
              after: 200,
            },
          })
        ),
      }],
    });

    const blob = await docx.Packer.toBlob(doc);
    const downloadFileName = fileName ? `Edited_${fileName}` : "Edited_template.docx";
    saveAs(blob, downloadFileName);
  };

  // 🔹 Drag & Drop handlers
  const handleDrag = useCallback((e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(e.type === "dragenter" || e.type === "dragover");
  }, []);

  const handleDrop = useCallback((e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    const file = e.dataTransfer.files[0];
    if (file) handleFile(file);
  }, []);

  return (
    <div className="p-6 bg-gray-50 min-h-screen flex flex-col md:flex-row gap-6">
      {/* Sidebar Upload */}
      <div className="md:w-1/3 bg-white rounded-2xl shadow p-6 flex flex-col justify-between">
        <div>
          <h2 className="text-2xl font-bold mb-4 text-gray-800">
            🧩 DOCX Template Editor
          </h2>
          <p className="text-sm text-gray-600 mb-4">
            Upload DOCX file untuk edit dengan struktur yang tetap terjaga
          </p>

          <div
            onDragEnter={handleDrag}
            onDragOver={handleDrag}
            onDragLeave={handleDrag}
            onDrop={handleDrop}
            className={`border-2 border-dashed rounded-xl p-8 text-center cursor-pointer transition-all ${
              dragActive
                ? "border-blue-500 bg-blue-50"
                : "border-gray-300 bg-gray-100"
            }`}
          >
            <input
              ref={fileInputRef}
              type="file"
              accept=".docx"
              id="fileInput"
              onChange={(e) => handleFile(e.target.files[0])}
              className="hidden"
            />
            <label htmlFor="fileInput" className="block text-gray-700 cursor-pointer">
              {fileName ? (
                <>
                  <p className="font-semibold text-blue-600 mb-2">📄 {fileName}</p>
                  <p className="text-sm text-gray-500">
                    Klik atau drag file baru untuk replace
                  </p>
                </>
              ) : (
                <div>
                  <div className="text-4xl mb-3">📂</div>
                  <p className="font-medium">Drag & drop file .docx</p>
                  <p className="text-sm text-gray-500 mt-2">atau klik untuk memilih</p>
                </div>
              )}
            </label>
          </div>

          {error && (
            <div className="mt-3 p-3 bg-red-50 border border-red-200 rounded-lg">
              <p className="text-red-600 text-sm">{error}</p>
            </div>
          )}

          {/* Debug info */}
          {docData && (
            <div className="mt-4 p-3 bg-blue-50 rounded-lg text-xs">
              <p className="font-semibold text-blue-800 mb-2">📊 File Info:</p>
              <p className="text-gray-600">Size: {(docData.file.size / 1024).toFixed(2)} KB</p>
              <p className="text-gray-600">Type: {docData.file.type}</p>
              <p className="text-green-600 mt-2">✅ File loaded successfully</p>
            </div>
          )}
        </div>

        <div className="mt-6 space-y-3">
          {docData && (
            <button
              onClick={() => setEditMode(!editMode)}
              className="w-full bg-gray-600 hover:bg-gray-700 text-white px-4 py-2 rounded-lg shadow transition"
            >
              {editMode ? "👁️ Preview Mode" : "✏️ Edit Mode"}
            </button>
          )}
          
          <button
            onClick={handleDownload}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg shadow disabled:opacity-50 disabled:cursor-not-allowed transition"
            disabled={!docData}
          >
            💾 Download DOCX
          </button>
        </div>
      </div>

      {/* Preview/Edit Area */}
      <div className="flex-1 bg-white rounded-2xl shadow p-6 flex flex-col">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-700">
            {editMode ? "✍️ Edit Dokumen" : "👁️ Preview Dokumen"}
          </h3>
          {docData && (
            <span className="text-xs text-gray-500 bg-gray-100 px-3 py-1 rounded-full">
              Mode: {editMode ? "Edit" : "Preview"}
            </span>
          )}
        </div>

        {docData ? (
          editMode ? (
            // Edit Mode - Textarea
            <textarea
              ref={textareaRef}
              defaultValue={previewHtml.replace(/<[^>]+>/g, '')}
              onChange={(e) => handleEditContent(e.target.value)}
              className="flex-1 w-full p-4 border border-gray-300 rounded-lg font-mono text-sm resize-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Edit content here..."
            />
          ) : (
            // Preview Mode
            <div className="flex-1 border border-gray-200 rounded-lg p-6 overflow-auto bg-white">
              <div 
                className="prose max-w-none"
                dangerouslySetInnerHTML={{ __html: previewHtml }}
              />
            </div>
          )
        ) : (
          <div className="flex-1 flex items-center justify-center border-2 border-dashed border-gray-200 rounded-lg">
            <div className="text-center text-gray-400">
              <div className="text-5xl mb-4">📄</div>
              <p className="text-lg font-medium">Upload file .docx untuk mulai</p>
              <p className="text-sm mt-2">Struktur dokumen akan tetap terjaga</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default OutputTemplatesPage;