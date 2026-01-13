import { useAuth } from "@/hooks/use-auth";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { LogOut, BookOpen } from "lucide-react";
import { Link } from "wouter";

export function Header() {
  const { user, isAuthenticated, logout, isLoading } = useAuth();

  if (isLoading) {
    return (
      <header className="h-16 border-b bg-background flex items-center justify-between px-6">
        <Link href="/" className="flex items-center gap-2">
          <BookOpen className="h-6 w-6 text-primary" />
          <span className="font-semibold text-lg">Leerplatform</span>
        </Link>
        <div className="h-8 w-24 bg-muted animate-pulse rounded-md" />
      </header>
    );
  }

  return (
    <header className="h-16 border-b bg-background flex items-center justify-between px-6 sticky top-0 z-50">
      <Link href="/" className="flex items-center gap-2" data-testid="link-home">
        <BookOpen className="h-6 w-6 text-primary" />
        <span className="font-semibold text-lg">Leerplatform</span>
      </Link>

      {isAuthenticated && user ? (
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-3">
            <Avatar className="h-8 w-8">
              <AvatarImage src={user.profileImageUrl || undefined} alt={user.firstName || "User"} />
              <AvatarFallback className="text-xs">
                {user.firstName?.[0] || user.email?.[0]?.toUpperCase() || "U"}
              </AvatarFallback>
            </Avatar>
            <span className="text-sm text-muted-foreground hidden sm:block" data-testid="text-user-email">
              {user.email}
            </span>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => logout()}
            data-testid="button-logout"
          >
            <LogOut className="h-4 w-4 mr-2" />
            Uitloggen
          </Button>
        </div>
      ) : (
        <Button asChild data-testid="button-login">
          <a href="/api/login">Inloggen</a>
        </Button>
      )}
    </header>
  );
}
