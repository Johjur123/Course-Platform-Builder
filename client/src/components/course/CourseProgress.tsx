import { Progress } from "@/components/ui/progress";
import { CheckCircle, BookOpen } from "lucide-react";
import type { ModuleWithLessons, UserProgress } from "@shared/schema";

interface CourseProgressProps {
  modules: ModuleWithLessons[];
  progress: UserProgress[];
}

export function CourseProgress({ modules, progress }: CourseProgressProps) {
  const totalLessons = modules.reduce((sum, m) => sum + m.lessons.length, 0);
  const completedLessons = progress.filter(p => p.completed).length;
  const percentage = totalLessons > 0 ? Math.round((completedLessons / totalLessons) * 100) : 0;

  return (
    <div className="p-6 rounded-lg border bg-card" data-testid="container-course-progress">
      <div className="flex items-center gap-3 mb-4">
        <div className="p-2 rounded-full bg-primary/10">
          <BookOpen className="h-5 w-5 text-primary" />
        </div>
        <div>
          <h3 className="font-semibold">Jouw voortgang</h3>
          <p className="text-sm text-muted-foreground">
            {completedLessons} van {totalLessons} lessen voltooid
          </p>
        </div>
      </div>
      
      <Progress value={percentage} className="h-3 mb-2" data-testid="progress-course-total" />
      
      <div className="flex items-center justify-between text-sm">
        <span className="text-muted-foreground">{percentage}% voltooid</span>
        {percentage === 100 && (
          <span className="flex items-center gap-1 text-green-600 font-medium">
            <CheckCircle className="h-4 w-4" />
            Cursus afgerond
          </span>
        )}
      </div>
    </div>
  );
}
