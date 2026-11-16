import { useRef, useState } from "react";

const DocumentUpload = ({ onUpload, uploading }) => {
  const inputRef = useRef(null);
  const [error, setError] = useState("");

  const handleFile = async (file) => {
    setError("");

    if (!file) return;

    const allowedTypes = [
      "application/pdf",
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
      "text/plain",
    ];

    const allowedExtensions = [".pdf", ".docx", ".txt"];
    const extension = file.name.toLowerCase().slice(file.name.lastIndexOf("."));

    if (
      !allowedTypes.includes(file.type) &&
      !allowedExtensions.includes(extension)
    ) {
      setError("Only PDF, DOCX and TXT files are supported.");
      return;
    }

    if (file.size > 15 * 1024 * 1024) {
      setError("File size must be less than 15MB.");
      return;
    }

    try {
      await onUpload(file);
    } catch (err) {
      setError(err.message);
    }

    if (inputRef.current) {
      inputRef.current.value = "";
    }
  };

  return (
    <div className="w-full">
      <div
        onClick={() => !uploading && inputRef.current?.click()}
        className="cursor-pointer rounded-2xl border-2 border-dashed border-slate-700 bg-slate-900/60 p-10 text-center transition hover:border-violet-500 hover:bg-slate-900"
      >
        <div className="mb-4 text-4xl">📄</div>

        <h3 className="text-lg font-semibold text-white">
          {uploading ? "Analyzing your document..." : "Upload your document"}
        </h3>

        <p className="mt-2 text-sm text-slate-400">
          Drag a file here or click to browse
        </p>

        <p className="mt-3 text-xs text-slate-500">
          PDF, DOCX, TXT · Maximum 15MB
        </p>

        {uploading && (
          <div className="mt-5 h-1.5 overflow-hidden rounded-full bg-slate-700">
            <div className="h-full w-2/3 animate-pulse rounded-full bg-violet-500" />
          </div>
        )}
      </div>

      <input
        ref={inputRef}
        type="file"
        accept=".pdf,.docx,.txt"
        hidden
        onChange={(e) => handleFile(e.target.files?.[0])}
        disabled={uploading}
      />

      {error && <p className="mt-3 text-sm text-red-400">{error}</p>}
    </div>
  );
};

export default DocumentUpload;
