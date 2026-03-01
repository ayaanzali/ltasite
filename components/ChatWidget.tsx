"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

export function ChatWidget() {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<
    { role: "user" | "assistant"; content: string }[]
  >(() => [
    {
      role: "assistant",
      content:
        "Hi! I am the LTA assistant. Ask me about our events, mock trial competition, how to join, or anything else about the Law and Trial Association at UTD.",
    },
  ]);
  const [conversationHistory, setConversationHistory] = useState<
    { role: "user" | "assistant"; content: string }[]
  >([]);
  const [leadCaptured, setLeadCaptured] = useState(false);
  const [leadName, setLeadName] = useState<string | null>(null);
  const [leadRecordId, setLeadRecordId] = useState<string | null>(null);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);
  const panelId = useMemo(() => "lta-assistant-panel", []);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  useEffect(() => {
    if (!open) return;
    // ensure scroll after opening
    setTimeout(() => bottomRef.current?.scrollIntoView({ behavior: "smooth" }), 50);
  }, [open]);

  useEffect(() => {
    const handler = () => setOpen(true);
    window.addEventListener("open-lta-chat", handler);
    return () => window.removeEventListener("open-lta-chat", handler);
  }, []);

  const send = async () => {
    const text = input.trim();
    if (!text || loading) return;
    setInput("");
    setMessages((m) => [...m, { role: "user", content: text }]);
    setLoading(true);
    const historyWithUser = [...conversationHistory, { role: "user" as const, content: text }];
    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message: text,
          conversationHistory: historyWithUser,
          leadCaptured,
          leadName,
          leadRecordId,
        }),
      });
      const data = await res.json();
      const reply = data.reply ?? data.message ?? "Sorry, I couldn't get a response.";
      setMessages((m) => [...m, { role: "assistant", content: reply }]);
      setConversationHistory([
        ...historyWithUser,
        { role: "assistant", content: reply },
      ]);
      if (data.leadJustCaptured) {
        setLeadCaptured(true);
        if (data.capturedName != null) setLeadName(data.capturedName);
      }
      if (data.leadRecordId != null) setLeadRecordId(data.leadRecordId);
    } catch {
      setMessages((m) => [
        ...m,
        { role: "assistant", content: "Something went wrong. Try again in a moment." },
      ]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {/* Trigger button */}
      <motion.button
        type="button"
        onClick={() => setOpen((o) => !o)}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.45, delay: 2 }}
        whileHover={{ y: -2 }}
        whileTap={{ scale: 0.98 }}
        className="fixed bottom-6 right-6 z-40 rounded-full px-5 py-3 bg-[#1D2A3F] border border-white/20 shadow-lg flex items-center gap-3 hover:bg-[#2A3A52] transition-colors"
        aria-controls={panelId}
        aria-expanded={open}
      >
        <span className="relative w-2.5 h-2.5">
          {/* Pulse rings */}
          <motion.span
            className="absolute inset-0 rounded-full border border-[#2D5BE3]"
            animate={{ scale: [1, 2.6], opacity: [0.6, 0] }}
            transition={{ duration: 1.6, repeat: Infinity, ease: "easeOut" }}
          />
          <motion.span
            className="absolute inset-0 rounded-full border border-[#2D5BE3]"
            animate={{ scale: [1, 2.6], opacity: [0.6, 0] }}
            transition={{ duration: 1.6, repeat: Infinity, ease: "easeOut", delay: 0.4 }}
          />
          <span className="absolute inset-0 rounded-full bg-[#2D5BE3]" />
        </span>
        <span className="text-white font-medium text-sm">Ask LTA</span>
      </motion.button>

      <AnimatePresence>
        {open && (
          <motion.div
            id={panelId}
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 24 }}
            transition={{ type: "spring", damping: 24, stiffness: 260 }}
            className="fixed bottom-24 right-6 z-40 w-[380px] max-w-[90vw] rounded-2xl overflow-hidden shadow-2xl flex flex-col"
            style={{ height: "min(520px, 70vh)" }}
          >
            {/* Header */}
            <div className="bg-[#1D2A3F] px-4 py-3 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <span className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center">
                  <svg
                    className="w-5 h-5 text-white"
                    viewBox="0 0 40 40"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                    aria-hidden
                  >
                    <circle cx="20" cy="20" r="19" stroke="currentColor" strokeWidth="1.5" />
                    <path
                      d="M20 12v16M14 20h12"
                      stroke="currentColor"
                      strokeWidth="1.5"
                      strokeLinecap="round"
                    />
                    <circle cx="20" cy="20" r="2.5" fill="currentColor" />
                    <path
                      d="M12 14l4 4-4 4M28 14l-4 4 4 4"
                      stroke="currentColor"
                      strokeWidth="1.2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </span>
                <div className="leading-tight">
                  <div className="flex items-center gap-2">
                    <span className="font-semibold text-white">LTA Assistant</span>
                    <span className="inline-flex items-center gap-1 text-gray-400 text-xs">
                      <span className="w-2 h-2 rounded-full bg-green-500" />
                      Online
                    </span>
                  </div>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setOpen(false)}
                className="text-white/80 hover:text-white p-2"
                aria-label="Close chat"
              >
                ✕
              </button>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-[#F4F1EC]">
              {messages.map((msg, i) => (
                <div
                  key={i}
                  className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}
                >
                  {msg.role === "assistant" && (
                    <span className="mr-2 mt-1 w-7 h-7 rounded-full bg-white flex items-center justify-center border border-[#E2E0DB] shrink-0">
                      <svg
                        className="w-4 h-4 text-[#1D2A3F]"
                        viewBox="0 0 40 40"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                        aria-hidden
                      >
                        <circle cx="20" cy="20" r="19" stroke="currentColor" strokeWidth="1.5" />
                        <path
                          d="M20 12v16M14 20h12"
                          stroke="currentColor"
                          strokeWidth="1.5"
                          strokeLinecap="round"
                        />
                        <circle cx="20" cy="20" r="2.5" fill="currentColor" />
                      </svg>
                    </span>
                  )}
                  <span
                    className={`max-w-[85%] rounded-2xl px-4 py-2.5 text-sm leading-relaxed ${
                      msg.role === "user"
                        ? "bg-[#2D5BE3] text-white"
                        : "bg-white text-[#1D2A3F] border border-[#E2E0DB]"
                    }`}
                  >
                    {msg.content}
                  </span>
                </div>
              ))}

              {loading && (
                <div className="flex justify-start items-center">
                  <span className="mr-2 mt-1 w-7 h-7 rounded-full bg-white flex items-center justify-center border border-[#E2E0DB] shrink-0">
                    <svg
                      className="w-4 h-4 text-[#1D2A3F]"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6l4 2" />
                    </svg>
                  </span>
                  <span className="bg-white border border-[#E2E0DB] rounded-2xl px-4 py-2.5 text-sm text-[#1D2A3F] inline-flex items-center gap-1">
                    <motion.span
                      className="w-1.5 h-1.5 rounded-full bg-[#64748B]"
                      animate={{ opacity: [0.3, 1, 0.3] }}
                      transition={{ duration: 1, repeat: Infinity }}
                    />
                    <motion.span
                      className="w-1.5 h-1.5 rounded-full bg-[#64748B]"
                      animate={{ opacity: [0.3, 1, 0.3] }}
                      transition={{ duration: 1, repeat: Infinity, delay: 0.2 }}
                    />
                    <motion.span
                      className="w-1.5 h-1.5 rounded-full bg-[#64748B]"
                      animate={{ opacity: [0.3, 1, 0.3] }}
                      transition={{ duration: 1, repeat: Infinity, delay: 0.4 }}
                    />
                  </span>
                </div>
              )}

              <div ref={bottomRef} />
            </div>

            {/* Input */}
            <form
              onSubmit={(e) => {
                e.preventDefault();
                send();
              }}
              className="p-4 bg-[#F4F1EC] border-t border-[#E2E0DB]"
            >
              <div className="flex items-center gap-2">
                <input
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder="Ask about LTA…"
                  className="flex-1 bg-white border border-[#E2E0DB] rounded-full px-4 py-2.5 text-sm text-[#1D2A3F] placeholder-[#64748B] outline-none focus:ring-1 focus:ring-[#2D5BE3] focus:border-[#2D5BE3]"
                />
                <button
                  type="submit"
                  disabled={loading}
                  className="w-10 h-10 rounded-full bg-[#2D5BE3] text-white flex items-center justify-center disabled:opacity-50"
                  aria-label="Send"
                >
                  <svg
                    className="w-5 h-5"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 12h13M13 6l5 6-5 6" />
                  </svg>
                </button>
              </div>
            </form>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
