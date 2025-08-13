import { afterEach, beforeEach, describe, expect, it } from 'bun:test';
import { resetDB, createDB } from '../helpers';
import { db } from '../db';
import { categoriesTable } from '../db/schema';
import { type CreateCategoryInput } from '../schema';
import { createCategory } from '../handlers/create_category';
import { eq } from 'drizzle-orm';

// Test input with all fields
const testInput: CreateCategoryInput = {
  name: 'Backend Development',
  slug: 'backend-development',
  description: 'Learn server-side programming and database management',
  icon: 'server-icon',
  color: '#458588' // Gruvbox blue
};

// Minimal test input
const minimalInput: CreateCategoryInput = {
  name: 'Web Development',
  slug: 'web-development',
  description: null,
  icon: null,
  color: null
};

describe('createCategory', () => {
  beforeEach(createDB);
  afterEach(resetDB);

  it('should create a category with all fields', async () => {
    const result = await createCategory(testInput);

    // Basic field validation
    expect(result.name).toEqual('Backend Development');
    expect(result.slug).toEqual('backend-development');
    expect(result.description).toEqual('Learn server-side programming and database management');
    expect(result.icon).toEqual('server-icon');
    expect(result.color).toEqual('#458588');
    expect(result.id).toBeDefined();
    expect(typeof result.id).toBe('number');
    expect(result.id).toBeGreaterThan(0);
    expect(result.created_at).toBeInstanceOf(Date);
    expect(result.updated_at).toBeInstanceOf(Date);
  });

  it('should create a category with minimal fields (nullables)', async () => {
    const result = await createCategory(minimalInput);

    // Basic field validation
    expect(result.name).toEqual('Web Development');
    expect(result.slug).toEqual('web-development');
    expect(result.description).toBeNull();
    expect(result.icon).toBeNull();
    expect(result.color).toBeNull();
    expect(result.id).toBeDefined();
    expect(typeof result.id).toBe('number');
    expect(result.id).toBeGreaterThan(0);
    expect(result.created_at).toBeInstanceOf(Date);
    expect(result.updated_at).toBeInstanceOf(Date);
  });

  it('should save category to database', async () => {
    const result = await createCategory(testInput);

    // Query using proper drizzle syntax
    const categories = await db.select()
      .from(categoriesTable)
      .where(eq(categoriesTable.id, result.id))
      .execute();

    expect(categories).toHaveLength(1);
    expect(categories[0].name).toEqual('Backend Development');
    expect(categories[0].slug).toEqual('backend-development');
    expect(categories[0].description).toEqual('Learn server-side programming and database management');
    expect(categories[0].icon).toEqual('server-icon');
    expect(categories[0].color).toEqual('#458588');
    expect(categories[0].created_at).toBeInstanceOf(Date);
    expect(categories[0].updated_at).toBeInstanceOf(Date);
  });

  it('should handle unique slug constraint violation', async () => {
    // Create first category
    await createCategory(testInput);

    // Try to create another category with the same slug
    const duplicateInput: CreateCategoryInput = {
      name: 'Different Name',
      slug: 'backend-development', // Same slug
      description: 'Different description',
      icon: 'different-icon',
      color: '#d65d0e'
    };

    // Should throw error due to unique constraint
    await expect(createCategory(duplicateInput)).rejects.toThrow(/unique/i);
  });

  it('should create multiple categories with different slugs', async () => {
    const category1 = await createCategory(testInput);
    const category2 = await createCategory({
      name: 'Frontend Development',
      slug: 'frontend-development',
      description: 'Learn client-side programming and UI/UX',
      icon: 'browser-icon',
      color: '#cc241d'
    });

    expect(category1.id).not.toEqual(category2.id);
    expect(category1.slug).toEqual('backend-development');
    expect(category2.slug).toEqual('frontend-development');

    // Verify both are in database
    const allCategories = await db.select()
      .from(categoriesTable)
      .execute();

    expect(allCategories).toHaveLength(2);
  });

  it('should handle gruvbox color codes correctly', async () => {
    const gruvboxColors = [
      '#cc241d', // red
      '#d65d0e', // orange
      '#d79921', // yellow
      '#98971a', // green
      '#689d6a', // aqua
      '#458588', // blue
      '#b16286'  // purple
    ];

    for (const color of gruvboxColors) {
      const input: CreateCategoryInput = {
        name: `Category ${color}`,
        slug: `category-${color.replace('#', '')}`,
        description: null,
        icon: null,
        color: color
      };

      const result = await createCategory(input);
      expect(result.color).toEqual(color);
    }

    // Verify all categories were created
    const allCategories = await db.select()
      .from(categoriesTable)
      .execute();

    expect(allCategories).toHaveLength(gruvboxColors.length);
  });

  it('should handle special characters in name and description', async () => {
    const specialInput: CreateCategoryInput = {
      name: 'C# & .NET Development',
      slug: 'csharp-dotnet',
      description: 'Learn C#, ASP.NET, and Entity Framework with "advanced" topics & more!',
      icon: 'csharp-icon',
      color: '#b16286'
    };

    const result = await createCategory(specialInput);

    expect(result.name).toEqual('C# & .NET Development');
    expect(result.description).toEqual('Learn C#, ASP.NET, and Entity Framework with "advanced" topics & more!');
  });
});