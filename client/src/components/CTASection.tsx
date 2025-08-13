import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import type { LandingPageContent } from '../../../server/src/schema';

interface CTASectionProps {
  content: LandingPageContent | null;
}

export function CTASection({ content }: CTASectionProps) {
  // Fallback content when API returns stub data
  const title = content?.title || "Start Your Backend Development Journey Today";
  const subtitle = content?.subtitle || "Join thousands of developers mastering Node.js, Python, and C# through interactive challenges";
  const ctaText = content?.cta_text || "Get Started for Free";

  return (
    <section className="py-20 px-4">
      <div className="container mx-auto max-w-4xl">
        <Card className="gruvbox-card overflow-hidden">
          <div className="gruvbox-gradient p-12 text-center">
            <div className="mb-6">
              <Badge className="bg-[var(--gruvbox-yellow)] text-[var(--gruvbox-bg0)] hover:bg-[var(--gruvbox-yellow)] text-lg px-6 py-2">
                🎉 Limited Time - Beta Access
              </Badge>
            </div>
            
            <h2 className="text-4xl md:text-5xl font-bold mb-6 text-[var(--gruvbox-fg0)]">
              {title.split(' ').map((word: string, index: number) => (
                <span
                  key={index}
                  className={
                    word.toLowerCase().includes('backend') ? 'text-[var(--gruvbox-aqua)]' :
                    word.toLowerCase().includes('journey') ? 'text-[var(--gruvbox-purple)]' :
                    ''
                  }
                >
                  {word}{' '}
                </span>
              ))}
            </h2>
            
            <p className="text-xl text-[var(--gruvbox-fg2)] mb-8 max-w-2xl mx-auto">
              {subtitle}
            </p>

            {/* Feature highlights */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
              <div className="text-center">
                <div className="text-3xl mb-2">🚀</div>
                <div className="text-[var(--gruvbox-fg1)] font-medium">Instant Setup</div>
                <div className="text-[var(--gruvbox-fg3)] text-sm">No downloads required</div>
              </div>
              <div className="text-center">
                <div className="text-3xl mb-2">🎯</div>
                <div className="text-[var(--gruvbox-fg1)] font-medium">Interactive Learning</div>
                <div className="text-[var(--gruvbox-fg3)] text-sm">Hands-on coding practice</div>
              </div>
              <div className="text-center">
                <div className="text-3xl mb-2">🏆</div>
                <div className="text-[var(--gruvbox-fg1)] font-medium">Gamified Progress</div>
                <div className="text-[var(--gruvbox-fg3)] text-sm">Achievements & rewards</div>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <Button size="lg" className="gruvbox-button text-xl px-10 py-4 transform hover:scale-105 transition-transform">
                {ctaText} 🎉
              </Button>
              <Button 
                size="lg" 
                variant="outline" 
                className="gruvbox-button-secondary text-xl px-8 py-4"
              >
                Watch Demo 👀
              </Button>
            </div>

            {/* Trust indicators */}
            <div className="mt-10 pt-8 border-t border-[var(--gruvbox-bg3)]">
              <p className="text-sm text-[var(--gruvbox-fg4)] mb-4">
                Trusted by developers worldwide
              </p>
              <div className="flex justify-center items-center gap-8 text-sm text-[var(--gruvbox-fg3)]">
                <div className="flex items-center gap-2">
                  <span className="gruvbox-accent-green">✓</span>
                  <span>No Credit Card Required</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="gruvbox-accent-blue">✓</span>
                  <span>Free Forever Plan</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="gruvbox-accent-purple">✓</span>
                  <span>Cancel Anytime</span>
                </div>
              </div>
            </div>
          </div>
        </Card>
      </div>
    </section>
  );
}