
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { 
  Search, BookOpen, FileText, Video, ExternalLink, 
  Filter, ChevronDown, Bookmark, Copy, Clock, Download,
  ChevronLeft, Play, CheckCircle, Target
} from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';
import { useJEEData } from '@/context/jee';
import { subjectIcons, chapterIcons } from '@/data/jeeData';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

interface Resource {
  id: string;
  title: string;
  description: string;
  type: 'video' | 'pdf' | 'article' | 'practice' | 'interactive';
  source: string;
  url: string;
  subject: 'Maths' | 'Physics' | 'Chemistry';
  chapter: string;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  category: 'learn' | 'practice' | 'test' | 'revise';
  tags: string[];
}

export function LearningResourcesPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedSubject, setSelectedSubject] = useState<string>('all');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [bookmarks, setBookmarks] = useState<string[]>([]);
  const { toast } = useToast();
  const { jeeData, getProgressBySubject, getProgressByChapter } = useJEEData();
  
  // Enhanced resource data with proper categorization
  const resources: Resource[] = [
    // Mathematics Resources
    {
      id: 'math-basic-1',
      title: 'Fundamentals of Mathematics',
      description: 'Complete foundation course covering number systems, basic operations, and mathematical reasoning',
      type: 'video',
      source: 'Khan Academy',
      url: '#',
      subject: 'Maths',
      chapter: 'Basic of Mathematics',
      difficulty: 'beginner',
      category: 'learn',
      tags: ['foundation', 'basics']
    },
    {
      id: 'math-basic-2',
      title: 'Practice Problems - Basic Mathematics',
      description: 'Comprehensive problem set for building mathematical foundation',
      type: 'practice',
      source: 'NCERT',
      url: '#',
      subject: 'Maths',
      chapter: 'Basic of Mathematics',
      difficulty: 'beginner',
      category: 'practice',
      tags: ['problems', 'practice']
    },
    {
      id: 'math-quadratic-1',
      title: 'Quadratic Equations Theory',
      description: 'Complete theory with derivations and graphical interpretations',
      type: 'pdf',
      source: 'Reference Book',
      url: '#',
      subject: 'Maths',
      chapter: 'Quadratic Equation',
      difficulty: 'intermediate',
      category: 'learn',
      tags: ['theory', 'graphs']
    },
    {
      id: 'math-quadratic-2',
      title: 'Quadratic Equations Test Series',
      description: 'JEE Main level test with detailed solutions and explanations',
      type: 'practice',
      source: 'Test Series',
      url: '#',
      subject: 'Maths',
      chapter: 'Quadratic Equation',
      difficulty: 'intermediate',
      category: 'test',
      tags: ['JEE Main', 'test']
    },
    
    // Physics Resources
    {
      id: 'physics-units-1',
      title: 'Units and Dimensions Fundamentals',
      description: 'Master the concept of units, dimensions, and dimensional analysis',
      type: 'video',
      source: 'Physics Wallah',
      url: '#',
      subject: 'Physics',
      chapter: 'Units and Dimensions',
      difficulty: 'beginner',
      category: 'learn',
      tags: ['fundamentals', 'dimensional analysis']
    },
    {
      id: 'physics-motion-1',
      title: 'Motion in One Dimension - Complete Notes',
      description: 'Comprehensive notes covering kinematics equations and graphical analysis',
      type: 'pdf',
      source: 'HC Verma',
      url: '#',
      subject: 'Physics',
      chapter: 'Motion In One Dimension',
      difficulty: 'intermediate',
      category: 'learn',
      tags: ['kinematics', 'graphs']
    },
    
    // Chemistry Resources
    {
      id: 'chemistry-basic-1',
      title: 'Basic Concepts of Chemistry',
      description: 'Introduction to atoms, molecules, moles, and stoichiometry',
      type: 'video',
      source: 'Unacademy',
      url: '#',
      subject: 'Chemistry',
      chapter: 'Some Basic Concepts of Chemistry',
      difficulty: 'beginner',
      category: 'learn',
      tags: ['concepts', 'stoichiometry']
    },
    {
      id: 'chemistry-atom-1',
      title: 'Atomic Structure Interactive Model',
      description: 'Visual representation of atomic structure and electron configuration',
      type: 'interactive',
      source: 'PhET Simulations',
      url: '#',
      subject: 'Chemistry',
      chapter: 'Structure of Atom',
      difficulty: 'intermediate',
      category: 'learn',
      tags: ['interactive', 'visualization']
    }
  ];

  const filteredResources = resources.filter(resource => {
    const matchesSearch = 
      resource.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
      resource.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      resource.chapter.toLowerCase().includes(searchTerm.toLowerCase());
      
    const matchesSubject = selectedSubject === 'all' || resource.subject === selectedSubject;
    const matchesCategory = selectedCategory === 'all' || resource.category === selectedCategory;
    
    return matchesSearch && matchesSubject && matchesCategory;
  });

  const handleBookmark = (resourceId: string) => {
    setBookmarks(prev => {
      const newBookmarks = prev.includes(resourceId) 
        ? prev.filter(id => id !== resourceId)
        : [...prev, resourceId];
      
      toast({
        title: prev.includes(resourceId) ? "Bookmark removed" : "Resource bookmarked",
        description: prev.includes(resourceId) 
          ? "Resource removed from bookmarks" 
          : "You can access bookmarked resources quickly",
      });
      
      return newBookmarks;
    });
  };

  const getResourceTypeIcon = (type: string) => {
    switch (type) {
      case 'video': return <Video className="h-4 w-4" />;
      case 'pdf': return <FileText className="h-4 w-4" />;
      case 'article': return <BookOpen className="h-4 w-4" />;
      case 'practice': return <CheckCircle className="h-4 w-4" />;
      case 'interactive': return <Play className="h-4 w-4" />;
      default: return <BookOpen className="h-4 w-4" />;
    }
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'learn': return 'bg-blue-100 text-blue-700 border-blue-200 dark:bg-blue-900/30 dark:text-blue-300';
      case 'practice': return 'bg-green-100 text-green-700 border-green-200 dark:bg-green-900/30 dark:text-green-300';
      case 'test': return 'bg-orange-100 text-orange-700 border-orange-200 dark:bg-orange-900/30 dark:text-orange-300';
      case 'revise': return 'bg-purple-100 text-purple-700 border-purple-200 dark:bg-purple-900/30 dark:text-purple-300';
      default: return 'bg-gray-100 text-gray-700 border-gray-200 dark:bg-gray-900/30 dark:text-gray-300';
    }
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'learn': return '📚';
      case 'practice': return '📝';
      case 'test': return '🧪';
      case 'revise': return '🔄';
      default: return '📖';
    }
  };

  return (
    <div className="container max-w-7xl py-8 space-y-8">
      {/* Header */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="space-y-4"
      >
        <Link to="/" className="inline-flex items-center text-sm text-muted-foreground hover:text-foreground transition-colors">
          <ChevronLeft className="h-4 w-4 mr-1" />
          Back to Home
        </Link>
        
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-4xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
              Learning Resources
            </h1>
            <p className="text-muted-foreground mt-2">
              Comprehensive study materials organized by subjects and chapters
            </p>
          </div>
          
          <div className="flex items-center gap-3">
            <Button variant="outline" className="flex items-center gap-2">
              <Download className="h-4 w-4" />
              Download All
            </Button>
            <Button className="flex items-center gap-2">
              <Target className="h-4 w-4" />
              Smart Recommendations
            </Button>
          </div>
        </div>
      </motion.div>
      
      {/* Search and Filters */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
      >
        <Card>
          <CardContent className="p-6">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                <Input
                  placeholder="Search resources, chapters, or topics..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
              
              <div className="flex gap-2 flex-wrap">
                <select
                  value={selectedSubject}
                  onChange={(e) => setSelectedSubject(e.target.value)}
                  className="bg-background border border-input rounded-md px-3 py-2 text-sm"
                >
                  <option value="all">All Subjects</option>
                  <option value="Maths">Mathematics</option>
                  <option value="Physics">Physics</option>
                  <option value="Chemistry">Chemistry</option>
                </select>
                
                <select
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  className="bg-background border border-input rounded-md px-3 py-2 text-sm"
                >
                  <option value="all">All Categories</option>
                  <option value="learn">📚 Learn</option>
                  <option value="practice">📝 Practice</option>
                  <option value="test">🧪 Test</option>
                  <option value="revise">🔄 Revise</option>
                </select>
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>
      
      {/* Subject Overview Cards */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="grid grid-cols-1 md:grid-cols-3 gap-6"
      >
        {(['Maths', 'Physics', 'Chemistry'] as const).map((subject, index) => {
          const progress = getProgressBySubject(subject);
          const chapters = Object.keys(jeeData.subjects[subject] || {});
          const subjectResources = resources.filter(r => r.subject === subject);
          
          return (
            <motion.div
              key={subject}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.3 + index * 0.1 }}
            >
              <Card className="relative overflow-hidden group hover:shadow-lg transition-all duration-300">
                <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-secondary/5 opacity-0 group-hover:opacity-100 transition-opacity" />
                <CardHeader className="relative">
                  <div className="flex items-center gap-3">
                    <div className="text-3xl">{subjectIcons[subject]}</div>
                    <div>
                      <CardTitle className="text-xl">{subject}</CardTitle>
                      <CardDescription>{chapters.length} chapters</CardDescription>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="relative space-y-4">
                  <div>
                    <div className="flex justify-between text-sm mb-2">
                      <span>Progress</span>
                      <span className="font-medium">{Math.round(progress)}%</span>
                    </div>
                    <Progress value={progress} className="h-2" />
                  </div>
                  
                  <div className="flex justify-between text-sm text-muted-foreground">
                    <span>{subjectResources.length} resources</span>
                    <Link 
                      to={`/subject/${subject}`}
                      className="text-primary hover:underline"
                    >
                      View Details →
                    </Link>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          );
        })}
      </motion.div>
      
      {/* Resources by Subject */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
      >
        <Tabs defaultValue="all" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4 lg:w-fit">
            <TabsTrigger value="all">All Resources</TabsTrigger>
            <TabsTrigger value="bookmarks">
              <Bookmark className="h-4 w-4 mr-2" />
              Bookmarks
            </TabsTrigger>
            <TabsTrigger value="recent">
              <Clock className="h-4 w-4 mr-2" />
              Recent
            </TabsTrigger>
            <TabsTrigger value="recommended">
              <Target className="h-4 w-4 mr-2" />
              For You
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="all">
            {(['Maths', 'Physics', 'Chemistry'] as const).map((subject) => {
              const subjectResources = filteredResources.filter(r => r.subject === subject);
              if (subjectResources.length === 0) return null;
              
              // Group resources by chapter
              const chapterGroups = subjectResources.reduce((acc, resource) => {
                if (!acc[resource.chapter]) acc[resource.chapter] = [];
                acc[resource.chapter].push(resource);
                return acc;
              }, {} as Record<string, Resource[]>);
              
              return (
                <motion.div 
                  key={subject}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="space-y-6"
                >
                  <div className="flex items-center gap-3">
                    <div className="text-2xl">{subjectIcons[subject]}</div>
                    <h2 className="text-2xl font-bold">{subject}</h2>
                    <Badge variant="outline">{subjectResources.length} resources</Badge>
                  </div>
                  
                  <Accordion type="multiple" defaultValue={Object.keys(chapterGroups)}>
                    {Object.entries(chapterGroups).map(([chapter, chapterResources]) => (
                      <AccordionItem key={chapter} value={chapter}>
                        <AccordionTrigger className="hover:bg-muted/50 px-4 py-3 rounded-lg">
                          <div className="flex items-center gap-3">
                            <div className="text-xl">{chapterIcons[chapter] || '📖'}</div>
                            <div className="text-left">
                              <div className="font-medium">{chapter}</div>
                              <div className="text-sm text-muted-foreground">
                                {chapterResources.length} resources • {Math.round(getProgressByChapter(subject, chapter))}% complete
                              </div>
                            </div>
                          </div>
                        </AccordionTrigger>
                        <AccordionContent>
                          {/* Category tabs for each chapter */}
                          <Tabs defaultValue="all" className="mt-4">
                            <TabsList className="grid w-full grid-cols-5">
                              <TabsTrigger value="all">All</TabsTrigger>
                              <TabsTrigger value="learn">📚 Learn</TabsTrigger>
                              <TabsTrigger value="practice">📝 Practice</TabsTrigger>
                              <TabsTrigger value="test">🧪 Test</TabsTrigger>
                              <TabsTrigger value="revise">🔄 Revise</TabsTrigger>
                            </TabsList>
                            
                            {['all', 'learn', 'practice', 'test', 'revise'].map(category => (
                              <TabsContent key={category} value={category}>
                                <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mt-4">
                                  {chapterResources
                                    .filter(r => category === 'all' || r.category === category)
                                    .map((resource, index) => (
                                    <motion.div
                                      key={resource.id}
                                      initial={{ opacity: 0, y: 10 }}
                                      animate={{ opacity: 1, y: 0 }}
                                      transition={{ delay: index * 0.05 }}
                                    >
                                      <Card className="h-full hover:shadow-md transition-all duration-200 group">
                                        <CardContent className="p-4">
                                          <div className="flex justify-between items-start mb-3">
                                            <div className="flex items-center gap-2">
                                              <Badge className={`${getCategoryColor(resource.category)} border`}>
                                                {getResourceTypeIcon(resource.type)}
                                                {resource.type}
                                              </Badge>
                                              <Badge variant="outline" className={getCategoryColor(resource.category)}>
                                                {getCategoryIcon(resource.category)} {resource.category}
                                              </Badge>
                                            </div>
                                            <Button
                                              variant="ghost"
                                              size="icon"
                                              className="h-8 w-8"
                                              onClick={() => handleBookmark(resource.id)}
                                            >
                                              <Bookmark 
                                                className={`h-4 w-4 ${
                                                  bookmarks.includes(resource.id) 
                                                    ? 'fill-primary text-primary' 
                                                    : 'text-muted-foreground'
                                                }`} 
                                              />
                                            </Button>
                                          </div>
                                          
                                          <h3 className="font-semibold mb-2 group-hover:text-primary transition-colors">
                                            {resource.title}
                                          </h3>
                                          <p className="text-sm text-muted-foreground mb-3 line-clamp-2">
                                            {resource.description}
                                          </p>
                                          
                                          <div className="flex items-center justify-between text-xs text-muted-foreground">
                                            <span>Source: <span className="font-medium">{resource.source}</span></span>
                                            <Button size="sm" variant="outline" className="h-7 text-xs">
                                              Open Resource
                                              <ExternalLink className="ml-1 h-3 w-3" />
                                            </Button>
                                          </div>
                                          
                                          {resource.tags.length > 0 && (
                                            <div className="flex flex-wrap gap-1 mt-3">
                                              {resource.tags.map(tag => (
                                                <Badge key={tag} variant="secondary" className="text-xs">
                                                  {tag}
                                                </Badge>
                                              ))}
                                            </div>
                                          )}
                                        </CardContent>
                                      </Card>
                                    </motion.div>
                                  ))}
                                </div>
                              </TabsContent>
                            ))}
                          </Tabs>
                        </AccordionContent>
                      </AccordionItem>
                    ))}
                  </Accordion>
                </motion.div>
              );
            })}
          </TabsContent>
          
          <TabsContent value="bookmarks">
            <div className="text-center py-12">
              <Bookmark className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-medium mb-2">No bookmarked resources</h3>
              <p className="text-muted-foreground">Bookmark resources to access them quickly later</p>
            </div>
          </TabsContent>
          
          <TabsContent value="recent">
            <div className="text-center py-12">
              <Clock className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-medium mb-2">No recent resources</h3>
              <p className="text-muted-foreground">Resources you access will appear here</p>
            </div>
          </TabsContent>
          
          <TabsContent value="recommended">
            <div className="text-center py-12">
              <Target className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-medium mb-2">Personalized recommendations coming soon</h3>
              <p className="text-muted-foreground">We'll suggest resources based on your study progress and weak areas</p>
            </div>
          </TabsContent>
        </Tabs>
      </motion.div>
    </div>
  );
}

export default LearningResourcesPage;
