import { db } from '../db';
import { coursesTable } from '../db/schema';
import { type Course } from '../schema';
import { and, eq, desc } from 'drizzle-orm';

export const getFeaturedCourses = async (): Promise<Course[]> => {
  try {
    const results = await db.select()
      .from(coursesTable)
      .where(
        and(
          eq(coursesTable.is_featured, true),
          eq(coursesTable.is_published, true)
        )
      )
      .orderBy(desc(coursesTable.updated_at))
      .execute();

    return results;
  } catch (error) {
    console.error('Failed to fetch featured courses:', error);
    throw error;
  }
};