import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import type { Course, Category } from '../../../server/src/schema';

interface CoursesSectionProps {
  featuredCourses: Course[];
  categories: Category[];
}

// Fallback data when API returns stub data
const fallbackCategories: Omit<Category, 'id' | 'created_at' | 'updated_at'>[] = [
  {
    name: "Web APIs",
    slug: "web-apis",
    description: "Build RESTful APIs and web services",
    icon: "🌐",
    color: "var(--gruvbox-blue)"
  },
  {
    name: "Databases",
    slug: "databases", 
    description: "Master database operations and ORM",
    icon: "🗄️",
    color: "var(--gruvbox-green)"
  },
  {
    name: "Authentication",
    slug: "authentication",
    description: "Secure your applications with proper auth",
    icon: "🔐",
    color: "var(--gruvbox-yellow)"
  },
  {
    name: "DevOps",
    slug: "devops",
    description: "Deploy and scale your applications",
    icon: "⚙️",
    color: "var(--gruvbox-purple)"
  }
];

const fallbackCourses: Omit<Course, 'id' | 'created_at' | 'updated_at'>[] = [
  {
    category_id: 1,
    title: "Node.js REST API Fundamentals",
    slug: "nodejs-rest-api-fundamentals",
    description: "Learn to build scalable REST APIs using Node.js and Express. Cover routing, middleware, error handling, and best practices for backend development.",
    short_description: "Build scalable REST APIs with Node.js",
    language: "nodejs" as const,
    difficulty_level: "beginner" as const,
    estimated_duration: 480,
    is_featured: true,
    is_published: true,
    thumbnail_url: null
  },
  {
    category_id: 1,
    title: "Python FastAPI Masterclass",
    slug: "python-fastapi-masterclass",
    description: "Master modern Python web development with FastAPI. Build high-performance APIs with automatic documentation, validation, and async support.",
    short_description: "High-performance APIs with Python",
    language: "python" as const,
    difficulty_level: "intermediate" as const,
    estimated_duration: 600,
    is_featured: true,
    is_published: true,
    thumbnail_url: null
  },
  {
    category_id: 2,
    title: "C# ASP.NET Core Deep Dive",
    slug: "csharp-aspnet-core-deep-dive",
    description: "Comprehensive course on ASP.NET Core development. Learn MVC, Web API, Entity Framework, authentication, and deployment strategies.",
    short_description: "Complete ASP.NET Core development",
    language: "csharp" as const,
    difficulty_level: "advanced" as const,
    estimated_duration: 720,
    is_featured: true,
    is_published: true,
    thumbnail_url: null
  }
];

export function CoursesSection({ featuredCourses, categories }: CoursesSectionProps) {
  const courses = featuredCourses.length > 0 ? featuredCourses : fallbackCourses;
  const cats = categories.length > 0 ? categories : fallbackCategories;

  const getLanguageIcon = (language: string) => {
    switch (language) {
      case 'nodejs': return '🟢';
      case 'python': return '🐍';
      case 'csharp': return '🔷';
      default: return '💻';
    }
  };

  const getDifficultyColor = (level: string) => {
    switch (level) {
      case 'beginner': return 'bg-[var(--gruvbox-green)] text-[var(--gruvbox-bg0)]';
      case 'intermediate': return 'bg-[var(--gruvbox-yellow)] text-[var(--gruvbox-bg0)]';
      case 'advanced': return 'bg-[var(--gruvbox-red)] text-[var(--gruvbox-bg0)]';
      default: return 'bg-[var(--gruvbox-bg3)] text-[var(--gruvbox-fg1)]';
    }
  };

  const formatDuration = (minutes: number) => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    if (hours > 0) {
      return mins > 0 ? `${hours}h ${mins}m` : `${hours}h`;
    }
    return `${mins}m`;
  };

  return (
    <section id="courses" className="py-20 px-4">
      <div className="container mx-auto max-w-6xl">
        {/* Categories Section */}
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold mb-4 text-[var(--gruvbox-fg0)]">
            Learning <span className="gruvbox-accent-green">Categories</span>
          </h2>
          <p className="text-xl text-[var(--gruvbox-fg2)] max-w-2xl mx-auto mb-12">
            Choose your learning path from our comprehensive curriculum
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {cats.map((category, index) => (
              <Card key={index} className="gruvbox-card hover:shadow-xl transition-shadow cursor-pointer group">
                <CardHeader className="text-center pb-2">
                  <div 
                    className="text-4xl mb-2 group-hover:scale-110 transition-transform"
                    style={{ color: category.color || 'var(--gruvbox-fg1)' }}
                  >
                    {category.icon}
                  </div>
                  <CardTitle className="text-[var(--gruvbox-fg0)]">
                    {category.name}
                  </CardTitle>
                </CardHeader>
                <CardContent className="text-center pt-0">
                  <CardDescription className="text-[var(--gruvbox-fg3)]">
                    {category.description}
                  </CardDescription>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Featured Courses Section */}
        <div className="text-center mb-12">
          <h2 className="text-4xl md:text-5xl font-bold mb-4 text-[var(--gruvbox-fg0)]">
            Featured <span className="gruvbox-accent-blue">Courses</span>
          </h2>
          <p className="text-xl text-[var(--gruvbox-fg2)] max-w-2xl mx-auto">
            Start your journey with our most popular and comprehensive courses
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {courses.map((course, index) => (
            <Card key={index} className="gruvbox-card hover:shadow-xl transition-shadow group">
              <CardHeader>
                <div className="flex justify-between items-start mb-2">
                  <div className="text-2xl">
                    {getLanguageIcon(course.language)}
                  </div>
                  <Badge className={getDifficultyColor(course.difficulty_level)}>
                    {course.difficulty_level}
                  </Badge>
                </div>
                <CardTitle className="text-xl text-[var(--gruvbox-fg0)] group-hover:text-[var(--gruvbox-yellow)] transition-colors">
                  {course.title}
                </CardTitle>
                <CardDescription className="text-[var(--gruvbox-fg3)]">
                  {course.short_description}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-[var(--gruvbox-fg2)] text-sm mb-4 line-clamp-3">
                  {course.description}
                </p>
                
                <div className="flex justify-between items-center mb-4">
                  <span className="text-sm text-[var(--gruvbox-fg3)]">
                    ⏱️ {formatDuration(course.estimated_duration)}
                  </span>
                  <Badge variant="secondary" className="bg-[var(--gruvbox-bg3)] text-[var(--gruvbox-fg1)]">
                    {course.language.toUpperCase()}
                  </Badge>
                </div>
                
                <Button className="w-full gruvbox-button group-hover:scale-105 transition-transform">
                  Start Learning 🚀
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="text-center mt-12">
          <Button size="lg" variant="outline" className="gruvbox-button-secondary">
            View All Courses 📚
          </Button>
        </div>
      </div>
    </section>
  );
}