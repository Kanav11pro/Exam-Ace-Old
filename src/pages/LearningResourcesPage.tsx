
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { 
  BookOpen, Video, FileText, TestTube, RotateCcw, 
  Search, ChevronRight, Play, Download, Clock,
  ArrowLeft, GraduationCap, Target, BookCheck
} from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';
import { motion, AnimatePresence } from 'framer-motion';
import { jeeSubjectData, chapterIcons } from '@/data/jeeData';

interface Resource {
  id: string;
  title: string;
  description: string;
  type: 'video' | 'pdf' | 'test' | 'notes';
  duration?: string;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  source: string;
  thumbnail?: string;
}

const mockResources: Record<string, Record<string, Record<string, Resource[]>>> = {
  'Maths': {
    'Complex Numbers': {
      learn: [
        {
          id: '1',
          title: 'Introduction to Complex Numbers',
          description: 'Understanding the basics of complex numbers and their representation',
          type: 'video',
          duration: '45 min',
          difficulty: 'beginner',
          source: 'Khan Academy',
          thumbnail: 'https://images.unsplash.com/photo-1635372722656-389f87a941b7?w=300&h=200&fit=crop'
        },
        {
          id: '2',
          title: 'Complex Number Operations',
          description: 'Addition, subtraction, multiplication and division of complex numbers',
          type: 'video',
          duration: '38 min',
          difficulty: 'intermediate',
          source: 'Physics Wallah',
          thumbnail: 'https://images.unsplash.com/photo-1518133910546-b6c2fb7d79e3?w=300&h=200&fit=crop'
        }
      ],
      practice: [
        {
          id: '3',
          title: 'Complex Numbers Practice Problems',
          description: '100+ solved problems with step-by-step solutions',
          type: 'pdf',
          difficulty: 'intermediate',
          source: 'JEE Materials'
        },
        {
          id: '4',
          title: 'Previous Year Questions - Complex Numbers',
          description: 'Last 10 years JEE Main and Advanced questions',
          type: 'pdf',
          difficulty: 'advanced',
          source: 'JEE Archive'
        }
      ],
      test: [
        {
          id: '5',
          title: 'Complex Numbers - JEE Main Mock Test',
          description: '30 questions, 90 minutes, based on latest pattern',
          type: 'test',
          duration: '90 min',
          difficulty: 'intermediate',
          source: 'TestPrep'
        }
      ],
      revise: [
        {
          id: '6',
          title: 'Complex Numbers Formula Sheet',
          description: 'Quick revision notes with all important formulas',
          type: 'notes',
          difficulty: 'beginner',
          source: 'Quick Notes'
        }
      ]
    }
  },
  'Physics': {
    'Laws of Motion': {
      learn: [
        {
          id: '7',
          title: 'Newton\'s Laws of Motion',
          description: 'Complete explanation of all three laws with real-world examples',
          type: 'video',
          duration: '52 min',
          difficulty: 'beginner',
          source: 'Physics Galaxy',
          thumbnail: 'https://images.unsplash.com/photo-1446776653964-20c1d3a81b06?w=300&h=200&fit=crop'
        }
      ],
      practice: [
        {
          id: '8',
          title: 'Laws of Motion Practice Set',
          description: 'Comprehensive problem set with varying difficulty levels',
          type: 'pdf',
          difficulty: 'intermediate',
          source: 'HC Verma'
        }
      ],
      test: [
        {
          id: '9',
          title: 'Laws of Motion Test Series',
          description: 'Multi-level test series for thorough preparation',
          type: 'test',
          duration: '75 min',
          difficulty: 'advanced',
          source: 'FIITJEE'
        }
      ],
      revise: [
        {
          id: '10',
          title: 'Quick Revision - Laws of Motion',
          description: 'Concise notes for last-minute revision',
          type: 'notes',
          difficulty: 'intermediate',
          source: 'Revision Notes'
        }
      ]
    }
  },
  'Chemistry': {
    'Chemical Bonding and Molecular Structure': {
      learn: [
        {
          id: '11',
          title: 'Chemical Bonding Fundamentals',
          description: 'Ionic, covalent, and coordinate bonding explained',
          type: 'video',
          duration: '48 min',
          difficulty: 'beginner',
          source: 'Unacademy',
          thumbnail: 'https://images.unsplash.com/photo-1554475901-4538ddfbccc2?w=300&h=200&fit=crop'
        }
      ],
      practice: [
        {
          id: '12',
          title: 'Chemical Bonding Problem Bank',
          description: 'Extensive collection of bonding theory problems',
          type: 'pdf',
          difficulty: 'intermediate',
          source: 'OP Tandon'
        }
      ],
      test: [
        {
          id: '13',
          title: 'Chemical Bonding Mock Test',
          description: 'Topic-wise test covering all bonding concepts',
          type: 'test',
          duration: '60 min',
          difficulty: 'intermediate',
          source: 'Aakash'
        }
      ],
      revise: [
        {
          id: '14',
          title: 'Bonding Theory Quick Notes',
          description: 'Essential points and formulas for quick revision',
          type: 'notes',
          difficulty: 'beginner',
          source: 'NCERT Plus'
        }
      ]
    }
  }
};

