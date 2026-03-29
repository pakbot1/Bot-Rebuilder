import { Button } from "@/components/ui/button";
import { Bot } from "lucide-react";
import { cn } from "@/lib/utils";

export default function Home() {
  return (
    <div className="min-h-screen bg-white">
      <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* API Endpoints Section */}
        <section className="mb-20">
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
        </section>

        {/* Contact CTA Section */}
        <section className="text-center py-16 border-t border-gray-200">
          <div className="w-16 h-16 rounded-2xl bg-emerald-100 flex items-center justify-center mx-auto mb-6 text-emerald-600">
            <Bot className="w-8 h-8" />
          </div>
          <h2 className="text-4xl font-bold text-gray-900 mb-6">Ready to integrate PakBot?</h2>
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
        </section>
      </main>
      
      <footer className="bg-gray-900 text-gray-400 py-8 text-center text-sm border-t border-gray-800">
        <p>© 2006 PakBot API, Pakistan's AI Assistant. A product of Pakweb.</p>
      </footer>
    </div>
  );
}
