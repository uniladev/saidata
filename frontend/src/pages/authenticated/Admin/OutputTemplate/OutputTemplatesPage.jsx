import React, { useState, useCallback, useEffect, useRef, useMemo } from "react";
import mammoth from "mammoth";
import { AlertTriangle, Copy, Check, Code2, Search, Info } from "lucide-react";

// Memoized DocumentPreview component to prevent unnecessary re-renders
const DocumentPreview = React.memo(({ docContent, loading, contentRef }) => {
  if (loading) {
    return (
      <div className="flex items-center justify-center h-96 p-8">
        <div className="text-center space-y-3">
          <div className="animate-spin text-4xl">📄</div>
          <p className="text-sm font-medium text-gray-700">
            Processing template...
          </p>
        </div>
      </div>
    );
  }

  if (docContent) {
    return (
      <div className="h-full overflow-auto bg-gray-50" style={{ maxHeight: '85vh' }}>
        <div className="max-w-4xl mx-auto p-6">
          <div className="bg-white border border-gray-200 rounded-lg p-8 min-h-screen">
            <div 
              ref={contentRef}
              className="document-content"
              dangerouslySetInnerHTML={{ __html: docContent }}
            />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex items-center justify-center h-96">
      <div className="text-center text-gray-400 p-8">
        <div className="text-6xl mb-3">📄</div>
        <p className="text-sm font-medium text-gray-600">
          No Template Loaded
        </p>
        <p className="text-xs text-gray-500 mt-1">
          Upload a template to preview
        </p>
      </div>
    </div>
  );
});

DocumentPreview.displayName = 'DocumentPreview';

// Memoized VariableCard component
const VariableCard = React.memo(({ item, copiedVar, onCopy }) => {
  const isCopied = copiedVar === item.var;
  
  return (
    <div
      className="group bg-white hover:bg-gray-50 rounded-lg p-3 border border-gray-200 
                 hover:border-gray-300 transition-all cursor-pointer"
      onClick={() => onCopy(item.var)}
    >
      <div className="flex items-start justify-between gap-3">
        <div className="flex-1 min-w-0">
          <code className="text-xs font-mono font-medium text-gray-900 break-all">
            {item.var}
          </code>
          <p className="text-xs text-gray-600 mt-1.5 leading-relaxed">
            {item.desc}
          </p>
          <p className="text-xs text-gray-400 mt-1">
            <span className="font-medium">Example:</span> {item.example}
          </p>
        </div>
        <button
          onClick={(e) => {
            e.stopPropagation();
            onCopy(item.var);
          }}
          className="flex-shrink-0 p-1.5 hover:bg-gray-100 rounded transition-colors"
        >
          {isCopied ? (
            <Check className="w-4 h-4 text-green-600" />
          ) : (
            <Copy className="w-4 h-4 text-gray-400 group-hover:text-gray-900" />
          )}
        </button>
      </div>
    </div>
  );
});

VariableCard.displayName = 'VariableCard';

const OutputTemplatesPage = () => {
  const [docContent, setDocContent] = useState("");
  const [fileName, setFileName] = useState("");
  const [dragActive, setDragActive] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [rawFile, setRawFile] = useState(null);
  const [copiedVar, setCopiedVar] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  
  const contentRef = useRef(null);
  const searchTimeoutRef = useRef(null);

  const MAX_FILE_SIZE = 10 * 1024 * 1024;

  // Memoize template variables (static data)
  const templateVariables = useMemo(() => ({
    "Form Information": [
      { var: "${form_title}", desc: "Form title", example: "Service Request Form" },
      { var: "${form_id}", desc: "Unique form identifier", example: "FRM-001" },
      { var: "${form_type}", desc: "Form type (service/record)", example: "service" },
      { var: "${created_date}", desc: "Form creation date", example: "2025-01-15" },
      { var: "${updated_date}", desc: "Last update date", example: "2025-01-20" },
    ],
    "User Information": [
      { var: "${user_name}", desc: "Full name of submitter", example: "John Doe" },
      { var: "${user_email}", desc: "Email address", example: "john@example.com" },
      { var: "${user_id}", desc: "User ID", example: "USR-12345" },
      { var: "${user_role}", desc: "User role", example: "Student/Staff/Admin" },
      { var: "${submission_date}", desc: "Date of submission", example: "2025-01-25" },
      { var: "${submission_time}", desc: "Time of submission", example: "14:30:00" },
    ],
    "Dynamic Fields": [
      { var: "${field_name}", desc: "Replace 'field_name' with actual field name", example: "${full_name}, ${address}" },
      { var: "${field_name_label}", desc: "Field label text", example: "Full Name" },
      { var: "${field_name_value}", desc: "Field submitted value", example: "John Doe" },
    ],
    "System Variables": [
      { var: "${current_date}", desc: "Current date", example: "2025-01-25" },
      { var: "${current_time}", desc: "Current time", example: "14:30:00" },
      { var: "${system_name}", desc: "System name", example: "Saidata Unila" },
      { var: "${department}", desc: "Department name", example: "FMIPA" },
    ],
    "Conditional/Loops": [
      { var: "{#items}...{/items}", desc: "Loop through items", example: "For repeating sections" },
      { var: "{?condition}...{/condition}", desc: "Conditional display", example: "Show if condition met" },
      { var: "{^condition}...{/condition}", desc: "Inverse conditional", example: "Show if condition not met" },
    ],
  }), []);

  // Debounce search input
  useEffect(() => {
    if (searchTimeoutRef.current) {
      clearTimeout(searchTimeoutRef.current);
    }
    
    searchTimeoutRef.current = setTimeout(() => {
      setDebouncedSearch(searchTerm);
    }, 300);

    return () => {
      if (searchTimeoutRef.current) {
        clearTimeout(searchTimeoutRef.current);
      }
    };
  }, [searchTerm]);

  // Filter variables based on debounced search - memoized
  const filteredVariables = useMemo(() => {
    return Object.entries(templateVariables).reduce((acc, [category, vars]) => {
      const filtered = vars.filter(v => 
        v.var.toLowerCase().includes(debouncedSearch.toLowerCase()) ||
        v.desc.toLowerCase().includes(debouncedSearch.toLowerCase())
      );
      if (filtered.length > 0) {
        acc[category] = filtered;
      }
      return acc;
    }, {});
  }, [debouncedSearch, templateVariables]);

  // Copy variable - useCallback to prevent recreation
  const copyVariable = useCallback((varText) => {
    navigator.clipboard.writeText(varText);
    setCopiedVar(varText);
    setTimeout(() => setCopiedVar(null), 2000);
  }, []);

  // Apply formatting - only runs when docContent changes
  useEffect(() => {
    if (docContent && contentRef.current) {
      const boldElements = contentRef.current.querySelectorAll('strong, b');
      boldElements.forEach(el => {
        el.style.fontWeight = '700';
      });
      
      const headings = contentRef.current.querySelectorAll('h1, h2, h3, h4, h5, h6');
      headings.forEach(el => {
        el.style.fontWeight = '700';
      });
    }
  }, [docContent]);

  // Convert DOCX - useCallback to prevent recreation
  const handleFile = useCallback(async (file) => {
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
          "p[style-name='Normal'] => p:fresh",
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
      
      let html = result.value;
      html = html.replace(/<o:p>.*?<\/o:p>/g, "");
      
      setDocContent(html);
      setLoading(false);
      
    } catch (err) {
      console.error("❌ Error:", err);
      setError("Gagal membaca file DOCX");
      setLoading(false);
    }
  }, []);

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
  }, [handleFile]);

  const handleDownload = useCallback(() => {
    if (!rawFile) return;
    const url = URL.createObjectURL(rawFile);
    const a = document.createElement("a");
    a.href = url;
    a.download = fileName;
    a.click();
    URL.revokeObjectURL(url);
  }, [rawFile, fileName]);

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-6">
      <div className="max-w-[1800px] mx-auto">
        
        {/* Header */}
        <div className="mb-6">
          <h1 className="text-2xl font-semibold text-gray-900 mb-1">
            Output Template Manager
          </h1>
          <p className="text-sm text-gray-600">
            Upload template dan gunakan variabel untuk generate output otomatis
          </p>
        </div>

        <div className="grid grid-cols-1 xl:grid-cols-12 gap-6">
          
          {/* Left - Upload */}
          <div className="xl:col-span-3">
            <div className="bg-white border border-gray-200 rounded-lg p-5 sticky top-6 space-y-4">
              
              {/* Upload Zone */}
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-2">
                  Template File
                </label>
                <div
                  onDragEnter={handleDrag}
                  onDragOver={handleDrag}
                  onDragLeave={handleDrag}
                  onDrop={handleDrop}
                  className={`
                    border-2 border-dashed rounded-lg p-6 text-center 
                    cursor-pointer transition-all
                    ${dragActive 
                      ? "border-gray-900 bg-gray-50" 
                      : "border-gray-300 hover:border-gray-400 hover:bg-gray-50"
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
                        <div className="text-3xl">📄</div>
                        <p className="font-medium text-gray-900 text-sm break-words">
                          {fileName}
                        </p>
                        <p className="text-xs text-gray-500">
                          Click to replace
                        </p>
                      </div>
                    ) : (
                      <div className="space-y-2">
                        <div className="text-4xl">📁</div>
                        <p className="text-sm font-medium text-gray-700">
                          Drop .docx file here
                        </p>
                        <p className="text-xs text-gray-500">
                          or click to browse
                        </p>
                      </div>
                    )}
                  </label>
                </div>
              </div>

              {/* Warning */}
              {docContent && (
                <div className="bg-amber-50 border border-amber-200 rounded-lg p-3">
                  <div className="flex gap-2">
                    <Info className="w-4 h-4 text-amber-600 flex-shrink-0 mt-0.5" />
                    <div>
                      <p className="text-xs font-medium text-amber-900 mb-1">
                        Preview Notice
                      </p>
                      <p className="text-xs text-amber-700 leading-relaxed">
                        Structure may not be 100% accurate. Download original for precise formatting.
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {error && (
                <div className="bg-red-50 border border-red-200 rounded-lg p-3">
                  <p className="text-xs text-red-700">{error}</p>
                </div>
              )}

              {/* Actions */}
              {docContent && (
                <div className="space-y-2 pt-2 border-t border-gray-200">
                  <div className="text-xs text-gray-600">
                    <span className="font-medium text-gray-900">Size:</span> {(docContent.length / 1024).toFixed(1)}KB
                  </div>
                  <button
                    onClick={handleDownload}
                    className="w-full bg-gray-900 hover:bg-gray-800 text-white px-4 py-2 
                             rounded-lg text-sm font-medium transition-colors"
                  >
                    Download Template
                  </button>
                </div>
              )}

              {/* Guide */}
              <div className="pt-4 border-t border-gray-200">
                <h4 className="text-xs font-medium text-gray-900 mb-3">
                  How to use
                </h4>
                <ol className="text-xs text-gray-600 space-y-2">
                  <li className="flex gap-2">
                    <span className="font-medium text-gray-900">1.</span>
                    <span>Upload your DOCX template</span>
                  </li>
                  <li className="flex gap-2">
                    <span className="font-medium text-gray-900">2.</span>
                    <span>Copy variables from the list</span>
                  </li>
                  <li className="flex gap-2">
                    <span className="font-medium text-gray-900">3.</span>
                    <span>Paste into Word document</span>
                  </li>
                  <li className="flex gap-2">
                    <span className="font-medium text-gray-900">4.</span>
                    <span>System auto-replaces on output</span>
                  </li>
                </ol>
              </div>
            </div>
          </div>

          {/* Middle - Variables */}
          <div className="xl:col-span-4">
            <div className="bg-white border border-gray-200 rounded-lg overflow-hidden sticky top-6" 
                 style={{ maxHeight: '85vh' }}>
              
              {/* Header */}
              <div className="bg-white border-b border-gray-200 p-4">
                <div className="flex items-center justify-between mb-3">
                  <h2 className="text-sm font-semibold text-gray-900 flex items-center gap-2">
                    <Code2 className="w-4 h-4" />
                    Available Variables
                  </h2>
                  <span className="text-xs text-gray-500">
                    {Object.values(filteredVariables).flat().length} variables
                  </span>
                </div>

                {/* Search */}
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <input
                    type="text"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    placeholder="Search variables..."
                    className="w-full pl-9 pr-3 py-2 text-sm border border-gray-300 rounded-lg 
                             focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent"
                  />
                </div>
              </div>

              {/* Variables List */}
              <div className="p-4 overflow-auto" style={{ maxHeight: 'calc(85vh - 130px)' }}>
                {Object.keys(filteredVariables).length === 0 ? (
                  <div className="text-center py-12 text-gray-400">
                    <Search className="w-8 h-8 mx-auto mb-2 opacity-50" />
                    <p className="text-sm">No variables found</p>
                  </div>
                ) : (
                  <div className="space-y-6">
                    {Object.entries(filteredVariables).map(([category, vars]) => (
                      <div key={category}>
                        <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-3">
                          {category}
                        </h3>
                        <div className="space-y-2">
                          {vars.map((item, idx) => (
                            <VariableCard
                              key={`${category}-${idx}`}
                              item={item}
                              copiedVar={copiedVar}
                              onCopy={copyVariable}
                            />
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Right - Preview */}
          <div className="xl:col-span-5">
            <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
              <DocumentPreview 
                docContent={docContent}
                loading={loading}
                contentRef={contentRef}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Styles */}
      <style>{`
        .document-content {
          font-family: 'Calibri', 'Segoe UI', Arial, sans-serif;
          font-size: 11pt;
          line-height: 1.6;
          color: #000;
        }

        .document-content strong,
        .document-content b {
          font-weight: 700 !important;
        }

        .document-content h1,
        .document-content h2,
        .document-content h3,
        .document-content h4 {
          font-weight: 700 !important;
          color: #000;
        }

        .document-content h1 { font-size: 20pt; margin: 18pt 0 10pt 0; }
        .document-content h2 { font-size: 16pt; margin: 16pt 0 8pt 0; }
        .document-content h3 { font-size: 14pt; margin: 14pt 0 6pt 0; }
        .document-content h4 { font-size: 12pt; margin: 12pt 0 6pt 0; }

        .document-content p {
          margin: 0 0 10pt 0;
        }

        .document-content img {
          max-width: 100%;
          height: auto;
          display: block;
          margin: 10pt auto;
        }

        .document-content ul,
        .document-content ol {
          margin: 0 0 10pt 0;
          padding-left: 40pt;
        }

        .document-content li {
          margin: 0 0 6pt 0;
        }

        .document-content table {
          border-collapse: collapse;
          margin: 10pt 0;
          width: 100%;
        }

        .document-content td,
        .document-content th {
          border: 1px solid #666;
          padding: 4pt 8pt;
        }

        .document-content th {
          font-weight: 700 !important;
          background-color: #f0f0f0;
        }

        /* Scrollbar */
        .overflow-auto::-webkit-scrollbar {
          width: 6px;
        }

        .overflow-auto::-webkit-scrollbar-track {
          background: #f9fafb;
        }

        .overflow-auto::-webkit-scrollbar-thumb {
          background: #d1d5db;
          border-radius: 3px;
        }

        .overflow-auto::-webkit-scrollbar-thumb:hover {
          background: #9ca3af;
        }
      `}</style>
    </div>
  );
};

export default OutputTemplatesPage;