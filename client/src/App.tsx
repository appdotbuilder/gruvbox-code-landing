import { useState, useEffect, useCallback } from 'react';
import { trpc } from '@/utils/trpc';
import type { LandingPageData } from '../../server/src/schema';
import { HeroSection } from '@/components/HeroSection';
import { DemoSection } from '@/components/DemoSection';
import { CoursesSection } from '@/components/CoursesSection';
import { GamificationSection } from '@/components/GamificationSection';
import { CTASection } from '@/components/CTASection';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';

function App() {
  const [landingData, setLandingData] = useState<LandingPageData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);

  const loadLandingData = useCallback(async () => {
    setIsLoading(true);
    
    // Set a timeout to prevent infinite loading
    const timeoutId = setTimeout(() => {
      console.warn('API request timed out, using fallback data');
      setLandingData({
        hero: null,
        demo: null,
        featuredCourses: [],
        categories: [],
        demoCodeExamples: [],
        achievements: [],
        cta: null
      });
      setIsLoading(false);
    }, 5000); // 5 second timeout

    try {
      const data = await trpc.getLandingPageData.query();
      clearTimeout(timeoutId);
      setLandingData(data);
      setHasError(false);
    } catch (error) {
      clearTimeout(timeoutId);
      console.error('Failed to load landing page data:', error);
      setHasError(true);
      // Set fallback data when API fails - this allows the page to render
      setLandingData({
        hero: null,
        demo: null,
        featuredCourses: [],
        categories: [],
        demoCodeExamples: [],
        achievements: [],
        cta: null
      });
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    loadLandingData();
  }, [loadLandingData]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[var(--gruvbox-bg0)] flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-[var(--gruvbox-yellow)] mx-auto mb-4"></div>
          <p className="text-[var(--gruvbox-fg2)]">Loading CodeLearn...</p>
          <p className="text-sm text-[var(--gruvbox-fg4)] mt-2">
            If this takes too long, we'll show you a demo with sample data
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[var(--gruvbox-bg0)]">
      {hasError && (
        <div className="bg-[var(--gruvbox-yellow)] text-[var(--gruvbox-bg0)] px-4 py-2 text-center text-sm">
          ⚠️ Demo Mode: Showing sample data due to backend connectivity issues
        </div>
      )}
      <Header />
      <main>
        <HeroSection content={landingData?.hero || null} />
        <DemoSection 
          content={landingData?.demo || null} 
          codeExamples={landingData?.demoCodeExamples || []} 
        />
        <CoursesSection 
          featuredCourses={landingData?.featuredCourses || []} 
          categories={landingData?.categories || []} 
        />
        <GamificationSection achievements={landingData?.achievements || []} />
        <CTASection content={landingData?.cta || null} />
      </main>
      <Footer />
    </div>
  );
}

export default App;