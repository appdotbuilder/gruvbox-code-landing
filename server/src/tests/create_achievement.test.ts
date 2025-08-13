import { afterEach, beforeEach, describe, expect, it } from 'bun:test';
import { resetDB, createDB } from '../helpers';
import { db } from '../db';
import { achievementsTable } from '../db/schema';
import { type CreateAchievementInput } from '../schema';
import { createAchievement } from '../handlers/create_achievement';
import { eq } from 'drizzle-orm';

// Test input with all required fields
const testInput: CreateAchievementInput = {
  name: 'First Steps',
  description: 'Complete your first course',
  icon: 'trophy',
  badge_color: '#fabd2f',
  points_required: 100,
  category: 'completion',
  is_active: true
};

describe('createAchievement', () => {
  beforeEach(createDB);
  afterEach(resetDB);

  it('should create an achievement with all fields', async () => {
    const result = await createAchievement(testInput);

    // Basic field validation
    expect(result.name).toEqual('First Steps');
    expect(result.description).toEqual('Complete your first course');
    expect(result.icon).toEqual('trophy');
    expect(result.badge_color).toEqual('#fabd2f');
    expect(result.points_required).toEqual(100);
    expect(result.category).toEqual('completion');
    expect(result.is_active).toEqual(true);
    expect(result.id).toBeDefined();
    expect(result.created_at).toBeInstanceOf(Date);
  });

  it('should save achievement to database', async () => {
    const result = await createAchievement(testInput);

    // Query the database to verify persistence
    const achievements = await db.select()
      .from(achievementsTable)
      .where(eq(achievementsTable.id, result.id))
      .execute();

    expect(achievements).toHaveLength(1);
    const saved = achievements[0];
    expect(saved.name).toEqual('First Steps');
    expect(saved.description).toEqual('Complete your first course');
    expect(saved.icon).toEqual('trophy');
    expect(saved.badge_color).toEqual('#fabd2f');
    expect(saved.points_required).toEqual(100);
    expect(saved.category).toEqual('completion');
    expect(saved.is_active).toEqual(true);
    expect(saved.created_at).toBeInstanceOf(Date);
  });

  it('should create achievement with nullable fields as null', async () => {
    const minimalInput: CreateAchievementInput = {
      name: 'Minimal Achievement',
      description: 'Achievement with minimal data',
      icon: null,
      badge_color: null,
      points_required: 50,
      category: 'milestone',
      is_active: false
    };

    const result = await createAchievement(minimalInput);

    expect(result.name).toEqual('Minimal Achievement');
    expect(result.description).toEqual('Achievement with minimal data');
    expect(result.icon).toBeNull();
    expect(result.badge_color).toBeNull();
    expect(result.points_required).toEqual(50);
    expect(result.category).toEqual('milestone');
    expect(result.is_active).toEqual(false);
    expect(result.id).toBeDefined();
    expect(result.created_at).toBeInstanceOf(Date);
  });

  it('should handle different achievement categories', async () => {
    const categories = ['completion', 'streak', 'challenge', 'milestone'] as const;
    
    for (const category of categories) {
      const input: CreateAchievementInput = {
        name: `${category} Achievement`,
        description: `Test ${category} achievement`,
        icon: 'star',
        badge_color: '#83a598',
        points_required: 200,
        category: category,
        is_active: true
      };

      const result = await createAchievement(input);
      expect(result.category).toEqual(category);
      expect(result.name).toEqual(`${category} Achievement`);
    }
  });

  it('should handle zero points required', async () => {
    const zeroPointsInput: CreateAchievementInput = {
      name: 'Free Achievement',
      description: 'No points required',
      icon: 'gift',
      badge_color: '#b8bb26',
      points_required: 0,
      category: 'challenge',
      is_active: true
    };

    const result = await createAchievement(zeroPointsInput);
    expect(result.points_required).toEqual(0);
    expect(result.name).toEqual('Free Achievement');
  });

  it('should create multiple achievements independently', async () => {
    const input1: CreateAchievementInput = {
      name: 'Achievement One',
      description: 'First achievement',
      icon: 'medal',
      badge_color: '#fb4934',
      points_required: 100,
      category: 'completion',
      is_active: true
    };

    const input2: CreateAchievementInput = {
      name: 'Achievement Two',
      description: 'Second achievement',
      icon: 'crown',
      badge_color: '#fe8019',
      points_required: 500,
      category: 'streak',
      is_active: false
    };

    const result1 = await createAchievement(input1);
    const result2 = await createAchievement(input2);

    // Verify both achievements were created with different IDs
    expect(result1.id).not.toEqual(result2.id);
    expect(result1.name).toEqual('Achievement One');
    expect(result2.name).toEqual('Achievement Two');
    expect(result1.category).toEqual('completion');
    expect(result2.category).toEqual('streak');

    // Verify both exist in database
    const allAchievements = await db.select()
      .from(achievementsTable)
      .execute();
    
    expect(allAchievements).toHaveLength(2);
  });
});