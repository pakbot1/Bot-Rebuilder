import { Button } from "@/components/ui/button";
import { Bot, Code, Shield, Key, CreditCard, AlertCircle, Check } from "lucide-react";
import { cn } from "@/lib/utils";

export default function Docs() {
  return (
    <div className="min-h-screen bg-white">
      {/* Navigation Menu */}
      <nav className="bg-white border-b border-gray-200 sticky top-0 z-50">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-center items-center h-16 space-x-8">
            <a href="/" className="text-gray-600 hover:text-emerald-600 font-medium transition-colors">
              Home
            </a>
            <a href="#" className="text-gray-900 hover:text-emerald-600 font-medium transition-colors">
              Documentation
            </a>
            <a href="#" className="text-gray-600 hover:text-emerald-600 font-medium transition-colors">
              Developer
            </a>
            <a href="#" className="text-gray-600 hover:text-emerald-600 font-medium transition-colors">
              Admin
            </a>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative pt-20 pb-16 overflow-hidden bg-gradient-to-br from-emerald-50/20 via-transparent to-emerald-100/10">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <div className="w-20 h-20 rounded-2xl bg-emerald-100 flex items-center justify-center mx-auto mb-6">
              <Code className="w-10 h-10 text-emerald-600" />
            </div>
            <h1 className="text-5xl lg:text-6xl font-black tracking-tight mb-6">
              PakBot API
              <span className="block text-emerald-600">Documentation</span>
            </h1>
            <p className="text-xl text-gray-600 mb-12 max-w-3xl mx-auto">
              Complete API reference for integrating PakBot into your applications.
            </p>
          </div>
        </div>
      </section>

      {/* API Endpoints Section */}
      <section className="py-20 bg-white">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">API Endpoints</h2>
            <p className="text-xl text-gray-600">Complete REST coverage for all use cases.</p>
          </div>
          
          <div className="space-y-6 max-w-4xl mx-auto">
            <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-6">
              <div className="flex items-center justify-between mb-4">
                <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-mono font-bold tracking-wider bg-emerald-100 text-emerald-700">
                  POST
                </span>
                <code className="text-sm font-bold text-gray-900">/api/chat</code>
              </div>
              <p className="text-gray-600">Send message to PakBot and receive AI response.</p>
            </div>

            <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-6">
              <div className="flex items-center justify-between mb-4">
                <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-mono font-bold tracking-wider bg-blue-100 text-blue-700">
                  GET
                </span>
                <code className="text-sm font-bold text-gray-900">/api/health</code>
              </div>
              <p className="text-gray-600">Check API status and availability.</p>
            </div>

            <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-6">
              <div className="flex items-center justify-between mb-4">
                <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-mono font-bold tracking-wider bg-emerald-100 text-emerald-700">
                  POST
                </span>
                <code className="text-sm font-bold text-gray-900">/api/keys/generate</code>
              </div>
              <p className="text-gray-600">Generate new API key for your application.</p>
            </div>

            <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-6">
              <div className="flex items-center justify-between mb-4">
                <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-mono font-bold tracking-wider bg-red-100 text-red-700">
                  DELETE
                </span>
                <code className="text-sm font-bold text-gray-900">/api/keys/:key</code>
              </div>
              <p className="text-gray-600">Delete or revoke existing API key.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Code Example Section */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Code Example</h2>
            <p className="text-xl text-gray-600">Quick start with this JavaScript example.</p>
          </div>
          
          <div className="max-w-4xl mx-auto">
            <div className="bg-gray-900 rounded-2xl p-6 text-left">
              <div className="flex items-center justify-between mb-4">
                <span className="text-emerald-400 text-sm font-mono">javascript</span>
                <button className="text-gray-400 hover:text-white transition-colors p-2 rounded hover:bg-gray-800">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8v8z" />
                  </svg>
                </button>
              </div>
              <pre className="text-emerald-300 text-sm overflow-x-auto">
                <code>{`const response = await fetch('https://bot-rebuilder.onrender.com/api/chat', {
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

      {/* Authentication Section */}
      <section className="py-20 bg-white">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Authentication</h2>
            <p className="text-xl text-gray-600">Secure authentication for all API requests.</p>
          </div>
          
          <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-6">
              <div className="flex items-center mb-4">
                <Key className="w-8 h-8 text-emerald-600 mr-3" />
                <h3 className="text-lg font-semibold text-gray-900">API Key Required</h3>
              </div>
              <p className="text-gray-600 mb-4">Every API request requires X-API-Key header with your unique key.</p>
              <div className="bg-gray-100 rounded-lg p-4">
                <code className="text-sm text-gray-900">X-API-Key: pk_xxxxxxxxxxxxxxxxxx</code>
              </div>
              <div className="flex items-center text-sm text-gray-500">
                <AlertCircle className="w-4 h-4 mr-2" />
                <span>Keep your key secret — never share it publicly</span>
              </div>
            </div>

            <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-6">
              <div className="flex items-center mb-4">
                <Shield className="w-8 h-8 text-blue-600 mr-3" />
                <h3 className="text-lg font-semibold text-gray-900">Key Management</h3>
              </div>
              <p className="text-gray-600 mb-4">You will receive your API key via email after payment.</p>
              <div className="flex items-center text-sm text-gray-500">
                <Check className="w-4 h-4 mr-2" />
                <span>If your key is compromised, contact support for regeneration</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Pricing</h2>
            <p className="text-xl text-gray-600">Flexible pricing plans for businesses of all sizes.</p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-8 text-center hover:shadow-xl transition-shadow">
              <div className="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl font-bold text-emerald-600">RS. 3K</span>
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">Starter</h3>
              <p className="text-gray-600 mb-4">Perfect for small projects and testing</p>
              <ul className="text-left text-gray-600 space-y-2 mb-6">
                <li>• 500 requests per month</li>
                <li>• Basic support</li>
                <li>• Standard features</li>
              </ul>
              <div className="text-3xl font-bold text-gray-900">Rs. 3,000/month</div>
            </div>

            <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-8 text-center hover:shadow-xl transition-shadow relative">
              <div className="absolute -top-3 -right-3 bg-emerald-600 text-white text-xs px-2 py-1 rounded-full">
                Popular
              </div>
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl font-bold text-blue-600">RS. 5K</span>
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">Pro</h3>
              <p className="text-gray-600 mb-4">For growing businesses and startups</p>
              <ul className="text-left text-gray-600 space-y-2 mb-6">
                <li>• 1,500 requests per month</li>
                <li>• Priority support</li>
                <li>• Advanced features</li>
              </ul>
              <div className="text-3xl font-bold text-gray-900">Rs. 5,000/month</div>
            </div>

            <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-8 text-center hover:shadow-xl transition-shadow">
              <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl font-bold text-purple-600">∞</span>
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">Enterprise</h3>
              <p className="text-gray-600 mb-4">For large organizations with high volume</p>
              <ul className="text-left text-gray-600 space-y-2 mb-6">
                <li>• Unlimited requests</li>
                <li>• Dedicated support</li>
                <li>• Custom features</li>
              </ul>
              <div className="text-3xl font-bold text-gray-900">Rs. 15,000/month</div>
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
