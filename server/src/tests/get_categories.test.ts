import { afterEach, beforeEach, describe, expect, it } from 'bun:test';
import { resetDB, createDB } from '../helpers';
import { db } from '../db';
import { categoriesTable } from '../db/schema';
import { type CreateCategoryInput } from '../schema';
import { getCategories } from '../handlers/get_categories';

// Test data for categories
const testCategory1: CreateCategoryInput = {
  name: 'Backend Fundamentals',
  slug: 'backend-fundamentals',
  description: 'Core backend development concepts',
  icon: 'server',
  color: '#fb4934'
};

const testCategory2: CreateCategoryInput = {
  name: 'Advanced Patterns',
  slug: 'advanced-patterns',
  description: 'Advanced architectural patterns',
  icon: 'architecture',
  color: '#b8bb26'
};

const testCategory3: CreateCategoryInput = {
  name: 'Database Design',
  slug: 'database-design',
  description: 'Database modeling and optimization',
  icon: 'database',
  color: '#83a598'
};

describe('getCategories', () => {
  beforeEach(createDB);
  afterEach(resetDB);

  it('should return empty array when no categories exist', async () => {
    const result = await getCategories();
    
    expect(result).toEqual([]);
  });

  it('should return all categories ordered by name', async () => {
    // Create test categories in reverse alphabetical order to test sorting
    await db.insert(categoriesTable).values([
      testCategory2, // Advanced Patterns
      testCategory3, // Database Design  
      testCategory1  // Backend Fundamentals
    ]).execute();

    const result = await getCategories();

    expect(result).toHaveLength(3);
    
    // Verify alphabetical ordering
    expect(result[0].name).toEqual('Advanced Patterns');
    expect(result[1].name).toEqual('Backend Fundamentals');
    expect(result[2].name).toEqual('Database Design');
    
    // Verify all fields are present
    expect(result[0]).toMatchObject({
      name: 'Advanced Patterns',
      slug: 'advanced-patterns',
      description: 'Advanced architectural patterns',
      icon: 'architecture',
      color: '#b8bb26'
    });
    
    // Verify database-generated fields
    expect(result[0].id).toBeDefined();
    expect(result[0].created_at).toBeInstanceOf(Date);
    expect(result[0].updated_at).toBeInstanceOf(Date);
  });

  it('should handle categories with null values correctly', async () => {
    const categoryWithNulls: CreateCategoryInput = {
      name: 'Minimal Category',
      slug: 'minimal-category',
      description: null,
      icon: null,
      color: null
    };

    await db.insert(categoriesTable).values(categoryWithNulls).execute();

    const result = await getCategories();

    expect(result).toHaveLength(1);
    expect(result[0].name).toEqual('Minimal Category');
    expect(result[0].description).toBeNull();
    expect(result[0].icon).toBeNull();
    expect(result[0].color).toBeNull();
  });

  it('should return single category when only one exists', async () => {
    await db.insert(categoriesTable).values(testCategory1).execute();

    const result = await getCategories();

    expect(result).toHaveLength(1);
    expect(result[0].name).toEqual('Backend Fundamentals');
    expect(result[0].slug).toEqual('backend-fundamentals');
  });

  it('should maintain consistent ordering with multiple calls', async () => {
    await db.insert(categoriesTable).values([
      testCategory1,
      testCategory2,
      testCategory3
    ]).execute();

    const result1 = await getCategories();
    const result2 = await getCategories();

    expect(result1).toHaveLength(3);
    expect(result2).toHaveLength(3);
    
    // Both results should have same ordering
    expect(result1.map(c => c.name)).toEqual(result2.map(c => c.name));
    expect(result1[0].name).toEqual('Advanced Patterns');
    expect(result1[1].name).toEqual('Backend Fundamentals');
    expect(result1[2].name).toEqual('Database Design');
  });
});