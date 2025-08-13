import { db } from '../db';
import { achievementsTable } from '../db/schema';
import { type CreateAchievementInput, type Achievement } from '../schema';

export const createAchievement = async (input: CreateAchievementInput): Promise<Achievement> => {
  try {
    // Insert achievement record
    const result = await db.insert(achievementsTable)
      .values({
        name: input.name,
        description: input.description,
        icon: input.icon,
        badge_color: input.badge_color,
        points_required: input.points_required,
        category: input.category,
        is_active: input.is_active
      })
      .returning()
      .execute();

    // Return the created achievement
    const achievement = result[0];
    return achievement;
  } catch (error) {
    console.error('Achievement creation failed:', error);
    throw error;
  }
};