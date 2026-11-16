const DocumentInfo = ({ document, onDelete }) => {
  if (!document) return null;

  const fileName =
    document.originalName || document.title || "Uploaded document";

  return (
    <div className="flex items-center justify-between gap-4 rounded-xl border border-slate-700 bg-slate-900 p-4">
      <div className="flex min-w-0 items-center gap-3">
        <div className="text-3xl">📄</div>

        <div className="min-w-0">
          <h3 className="truncate font-medium text-white">{fileName}</h3>

          <p className="mt-1 text-xs text-slate-400">
            {document.fileType || "Document"} · {document.totalChunks ?? 0}{" "}
            chunks
          </p>
        </div>
      </div>

      <button
        onClick={onDelete}
        className="shrink-0 rounded-lg px-3 py-2 text-sm text-red-400 hover:bg-red-500/10"
      >
        Remove
      </button>
    </div>
  );
};

export default DocumentInfo;
