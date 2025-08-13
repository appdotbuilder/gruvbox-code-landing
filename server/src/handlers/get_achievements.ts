import { db } from '../db';
import { achievementsTable } from '../db/schema';
import { type Achievement } from '../schema';
import { eq, desc } from 'drizzle-orm';

export async function getAchievements(): Promise<Achievement[]> {
  try {
    // Fetch all active achievements, ordered by points_required descending
    const results = await db.select()
      .from(achievementsTable)
      .where(eq(achievementsTable.is_active, true))
      .orderBy(desc(achievementsTable.points_required))
      .execute();

    return results;
  } catch (error) {
    console.error('Failed to fetch achievements:', error);
    throw error;
  }
}