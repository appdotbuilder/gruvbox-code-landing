import { db } from '../db';
import { codeExamplesTable, coursesTable } from '../db/schema';
import { type CreateCodeExampleInput, type CodeExample } from '../schema';
import { eq } from 'drizzle-orm';

export async function createCodeExample(input: CreateCodeExampleInput): Promise<CodeExample> {
  try {
    // Validate course exists if course_id is provided
    if (input.course_id !== null) {
      const course = await db.select()
        .from(coursesTable)
        .where(eq(coursesTable.id, input.course_id))
        .execute();

      if (course.length === 0) {
        throw new Error(`Course with id ${input.course_id} does not exist`);
      }
    }

    // Insert code example record
    const result = await db.insert(codeExamplesTable)
      .values({
        course_id: input.course_id,
        title: input.title,
        description: input.description,
        language: input.language,
        code_content: input.code_content,
        expected_output: input.expected_output,
        is_demo: input.is_demo,
        difficulty_level: input.difficulty_level
      })
      .returning()
      .execute();

    return result[0];
  } catch (error) {
    console.error('Code example creation failed:', error);
    throw error;
  }
}