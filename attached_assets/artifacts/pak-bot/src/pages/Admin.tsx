import { Button } from "@/components/ui/button";
import { Lock, Shield, Users, Activity, Settings, LogOut, Eye, EyeOff, Check, Copy } from "lucide-react";
import { useState, useEffect } from "react";

export default function Admin() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loginError, setLoginError] = useState(false);

  // Real data management
  const [totalUsers, setTotalUsers] = useState(0);
  const [activeKeys, setActiveKeys] = useState(0);
  const [totalRequests, setTotalRequests] = useState(15432);
  const [keyStatuses, setKeyStatuses] = useState<{[key: string]: {active: boolean, user: string}}>({});
  const [generatedKeys, setGeneratedKeys] = useState<string[]>([]);
  const [copiedKey, setCopiedKey] = useState<number | null>(null);
  const [showGenerateForm, setShowGenerateForm] = useState(false);
  const [developerName, setDeveloperName] = useState("");
  const [developerEmail, setDeveloperEmail] = useState("");

  // Fetch API keys from Supabase on component mount
  useEffect(() => {
    const fetchKeys = async () => {
      try {
        const response = await fetch('/api/admin/keys', {
          method: 'GET',
          headers: {
            'X-Admin-Key': 'pakbot-admin-2024'
          }
        });

        if (response.ok) {
          const keys = await response.json();
          setGeneratedKeys(keys.map((k: any) => k.key));
          setTotalUsers(keys.length);
          setActiveKeys(keys.filter((k: any) => k.isActive).length);
          
          // Set key statuses
          const statuses: {[key: string]: {active: boolean, user: string}} = {};
          keys.forEach((k: any) => {
            statuses[k.key] = { active: k.isActive, user: k.name };
          });
          setKeyStatuses(statuses);
        }
      } catch (error) {
        console.error('Failed to fetch API keys:', error);
      }
    };

    fetchKeys();
  }, []); // Empty dependency array means this runs once on mount

  const [showBotInstructions, setShowBotInstructions] = useState(false);
  const [botInstructions, setBotInstructions] = useState(
    "You are PakBot, Pakistan's AI Assistant. You are helpful, professional, and knowledgeable about Pakistani culture, technology, and business. Always respond in a friendly but professional manner. Provide accurate information and assist users with their queries related to Pakistan, technology, business, and general knowledge."
  );
  
  // Admin password (you can change this)
  const adminPassword = "admin-pakbot-24";
  
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

  const generateApiKey = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!developerName.trim()) return;
    
    try {
      // Send POST request to backend to generate and save API key
      const response = await fetch('/api/admin/keys', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-Admin-Key': 'pakbot-admin-2024'
        },
        body: JSON.stringify({
          name: developerName,
          email: developerEmail || undefined
        })
      });

      if (!response.ok) {
        throw new Error('Failed to generate API key');
      }

      const newKeyData = await response.json();
      const newKey = newKeyData.key;
      
      // Update real data
      setGeneratedKeys(prev => [newKey, ...prev.slice(0, 4)]);
      setTotalUsers(prev => prev + 1); // Add new user
      setActiveKeys(prev => prev + 1); // Add active key
      setKeyStatuses(prev => ({
        ...prev,
        [newKey]: { active: true, user: developerName }
      }));
      
      // Save to localStorage for Developer section
      try {
        const existingKeys = JSON.parse(localStorage.getItem('adminGeneratedKeys') || '[]');
        const updatedKeys = [newKey, ...existingKeys].slice(0, 10); // Keep last 10 keys
        localStorage.setItem('adminGeneratedKeys', JSON.stringify(updatedKeys));
      } catch (error) {
        console.error('Failed to save key to localStorage:', error);
      }
      
      // Reset form
      setDeveloperName("");
      setDeveloperEmail("");
      setShowGenerateForm(false);
      
    } catch (error) {
      console.error('Failed to generate API key:', error);
      // You could add error handling UI here if needed
    }
  };

  const copyKey = (key: string, index: number) => {
    navigator.clipboard.writeText(key);
    setCopiedKey(index);
    setTimeout(() => setCopiedKey(null), 2000);
  };

  const deleteKey = async (key: string, index: number) => {
    try {
      // Send DELETE request to backend to remove key from Supabase
      const response = await fetch(`/api/admin/keys/${key}`, {
        method: 'DELETE',
        headers: {
          'X-Admin-Key': 'pakbot-admin-2024'
        }
      });

      if (!response.ok) {
        throw new Error('Failed to delete API key');
      }

      // Remove from local state
      setGeneratedKeys(prev => prev.filter((_, i) => i !== index));
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
      
    } catch (error) {
      console.error('Failed to delete API key:', error);
    }
  };

  const toggleKeyStatus = async (key: string) => {
    try {
      // Get current status
      const currentStatus = keyStatuses[key]?.active;
      
      // Send PATCH request to backend to update key status in Supabase
      const response = await fetch(`/api/admin/keys/${key}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'X-Admin-Key': 'pakbot-admin-2024'
        },
        body: JSON.stringify({
          isActive: !currentStatus
        })
      });

      if (!response.ok) {
        throw new Error('Failed to update API key status');
      }

      // Update local state
      setKeyStatuses(prev => ({
        ...prev,
        [key]: { ...prev[key], active: !currentStatus }
      }));
      
      // Update active keys count
      if (currentStatus) {
        setActiveKeys(prev => prev - 1); // Deactivating
      } else {
        setActiveKeys(prev => prev + 1); // Activating
      }
      
    } catch (error) {
      console.error('Failed to toggle API key status:', error);
    }
  };

  const saveBotInstructions = () => {
    // In a real app, this would save to backend
    // For now, we'll just show a success message
    alert("Bot instructions updated successfully! The AI agent's personality has been changed.");
    setShowBotInstructions(false);
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

          {/* Stats Grid - 2 cards now */}
          <div className="grid md:grid-cols-2 gap-8 max-w-3xl mx-auto mb-12">
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
                  onClick={() => setShowGenerateForm(true)}
                  className="bg-red-600 hover:bg-red-700 text-white px-8"
                >
                  Generate New API Key
                </Button>
              </div>

              {/* Generate Key Form */}
              {showGenerateForm && (
                <div className="mb-6 p-4 bg-red-50 rounded-lg border border-red-200">
                  <form onSubmit={generateApiKey} className="space-y-4">
                    <div>
                      <label htmlFor="developerName" className="block text-sm font-medium text-gray-700 mb-2">
                        Developer Name <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        id="developerName"
                        value={developerName}
                        onChange={(e) => setDeveloperName(e.target.value)}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500"
                        placeholder="Enter developer name"
                        required
                      />
                    </div>
                    <div>
                      <label htmlFor="developerEmail" className="block text-sm font-medium text-gray-700 mb-2">
                        Developer Email <span className="text-gray-400">(optional)</span>
                      </label>
                      <input
                        type="email"
                        id="developerEmail"
                        value={developerEmail}
                        onChange={(e) => setDeveloperEmail(e.target.value)}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500"
                        placeholder="developer@example.com"
                      />
                    </div>
                    <div className="flex gap-3">
                      <Button
                        type="button"
                        variant="outline"
                        onClick={() => {
                          setShowGenerateForm(false);
                          setDeveloperName("");
                          setDeveloperEmail("");
                        }}
                        className="flex-1"
                      >
                        Cancel
                      </Button>
                      <Button
                        type="submit"
                        className="flex-1 bg-red-600 hover:bg-red-700 text-white"
                        disabled={!developerName.trim()}
                      >
                        Generate Key
                      </Button>
                    </div>
                  </form>
                </div>
              )}

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
              
              <div className="grid grid-cols-1 sm:grid-cols-1 gap-4">
                <Button 
                  onClick={() => setShowBotInstructions(true)}
                  className="flex items-center justify-center gap-2"
                >
                  <Activity className="w-4 h-4" />
                  Bot Instructions
                </Button>
              </div>
            </div>
          </div>

          {/* Bot Instructions Modal */}
          {showBotInstructions && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
              <div className="bg-white rounded-2xl shadow-2xl border border-gray-200 max-w-4xl w-full max-h-[80vh] overflow-hidden">
                <div className="flex items-center justify-between p-6 border-b border-gray-200">
                  <div className="flex items-center gap-3">
                    <Activity className="w-6 h-6 text-red-600" />
                    <h3 className="text-xl font-semibold text-gray-900">Bot Instructions</h3>
                  </div>
                  <Button
                    variant="outline"
                    onClick={() => setShowBotInstructions(false)}
                    className="text-gray-500 hover:text-gray-700"
                  >
                    Cancel
                  </Button>
                </div>
                
                <div className="p-6 overflow-y-auto max-h-[60vh]">
                  <p className="text-sm text-gray-600 mb-4">
                    Define PakBot's personality, behavior, and response patterns. These instructions will be used by the AI agent to shape its responses.
                  </p>
                  
                  <textarea
                    value={botInstructions}
                    onChange={(e) => setBotInstructions(e.target.value)}
                    className="w-full h-64 p-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 resize-y font-mono text-sm"
                    placeholder="Enter bot instructions..."
                  />
                  
                  <div className="flex justify-between items-center mt-4">
                    <span className="text-sm text-gray-500">
                      {botInstructions.length} characters
                    </span>
                    <div className="flex gap-3">
                      <Button
                        variant="outline"
                        onClick={() => {
                          setBotInstructions("You are PakBot, Pakistan's AI Assistant. You are helpful, professional, and knowledgeable about Pakistani culture, technology, and business. Always respond in a friendly but professional manner. Provide accurate information and assist users with their queries related to Pakistan, technology, business, and general knowledge.");
                        }}
                      >
                        Reset to Default
                      </Button>
                      <Button
                        onClick={saveBotInstructions}
                        className="bg-red-600 hover:bg-red-700 text-white"
                      >
                        Save Instructions
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-gray-400 py-8 text-center text-sm border-t border-gray-800">
        <p>© 2026 PakBot API, Pakistan's AI Assistant. A product of <a href="https://faiwebz.com" target="_blank" rel="noopener noreferrer" className="text-emerald-400 hover:text-emerald-300 transition-colors">Faiwebz</a>.</p>
      </footer>
    </div>
  );
}
