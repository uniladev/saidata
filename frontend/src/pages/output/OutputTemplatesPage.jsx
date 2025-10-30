import React, { useState, useCallback, useEffect, useRef } from "react";
import mammoth from "mammoth";
import { saveAs } from "file-saver";
import { asBlob } from "html-docx-js-typescript";
import { Editor } from "@tinymce/tinymce-react";

// 🔹 Import TinyMCE core dan plugin secara lokal (offline mode)
import "tinymce/tinymce";
import "tinymce/icons/default";
import "tinymce/themes/silver";
import "tinymce/models/dom";
import "tinymce/plugins/link";
import "tinymce/plugins/lists";
import "tinymce/plugins/table";
import "tinymce/plugins/code";

const OutputTemplatesPage = () => {
  const [docHtml, setDocHtml] = useState("");
  const [fileName, setFileName] = useState("");
  const [dragActive, setDragActive] = useState(false);
  const [error, setError] = useState("");
  const [editorReady, setEditorReady] = useState(false);

  const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5 MB

  const editorRef = useRef(null);

  // 🔹 Convert file DOCX → HTML pakai mammoth
  const handleFile = async (file) => {
    if (!file) return;
    if (file.size > MAX_FILE_SIZE) {
      setError("❌ File maksimal 5MB bro!");
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
      const result = await mammoth.convertToHtml({ arrayBuffer });
      console.log("🧩 Mammoth output:", result);
      console.log("🧩 HTML value:", result.value);

      const cleanHtml = result.value
        .replace(/<o:p>.*?<\/o:p>/g, "")
        .replace(/style="[^"]*mso-[^"]*"/g, "")
        .replace(/<span[^>]*>/g, "")
        .replace(/<\/span>/g, "");

      console.log("🧹 Cleaned HTML:", cleanHtml);
      setDocHtml(cleanHtml);
    } catch (err) {
      console.error(err);
      setError("Gagal membaca file DOCX 😭");
    }
  };

  // 🔹 Export HTML → DOCX baru
  const handleDownload = async () => {
    if (!docHtml) {
      setError("Belum ada konten untuk disimpan 😑");
      return;
    }

    try {
      const contentToSave = editorRef.current ? editorRef.current.getContent() : docHtml;

      // 🔥 tambahin await di sini
      const converted = await asBlob(`<!DOCTYPE html>
        <html>
          <head>
            <meta charset="UTF-8">
            <style>
              body { font-family: Arial, sans-serif; font-size: 12pt; line-height: 1.6; }
              p { margin: 0 0 10pt 0; }
              strong { font-weight: bold; }
            </style>
          </head>
          <body>${contentToSave}</body>
        </html>`);

      const downloadFileName = fileName ? `Edited_${fileName}` : "Edited_template.docx";
      saveAs(converted, downloadFileName);
      console.log("✅ File downloaded:", downloadFileName);
    } catch (err) {
      console.error("Download error:", err);
      setError("Gagal mendownload file 😭");
    }
  };


  // 🔹 Drag & Drop handler
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
            🧩 Template Editor
          </h2>

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
              type="file"
              accept=".docx"
              id="fileInput"
              onChange={(e) => handleFile(e.target.files[0])}
              className="hidden"
            />
            <label htmlFor="fileInput" className="block text-gray-700 cursor-pointer">
              {fileName ? (
                <>
                  <p className="font-semibold text-blue-600">{fileName}</p>
                  <p className="text-sm text-gray-500 mt-1">
                    Klik atau drag file baru
                  </p>
                </>
              ) : (
                <p>
                  📂 Drag & drop file .docx di sini
                  <br />
                  atau klik untuk memilih
                </p>
              )}
            </label>
          </div>

          {error && <p className="text-red-500 mt-3 text-sm">{error}</p>}
          
          {/* Debug info */}
          <div className="mt-4 p-3 bg-gray-100 rounded text-xs">
            <p><strong>Debug Info:</strong></p>
            <p>docHtml exists: {docHtml ? "✅ Yes" : "❌ No"}</p>
            <p>docHtml length: {docHtml.length} chars</p>
            <p>Editor ready: {editorReady ? "✅ Yes" : "❌ No"}</p>
          </div>
        </div>

        <div className="mt-6 flex justify-end">
          <button
            onClick={handleDownload}
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg shadow disabled:opacity-50 disabled:cursor-not-allowed"
            disabled={!docHtml}
          >
            💾 Download DOCX
          </button>
        </div>
      </div>

      {/* Editor */}
      <div className="flex-1 bg-white rounded-2xl shadow p-6 flex flex-col">
        <h3 className="text-lg font-semibold mb-3 text-gray-700">
          ✍️ Edit Dokumen
        </h3>
        
        {/* Show raw HTML preview as fallback */}
        {docHtml && !editorReady && (
          <div className="mb-4 p-4 bg-yellow-50 border border-yellow-200 rounded">
            <p className="text-sm text-yellow-800 mb-2">⏳ Loading editor...</p>
            <div className="text-xs text-gray-600 max-h-40 overflow-auto">
              <strong>HTML Preview:</strong>
              <div dangerouslySetInnerHTML={{ __html: docHtml }} />
            </div>
          </div>
        )}

        {docHtml ? (
          <>
            <div className="flex-1 border border-gray-300 rounded-lg overflow-hidden tinymce-wrapper">
              <style>{`
                .tinymce-wrapper {
                  min-height: 600px;
                  display: flex;
                  flex-direction: column;
                  border-radius: 12px;
                  overflow: hidden;
                }
                .tinymce-wrapper .tox.tox-tinymce {
                  visibility: visible !important;
                  height: 100% !important;
                  display: flex !important;
                  flex-direction: column !important;
                  border: none !important;
                  border-radius: 12px !important;
                  background: #fafafa !important;
                  box-shadow: 0 2px 10px rgba(0,0,0,0.05) !important;
                }
                .tinymce-wrapper .tox-editor-container {
                  display: flex !important;
                  flex-direction: column !important;
                  flex: 1 !important;
                }
                .tinymce-wrapper .tox-sidebar-wrap {
                  display: flex !important;
                  flex-direction: column !important;
                  flex: 1 !important;
                }
                .tinymce-wrapper .tox-edit-area {
                  flex: 1 !important;
                  display: flex !important;
                  flex-direction: column !important;
                }
                .tinymce-wrapper .tox-edit-area__iframe {
                  height: 100% !important;
                  min-height: 400px !important;
                  flex: 1 !important;
                }
                
                /* Menubar styling */
                .tinymce-wrapper .tox-menubar {
                  background: linear-gradient(to bottom, #ffffff 0%, #f9fafb 100%) !important;
                  border-bottom: 1px solid #e5e7eb !important;
                  padding: 6px 12px !important;
                  font-size: 13px !important;
                  display: flex !important;
                  justify-content: space-between !important;
                  align-items: center !important;
                  position: sticky;
                  top: 0;
                  z-index: 10;
                }
                .tinymce-wrapper .tox-mbtn {
                  color: #374151 !important;
                  font-weight: 500 !important;
                  font-size: 13px !important;
                  padding: 6px 10px !important;
                  border-radius: 6px !important;
                  transition: all 0.2s ease !important;
                }

                .tinymce-wrapper .tox-mbtn:hover {
                  background: rgba(37, 99, 235, 0.08) !important;
                  color: #1d4ed8 !important;
                }

                .tinymce-wrapper .tox-mbtn:focus {
                  background: rgba(59, 130, 246, 0.15) !important;
                  color: #2563eb !important;
                  outline: none !important;
                }

                .tinymce-wrapper .tox-mbtn--active {
                  background: rgba(37, 99, 235, 0.2) !important;
                  color: #1e3a8a !important;
                }
                
                /* Toolbar styling */
                .tinymce-wrapper .tox-toolbar {
                  background: #ffffff !important;
                  border-bottom: 1px solid #e5e7eb !important;
                  padding: 6px 10px !important;
                  gap: 6px !important;
                }
                .tinymce-wrapper .tox-toolbar__primary {
                  display: flex !important;
                  flex-wrap: wrap !important;
                  align-items: center !important;
                  gap: 8px !important;
                }
                .tinymce-wrapper .tox-tbtn {
                  color: #374151 !important;
                  border-radius: 6px !important;
                  padding: 6px !important;
                  transition: all 0.2s ease !important;
                }
                .tinymce-wrapper .tox-tbtn:hover {
                  background: #f3f4f6 !important;
                  color: #111827 !important;
                  transform: translateY(-1px) !important;
                }
                .tinymce-wrapper .tox-tbtn--enabled {
                  background: #dbeafe !important;
                  color: #1e40af !important;
                }
                .tinymce-wrapper .tox-edit-area__iframe {
                  background-color: #ffffff !important;
                  height: 100% !important;
                  min-height: 400px !important;
                  border-radius: 0 0 12px 12px !important;
                }
                  /* 📜 Dropdown Menu Styling (Fix background hilang) */
                .tinymce-wrapper .tox-menu {
                  background: #ffffff !important;
                  border: 1px solid #e5e7eb !important;
                  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08) !important;
                  border-radius: 8px !important;
                  padding: 4px 0 !important;
                  overflow: hidden !important;
                  z-index: 1000 !important;
                }

                .tinymce-wrapper .tox-collection__item {
                  background: transparent !important;
                  color: #374151 !important;
                  font-size: 13px !important;
                  padding: 6px 14px !important;
                  border-radius: 0 !important;
                  transition: all 0.15s ease-in-out !important;
                }

                .tinymce-wrapper .tox-collection__item:hover {
                  background: rgba(59, 130, 246, 0.1) !important;
                  color: #1e3a8a !important;
                }

                .tinymce-wrapper .tox-collection__item--active {
                  background: rgba(59, 130, 246, 0.15) !important;
                  color: #1d4ed8 !important;
                }

                /* Separator antar item */
                .tinymce-wrapper .tox-collection__item--separator {
                  border-top: 1px solid #e5e7eb !important;
                  margin: 4px 0 !important;
                }
                .tox .tox-menu {
                  background-color: #ffffff !important; /* putih bersih */
                  padding: 6px 4px !important;
                  border-radius: 8px !important;
                  border: 1px solid #ddd !important; /* kasih garis halus biar rapi */
                  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08) !important; /* biar ada depth dikit */
                  border-radius: 6px !important; /* lembut di ujung */
                  z-index: 9999 !important; /* pastiin di atas elemen lain */
                }

                .tox .tox-collection__item {
                  display: flex !important;
                  align-items: center !important;
                  gap: 8px !important; /* kasih jarak antara ikon dan teks */
                  padding: 8px 12px !important; /* biar ga dempet */
                  border-radius: 6px !important;
                  transition: background-color 0.2s ease;
                }
                .tox .tox-collection__item-icon {
                  width: 16px !important;
                  height: 16px !important;
                  flex-shrink: 0;
                  margin-right: 6px !important;
                  opacity: 0.8 !important;
                }
                .tox .tox-collection__item-label {
                  font-size: 13px !important;
                  color: #333 !important;
                  line-height: 1.4 !important;
                }
                .tox .tox-collection__item--active,
                .tox .tox-collection__item:hover,
                .tox .tox-collection__item--active {
                  background-color: #f0f0f0 !important;
}
                
              `}</style>
              <Editor
                key={fileName || "editor"}
                tinymceScriptSrc="/tinymce/tinymce.min.js"
                onInit={(evt, editor) => {
                  editorRef.current = editor;
                  setEditorReady(true);
                  console.log("✅ Editor initialized");
                  console.log("📝 Editor content:", editor.getContent());
                  
                  // Force visibility after init
                  const container = editor.getContainer();
                  if (container) {
                    container.style.visibility = 'visible';
                  }
                }}
                initialValue={docHtml}
                init={{
                  height: '100%',
                  menubar: true,
                  plugins: "lists link table code",
                  toolbar:
                    "undo redo | bold italic underline | bullist numlist | link table | code",
                  content_style: `
                                  body {
                                    font-family: 'Times New Roman', serif;
                                    font-size: 1rem; /* responsive */
                                    line-height: 1.6;
                                    margin: 0;
                                    padding: 0;
                                  }
                                  p {
                                    margin: 0 0 1.2em 0; /* spacing antar paragraf */
                                    text-indent: 2em; /* default indent */
                                  }
                                  h1, h2, h3 {
                                    margin: 1em 0;
                                  }
                                  ul, ol {
                                    margin: 0 0 1.2em 2em;
                                  }
                                  table {
                                    width: 100%;
                                    border-collapse: collapse;
                                  }
                                  td, th {
                                    padding: 0.3em 0.6em;
                                    border: 1px solid #ccc;
                                  }
                                `,
                  license_key: "gpl",
                  promotion: false,
                  branding: false,
                  setup: (editor) => {
                    console.log("🔧 TinyMCE setup called");
                    
                    // Force visibility on setup
                    editor.on('init', () => {
                      const container = editor.getContainer();
                      if (container) {
                        container.style.visibility = 'visible';
                      }
                    });
                  }
                }}
                onEditorChange={(content) => {
                  console.log("✏️ Content changed, length:", content.length);
                  setDocHtml(content);
                }}
              />
            </div>
            <p className="text-xs text-green-600 mt-2">
              ✅ HTML loaded ({docHtml.length} chars)
            </p>
          </>
        ) : (
          <div className="flex items-center justify-center h-96 text-gray-400 italic border-2 border-dashed border-gray-200 rounded-lg">
            Upload file .docx dulu untuk mulai ngedit 🧠
          </div>
        )}
      </div>
    </div>
  );
};

export default OutputTemplatesPage;