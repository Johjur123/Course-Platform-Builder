import { Layout } from "@/components/layout/Layout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { XCircle, ArrowLeft } from "lucide-react";
import { Link } from "wouter";

export default function PaymentCancelPage() {
  return (
    <Layout>
      <div className="max-w-lg mx-auto px-4 py-12">
        <Card className="text-center">
          <CardHeader>
            <div className="mx-auto p-4 rounded-full bg-muted mb-4 w-fit">
              <XCircle className="h-12 w-12 text-muted-foreground" />
            </div>
            <CardTitle className="text-2xl">Betaling geannuleerd</CardTitle>
            <CardDescription className="text-base">
              Je bestelling is niet voltooid. Je bent niet belast.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <Button asChild className="w-full" data-testid="button-try-again">
              <Link href="/payment">Opnieuw proberen</Link>
            </Button>
            <Button asChild variant="outline" className="w-full" data-testid="button-back-home">
              <Link href="/">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Terug naar home
              </Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
}
