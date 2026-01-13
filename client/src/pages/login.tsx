import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { BookOpen, Shield, Video, CheckCircle } from "lucide-react";
import { Footer } from "@/components/layout/Footer";

export default function LoginPage() {
  return (
    <div className="min-h-screen flex flex-col bg-background">
      <div className="flex-1 flex flex-col lg:flex-row">
        <div className="lg:w-1/2 bg-primary/5 p-8 lg:p-12 flex flex-col justify-center">
          <div className="max-w-md mx-auto lg:mx-0">
            <div className="flex items-center gap-3 mb-8">
              <div className="p-3 rounded-lg bg-primary/10">
                <BookOpen className="h-8 w-8 text-primary" />
              </div>
              <h1 className="text-2xl font-bold">Leerplatform</h1>
            </div>
            
            <h2 className="text-3xl lg:text-4xl font-bold mb-4 leading-tight">
              Leer op jouw tempo, waar en wanneer je wilt
            </h2>
            
            <p className="text-lg text-muted-foreground mb-8">
              Toegang tot professionele videocursussen met persoonlijke voortgangstracking.
            </p>

            <div className="space-y-4">
              <div className="flex items-start gap-3">
                <div className="p-2 rounded-full bg-green-100 dark:bg-green-900/30 mt-0.5">
                  <Video className="h-4 w-4 text-green-600 dark:text-green-400" />
                </div>
                <div>
                  <h3 className="font-medium">Hoogwaardige video's</h3>
                  <p className="text-sm text-muted-foreground">Professioneel geproduceerde content</p>
                </div>
              </div>
              
              <div className="flex items-start gap-3">
                <div className="p-2 rounded-full bg-blue-100 dark:bg-blue-900/30 mt-0.5">
                  <CheckCircle className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                </div>
                <div>
                  <h3 className="font-medium">Voortgang bijhouden</h3>
                  <p className="text-sm text-muted-foreground">Zie precies waar je gebleven bent</p>
                </div>
              </div>
              
              <div className="flex items-start gap-3">
                <div className="p-2 rounded-full bg-purple-100 dark:bg-purple-900/30 mt-0.5">
                  <Shield className="h-4 w-4 text-purple-600 dark:text-purple-400" />
                </div>
                <div>
                  <h3 className="font-medium">Beveiligde toegang</h3>
                  <p className="text-sm text-muted-foreground">Jouw leerervaring is privé</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="lg:w-1/2 p-8 lg:p-12 flex items-center justify-center">
          <Card className="w-full max-w-md">
            <CardHeader className="text-center space-y-2">
              <CardTitle className="text-2xl">Welkom terug</CardTitle>
              <CardDescription>
                Log in om toegang te krijgen tot je cursussen
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <Button asChild className="w-full h-12" size="lg" data-testid="button-login">
                <a href="/api/login">
                  Inloggen met e-mail
                </a>
              </Button>
              <p className="text-xs text-center text-muted-foreground">
                Nog geen account? Je kunt je registreren via de login.
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
      <Footer />
    </div>
  );
}
