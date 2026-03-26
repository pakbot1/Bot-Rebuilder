import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Bot, Send, Key, AlertCircle, RefreshCw, Paperclip, X, Image } from "lucide-react";
import { useAuth } from "@/hooks/use-auth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

type Message = {
  id: string;
  role: "user" | "assistant";
  content: string;
  imageUrl?: string;
};

export function ChatDemo() {
  const { apiKey, setApiKey } = useAuth();
  const [inputKey, setInputKey] = useState("");
  const [sessionId, setSessionId] = useState(() => Math.random().toString(36).substring(7));
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState<Message[]>([
    { id: "msg-1", role: "assistant", content: "Assalam o Alaikum! 😊 I am PakBot, Pakistan's first AI assistant. How can I help you today?" }
  ]);
  const [isPending, setIsPending] = useState(false);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSaveKey = (e: React.FormEvent) => {
    e.preventDefault();
    if (inputKey.trim()) setApiKey(inputKey.trim());
  };

  const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setImageFile(file);
    const reader = new FileReader();
    reader.onload = (ev) => setImagePreview(ev.target?.result as string);
    reader.readAsDataURL(file);
  };

  const clearImage = () => {
    setImageFile(null);
    setImagePreview(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if ((!message.trim() && !imageFile) || !apiKey || isPending) return;

    const userMsg = message.trim() || "What's in this image?";
    const localImagePreview = imagePreview;
    setMessage("");
    clearImage();

    const userMsgObj: Message = {
      id: Date.now().toString(),
      role: "user",
      content: userMsg,
      imageUrl: localImagePreview ?? undefined
    };
    setMessages(prev => [...prev, userMsgObj]);
    setIsPending(true);

    try {
      let imageBase64: string | undefined;
      let imageMimeType: string | undefined;

      if (imageFile) {
        const arrayBuffer = await imageFile.arrayBuffer();
        const uint8Array = new Uint8Array(arrayBuffer);
        let binary = "";
        for (let i = 0; i < uint8Array.length; i++) binary += String.fromCharCode(uint8Array[i]);
        imageBase64 = btoa(binary);
        imageMimeType = imageFile.type;
      }

      const res = await fetch("/api/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "X-API-Key": apiKey,
        },
        body: JSON.stringify({
          message: userMsg,
          sessionId,
          ...(imageBase64 ? { imageBase64, imageMimeType } : {})
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        setMessages(prev => [...prev, { id: Date.now().toString(), role: "assistant", content: `❌ Error: ${data.error || "Failed to send message."}` }]);
      } else {
        setMessages(prev => [...prev, { id: Date.now().toString(), role: "assistant", content: data.reply }]);
        if (data.sessionId) setSessionId(data.sessionId);
      }
    } catch {
      setMessages(prev => [...prev, { id: Date.now().toString(), role: "assistant", content: "❌ Could not connect to server." }]);
    } finally {
      setIsPending(false);
    }
  };

  const handleReset = () => {
    setSessionId(Math.random().toString(36).substring(7));
    setMessages([{ id: Date.now().toString(), role: "assistant", content: "Assalam o Alaikum! Starting a new conversation. What's on your mind?" }]);
    clearImage();
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
    <div className="w-full h-[620px] flex flex-col rounded-3xl bg-white border border-border/60 shadow-xl overflow-hidden relative">
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
              className={cn("flex w-full", msg.role === "user" ? "justify-end" : "justify-start")}
            >
              <div className={cn(
                "max-w-[85%] px-5 py-3.5 rounded-2xl text-[15px] leading-relaxed shadow-sm space-y-2",
                msg.role === "user"
                  ? "bg-primary text-primary-foreground rounded-br-sm"
                  : "bg-white border border-border/50 text-foreground rounded-bl-sm"
              )}>
                {msg.imageUrl && (
                  <img
                    src={msg.imageUrl}
                    alt="attached"
                    className="rounded-xl max-w-[240px] max-h-[180px] object-cover border border-white/20"
                  />
                )}
                <p>{msg.content}</p>
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

      {/* Image Preview */}
      {imagePreview && (
        <div className="px-4 py-2 bg-white border-t border-border/30 flex items-center gap-3">
          <div className="relative">
            <img src={imagePreview} alt="preview" className="h-14 w-14 rounded-lg object-cover border border-border" />
            <button
              onClick={clearImage}
              className="absolute -top-1.5 -right-1.5 w-5 h-5 bg-gray-800 text-white rounded-full flex items-center justify-center hover:bg-red-600 transition-colors"
            >
              <X className="w-3 h-3" />
            </button>
          </div>
          <div className="text-xs text-muted-foreground">
            <p className="font-medium text-foreground flex items-center gap-1"><Image className="w-3 h-3" /> Image attached</p>
            <p>{imageFile?.name}</p>
          </div>
        </div>
      )}

      {/* Input Area */}
      <form onSubmit={handleSend} className="p-4 bg-white border-t border-border/50">
        <div className="relative flex items-center gap-2">
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            className="hidden"
            onChange={handleImageSelect}
          />
          <Button
            type="button"
            variant="ghost"
            size="icon"
            className="shrink-0 text-muted-foreground hover:text-primary"
            onClick={() => fileInputRef.current?.click()}
            title="Attach image"
          >
            <Paperclip className="w-5 h-5" />
          </Button>
          <Input
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Ask anything or attach an image..."
            className="pr-14 h-14 bg-gray-50 border-transparent focus-visible:bg-white"
            disabled={isPending}
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault();
                handleSend(e as any);
              }
            }}
          />
          <Button
            type="submit"
            size="icon"
            className="absolute right-1.5 h-11 w-11 rounded-xl"
            disabled={(!message.trim() && !imageFile) || isPending}
          >
            <Send className="w-5 h-5 ml-0.5" />
          </Button>
        </div>
      </form>
    </div>
  );
}
