import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import type { LandingPageContent } from '../../../server/src/schema';

interface HeroSectionProps {
  content: LandingPageContent | null;
}

export function HeroSection({ content }: HeroSectionProps) {
  // Fallback content when API returns stub data
  const title = content?.title || "Master Backend Development with Interactive Learning";
  const subtitle = content?.subtitle || "Learn Node.js, Python, and C# through hands-on coding challenges and gamified experiences";
  const ctaText = content?.cta_text || "Start Learning Now";

  return (
    <section className="py-20 px-4">
      <div className="container mx-auto max-w-6xl">
        <div className="text-center mb-12">
          <div className="flex justify-center gap-2 mb-6">
            <Badge className="bg-[var(--gruvbox-blue)] text-[var(--gruvbox-bg0)] hover:bg-[var(--gruvbox-blue)]">
              Node.js
            </Badge>
            <Badge className="bg-[var(--gruvbox-green)] text-[var(--gruvbox-bg0)] hover:bg-[var(--gruvbox-green)]">
              Python
            </Badge>
            <Badge className="bg-[var(--gruvbox-purple)] text-[var(--gruvbox-bg0)] hover:bg-[var(--gruvbox-purple)]">
              C#
            </Badge>
          </div>
          
          <h1 className="text-5xl md:text-7xl font-bold mb-6 text-[var(--gruvbox-fg0)] leading-tight">
            {title.split(' ').map((word: string, index: number) => (
              <span
                key={index}
                className={
                  word.toLowerCase().includes('backend') ? 'text-[var(--gruvbox-yellow)]' :
                  word.toLowerCase().includes('interactive') ? 'text-[var(--gruvbox-aqua)]' :
                  ''
                }
              >
                {word}{' '}
              </span>
            ))}
          </h1>
          
          <p className="text-xl md:text-2xl text-[var(--gruvbox-fg2)] mb-8 max-w-3xl mx-auto leading-relaxed">
            {subtitle}
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Button size="lg" className="gruvbox-button text-lg px-8 py-3">
              {ctaText} 🚀
            </Button>
            <Button size="lg" variant="outline" className="gruvbox-button-secondary text-lg px-8 py-3">
              View Demo 👀
            </Button>
          </div>
        </div>

        {/* Stats Section */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-16">
          <div className="gruvbox-card p-6 text-center">
            <div className="text-3xl font-bold gruvbox-accent-green mb-2">50+</div>
            <div className="text-[var(--gruvbox-fg2)]">Interactive Challenges</div>
          </div>
          <div className="gruvbox-card p-6 text-center">
            <div className="text-3xl font-bold gruvbox-accent-blue mb-2">3</div>
            <div className="text-[var(--gruvbox-fg2)]">Backend Languages</div>
          </div>
          <div className="gruvbox-card p-6 text-center">
            <div className="text-3xl font-bold gruvbox-accent-purple mb-2">15+</div>
            <div className="text-[var(--gruvbox-fg2)]">Achievement Badges</div>
          </div>
        </div>
      </div>
    </section>
  );
}