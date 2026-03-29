import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { AlertCircle } from "lucide-react";

export default function NotFound() {
  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-background px-4">
      <div className="text-center max-w-md">
        <div className="w-20 h-20 rounded-full bg-red-100 flex items-center justify-center mx-auto mb-6 text-red-500">
          <AlertCircle className="w-10 h-10" />
        </div>
        <h1 className="text-6xl font-display font-bold text-foreground mb-4">404</h1>
        <p className="text-xl text-muted-foreground mb-8">
          The page you are looking for does not exist or has been moved.
        </p>
        <Link href="/">
          <Button size="lg" className="w-full sm:w-auto">Return to Home</Button>
        </Link>
      </div>
    </div>
  );
}
