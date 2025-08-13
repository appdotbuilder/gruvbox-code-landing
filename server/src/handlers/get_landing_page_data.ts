import { db } from '../db';
import { 
  categoriesTable, 
  coursesTable, 
  codeExamplesTable, 
  achievementsTable, 
  landingPageContentTable 
} from '../db/schema';
import { type LandingPageData } from '../schema';
import { eq, and } from 'drizzle-orm';

export async function getLandingPageData(): Promise<LandingPageData> {
  try {
    // Fetch hero section content
    const heroResults = await db.select()
      .from(landingPageContentTable)
      .where(and(
        eq(landingPageContentTable.section, 'hero'),
        eq(landingPageContentTable.is_active, true)
      ))
      .execute();

    // Fetch demo section content
    const demoResults = await db.select()
      .from(landingPageContentTable)
      .where(and(
        eq(landingPageContentTable.section, 'demo'),
        eq(landingPageContentTable.is_active, true)
      ))
      .execute();

    // Fetch CTA section content
    const ctaResults = await db.select()
      .from(landingPageContentTable)
      .where(and(
        eq(landingPageContentTable.section, 'cta'),
        eq(landingPageContentTable.is_active, true)
      ))
      .execute();

    // Fetch featured courses
    const featuredCoursesResults = await db.select()
      .from(coursesTable)
      .where(and(
        eq(coursesTable.is_featured, true),
        eq(coursesTable.is_published, true)
      ))
      .execute();

    // Fetch all active categories
    const categoriesResults = await db.select()
      .from(categoriesTable)
      .execute();

    // Fetch demo code examples
    const demoCodeExamplesResults = await db.select()
      .from(codeExamplesTable)
      .where(eq(codeExamplesTable.is_demo, true))
      .execute();

    // Fetch sample achievements (active ones)
    const achievementsResults = await db.select()
      .from(achievementsTable)
      .where(eq(achievementsTable.is_active, true))
      .execute();

    return {
      hero: heroResults.length > 0 ? heroResults[0] : null,
      demo: demoResults.length > 0 ? demoResults[0] : null,
      featuredCourses: featuredCoursesResults,
      categories: categoriesResults,
      demoCodeExamples: demoCodeExamplesResults,
      achievements: achievementsResults,
      cta: ctaResults.length > 0 ? ctaResults[0] : null
    };
  } catch (error) {
    console.error('Landing page data fetch failed:', error);
    throw error;
  }
}