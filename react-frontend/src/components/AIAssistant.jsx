import { useState } from "react";
import { Bot, Send, X, Sparkles, ShieldCheck } from "lucide-react";
import api from "../services/api";

const suggestedPrompts = [
  "Summarize current risk",
  "What should I investigate first?",
  "Explain MITRE mapping",
  "Guide me through the demo",
  "Explain log ingestion",
  "Summarize executive posture",
];

export default function AIAssistant({ showToast }) {
  const [isOpen, setIsOpen] = useState(false);
  const [message, setMessage] = useState("");
  const [sending, setSending] = useState(false);

  const [chatMessages, setChatMessages] = useState([
    {
      sender: "ai",
      text: "Hello, I am CyberGuard AI. I can help you summarize SOC risk, explain MITRE mappings, recommend incident priorities, and guide your demo.",
    },
  ]);

  async function sendMessage(customMessage) {
    const finalMessage = customMessage || message;

    if (!finalMessage.trim()) {
      showToast?.("Please enter a message for CyberGuard AI.", "error");
      return;
    }

    const userMessage = {
      sender: "user",
      text: finalMessage,
    };

    setChatMessages((current) => [...current, userMessage]);
    setMessage("");
    setSending(true);

    try {
      const response = await api.post("/ai/assistant", {
        message: finalMessage,
      });

      const aiMessage = {
        sender: "ai",
        text: response.data.response,
      };

      setChatMessages((current) => [...current, aiMessage]);
    } catch (error) {
      console.error("Failed to contact AI assistant", error);
      showToast?.("CyberGuard AI failed to respond.", "error");

      setChatMessages((current) => [
        ...current,
        {
          sender: "ai",
          text: "I could not reach the AI assistant service. Please check that the FastAPI backend is running.",
        },
      ]);
    } finally {
      setSending(false);
    }
  }

  function handleSubmit(event) {
    event.preventDefault();
    sendMessage();
  }

  return (
    <>
      {isOpen && (
        <div className="fixed bottom-24 right-6 z-[9998] flex h-[620px] w-[420px] max-w-[calc(100vw-2rem)] flex-col overflow-hidden rounded-3xl border border-cyan-500/30 bg-slate-950 shadow-2xl shadow-cyan-500/20">
          <div className="border-b border-cyan-500/20 bg-slate-900 p-5">
            <div className="flex items-start justify-between gap-4">
              <div className="flex items-center gap-3">
                <div className="relative rounded-2xl bg-cyan-500/10 p-3">
                  <Bot className="h-7 w-7 text-cyan-300" />
                  <span className="absolute -right-1 -top-1 h-3 w-3 rounded-full bg-green-400 shadow-lg shadow-green-400/60"></span>
                </div>

                <div>
                  <h2 className="text-lg font-bold text-white">
                    CyberGuard AI
                  </h2>
                  <p className="text-xs text-slate-400">
                    Animated SOC Assistant
                  </p>
                </div>
              </div>

              <button
                onClick={() => setIsOpen(false)}
                className="rounded-lg p-2 text-slate-400 hover:bg-slate-800 hover:text-white"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="mt-4 rounded-xl border border-cyan-500/10 bg-cyan-500/5 p-3">
              <div className="flex items-center gap-2 text-sm text-cyan-300">
                <Sparkles className="h-4 w-4" />
                Context-aware SOC guidance
              </div>
            </div>
          </div>

          <div className="flex-1 space-y-4 overflow-y-auto p-5">
            {chatMessages.map((chat, index) => (
              <div
                key={index}
                className={`flex ${
                  chat.sender === "user" ? "justify-end" : "justify-start"
                }`}
              >
                <div
                  className={`max-w-[85%] rounded-2xl p-4 text-sm leading-6 ${
                    chat.sender === "user"
                      ? "bg-cyan-500 text-slate-950"
                      : "border border-cyan-500/10 bg-slate-900 text-slate-200"
                  }`}
                >
                  {chat.sender === "ai" && (
                    <div className="mb-2 flex items-center gap-2 text-xs font-semibold text-cyan-300">
                      <ShieldCheck className="h-4 w-4" />
                      CyberGuard AI
                    </div>
                  )}
                  {chat.text}
                </div>
              </div>
            ))}

            {sending && (
              <div className="flex justify-start">
                <div className="rounded-2xl border border-cyan-500/10 bg-slate-900 p-4 text-sm text-slate-300">
                  <div className="flex items-center gap-2">
                    <span className="h-2 w-2 animate-pulse rounded-full bg-cyan-300"></span>
                    <span className="h-2 w-2 animate-pulse rounded-full bg-cyan-300 delay-150"></span>
                    <span className="h-2 w-2 animate-pulse rounded-full bg-cyan-300 delay-300"></span>
                    <span className="ml-2 text-slate-400">
                      CyberGuard AI is thinking...
                    </span>
                  </div>
                </div>
              </div>
            )}
          </div>

          <div className="border-t border-cyan-500/20 bg-slate-900 p-4">
            <div className="mb-4 flex flex-wrap gap-2">
              {suggestedPrompts.map((prompt) => (
                <button
                  key={prompt}
                  type="button"
                  onClick={() => sendMessage(prompt)}
                  disabled={sending}
                  className="rounded-full border border-cyan-500/20 px-3 py-1 text-xs text-cyan-300 hover:bg-cyan-500/10 disabled:opacity-50"
                >
                  {prompt}
                </button>
              ))}
            </div>

            <form onSubmit={handleSubmit} className="flex gap-3">
              <input
                type="text"
                value={message}
                onChange={(event) => setMessage(event.target.value)}
                placeholder="Ask CyberGuard AI..."
                className="flex-1 rounded-xl border border-slate-700 bg-slate-950 p-3 text-sm text-white outline-none focus:border-cyan-400"
              />

              <button
                type="submit"
                disabled={sending}
                className="rounded-xl bg-cyan-500 px-4 text-slate-950 hover:bg-cyan-400 disabled:cursor-not-allowed disabled:opacity-60"
              >
                <Send className="h-5 w-5" />
              </button>
            </form>
          </div>
        </div>
      )}

      <button
        onClick={() => setIsOpen((current) => !current)}
        className="fixed bottom-6 right-6 z-[9999] flex h-16 w-16 items-center justify-center rounded-2xl border border-cyan-400/40 bg-cyan-500 text-slate-950 shadow-2xl shadow-cyan-500/40 transition hover:scale-105 hover:bg-cyan-400"
      >
        <div className="absolute inset-0 animate-ping rounded-2xl bg-cyan-400/20"></div>
        <Bot className="relative h-8 w-8" />
      </button>
    </>
  );
}