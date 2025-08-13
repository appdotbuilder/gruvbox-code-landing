import { db } from '../db';
import { coursesTable, categoriesTable } from '../db/schema';
import { type CreateCourseInput, type Course } from '../schema';
import { eq } from 'drizzle-orm';

export const createCourse = async (input: CreateCourseInput): Promise<Course> => {
  try {
    // First, verify that the category exists to prevent foreign key constraint violations
    const existingCategory = await db.select()
      .from(categoriesTable)
      .where(eq(categoriesTable.id, input.category_id))
      .execute();

    if (existingCategory.length === 0) {
      throw new Error(`Category with id ${input.category_id} does not exist`);
    }

    // Insert course record
    const result = await db.insert(coursesTable)
      .values({
        category_id: input.category_id,
        title: input.title,
        slug: input.slug,
        description: input.description,
        short_description: input.short_description,
        language: input.language,
        difficulty_level: input.difficulty_level,
        estimated_duration: input.estimated_duration,
        is_featured: input.is_featured,
        is_published: input.is_published,
        thumbnail_url: input.thumbnail_url
      })
      .returning()
      .execute();

    return result[0];
  } catch (error) {
    console.error('Course creation failed:', error);
    throw error;
  }
};