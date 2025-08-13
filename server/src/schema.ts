import { z } from 'zod';

// Category schema for organizing courses
export const categorySchema = z.object({
  id: z.number(),
  name: z.string(),
  slug: z.string(),
  description: z.string().nullable(),
  icon: z.string().nullable(), // Icon identifier or path
  color: z.string().nullable(), // Gruvbox color code
  created_at: z.coerce.date(),
  updated_at: z.coerce.date()
});

export type Category = z.infer<typeof categorySchema>;

// Course schema for backend language courses
export const courseSchema = z.object({
  id: z.number(),
  category_id: z.number(),
  title: z.string(),
  slug: z.string(),
  description: z.string(),
  short_description: z.string().nullable(),
  language: z.enum(['nodejs', 'python', 'csharp']),
  difficulty_level: z.enum(['beginner', 'intermediate', 'advanced']),
  estimated_duration: z.number().int(), // Duration in minutes
  is_featured: z.boolean(),
  is_published: z.boolean(),
  thumbnail_url: z.string().nullable(),
  created_at: z.coerce.date(),
  updated_at: z.coerce.date()
});

export type Course = z.infer<typeof courseSchema>;

// Code example schema for demo purposes
export const codeExampleSchema = z.object({
  id: z.number(),
  course_id: z.number().nullable(),
  title: z.string(),
  description: z.string().nullable(),
  language: z.enum(['nodejs', 'python', 'csharp']),
  code_content: z.string(),
  expected_output: z.string().nullable(),
  is_demo: z.boolean(), // For landing page demo examples
  difficulty_level: z.enum(['beginner', 'intermediate', 'advanced']),
  created_at: z.coerce.date(),
  updated_at: z.coerce.date()
});

export type CodeExample = z.infer<typeof codeExampleSchema>;

// Achievement schema for gamification
export const achievementSchema = z.object({
  id: z.number(),
  name: z.string(),
  description: z.string(),
  icon: z.string().nullable(),
  badge_color: z.string().nullable(), // Gruvbox color for badge
  points_required: z.number().int(),
  category: z.enum(['completion', 'streak', 'challenge', 'milestone']),
  is_active: z.boolean(),
  created_at: z.coerce.date()
});

export type Achievement = z.infer<typeof achievementSchema>;

// Landing page content schema
export const landingPageContentSchema = z.object({
  id: z.number(),
  section: z.enum(['hero', 'demo', 'courses', 'features', 'cta']),
  title: z.string().nullable(),
  subtitle: z.string().nullable(),
  content: z.string().nullable(),
  cta_text: z.string().nullable(),
  cta_link: z.string().nullable(),
  display_order: z.number().int(),
  is_active: z.boolean(),
  created_at: z.coerce.date(),
  updated_at: z.coerce.date()
});

export type LandingPageContent = z.infer<typeof landingPageContentSchema>;

// Input schemas for creating entities
export const createCategoryInputSchema = z.object({
  name: z.string(),
  slug: z.string(),
  description: z.string().nullable(),
  icon: z.string().nullable(),
  color: z.string().nullable()
});

export type CreateCategoryInput = z.infer<typeof createCategoryInputSchema>;

export const createCourseInputSchema = z.object({
  category_id: z.number(),
  title: z.string(),
  slug: z.string(),
  description: z.string(),
  short_description: z.string().nullable(),
  language: z.enum(['nodejs', 'python', 'csharp']),
  difficulty_level: z.enum(['beginner', 'intermediate', 'advanced']),
  estimated_duration: z.number().int().positive(),
  is_featured: z.boolean().default(false),
  is_published: z.boolean().default(false),
  thumbnail_url: z.string().nullable()
});

export type CreateCourseInput = z.infer<typeof createCourseInputSchema>;

export const createCodeExampleInputSchema = z.object({
  course_id: z.number().nullable(),
  title: z.string(),
  description: z.string().nullable(),
  language: z.enum(['nodejs', 'python', 'csharp']),
  code_content: z.string(),
  expected_output: z.string().nullable(),
  is_demo: z.boolean().default(false),
  difficulty_level: z.enum(['beginner', 'intermediate', 'advanced'])
});

export type CreateCodeExampleInput = z.infer<typeof createCodeExampleInputSchema>;

export const createAchievementInputSchema = z.object({
  name: z.string(),
  description: z.string(),
  icon: z.string().nullable(),
  badge_color: z.string().nullable(),
  points_required: z.number().int().nonnegative(),
  category: z.enum(['completion', 'streak', 'challenge', 'milestone']),
  is_active: z.boolean().default(true)
});

export type CreateAchievementInput = z.infer<typeof createAchievementInputSchema>;

export const updateLandingPageContentInputSchema = z.object({
  id: z.number(),
  section: z.enum(['hero', 'demo', 'courses', 'features', 'cta']).optional(),
  title: z.string().nullable().optional(),
  subtitle: z.string().nullable().optional(),
  content: z.string().nullable().optional(),
  cta_text: z.string().nullable().optional(),
  cta_link: z.string().nullable().optional(),
  display_order: z.number().int().optional(),
  is_active: z.boolean().optional()
});

export type UpdateLandingPageContentInput = z.infer<typeof updateLandingPageContentInputSchema>;

// Landing page data response schema
export const landingPageDataSchema = z.object({
  hero: landingPageContentSchema.nullable(),
  demo: landingPageContentSchema.nullable(),
  featuredCourses: z.array(courseSchema),
  categories: z.array(categorySchema),
  demoCodeExamples: z.array(codeExampleSchema),
  achievements: z.array(achievementSchema),
  cta: landingPageContentSchema.nullable()
});

export type LandingPageData = z.infer<typeof landingPageDataSchema>;