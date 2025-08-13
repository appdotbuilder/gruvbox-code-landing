import { Separator } from '@/components/ui/separator';

export function Footer() {
  return (
    <footer className="bg-[var(--gruvbox-bg1)] border-t border-[var(--gruvbox-bg3)]">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <span className="text-2xl">🚀</span>
              <div>
                <h3 className="text-lg font-bold text-[var(--gruvbox-fg0)]">
                  Code<span className="gruvbox-accent-yellow">Learn</span>
                </h3>
                <p className="text-xs text-[var(--gruvbox-fg3)]">Backend Mastery</p>
              </div>
            </div>
            <p className="text-[var(--gruvbox-fg3)] text-sm">
              Master backend development through interactive coding challenges and gamified learning experiences.
            </p>
          </div>

          {/* Quick Links */}
          <div className="space-y-4">
            <h4 className="text-[var(--gruvbox-fg0)] font-semibold">Learn</h4>
            <nav className="space-y-2">
              <a href="#courses" className="block text-[var(--gruvbox-fg2)] hover:text-[var(--gruvbox-yellow)] transition-colors text-sm">
                All Courses
              </a>
              <a href="#demo" className="block text-[var(--gruvbox-fg2)] hover:text-[var(--gruvbox-yellow)] transition-colors text-sm">
                Interactive Demo
              </a>
              <a href="#achievements" className="block text-[var(--gruvbox-fg2)] hover:text-[var(--gruvbox-yellow)] transition-colors text-sm">
                Achievements
              </a>
            </nav>
          </div>

          {/* Languages */}
          <div className="space-y-4">
            <h4 className="text-[var(--gruvbox-fg0)] font-semibold">Languages</h4>
            <nav className="space-y-2">
              <div className="flex items-center gap-2 text-sm text-[var(--gruvbox-fg2)]">
                🟢 <span>Node.js</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-[var(--gruvbox-fg2)]">
                🐍 <span>Python</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-[var(--gruvbox-fg2)]">
                🔷 <span>C#</span>
              </div>
            </nav>
          </div>

          {/* Community */}
          <div className="space-y-4">
            <h4 className="text-[var(--gruvbox-fg0)] font-semibold">Community</h4>
            <nav className="space-y-2">
              <a href="#" className="block text-[var(--gruvbox-fg2)] hover:text-[var(--gruvbox-yellow)] transition-colors text-sm">
                Discord Server
              </a>
              <a href="#" className="block text-[var(--gruvbox-fg2)] hover:text-[var(--gruvbox-yellow)] transition-colors text-sm">
                GitHub
              </a>
              <a href="#" className="block text-[var(--gruvbox-fg2)] hover:text-[var(--gruvbox-yellow)] transition-colors text-sm">
                Support
              </a>
            </nav>
          </div>
        </div>

        <Separator className="my-8 bg-[var(--gruvbox-bg3)]" />

        <div className="flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="text-[var(--gruvbox-fg3)] text-sm">
            © 2024 CodeLearn. Built with ❤️ for developers.
          </div>
          <div className="flex items-center gap-4 text-sm text-[var(--gruvbox-fg3)]">
            <a href="#" className="hover:text-[var(--gruvbox-yellow)] transition-colors">
              Privacy Policy
            </a>
            <a href="#" className="hover:text-[var(--gruvbox-yellow)] transition-colors">
              Terms of Service
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}