import { afterEach, beforeEach, describe, expect, it } from 'bun:test';
import { resetDB, createDB } from '../helpers';
import { db } from '../db';
import { codeExamplesTable, categoriesTable, coursesTable } from '../db/schema';
import { type CreateCodeExampleInput } from '../schema';
import { createCodeExample } from '../handlers/create_code_example';
import { eq } from 'drizzle-orm';

// Test data for creating prerequisite records
const testCategory = {
  name: 'Backend Development',
  slug: 'backend-dev',
  description: 'Learn backend programming languages',
  icon: 'server',
  color: '#fb4934'
};

const testCourse = {
  category_id: 1, // Will be set after creating category
  title: 'Node.js Fundamentals',
  slug: 'nodejs-fundamentals',
  description: 'Learn the basics of Node.js development',
  short_description: 'Node.js basics',
  language: 'nodejs' as const,
  difficulty_level: 'beginner' as const,
  estimated_duration: 120,
  is_featured: false,
  is_published: true,
  thumbnail_url: null
};

// Test input for standalone demo code example
const testDemoInput: CreateCodeExampleInput = {
  course_id: null,
  title: 'Hello World Demo',
  description: 'A simple hello world example',
  language: 'nodejs',
  code_content: 'console.log("Hello, World!");',
  expected_output: 'Hello, World!',
  is_demo: true,
  difficulty_level: 'beginner'
};

// Test input for course-linked code example
const testCourseInput: CreateCodeExampleInput = {
  course_id: 1, // Will be set after creating course
  title: 'Variable Declaration',
  description: 'How to declare variables in Node.js',
  language: 'nodejs',
  code_content: 'const message = "Hello";\nlet count = 0;\nvar legacy = true;',
  expected_output: null,
  is_demo: false,
  difficulty_level: 'beginner'
};

describe('createCodeExample', () => {
  beforeEach(createDB);
  afterEach(resetDB);

  it('should create a standalone demo code example', async () => {
    const result = await createCodeExample(testDemoInput);

    // Basic field validation
    expect(result.title).toEqual('Hello World Demo');
    expect(result.description).toEqual('A simple hello world example');
    expect(result.language).toEqual('nodejs');
    expect(result.code_content).toEqual('console.log("Hello, World!");');
    expect(result.expected_output).toEqual('Hello, World!');
    expect(result.is_demo).toEqual(true);
    expect(result.difficulty_level).toEqual('beginner');
    expect(result.course_id).toBeNull();
    expect(result.id).toBeDefined();
    expect(result.created_at).toBeInstanceOf(Date);
    expect(result.updated_at).toBeInstanceOf(Date);
  });

  it('should create a course-linked code example', async () => {
    // Create prerequisite category and course
    const categoryResult = await db.insert(categoriesTable)
      .values(testCategory)
      .returning()
      .execute();
    
    const courseResult = await db.insert(coursesTable)
      .values({ ...testCourse, category_id: categoryResult[0].id })
      .returning()
      .execute();

    const inputWithCourse = { ...testCourseInput, course_id: courseResult[0].id };
    const result = await createCodeExample(inputWithCourse);

    // Basic field validation
    expect(result.title).toEqual('Variable Declaration');
    expect(result.description).toEqual('How to declare variables in Node.js');
    expect(result.language).toEqual('nodejs');
    expect(result.code_content).toContain('const message');
    expect(result.expected_output).toBeNull();
    expect(result.is_demo).toEqual(false);
    expect(result.difficulty_level).toEqual('beginner');
    expect(result.course_id).toEqual(courseResult[0].id);
    expect(result.id).toBeDefined();
    expect(result.created_at).toBeInstanceOf(Date);
    expect(result.updated_at).toBeInstanceOf(Date);
  });

  it('should save code example to database', async () => {
    const result = await createCodeExample(testDemoInput);

    // Query database to verify record was saved
    const codeExamples = await db.select()
      .from(codeExamplesTable)
      .where(eq(codeExamplesTable.id, result.id))
      .execute();

    expect(codeExamples).toHaveLength(1);
    expect(codeExamples[0].title).toEqual('Hello World Demo');
    expect(codeExamples[0].language).toEqual('nodejs');
    expect(codeExamples[0].is_demo).toEqual(true);
    expect(codeExamples[0].created_at).toBeInstanceOf(Date);
    expect(codeExamples[0].updated_at).toBeInstanceOf(Date);
  });

  it('should create code examples with different languages', async () => {
    const pythonInput: CreateCodeExampleInput = {
      course_id: null,
      title: 'Python Hello World',
      description: 'Python greeting example',
      language: 'python',
      code_content: 'print("Hello from Python!")',
      expected_output: 'Hello from Python!',
      is_demo: true,
      difficulty_level: 'beginner'
    };

    const csharpInput: CreateCodeExampleInput = {
      course_id: null,
      title: 'C# Hello World',
      description: 'C# console application',
      language: 'csharp',
      code_content: 'Console.WriteLine("Hello from C#!");',
      expected_output: 'Hello from C#!',
      is_demo: true,
      difficulty_level: 'beginner'
    };

    const pythonResult = await createCodeExample(pythonInput);
    const csharpResult = await createCodeExample(csharpInput);

    expect(pythonResult.language).toEqual('python');
    expect(pythonResult.code_content).toContain('print(');
    
    expect(csharpResult.language).toEqual('csharp');
    expect(csharpResult.code_content).toContain('Console.WriteLine');
  });

  it('should create code examples with different difficulty levels', async () => {
    const advancedInput: CreateCodeExampleInput = {
      course_id: null,
      title: 'Advanced Async Pattern',
      description: 'Complex async/await example',
      language: 'nodejs',
      code_content: 'async function fetchData() {\n  try {\n    const result = await api.getData();\n    return result;\n  } catch (error) {\n    console.error(error);\n  }\n}',
      expected_output: null,
      is_demo: false,
      difficulty_level: 'advanced'
    };

    const result = await createCodeExample(advancedInput);

    expect(result.difficulty_level).toEqual('advanced');
    expect(result.title).toEqual('Advanced Async Pattern');
    expect(result.code_content).toContain('async function');
  });

  it('should throw error when course_id references non-existent course', async () => {
    const invalidInput: CreateCodeExampleInput = {
      course_id: 999, // Non-existent course ID
      title: 'Invalid Course Example',
      description: 'This should fail',
      language: 'nodejs',
      code_content: 'console.log("test");',
      expected_output: null,
      is_demo: false,
      difficulty_level: 'beginner'
    };

    await expect(createCodeExample(invalidInput)).rejects.toThrow(/Course with id 999 does not exist/i);
  });

  it('should handle null values correctly', async () => {
    const minimalInput: CreateCodeExampleInput = {
      course_id: null,
      title: 'Minimal Example',
      description: null,
      language: 'python',
      code_content: 'x = 1',
      expected_output: null,
      is_demo: false,
      difficulty_level: 'intermediate'
    };

    const result = await createCodeExample(minimalInput);

    expect(result.course_id).toBeNull();
    expect(result.description).toBeNull();
    expect(result.expected_output).toBeNull();
    expect(result.title).toEqual('Minimal Example');
    expect(result.is_demo).toEqual(false);
  });
});