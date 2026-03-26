import { useState } from "react";
import { Navbar } from "@/components/layout/Navbar";
import { useAuth } from "@/hooks/use-auth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Dialog } from "@/components/ui/dialog";
import { Shield, KeyRound, Users, Activity, Trash2, ShieldAlert, LogOut, Check, X } from "lucide-react";
import { useListApiKeys, useCreateApiKey, useUpdateApiKey, useDeleteApiKey } from "@workspace/api-client-react";
import { format } from "date-fns";
import { cn } from "@/lib/utils";

export default function Admin() {
  const { adminKey, setAdminKey, logoutAdmin } = useAuth();
  const [inputKey, setInputKey] = useState("");
  
  // Create Key state
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [newName, setNewName] = useState("");
  const [newEmail, setNewEmail] = useState("");

  const reqOptions = { request: { headers: { "X-Admin-Key": adminKey } as HeadersInit } };

  const { data: keys, isLoading, isError, refetch } = useListApiKeys({
    query: { enabled: !!adminKey, retry: false },
    ...reqOptions
  });

  const createKey = useCreateApiKey({
    ...reqOptions,
    mutation: {
      onSuccess: () => {
        refetch();
        setIsCreateOpen(false);
        setNewName("");
        setNewEmail("");
      }
    }
  });

  const updateKey = useUpdateApiKey({
    ...reqOptions,
    mutation: { onSuccess: () => refetch() }
  });

  const deleteKey = useDeleteApiKey({
    ...reqOptions,
    mutation: { onSuccess: () => refetch() }
  });

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (inputKey.trim()) setAdminKey(inputKey.trim());
  };

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault();
    if (newName.trim()) {
      createKey.mutate({ data: { name: newName, email: newEmail || undefined } });
    }
  };

  if (!adminKey || isError) {
    return (
      <div className="min-h-screen bg-[#0a1118] text-white">
        <Navbar />
        <div className="pt-32 pb-20 px-4 max-w-lg mx-auto">
          <Card className="shadow-2xl border-white/10 bg-white/5 backdrop-blur-xl">
            <CardHeader className="text-center pb-2">
              <div className="w-16 h-16 rounded-2xl bg-red-500/20 flex items-center justify-center mx-auto mb-4 text-red-500">
                <ShieldAlert className="w-8 h-8" />
              </div>
              <CardTitle className="text-2xl text-white">Admin Authentication</CardTitle>
              <CardDescription className="text-white/60">Restricted Area. Enter master admin key.</CardDescription>
            </CardHeader>
            <CardContent>
              {isError && (
                <div className="p-3 mb-6 bg-red-500/10 text-red-400 text-sm rounded-lg border border-red-500/20 text-center">
                  Access Denied. Wrong admin key.
                </div>
              )}
              <form onSubmit={handleLogin} className="space-y-4">
                <Input 
                  type="password"
                  placeholder="Master Admin Key" 
                  value={inputKey}
                  onChange={(e) => setInputKey(e.target.value)}
                  className="h-14 bg-black/40 border-white/10 text-white placeholder:text-white/40 focus-visible:ring-red-500/30 focus-visible:border-red-500/50"
                  autoFocus
                />
                <Button type="submit" className="w-full h-14 text-md bg-red-600 hover:bg-red-700 text-white border-0">
                  Authenticate
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  const activeKeys = keys?.filter(k => k.isActive).length || 0;
  const totalRequests = keys?.reduce((sum, k) => sum + k.requestCount, 0) || 0;

  return (
    <div className="min-h-screen bg-gray-50/50">
      <Navbar />
      <div className="pt-32 pb-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-10">
          <div>
            <h1 className="text-3xl font-display font-bold text-foreground flex items-center gap-3">
              <Shield className="w-8 h-8 text-primary" /> Admin Panel
            </h1>
            <p className="text-muted-foreground mt-1">Manage platform access, API keys, and developers</p>
          </div>
          <div className="flex items-center gap-3">
            <Button onClick={() => setIsCreateOpen(true)} className="shadow-md">
              <KeyRound className="w-4 h-4 mr-2" /> Create Developer Key
            </Button>
            <Button variant="outline" onClick={logoutAdmin} className="bg-white">
              <LogOut className="w-4 h-4 mr-2" /> Sign Out
            </Button>
          </div>
        </div>

        {/* Stats */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
          {[
            { label: "Total Developers", value: keys?.length || 0, icon: Users, color: "text-blue-600", bg: "bg-blue-100" },
            { label: "Active Keys", value: activeKeys, icon: KeyRound, color: "text-emerald-600", bg: "bg-emerald-100" },
            { label: "Total Requests", value: totalRequests.toLocaleString(), icon: Activity, color: "text-purple-600", bg: "bg-purple-100" },
          ].map((stat, i) => (
            <Card key={i}>
              <CardContent className="p-6 flex items-center gap-5">
                <div className={cn("w-14 h-14 rounded-2xl flex items-center justify-center shrink-0", stat.bg, stat.color)}>
                  <stat.icon className="w-7 h-7" />
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground mb-1">{stat.label}</p>
                  <h3 className="text-3xl font-display font-bold">{stat.value}</h3>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Keys Table */}
        <Card className="overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left">
              <thead className="text-xs text-muted-foreground uppercase bg-muted/50 border-b border-border">
                <tr>
                  <th className="px-6 py-4 font-semibold">Developer</th>
                  <th className="px-6 py-4 font-semibold">API Key</th>
                  <th className="px-6 py-4 font-semibold">Status</th>
                  <th className="px-6 py-4 font-semibold">Requests</th>
                  <th className="px-6 py-4 font-semibold">Created At</th>
                  <th className="px-6 py-4 font-semibold text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {isLoading ? (
                  <tr>
                    <td colSpan={6} className="px-6 py-12 text-center text-muted-foreground">
                      <div className="w-8 h-8 rounded-full border-4 border-primary border-t-transparent animate-spin mx-auto mb-4"></div>
                      Loading keys...
                    </td>
                  </tr>
                ) : keys?.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="px-6 py-12 text-center text-muted-foreground">
                      No developers yet. Create the first key above.
                    </td>
                  </tr>
                ) : keys?.map((key) => (
                  <tr key={key.id} className="bg-white hover:bg-slate-50 transition-colors">
                    <td className="px-6 py-4">
                      <div className="font-semibold text-foreground">{key.name}</div>
                      <div className="text-muted-foreground text-xs mt-0.5">{key.email || "No email"}</div>
                    </td>
                    <td className="px-6 py-4">
                      <code className="px-2 py-1 bg-slate-100 text-slate-700 rounded text-xs font-mono border border-slate-200">
                        {key.key.substring(0, 8)}...{key.key.substring(key.key.length - 4)}
                      </code>
                    </td>
                    <td className="px-6 py-4">
                      {key.isActive ? (
                        <Badge variant="success">Active</Badge>
                      ) : (
                        <Badge variant="secondary">Disabled</Badge>
                      )}
                    </td>
                    <td className="px-6 py-4 font-medium">
                      {key.requestCount.toLocaleString()}
                    </td>
                    <td className="px-6 py-4 text-muted-foreground">
                      {format(new Date(key.createdAt), "MMM d, yyyy")}
                    </td>
                    <td className="px-6 py-4 text-right space-x-2">
                      <Button
                        variant={key.isActive ? "secondary" : "outline"}
                        size="sm"
                        onClick={() => updateKey.mutate({ id: key.id, data: { isActive: !key.isActive } })}
                        disabled={updateKey.isPending}
                        className="w-24"
                      >
                        {key.isActive ? <X className="w-3 h-3 mr-1"/> : <Check className="w-3 h-3 mr-1"/>}
                        {key.isActive ? "Disable" : "Enable"}
                      </Button>
                      <Button
                        variant="destructive"
                        size="sm"
                        onClick={() => {
                          if (confirm(`Delete key for ${key.name}? This cannot be undone.`)) {
                            deleteKey.mutate({ id: key.id });
                          }
                        }}
                        disabled={deleteKey.isPending}
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      </div>

      <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
        <div className="mb-6">
          <h2 className="text-2xl font-bold font-display">Create API Key</h2>
          <p className="text-muted-foreground">Provision a new access key for a developer.</p>
        </div>
        <form onSubmit={handleCreate} className="space-y-4">
          <div>
            <label className="block text-sm font-semibold mb-1.5">Developer Name <span className="text-red-500">*</span></label>
            <Input 
              placeholder="e.g. Acme Corp" 
              value={newName} 
              onChange={(e) => setNewName(e.target.value)} 
              required
            />
          </div>
          <div>
            <label className="block text-sm font-semibold mb-1.5">Email (optional)</label>
            <Input 
              type="email"
              placeholder="dev@example.com" 
              value={newEmail} 
              onChange={(e) => setNewEmail(e.target.value)} 
            />
          </div>
          <div className="pt-4 flex gap-3">
            <Button type="button" variant="outline" className="flex-1" onClick={() => setIsCreateOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" className="flex-1" disabled={!newName.trim() || createKey.isPending}>
              {createKey.isPending ? "Creating..." : "Generate Key"}
            </Button>
          </div>
        </form>
      </Dialog>
    </div>
  );
}
