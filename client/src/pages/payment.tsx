import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { Layout } from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { CheckCircle, CreditCard, Loader2, Shield, Video, BookOpen } from "lucide-react";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { useLocation } from "wouter";

interface CourseInfo {
  title: string;
  description: string;
  moduleCount: number;
  lessonCount: number;
  price: number;
  currency: string;
}

function formatPrice(amount: number, currency: string) {
  return new Intl.NumberFormat("nl-NL", {
    style: "currency",
    currency: currency.toUpperCase(),
  }).format(amount / 100);
}

export default function PaymentPage() {
  const [, setLocation] = useLocation();
  const { toast } = useToast();

  const { data: courseInfo, isLoading } = useQuery<CourseInfo>({
    queryKey: ["/api/course-info"],
  });

  const checkout = useMutation({
    mutationFn: async () => {
      const response = await apiRequest("POST", "/api/checkout");
      return response.json();
    },
    onSuccess: (data: { url: string }) => {
      if (data.url) {
        window.location.href = data.url;
      }
    },
    onError: () => {
      toast({
        title: "Fout",
        description: "Kon de betaling niet starten. Probeer het opnieuw.",
        variant: "destructive",
      });
    },
  });

  if (isLoading) {
    return (
      <Layout>
        <div className="max-w-2xl mx-auto px-4 py-12">
          <Skeleton className="h-96 w-full rounded-lg" />
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="max-w-2xl mx-auto px-4 py-12">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold mb-2">Cursus aanschaffen</h1>
          <p className="text-muted-foreground">
            Eenmalige betaling, levenslange toegang
          </p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-primary/10">
                <BookOpen className="h-5 w-5 text-primary" />
              </div>
              {courseInfo?.title || "Cursus"}
            </CardTitle>
            {courseInfo?.description && (
              <CardDescription className="text-base">
                {courseInfo.description}
              </CardDescription>
            )}
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid sm:grid-cols-2 gap-4">
              <div className="flex items-center gap-3 p-3 rounded-lg bg-muted/50">
                <Video className="h-5 w-5 text-muted-foreground" />
                <div>
                  <p className="font-medium">{courseInfo?.lessonCount || 0} lessen</p>
                  <p className="text-sm text-muted-foreground">
                    In {courseInfo?.moduleCount || 0} modules
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-3 p-3 rounded-lg bg-muted/50">
                <Shield className="h-5 w-5 text-muted-foreground" />
                <div>
                  <p className="font-medium">Levenslange toegang</p>
                  <p className="text-sm text-muted-foreground">Geen abonnement</p>
                </div>
              </div>
            </div>

            <ul className="space-y-3">
              <li className="flex items-center gap-3">
                <CheckCircle className="h-5 w-5 text-green-500 shrink-0" />
                <span>Volledige toegang tot alle lessen</span>
              </li>
              <li className="flex items-center gap-3">
                <CheckCircle className="h-5 w-5 text-green-500 shrink-0" />
                <span>Voortgang bijhouden</span>
              </li>
              <li className="flex items-center gap-3">
                <CheckCircle className="h-5 w-5 text-green-500 shrink-0" />
                <span>Leer op je eigen tempo</span>
              </li>
              <li className="flex items-center gap-3">
                <CheckCircle className="h-5 w-5 text-green-500 shrink-0" />
                <span>Toegang vanaf elk apparaat</span>
              </li>
            </ul>

            <div className="pt-4 border-t">
              <div className="flex items-center justify-between mb-4">
                <span className="text-lg font-medium">Totaal</span>
                <span className="text-2xl font-bold" data-testid="text-price">
                  {courseInfo ? formatPrice(courseInfo.price, courseInfo.currency) : "€ --"}
                </span>
              </div>

              <Button
                className="w-full h-12"
                size="lg"
                onClick={() => checkout.mutate()}
                disabled={checkout.isPending}
                data-testid="button-checkout"
              >
                {checkout.isPending ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    Bezig...
                  </>
                ) : (
                  <>
                    <CreditCard className="h-4 w-4 mr-2" />
                    Afrekenen
                  </>
                )}
              </Button>

              <p className="text-xs text-center text-muted-foreground mt-4">
                Veilig betalen via Stripe
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
}