const resourceCategoryConfig = {
  learn: {
    icon: BookOpen,
    color: 'bg-blue-500 hover:bg-blue-600',
    gradient: 'from-blue-500 to-blue-600',
    description: 'Watch lectures and understand concepts'
  },
  practice: {
    icon: FileText,
    color: 'bg-green-500 hover:bg-green-600',
    gradient: 'from-green-500 to-green-600',
    description: 'Solve problems and practice questions'
  },
  test: {
    icon: TestTube,
    color: 'bg-purple-500 hover:bg-purple-600',
    gradient: 'from-purple-500 to-purple-600',
    description: 'Take mock tests and assessments'
  },
  revise: {
    icon: RotateCcw,
    color: 'bg-orange-500 hover:bg-orange-600',
    gradient: 'from-orange-500 to-orange-600',
    description: 'Quick revision notes and formulas'
  }
};

export function LearningResourcesPage() {
  const [selectedSubject, setSelectedSubject] = useState<string | null>(null);
  const [selectedChapter, setSelectedChapter] = useState<string | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const { toast } = useToast();

  const subjects = ['Maths', 'Physics', 'Chemistry'];
  
  const getSubjectIcon = (subject: string) => {
    switch (subject) {
      case 'Maths': return '📐';
      case 'Physics': return '⚛️';
      case 'Chemistry': return '🧪';
      default: return '📚';
    }
  };

  const getSubjectGradient = (subject: string) => {
    switch (subject) {
      case 'Maths': return 'from-cyan-500 to-blue-600';
      case 'Physics': return 'from-green-500 to-teal-600';
      case 'Chemistry': return 'from-orange-500 to-red-600';
      default: return 'from-gray-500 to-gray-600';
    }
  };

  const chapters = selectedSubject ? Object.keys(jeeSubjectData[selectedSubject as keyof typeof jeeSubjectData] || {}) : [];
  
  const filteredChapters = chapters.filter(chapter =>
    chapter.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const currentResources = selectedSubject && selectedChapter && selectedCategory
    ? mockResources[selectedSubject]?.[selectedChapter]?.[selectedCategory] || []
    : [];

  const handleResourceAccess = (resource: Resource) => {
    toast({
      title: "Resource accessed",
      description: `Opening ${resource.title}`,
    });
  };

  const resetToSubjects = () => {
    setSelectedSubject(null);
    setSelectedChapter(null);
    setSelectedCategory(null);
  };

  const resetToChapters = () => {
    setSelectedChapter(null);
    setSelectedCategory(null);
  };

  const resetToCategories = () => {
    setSelectedCategory(null);
  };

  return (
    <div className="container max-w-6xl py-8 animate-fade-in">
      {/* Header */}
      <motion.div 
        className="text-center mb-8"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <h1 className="text-4xl font-bold mb-4 bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
          Learning Resources
        </h1>
        <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
          Comprehensive study materials organized by subjects and chapters for effective JEE preparation
        </p>
      </motion.div>

      {/* Breadcrumb Navigation */}
      <div className="flex items-center gap-2 mb-6 text-sm text-muted-foreground">
        <button 
          onClick={resetToSubjects}
          className="hover:text-primary transition-colors"
        >
          Resources
        </button>
        {selectedSubject && (
          <>
            <ChevronRight className="h-4 w-4" />
            <button 
              onClick={resetToChapters}
              className="hover:text-primary transition-colors"
            >
              {selectedSubject}
            </button>
          </>
        )}
        {selectedChapter && (
          <>
            <ChevronRight className="h-4 w-4" />
            <button 
              onClick={resetToCategories}
              className="hover:text-primary transition-colors"
            >
              {selectedChapter}
            </button>
          </>
        )}
        {selectedCategory && (
          <>
            <ChevronRight className="h-4 w-4" />
            <span className="capitalize">{selectedCategory}</span>
          </>
        )}
      </div>

      <AnimatePresence mode="wait">
        {/* Subject Selection */}
        {!selectedSubject && (
          <motion.div
            key="subjects"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.3 }}
            className="space-y-6"
          >
            <div className="text-center mb-8">
              <h2 className="text-2xl font-semibold mb-2">Choose Your Subject</h2>
              <p className="text-muted-foreground">Select a subject to explore chapter-wise resources</p>
            </div>
            
            <div className="grid md:grid-cols-3 gap-6">
              {subjects.map((subject, index) => (
                <motion.div
                  key={subject}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1, duration: 0.4 }}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <Card 
                    className="cursor-pointer overflow-hidden group hover:shadow-xl transition-all duration-300"
                    onClick={() => setSelectedSubject(subject)}
                  >
                    <div className={`h-2 bg-gradient-to-r ${getSubjectGradient(subject)}`} />
                    <CardContent className="p-6 text-center">
                      <div className="text-6xl mb-4 group-hover:scale-110 transition-transform duration-300">
                        {getSubjectIcon(subject)}
                      </div>
                      <h3 className="text-xl font-semibold mb-2">{subject}</h3>
                      <p className="text-sm text-muted-foreground mb-4">
                        {subject === 'Maths' && 'Mathematical concepts and problem solving'}
                        {subject === 'Physics' && 'Physical laws and principles'}
                        {subject === 'Chemistry' && 'Chemical reactions and molecular structure'}
                      </p>
                      <div className="flex items-center justify-center gap-2 text-primary">
                        <span className="text-sm font-medium">Explore Chapters</span>
                        <ChevronRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}

        {/* Chapter Selection */}
        {selectedSubject && !selectedChapter && (
          <motion.div
            key="chapters"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.3 }}
            className="space-y-6"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Button 
                  variant="ghost" 
                  size="sm" 
                  onClick={resetToSubjects}
                  className="gap-2"
                >
                  <ArrowLeft className="h-4 w-4" />
                  Back to Subjects
                </Button>
                <div className="h-6 w-px bg-border" />
                <div className="flex items-center gap-2">
                  <span className="text-2xl">{getSubjectIcon(selectedSubject)}</span>
                  <h2 className="text-2xl font-semibold">{selectedSubject} Chapters</h2>
                </div>
              </div>
            </div>

            {/* Search */}
            <div className="relative max-w-md">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
              <Input
                placeholder="Search chapters..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredChapters.map((chapter, index) => (
                <motion.div
                  key={chapter}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05, duration: 0.3 }}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <Card 
                    className="cursor-pointer group hover:shadow-lg transition-all duration-300"
                    onClick={() => setSelectedChapter(chapter)}
                  >
                    <CardContent className="p-4">
                      <div className="flex items-start gap-3">
                        <div className="text-2xl group-hover:scale-110 transition-transform duration-300">
                          {chapterIcons[chapter] || '📖'}
                        </div>
                        <div className="flex-1">
                          <h3 className="font-medium mb-1 group-hover:text-primary transition-colors">
                            {chapter}
                          </h3>
                          <div className="flex items-center justify-between">
                            <span className="text-xs text-muted-foreground">
                              Multiple resources available
                            </span>
                            <ChevronRight className="h-4 w-4 text-muted-foreground group-hover:translate-x-1 transition-transform" />
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}

        {/* Resource Categories */}
        {selectedSubject && selectedChapter && !selectedCategory && (
          <motion.div
            key="categories"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.3 }}
            className="space-y-6"
          >
            <div className="flex items-center gap-3 mb-6">
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={resetToChapters}
                className="gap-2"
              >
                <ArrowLeft className="h-4 w-4" />
                Back to Chapters
              </Button>
              <div className="h-6 w-px bg-border" />
              <div className="flex items-center gap-2">
                <span className="text-xl">{chapterIcons[selectedChapter] || '📖'}</span>
                <h2 className="text-2xl font-semibold">{selectedChapter}</h2>
              </div>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
              {Object.entries(resourceCategoryConfig).map(([category, config], index) => {
                const Icon = config.icon;
                return (
                  <motion.div
                    key={category}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1, duration: 0.4 }}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <Card 
                      className="cursor-pointer group overflow-hidden hover:shadow-xl transition-all duration-300"
                      onClick={() => setSelectedCategory(category)}
                    >
                      <div className={`h-2 bg-gradient-to-r ${config.gradient}`} />
                      <CardContent className="p-6 text-center">
                        <div className={`w-16 h-16 mx-auto mb-4 rounded-full bg-gradient-to-r ${config.gradient} flex items-center justify-center group-hover:scale-110 transition-transform duration-300`}>
                          <Icon className="h-8 w-8 text-white" />
                        </div>
                        <h3 className="text-lg font-semibold mb-2 capitalize">{category}</h3>
                        <p className="text-sm text-muted-foreground mb-4">
                          {config.description}
                        </p>
                        <div className="flex items-center justify-center gap-2 text-primary">
                          <span className="text-sm font-medium">View Resources</span>
                          <ChevronRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>
                );
              })}
            </div>
          </motion.div>
        )}

        {/* Resource List */}
        {selectedSubject && selectedChapter && selectedCategory && (
          <motion.div
            key="resources"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.3 }}
            className="space-y-6"
          >
            <div className="flex items-center gap-3 mb-6">
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={resetToCategories}
                className="gap-2"
              >
                <ArrowLeft className="h-4 w-4" />
                Back to Categories
              </Button>
              <div className="h-6 w-px bg-border" />
              <div className="flex items-center gap-2">
                <div className={`w-8 h-8 rounded-full bg-gradient-to-r ${resourceCategoryConfig[selectedCategory as keyof typeof resourceCategoryConfig].gradient} flex items-center justify-center`}>
                  {React.createElement(resourceCategoryConfig[selectedCategory as keyof typeof resourceCategoryConfig].icon, { className: "h-4 w-4 text-white" })}
                </div>
                <h2 className="text-2xl font-semibold capitalize">{selectedCategory} Resources</h2>
              </div>
            </div>

            {currentResources.length > 0 ? (
              <div className="grid lg:grid-cols-2 gap-6">
                {currentResources.map((resource, index) => (
                  <motion.div
                    key={resource.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1, duration: 0.3 }}
                  >
                    <Card className="group hover:shadow-lg transition-all duration-300 overflow-hidden">
                      {resource.thumbnail && (
                        <div className="h-48 overflow-hidden">
                          <img 
                            src={resource.thumbnail} 
                            alt={resource.title}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                          />
                        </div>
                      )}
                      <CardContent className="p-6">
                        <div className="flex items-start justify-between mb-3">
                          <div className="flex items-center gap-2">
                            {resource.type === 'video' && <Video className="h-4 w-4 text-red-500" />}
                            {resource.type === 'pdf' && <FileText className="h-4 w-4 text-blue-500" />}
                            {resource.type === 'test' && <TestTube className="h-4 w-4 text-purple-500" />}
                            {resource.type === 'notes' && <BookCheck className="h-4 w-4 text-green-500" />}
                            <Badge variant="outline" className="capitalize">
                              {resource.type}
                            </Badge>
                          </div>
                          <Badge 
                            variant="secondary"
                            className={
                              resource.difficulty === 'beginner' ? 'bg-green-100 text-green-700' :
                              resource.difficulty === 'intermediate' ? 'bg-yellow-100 text-yellow-700' :
                              'bg-red-100 text-red-700'
                            }
                          >
                            {resource.difficulty}
                          </Badge>
                        </div>
                        
                        <h3 className="font-semibold text-lg mb-2">{resource.title}</h3>
                        <p className="text-sm text-muted-foreground mb-4">
                          {resource.description}
                        </p>
                        
                        <div className="flex items-center justify-between">
                          <div className="text-xs text-muted-foreground">
                            <div>Source: {resource.source}</div>
                            {resource.duration && (
                              <div className="flex items-center gap-1 mt-1">
                                <Clock className="h-3 w-3" />
                                {resource.duration}
                              </div>
                            )}
                          </div>
                          
                          <Button 
                            size="sm"
                            onClick={() => handleResourceAccess(resource)}
                            className="gap-2"
                          >
                            {resource.type === 'video' ? <Play className="h-4 w-4" /> : <Download className="h-4 w-4" />}
                            {resource.type === 'video' ? 'Watch' : 'Access'}
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <div className="text-6xl mb-4">📚</div>
                <h3 className="text-lg font-medium mb-2">No resources available</h3>
                <p className="text-muted-foreground">
                  Resources for this category will be added soon.
                </p>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default LearningResourcesPage;
