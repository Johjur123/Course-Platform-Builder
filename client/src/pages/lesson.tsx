import { useQuery, useMutation } from "@tanstack/react-query";
import { useParams, Link, useLocation } from "wouter";
import { Layout } from "@/components/layout/Layout";
import { VimeoPlayer } from "@/components/course/VimeoPlayer";
import { LessonCompletion } from "@/components/course/LessonCompletion";
import { ModuleAccordion } from "@/components/course/ModuleAccordion";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { ChevronLeft, ChevronRight, Lock } from "lucide-react";
import { queryClient, apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import type { Lesson, ModuleWithLessons, UserProgress } from "@shared/schema";

interface LessonData {
  lesson: Lesson;
  modules: ModuleWithLessons[];
  progress: UserProgress[];
  hasAccess: boolean;
  previousLesson: Lesson | null;
  nextLesson: Lesson | null;
}

function LessonSkeleton() {
  return (
    <div className="grid lg:grid-cols-3 gap-6">
      <div className="lg:col-span-2 space-y-6">
        <Skeleton className="aspect-video w-full rounded-lg" />
        <Skeleton className="h-8 w-3/4" />
        <Skeleton className="h-16 w-full" />
      </div>
      <div className="space-y-4">
        <Skeleton className="h-24 w-full" />
        <Skeleton className="h-24 w-full" />
      </div>
    </div>
  );
}

export default function LessonPage() {
  const params = useParams<{ id: string }>();
  const lessonId = parseInt(params.id || "0");
  const [, setLocation] = useLocation();
  const { toast } = useToast();

  const { data, isLoading, error } = useQuery<LessonData>({
    queryKey: ["/api/lessons", lessonId],
    enabled: lessonId > 0,
  });

  const toggleCompletion = useMutation({
    mutationFn: async (completed: boolean) => {
      await apiRequest("POST", `/api/progress/${lessonId}`, { completed });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/lessons", lessonId] });
      queryClient.invalidateQueries({ queryKey: ["/api/dashboard"] });
    },
    onError: () => {
      toast({
        title: "Fout",
        description: "Kon de voortgang niet opslaan. Probeer het opnieuw.",
        variant: "destructive",
      });
    },
  });

  if (error) {
    return (
      <Layout>
        <div className="max-w-6xl mx-auto px-4 py-8">
          <Card className="p-6 text-center">
            <p className="text-destructive">Les niet gevonden of geen toegang.</p>
            <Button asChild className="mt-4">
              <Link href="/">Terug naar dashboard</Link>
            </Button>
          </Card>
        </div>
      </Layout>
    );
  }

  if (!data?.hasAccess && !isLoading) {
    return (
      <Layout>
        <div className="max-w-lg mx-auto px-4 py-12">
          <Card className="p-8 text-center">
            <div className="mx-auto p-4 rounded-full bg-muted mb-4 w-fit">
              <Lock className="h-8 w-8 text-muted-foreground" />
            </div>
            <h2 className="text-xl font-semibold mb-2">Geen toegang</h2>
            <p className="text-muted-foreground mb-6">
              Je hebt nog geen toegang tot deze cursus.
            </p>
            <Button asChild>
              <Link href="/payment">Cursus aanschaffen</Link>
            </Button>
          </Card>
        </div>
      </Layout>
    );
  }

  const isCompleted = data?.progress.some(
    p => p.lessonId === lessonId && p.completed
  ) ?? false;

  return (
    <Layout>
      <div className="max-w-7xl mx-auto px-4 py-6">
        {isLoading ? (
          <LessonSkeleton />
        ) : data ? (
          <div className="grid lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 space-y-6">
              <VimeoPlayer
                vimeoId={data.lesson.vimeoId}
                title={data.lesson.title}
              />

              <div>
                <h1 className="text-2xl font-bold mb-2" data-testid="text-lesson-title">
                  {data.lesson.title}
                </h1>
                {data.lesson.description && (
                  <p className="text-muted-foreground">
                    {data.lesson.description}
                  </p>
                )}
              </div>

              <LessonCompletion
                completed={isCompleted}
                onToggle={(completed) => toggleCompletion.mutate(completed)}
                isPending={toggleCompletion.isPending}
              />

              <div className="flex items-center justify-between pt-4 border-t">
                {data.previousLesson ? (
                  <Button
                    variant="outline"
                    onClick={() => setLocation(`/lesson/${data.previousLesson!.id}`)}
                    data-testid="button-previous-lesson"
                  >
                    <ChevronLeft className="h-4 w-4 mr-2" />
                    Vorige les
                  </Button>
                ) : (
                  <div />
                )}
                {data.nextLesson ? (
                  <Button
                    onClick={() => setLocation(`/lesson/${data.nextLesson!.id}`)}
                    data-testid="button-next-lesson"
                  >
                    Volgende les
                    <ChevronRight className="h-4 w-4 ml-2" />
                  </Button>
                ) : (
                  <Button asChild>
                    <Link href="/">Terug naar overzicht</Link>
                  </Button>
                )}
              </div>
            </div>

            <div className="lg:sticky lg:top-20 lg:self-start">
              <h2 className="font-semibold mb-4">Cursusinhoud</h2>
              <ModuleAccordion
                modules={data.modules}
                progress={data.progress}
                currentLessonId={lessonId}
              />
            </div>
          </div>
        ) : null}
      </div>
    </Layout>
  );
}
