import { afterEach, beforeEach, describe, expect, it } from 'bun:test';
import { resetDB, createDB } from '../helpers';
import { db } from '../db';
import { landingPageContentTable } from '../db/schema';
import { type UpdateLandingPageContentInput } from '../schema';
import { updateLandingPageContent } from '../handlers/update_landing_page_content';
import { eq } from 'drizzle-orm';

describe('updateLandingPageContent', () => {
  beforeEach(createDB);
  afterEach(resetDB);

  // Helper function to create test landing page content
  const createTestContent = async () => {
    const result = await db.insert(landingPageContentTable)
      .values({
        section: 'hero',
        title: 'Original Hero Title',
        subtitle: 'Original Hero Subtitle',
        content: 'Original hero content',
        cta_text: 'Get Started',
        cta_link: '/signup',
        display_order: 1,
        is_active: true
      })
      .returning()
      .execute();
    
    return result[0];
  };

  it('should update landing page content with all fields', async () => {
    // Create test content
    const testContent = await createTestContent();

    const updateInput: UpdateLandingPageContentInput = {
      id: testContent.id,
      section: 'cta',
      title: 'Updated CTA Title',
      subtitle: 'Updated CTA Subtitle',
      content: 'Updated CTA content with call to action',
      cta_text: 'Start Learning Now',
      cta_link: '/courses',
      display_order: 5,
      is_active: false
    };

    const result = await updateLandingPageContent(updateInput);

    // Verify all fields were updated
    expect(result.id).toEqual(testContent.id);
    expect(result.section).toEqual('cta');
    expect(result.title).toEqual('Updated CTA Title');
    expect(result.subtitle).toEqual('Updated CTA Subtitle');
    expect(result.content).toEqual('Updated CTA content with call to action');
    expect(result.cta_text).toEqual('Start Learning Now');
    expect(result.cta_link).toEqual('/courses');
    expect(result.display_order).toEqual(5);
    expect(result.is_active).toEqual(false);
    expect(result.created_at).toEqual(testContent.created_at);
    expect(result.updated_at).toBeInstanceOf(Date);
    expect(result.updated_at).not.toEqual(testContent.updated_at);
  });

  it('should update only specified fields', async () => {
    const testContent = await createTestContent();

    const updateInput: UpdateLandingPageContentInput = {
      id: testContent.id,
      title: 'Only Title Updated',
      is_active: false
    };

    const result = await updateLandingPageContent(updateInput);

    // Verify only specified fields were updated
    expect(result.title).toEqual('Only Title Updated');
    expect(result.is_active).toEqual(false);
    
    // Verify other fields remained unchanged
    expect(result.section).toEqual(testContent.section);
    expect(result.subtitle).toEqual(testContent.subtitle);
    expect(result.content).toEqual(testContent.content);
    expect(result.cta_text).toEqual(testContent.cta_text);
    expect(result.cta_link).toEqual(testContent.cta_link);
    expect(result.display_order).toEqual(testContent.display_order);
  });

  it('should update nullable fields to null', async () => {
    const testContent = await createTestContent();

    const updateInput: UpdateLandingPageContentInput = {
      id: testContent.id,
      title: null,
      subtitle: null,
      content: null,
      cta_text: null,
      cta_link: null
    };

    const result = await updateLandingPageContent(updateInput);

    // Verify nullable fields were set to null
    expect(result.title).toBeNull();
    expect(result.subtitle).toBeNull();
    expect(result.content).toBeNull();
    expect(result.cta_text).toBeNull();
    expect(result.cta_link).toBeNull();
    
    // Verify required fields remained unchanged
    expect(result.section).toEqual(testContent.section);
    expect(result.display_order).toEqual(testContent.display_order);
    expect(result.is_active).toEqual(testContent.is_active);
  });

  it('should save changes to database', async () => {
    const testContent = await createTestContent();

    const updateInput: UpdateLandingPageContentInput = {
      id: testContent.id,
      section: 'demo',
      title: 'Demo Section Title',
      display_order: 10
    };

    await updateLandingPageContent(updateInput);

    // Verify changes were persisted in database
    const updatedContent = await db.select()
      .from(landingPageContentTable)
      .where(eq(landingPageContentTable.id, testContent.id))
      .execute();

    expect(updatedContent).toHaveLength(1);
    expect(updatedContent[0].section).toEqual('demo');
    expect(updatedContent[0].title).toEqual('Demo Section Title');
    expect(updatedContent[0].display_order).toEqual(10);
    expect(updatedContent[0].updated_at).toBeInstanceOf(Date);
    expect(updatedContent[0].updated_at).not.toEqual(testContent.updated_at);
  });

  it('should update different landing page sections correctly', async () => {
    // Create multiple landing page content records
    const heroContent = await db.insert(landingPageContentTable)
      .values({
        section: 'hero',
        title: 'Hero Title',
        display_order: 1,
        is_active: true
      })
      .returning()
      .execute();

    const featuresContent = await db.insert(landingPageContentTable)
      .values({
        section: 'features',
        title: 'Features Title',
        display_order: 2,
        is_active: true
      })
      .returning()
      .execute();

    // Update hero section
    const heroUpdate: UpdateLandingPageContentInput = {
      id: heroContent[0].id,
      title: 'Updated Hero Title',
      subtitle: 'Learn backend development'
    };

    const heroResult = await updateLandingPageContent(heroUpdate);

    // Update features section
    const featuresUpdate: UpdateLandingPageContentInput = {
      id: featuresContent[0].id,
      content: 'Amazing features for learning',
      is_active: false
    };

    const featuresResult = await updateLandingPageContent(featuresUpdate);

    // Verify updates are isolated
    expect(heroResult.title).toEqual('Updated Hero Title');
    expect(heroResult.subtitle).toEqual('Learn backend development');
    expect(heroResult.section).toEqual('hero');

    expect(featuresResult.content).toEqual('Amazing features for learning');
    expect(featuresResult.is_active).toEqual(false);
    expect(featuresResult.section).toEqual('features');
    expect(featuresResult.title).toEqual('Features Title'); // Should remain unchanged
  });

  it('should throw error for non-existent landing page content', async () => {
    const updateInput: UpdateLandingPageContentInput = {
      id: 99999,
      title: 'This should fail'
    };

    await expect(updateLandingPageContent(updateInput))
      .rejects
      .toThrow(/Landing page content with ID 99999 not found/i);
  });

  it('should handle minimal update with just ID', async () => {
    const testContent = await createTestContent();

    const updateInput: UpdateLandingPageContentInput = {
      id: testContent.id
    };

    const result = await updateLandingPageContent(updateInput);

    // Should return the original content with updated timestamp
    expect(result.id).toEqual(testContent.id);
    expect(result.section).toEqual(testContent.section);
    expect(result.title).toEqual(testContent.title);
    expect(result.updated_at).toBeInstanceOf(Date);
    expect(result.updated_at).not.toEqual(testContent.updated_at);
  });

  it('should update display order correctly', async () => {
    const testContent = await createTestContent();

    const updateInput: UpdateLandingPageContentInput = {
      id: testContent.id,
      display_order: 100
    };

    const result = await updateLandingPageContent(updateInput);

    expect(result.display_order).toEqual(100);
    expect(typeof result.display_order).toBe('number');
    
    // Verify in database
    const dbContent = await db.select()
      .from(landingPageContentTable)
      .where(eq(landingPageContentTable.id, testContent.id))
      .execute();

    expect(dbContent[0].display_order).toEqual(100);
  });
});