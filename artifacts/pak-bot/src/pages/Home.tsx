import { Navbar } from "@/components/layout/Navbar";
import { ChatDemo } from "@/components/chat/ChatDemo";
import { Button } from "@/components/ui/button";
import { CodeBlock } from "@/components/ui/CodeBlock";
import { Bot, Terminal, ChevronRight, Zap, ShieldCheck, Globe } from "lucide-react";
import { cn } from "@/lib/utils";

export default function Home() {
  const codeNode = `import fetch from 'node-fetch';

const response = await fetch('https://pakbot.api/chat', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'X-API-Key': 'pk_your_api_key_here'
  },
  body: JSON.stringify({ 
    message: 'Pakistan ki history kya hai?',
    sessionId: 'user-123'
  })
});

const data = await response.json();
console.log(data.reply);`;

  return (
    <div className="min-h-screen bg-background selection:bg-primary/20">
      <Navbar />
      
      <main>
        {/* Hero Section */}
        <section className="relative pt-32 pb-20 lg:pt-48 lg:pb-32 overflow-hidden">
          <div className="absolute inset-0 z-0">
            <img 
              src={`${import.meta.env.BASE_URL}images/hero-bg.png`} 
              alt="Background" 
              className="w-full h-full object-cover opacity-10"
            />
            <div className="absolute inset-0 bg-gradient-to-b from-background via-background/80 to-background" />
          </div>
          
          <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid lg:grid-cols-2 gap-12 lg:gap-8 items-center">
              <div className="max-w-2xl">
                <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-100 text-emerald-800 text-sm font-semibold mb-6 border border-emerald-200">
                  <span className="relative flex h-2 w-2">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                  </span>
                  Llama 3.3 70B Powered
                </div>
                <h1 className="text-5xl lg:text-7xl font-display font-extrabold text-foreground leading-[1.1] tracking-tight mb-6">
                  Pakistan's <br/>
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-accent">AI Assistant API</span>
                </h1>
                <p className="text-lg lg:text-xl text-muted-foreground mb-8 leading-relaxed">
                  A production-ready REST API for building intelligent, context-aware applications. Built with Node.js, Express, and high-performance LLMs.
                </p>
                <div className="flex flex-col sm:flex-row gap-4">
                  <Button size="lg" onClick={() => document.getElementById('demo')?.scrollIntoView({ behavior: 'smooth' })}>
                    Try PakBot Live <ChevronRight className="ml-2 w-5 h-5" />
                  </Button>
                  <Button size="lg" variant="outline" onClick={() => document.getElementById('docs')?.scrollIntoView({ behavior: 'smooth' })}>
                    <Terminal className="mr-2 w-5 h-5" /> View Endpoints
                  </Button>
                </div>
              </div>
              
              <div className="relative mx-auto w-full max-w-[500px] lg:ml-auto perspective-[1000px]">
                <div className="absolute -inset-1 bg-gradient-to-r from-primary to-accent rounded-3xl blur-2xl opacity-20 animate-pulse"></div>
                <div className="transform rotate-y-[-5deg] rotate-x-[5deg] transition-transform duration-500 hover:rotate-y-0 hover:rotate-x-0">
                  <ChatDemo />
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Features */}
        <section className="py-24 bg-white relative">
          <div className="absolute inset-0 opacity-5" style={{ backgroundImage: `url(${import.meta.env.BASE_URL}images/pattern.png)` }}></div>
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
            <div className="grid md:grid-cols-3 gap-8">
              <div className="p-8 rounded-3xl border border-border/50 bg-background hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
                <div className="w-14 h-14 rounded-2xl bg-emerald-100 flex items-center justify-center mb-6 text-primary">
                  <Zap className="w-7 h-7" />
                </div>
                <h3 className="text-xl font-bold mb-3">Lightning Fast</h3>
                <p className="text-muted-foreground leading-relaxed">Powered by Groq's high-speed inference engine for ultra-low latency responses.</p>
              </div>

              {/* 19 Languages card */}
              <div className="p-8 rounded-3xl border border-border/50 bg-background hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
                <div className="w-14 h-14 rounded-2xl bg-emerald-100 flex items-center justify-center mb-6 text-primary">
                  <Globe className="w-7 h-7" />
                </div>
                <h3 className="text-xl font-bold mb-1">19 Local Languages</h3>
                <p className="text-muted-foreground leading-relaxed mb-3">Fluent in both languages, understanding cultural nuances seamlessly.</p>
                <div className="flex flex-wrap gap-1.5">
                  {["Urdu","English","Punjabi","Sindhi","Pashto","Balochi","Saraiki","Kashmiri","Gujarati","Shina","Hindko","Brahui","Wakhi","Kalasha","Burushaski","Gujjari","Torwali","Kundal","Kohistan"].map(lang => (
                    <span key={lang} className="px-2 py-0.5 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-700 text-xs font-medium">{lang}</span>
                  ))}
                </div>
              </div>

              <div className="p-8 rounded-3xl border border-border/50 bg-background hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
                <div className="w-14 h-14 rounded-2xl bg-emerald-100 flex items-center justify-center mb-6 text-primary">
                  <ShieldCheck className="w-7 h-7" />
                </div>
                <h3 className="text-xl font-bold mb-3">Enterprise Ready</h3>
                <p className="text-muted-foreground leading-relaxed">Secure API key management, webhook support, and rate limiting built-in.</p>
              </div>
            </div>
          </div>
        </section>

        {/* Integration / Code */}
        <section id="demo" className="py-24 bg-foreground text-white relative overflow-hidden">
          <div className="absolute top-0 right-0 w-1/2 h-full bg-primary/20 blur-[150px] pointer-events-none" />
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
            <div className="grid lg:grid-cols-2 gap-16 items-center">
              <div>
                <h2 className="text-4xl font-display font-bold mb-6">Integrate in minutes</h2>
                <p className="text-lg text-white/60 mb-8 leading-relaxed">
                  Our simple REST API makes it trivial to add PakBot to your web, mobile, or backend applications. Just pass your API key and a message.
                </p>
                <div className="space-y-6">
                  <div className="flex items-start gap-4">
                    <div className="w-8 h-8 rounded-full bg-primary/30 flex items-center justify-center shrink-0 mt-1">
                      <span className="font-bold text-sm text-primary-foreground">1</span>
                    </div>
                    <div>
                      <h4 className="text-lg font-bold">Get your API Key</h4>
                      <p className="text-white/60 mt-1">Contact sales to provision your enterprise key.</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-4">
                    <div className="w-8 h-8 rounded-full bg-primary/30 flex items-center justify-center shrink-0 mt-1">
                      <span className="font-bold text-sm text-primary-foreground">2</span>
                    </div>
                    <div>
                      <h4 className="text-lg font-bold">Make a Request</h4>
                      <p className="text-white/60 mt-1">Send a POST request with your message context.</p>
                    </div>
                  </div>
                </div>
              </div>
              <div>
                <CodeBlock language="javascript" code={codeNode} />
              </div>
            </div>
          </div>
        </section>

        {/* Endpoints */}
        <section id="docs" className="py-24 bg-background">
          <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <h2 className="text-4xl font-display font-bold mb-4">API Endpoints</h2>
              <p className="text-xl text-muted-foreground">Complete REST coverage for advanced use cases.</p>
            </div>
            
            <div className="space-y-4">
              {[
                { method: "POST", path: "/api/chat", desc: "Send a message and receive an AI reply. Supports optional image (base64) and url fields." },
                { method: "POST", path: "/api/chat/stream", desc: "Same as /chat but streams the reply token-by-token via Server-Sent Events." },
                { method: "GET", path: "/api/bots", desc: "List all registered developer bots" },
                { method: "POST", path: "/api/bots", desc: "Create a new custom bot profile" },
                { method: "GET", path: "/api/bots/:id/conversations", desc: "List conversations for a bot" },
                { method: "POST", path: "/api/bots/:id/conversations", desc: "Start a new conversation session" },
                { method: "POST", path: "/api/bots/:id/webhooks", desc: "Register a webhook for events" },
              ].map((ep, i) => (
                <div key={i} className="flex flex-col sm:flex-row sm:items-center justify-between p-6 rounded-2xl bg-white border border-border/50 hover:border-primary/30 hover:shadow-md transition-all">
                  <div className="flex items-center gap-4 mb-4 sm:mb-0">
                    <span className={cn(
                      "px-3 py-1 rounded-md text-xs font-mono font-bold tracking-wider",
                      ep.method === "GET" ? "bg-blue-100 text-blue-700" : "bg-emerald-100 text-emerald-700"
                    )}>
                      {ep.method}
                    </span>
                    <code className="text-sm font-bold text-foreground">{ep.path}</code>
                  </div>
                  <p className="text-muted-foreground text-sm">{ep.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Contact CTA */}
        <section className="py-24 bg-gradient-to-b from-white to-secondary/30 border-t border-border/50">
          <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center mx-auto mb-6 text-primary">
              <Bot className="w-8 h-8" />
            </div>
            <h2 className="text-4xl font-display font-bold mb-6">Ready to integrate PakBot?</h2>
            <p className="text-xl text-muted-foreground mb-10">
              Want to integrate PakBot into your product? Email us to get your API key, discuss pricing, and get onboarded to the platform.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-6">
              <a href="mailto:pakbot.work@gmail.com" className="w-full sm:w-auto">
                <Button size="lg" className="w-full">Contact API Sales</Button>
              </a>
              <div className="text-sm text-muted-foreground text-left sm:text-center">
                <span className="block font-semibold text-foreground">API Sales</span>
                pakbot.work@gmail.com
              </div>
              <div className="hidden sm:block w-px h-10 bg-border"></div>
              <div className="text-sm text-muted-foreground text-left sm:text-center">
                <span className="block font-semibold text-foreground">Support</span>
                pakbot.support@gmail.com
              </div>
            </div>
          </div>
        </section>
      </main>
      
      <footer className="bg-foreground text-white/50 py-12 text-center text-sm border-t border-white/10">
        <p>© {new Date().getFullYear()} PakBot API. Pakistan's AI Assistant.</p>
        <p className="mt-2">
          A product of{" "}
          <a
            href="https://faiwebz.com"
            target="_blank"
            rel="noopener noreferrer"
            className="text-white/70 hover:text-white underline underline-offset-2 transition-colors"
          >
            Faiwebz
          </a>
        </p>
      </footer>
    </div>
  );
}
