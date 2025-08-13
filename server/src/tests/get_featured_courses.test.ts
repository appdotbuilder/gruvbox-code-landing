import { afterEach, beforeEach, describe, expect, it } from 'bun:test';
import { resetDB, createDB } from '../helpers';
import { db } from '../db';
import { categoriesTable, coursesTable } from '../db/schema';
import { getFeaturedCourses } from '../handlers/get_featured_courses';

describe('getFeaturedCourses', () => {
  beforeEach(createDB);
  afterEach(resetDB);

  it('should return featured and published courses', async () => {
    // Create a test category first
    const categoryResult = await db.insert(categoriesTable)
      .values({
        name: 'Backend Development',
        slug: 'backend-dev',
        description: 'Backend programming courses'
      })
      .returning()
      .execute();

    const categoryId = categoryResult[0].id;

    // Create test courses
    await db.insert(coursesTable)
      .values([
        {
          category_id: categoryId,
          title: 'Featured Course 1',
          slug: 'featured-course-1',
          description: 'A featured course',
          language: 'nodejs',
          difficulty_level: 'beginner',
          estimated_duration: 120,
          is_featured: true,
          is_published: true
        },
        {
          category_id: categoryId,
          title: 'Featured Course 2',
          slug: 'featured-course-2',
          description: 'Another featured course',
          language: 'python',
          difficulty_level: 'intermediate',
          estimated_duration: 180,
          is_featured: true,
          is_published: true
        },
        {
          category_id: categoryId,
          title: 'Not Featured Course',
          slug: 'not-featured',
          description: 'A regular course',
          language: 'csharp',
          difficulty_level: 'advanced',
          estimated_duration: 240,
          is_featured: false,
          is_published: true
        },
        {
          category_id: categoryId,
          title: 'Unpublished Featured Course',
          slug: 'unpublished-featured',
          description: 'A featured but unpublished course',
          language: 'nodejs',
          difficulty_level: 'beginner',
          estimated_duration: 90,
          is_featured: true,
          is_published: false
        }
      ])
      .execute();

    const results = await getFeaturedCourses();

    // Should return only featured AND published courses
    expect(results).toHaveLength(2);
    
    // Verify all results are featured and published
    results.forEach(course => {
      expect(course.is_featured).toBe(true);
      expect(course.is_published).toBe(true);
    });

    // Check specific courses are included
    const courseTitles = results.map(course => course.title);
    expect(courseTitles).toContain('Featured Course 1');
    expect(courseTitles).toContain('Featured Course 2');
    expect(courseTitles).not.toContain('Not Featured Course');
    expect(courseTitles).not.toContain('Unpublished Featured Course');
  });

  it('should return courses ordered by updated_at descending', async () => {
    // Create a test category
    const categoryResult = await db.insert(categoriesTable)
      .values({
        name: 'Backend Development',
        slug: 'backend-dev',
        description: 'Backend programming courses'
      })
      .returning()
      .execute();

    const categoryId = categoryResult[0].id;

    // Create courses with different timestamps
    const now = new Date();
    const earlier = new Date(now.getTime() - 60000); // 1 minute earlier

    await db.insert(coursesTable)
      .values([
        {
          category_id: categoryId,
          title: 'Older Course',
          slug: 'older-course',
          description: 'An older featured course',
          language: 'nodejs',
          difficulty_level: 'beginner',
          estimated_duration: 120,
          is_featured: true,
          is_published: true,
          updated_at: earlier
        },
        {
          category_id: categoryId,
          title: 'Newer Course',
          slug: 'newer-course',
          description: 'A newer featured course',
          language: 'python',
          difficulty_level: 'intermediate',
          estimated_duration: 180,
          is_featured: true,
          is_published: true,
          updated_at: now
        }
      ])
      .execute();

    const results = await getFeaturedCourses();

    expect(results).toHaveLength(2);
    
    // Should be ordered by updated_at descending (newest first)
    expect(results[0].title).toBe('Newer Course');
    expect(results[1].title).toBe('Older Course');
    expect(results[0].updated_at >= results[1].updated_at).toBe(true);
  });

  it('should return empty array when no featured courses exist', async () => {
    // Create a test category
    const categoryResult = await db.insert(categoriesTable)
      .values({
        name: 'Backend Development',
        slug: 'backend-dev',
        description: 'Backend programming courses'
      })
      .returning()
      .execute();

    const categoryId = categoryResult[0].id;

    // Create only non-featured courses
    await db.insert(coursesTable)
      .values({
        category_id: categoryId,
        title: 'Regular Course',
        slug: 'regular-course',
        description: 'A regular course',
        language: 'nodejs',
        difficulty_level: 'beginner',
        estimated_duration: 120,
        is_featured: false,
        is_published: true
      })
      .execute();

    const results = await getFeaturedCourses();

    expect(results).toHaveLength(0);
  });

  it('should return courses with all expected fields', async () => {
    // Create a test category
    const categoryResult = await db.insert(categoriesTable)
      .values({
        name: 'Backend Development',
        slug: 'backend-dev',
        description: 'Backend programming courses'
      })
      .returning()
      .execute();

    const categoryId = categoryResult[0].id;

    // Create a featured course with all fields
    await db.insert(coursesTable)
      .values({
        category_id: categoryId,
        title: 'Complete Featured Course',
        slug: 'complete-featured-course',
        description: 'A complete featured course with all fields',
        short_description: 'Short description',
        language: 'nodejs',
        difficulty_level: 'intermediate',
        estimated_duration: 240,
        is_featured: true,
        is_published: true,
        thumbnail_url: 'https://example.com/thumbnail.jpg'
      })
      .execute();

    const results = await getFeaturedCourses();

    expect(results).toHaveLength(1);
    
    const course = results[0];
    expect(course.id).toBeDefined();
    expect(course.category_id).toBe(categoryId);
    expect(course.title).toBe('Complete Featured Course');
    expect(course.slug).toBe('complete-featured-course');
    expect(course.description).toBe('A complete featured course with all fields');
    expect(course.short_description).toBe('Short description');
    expect(course.language).toBe('nodejs');
    expect(course.difficulty_level).toBe('intermediate');
    expect(course.estimated_duration).toBe(240);
    expect(course.is_featured).toBe(true);
    expect(course.is_published).toBe(true);
    expect(course.thumbnail_url).toBe('https://example.com/thumbnail.jpg');
    expect(course.created_at).toBeInstanceOf(Date);
    expect(course.updated_at).toBeInstanceOf(Date);
  });
});