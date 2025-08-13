import { afterEach, beforeEach, describe, expect, it } from 'bun:test';
import { resetDB, createDB } from '../helpers';
import { db } from '../db';
import { 
  categoriesTable, 
  coursesTable, 
  codeExamplesTable, 
  achievementsTable, 
  landingPageContentTable 
} from '../db/schema';
import { type CreateCategoryInput, type CreateCourseInput, type CreateCodeExampleInput, type CreateAchievementInput } from '../schema';
import { getLandingPageData } from '../handlers/get_landing_page_data';

describe('getLandingPageData', () => {
  beforeEach(createDB);
  afterEach(resetDB);

  it('should return empty data when no content exists', async () => {
    const result = await getLandingPageData();

    expect(result.hero).toBeNull();
    expect(result.demo).toBeNull();
    expect(result.cta).toBeNull();
    expect(result.featuredCourses).toEqual([]);
    expect(result.categories).toEqual([]);
    expect(result.demoCodeExamples).toEqual([]);
    expect(result.achievements).toEqual([]);
  });

  it('should fetch hero, demo, and cta content', async () => {
    // Create landing page content
    await db.insert(landingPageContentTable).values([
      {
        section: 'hero',
        title: 'Learn Backend Development',
        subtitle: 'Master Node.js, Python, and C#',
        content: 'Join thousands of developers',
        cta_text: 'Start Learning',
        cta_link: '/courses',
        display_order: 1,
        is_active: true
      },
      {
        section: 'demo',
        title: 'Try It Yourself',
        subtitle: 'Interactive Code Examples',
        content: 'See the code in action',
        display_order: 1,
        is_active: true
      },
      {
        section: 'cta',
        title: 'Ready to Start?',
        subtitle: 'Join our community',
        cta_text: 'Sign Up Now',
        cta_link: '/signup',
        display_order: 1,
        is_active: true
      },
      {
        section: 'hero',
        title: 'Inactive Hero',
        display_order: 2,
        is_active: false // Should not be returned
      }
    ]).execute();

    const result = await getLandingPageData();

    // Check hero content
    expect(result.hero).toBeDefined();
    expect(result.hero?.section).toBe('hero');
    expect(result.hero?.title).toBe('Learn Backend Development');
    expect(result.hero?.subtitle).toBe('Master Node.js, Python, and C#');
    expect(result.hero?.is_active).toBe(true);

    // Check demo content
    expect(result.demo).toBeDefined();
    expect(result.demo?.section).toBe('demo');
    expect(result.demo?.title).toBe('Try It Yourself');

    // Check CTA content
    expect(result.cta).toBeDefined();
    expect(result.cta?.section).toBe('cta');
    expect(result.cta?.title).toBe('Ready to Start?');
    expect(result.cta?.cta_text).toBe('Sign Up Now');
  });

  it('should fetch categories and featured courses', async () => {
    // Create categories
    const categoryResults = await db.insert(categoriesTable).values([
      {
        name: 'Web Development',
        slug: 'web-development',
        description: 'Learn web technologies',
        icon: 'web-icon',
        color: '#458588'
      },
      {
        name: 'API Development',
        slug: 'api-development',
        description: 'Build robust APIs'
      }
    ]).returning().execute();

    // Create courses (some featured, some not)
    await db.insert(coursesTable).values([
      {
        category_id: categoryResults[0].id,
        title: 'Node.js Fundamentals',
        slug: 'nodejs-fundamentals',
        description: 'Learn Node.js from scratch',
        language: 'nodejs',
        difficulty_level: 'beginner',
        estimated_duration: 480,
        is_featured: true,
        is_published: true
      },
      {
        category_id: categoryResults[1].id,
        title: 'Python API Development',
        slug: 'python-api',
        description: 'Build APIs with Python',
        language: 'python',
        difficulty_level: 'intermediate',
        estimated_duration: 600,
        is_featured: true,
        is_published: true
      },
      {
        category_id: categoryResults[0].id,
        title: 'Advanced C#',
        slug: 'advanced-csharp',
        description: 'Advanced C# concepts',
        language: 'csharp',
        difficulty_level: 'advanced',
        estimated_duration: 720,
        is_featured: false, // Not featured
        is_published: true
      },
      {
        category_id: categoryResults[0].id,
        title: 'Unpublished Course',
        slug: 'unpublished',
        description: 'Not published',
        language: 'nodejs',
        difficulty_level: 'beginner',
        estimated_duration: 300,
        is_featured: true,
        is_published: false // Not published
      }
    ]).execute();

    const result = await getLandingPageData();

    // Check categories
    expect(result.categories).toHaveLength(2);
    expect(result.categories[0].name).toBe('Web Development');
    expect(result.categories[0].slug).toBe('web-development');
    expect(result.categories[1].name).toBe('API Development');

    // Check featured courses (only published and featured ones)
    expect(result.featuredCourses).toHaveLength(2);
    expect(result.featuredCourses[0].title).toBe('Node.js Fundamentals');
    expect(result.featuredCourses[0].is_featured).toBe(true);
    expect(result.featuredCourses[0].is_published).toBe(true);
    expect(result.featuredCourses[1].title).toBe('Python API Development');
    expect(result.featuredCourses[1].is_featured).toBe(true);
    expect(result.featuredCourses[1].is_published).toBe(true);
  });

  it('should fetch demo code examples and achievements', async () => {
    // Create code examples (some demo, some not)
    await db.insert(codeExamplesTable).values([
      {
        title: 'Hello World Node.js',
        description: 'Simple Node.js example',
        language: 'nodejs',
        code_content: 'console.log("Hello World");',
        expected_output: 'Hello World',
        is_demo: true,
        difficulty_level: 'beginner'
      },
      {
        title: 'Python Lists',
        description: 'Working with Python lists',
        language: 'python',
        code_content: 'numbers = [1, 2, 3]\nprint(numbers)',
        expected_output: '[1, 2, 3]',
        is_demo: true,
        difficulty_level: 'beginner'
      },
      {
        title: 'Regular Course Example',
        language: 'csharp',
        code_content: 'Console.WriteLine("Not demo");',
        is_demo: false, // Not a demo
        difficulty_level: 'beginner'
      }
    ]).execute();

    // Create achievements (some active, some not)
    await db.insert(achievementsTable).values([
      {
        name: 'First Steps',
        description: 'Complete your first lesson',
        icon: 'trophy',
        badge_color: '#b8bb26',
        points_required: 10,
        category: 'completion',
        is_active: true
      },
      {
        name: 'Week Streak',
        description: 'Learn for 7 days straight',
        icon: 'fire',
        badge_color: '#fb4934',
        points_required: 70,
        category: 'streak',
        is_active: true
      },
      {
        name: 'Inactive Achievement',
        description: 'This should not appear',
        points_required: 100,
        category: 'milestone',
        is_active: false // Not active
      }
    ]).execute();

    const result = await getLandingPageData();

    // Check demo code examples (only demo ones)
    expect(result.demoCodeExamples).toHaveLength(2);
    expect(result.demoCodeExamples[0].title).toBe('Hello World Node.js');
    expect(result.demoCodeExamples[0].is_demo).toBe(true);
    expect(result.demoCodeExamples[0].language).toBe('nodejs');
    expect(result.demoCodeExamples[1].title).toBe('Python Lists');
    expect(result.demoCodeExamples[1].is_demo).toBe(true);
    expect(result.demoCodeExamples[1].language).toBe('python');

    // Check achievements (only active ones)
    expect(result.achievements).toHaveLength(2);
    expect(result.achievements[0].name).toBe('First Steps');
    expect(result.achievements[0].is_active).toBe(true);
    expect(result.achievements[0].points_required).toBe(10);
    expect(result.achievements[1].name).toBe('Week Streak');
    expect(result.achievements[1].is_active).toBe(true);
    expect(result.achievements[1].category).toBe('streak');
  });

  it('should handle complete landing page data', async () => {
    // Create a complete dataset
    const categoryResult = await db.insert(categoriesTable).values({
      name: 'Backend Development',
      slug: 'backend-dev',
      description: 'Server-side programming',
      icon: 'server',
      color: '#458588'
    }).returning().execute();

    await db.insert(landingPageContentTable).values({
      section: 'hero',
      title: 'Master Backend Development',
      subtitle: 'Learn industry-standard practices',
      content: 'Join our comprehensive courses',
      cta_text: 'Get Started',
      cta_link: '/courses',
      display_order: 1,
      is_active: true
    }).execute();

    await db.insert(coursesTable).values({
      category_id: categoryResult[0].id,
      title: 'Complete Backend Course',
      slug: 'complete-backend',
      description: 'Everything you need to know',
      short_description: 'Comprehensive backend course',
      language: 'nodejs',
      difficulty_level: 'intermediate',
      estimated_duration: 1200,
      is_featured: true,
      is_published: true,
      thumbnail_url: 'https://example.com/thumb.jpg'
    }).execute();

    await db.insert(codeExamplesTable).values({
      title: 'Express Server',
      description: 'Basic Express.js server',
      language: 'nodejs',
      code_content: 'const express = require("express");\nconst app = express();',
      expected_output: 'Server running on port 3000',
      is_demo: true,
      difficulty_level: 'intermediate'
    }).execute();

    await db.insert(achievementsTable).values({
      name: 'Backend Master',
      description: 'Complete all backend courses',
      icon: 'crown',
      badge_color: '#fabd2f',
      points_required: 1000,
      category: 'milestone',
      is_active: true
    }).execute();

    const result = await getLandingPageData();

    // Verify all sections are populated
    expect(result.hero).toBeDefined();
    expect(result.hero?.title).toBe('Master Backend Development');
    
    expect(result.featuredCourses).toHaveLength(1);
    expect(result.featuredCourses[0].title).toBe('Complete Backend Course');
    expect(result.featuredCourses[0].thumbnail_url).toBe('https://example.com/thumb.jpg');

    expect(result.categories).toHaveLength(1);
    expect(result.categories[0].name).toBe('Backend Development');
    expect(result.categories[0].color).toBe('#458588');

    expect(result.demoCodeExamples).toHaveLength(1);
    expect(result.demoCodeExamples[0].title).toBe('Express Server');
    expect(result.demoCodeExamples[0].language).toBe('nodejs');

    expect(result.achievements).toHaveLength(1);
    expect(result.achievements[0].name).toBe('Backend Master');
    expect(result.achievements[0].points_required).toBe(1000);

    // Verify timestamps are Date objects
    expect(result.hero?.created_at).toBeInstanceOf(Date);
    expect(result.featuredCourses[0].created_at).toBeInstanceOf(Date);
    expect(result.categories[0].created_at).toBeInstanceOf(Date);
    expect(result.demoCodeExamples[0].created_at).toBeInstanceOf(Date);
    expect(result.achievements[0].created_at).toBeInstanceOf(Date);
  });
});