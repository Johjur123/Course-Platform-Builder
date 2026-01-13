import {
  courses, modules, lessons, userProgress, userAccess,
  type Course, type Module, type Lesson, type UserProgress, type UserAccess,
  type InsertUserProgress, type InsertUserAccess,
  type ModuleWithLessons, type CourseWithModules
} from "@shared/schema";
import { db } from "./db";
import { eq, and, asc, sql } from "drizzle-orm";

export interface IStorage {
  getCourse(): Promise<CourseWithModules | undefined>;
  getCourseInfo(): Promise<{ title: string; description: string | null; moduleCount: number; lessonCount: number } | undefined>;
  getLesson(lessonId: number): Promise<Lesson | undefined>;
  getLessonWithNavigation(lessonId: number): Promise<{ lesson: Lesson; previousLesson: Lesson | null; nextLesson: Lesson | null; modules: ModuleWithLessons[] } | undefined>;
  getUserProgress(userId: string): Promise<UserProgress[]>;
  setLessonProgress(userId: string, lessonId: number, completed: boolean): Promise<UserProgress>;
  getUserAccess(userId: string): Promise<UserAccess | undefined>;
  grantUserAccess(userId: string, stripeCustomerId?: string, stripePaymentId?: string): Promise<UserAccess>;
  createOrUpdateUserAccess(data: InsertUserAccess): Promise<UserAccess>;
}

export class DatabaseStorage implements IStorage {
  async getCourse(): Promise<CourseWithModules | undefined> {
    const courseRows = await db.select().from(courses).limit(1);
    if (courseRows.length === 0) return undefined;

    const course = courseRows[0];

    const rows = await db
      .select({
        module: modules,
        lesson: lessons,
      })
      .from(modules)
      .leftJoin(lessons, eq(lessons.moduleId, modules.id))
      .where(eq(modules.courseId, course.id))
      .orderBy(asc(modules.order), asc(lessons.order));

    const modulesMap = new Map<number, ModuleWithLessons>();

    for (const row of rows) {
      if (!modulesMap.has(row.module.id)) {
        modulesMap.set(row.module.id, {
          ...row.module,
          lessons: [],
        });
      }

      if (row.lesson) {
        const mod = modulesMap.get(row.module.id)!;
        if (!mod.lessons.some(l => l.id === row.lesson!.id)) {
          mod.lessons.push(row.lesson);
        }
      }
    }

    const sortedModules = Array.from(modulesMap.values()).sort((a, b) => a.order - b.order);
    for (const mod of sortedModules) {
      mod.lessons.sort((a, b) => a.order - b.order);
    }

    return {
      ...course,
      modules: sortedModules,
    };
  }

  async getCourseInfo(): Promise<{ title: string; description: string | null; moduleCount: number; lessonCount: number } | undefined> {
    const courseRows = await db.select().from(courses).limit(1);
    if (courseRows.length === 0) return undefined;

    const course = courseRows[0];
    
    const moduleCount = await db
      .select({ count: sql<number>`count(*)::int` })
      .from(modules)
      .where(eq(modules.courseId, course.id));

    const lessonCount = await db
      .select({ count: sql<number>`count(*)::int` })
      .from(lessons)
      .innerJoin(modules, eq(lessons.moduleId, modules.id))
      .where(eq(modules.courseId, course.id));

    return {
      title: course.title,
      description: course.description,
      moduleCount: moduleCount[0]?.count || 0,
      lessonCount: lessonCount[0]?.count || 0,
    };
  }

  async getLesson(lessonId: number): Promise<Lesson | undefined> {
    const [lesson] = await db
      .select()
      .from(lessons)
      .where(eq(lessons.id, lessonId));
    return lesson;
  }

  async getLessonWithNavigation(lessonId: number): Promise<{ lesson: Lesson; previousLesson: Lesson | null; nextLesson: Lesson | null; modules: ModuleWithLessons[] } | undefined> {
    const lesson = await this.getLesson(lessonId);
    if (!lesson) return undefined;

    const course = await this.getCourse();
    if (!course) return undefined;

    const allLessons: Lesson[] = [];
    for (const mod of course.modules) {
      allLessons.push(...mod.lessons);
    }

    const currentIndex = allLessons.findIndex(l => l.id === lessonId);
    const previousLesson = currentIndex > 0 ? allLessons[currentIndex - 1] : null;
    const nextLesson = currentIndex < allLessons.length - 1 ? allLessons[currentIndex + 1] : null;

    return {
      lesson,
      previousLesson,
      nextLesson,
      modules: course.modules,
    };
  }

  async getUserProgress(userId: string): Promise<UserProgress[]> {
    return await db
      .select()
      .from(userProgress)
      .where(eq(userProgress.userId, userId));
  }

  async setLessonProgress(userId: string, lessonId: number, completed: boolean): Promise<UserProgress> {
    const [result] = await db
      .insert(userProgress)
      .values({
        userId,
        lessonId,
        completed,
        completedAt: completed ? new Date() : null,
      })
      .onConflictDoUpdate({
        target: [userProgress.userId, userProgress.lessonId],
        set: {
          completed,
          completedAt: completed ? new Date() : null,
        },
      })
      .returning();
    return result;
  }

  async getUserAccess(userId: string): Promise<UserAccess | undefined> {
    const [access] = await db
      .select()
      .from(userAccess)
      .where(eq(userAccess.userId, userId));
    return access;
  }

  async grantUserAccess(userId: string, stripeCustomerId?: string, stripePaymentId?: string): Promise<UserAccess> {
    const existing = await this.getUserAccess(userId);
    
    if (existing) {
      const [updated] = await db
        .update(userAccess)
        .set({
          hasAccess: true,
          stripeCustomerId,
          stripePaymentId,
          grantedAt: new Date(),
        })
        .where(eq(userAccess.id, existing.id))
        .returning();
      return updated;
    }

    const [created] = await db
      .insert(userAccess)
      .values({
        userId,
        hasAccess: true,
        stripeCustomerId,
        stripePaymentId,
        grantedAt: new Date(),
      })
      .returning();
    return created;
  }

  async createOrUpdateUserAccess(data: InsertUserAccess): Promise<UserAccess> {
    const existing = await this.getUserAccess(data.userId);
    
    if (existing) {
      const [updated] = await db
        .update(userAccess)
        .set(data)
        .where(eq(userAccess.id, existing.id))
        .returning();
      return updated;
    }

    const [created] = await db
      .insert(userAccess)
      .values(data)
      .returning();
    return created;
  }
}

export const storage = new DatabaseStorage();
