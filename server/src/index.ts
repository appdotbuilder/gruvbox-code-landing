import { initTRPC } from '@trpc/server';
import { createHTTPServer } from '@trpc/server/adapters/standalone';
import 'dotenv/config';
import cors from 'cors';
import superjson from 'superjson';

// Import schemas
import {
  createCategoryInputSchema,
  createCourseInputSchema,
  createCodeExampleInputSchema,
  createAchievementInputSchema,
  updateLandingPageContentInputSchema
} from './schema';

// Import handlers
import { getLandingPageData } from './handlers/get_landing_page_data';
import { getCategories } from './handlers/get_categories';
import { getFeaturedCourses } from './handlers/get_featured_courses';
import { getDemoCodeExamples } from './handlers/get_demo_code_examples';
import { getAchievements } from './handlers/get_achievements';
import { createCategory } from './handlers/create_category';
import { createCourse } from './handlers/create_course';
import { createCodeExample } from './handlers/create_code_example';
import { createAchievement } from './handlers/create_achievement';
import { updateLandingPageContent } from './handlers/update_landing_page_content';

const t = initTRPC.create({
  transformer: superjson,
});

const publicProcedure = t.procedure;
const router = t.router;

const appRouter = router({
  // Health check endpoint
  healthcheck: publicProcedure.query(() => {
    return { status: 'ok', timestamp: new Date().toISOString() };
  }),

  // Landing page data - main endpoint for frontend
  getLandingPageData: publicProcedure
    .query(() => getLandingPageData()),

  // Individual data fetchers
  getCategories: publicProcedure
    .query(() => getCategories()),

  getFeaturedCourses: publicProcedure
    .query(() => getFeaturedCourses()),

  getDemoCodeExamples: publicProcedure
    .query(() => getDemoCodeExamples()),

  getAchievements: publicProcedure
    .query(() => getAchievements()),

  // Content creation endpoints
  createCategory: publicProcedure
    .input(createCategoryInputSchema)
    .mutation(({ input }) => createCategory(input)),

  createCourse: publicProcedure
    .input(createCourseInputSchema)
    .mutation(({ input }) => createCourse(input)),

  createCodeExample: publicProcedure
    .input(createCodeExampleInputSchema)
    .mutation(({ input }) => createCodeExample(input)),

  createAchievement: publicProcedure
    .input(createAchievementInputSchema)
    .mutation(({ input }) => createAchievement(input)),

  // Content management endpoint
  updateLandingPageContent: publicProcedure
    .input(updateLandingPageContentInputSchema)
    .mutation(({ input }) => updateLandingPageContent(input)),
});

export type AppRouter = typeof appRouter;

async function start() {
  const port = process.env['SERVER_PORT'] || 2022;
  const server = createHTTPServer({
    middleware: (req, res, next) => {
      cors()(req, res, next);
    },
    router: appRouter,
    createContext() {
      return {};
    },
  });
  server.listen(port);
  console.log(`TRPC server listening at port: ${port}`);
}

start();