import { afterEach, beforeEach, describe, expect, it } from 'bun:test';
import { resetDB, createDB } from '../helpers';
import { db } from '../db';
import { achievementsTable } from '../db/schema';
import { type CreateAchievementInput } from '../schema';
import { getAchievements } from '../handlers/get_achievements';

// Test achievements data
const testAchievements: CreateAchievementInput[] = [
  {
    name: 'First Steps',
    description: 'Complete your first lesson',
    icon: 'trophy',
    badge_color: '#fb4934',
    points_required: 10,
    category: 'completion',
    is_active: true
  },
  {
    name: 'Week Warrior',
    description: 'Maintain a 7-day learning streak',
    icon: 'fire',
    badge_color: '#fabd2f',
    points_required: 100,
    category: 'streak',
    is_active: true
  },
  {
    name: 'Challenge Master',
    description: 'Complete 5 coding challenges',
    icon: 'star',
    badge_color: '#8ec07c',
    points_required: 250,
    category: 'challenge',
    is_active: true
  },
  {
    name: 'Milestone Achiever',
    description: 'Complete your first course',
    icon: 'medal',
    badge_color: '#d3869b',
    points_required: 500,
    category: 'milestone',
    is_active: true
  },
  {
    name: 'Inactive Achievement',
    description: 'This achievement is inactive',
    icon: 'lock',
    badge_color: '#928374',
    points_required: 1000,
    category: 'milestone',
    is_active: false
  }
];

describe('getAchievements', () => {
  beforeEach(createDB);
  afterEach(resetDB);

  it('should fetch all active achievements', async () => {
    // Insert test achievements
    await db.insert(achievementsTable)
      .values(testAchievements)
      .execute();

    const result = await getAchievements();

    // Should return only active achievements (4 out of 5)
    expect(result).toHaveLength(4);
    
    // Verify all returned achievements are active
    result.forEach(achievement => {
      expect(achievement.is_active).toBe(true);
    });
  });

  it('should order achievements by points_required descending', async () => {
    // Insert test achievements
    await db.insert(achievementsTable)
      .values(testAchievements)
      .execute();

    const result = await getAchievements();

    // Verify ordering (highest points first)
    expect(result[0].name).toBe('Milestone Achiever');
    expect(result[0].points_required).toBe(500);
    expect(result[1].name).toBe('Challenge Master');
    expect(result[1].points_required).toBe(250);
    expect(result[2].name).toBe('Week Warrior');
    expect(result[2].points_required).toBe(100);
    expect(result[3].name).toBe('First Steps');
    expect(result[3].points_required).toBe(10);
  });

  it('should return diverse achievement categories', async () => {
    // Insert test achievements
    await db.insert(achievementsTable)
      .values(testAchievements)
      .execute();

    const result = await getAchievements();

    // Extract categories from results
    const categories = result.map(a => a.category);
    
    // Verify we have diverse categories
    expect(categories).toContain('completion');
    expect(categories).toContain('streak');
    expect(categories).toContain('challenge');
    expect(categories).toContain('milestone');
  });

  it('should return achievements with all required fields', async () => {
    // Insert a single achievement
    await db.insert(achievementsTable)
      .values([testAchievements[0]])
      .execute();

    const result = await getAchievements();

    expect(result).toHaveLength(1);
    const achievement = result[0];

    // Verify all fields are present
    expect(achievement.id).toBeDefined();
    expect(achievement.name).toBe('First Steps');
    expect(achievement.description).toBe('Complete your first lesson');
    expect(achievement.icon).toBe('trophy');
    expect(achievement.badge_color).toBe('#fb4934');
    expect(achievement.points_required).toBe(10);
    expect(achievement.category).toBe('completion');
    expect(achievement.is_active).toBe(true);
    expect(achievement.created_at).toBeInstanceOf(Date);
  });

  it('should return empty array when no active achievements exist', async () => {
    // Insert only inactive achievements
    await db.insert(achievementsTable)
      .values([{
        ...testAchievements[0],
        is_active: false
      }])
      .execute();

    const result = await getAchievements();

    expect(result).toHaveLength(0);
  });

  it('should handle nullable fields correctly', async () => {
    // Insert achievement with nullable fields as null
    await db.insert(achievementsTable)
      .values([{
        name: 'Basic Achievement',
        description: 'A basic achievement',
        icon: null,
        badge_color: null,
        points_required: 50,
        category: 'completion',
        is_active: true
      }])
      .execute();

    const result = await getAchievements();

    expect(result).toHaveLength(1);
    expect(result[0].icon).toBeNull();
    expect(result[0].badge_color).toBeNull();
    expect(result[0].name).toBe('Basic Achievement');
  });
});