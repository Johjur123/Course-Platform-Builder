import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Progress } from "@/components/ui/progress";
import { CheckCircle, Circle, Play } from "lucide-react";
import { Link } from "wouter";
import type { ModuleWithLessons, UserProgress } from "@shared/schema";

interface ModuleAccordionProps {
  modules: ModuleWithLessons[];
  progress: UserProgress[];
  currentLessonId?: number;
}

export function ModuleAccordion({ modules, progress, currentLessonId }: ModuleAccordionProps) {
  const getModuleProgress = (moduleId: number) => {
    const moduleLessons = modules.find(m => m.id === moduleId)?.lessons || [];
    if (moduleLessons.length === 0) return 0;
    
    const completedCount = moduleLessons.filter(lesson =>
      progress.some(p => p.lessonId === lesson.id && p.completed)
    ).length;
    
    return Math.round((completedCount / moduleLessons.length) * 100);
  };

  const isLessonCompleted = (lessonId: number) => {
    return progress.some(p => p.lessonId === lessonId && p.completed);
  };

  return (
    <Accordion type="multiple" className="space-y-4" defaultValue={modules.map(m => `module-${m.id}`)}>
      {modules.map((module) => {
        const moduleProgress = getModuleProgress(module.id);
        
        return (
          <AccordionItem
            key={module.id}
            value={`module-${module.id}`}
            className="border rounded-lg px-4"
            data-testid={`accordion-module-${module.id}`}
          >
            <AccordionTrigger className="hover:no-underline py-4">
              <div className="flex flex-col items-start gap-2 w-full pr-4">
                <div className="flex items-center justify-between w-full">
                  <span className="font-semibold text-left" data-testid={`text-module-title-${module.id}`}>
                    {module.title}
                  </span>
                  <span className="text-sm text-muted-foreground">
                    {moduleProgress}% voltooid
                  </span>
                </div>
                <Progress value={moduleProgress} className="h-2 w-full" data-testid={`progress-module-${module.id}`} />
              </div>
            </AccordionTrigger>
            <AccordionContent>
              <ul className="space-y-1 pb-4">
                {module.lessons.map((lesson) => {
                  const completed = isLessonCompleted(lesson.id);
                  const isCurrent = lesson.id === currentLessonId;
                  
                  return (
                    <li key={lesson.id}>
                      <Link
                        href={`/lesson/${lesson.id}`}
                        className={`flex items-center gap-3 p-3 rounded-md transition-colors hover-elevate ${
                          isCurrent ? "bg-primary/10" : ""
                        }`}
                        data-testid={`link-lesson-${lesson.id}`}
                      >
                        {completed ? (
                          <CheckCircle className="h-5 w-5 text-green-500 shrink-0" />
                        ) : isCurrent ? (
                          <Play className="h-5 w-5 text-primary shrink-0" />
                        ) : (
                          <Circle className="h-5 w-5 text-muted-foreground shrink-0" />
                        )}
                        <div className="flex-1 min-w-0">
                          <span className={`block truncate ${completed ? "text-muted-foreground" : ""}`}>
                            {lesson.title}
                          </span>
                          {lesson.durationMinutes && (
                            <span className="text-xs text-muted-foreground">
                              {lesson.durationMinutes} min
                            </span>
                          )}
                        </div>
                      </Link>
                    </li>
                  );
                })}
              </ul>
            </AccordionContent>
          </AccordionItem>
        );
      })}
    </Accordion>
  );
}
