import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Search, BookOpen, FileText, Video, Link as LinkIcon, 
  Download, Play, Lightbulb, CheckCircle, ExternalLink, 
  Filter, ChevronDown, Bookmark, Copy, Clock
} from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';
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
  tags: string[];
}

export function LearningResourcesPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedSubject, setSelectedSubject] = useState<string>('all');
  const [selectedType, setSelectedType] = useState<string>('all');
  const [selectedDifficulty, setSelectedDifficulty] = useState<string>('all');
  const { toast } = useToast();
  
  const resources: Resource[] = [
    // Resource data
    {
      id: 'math-complex-numbers-1',
      title: 'Complex Numbers Fundamentals',
      description: 'Learn the basics of complex numbers, operations, and properties',
      type: 'video',
      source: 'Khan Academy',
      url: 'https://example.com/complex-numbers',
      subject: 'Maths',
      chapter: 'Complex Numbers',
      difficulty: 'beginner',
      tags: ['theory', 'fundamentals']
    },
    {
      id: 'math-quadratic-1',
      title: 'Solving Quadratic Equations - Complete Guide',
      description: 'Comprehensive techniques for solving all types of quadratic equations',
      type: 'pdf',
      source: 'NCERT',
      url: 'https://example.com/quadratic-equations',
      subject: 'Maths',
      chapter: 'Quadratic Equations',
      difficulty: 'intermediate',
      tags: ['reference', 'practice problems']
    },
    {
      id: 'math-calculus-1',
      title: 'Integration Techniques for JEE Advanced',
      description: 'Advanced integration methods with solved problems from previous JEE papers',
      type: 'article',
      source: 'JEE Advanced Solutions',
      url: 'https://example.com/integration-advanced',
      subject: 'Maths',
      chapter: 'Integration',
      difficulty: 'advanced',
      tags: ['previous year', 'advanced techniques']
    },
    {
      id: 'math-vectors-1',
      title: 'Vector Algebra Practice Questions',
      description: '100 practice problems with step-by-step solutions',
      type: 'practice',
      source: 'JEE Prep Materials',
      url: 'https://example.com/vector-practice',
      subject: 'Maths',
      chapter: 'Vectors',
      difficulty: 'intermediate',
      tags: ['practice', 'solutions']
    },
    {
      id: 'math-probability-1',
      title: 'Interactive Probability Simulator',
      description: 'Visual probability calculator with interactive examples',
      type: 'interactive',
      source: 'Math Interactive',
      url: 'https://example.com/probability-simulator',
      subject: 'Maths',
      chapter: 'Probability',
      difficulty: 'beginner',
      tags: ['interactive', 'visual learning']
    },
    
    {
      id: 'physics-mechanics-1',
      title: 'Mechanics: Forces and Motion',
      description: 'Comprehensive video series on Newtonian mechanics',
      type: 'video',
      source: 'Physics Galaxy',
      url: 'https://example.com/mechanics-series',
      subject: 'Physics',
      chapter: 'Laws of Motion',
      difficulty: 'intermediate',
      tags: ['video series', 'conceptual']
    },
    {
      id: 'physics-electrostatics-1',
      title: 'Electric Fields and Potential',
      description: 'Detailed study material with solved examples on electrostatics',
      type: 'pdf',
      source: 'HC Verma',
      url: 'https://example.com/electrostatics-potential',
      subject: 'Physics',
      chapter: 'Electrostatics',
      difficulty: 'advanced',
      tags: ['theory', 'examples']
    },
    {
      id: 'physics-optics-1',
      title: 'Wave Optics Simulator',
      description: 'Interactive simulator for understanding wave phenomena in optics',
      type: 'interactive',
      source: 'PhET Simulations',
      url: 'https://example.com/wave-optics-simulator',
      subject: 'Physics',
      chapter: 'Wave Optics',
      difficulty: 'intermediate',
      tags: ['simulation', 'interactive']
    },
    {
      id: 'physics-modern-1',
      title: 'Quantum Physics Explained',
      description: 'Simple explanations of complex quantum physics concepts for JEE',
      type: 'article',
      source: 'Physics Today',
      url: 'https://example.com/quantum-physics',
      subject: 'Physics',
      chapter: 'Modern Physics',
      difficulty: 'advanced',
      tags: ['conceptual', 'simplified']
    },
    {
      id: 'physics-thermodynamics-1',
      title: 'Thermodynamics Practice Problems',
      description: 'Collection of thermodynamics problems from previous JEE papers',
      type: 'practice',
      source: 'JEE Archive',
      url: 'https://example.com/thermodynamics-practice',
      subject: 'Physics',
      chapter: 'Thermodynamics',
      difficulty: 'intermediate',
      tags: ['practice', 'previous year']
    },
    
    {
      id: 'chemistry-periodic-1',
      title: 'Periodic Table Trends',
      description: 'Detailed video on periodic trends and properties',
      type: 'video',
      source: 'Chemistry Coach',
      url: 'https://example.com/periodic-trends',
      subject: 'Chemistry',
      chapter: 'Periodic Table',
      difficulty: 'beginner',
      tags: ['fundamentals', 'trends']
    },
    {
      id: 'chemistry-organic-1',
      title: 'Organic Chemistry Reaction Mechanisms',
      description: 'Comprehensive guide to organic reaction mechanisms with animations',
      type: 'interactive',
      source: 'Organic Chemistry Portal',
      url: 'https://example.com/organic-mechanisms',
      subject: 'Chemistry',
      chapter: 'Organic Chemistry',
      difficulty: 'advanced',
      tags: ['mechanisms', 'animations']
    },
    {
      id: 'chemistry-chemical-1',
      title: 'Chemical Equilibrium Cheat Sheet',
      description: 'Quick reference guide for all chemical equilibrium concepts',
      type: 'pdf',
      source: 'Chemistry Notes',
      url: 'https://example.com/equilibrium-cheatsheet',
      subject: 'Chemistry',
      chapter: 'Chemical Equilibrium',
      difficulty: 'intermediate',
      tags: ['reference', 'quick study']
    },
    {
      id: 'chemistry-bonding-1',
      title: 'Chemical Bonding Practice Test',
      description: 'Self-assessment test with detailed explanations',
      type: 'practice',
      source: 'Chemistry Practice',
      url: 'https://example.com/bonding-practice',
      subject: 'Chemistry',
      chapter: 'Chemical Bonding',
      difficulty: 'intermediate',
      tags: ['test', 'assessment']
    },
    {
      id: 'chemistry-coordination-1',
      title: 'Understanding Coordination Compounds',
      description: 'Detailed article on coordination chemistry with visualizations',
      type: 'article',
      source: 'Chemistry Journal',
      url: 'https://example.com/coordination-compounds',
      subject: 'Chemistry',
      chapter: 'Coordination Compounds',
      difficulty: 'advanced',
      tags: ['theory', 'visualization']
    },
  ];

  const filteredResources = resources.filter(resource => {
    const matchesSearch = 
      resource.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
      resource.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      resource.chapter.toLowerCase().includes(searchTerm.toLowerCase());
      
    const matchesSubject = selectedSubject === 'all' || resource.subject === selectedSubject;
    const matchesType = selectedType === 'all' || resource.type === selectedType;
    const matchesDifficulty = selectedDifficulty === 'all' || resource.difficulty === selectedDifficulty;
    
    return matchesSearch && matchesSubject && matchesType && matchesDifficulty;
  });

  const resourcesBySubject: Record<string, Resource[]> = {
    'Maths': filteredResources.filter(r => r.subject === 'Maths'),
    'Physics': filteredResources.filter(r => r.subject === 'Physics'),
    'Chemistry': filteredResources.filter(r => r.subject === 'Chemistry')
  };

  const resourcesByChapter: Record<string, Record<string, Resource[]>> = {
    'Maths': {},
    'Physics': {},
    'Chemistry': {}
  };

  for (const subject of ['Maths', 'Physics', 'Chemistry'] as const) {
    for (const resource of resourcesBySubject[subject]) {
      if (!resourcesByChapter[subject][resource.chapter]) {
        resourcesByChapter[subject][resource.chapter] = [];
      }
      resourcesByChapter[subject][resource.chapter].push(resource);
    }
  }

  const handleBookmark = (resourceId: string) => {
    toast({
      title: "Resource bookmarked",
      description: "You can access your bookmarked resources in your profile",
    });
  };

  const handleCopyLink = (url: string) => {
    navigator.clipboard.writeText(url);
    toast({
      title: "Link copied",
      description: "Resource link copied to clipboard",
    });
  };

  const getResourceTypeIcon = (type: string) => {
    switch (type) {
      case 'video':
        return <Video className="h-4 w-4" />;
      case 'pdf':
        return <FileText className="h-4 w-4" />;
      case 'article':
        return <BookOpen className="h-4 w-4" />;
      case 'practice':
        return <CheckCircle className="h-4 w-4" />;
      case 'interactive':
        return <Play className="h-4 w-4" />;
      default:
        return <LinkIcon className="h-4 w-4" />;
    }
  };

  const getResourceTypeColor = (type: string) => {
    switch (type) {
      case 'video':
        return 'bg-red-50 text-red-600 border-red-200 dark:bg-red-900/20 dark:border-red-800 dark:text-red-300';
      case 'pdf':
        return 'bg-blue-50 text-blue-600 border-blue-200 dark:bg-blue-900/20 dark:border-blue-800 dark:text-blue-300';
      case 'article':
        return 'bg-purple-50 text-purple-600 border-purple-200 dark:bg-purple-900/20 dark:border-purple-800 dark:text-purple-300';
      case 'practice':
        return 'bg-green-50 text-green-600 border-green-200 dark:bg-green-900/20 dark:border-green-800 dark:text-green-300';
      case 'interactive':
        return 'bg-amber-50 text-amber-600 border-amber-200 dark:bg-amber-900/20 dark:border-amber-800 dark:text-amber-300';
      default:
        return 'bg-gray-50 text-gray-600 border-gray-200 dark:bg-gray-900/20 dark:border-gray-800 dark:text-gray-300';
    }
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'beginner':
        return 'bg-green-50 text-green-600 border-green-200 dark:bg-green-900/20 dark:border-green-800 dark:text-green-300';
      case 'intermediate':
        return 'bg-yellow-50 text-yellow-600 border-yellow-200 dark:bg-yellow-900/20 dark:border-yellow-800 dark:text-yellow-300';
      case 'advanced':
        return 'bg-red-50 text-red-600 border-red-200 dark:bg-red-900/20 dark:border-red-800 dark:text-red-300';
      default:
        return 'bg-gray-50 text-gray-600 border-gray-200 dark:bg-gray-900/20 dark:border-gray-800 dark:text-gray-300';
    }
  };

  return (
    <div className="container max-w-6xl py-8 animate-fade-in">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
        <div>
          <h1 className="text-3xl font-bold mb-2">Learning Resources</h1>
          <p className="text-gray-600 dark:text-gray-300">
            Curated learning materials for JEE preparation
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Button variant="outline" className="flex items-center gap-2">
            <Download className="h-4 w-4" />
            Download All
          </Button>
          <Button className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700">
            <Lightbulb className="h-4 w-4" />
            Resource Recommendations
          </Button>
        </div>
      </div>
      
      <Card className="mb-8">
        <CardContent className="p-4">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input
                placeholder="Search resources..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <div className="flex flex-wrap gap-2">
              <div className="flex items-center gap-1">
                <select
                  value={selectedSubject}
                  onChange={(e) => setSelectedSubject(e.target.value)}
                  className="bg-transparent border border-gray-200 dark:border-gray-700 rounded-md px-3 py-2 text-sm"
                >
                  <option value="all">All Subjects</option>
                  <option value="Maths">Mathematics</option>
                  <option value="Physics">Physics</option>
                  <option value="Chemistry">Chemistry</option>
                </select>
              </div>
              <div className="flex items-center gap-1">
                <select
                  value={selectedType}
                  onChange={(e) => setSelectedType(e.target.value)}
                  className="bg-transparent border border-gray-200 dark:border-gray-700 rounded-md px-3 py-2 text-sm"
                >
                  <option value="all">All Types</option>
                  <option value="video">Videos</option>
                  <option value="pdf">PDFs</option>
                  <option value="article">Articles</option>
                  <option value="practice">Practice</option>
                  <option value="interactive">Interactive</option>
                </select>
              </div>
              <div className="flex items-center gap-1">
                <select
                  value={selectedDifficulty}
                  onChange={(e) => setSelectedDifficulty(e.target.value)}
                  className="bg-transparent border border-gray-200 dark:border-gray-700 rounded-md px-3 py-2 text-sm"
                >
                  <option value="all">All Levels</option>
                  <option value="beginner">Beginner</option>
                  <option value="intermediate">Intermediate</option>
                  <option value="advanced">Advanced</option>
                </select>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
      
      <Tabs defaultValue="all" className="w-full">
        <TabsList className="mb-6">
          <TabsTrigger value="all">All Resources</TabsTrigger>
          <TabsTrigger value="bookmarks">Bookmarked</TabsTrigger>
          <TabsTrigger value="recent">Recently Viewed</TabsTrigger>
        </TabsList>
        
        <TabsContent value="all">
          {filteredResources.length === 0 ? (
            <div className="text-center py-12">
              <Search className="h-12 w-12 text-gray-300 mx-auto mb-4" />
              <h3 className="text-lg font-medium mb-2">No resources found</h3>
              <p className="text-gray-500">Try changing your search or filter criteria</p>
            </div>
          ) : (
            <div className="space-y-8">
              {(['Maths', 'Physics', 'Chemistry'] as const).map(subject => {
                if (resourcesBySubject[subject].length === 0) return null;
                
                return (
                  <div key={subject}>
                    <h2 className="text-xl font-bold mb-4 flex items-center">
                      {subject === 'Maths' ? (
                        <div className="bg-cyan-100 text-cyan-700 dark:bg-cyan-900/30 dark:text-cyan-300 p-1 rounded mr-2">
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
                          </svg>
                        </div>
                      ) : subject === 'Physics' ? (
                        <div className="bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300 p-1 rounded mr-2">
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                          </svg>
                        </div>
                      ) : (
                        <div className="bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-300 p-1 rounded mr-2">
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />
                          </svg>
                        </div>
                      )}
                      {subject}
                    </h2>
                    
                    <Accordion type="multiple" defaultValue={Object.keys(resourcesByChapter[subject])}>
                      {Object.entries(resourcesByChapter[subject]).map(([chapter, chapterResources]) => (
                        <AccordionItem key={chapter} value={chapter}>
                          <AccordionTrigger className="hover:bg-gray-50 dark:hover:bg-gray-800 px-4 py-2 rounded-lg">
                            {chapter} ({chapterResources.length})
                          </AccordionTrigger>
                          <AccordionContent>
                            <div className="space-y-3 p-2">
                              {chapterResources.map(resource => (
                                <Card 
                                  key={resource.id} 
                                  className="overflow-hidden hover:shadow transition-all"
                                >
                                  <CardContent className="p-0">
                                    <div className="p-4">
                                      <div className="flex justify-between items-start mb-2">
                                        <div className="flex items-center gap-2">
                                          <Badge className={`flex items-center gap-1 ${getResourceTypeColor(resource.type)}`}>
                                            {getResourceTypeIcon(resource.type)}
                                            {resource.type.charAt(0).toUpperCase() + resource.type.slice(1)}
                                          </Badge>
                                          <Badge variant="outline" className={getDifficultyColor(resource.difficulty)}>
                                            {resource.difficulty.charAt(0).toUpperCase() + resource.difficulty.slice(1)}
                                          </Badge>
                                        </div>
                                        <div className="flex gap-1">
                                          <Button 
                                            variant="ghost" 
                                            size="icon" 
                                            className="h-8 w-8" 
                                            onClick={() => handleBookmark(resource.id)}
                                          >
                                            <Bookmark className="h-4 w-4 text-gray-400" />
                                          </Button>
                                          <Button 
                                            variant="ghost" 
                                            size="icon" 
                                            className="h-8 w-8"
                                            onClick={() => handleCopyLink(resource.url)}
                                          >
                                            <Copy className="h-4 w-4 text-gray-400" />
                                          </Button>
                                        </div>
                                      </div>
                                      
                                      <h3 className="font-semibold text-lg mb-1">{resource.title}</h3>
                                      <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">
                                        {resource.description}
                                      </p>
                                      
                                      <div className="flex flex-wrap items-center justify-between">
                                        <div className="text-xs text-gray-500">
                                          Source: <span className="font-medium">{resource.source}</span>
                                        </div>
                                        <Button
                                          variant="outline" 
                                          size="sm"
                                          className="text-xs h-8"
                                          asChild
                                        >
                                          <a href={resource.url} target="_blank" rel="noopener noreferrer">
                                            Open Resource
                                            <ExternalLink className="ml-1 h-3 w-3" />
                                          </a>
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
                                    </div>
                                  </CardContent>
                                </Card>
                              ))}
                            </div>
                          </AccordionContent>
                        </AccordionItem>
                      ))}
                    </Accordion>
                  </div>
                );
              })}
            </div>
          )}
        </TabsContent>
        
        <TabsContent value="bookmarks">
          <div className="text-center py-12">
            <Bookmark className="h-12 w-12 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-medium mb-2">No bookmarked resources</h3>
            <p className="text-gray-500">Bookmark resources to access them quickly later</p>
          </div>
        </TabsContent>
        
        <TabsContent value="recent">
          <div className="text-center py-12">
            <Clock className="h-12 w-12 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-medium mb-2">No recent resources</h3>
            <p className="text-gray-500">Resources you view will appear here</p>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}

export default LearningResourcesPage;
