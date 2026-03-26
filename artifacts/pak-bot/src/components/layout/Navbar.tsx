import { Link, useLocation } from "wouter";
import { cn } from "@/lib/utils";
import { Bot, Terminal, Shield, LayoutDashboard } from "lucide-react";
import { useAuth } from "@/hooks/use-auth";

export function Navbar() {
  const [location] = useLocation();
  const { apiKey, adminKey } = useAuth();

  const links = [
    { href: "/", label: "Home", icon: Bot },
    { href: "/docs", label: "Endpoints", icon: Terminal },
    { href: "/dashboard", label: "Developer", icon: LayoutDashboard, highlight: !!apiKey },
    { href: "/admin", label: "Admin", icon: Shield, highlight: !!adminKey },
  ];

  return (
    <nav className="fixed top-0 left-0 right-0 z-40 px-4 py-4 pointer-events-none">
      <div className="max-w-5xl mx-auto glass-panel rounded-2xl px-6 py-3 flex items-center justify-between pointer-events-auto">
        <Link href="/" className="flex items-center gap-2 group">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary to-accent flex items-center justify-center shadow-lg shadow-primary/20 group-hover:scale-105 transition-transform">
            <Bot className="text-white w-6 h-6" />
          </div>
          <span className="font-display font-bold text-xl tracking-tight text-foreground">
            PakBot API
          </span>
        </Link>
        
        <div className="hidden md:flex items-center gap-1 bg-muted/50 p-1 rounded-xl">
          {links.map((link) => {
            const Icon = link.icon;
            const isActive = location === link.href;
            return (
              <Link 
                key={link.href} 
                href={link.href}
                className={cn(
                  "flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold transition-all duration-200",
                  isActive 
                    ? "bg-white text-primary shadow-sm" 
                    : "text-muted-foreground hover:text-foreground hover:bg-white/50",
                  link.highlight && !isActive && "text-primary/70"
                )}
              >
                <Icon className="w-4 h-4" />
                {link.label}
              </Link>
            );
          })}
        </div>
      </div>
    </nav>
  );
}
