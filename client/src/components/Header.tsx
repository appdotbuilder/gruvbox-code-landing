import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

export function Header() {
  return (
    <header className="sticky top-0 z-50 bg-[var(--gruvbox-bg0)] border-b border-[var(--gruvbox-bg3)]">
      <div className="container mx-auto px-4 py-3 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="gruvbox-card p-2">
            <span className="text-2xl">🚀</span>
          </div>
          <div>
            <h1 className="text-xl font-bold text-[var(--gruvbox-fg0)]">
              Code<span className="gruvbox-accent-yellow">Learn</span>
            </h1>
            <p className="text-xs text-[var(--gruvbox-fg3)]">Backend Mastery</p>
          </div>
        </div>
        
        <nav className="hidden md:flex items-center gap-6">
          <a href="#courses" className="text-[var(--gruvbox-fg2)] hover:text-[var(--gruvbox-yellow)] transition-colors">
            Courses
          </a>
          <a href="#demo" className="text-[var(--gruvbox-fg2)] hover:text-[var(--gruvbox-yellow)] transition-colors">
            Demo
          </a>
          <a href="#achievements" className="text-[var(--gruvbox-fg2)] hover:text-[var(--gruvbox-yellow)] transition-colors">
            Achievements
          </a>
        </nav>

        <div className="flex items-center gap-3">
          <Badge variant="secondary" className="bg-[var(--gruvbox-green)] text-[var(--gruvbox-bg0)] hover:bg-[var(--gruvbox-green)]">
            Beta
          </Badge>
          <Button className="gruvbox-button">
            Get Started
          </Button>
        </div>
      </div>
    </header>
  );
}