import { useEffect } from "react";
import { Layout } from "@/components/layout/Layout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CheckCircle, ArrowRight } from "lucide-react";
import { Link } from "wouter";
import { queryClient } from "@/lib/queryClient";

export default function PaymentSuccessPage() {
  useEffect(() => {
    queryClient.invalidateQueries({ queryKey: ["/api/dashboard"] });
    queryClient.invalidateQueries({ queryKey: ["/api/auth/user"] });
  }, []);

  return (
    <Layout>
      <div className="max-w-lg mx-auto px-4 py-12">
        <Card className="text-center">
          <CardHeader>
            <div className="mx-auto p-4 rounded-full bg-green-100 dark:bg-green-900/30 mb-4 w-fit">
              <CheckCircle className="h-12 w-12 text-green-600 dark:text-green-400" />
            </div>
            <CardTitle className="text-2xl">Betaling geslaagd!</CardTitle>
            <CardDescription className="text-base">
              Je hebt nu volledige toegang tot de cursus.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button asChild size="lg" className="w-full" data-testid="button-start-course">
              <Link href="/">
                Start met leren
                <ArrowRight className="h-4 w-4 ml-2" />
              </Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
}
