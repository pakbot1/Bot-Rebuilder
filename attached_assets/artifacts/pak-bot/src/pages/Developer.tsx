import { Button } from "@/components/ui/button";
import { Key, Users, Zap, Shield } from "lucide-react";

export default function Developer() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div className="flex items-center gap-2">
              <Key className="w-6 h-6 text-emerald-600" />
              <h1 className="text-2xl font-bold text-gray-900">Developer Portal</h1>
            </div>
            <nav className="hidden md:flex space-x-8">
              <a href="#" className="text-gray-600 hover:text-gray-900 font-medium">Home</a>
              <a href="#" className="text-emerald-600 font-medium">Developer</a>
              <a href="#" className="text-gray-600 hover:text-gray-900 font-medium">Admin</a>
            </nav>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center">
          <div className="w-24 h-24 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-8">
            <Key className="w-12 h-12 text-emerald-600" />
          </div>
          <h2 className="text-3xl font-bold text-gray-900 mb-4">Access Your Developer Dashboard</h2>
          <p className="text-gray-600 mb-8">Enter your API key to access the developer dashboard</p>
          
          <div className="max-w-md mx-auto">
            <div className="bg-white rounded-2xl shadow-lg p-8">
              <div className="mb-6">
                <label htmlFor="apiKey" className="block text-sm font-medium text-gray-700 mb-2">
                  API Key
                </label>
                <input
                  type="password"
                  id="apiKey"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                  placeholder="Enter your API key"
                />
              </div>
              
              <Button className="w-full bg-emerald-600 hover:bg-emerald-700 text-white">
                Access Dashboard
              </Button>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
