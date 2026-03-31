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
  
  // Real data management
  const [totalUsers, setTotalUsers] = useState(0);
  const [activeKeys, setActiveKeys] = useState(0);
  const [totalRequests, setTotalRequests] = useState(15432);
  const [keyStatuses, setKeyStatuses] = useState<{[key: string]: {active: boolean, user: string}}>({});

  // Simulate API calls (requests update)
  useEffect(() => {
    const interval = setInterval(() => {
      // Only update requests when API is being used (random simulation)
      if (Math.random() > 0.3) { // 70% chance of API call
        setTotalRequests(prev => prev + Math.floor(Math.random() * 5) + 1);
      }
    }, 4000); // Check every 4 seconds

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
    
    // Update real data
    setGeneratedKeys(prev => [newKey, ...prev.slice(0, 4)]);
    setTotalUsers(prev => prev + 1); // Add new user
    setActiveKeys(prev => prev + 1); // Add active key
    setKeyStatuses(prev => ({
      ...prev,
      [newKey]: { active: true, user: `User${totalUsers + 1}` }
    }));
  };

  const copyKey = (key: string, index: number) => {
    navigator.clipboard.writeText(key);
    setCopiedKey(index);
    setTimeout(() => setCopiedKey(null), 2000);
  };

  const deleteKey = (key: string, index: number) => {
    // Remove from generated keys
    setGeneratedKeys(prev => prev.filter((_, i) => i !== index));
    
    // Update total users (decrease)
    setTotalUsers(prev => prev - 1);
    
    // Update active keys if key was active
    if (keyStatuses[key]?.active) {
      setActiveKeys(prev => prev - 1);
    }
    
    // Remove from key statuses
    setKeyStatuses(prev => {
      const newStatuses = {...prev};
      delete newStatuses[key];
      return newStatuses;
    });
  };

  const toggleKeyStatus = (key: string) => {
    setKeyStatuses(prev => ({
      ...prev,
      [key]: { ...prev[key], active: !prev[key].active }
    }));
    
    // Update active keys count
    if (keyStatuses[key]?.active) {
      setActiveKeys(prev => prev - 1); // Deactivating
    } else {
      setActiveKeys(prev => prev + 1); // Activating
    }
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

          {/* Stats Grid - 3 cards now */}
          <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto mb-12">
            <div className="bg-white rounded-2xl shadow-xl shadow-gray-900/10 border border-gray-200 p-8 text-center hover:shadow-2xl hover:shadow-gray-900/20 transform hover:-translate-y-2 transition-all duration-300 hover:bg-gradient-to-br hover:from-white hover:to-blue-50">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Users className="w-8 h-8 text-blue-600" />
              </div>
              <h3 className="text-3xl font-bold text-gray-900 mb-2">{totalUsers}</h3>
              <p className="text-gray-600">Total Users</p>
            </div>

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
          <div className="max-w-4xl mx-auto mb-12">
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
                    <div key={index} className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-3">
                          <code className="text-sm font-mono text-gray-900 flex-1 truncate">
                            {key}
                          </code>
                          <span className="text-xs text-gray-500">
                            {keyStatuses[key]?.user || 'Unknown'}
                          </span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Button
                            onClick={() => toggleKeyStatus(key)}
                            variant={keyStatuses[key]?.active ? "secondary" : "outline"}
                            size="sm"
                            className="text-xs"
                          >
                            {keyStatuses[key]?.active ? 'Disable' : 'Enable'}
                          </Button>
                          <Button
                            onClick={() => copyKey(key, index)}
                            variant="outline"
                            size="sm"
                            className="text-xs"
                          >
                            {copiedKey === index ? (
                              <>
                                <Check className="w-3 h-3 mr-1" />
                                Copied!
                              </>
                            ) : (
                              <>
                                <Copy className="w-3 h-3 mr-1" />
                                Copy
                              </>
                            )}
                          </Button>
                          <Button
                            onClick={() => deleteKey(key, index)}
                            variant="destructive"
                            size="sm"
                            className="text-xs"
                          >
                            Delete
                          </Button>
                        </div>
                      </div>
                      <div className="text-xs text-gray-500">
                        Status: {keyStatuses[key]?.active ? 'Active' : 'Disabled'}
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
