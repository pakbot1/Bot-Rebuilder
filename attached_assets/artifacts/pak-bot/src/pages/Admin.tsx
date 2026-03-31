import { Button } from "@/components/ui/button";
import { Lock, Shield, Users, Activity, Settings, LogOut, Eye, EyeOff, Check, Copy } from "lucide-react";
import { useState, useEffect } from "react";

export default function Admin() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loginError, setLoginError] = useState(false);
  const [generatedKeys, setGeneratedKeys] = useState<string[]>([]);
  const [copiedKey, setCopiedKey] = useState<number | null>(null);
  
  // Admin password (you can change this)
  const adminPassword = "admin123456";
  
  // Mock data for dashboard (real-time updates)
  const [activeKeys, setActiveKeys] = useState(89);
  const [totalRequests, setTotalRequests] = useState(15432);

  // Real-time updates for stats
  useEffect(() => {
    const interval = setInterval(() => {
      setActiveKeys(prev => Math.min(prev + Math.floor(Math.random() * 2), 150));
      setTotalRequests(prev => prev + Math.floor(Math.random() * 15));
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (password === adminPassword) {
      setIsAuthenticated(true);
      setLoginError(false);
    } else {
      setLoginError(true);
      setTimeout(() => setLoginError(false), 2000);
    }
  };

  const handleSignOut = () => {
    setIsAuthenticated(false);
    setPassword("");
    setShowPassword(false);
  };

  const generateApiKey = () => {
    const randomHex = Array.from({length: 32}, () => 
      Math.floor(Math.random() * 16).toString(16)
    ).join('');
    const newKey = `pk_${randomHex}`;
    
    setGeneratedKeys(prev => [newKey, ...prev.slice(0, 4)]); // Keep last 5 keys
  };

  const copyKey = (key: string, index: number) => {
    navigator.clipboard.writeText(key);
    setCopiedKey(index);
    setTimeout(() => setCopiedKey(null), 2000);
  };

  // If not authenticated, show login screen
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gray-50">
        {/* Navigation Menu */}
        <nav className="bg-white border-b border-gray-200 sticky top-0 z-50">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-center items-center h-16 space-x-8">
              <a href="/" className="text-gray-600 hover:text-emerald-600 font-medium transition-colors">
                Home
              </a>
              <a href="/developer" className="text-gray-600 hover:text-emerald-600 font-medium transition-colors">
                Developer
              </a>
              <a href="/admin" className="text-gray-900 hover:text-emerald-600 font-medium transition-colors">
                Admin
              </a>
              <a href="/docs" className="text-gray-600 hover:text-emerald-600 font-medium transition-colors">
                Documentation
              </a>
            </div>
          </div>
        </nav>

        {/* Login Screen */}
        <section className="py-20 bg-white">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <div className="w-24 h-24 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <Shield className="w-12 h-12 text-red-600" />
              </div>
              <h1 className="text-5xl lg:text-6xl font-black tracking-tight mb-6">
                Admin Panel
                <span className="block text-red-600">Restricted Access</span>
              </h1>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                Enter admin credentials to access the system management dashboard.
              </p>
            </div>

            <div className="max-w-md mx-auto">
              <form onSubmit={handleLogin} className="bg-white rounded-2xl shadow-xl shadow-gray-900/10 border border-gray-200 p-8">
                <div className="mb-6">
                  <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
                    Admin Password
                  </label>
                  <div className="relative">
                    <input
                      type={showPassword ? "text" : "password"}
                      id="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="w-full px-4 py-3 pr-12 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500"
                      placeholder="Enter admin password"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                    >
                      {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                    </button>
                  </div>
                  {loginError && (
                    <p className="mt-2 text-sm text-red-600">Invalid password. Access denied.</p>
                  )}
                </div>
                
                <Button type="submit" className="w-full bg-red-600 hover:bg-red-700 text-white">
                  Access Admin Panel
                </Button>
              </form>
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

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navigation Menu */}
      <nav className="bg-white border-b border-gray-200 sticky top-0 z-50">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex justify-center items-center h-16 space-x-8">
              <a href="/" className="text-gray-600 hover:text-emerald-600 font-medium transition-colors">
                Home
              </a>
              <a href="/developer" className="text-gray-600 hover:text-emerald-600 font-medium transition-colors">
                Developer
              </a>
              <a href="/admin" className="text-gray-900 hover:text-emerald-600 font-medium transition-colors">
                Admin
              </a>
              <a href="/docs" className="text-gray-600 hover:text-emerald-600 font-medium transition-colors">
                Documentation
              </a>
            </div>
            <Button 
              onClick={handleSignOut}
              className="bg-red-600 hover:bg-red-700 text-white flex items-center gap-2"
            >
              <LogOut className="w-4 h-4" />
              Sign Out
            </Button>
          </div>
        </div>
      </nav>

      {/* Admin Dashboard Header */}
      <section className="py-20 bg-white">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h1 className="text-5xl lg:text-6xl font-black tracking-tight mb-6">
              Admin Dashboard
              <span className="block text-red-600">System Management</span>
            </h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Monitor system performance, manage users, and control platform settings.
            </p>
          </div>

          {/* Stats Grid - Only 2 cards now */}
          <div className="grid md:grid-cols-2 gap-8 max-w-3xl mx-auto mb-12">
            <div className="bg-white rounded-2xl shadow-xl shadow-gray-900/10 border border-gray-200 p-8 text-center hover:shadow-2xl hover:shadow-gray-900/20 transform hover:-translate-y-2 transition-all duration-300 hover:bg-gradient-to-br hover:from-white hover:to-emerald-50">
              <div className="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Lock className="w-8 h-8 text-emerald-600" />
              </div>
              <h3 className="text-3xl font-bold text-gray-900 mb-2">{activeKeys}</h3>
              <p className="text-gray-600">Active API Keys</p>
            </div>

            <div className="bg-white rounded-2xl shadow-xl shadow-gray-900/10 border border-gray-200 p-8 text-center hover:shadow-2xl hover:shadow-gray-900/20 transform hover:-translate-y-2 transition-all duration-300 hover:bg-gradient-to-br hover:from-white hover:to-purple-50">
              <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Activity className="w-8 h-8 text-purple-600" />
              </div>
              <h3 className="text-3xl font-bold text-gray-900 mb-2">{totalRequests.toLocaleString()}</h3>
              <p className="text-gray-600">Total Requests</p>
            </div>
          </div>

          {/* API Key Generator */}
          <div className="max-w-2xl mx-auto mb-12">
            <div className="bg-white rounded-2xl shadow-xl shadow-gray-900/10 border border-gray-200 p-8">
              <div className="flex items-center mb-6">
                <Lock className="w-6 h-6 text-red-600 mr-3" />
                <h3 className="text-xl font-semibold text-gray-900">API Key Generator</h3>
              </div>
              
              <div className="text-center mb-6">
                <Button 
                  onClick={generateApiKey}
                  className="bg-red-600 hover:bg-red-700 text-white px-8"
                >
                  Generate New API Key
                </Button>
              </div>

              {generatedKeys.length > 0 && (
                <div className="space-y-3">
                  <h4 className="text-sm font-medium text-gray-700">Generated Keys:</h4>
                  {generatedKeys.map((key, index) => (
                    <div key={index} className="bg-gray-50 rounded-lg p-3 border border-gray-200">
                      <div className="flex items-center justify-between">
                        <code className="text-sm font-mono text-gray-900 flex-1 truncate">
                          {key}
                        </code>
                        <Button
                          onClick={() => copyKey(key, index)}
                          variant="outline"
                          size="sm"
                          className="ml-4"
                        >
                          {copiedKey === index ? (
                            <>
                              <Check className="w-4 h-4 mr-2" />
                              Copied!
                            </>
                          ) : (
                            <>
                              <Copy className="w-4 h-4 mr-2" />
                              Copy
                            </>
                          )}
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Admin Actions */}
          <div className="max-w-2xl mx-auto">
            <div className="bg-white rounded-2xl shadow-xl shadow-gray-900/10 border border-gray-200 p-8">
              <div className="flex items-center mb-6">
                <Settings className="w-6 h-6 text-red-600 mr-3" />
                <h3 className="text-xl font-semibold text-gray-900">Admin Actions</h3>
              </div>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Button variant="outline" className="flex items-center justify-center gap-2">
                  <Users className="w-4 h-4" />
                  Manage Users
                </Button>
                
                <Button variant="outline" className="flex items-center justify-center gap-2">
                  <Lock className="w-4 h-4" />
                  API Keys
                </Button>
                
                <Button variant="outline" className="flex items-center justify-center gap-2">
                  <Activity className="w-4 h-4" />
                  System Logs
                </Button>
                
                <Button variant="outline" className="flex items-center justify-center gap-2">
                  <Settings className="w-4 h-4" />
                  Settings
                </Button>
              </div>
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
