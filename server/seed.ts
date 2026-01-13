import { db } from "./db";
import { courses, modules, lessons } from "@shared/schema";
import { sql } from "drizzle-orm";

async function seed() {
  console.log("Seeding database...");

  const existingCourses = await db.select().from(courses);
  if (existingCourses.length > 0) {
    console.log("Database already seeded, skipping...");
    return;
  }

  const [course] = await db.insert(courses).values({
    title: "Juridische Basiskennis voor Ondernemers",
    description: "Leer de essentiële juridische kennis die elke ondernemer nodig heeft. Van contracten tot aansprakelijkheid.",
  }).returning();

  console.log(`Created course: ${course.title}`);

  const moduleData = [
    { courseId: course.id, title: "Module 1: Inleiding Ondernemingsrecht", order: 1 },
    { courseId: course.id, title: "Module 2: Contracten en Overeenkomsten", order: 2 },
    { courseId: course.id, title: "Module 3: Aansprakelijkheid", order: 3 },
    { courseId: course.id, title: "Module 4: Privacy en AVG", order: 4 },
  ];

  const createdModules = await db.insert(modules).values(moduleData).returning();
  console.log(`Created ${createdModules.length} modules`);

  const lessonData = [
    { moduleId: createdModules[0].id, title: "Welkom bij de cursus", description: "Introductie en overzicht van wat je gaat leren.", vimeoId: "76979871", order: 1, durationMinutes: 5 },
    { moduleId: createdModules[0].id, title: "Rechtsvormen voor ondernemers", description: "ZZP, BV, VOF - welke rechtsvorm past bij jou?", vimeoId: "76979871", order: 2, durationMinutes: 12 },
    { moduleId: createdModules[0].id, title: "Belangrijke juridische termen", description: "De basis terminologie die je moet kennen.", vimeoId: "76979871", order: 3, durationMinutes: 8 },
    
    { moduleId: createdModules[1].id, title: "Wat is een contract?", description: "De basis van contractrecht.", vimeoId: "76979871", order: 1, durationMinutes: 10 },
    { moduleId: createdModules[1].id, title: "Algemene voorwaarden", description: "Hoe stel je effectieve algemene voorwaarden op?", vimeoId: "76979871", order: 2, durationMinutes: 15 },
    { moduleId: createdModules[1].id, title: "Wanprestatie en ontbinding", description: "Wat te doen als een contract niet wordt nagekomen?", vimeoId: "76979871", order: 3, durationMinutes: 12 },
    
    { moduleId: createdModules[2].id, title: "Soorten aansprakelijkheid", description: "Contractuele vs. buitencontractuele aansprakelijkheid.", vimeoId: "76979871", order: 1, durationMinutes: 14 },
    { moduleId: createdModules[2].id, title: "Verzekeringen voor ondernemers", description: "Welke verzekeringen heb je nodig?", vimeoId: "76979871", order: 2, durationMinutes: 11 },
    { moduleId: createdModules[2].id, title: "Beperken van aansprakelijkheid", description: "Juridische strategieën om je risico te beperken.", vimeoId: "76979871", order: 3, durationMinutes: 13 },
    
    { moduleId: createdModules[3].id, title: "AVG Basisprincipes", description: "De belangrijkste regels van de AVG.", vimeoId: "76979871", order: 1, durationMinutes: 16 },
    { moduleId: createdModules[3].id, title: "Privacyverklaring opstellen", description: "Stap voor stap een goede privacyverklaring maken.", vimeoId: "76979871", order: 2, durationMinutes: 10 },
    { moduleId: createdModules[3].id, title: "Datalekken en meldplicht", description: "Wat te doen bij een datalek?", vimeoId: "76979871", order: 3, durationMinutes: 9 },
  ];

  const createdLessons = await db.insert(lessons).values(lessonData).returning();
  console.log(`Created ${createdLessons.length} lessons`);

  console.log("Seeding complete!");
}

seed()
  .then(() => process.exit(0))
  .catch((err) => {
    console.error("Seeding failed:", err);
    process.exit(1);
  });
