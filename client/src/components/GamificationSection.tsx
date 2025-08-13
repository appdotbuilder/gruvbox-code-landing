import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import type { Achievement } from '../../../server/src/schema';

interface GamificationSectionProps {
  achievements: Achievement[];
}

// Fallback achievements when API returns stub data
const fallbackAchievements: Omit<Achievement, 'id' | 'created_at'>[] = [
  {
    name: "First Steps",
    description: "Complete your first coding challenge",
    icon: "🎯",
    badge_color: "var(--gruvbox-green)",
    points_required: 10,
    category: "completion" as const,
    is_active: true
  },
  {
    name: "Code Streak",
    description: "Code for 7 consecutive days",
    icon: "🔥",
    badge_color: "var(--gruvbox-orange)",
    points_required: 50,
    category: "streak" as const,
    is_active: true
  },
  {
    name: "API Master",
    description: "Build 5 different REST APIs",
    icon: "🌐",
    badge_color: "var(--gruvbox-blue)",
    points_required: 100,
    category: "challenge" as const,
    is_active: true
  },
  {
    name: "Database Guru",
    description: "Complete all database challenges",
    icon: "🗄️",
    badge_color: "var(--gruvbox-purple)",
    points_required: 75,
    category: "completion" as const,
    is_active: true
  },
  {
    name: "Speed Demon",
    description: "Complete a challenge in under 30 minutes",
    icon: "⚡",
    badge_color: "var(--gruvbox-yellow)",
    points_required: 25,
    category: "challenge" as const,
    is_active: true
  },
  {
    name: "Milestone Achiever",
    description: "Reach 1000 total points",
    icon: "🏆",
    badge_color: "var(--gruvbox-red)",
    points_required: 1000,
    category: "milestone" as const,
    is_active: true
  }
];

