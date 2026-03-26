import * as React from "react";
import { cn } from "@/lib/utils";
import { Loader2 } from "lucide-react";

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "default" | "secondary" | "outline" | "ghost" | "destructive" | "glass";
  size?: "default" | "sm" | "lg" | "icon";
  isLoading?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = "default", size = "default", isLoading, children, ...props }, ref) => {
    const baseStyles = "inline-flex items-center justify-center rounded-xl font-medium transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/50 disabled:opacity-50 disabled:pointer-events-none active:scale-[0.98]";
    
    const variants = {
      default: "bg-primary text-primary-foreground shadow-md hover:bg-primary/90 hover:shadow-lg",
      secondary: "bg-secondary text-secondary-foreground hover:bg-secondary/80",
      outline: "border-2 border-border bg-transparent hover:bg-muted text-foreground",
      ghost: "hover:bg-muted text-foreground hover:text-primary",
      destructive: "bg-destructive text-destructive-foreground shadow-sm hover:bg-destructive/90",
      glass: "bg-white/20 backdrop-blur-md text-white border border-white/30 hover:bg-white/30 shadow-[0_4px_15px_rgba(0,0,0,0.1)]"
    };

    const sizes = {
      default: "h-11 px-5 py-2",
      sm: "h-9 px-4 text-sm",
      lg: "h-14 px-8 text-lg rounded-2xl",
      icon: "h-11 w-11",
    };

    return (
      <button
        ref={ref}
        disabled={isLoading || props.disabled}
        className={cn(baseStyles, variants[variant], sizes[size], className)}
        {...props}
      >
        {isLoading && <Loader2 className="mr-2 h-5 w-5 animate-spin" />}
        {children}
      </button>
    );
  }
);
Button.displayName = "Button";

export { Button };
