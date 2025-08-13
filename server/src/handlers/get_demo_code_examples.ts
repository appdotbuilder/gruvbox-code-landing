import { db } from '../db';
import { codeExamplesTable } from '../db/schema';
import { eq, desc } from 'drizzle-orm';
import { type CodeExample } from '../schema';

export const getDemoCodeExamples = async (): Promise<CodeExample[]> => {
  try {
    // Fetch code examples marked for demo display
    // Order by created_at descending to show newest demo examples first
    const results = await db.select()
      .from(codeExamplesTable)
      .where(eq(codeExamplesTable.is_demo, true))
      .orderBy(desc(codeExamplesTable.created_at))
      .execute();

    // Convert the database results to match the schema types
    return results.map(result => ({
      ...result,
      created_at: new Date(result.created_at),
      updated_at: new Date(result.updated_at)
    }));
  } catch (error) {
    console.error('Failed to fetch demo code examples:', error);
    throw error;
  }
};