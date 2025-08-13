import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import type { LandingPageContent, CodeExample } from '../../../server/src/schema';

interface DemoSectionProps {
  content: LandingPageContent | null;
  codeExamples: CodeExample[];
}

// Fallback demo code examples when API returns stub data
const fallbackExamples: Omit<CodeExample, 'id' | 'course_id' | 'created_at' | 'updated_at'>[] = [
  {
    title: "Hello World API",
    description: "Create your first REST API endpoint",
    language: "nodejs" as const,
    code_content: `const express = require('express');
const app = express();

app.get('/api/hello', (req, res) => {
  res.json({
    message: 'Hello, World!',
    timestamp: new Date().toISOString()
  });
});

app.listen(3000, () => {
  console.log('Server running on port 3000');
});`,
    expected_output: `{
  "message": "Hello, World!",
  "timestamp": "2024-01-15T10:30:00.000Z"
}`,
    is_demo: true,
    difficulty_level: "beginner" as const
  },
  {
    title: "Data Processing",
    description: "Process and analyze data with Python",
    language: "python" as const,
    code_content: `def analyze_scores(scores):
    avg = sum(scores) / len(scores)
    highest = max(scores)
    lowest = min(scores)
    
    return {
        'average': round(avg, 2),
        'highest': highest,
        'lowest': lowest,
        'total_students': len(scores)
    }

# Example usage
student_scores = [85, 92, 78, 96, 88, 91, 73, 89]
result = analyze_scores(student_scores)
print(result)`,
    expected_output: `{
  'average': 86.5,
  'highest': 96,
  'lowest': 73,
  'total_students': 8
}`,
    is_demo: true,
    difficulty_level: "intermediate" as const
  },
  {
    title: "User Management",
    description: "Build a user service in C#",
    language: "csharp" as const,
    code_content: `public class User
{
    public int Id { get; set; }
    public string Name { get; set; }
    public string Email { get; set; }
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
}

public class UserService
{
    private List<User> users = new List<User>();

    public User CreateUser(string name, string email)
    {
        var user = new User
        {
            Id = users.Count + 1,
            Name = name,
            Email = email
        };
        
        users.Add(user);
        return user;
    }

    public List<User> GetAllUsers() => users;
}`,
    expected_output: `// Usage:
var userService = new UserService();
var user = userService.CreateUser("John Doe", "john@example.com");

// Returns: User { Id: 1, Name: "John Doe", Email: "john@example.com" }`,
    is_demo: true,
    difficulty_level: "intermediate" as const
  }
];

export function DemoSection({ content, codeExamples }: DemoSectionProps) {
  const [selectedTab, setSelectedTab] = useState("nodejs");
  const [isRunning, setIsRunning] = useState(false);

  // Use provided examples or fallback
  const examples = codeExamples.length > 0 ? codeExamples : fallbackExamples;
  const currentExample = examples.find(ex => ex.language === selectedTab) || examples[0];

  const handleRunCode = async () => {
    setIsRunning(true);
    // Simulate code execution
    await new Promise(resolve => setTimeout(resolve, 1500));
    setIsRunning(false);
  };

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

  return (
    <section id="demo" className="py-20 px-4 bg-[var(--gruvbox-bg1)]">
      <div className="container mx-auto max-w-6xl">
        <div className="text-center mb-12">
          <h2 className="text-4xl md:text-5xl font-bold mb-4 text-[var(--gruvbox-fg0)]">
            Try Our <span className="gruvbox-accent-aqua">Interactive</span> Code Editor
          </h2>
          <p className="text-xl text-[var(--gruvbox-fg2)] max-w-2xl mx-auto">
            Experience hands-on learning with real code examples. Write, run, and see results instantly!
          </p>
        </div>

        <Card className="gruvbox-card max-w-5xl mx-auto">
          <CardHeader>
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
              <div>
                <CardTitle className="text-2xl text-[var(--gruvbox-fg0)] flex items-center gap-2">
                  {getLanguageIcon(currentExample?.language || 'nodejs')} {currentExample?.title}
                </CardTitle>
                <p className="text-[var(--gruvbox-fg3)] mt-1">{currentExample?.description}</p>
              </div>
              <Badge className={getDifficultyColor(currentExample?.difficulty_level || 'beginner')}>
                {currentExample?.difficulty_level || 'beginner'}
              </Badge>
            </div>
          </CardHeader>
          <CardContent>
            <Tabs value={selectedTab} onValueChange={setSelectedTab} className="w-full">
              <TabsList className="grid w-full grid-cols-3 bg-[var(--gruvbox-bg2)]">
                <TabsTrigger 
                  value="nodejs" 
                  className="data-[state=active]:bg-[var(--gruvbox-green)] data-[state=active]:text-[var(--gruvbox-bg0)]"
                >
                  🟢 Node.js
                </TabsTrigger>
                <TabsTrigger 
                  value="python"
                  className="data-[state=active]:bg-[var(--gruvbox-blue)] data-[state=active]:text-[var(--gruvbox-bg0)]"
                >
                  🐍 Python
                </TabsTrigger>
                <TabsTrigger 
                  value="csharp"
                  className="data-[state=active]:bg-[var(--gruvbox-purple)] data-[state=active]:text-[var(--gruvbox-bg0)]"
                >
                  🔷 C#
                </TabsTrigger>
              </TabsList>
              
              {['nodejs', 'python', 'csharp'].map((lang) => {
                const example = examples.find(ex => ex.language === lang) || examples[0];
                return (
                  <TabsContent key={lang} value={lang} className="mt-4">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                      {/* Code Editor */}
                      <div className="space-y-3">
                        <div className="flex justify-between items-center">
                          <h4 className="text-sm font-medium text-[var(--gruvbox-fg2)]">Code Editor</h4>
                          <Button 
                            onClick={handleRunCode}
                            disabled={isRunning}
                            size="sm"
                            className="gruvbox-button"
                          >
                            {isRunning ? '⏳ Running...' : '▶️ Run Code'}
                          </Button>
                        </div>
                        <div className="code-editor p-4 min-h-[300px] overflow-auto">
                          <pre className="text-sm text-[var(--gruvbox-fg1)] whitespace-pre-wrap">
                            <code>{example?.code_content}</code>
                          </pre>
                        </div>
                      </div>
                      
                      {/* Output */}
                      <div className="space-y-3">
                        <h4 className="text-sm font-medium text-[var(--gruvbox-fg2)]">Output</h4>
                        <div className="code-editor p-4 min-h-[300px] bg-[var(--gruvbox-bg0)] border-[var(--gruvbox-green)]">
                          {isRunning ? (
                            <div className="flex items-center gap-2 text-[var(--gruvbox-yellow)]">
                              <div className="animate-spin">⚡</div>
                              <span>Executing code...</span>
                            </div>
                          ) : (
                            <pre className="text-sm gruvbox-accent-green whitespace-pre-wrap">
                              <code>{example?.expected_output}</code>
                            </pre>
                          )}
                        </div>
                      </div>
                    </div>
                  </TabsContent>
                );
              })}
            </Tabs>
          </CardContent>
        </Card>

        <div className="text-center mt-8">
          <Button size="lg" className="gruvbox-button">
            Explore More Examples 🔍
          </Button>
        </div>
      </div>
    </section>
  );
}