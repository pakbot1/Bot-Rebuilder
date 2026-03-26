import { useState } from "react";
import { Navbar } from "@/components/layout/Navbar";
import { useAuth } from "@/hooks/use-auth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Key, Bot as BotIcon, LogOut, Plus, Activity } from "lucide-react";
import { useListBots, useCreateBot } from "@workspace/api-client-react";
import { format } from "date-fns";

export default function Dashboard() {
  const { apiKey, setApiKey, logoutDeveloper } = useAuth();
  const [inputKey, setInputKey] = useState("");
  const [newBotName, setNewBotName] = useState("");
  const [isCreating, setIsCreating] = useState(false);

  const { data: bots, isLoading, isError, refetch } = useListBots({
    query: { enabled: !!apiKey, retry: false },
    request: { headers: { "X-API-Key": apiKey } as HeadersInit }
  });

  const createBot = useCreateBot({
    request: { headers: { "X-API-Key": apiKey } as HeadersInit },
    mutation: {
      onSuccess: () => {
        refetch();
        setNewBotName("");
        setIsCreating(false);
      }
    }
  });

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (inputKey.trim()) setApiKey(inputKey.trim());
  };

  const handleCreateBot = (e: React.FormEvent) => {
    e.preventDefault();
    if (newBotName.trim()) {
      createBot.mutate({ data: { name: newBotName } });
    }
  };

  if (!apiKey || isError) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="pt-32 pb-20 px-4 max-w-lg mx-auto">
          <Card className="shadow-xl border-border/60">
            <CardHeader className="text-center pb-2">
              <div className="w-16 h-16 rounded-2xl bg-emerald-100 flex items-center justify-center mx-auto mb-4 text-primary">
                <Key className="w-8 h-8" />
              </div>
              <CardTitle className="text-2xl">Developer Portal</CardTitle>
              <CardDescription>Enter your API key to manage your bots</CardDescription>
            </CardHeader>
            <CardContent>
              {isError && (
                <div className="p-3 mb-6 bg-red-50 text-red-700 text-sm rounded-lg border border-red-200">
                  Invalid API Key. Please try again.
                </div>
              )}
              <form onSubmit={handleLogin} className="space-y-4">
                <Input 
                  type="password"
                  placeholder="pk_..." 
                  value={inputKey}
                  onChange={(e) => setInputKey(e.target.value)}
                  className="h-12"
                  autoFocus
                />
                <Button type="submit" className="w-full h-12 text-md">
                  Access Dashboard
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="pt-32 pb-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-10">
          <div>
            <h1 className="text-3xl font-display font-bold text-foreground">Developer Dashboard</h1>
            <p className="text-muted-foreground mt-1">Manage your intelligent bots and webhooks</p>
          </div>
          <div className="flex items-center gap-3">
            <Button onClick={() => setIsCreating(!isCreating)}>
              <Plus className="w-4 h-4 mr-2" /> New Bot
            </Button>
            <Button variant="outline" onClick={logoutDeveloper}>
              <LogOut className="w-4 h-4 mr-2" /> Sign Out
            </Button>
          </div>
        </div>

        {isCreating && (
          <Card className="mb-8 border-primary/20 shadow-md bg-emerald-50/30">
            <CardContent className="pt-6">
              <form onSubmit={handleCreateBot} className="flex flex-col sm:flex-row gap-4 items-end">
                <div className="flex-1 w-full">
                  <label className="block text-sm font-semibold mb-2">Bot Name</label>
                  <Input 
                    placeholder="e.g., Customer Support Bot" 
                    value={newBotName}
                    onChange={(e) => setNewBotName(e.target.value)}
                    autoFocus
                  />
                </div>
                <div className="flex gap-2 w-full sm:w-auto">
                  <Button variant="outline" type="button" onClick={() => setIsCreating(false)} className="flex-1 sm:w-auto">Cancel</Button>
                  <Button type="submit" disabled={!newBotName.trim() || createBot.isPending} className="flex-1 sm:w-auto">
                    {createBot.isPending ? "Creating..." : "Save Bot"}
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        )}

        <div className="grid md:grid-cols-4 gap-6 mb-10">
          <Card>
            <CardContent className="p-6 flex items-center gap-4">
              <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                <BotIcon className="w-6 h-6" />
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">Total Bots</p>
                <h3 className="text-2xl font-bold">{bots?.length || 0}</h3>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6 flex items-center gap-4">
              <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center text-blue-600">
                <Activity className="w-6 h-6" />
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">Status</p>
                <h3 className="text-2xl font-bold text-emerald-600">Active</h3>
              </div>
            </CardContent>
          </Card>
        </div>

        <h2 className="text-xl font-bold mb-4">Your Bots</h2>
        {isLoading ? (
          <div className="h-40 flex items-center justify-center border rounded-2xl bg-white">
            <div className="w-8 h-8 rounded-full border-4 border-primary border-t-transparent animate-spin"></div>
          </div>
        ) : bots?.length === 0 ? (
          <div className="text-center p-16 border rounded-2xl bg-white/50 border-dashed">
            <BotIcon className="w-12 h-12 text-muted-foreground mx-auto mb-4 opacity-50" />
            <h3 className="text-lg font-bold mb-2">No bots yet</h3>
            <p className="text-muted-foreground mb-6">Create your first bot to start making conversational requests.</p>
            <Button onClick={() => setIsCreating(true)}>Create First Bot</Button>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {bots?.map((bot) => (
              <Card key={bot.id} className="hover:border-primary/30 transition-colors group">
                <CardHeader>
                  <div className="flex justify-between items-start mb-2">
                    <div className="w-10 h-10 rounded-xl bg-primary text-white flex items-center justify-center shadow-sm">
                      <BotIcon className="w-5 h-5" />
                    </div>
                    <span className="text-xs font-mono bg-muted px-2 py-1 rounded-md text-muted-foreground">
                      ID: {bot.id.substring(0,8)}...
                    </span>
                  </div>
                  <CardTitle className="text-lg">{bot.name}</CardTitle>
                  <CardDescription>Created on {format(new Date(bot.createdAt), "MMM d, yyyy")}</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex gap-2">
                    <Button variant="secondary" className="w-full group-hover:bg-primary group-hover:text-white transition-colors" size="sm">
                      Configure
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
