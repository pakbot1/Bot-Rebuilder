import { Button } from "@/components/ui/button";
import { Eye, EyeOff, Copy, Check, Power, PowerOff, LogOut, Key, Shield, Activity, Lock } from "lucide-react";
import { useState, useEffect } from "react";

export default function Developer() {
  const [apiKey, setApiKey] = useState("pk_1234567890abcdef1234567890abcdef");
  const [isKeyVisible, setIsKeyVisible] = useState(false);
  const [copied, setCopied] = useState(false);
  const [isActive, setIsActive] = useState(true);
  const [responseTime, setResponseTime] = useState(120);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loginError, setLoginError] = useState(false);

  // List of valid API keys (in a real app, this would come from backend)
  const validApiKeys = [
    "pk_1234567890abcdef1234567890abcdef",
    "pk_1223344556789abcdef1234567890abcdef",
    "pk_9876543210fedcba0987654321fedcba",
    "pk_abcd1234567890efghijklmnop123456"
  ];

  // Dynamic response time that changes every 2.5 seconds
  useEffect(() => {
    const responseTimes = [116, 119, 120, 122, 125];
    let index = 2; // Start with 120ms
    
    const interval = setInterval(() => {
      index = (index + 1) % responseTimes.length;
      setResponseTime(responseTimes[index]);
    }, 2500); // 2.5 seconds

    return () => clearInterval(interval);
  }, []);

  const handleCopyKey = () => {
    navigator.clipboard.writeText(apiKey);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleToggleKeyVisibility = () => {
    setIsKeyVisible(!isKeyVisible);
  };

  const handleToggleStatus = () => {
    setIsActive(!isActive);
  };

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (validApiKeys.includes(password)) {
      setIsAuthenticated(true);
      setLoginError(false);
      // Set the API key to the one that was used for login
      setApiKey(password);
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
              <a href="/developer" className="text-gray-900 hover:text-emerald-600 font-medium transition-colors">
                Developer
              </a>
              <a href="#" className="text-gray-600 hover:text-emerald-600 font-medium transition-colors">
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
              <div className="w-24 h-24 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <Lock className="w-12 h-12 text-emerald-600" />
              </div>
              <h1 className="text-5xl lg:text-6xl font-black tracking-tight mb-6">
                Developer Access
                <span className="block text-emerald-600">Authentication Required</span>
              </h1>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                Enter your API key to access the developer dashboard.
              </p>
            </div>

            <div className="max-w-md mx-auto">
              <form onSubmit={handleLogin} className="bg-white rounded-2xl shadow-xl shadow-gray-900/10 border border-gray-200 p-8">
                <div className="mb-6">
                  <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
                    API Key
                  </label>
                  <div className="relative">
                    <input
                      type={showPassword ? "text" : "password"}
                      id="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="w-full px-4 py-3 pr-12 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                      placeholder="pk_xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx"
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
                    <p className="mt-2 text-sm text-red-600">Invalid API key. Please try again.</p>
                  )}
                </div>
                
                <Button type="submit" className="w-full bg-emerald-600 hover:bg-emerald-700 text-white">
                  Access Dashboard
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
              <a href="/developer" className="text-gray-900 hover:text-emerald-600 font-medium transition-colors">
                Developer
              </a>
              <a href="#" className="text-gray-600 hover:text-emerald-600 font-medium transition-colors">
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

      {/* Developer Dashboard Header */}
      <section className="py-20 bg-white">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h1 className="text-5xl lg:text-6xl font-black tracking-tight mb-6">
              Developer Dashboard
              <span className="block text-emerald-600">Manage Your API Access</span>
            </h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Control your API keys, monitor usage, and manage your PakBot integration settings.
            </p>
          </div>

          {/* Status Card */}
          <div className="max-w-md mx-auto mb-8">
            <div className="bg-white rounded-2xl shadow-xl shadow-gray-900/10 border border-gray-200 p-6 hover:shadow-2xl hover:shadow-gray-900/20 transform hover:-translate-y-2 transition-all duration-300 hover:bg-gradient-to-br hover:from-white hover:to-emerald-50">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className={`w-12 h-12 rounded-full flex items-center justify-center ${isActive ? 'bg-emerald-100' : 'bg-red-100'}`}>
                    <Activity className={`w-6 h-6 ${isActive ? 'text-emerald-600' : 'text-red-600'}`} />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900">API Status</h3>
                    <p className="text-sm text-gray-600">Current service status</p>
                  </div>
                </div>
                <div className={`px-3 py-1 rounded-full text-sm font-medium ${isActive ? 'bg-emerald-100 text-emerald-700' : 'bg-red-100 text-red-700'}`}>
                  {isActive ? 'Active' : 'Inactive'}
                </div>
              </div>
              <div className="flex items-center justify-end text-sm text-gray-600">
                <span>Response time: {responseTime}ms</span>
              </div>
            </div>
          </div>

          {/* API Key Section */}
          <div className="max-w-2xl mx-auto">
            <div className="bg-white rounded-2xl shadow-xl shadow-gray-900/10 border border-gray-200 p-8">
              <div className="flex items-center mb-6">
                <Key className="w-6 h-6 text-emerald-600 mr-3" />
                <h3 className="text-xl font-semibold text-gray-900">Your API Key</h3>
              </div>
              
              <div className="space-y-4">
                {/* Key Display */}
                <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                  <div className="flex items-center justify-between">
                    <code className="text-sm font-mono text-gray-900 flex-1">
                      {isKeyVisible ? apiKey : "pk_" + "•".repeat(apiKey.length - 3)}
                    </code>
                    <Button
                      onClick={handleToggleKeyVisibility}
                      variant="outline"
                      size="sm"
                      className="ml-4"
                    >
                      {isKeyVisible ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </Button>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="grid grid-cols-2 gap-4">
                  <Button
                    onClick={handleCopyKey}
                    variant="outline"
                    className="flex items-center justify-center gap-2"
                  >
                    {copied ? <Check className="w-4 h-4 text-emerald-600" /> : <Copy className="w-4 h-4" />}
                    {copied ? 'Copied!' : 'Copy'}
                  </Button>
                  
                  <Button
                    onClick={handleToggleStatus}
                    className={`${isActive ? 'bg-red-600 hover:bg-red-700' : 'bg-emerald-600 hover:bg-emerald-700'} text-white flex items-center justify-center gap-2`}
                  >
                    {isActive ? <PowerOff className="w-4 h-4" /> : <Power className="w-4 h-4" />}
                    {isActive ? 'Disable' : 'Enable'}
                  </Button>
                </div>
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
