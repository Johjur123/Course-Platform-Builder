import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { CheckCircle } from "lucide-react";

interface LessonCompletionProps {
  completed: boolean;
  onToggle: (completed: boolean) => void;
  isPending?: boolean;
}

export function LessonCompletion({ completed, onToggle, isPending }: LessonCompletionProps) {
  return (
    <div
      className={`flex items-center gap-3 p-4 rounded-lg border transition-colors ${
        completed ? "bg-green-50 dark:bg-green-950/20 border-green-200 dark:border-green-800" : "bg-card"
      }`}
      data-testid="container-lesson-completion"
    >
      <Checkbox
        id="lesson-complete"
        checked={completed}
        onCheckedChange={onToggle}
        disabled={isPending}
        className="h-6 w-6"
        data-testid="checkbox-lesson-complete"
      />
      <Label
        htmlFor="lesson-complete"
        className="flex items-center gap-2 cursor-pointer text-base"
      >
        {completed ? (
          <>
            <CheckCircle className="h-5 w-5 text-green-500" />
            <span className="font-medium text-green-700 dark:text-green-400">
              Les voltooid
            </span>
          </>
        ) : (
          <span className="text-muted-foreground">Markeer als bekeken</span>
        )}
      </Label>
    </div>
  );
}