export function GamificationSection({ achievements }: GamificationSectionProps) {
  const achievementList = achievements.length > 0 ? achievements : fallbackAchievements;

  // Mock user progress for demo
  const userProgress = {
    totalPoints: 235,
    currentStreak: 5,
    completedChallenges: 12,
    level: 3,
    nextLevelPoints: 300
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'completion': return '✅';
      case 'streak': return '🔥';
      case 'challenge': return '🎯';
      case 'milestone': return '🏆';
      default: return '⭐';
    }
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'completion': return 'bg-[var(--gruvbox-green)] text-[var(--gruvbox-bg0)]';
      case 'streak': return 'bg-[var(--gruvbox-orange)] text-[var(--gruvbox-bg0)]';
      case 'challenge': return 'bg-[var(--gruvbox-blue)] text-[var(--gruvbox-bg0)]';
      case 'milestone': return 'bg-[var(--gruvbox-purple)] text-[var(--gruvbox-bg0)]';
      default: return 'bg-[var(--gruvbox-bg3)] text-[var(--gruvbox-fg1)]';
    }
  };

  const isAchievementUnlocked = (pointsRequired: number) => {
    return userProgress.totalPoints >= pointsRequired;
  };

  return (
    <section id="achievements" className="py-20 px-4 bg-[var(--gruvbox-bg1)]">
      <div className="container mx-auto max-w-6xl">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold mb-4 text-[var(--gruvbox-fg0)]">
            Gamified <span className="gruvbox-accent-purple">Learning</span>
          </h2>
          <p className="text-xl text-[var(--gruvbox-fg2)] max-w-2xl mx-auto">
            Unlock achievements, build streaks, and level up your coding skills with our gamification system
          </p>
        </div>

        {/* User Progress Overview */}
        <div className="gruvbox-card p-8 mb-12">
          <h3 className="text-2xl font-bold text-[var(--gruvbox-fg0)] mb-6 text-center">
            Your Progress
          </h3>
          
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            <div className="text-center">
              <div className="text-3xl font-bold gruvbox-accent-yellow mb-2">
                {userProgress.totalPoints}
              </div>
              <div className="text-[var(--gruvbox-fg3)]">Total Points</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold gruvbox-accent-orange mb-2 flex items-center justify-center gap-1">
                🔥 {userProgress.currentStreak}
              </div>
              <div className="text-[var(--gruvbox-fg3)]">Day Streak</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold gruvbox-accent-green mb-2">
                {userProgress.completedChallenges}
              </div>
              <div className="text-[var(--gruvbox-fg3)]">Challenges</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold gruvbox-accent-blue mb-2">
                Level {userProgress.level}
              </div>
              <div className="text-[var(--gruvbox-fg3)]">Current Level</div>
            </div>
          </div>

          {/* Level Progress */}
          <div className="space-y-2">
            <div className="flex justify-between text-sm text-[var(--gruvbox-fg3)]">
              <span>Progress to Level {userProgress.level + 1}</span>
              <span>{userProgress.totalPoints}/{userProgress.nextLevelPoints} points</span>
            </div>
            <Progress 
              value={(userProgress.totalPoints / userProgress.nextLevelPoints) * 100} 
              className="h-2"
            />
          </div>
        </div>

        {/* Achievements Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {achievementList.map((achievement, index) => {
            const isUnlocked = isAchievementUnlocked(achievement.points_required);
            
            return (
              <Card 
                key={index} 
                className={`gruvbox-card transition-all duration-300 ${
                  isUnlocked 
                    ? 'shadow-lg border-[var(--gruvbox-yellow)] hover:scale-105' 
                    : 'opacity-60 hover:opacity-80'
                }`}
              >
                <CardHeader className="text-center">
                  <div className="flex justify-center items-center mb-3">
                    <div 
                      className={`text-4xl p-3 rounded-full ${
                        isUnlocked ? 'bg-[var(--gruvbox-bg2)]' : 'bg-[var(--gruvbox-bg3)]'
                      }`}
                      style={isUnlocked ? { color: achievement.badge_color || 'var(--gruvbox-fg1)' } : {}}
                    >
                      {isUnlocked ? achievement.icon : '🔒'}
                    </div>
                  </div>
                  
                  <div className="flex justify-center mb-2">
                    <Badge className={getCategoryColor(achievement.category)}>
                      {getCategoryIcon(achievement.category)} {achievement.category}
                    </Badge>
                  </div>
                  
                  <CardTitle className={`text-lg ${isUnlocked ? 'text-[var(--gruvbox-fg0)]' : 'text-[var(--gruvbox-fg3)]'}`}>
                    {achievement.name}
                  </CardTitle>
                </CardHeader>
                
                <CardContent className="text-center">
                  <CardDescription className="text-[var(--gruvbox-fg3)] mb-3">
                    {achievement.description}
                  </CardDescription>
                  
                  <div className="flex justify-center items-center gap-2">
                    <span className="text-sm font-medium text-[var(--gruvbox-fg2)]">
                      {achievement.points_required} points
                    </span>
                    {isUnlocked && (
                      <Badge className="bg-[var(--gruvbox-green)] text-[var(--gruvbox-bg0)]">
                        ✅ Unlocked
                      </Badge>
                    )}
                  </div>
                  
                  {!isUnlocked && (
                    <div className="mt-2">
                      <div className="text-xs text-[var(--gruvbox-fg4)]">
                        {achievement.points_required - userProgress.totalPoints} more points needed
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* Motivational CTA */}
        <div className="text-center mt-12">
          <div className="gruvbox-card p-8 max-w-2xl mx-auto">
            <h3 className="text-2xl font-bold text-[var(--gruvbox-fg0)] mb-4">
              Ready to Level Up? 🚀
            </h3>
            <p className="text-[var(--gruvbox-fg2)] mb-6">
              Join thousands of developers earning points, unlocking achievements, and building their coding skills one challenge at a time.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Badge className="bg-[var(--gruvbox-green)] text-[var(--gruvbox-bg0)] hover:bg-[var(--gruvbox-green)] px-4 py-2 text-base">
                🎯 15+ Achievements Available
              </Badge>
              <Badge className="bg-[var(--gruvbox-blue)] text-[var(--gruvbox-bg0)] hover:bg-[var(--gruvbox-blue)] px-4 py-2 text-base">
                🏆 Leaderboards Coming Soon
              </Badge>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}