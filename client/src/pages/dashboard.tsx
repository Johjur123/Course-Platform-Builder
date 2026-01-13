import { useQuery } from "@tanstack/react-query";
import { Layout } from "@/components/layout/Layout";
import { ModuleAccordion } from "@/components/course/ModuleAccordion";
import { CourseProgress } from "@/components/course/CourseProgress";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Lock, CreditCard } from "lucide-react";
import { Link } from "wouter";
import type { CourseWithModules, UserProgress } from "@shared/schema";

interface DashboardData {
  course: CourseWithModules;
  progress: UserProgress[];
  hasAccess: boolean;
}

function DashboardSkeleton() {
  return (
    <div className="space-y-6">
      <Skeleton className="h-8 w-64" />
      <Skeleton className="h-32 w-full" />
      <div className="space-y-4">
        <Skeleton className="h-24 w-full" />
        <Skeleton className="h-24 w-full" />
        <Skeleton className="h-24 w-full" />
      </div>
    </div>
  );
}

function LockedContent() {
  return (
    <Card className="max-w-lg mx-auto" data-testid="card-locked-content">
      <CardHeader className="text-center">
        <div className="mx-auto p-4 rounded-full bg-muted mb-4">
          <Lock className="h-8 w-8 text-muted-foreground" />
        </div>
        <CardTitle>Cursus is vergrendeld</CardTitle>
        <CardDescription>
          Schaf de cursus aan om toegang te krijgen tot alle lessen en materialen.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Button asChild className="w-full" size="lg" data-testid="button-purchase">
          <Link href="/payment">
            <CreditCard className="h-4 w-4 mr-2" />
            Cursus aanschaffen
          </Link>
        </Button>
      </CardContent>
    </Card>
  );
}

export default function Dashboard() {
  const { data, isLoading, error } = useQuery<DashboardData>({
    queryKey: ["/api/dashboard"],
  });

  if (error) {
    return (
      <Layout>
        <div className="max-w-6xl mx-auto px-4 py-8">
          <Card className="p-6 text-center">
            <p className="text-destructive">Er is iets misgegaan bij het laden van de cursus.</p>
          </Card>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="max-w-6xl mx-auto px-4 py-8">
        {isLoading ? (
          <DashboardSkeleton />
        ) : !data?.hasAccess ? (
          <div className="py-12">
            <LockedContent />
          </div>
        ) : (
          <div className="space-y-8">
            <div>
              <h1 className="text-3xl font-bold mb-2" data-testid="text-course-title">
                {data.course.title}
              </h1>
              {data.course.description && (
                <p className="text-muted-foreground text-lg">
                  {data.course.description}
                </p>
              )}
            </div>

            <CourseProgress
              modules={data.course.modules}
              progress={data.progress}
            />

            <div>
              <h2 className="text-xl font-semibold mb-4">Cursusinhoud</h2>
              <ModuleAccordion
                modules={data.course.modules}
                progress={data.progress}
              />
            </div>
          </div>
        )}
      </div>
    </Layout>
  );
}
