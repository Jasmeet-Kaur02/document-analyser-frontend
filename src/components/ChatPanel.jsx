import { useEffect, useRef, useState } from "react";

const ChatPanel = ({ onAsk, disabled }) => {
  const [messages, setMessages] = useState([
    {
      role: "assistant",
      content:
        "Hello! Upload a document and I'll help you understand it. You can ask me anything about its content.",
    },
  ]);

  const [question, setQuestion] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const bottomRef = useRef(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const message = question.trim();

    if (!message || loading || disabled) return;

    setError("");
    setQuestion("");

    setMessages((prev) => [...prev, { role: "user", content: message }]);

    setLoading(true);

    try {
      const result = await onAsk(message);

      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content: result.answer || "I couldn't generate an answer.",
          sources: result.sources || [],
        },
      ]);
    } catch (err) {
      setError(err.message || "Failed to get an answer.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex h-full min-h-[500px] flex-col rounded-2xl border border-slate-700 bg-slate-900">
      <div className="border-b border-slate-700 p-4">
        <h2 className="font-semibold text-white">Document Chat</h2>
        <p className="mt-1 text-xs text-slate-400">
          Ask questions based on your uploaded document
        </p>
      </div>

      <div className="flex-1 space-y-5 overflow-y-auto p-4">
        {messages.map((message, index) => (
          <div
            key={index}
            className={`flex ${
              message.role === "user" ? "justify-end" : "justify-start"
            }`}
          >
            <div
              className={`max-w-[85%] rounded-2xl px-4 py-3 ${
                message.role === "user"
                  ? "bg-violet-600 text-white"
                  : "bg-slate-800 text-slate-200"
              }`}
            >
              <p className="whitespace-pre-wrap text-sm leading-6">
                {message.content}
              </p>

              {message.sources?.length > 0 && (
                <div className="mt-3 border-t border-slate-600 pt-2">
                  <p className="mb-2 text-xs font-semibold text-slate-400">
                    Sources
                  </p>

                  {message.sources.map((source, i) => (
                    <p key={i} className="text-xs text-slate-400">
                      Chunk {source.chunkIndex ?? i + 1}
                      {source.pageNumber ? ` · Page ${source.pageNumber}` : ""}
                    </p>
                  ))}
                </div>
              )}
            </div>
          </div>
        ))}

        {loading && (
          <div className="text-sm text-slate-400">AI is thinking...</div>
        )}

        <div ref={bottomRef} />
      </div>

      {error && <p className="px-4 pb-2 text-sm text-red-400">{error}</p>}

      <form
        onSubmit={handleSubmit}
        className="flex gap-2 border-t border-slate-700 p-4"
      >
        <input
          value={question}
          onChange={(e) => setQuestion(e.target.value)}
          placeholder={
            disabled
              ? "Upload a document to start chatting..."
              : "Ask something about your document..."
          }
          disabled={disabled || loading}
          className="min-w-0 flex-1 rounded-xl border border-slate-700 bg-slate-800 px-4 py-3 text-sm text-white outline-none placeholder:text-slate-500 focus:border-violet-500 disabled:opacity-50"
        />

        <button
          type="submit"
          disabled={disabled || loading || !question.trim()}
          className="rounded-xl bg-violet-600 px-5 py-3 text-sm font-medium text-white hover:bg-violet-500 disabled:cursor-not-allowed disabled:opacity-50"
        >
          Send
        </button>
      </form>
    </div>
  );
};

export default ChatPanel;
