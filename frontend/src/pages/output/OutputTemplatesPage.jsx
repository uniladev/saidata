import React, { useState, useCallback, useEffect, useRef } from "react";
import mammoth from "mammoth";

const OutputTemplatesPage = () => {
  const [docContent, setDocContent] = useState("");
  const [fileName, setFileName] = useState("");
  const [dragActive, setDragActive] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [rawFile, setRawFile] = useState(null);
  
  const contentRef = useRef(null);

  const MAX_FILE_SIZE = 10 * 1024 * 1024;

  // 🔹 Fix bold rendering after content loads
  useEffect(() => {
    if (docContent && contentRef.current) {
      // Force bold on all strong/b tags
      const boldElements = contentRef.current.querySelectorAll('strong, b');
      boldElements.forEach(el => {
        el.style.fontWeight = '700';
      });
      
      // Force bold on headings
      const headings = contentRef.current.querySelectorAll('h1, h2, h3, h4, h5, h6');
      headings.forEach(el => {
        el.style.fontWeight = '700';
      });
      
      console.log(`✅ Applied bold to ${boldElements.length} elements`);
    }
  }, [docContent]);

  // 🔹 Convert DOCX
  const handleFile = async (file) => {
    if (!file) return;
    
    if (file.size > MAX_FILE_SIZE) {
      setError("❌ File maksimal 10MB!");
      return;
    }
    
    if (!file.name.endsWith(".docx")) {
      setError("⚠️ File harus format .docx");
      return;
    }

    try {
      setLoading(true);
      setError("");
      setFileName(file.name);
      setRawFile(file);
      
      const arrayBuffer = await file.arrayBuffer();
      
      const options = {
        styleMap: [
          "b => strong",
          "strong => strong",
          "p[style-name='Heading 1'] => h1:fresh",
          "p[style-name='Heading 2'] => h2:fresh",
          "p[style-name='Heading 3'] => h3:fresh",
          "p[style-name='Heading 4'] => h4:fresh",
          "p[style-name='Title'] => h1.doc-title:fresh",
          "p[style-name='Subtitle'] => h2.doc-subtitle:fresh",
          "p[style-name='Normal'] => p.doc-normal:fresh",
        ],
        convertImage: mammoth.images.imgElement((image) => {
          return image.read("base64").then((imageBuffer) => {
            return {
              src: `data:${image.contentType};base64,${imageBuffer}`
            };
          });
        }),
        includeDefaultStyleMap: true,
      };

      const result = await mammoth.convertToHtml({ arrayBuffer }, options);
      
      console.log("📄 Conversion complete");
      console.log("HTML sample:", result.value.substring(0, 500));
      
      let html = result.value;
      html = html.replace(/<o:p>.*?<\/o:p>/g, "");
      
      setDocContent(html);
      setLoading(false);
      
    } catch (err) {
      console.error("❌ Error:", err);
      setError("Gagal membaca file DOCX");
      setLoading(false);
    }
  };

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

  const handleDownload = () => {
    if (!rawFile) return;
    const url = URL.createObjectURL(rawFile);
    const a = document.createElement("a");
    a.href = url;
    a.download = fileName;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 p-4 md:p-6">
      <div className="max-w-7xl mx-auto">
        
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-gray-800 mb-2">
            📄 Document Viewer (Mammoth)
          </h1>
          <p className="text-gray-600 text-sm">
            Preview with enhanced bold rendering
          </p>
        </div>

        <div className="flex flex-col lg:flex-row gap-6">
          
          {/* 📂 Sidebar */}
          <div className="lg:w-80 flex-shrink-0">
            <div className="bg-white rounded-2xl shadow-lg p-6 sticky top-6">
              
              <div
                onDragEnter={handleDrag}
                onDragOver={handleDrag}
                onDragLeave={handleDrag}
                onDrop={handleDrop}
                className={`
                  border-2 border-dashed rounded-xl p-8 text-center 
                  cursor-pointer transition-all duration-300
                  ${dragActive 
                    ? "border-blue-500 bg-blue-50 scale-105 shadow-lg" 
                    : "border-gray-300 bg-gray-50 hover:border-blue-400 hover:bg-blue-50"
                  }
                `}
              >
                <input
                  type="file"
                  accept=".docx"
                  id="fileInput"
                  onChange={(e) => handleFile(e.target.files[0])}
                  className="hidden"
                />
                <label htmlFor="fileInput" className="block cursor-pointer">
                  {fileName ? (
                    <div className="space-y-2">
                      <div className="text-5xl">📗</div>
                      <p className="font-semibold text-blue-600 break-words text-sm px-2">
                        {fileName}
                      </p>
                      <p className="text-xs text-gray-500">
                        Click to change file
                      </p>
                    </div>
                  ) : (
                    <div className="space-y-3">
                      <div className="text-6xl">📂</div>
                      <p className="text-base font-semibold text-gray-700">
                        Drop DOCX here
                      </p>
                      <p className="text-sm text-gray-500">
                        or click to browse
                      </p>
                    </div>
                  )}
                </label>
              </div>

              {error && (
                <div className="mt-4 p-3 bg-red-50 border-l-4 border-red-500 rounded">
                  <p className="text-red-600 text-sm font-medium">{error}</p>
                </div>
              )}

              {docContent && (
                <div className="mt-6 space-y-3">
                  <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
                    <div className="flex items-center gap-2">
                      <span className="text-xl">✅</span>
                      <div>
                        <p className="text-sm font-semibold text-green-700">
                          Preview Ready
                        </p>
                        <p className="text-xs text-green-600">
                          {(docContent.length / 1024).toFixed(1)}KB
                        </p>
                      </div>
                    </div>
                  </div>
                  
                  <button
                    onClick={handleDownload}
                    className="w-full bg-blue-600 hover:bg-blue-700 text-white 
                             px-4 py-3 rounded-lg shadow-md transition-all
                             font-semibold flex items-center justify-center gap-2"
                  >
                    <span>💾</span>
                    Download Original
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* 📖 Preview Area */}
          <div className="flex-1">
            <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
              
              {loading ? (
                <div className="flex items-center justify-center h-96 p-8">
                  <div className="text-center space-y-4">
                    <div className="animate-spin text-6xl">📄</div>
                    <p className="text-gray-700 font-semibold text-lg">
                      Processing document...
                    </p>
                  </div>
                </div>
                
              ) : docContent ? (
                <div className="h-full overflow-auto bg-gray-50" style={{ maxHeight: '85vh' }}>
                  
                  <div className="max-w-4xl mx-auto p-6 md:p-10">
                    <div 
                      className="bg-white shadow-lg rounded-lg p-8 md:p-12 min-h-screen"
                      style={{
                        boxShadow: '0 0 0 1px rgba(0,0,0,0.05), 0 2px 8px rgba(0,0,0,0.08)'
                      }}
                    >
                      {/* Document Content */}
                      <div 
                        ref={contentRef}
                        className="document-content"
                        dangerouslySetInnerHTML={{ __html: docContent }}
                      />
                    </div>
                  </div>
                </div>
                
              ) : (
                <div className="flex items-center justify-center h-96">
                  <div className="text-center text-gray-400 p-8">
                    <div className="text-7xl mb-4">📄</div>
                    <p className="text-xl font-semibold text-gray-600">
                      No Document Loaded
                    </p>
                    <p className="text-sm mt-2 text-gray-500">
                      Upload a .docx file to view
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* 🎨 BULLETPROOF Styling */}
      <style>{`
        /* Reset any interference */
        .document-content * {
          all: revert;
        }

        /* Base styles */
        .document-content {
          font-family: 'Calibri', 'Segoe UI', Arial, sans-serif !important;
          font-size: 11pt !important;
          line-height: 1.6 !important;
          color: #000 !important;
        }

        /* FORCE BOLD - Nuclear option */
        .document-content strong,
        .document-content b,
        .document-content strong *,
        .document-content b * {
          font-weight: 700 !important;
          font-family: 'Calibri', 'Segoe UI', Arial, sans-serif !important;
        }

        /* Headings - BOLD by default */
        .document-content h1,
        .document-content h2,
        .document-content h3,
        .document-content h4,
        .document-content h5,
        .document-content h6 {
          font-weight: 700 !important;
          color: #000 !important;
          font-family: 'Calibri', 'Segoe UI', Arial, sans-serif !important;
        }

        .document-content h1 {
          font-size: 20pt !important;
          margin: 18pt 0 10pt 0 !important;
        }

        .document-content h2 {
          font-size: 16pt !important;
          margin: 16pt 0 8pt 0 !important;
        }

        .document-content h3 {
          font-size: 14pt !important;
          margin: 14pt 0 6pt 0 !important;
        }

        /* Paragraphs */
        .document-content p {
          margin: 0 0 10pt 0 !important;
          font-size: 11pt !important;
        }

        /* Images */
        .document-content img {
          max-width: 100% !important;
          height: auto !important;
          display: block !important;
          margin: 10pt auto !important;
        }

        /* Lists */
        .document-content ul,
        .document-content ol {
          margin: 0 0 10pt 0 !important;
          padding-left: 40pt !important;
        }

        .document-content li {
          margin: 0 0 6pt 0 !important;
        }

        /* Tables */
        .document-content table {
          border-collapse: collapse !important;
          margin: 10pt 0 !important;
          width: 100% !important;
        }

        .document-content td,
        .document-content th {
          border: 1px solid #666 !important;
          padding: 4pt 8pt !important;
        }

        .document-content th {
          font-weight: 700 !important;
          background-color: #f0f0f0 !important;
        }
      `}</style>
    </div>
  );
};

export default OutputTemplatesPage;