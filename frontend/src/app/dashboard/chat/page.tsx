"use client";
import { useEffect, useRef, useState } from "react";
import { useAuthStore } from "@/store/auth.store";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Send, Bot, User, Loader2, MessageSquare, Plus } from "lucide-react";
import api from "@/lib/api";

interface Message { role: "user" | "assistant"; content: string; }
interface Session { id: string; title: string; createdAt: string; }

const PLAN_LIMIT: Record<string, number> = { FREE: 10, PRO: 50, PREMIUM: 200, ELITE: 500 };

const STARTERS = [
  "How can I improve my financial health score?",
  "Should I increase my SIP amount?",
  "How do I build a 6-month emergency fund?",
  "What's a good asset allocation for my age?",
];

export default function ChatPage() {
  const { user } = useAuthStore();
  const [sessions,    setSessions]    = useState<Session[]>([]);
  const [sessionId,   setSessionId]   = useState<string | null>(null);
  const [messages,    setMessages]    = useState<Message[]>([]);
  const [input,       setInput]       = useState("");
  const [streaming,   setStreaming]   = useState(false);
  const [error,       setError]       = useState("");
  const bottomRef  = useRef<HTMLDivElement>(null);
  const inputRef   = useRef<HTMLInputElement>(null);

  const limit = PLAN_LIMIT[user?.plan ?? "FREE"];

  useEffect(() => { loadSessions(); }, []);
  useEffect(() => { bottomRef.current?.scrollIntoView({ behavior: "smooth" }); }, [messages]);

  async function loadSessions() {
    try { const { data } = await api.get("/api/chat/sessions"); setSessions(data.sessions ?? []); }
    catch { /* ignore */ }
  }

  async function newSession() {
    try {
      const { data } = await api.post("/api/chat/sessions", { title: "New Chat" });
      setSessionId(data.id);
      setMessages([]);
      setSessions(prev => [data, ...prev]);
    } catch(err: any) { setError(err.response?.data?.error ?? "Could not create session"); }
  }

  async function openSession(id: string) {
    try {
      const { data } = await api.get(`/api/chat/sessions/${id}`);
      setSessionId(id);
      setMessages(data.messages?.map((m: any) => ({ role: m.role, content: m.content })) ?? []);
    } catch { /* ignore */ }
  }

  async function sendMessage(text?: string) {
    const content = (text ?? input).trim();
    if (!content || streaming) return;
    if (!sessionId) { await newSession(); }
    setInput("");
    setError("");

    const userMsg: Message = { role: "user", content };
    setMessages(prev => [...prev, userMsg]);

    // Streaming via SSE
    setStreaming(true);
    let assistantContent = "";
    const assistantIdx = messages.length + 1;

    setMessages(prev => [...prev, { role: "assistant", content: "" }]);

    try {
      const token = localStorage.getItem("accessToken");
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/chat/stream`, {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify({ sessionId, message: content }),
      });

      if (!res.ok) {
        const j = await res.json().catch(() => ({}));
        throw new Error(j.error ?? `HTTP ${res.status}`);
      }

      const reader = res.body!.getReader();
      const decoder = new TextDecoder();
      let buf = "";

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        buf += decoder.decode(value, { stream: true });
        const lines = buf.split("\n");
        buf = lines.pop() ?? "";
        for (const line of lines) {
          if (!line.startsWith("data:")) continue;
          const raw = line.slice(5).trim();
          if (raw === "[DONE]") break;
          try {
            const j = JSON.parse(raw);
            if (j.text) {
              assistantContent += j.text;
              setMessages(prev => {
                const next = [...prev];
                next[next.length - 1] = { role: "assistant", content: assistantContent };
                return next;
              });
            }
          } catch { /* skip bad chunk */ }
        }
      }
    } catch (err: any) {
      setError(err.message ?? "Failed to get response");
      setMessages(prev => prev.slice(0, -1)); // remove empty assistant message
    } finally {
      setStreaming(false);
      inputRef.current?.focus();
    }
  }

  return (
    <div className="flex h-[calc(100vh-0px)] overflow-hidden">
      {/* Session sidebar */}
      <div className="w-56 border-r bg-gray-50 flex flex-col">
        <div className="p-3 border-b">
          <Button size="sm" onClick={newSession} className="w-full bg-emerald-600 hover:bg-emerald-700 gap-2 text-xs">
            <Plus className="w-3 h-3" /> New Chat
          </Button>
        </div>
        <div className="flex-1 overflow-y-auto p-2 space-y-1">
          {sessions.length === 0 && (
            <p className="text-xs text-gray-400 px-2 py-4 text-center">No chats yet</p>
          )}
          {sessions.map(s => (
            <button key={s.id} onClick={() => openSession(s.id)}
              className={`w-full text-left px-3 py-2 rounded-lg text-xs transition-colors ${sessionId===s.id?"bg-emerald-100 text-emerald-800 font-medium":"text-gray-600 hover:bg-gray-100"}`}>
              <p className="truncate">{s.title || "Chat"}</p>
              <p className="text-gray-400 mt-0.5">{new Date(s.createdAt).toLocaleDateString("en-IN")}</p>
            </button>
          ))}
        </div>
        <div className="p-3 border-t">
          <p className="text-xs text-gray-400 text-center">{limit} messages/day on {user?.plan}</p>
        </div>
      </div>

      {/* Chat area */}
      <div className="flex-1 flex flex-col">
        {/* Header */}
        <div className="px-6 py-4 border-b bg-white flex items-center gap-3">
          <Bot className="w-5 h-5 text-emerald-600" />
          <div>
            <p className="font-semibold text-gray-800">WealthWise AI</p>
            <p className="text-xs text-gray-400">Your personal financial advisor</p>
          </div>
          <Badge className="ml-auto bg-emerald-100 text-emerald-700 text-xs">{user?.plan}</Badge>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto px-6 py-6 space-y-5">
          {/* Welcome */}
          {messages.length === 0 && (
            <div className="flex flex-col items-center justify-center h-full text-center gap-6">
              <div className="bg-emerald-50 rounded-full p-5">
                <MessageSquare className="w-10 h-10 text-emerald-500" />
              </div>
              <div>
                <p className="text-lg font-semibold text-gray-800">Ask your AI CFO anything</p>
                <p className="text-sm text-gray-400 mt-1">Financial advice tailored to your profile</p>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 w-full max-w-lg">
                {STARTERS.map(s => (
                  <button key={s} onClick={() => { if (!sessionId) newSession().then(() => sendMessage(s)); else sendMessage(s); }}
                    className="text-left text-sm bg-white border border-gray-200 rounded-xl px-4 py-3 hover:border-emerald-300 hover:bg-emerald-50 transition-colors text-gray-600">
                    {s}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Message bubbles */}
          {messages.map((m, i) => (
            <div key={i} className={`flex gap-3 ${m.role==="user"?"flex-row-reverse":""}`}>
              <div className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center ${m.role==="assistant"?"bg-emerald-100":"bg-gray-200"}`}>
                {m.role==="assistant" ? <Bot className="w-4 h-4 text-emerald-600"/> : <User className="w-4 h-4 text-gray-600"/>}
              </div>
              <div className={`max-w-[72%] rounded-2xl px-4 py-3 text-sm leading-relaxed whitespace-pre-wrap ${
                m.role==="assistant"
                  ? "bg-white border border-gray-100 text-gray-800 shadow-sm"
                  : "bg-emerald-600 text-white"
              }`}>
                {m.content || (streaming && i===messages.length-1 && (
                  <span className="flex gap-1 items-center text-gray-400">
                    <Loader2 className="w-3 h-3 animate-spin"/> Thinking…
                  </span>
                ))}
              </div>
            </div>
          ))}

          {error && (
            <div className="bg-red-50 border border-red-200 text-red-600 text-sm px-4 py-3 rounded-xl">
              {error}
            </div>
          )}
          <div ref={bottomRef} />
        </div>

        {/* Input */}
        <div className="px-6 py-4 border-t bg-white">
          <form onSubmit={e => { e.preventDefault(); sendMessage(); }} className="flex gap-3">
            <Input
              ref={inputRef}
              value={input}
              onChange={e => setInput(e.target.value)}
              placeholder="Ask about your finances…"
              disabled={streaming}
              className="flex-1 rounded-xl"
            />
            <Button type="submit" disabled={streaming || !input.trim()}
              className="bg-emerald-600 hover:bg-emerald-700 rounded-xl px-5">
              {streaming ? <Loader2 className="w-4 h-4 animate-spin"/> : <Send className="w-4 h-4"/>}
            </Button>
          </form>
          <p className="text-xs text-gray-400 mt-2 text-center">
            AI responses are for informational purposes only, not financial advice.
          </p>
        </div>
      </div>
    </div>
  );
}
