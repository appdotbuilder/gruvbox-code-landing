import { serial, text, pgTable, timestamp, integer, boolean, pgEnum } from 'drizzle-orm/pg-core';
import { relations } from 'drizzle-orm';

// Enums for type safety
export const languageEnum = pgEnum('language', ['nodejs', 'python', 'csharp']);
export const difficultyLevelEnum = pgEnum('difficulty_level', ['beginner', 'intermediate', 'advanced']);
export const achievementCategoryEnum = pgEnum('achievement_category', ['completion', 'streak', 'challenge', 'milestone']);
export const landingPageSectionEnum = pgEnum('landing_page_section', ['hero', 'demo', 'courses', 'features', 'cta']);

// Categories table for organizing courses
export const categoriesTable = pgTable('categories', {
  id: serial('id').primaryKey(),
  name: text('name').notNull(),
  slug: text('slug').notNull().unique(),
  description: text('description'), // Nullable
  icon: text('icon'), // Nullable - icon identifier or path
  color: text('color'), // Nullable - gruvbox color code
  created_at: timestamp('created_at').defaultNow().notNull(),
  updated_at: timestamp('updated_at').defaultNow().notNull(),
});

// Courses table for backend language courses
export const coursesTable = pgTable('courses', {
  id: serial('id').primaryKey(),
  category_id: integer('category_id').notNull(),
  title: text('title').notNull(),
  slug: text('slug').notNull().unique(),
  description: text('description').notNull(),
  short_description: text('short_description'), // Nullable
  language: languageEnum('language').notNull(),
  difficulty_level: difficultyLevelEnum('difficulty_level').notNull(),
  estimated_duration: integer('estimated_duration').notNull(), // Duration in minutes
  is_featured: boolean('is_featured').default(false).notNull(),
  is_published: boolean('is_published').default(false).notNull(),
  thumbnail_url: text('thumbnail_url'), // Nullable
  created_at: timestamp('created_at').defaultNow().notNull(),
  updated_at: timestamp('updated_at').defaultNow().notNull(),
});

// Code examples table for demo and course content
export const codeExamplesTable = pgTable('code_examples', {
  id: serial('id').primaryKey(),
  course_id: integer('course_id'), // Nullable - can be standalone demo examples
  title: text('title').notNull(),
  description: text('description'), // Nullable
  language: languageEnum('language').notNull(),
  code_content: text('code_content').notNull(),
  expected_output: text('expected_output'), // Nullable
  is_demo: boolean('is_demo').default(false).notNull(), // For landing page demo examples
  difficulty_level: difficultyLevelEnum('difficulty_level').notNull(),
  created_at: timestamp('created_at').defaultNow().notNull(),
  updated_at: timestamp('updated_at').defaultNow().notNull(),
});

// Achievements table for gamification elements
export const achievementsTable = pgTable('achievements', {
  id: serial('id').primaryKey(),
  name: text('name').notNull(),
  description: text('description').notNull(),
  icon: text('icon'), // Nullable
  badge_color: text('badge_color'), // Nullable - gruvbox color for badge
  points_required: integer('points_required').notNull(),
  category: achievementCategoryEnum('category').notNull(),
  is_active: boolean('is_active').default(true).notNull(),
  created_at: timestamp('created_at').defaultNow().notNull(),
});

// Landing page content table for managing page sections
export const landingPageContentTable = pgTable('landing_page_content', {
  id: serial('id').primaryKey(),
  section: landingPageSectionEnum('section').notNull(),
  title: text('title'), // Nullable
  subtitle: text('subtitle'), // Nullable
  content: text('content'), // Nullable
  cta_text: text('cta_text'), // Nullable
  cta_link: text('cta_link'), // Nullable
  display_order: integer('display_order').notNull(),
  is_active: boolean('is_active').default(true).notNull(),
  created_at: timestamp('created_at').defaultNow().notNull(),
  updated_at: timestamp('updated_at').defaultNow().notNull(),
});

// Relations
export const categoriesRelations = relations(categoriesTable, ({ many }) => ({
  courses: many(coursesTable),
}));

export const coursesRelations = relations(coursesTable, ({ one, many }) => ({
  category: one(categoriesTable, {
    fields: [coursesTable.category_id],
    references: [categoriesTable.id],
  }),
  codeExamples: many(codeExamplesTable),
}));

export const codeExamplesRelations = relations(codeExamplesTable, ({ one }) => ({
  course: one(coursesTable, {
    fields: [codeExamplesTable.course_id],
    references: [coursesTable.id],
  }),
}));

// TypeScript types for table schemas
export type Category = typeof categoriesTable.$inferSelect;
export type NewCategory = typeof categoriesTable.$inferInsert;

export type Course = typeof coursesTable.$inferSelect;
export type NewCourse = typeof coursesTable.$inferInsert;

export type CodeExample = typeof codeExamplesTable.$inferSelect;
export type NewCodeExample = typeof codeExamplesTable.$inferInsert;

export type Achievement = typeof achievementsTable.$inferSelect;
export type NewAchievement = typeof achievementsTable.$inferInsert;

export type LandingPageContent = typeof landingPageContentTable.$inferSelect;
export type NewLandingPageContent = typeof landingPageContentTable.$inferInsert;

// Export all tables for relation queries
export const tables = {
  categories: categoriesTable,
  courses: coursesTable,
  codeExamples: codeExamplesTable,
  achievements: achievementsTable,
  landingPageContent: landingPageContentTable,
};