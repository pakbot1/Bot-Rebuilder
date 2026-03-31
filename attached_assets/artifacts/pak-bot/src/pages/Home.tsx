import { Button } from "@/components/ui/button";
import { Bot, Code, Zap, Shield, Globe, Users, Copy, Check } from "lucide-react";
import { cn } from "@/lib/utils";
import { useState } from "react";

export default function Home() {
  const [copied, setCopied] = useState(false);

  const handleCopyCode = () => {
    const codeToCopy = `import fetch from 'node-fetch';

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
    
    navigator.clipboard.writeText(codeToCopy);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Navigation Menu */}
      <nav className="bg-white border-b border-gray-200 sticky top-0 z-50">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-center items-center h-16 space-x-8">
            <a href="#" className="text-gray-900 hover:text-emerald-600 font-medium transition-colors">
              Home
            </a>
            <a href="#" className="text-gray-600 hover:text-emerald-600 font-medium transition-colors">
              Developer
            </a>
            <a href="#" className="text-gray-600 hover:text-emerald-600 font-medium transition-colors">
              Admin
            </a>
            <a href="#endpoints" className="text-gray-600 hover:text-emerald-600 font-medium transition-colors">
              Endpoints
            </a>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative pt-20 pb-16 overflow-hidden">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <div className="flex flex-col items-center mb-8">
              <div className="w-16 h-16 rounded-2xl overflow-hidden shadow-lg shadow-emerald-500/20 mb-6">
                <img 
                  src="/logo.png" 
                  alt="PakBot API Logo" 
                  className="w-full h-full object-cover"
                />
              </div>
              <h1 className="text-5xl lg:text-6xl font-black tracking-tight mb-6">
                PakBot API
                <span className="block text-emerald-600">Pakistan's AI Assistant</span>
              </h1>
            </div>
            
            <p className="text-xl text-gray-600 mb-12 max-w-3xl mx-auto">
              Powerful AI capabilities for Pakistani developers and businesses. 
              <span className="font-semibold"> Build intelligent applications</span> with our comprehensive REST API.
            </p>
            
            <div className="flex flex-col sm:flex-row items-center justify-center gap-6 mb-16">
              <Button 
                size="lg" 
                className="bg-emerald-600 hover:bg-emerald-700 text-white px-12 py-4 text-lg"
                onClick={() => {
                  const element = document.getElementById('contact-cta');
                  element?.scrollIntoView({ behavior: 'smooth' });
                }}
              >
                Get Started
              </Button>
              <Button variant="outline" size="lg" className="px-12 py-4 text-lg" onClick={() => window.location.href = '/docs'}>
                View Documentation
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Built for <span className="text-emerald-600">Pakistani Excellence</span>
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Designed specifically for Pakistani developers with localized support and regional understanding.
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="text-center p-8 bg-white rounded-2xl shadow-xl shadow-gray-900/10 border border-gray-100 hover:shadow-2xl hover:shadow-gray-900/20 transform hover:-translate-y-2 transition-all duration-300 hover:bg-gradient-to-br hover:from-white hover:to-emerald-50">
              <div className="w-12 h-12 bg-emerald-100 rounded-xl flex items-center justify-center mx-auto mb-4 shadow-md">
                <Zap className="w-6 h-6 text-emerald-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Lightning Fast</h3>
              <p className="text-gray-600">Optimized for speed with sub-second response times</p>
            </div>
            
            <div className="text-center p-8 bg-white rounded-2xl shadow-xl shadow-gray-900/10 border border-gray-100 hover:shadow-2xl hover:shadow-gray-900/20 transform hover:-translate-y-2 transition-all duration-300 hover:bg-gradient-to-br hover:from-white hover:to-blue-50">
              <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center mx-auto mb-4 shadow-md">
                <Shield className="w-6 h-6 text-blue-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Secure & Reliable</h3>
              <p className="text-gray-600">Enterprise-grade security with 99.9% uptime</p>
            </div>
            
            <div className="text-center p-8 bg-white rounded-2xl shadow-xl shadow-gray-900/10 border border-gray-100 hover:shadow-2xl hover:shadow-gray-900/20 transform hover:-translate-y-2 transition-all duration-300 hover:bg-gradient-to-br hover:from-white hover:to-purple-50">
              <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center mx-auto mb-4 shadow-md">
                <Globe className="w-6 h-6 text-purple-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Pakistani Context</h3>
              <p className="text-gray-600">Understands local culture, language, and preferences</p>
            </div>
            
            <div className="text-center p-8 bg-white rounded-2xl shadow-xl shadow-gray-900/10 border border-gray-100 hover:shadow-2xl hover:shadow-gray-900/20 transform hover:-translate-y-2 transition-all duration-300 hover:bg-gradient-to-br hover:from-white hover:to-orange-50">
              <div className="w-12 h-12 bg-orange-100 rounded-xl flex items-center justify-center mx-auto mb-4 shadow-md">
                <Users className="w-6 h-6 text-orange-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Developer Friendly</h3>
              <p className="text-gray-600">Simple REST API with comprehensive documentation</p>
            </div>
          </div>
        </div>
      </section>

      {/* API Endpoints Section */}
      <section className="py-20 bg-white">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">API Endpoints</h2>
            <p className="text-xl text-gray-600">Complete REST coverage for advanced use cases.</p>
          </div>
          
          <div className="space-y-4 max-w-4xl mx-auto">
            {[
              { method: "POST", path: "/api/chat", desc: "Send a message and receive an AI reply. Supports optional image (base64) and url fields." },
              { method: "POST", path: "/api/chat/stream", desc: "Same as /chat but streams the reply token-by-token via Server-Sent Events." },
              { method: "GET", path: "/api/bots", desc: "List all registered developer bots" },
              { method: "POST", path: "/api/bots", desc: "Create a new custom bot profile" },
              { method: "GET", path: "/api/bots/:id/conversations", desc: "List conversations for a bot" },
              { method: "POST", path: "/api/bots/:id/conversations", desc: "Start a new conversation session" },
              { method: "POST", path: "/api/bots/:id/webhooks", desc: "Register a webhook for events" },
            ].map((ep, i) => (
              <div key={i} className="flex flex-col sm:flex-row sm:items-center justify-between p-6 rounded-2xl bg-white border border-gray-200 shadow-sm hover:shadow-md transition-all">
                <div className="flex items-center gap-4 mb-4 sm:mb-0">
                  <span className={cn(
                    "px-3 py-1 rounded-md text-xs font-mono font-bold tracking-wider",
                    ep.method === "GET" ? "bg-blue-100 text-blue-700" : "bg-emerald-100 text-emerald-700"
                  )}>
                    {ep.method}
                  </span>
                  <code className="text-sm font-bold text-gray-900">{ep.path}</code>
                </div>
                <p className="text-gray-600 text-sm">{ep.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Integrate in Minutes Section */}
      <section className="py-20 bg-white">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Integrate in minutes</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Our simple REST API makes it trivial to add PakBot to your web, mobile, or backend applications. Just pass your API key and a message.
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8 max-w-4xl mx-auto">
            <div className="text-center p-8 bg-gray-50 rounded-2xl">
              <div className="w-12 h-12 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-emerald-600 font-bold text-lg">1</span>
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Get your API Key</h3>
              <p className="text-gray-600">Contact sales to provision your enterprise key.</p>
            </div>
            
            <div className="text-center p-8 bg-gray-50 rounded-2xl">
              <div className="w-12 h-12 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-emerald-600 font-bold text-lg">2</span>
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Make a Request</h3>
              <p className="text-gray-600">Send a POST request with your message context.</p>
            </div>
            
            <div className="text-center p-8 bg-gray-50 rounded-2xl">
              <div className="w-12 h-12 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-emerald-600 font-bold text-lg">3</span>
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Get Response</h3>
              <p className="text-gray-600">Receive AI-powered responses instantly.</p>
            </div>
          </div>
          
          <div className="mt-12 max-w-4xl mx-auto">
            <div className="bg-gray-900 rounded-2xl p-6 text-left">
              <div className="flex items-center justify-between mb-4">
                <span className="text-emerald-400 text-sm font-mono">javascript</span>
                <button 
                  onClick={handleCopyCode}
                  className="text-gray-400 hover:text-white transition-colors flex items-center gap-2 px-2 py-1 rounded hover:bg-gray-800"
                >
                  {copied ? (
                    <>
                      <Check className="w-4 h-4" />
                      <span className="text-xs">Copied!</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-4 h-4" />
                      <span className="text-xs">Copy</span>
                    </>
                  )}
                </button>
              </div>
              <pre className="text-emerald-300 text-sm overflow-x-auto">
                <code>{`import fetch from 'node-fetch';

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
console.log(data.reply);`}</code>
              </pre>
            </div>
          </div>
        </div>
      </section>

      {/* Contact CTA Section */}
      <section id="contact-cta" className="text-center py-16 bg-gray-50">
        <div className="max-w-4xl mx-auto px-4">
          <h2 className="text-4xl font-bold text-emerald-600 mb-6 text-center">Ready to integrate PakBot?</h2>
          <p className="text-xl text-gray-600 mb-10 max-w-3xl mx-auto">
            Want to integrate PakBot into your product? Email us to get your API key, discuss pricing, and get onboarded to the platform.
          </p>
          
          <div className="flex flex-col sm:flex-row items-center justify-center gap-6 mb-8">
            <a href="mailto:pakbot.work@gmail.com" className="w-full sm:w-auto">
              <Button size="lg" className="w-full bg-emerald-600 hover:bg-emerald-700 text-white">
                Contact API Sales
              </Button>
            </a>
          </div>
          
          <div className="flex flex-col sm:flex-row items-center justify-center gap-8 text-sm">
            <div className="text-center">
              <span className="block font-semibold text-gray-900">API Sales</span>
              <span className="text-gray-600">pakbot.work@gmail.com</span>
            </div>
            <div className="hidden sm:block w-px h-10 bg-gray-300"></div>
            <div className="text-center">
              <span className="block font-semibold text-gray-900">Support</span>
              <span className="text-gray-600">pakbot.support@gmail.com</span>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-gray-400 py-8 text-center text-sm border-t border-gray-800">
        <p>© 2026 PakBot API, Pakistan's AI Assistant. A product of <a href="https://faiwebz.com" target="_blank" rel="noopener noreferrer" className="text-emerald-400 hover:text-emerald-300 transition-colors">Faiwebz</a>.</p>
      </footer>
    </div>
  );
}
