import { useState } from "react";
import { Check, Copy } from "lucide-react";
import { cn } from "@/lib/utils";

interface CodeBlockProps {
  code: string;
  language: string;
  className?: string;
}

export function CodeBlock({ code, language, className }: CodeBlockProps) {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className={cn("relative rounded-2xl overflow-hidden bg-[#0d1f15] border border-white/10 shadow-2xl", className)}>
      <div className="flex items-center justify-between px-4 py-3 border-b border-white/5 bg-white/5">
        <span className="text-xs font-mono font-medium text-emerald-400">{language}</span>
        <button
          onClick={handleCopy}
          className="text-white/40 hover:text-white transition-colors"
          title="Copy code"
        >
          {copied ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
        </button>
      </div>
      <div className="p-5 overflow-x-auto">
        <pre className="text-sm font-mono text-emerald-50 leading-relaxed">
          <code>{code}</code>
        </pre>
      </div>
    </div>
  );
}
