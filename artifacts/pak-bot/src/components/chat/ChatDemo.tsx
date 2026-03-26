import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Bot, Send, Key, AlertCircle, RefreshCw } from "lucide-react";
import { useAuth } from "@/hooks/use-auth";
import { useSendChatMessage } from "@workspace/api-client-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

type Message = { id: string; role: "user" | "assistant"; content: string };

export function ChatDemo() {
  const { apiKey, setApiKey } = useAuth();
  const [inputKey, setInputKey] = useState("");
  const [sessionId, setSessionId] = useState(() => Math.random().toString(36).substring(7));
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState<Message[]>([
    { id: "msg-1", role: "assistant", content: "Assalam o Alaikum! 😊 I am PakBot, Pakistan's first AI assistant. How can I help you today?" }
  ]);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const { mutate: sendMessage, isPending } = useSendChatMessage();

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSaveKey = (e: React.FormEvent) => {
    e.preventDefault();
    if (inputKey.trim()) {
      setApiKey(inputKey.trim());
    }
  };

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (!message.trim() || !apiKey || isPending) return;

    const userMsg = message.trim();
    setMessage("");
    setMessages(prev => [...prev, { id: Date.now().toString(), role: "user", content: userMsg }]);

    sendMessage({
      data: { message: userMsg, sessionId }
    }, {
      request: { headers: { "X-API-Key": apiKey } as HeadersInit },
      onSuccess: (res) => {
        setMessages(prev => [...prev, { id: Date.now().toString(), role: "assistant", content: res.reply }]);
        if (res.sessionId) setSessionId(res.sessionId);
      },
      onError: (err: any) => {
        const errorText = err?.error || "Failed to send message. Check your API key.";
        setMessages(prev => [...prev, { id: Date.now().toString(), role: "assistant", content: `❌ Error: ${errorText}` }]);
      }
    });
  };

  const handleReset = () => {
    setSessionId(Math.random().toString(36).substring(7));
    setMessages([{ id: Date.now().toString(), role: "assistant", content: "Assalam o Alaikum! Starting a new conversation. What's on your mind?" }]);
  };

  if (!apiKey) {
    return (
      <div className="w-full h-full min-h-[500px] rounded-3xl dark-glass-panel p-8 flex flex-col items-center justify-center text-center">
        <div className="w-20 h-20 rounded-full bg-white/10 flex items-center justify-center mb-6 backdrop-blur-md">
          <Key className="w-10 h-10 text-white" />
        </div>
        <h3 className="text-2xl font-display font-bold text-white mb-2">Live API Demo</h3>
        <p className="text-primary-foreground/80 mb-8 max-w-sm">
          Enter your developer API key to test the interactive chat endpoint directly from the browser.
        </p>
        <form onSubmit={handleSaveKey} className="w-full max-w-xs space-y-4">
          <Input 
            type="password"
            placeholder="pk_..." 
            value={inputKey}
            onChange={(e) => setInputKey(e.target.value)}
            className="bg-white/10 border-white/20 text-white placeholder:text-white/40 focus-visible:ring-white/20 h-14"
          />
          <Button type="submit" variant="glass" className="w-full h-14 font-bold text-lg">
            Connect
          </Button>
        </form>
      </div>
    );
  }

  return (
    <div className="w-full h-[600px] flex flex-col rounded-3xl bg-white border border-border/60 shadow-xl overflow-hidden relative">
      {/* Chat Header */}
      <div className="px-6 py-4 border-b border-border/50 bg-gray-50 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-primary to-accent flex items-center justify-center shadow-md">
            <Bot className="w-5 h-5 text-white" />
          </div>
          <div>
            <h3 className="font-bold text-foreground leading-tight">PakBot <span className="text-xs font-normal text-muted-foreground ml-1">v1.0</span></h3>
            <div className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
              <span className="text-xs text-muted-foreground font-medium">Online</span>
            </div>
          </div>
        </div>
        <div className="flex gap-2">
          <Button variant="ghost" size="icon" onClick={handleReset} title="Reset Conversation">
            <RefreshCw className="w-4 h-4 text-muted-foreground" />
          </Button>
          <Button variant="ghost" size="icon" onClick={() => setApiKey("")} title="Clear API Key">
            <Key className="w-4 h-4 text-muted-foreground" />
          </Button>
        </div>
      </div>

      {/* Messages Area */}
      <div className="flex-1 overflow-y-auto p-6 space-y-6 bg-slate-50/50">
        <AnimatePresence initial={false}>
          {messages.map((msg) => (
            <motion.div
              key={msg.id}
              initial={{ opacity: 0, y: 10, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              className={cn(
                "flex w-full",
                msg.role === "user" ? "justify-end" : "justify-start"
              )}
            >
              <div className={cn(
                "max-w-[85%] px-5 py-3.5 rounded-2xl text-[15px] leading-relaxed shadow-sm",
                msg.role === "user" 
                  ? "bg-primary text-primary-foreground rounded-br-sm" 
                  : "bg-white border border-border/50 text-foreground rounded-bl-sm"
              )}>
                {msg.content}
              </div>
            </motion.div>
          ))}
          {isPending && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="flex w-full justify-start"
            >
              <div className="bg-white border border-border/50 px-5 py-4 rounded-2xl rounded-bl-sm shadow-sm flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-primary/40 animate-bounce"></span>
                <span className="w-2 h-2 rounded-full bg-primary/60 animate-bounce delay-100"></span>
                <span className="w-2 h-2 rounded-full bg-primary animate-bounce delay-200"></span>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
        <div ref={messagesEndRef} />
      </div>

      {/* Warning text */}
      <div className="px-6 py-2 bg-slate-50 flex items-center justify-center gap-2 text-xs text-muted-foreground border-t border-border/30">
        <AlertCircle className="w-3 h-3" />
        <span>PakBot can make mistakes. Double-check replies.</span>
      </div>

      {/* Input Area */}
      <form onSubmit={handleSend} className="p-4 bg-white border-t border-border/50">
        <div className="relative flex items-center">
          <Input
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Ask anything... / کچھ بھی پوچھیں..."
            className="pr-14 h-14 bg-gray-50 border-transparent focus-visible:bg-white"
            disabled={isPending}
          />
          <Button 
            type="submit" 
            size="icon" 
            className="absolute right-1.5 h-11 w-11 rounded-xl"
            disabled={!message.trim() || isPending}
          >
            <Send className="w-5 h-5 ml-0.5" />
          </Button>
        </div>
      </form>
    </div>
  );
}
