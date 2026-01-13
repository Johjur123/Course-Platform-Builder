import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { getUncachableStripeClient } from "./stripeClient";
import { isAuthenticated } from "./replit_integrations/auth";
import { z } from "zod";

const progressSchema = z.object({
  completed: z.boolean(),
});

const COURSE_PRICE_CENTS = 9900;
const COURSE_CURRENCY = "eur";

export async function registerRoutes(
  httpServer: Server,
  app: Express
): Promise<Server> {
  
  app.get("/api/dashboard", isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const course = await storage.getCourse();
      
      if (!course) {
        return res.status(404).json({ message: "Course not found" });
      }

      const progress = await storage.getUserProgress(userId);
      const access = await storage.getUserAccess(userId);

      res.json({
        course,
        progress,
        hasAccess: access?.hasAccess ?? false,
      });
    } catch (error) {
      console.error("Dashboard error:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  });

  app.get("/api/lessons/:id", isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const lessonId = parseInt(req.params.id);

      if (isNaN(lessonId)) {
        return res.status(400).json({ message: "Invalid lesson ID" });
      }

      const access = await storage.getUserAccess(userId);
      if (!access?.hasAccess) {
        return res.json({ hasAccess: false });
      }

      const lessonData = await storage.getLessonWithNavigation(lessonId);
      if (!lessonData) {
        return res.status(404).json({ message: "Lesson not found" });
      }

      const progress = await storage.getUserProgress(userId);

      res.json({
        ...lessonData,
        progress,
        hasAccess: true,
      });
    } catch (error) {
      console.error("Lesson error:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  });

  app.post("/api/progress/:lessonId", isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const lessonId = parseInt(req.params.lessonId);

      if (isNaN(lessonId)) {
        return res.status(400).json({ message: "Invalid lesson ID" });
      }

      const validation = progressSchema.safeParse(req.body);
      if (!validation.success) {
        return res.status(400).json({ message: "Invalid request body", errors: validation.error.errors });
      }

      const { completed } = validation.data;

      const access = await storage.getUserAccess(userId);
      if (!access?.hasAccess) {
        return res.status(403).json({ message: "No access" });
      }

      const progress = await storage.setLessonProgress(userId, lessonId, completed);
      res.json(progress);
    } catch (error) {
      console.error("Progress error:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  });

  app.get("/api/course-info", isAuthenticated, async (req: any, res) => {
    try {
      const courseInfo = await storage.getCourseInfo();
      
      if (!courseInfo) {
        return res.status(404).json({ message: "Course not found" });
      }

      res.json({
        ...courseInfo,
        price: COURSE_PRICE_CENTS,
        currency: COURSE_CURRENCY,
      });
    } catch (error) {
      console.error("Course info error:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  });

  app.post("/api/checkout", isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const userEmail = req.user.claims.email;

      const access = await storage.getUserAccess(userId);
      if (access?.hasAccess) {
        return res.status(400).json({ message: "Already has access" });
      }

      const courseInfo = await storage.getCourseInfo();
      if (!courseInfo) {
        return res.status(404).json({ message: "Course not found" });
      }

      const stripe = await getUncachableStripeClient();
      
      const session = await stripe.checkout.sessions.create({
        payment_method_types: ['card', 'ideal'],
        mode: 'payment',
        customer_email: userEmail,
        line_items: [
          {
            price_data: {
              currency: COURSE_CURRENCY,
              product_data: {
                name: courseInfo.title,
                description: courseInfo.description || undefined,
              },
              unit_amount: COURSE_PRICE_CENTS,
            },
            quantity: 1,
          },
        ],
        metadata: {
          userId,
        },
        success_url: `${req.protocol}://${req.get('host')}/checkout/success`,
        cancel_url: `${req.protocol}://${req.get('host')}/checkout/cancel`,
      });

      res.json({ url: session.url });
    } catch (error) {
      console.error("Checkout error:", error);
      res.status(500).json({ message: "Failed to create checkout session" });
    }
  });

  app.get("/api/user-access", isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const access = await storage.getUserAccess(userId);
      res.json({ hasAccess: access?.hasAccess ?? false });
    } catch (error) {
      console.error("User access error:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  });

  return httpServer;
}
