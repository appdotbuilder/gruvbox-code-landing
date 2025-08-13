import { db } from '../db';
import { landingPageContentTable } from '../db/schema';
import { type UpdateLandingPageContentInput, type LandingPageContent } from '../schema';
import { eq } from 'drizzle-orm';

export const updateLandingPageContent = async (input: UpdateLandingPageContentInput): Promise<LandingPageContent> => {
  try {
    // Build update object with only provided fields
    const updateData: Record<string, any> = {
      updated_at: new Date()
    };

    if (input.section !== undefined) updateData['section'] = input.section;
    if (input.title !== undefined) updateData['title'] = input.title;
    if (input.subtitle !== undefined) updateData['subtitle'] = input.subtitle;
    if (input.content !== undefined) updateData['content'] = input.content;
    if (input.cta_text !== undefined) updateData['cta_text'] = input.cta_text;
    if (input.cta_link !== undefined) updateData['cta_link'] = input.cta_link;
    if (input.display_order !== undefined) updateData['display_order'] = input.display_order;
    if (input.is_active !== undefined) updateData['is_active'] = input.is_active;

    // Update the landing page content record
    const result = await db.update(landingPageContentTable)
      .set(updateData)
      .where(eq(landingPageContentTable.id, input.id))
      .returning()
      .execute();

    if (result.length === 0) {
      throw new Error(`Landing page content with ID ${input.id} not found`);
    }

    return result[0];
  } catch (error) {
    console.error('Landing page content update failed:', error);
    throw error;
  }
};