import { afterEach, beforeEach, describe, expect, it } from 'bun:test';
import { resetDB, createDB } from '../helpers';
import { db } from '../db';
import { coursesTable, categoriesTable } from '../db/schema';
import { type CreateCourseInput } from '../schema';
import { createCourse } from '../handlers/create_course';
import { eq } from 'drizzle-orm';

describe('createCourse', () => {
  beforeEach(createDB);
  afterEach(resetDB);

  // Helper to create a test category
  const createTestCategory = async () => {
    const categoryResult = await db.insert(categoriesTable)
      .values({
        name: 'Test Category',
        slug: 'test-category',
        description: 'A category for testing',
        icon: 'test-icon',
        color: '#8ec07c'
      })
      .returning()
      .execute();
    return categoryResult[0];
  };

  const testCourseInput: CreateCourseInput = {
    category_id: 1, // Will be updated with actual category ID
    title: 'Learn Node.js Fundamentals',
    slug: 'learn-nodejs-fundamentals',
    description: 'A comprehensive course covering Node.js basics including modules, npm, and asynchronous programming.',
    short_description: 'Master Node.js fundamentals',
    language: 'nodejs',
    difficulty_level: 'beginner',
    estimated_duration: 180,
    is_featured: true,
    is_published: true,
    thumbnail_url: 'https://example.com/nodejs-thumb.jpg'
  };

  it('should create a course with all fields', async () => {
    const category = await createTestCategory();
    const input = { ...testCourseInput, category_id: category.id };

    const result = await createCourse(input);

    // Verify all fields are set correctly
    expect(result.id).toBeDefined();
    expect(result.category_id).toEqual(category.id);
    expect(result.title).toEqual('Learn Node.js Fundamentals');
    expect(result.slug).toEqual('learn-nodejs-fundamentals');
    expect(result.description).toEqual(testCourseInput.description);
    expect(result.short_description).toEqual('Master Node.js fundamentals');
    expect(result.language).toEqual('nodejs');
    expect(result.difficulty_level).toEqual('beginner');
    expect(result.estimated_duration).toEqual(180);
    expect(result.is_featured).toEqual(true);
    expect(result.is_published).toEqual(true);
    expect(result.thumbnail_url).toEqual('https://example.com/nodejs-thumb.jpg');
    expect(result.created_at).toBeInstanceOf(Date);
    expect(result.updated_at).toBeInstanceOf(Date);
  });

  it('should save course to database', async () => {
    const category = await createTestCategory();
    const input = { ...testCourseInput, category_id: category.id };

    const result = await createCourse(input);

    // Verify course was saved to database
    const courses = await db.select()
      .from(coursesTable)
      .where(eq(coursesTable.id, result.id))
      .execute();

    expect(courses).toHaveLength(1);
    const savedCourse = courses[0];
    expect(savedCourse.title).toEqual('Learn Node.js Fundamentals');
    expect(savedCourse.category_id).toEqual(category.id);
    expect(savedCourse.language).toEqual('nodejs');
    expect(savedCourse.difficulty_level).toEqual('beginner');
    expect(savedCourse.is_featured).toEqual(true);
    expect(savedCourse.created_at).toBeInstanceOf(Date);
  });

  it('should create course with nullable fields set to null', async () => {
    const category = await createTestCategory();
    const input: CreateCourseInput = {
      category_id: category.id,
      title: 'Basic Python Course',
      slug: 'basic-python-course',
      description: 'Learn Python basics',
      short_description: null,
      language: 'python',
      difficulty_level: 'intermediate',
      estimated_duration: 120,
      is_featured: false,
      is_published: false,
      thumbnail_url: null
    };

    const result = await createCourse(input);

    expect(result.short_description).toBeNull();
    expect(result.thumbnail_url).toBeNull();
    expect(result.is_featured).toEqual(false);
    expect(result.is_published).toEqual(false);
    expect(result.language).toEqual('python');
    expect(result.difficulty_level).toEqual('intermediate');
  });

  it('should create course with default values applied', async () => {
    const category = await createTestCategory();
    
    // Test input without defaults - Zod should have already applied them
    const inputWithDefaults: CreateCourseInput = {
      category_id: category.id,
      title: 'C# Advanced Course',
      slug: 'csharp-advanced-course',
      description: 'Advanced C# programming concepts',
      short_description: 'Master advanced C#',
      language: 'csharp',
      difficulty_level: 'advanced',
      estimated_duration: 240,
      is_featured: false, // Zod default applied
      is_published: false, // Zod default applied
      thumbnail_url: null
    };

    const result = await createCourse(inputWithDefaults);

    expect(result.is_featured).toEqual(false);
    expect(result.is_published).toEqual(false);
    expect(result.language).toEqual('csharp');
    expect(result.difficulty_level).toEqual('advanced');
  });

  it('should handle different programming languages', async () => {
    const category = await createTestCategory();

    const languages: Array<'nodejs' | 'python' | 'csharp'> = ['nodejs', 'python', 'csharp'];
    
    for (const language of languages) {
      const input: CreateCourseInput = {
        category_id: category.id,
        title: `${language} Course`,
        slug: `${language}-course`,
        description: `Learn ${language} programming`,
        short_description: null,
        language: language,
        difficulty_level: 'beginner',
        estimated_duration: 100,
        is_featured: false,
        is_published: true,
        thumbnail_url: null
      };

      const result = await createCourse(input);
      expect(result.language).toEqual(language);
      expect(result.title).toEqual(`${language} Course`);
    }
  });

  it('should handle different difficulty levels', async () => {
    const category = await createTestCategory();

    const difficulties: Array<'beginner' | 'intermediate' | 'advanced'> = ['beginner', 'intermediate', 'advanced'];
    
    for (const difficulty of difficulties) {
      const input: CreateCourseInput = {
        category_id: category.id,
        title: `${difficulty} Course`,
        slug: `${difficulty}-course`,
        description: `A ${difficulty} level course`,
        short_description: null,
        language: 'nodejs',
        difficulty_level: difficulty,
        estimated_duration: 150,
        is_featured: false,
        is_published: true,
        thumbnail_url: null
      };

      const result = await createCourse(input);
      expect(result.difficulty_level).toEqual(difficulty);
      expect(result.title).toEqual(`${difficulty} Course`);
    }
  });

  it('should throw error when category does not exist', async () => {
    const input: CreateCourseInput = {
      category_id: 999, // Non-existent category ID
      title: 'Test Course',
      slug: 'test-course',
      description: 'Test description',
      short_description: null,
      language: 'nodejs',
      difficulty_level: 'beginner',
      estimated_duration: 100,
      is_featured: false,
      is_published: false,
      thumbnail_url: null
    };

    await expect(createCourse(input)).rejects.toThrow(/Category with id 999 does not exist/i);
  });

  it('should create multiple courses for same category', async () => {
    const category = await createTestCategory();

    const course1Input: CreateCourseInput = {
      category_id: category.id,
      title: 'Course 1',
      slug: 'course-1',
      description: 'First course',
      short_description: null,
      language: 'nodejs',
      difficulty_level: 'beginner',
      estimated_duration: 100,
      is_featured: false,
      is_published: true,
      thumbnail_url: null
    };

    const course2Input: CreateCourseInput = {
      category_id: category.id,
      title: 'Course 2',
      slug: 'course-2',
      description: 'Second course',
      short_description: null,
      language: 'python',
      difficulty_level: 'intermediate',
      estimated_duration: 200,
      is_featured: true,
      is_published: false,
      thumbnail_url: null
    };

    const result1 = await createCourse(course1Input);
    const result2 = await createCourse(course2Input);

    expect(result1.category_id).toEqual(category.id);
    expect(result2.category_id).toEqual(category.id);
    expect(result1.title).toEqual('Course 1');
    expect(result2.title).toEqual('Course 2');
    expect(result1.language).toEqual('nodejs');
    expect(result2.language).toEqual('python');

    // Verify both courses are in database
    const allCourses = await db.select()
      .from(coursesTable)
      .where(eq(coursesTable.category_id, category.id))
      .execute();

    expect(allCourses).toHaveLength(2);
  });
});