import { useState } from "react";

import DocumentUpload from "./components/DocumentUpload";
import DocumentInfo from "./components/DocumentInfo";
import ChatPanel from "./components/ChatPanel";

import { uploadDocument, deleteDocument, askQuestion } from "./services/api";

const App = () => {
  const [document, setDocument] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [error, setError] = useState("");

  // Upload document
  const handleUpload = async (file) => {
    setUploading(true);
    setError("");

    try {
      const response = await uploadDocument(file);

      // Supports common response formats:
      // { data: { document: {...} } }
      // { data: {...} }
      // { document: {...} }
      const uploadedDocument =
        response.data?.document ||
        response.document ||
        response.data ||
        response;

      setDocument(uploadedDocument);
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setUploading(false);
    }
  };

  // Delete document
  const handleDelete = async () => {
    const documentId = document?._id || document?.id;

    if (!documentId) return;

    setDeleting(true);
    setError("");

    try {
      await deleteDocument(documentId);
      setDocument(null);
    } catch (err) {
      setError(err.message);
    } finally {
      setDeleting(false);
    }
  };

  // Ask AI
  const handleAsk = async (message) => {
    const documentId = document?._id || document?.id;

    if (!documentId) {
      throw new Error("Please upload a document first.");
    }

    const response = await askQuestion(documentId, message);

    const result = response.data || response;

    return {
      answer: result.answer || "",
      sources: result.sources || [],
    };
  };

  const hasDocument = Boolean(document?._id || document?.id);

  return (
    <div className="min-h-screen bg-slate-950 text-white">
      <header className="border-b border-slate-800 px-6 py-5">
        <div className="mx-auto flex max-w-7xl items-center justify-between">
          <h1 className="text-xl font-bold">
            <span className="text-violet-500">Docu</span>Mind AI
          </h1>

          <span className="text-xs text-slate-400">AI Document Analyser</span>
        </div>
      </header>

      <main className="mx-auto max-w-7xl px-6 py-10">
        <div className="mb-8">
          <h2 className="text-3xl font-bold">
            Understand your documents with AI.
          </h2>

          <p className="mt-3 text-slate-400">
            Upload a document, get its summary, and ask questions about its
            content.
          </p>
        </div>

        {!hasDocument && (
          <div className="mx-auto max-w-2xl">
            <DocumentUpload onUpload={handleUpload} uploading={uploading} />
          </div>
        )}

        {error && (
          <div className="mt-5 rounded-xl border border-red-500/30 bg-red-500/10 p-4 text-sm text-red-400">
            {error}
          </div>
        )}

        {hasDocument && (
          <div className="space-y-6">
            <DocumentInfo document={document} onDelete={handleDelete} />

            {deleting && (
              <p className="text-sm text-slate-400">Removing document...</p>
            )}

            {document.summary && (
              <section className="rounded-2xl border border-slate-700 bg-slate-900 p-6">
                <h3 className="mb-3 text-lg font-semibold">Document Summary</h3>

                <p className="whitespace-pre-wrap text-sm leading-7 text-slate-300">
                  {document.summary}
                </p>
              </section>
            )}

            <ChatPanel
              key={document._id || document.id}
              onAsk={handleAsk}
              disabled={deleting}
            />
          </div>
        )}
      </main>
    </div>
  );
};

export default App;
