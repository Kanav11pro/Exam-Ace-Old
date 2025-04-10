
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/components/ui/use-toast';
import { AlertTriangle, Search, Plus, BookOpen, Trash2, X, Check, FileQuestion, Star, CheckCircle, BugOff } from 'lucide-react';
import { format, parseISO } from 'date-fns';

// Define types
interface ErrorItem {
  id: string;
  subject: string;
  chapter: string;
  title: string;
  description: string;
  solution: string;
  difficulty: 'easy' | 'medium' | 'hard';
  status: 'unsolved' | 'solved';
  tags: string[];
  date: string; // ISO string
  dateResolved?: string; // ISO string
}

// Define difficulty colors
const difficultyColors = {
  easy: 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300',
  medium: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300',
  hard: 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300'
};

// Topics array for tags
const topics = [
  'Concept Error', 'Calculation Mistake', 'Formula Application', 
  'Problem Solving', 'Conceptual Gap', 'Silly Mistake',
  'Complex Problem', 'Time Pressure Error', 'Exam Strategy',
  'Careless Error', 'Interpretation Error'
];

export function ErrorLog() {
  const [errors, setErrors] = useState<ErrorItem[]>([]);
  const [filteredErrors, setFilteredErrors] = useState<ErrorItem[]>([]);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [subjectFilter, setSubjectFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');
  const [expandedErrorId, setExpandedErrorId] = useState<string | null>(null);
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  
  // New error form state
  const [newError, setNewError] = useState<Omit<ErrorItem, 'id' | 'date' | 'status'>>({
    subject: 'Maths',
    chapter: '',
    title: '',
    description: '',
    solution: '',
    difficulty: 'medium',
    tags: [],
  });
  
  const { toast } = useToast();
  
  // Load saved errors from localStorage
  useEffect(() => {
    const savedErrors = localStorage.getItem('jeeErrorLog');
    if (savedErrors) {
      try {
        setErrors(JSON.parse(savedErrors));
      } catch (e) {
        console.error('Error loading error log:', e);
        setErrors([]);
      }
    }
  }, []);
  
  // Save errors to localStorage when they change
  useEffect(() => {
    if (errors.length > 0) {
      localStorage.setItem('jeeErrorLog', JSON.stringify(errors));
    }
  }, [errors]);
  
  // Apply filters to errors
  useEffect(() => {
    let filtered = [...errors];
    
    // Apply subject filter
    if (subjectFilter !== 'all') {
      filtered = filtered.filter(error => error.subject === subjectFilter);
    }
    
    // Apply status filter
    if (statusFilter !== 'all') {
      filtered = filtered.filter(error => error.status === statusFilter);
    }
    
    // Apply tag filters
    if (selectedTags.length > 0) {
      filtered = filtered.filter(error => 
        selectedTags.some(tag => error.tags.includes(tag))
      );
    }
    
    // Apply search query
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(error => 
        error.title.toLowerCase().includes(query) ||
        error.description.toLowerCase().includes(query) ||
        error.solution.toLowerCase().includes(query) ||
        error.chapter.toLowerCase().includes(query)
      );
    }
    
    // Sort by date (newest first)
    filtered.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
    
    setFilteredErrors(filtered);
  }, [errors, subjectFilter, statusFilter, searchQuery, selectedTags]);
  
  // Add a new error
  const addError = () => {
    if (!newError.title.trim()) {
      toast({
        title: "Title required",
        description: "Please enter a title for your error log",
        variant: "destructive",
      });
      return;
    }
    
    const newErrorComplete: ErrorItem = {
      id: Date.now().toString(),
      ...newError,
      status: 'unsolved',
      date: new Date().toISOString(),
    };
    
    setErrors(prev => [newErrorComplete, ...prev]);
    setIsAddDialogOpen(false);
    
    // Reset form
    setNewError({
      subject: 'Maths',
      chapter: '',
      title: '',
      description: '',
      solution: '',
      difficulty: 'medium',
      tags: [],
    });
    
    toast({
      title: "Error logged",
      description: "Your mistake has been added to your error log for review",
    });
  };
  
  // Delete an error
  const deleteError = (id: string) => {
    setErrors(prev => prev.filter(error => error.id !== id));
    toast({
      title: "Error removed",
      description: "The error has been deleted from your log",
    });
  };
  
  // Toggle error solved status
  const toggleErrorStatus = (id: string) => {
    setErrors(prev => prev.map(error => {
      if (error.id === id) {
        const newStatus = error.status === 'unsolved' ? 'solved' : 'unsolved';
        return {
          ...error,
          status: newStatus,
          dateResolved: newStatus === 'solved' ? new Date().toISOString() : undefined
        };
      }
      return error;
    }));
    
    toast({
      title: "Status updated",
      description: "Error status has been updated",
    });
  };
  
  // Update an error solution
  const updateSolution = (id: string, solution: string) => {
    setErrors(prev => prev.map(error => {
      if (error.id === id) {
        return {
          ...error,
          solution,
        };
      }
      return error;
    }));
    
    toast({
      title: "Solution updated",
      description: "Your solution has been saved",
    });
  };
  
  // Toggle tag selection
  const toggleTag = (tag: string) => {
    if (selectedTags.includes(tag)) {
      setSelectedTags(prev => prev.filter(t => t !== tag));
    } else {
      setSelectedTags(prev => [...prev, tag]);
    }
  };
  
  // Toggle tag in new error form
  const toggleNewErrorTag = (tag: string) => {
    if (newError.tags.includes(tag)) {
      setNewError({
        ...newError,
        tags: newError.tags.filter(t => t !== tag)
      });
    } else {
      setNewError({
        ...newError,
        tags: [...newError.tags, tag]
      });
    }
  };
  
  // Handle expanding error details
  const toggleExpandError = (id: string) => {
    setExpandedErrorId(expandedErrorId === id ? null : id);
  };
  
  // Format date
  const formatDate = (dateString: string) => {
    return format(parseISO(dateString), 'MMM d, yyyy');
  };
  
  return (
    <div className="container max-w-6xl py-6">
      <div className="mb-6">
        <h1 className="text-3xl font-bold mb-2">Error Log</h1>
        <p className="text-gray-600 dark:text-gray-300">
          Track your mistakes and learn from them to improve your understanding
        </p>
      </div>
      
      <div className="flex flex-col md:flex-row gap-4 justify-between items-start mb-6">
        <Tabs 
          defaultValue="all" 
          onValueChange={setStatusFilter}
          className="w-full md:w-auto"
        >
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="all">All Errors</TabsTrigger>
            <TabsTrigger value="unsolved">Unsolved</TabsTrigger>
          </TabsList>
        </Tabs>
        
        <div className="flex flex-col sm:flex-row gap-2 w-full md:w-auto">
          <Input 
            placeholder="Search errors..." 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full sm:w-60"
          />
          <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="mr-2 h-4 w-4" /> Log New Error
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl">
              <DialogHeader>
                <DialogTitle>Log a New Error or Mistake</DialogTitle>
                <DialogDescription>
                  Recording your mistakes helps identify patterns and improves your learning
                </DialogDescription>
              </DialogHeader>
              
              <div className="grid gap-4 py-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="grid gap-2">
                    <label htmlFor="error-subject" className="text-sm font-medium">Subject</label>
                    <Select
                      value={newError.subject}
                      onValueChange={(value) => setNewError({...newError, subject: value})}
                    >
                      <SelectTrigger id="error-subject">
                        <SelectValue placeholder="Select subject" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Maths">Mathematics</SelectItem>
                        <SelectItem value="Physics">Physics</SelectItem>
                        <SelectItem value="Chemistry">Chemistry</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div className="grid gap-2">
                    <label htmlFor="error-chapter" className="text-sm font-medium">Chapter/Topic</label>
                    <Input
                      id="error-chapter"
                      value={newError.chapter}
                      onChange={(e) => setNewError({...newError, chapter: e.target.value})}
                      placeholder="E.g., Integration, Kinematics"
                    />
                  </div>
                </div>
                
                <div className="grid gap-2">
                  <label htmlFor="error-title" className="text-sm font-medium">Error Title</label>
                  <Input
                    id="error-title"
                    value={newError.title}
                    onChange={(e) => setNewError({...newError, title: e.target.value})}
                    placeholder="E.g., Forgot to apply chain rule in differentiation"
                  />
                </div>
                
                <div className="grid gap-2">
                  <label htmlFor="error-description" className="text-sm font-medium">Describe the Error</label>
                  <Textarea
                    id="error-description"
                    value={newError.description}
                    onChange={(e) => setNewError({...newError, description: e.target.value})}
                    placeholder="What went wrong? Include the problem if possible."
                    rows={3}
                  />
                </div>
                
                <div className="grid gap-2">
                  <label htmlFor="error-solution" className="text-sm font-medium">Solution/Correction (Optional)</label>
                  <Textarea
                    id="error-solution"
                    value={newError.solution}
                    onChange={(e) => setNewError({...newError, solution: e.target.value})}
                    placeholder="Add the correct approach or leave blank if unsure"
                    rows={2}
                  />
                </div>
                
                <div className="grid gap-2">
                  <label htmlFor="error-difficulty" className="text-sm font-medium">Difficulty Level</label>
                  <Select
                    value={newError.difficulty}
                    onValueChange={(value: 'easy' | 'medium' | 'hard') => setNewError({...newError, difficulty: value})}
                  >
                    <SelectTrigger id="error-difficulty">
                      <SelectValue placeholder="Select difficulty" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="easy">Easy - Simple mistake</SelectItem>
                      <SelectItem value="medium">Medium - Conceptual misunderstanding</SelectItem>
                      <SelectItem value="hard">Hard - Complex problem</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="grid gap-2">
                  <label className="text-sm font-medium">Error Type Tags</label>
                  <div className="flex flex-wrap gap-2">
                    {topics.map(tag => (
                      <Badge
                        key={tag}
                        variant={newError.tags.includes(tag) ? "default" : "outline"}
                        className="cursor-pointer"
                        onClick={() => toggleNewErrorTag(tag)}
                      >
                        {tag}
                      </Badge>
                    ))}
                  </div>
                </div>
              </div>
              
              <DialogFooter>
                <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>
                  Cancel
                </Button>
                <Button onClick={addError}>
                  Log Error
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {/* Filters panel */}
        <div className="col-span-1">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-lg">Filters</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <h3 className="text-sm font-medium mb-2">Subject</h3>
                  <Select value={subjectFilter} onValueChange={setSubjectFilter}>
                    <SelectTrigger>
                      <SelectValue placeholder="Filter by subject" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Subjects</SelectItem>
                      <SelectItem value="Maths">Mathematics</SelectItem>
                      <SelectItem value="Physics">Physics</SelectItem>
                      <SelectItem value="Chemistry">Chemistry</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div>
                  <h3 className="text-sm font-medium mb-2">Error Types</h3>
                  <div className="flex flex-wrap gap-2">
                    {topics.map(tag => (
                      <Badge
                        key={tag}
                        variant={selectedTags.includes(tag) ? "default" : "outline"}
                        className="cursor-pointer text-xs"
                        onClick={() => toggleTag(tag)}
                      >
                        {tag}
                      </Badge>
                    ))}
                  </div>
                </div>
                
                {selectedTags.length > 0 && (
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    className="text-xs"
                    onClick={() => setSelectedTags([])}
                  >
                    Clear tags
                  </Button>
                )}
                
                <div className="pt-4 border-t">
                  <h3 className="text-sm font-medium mb-2">Error Log Stats</h3>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span>Total Errors:</span>
                      <span className="font-medium">{errors.length}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Solved:</span>
                      <span className="font-medium">{errors.filter(e => e.status === 'solved').length}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Unsolved:</span>
                      <span className="font-medium">{errors.filter(e => e.status === 'unsolved').length}</span>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
        
        {/* Error List */}
        <div className="col-span-1 md:col-span-3">
          {filteredErrors.length > 0 ? (
            <div className="space-y-4">
              {filteredErrors.map(error => (
                <Card key={error.id} className="overflow-hidden">
                  <CardContent className="p-0">
                    <div 
                      className={`p-4 cursor-pointer ${error.status === 'solved' ? 'bg-gray-50 dark:bg-gray-900/20' : ''}`}
                      onClick={() => toggleExpandError(error.id)}
                    >
                      <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-2 mb-2">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <div className={`px-2 py-0.5 text-xs rounded-full ${difficultyColors[error.difficulty]}`}>
                              {error.difficulty.charAt(0).toUpperCase() + error.difficulty.slice(1)}
                            </div>
                            <div className="text-xs text-gray-500 dark:text-gray-400">
                              {formatDate(error.date)}
                            </div>
                          </div>
                          
                          <h3 className="font-semibold text-lg">{error.title}</h3>
                          
                          <div className="flex items-center text-sm text-gray-600 dark:text-gray-300 mt-1">
                            <span className="font-medium">{error.subject}</span>
                            {error.chapter && (
                              <>
                                <span className="mx-2">•</span>
                                <span>{error.chapter}</span>
                              </>
                            )}
                          </div>
                        </div>
                        
                        <div className="flex items-center mt-1 sm:mt-0">
                          <div className={`px-2 py-1 text-xs rounded-full mr-2 ${
                            error.status === 'solved' 
                              ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300' 
                              : 'bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-300'
                          }`}>
                            {error.status === 'solved' ? 'Solved' : 'Unsolved'}
                          </div>
                          
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8 text-red-500 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20"
                            onClick={(e) => {
                              e.stopPropagation();
                              deleteError(error.id);
                            }}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                      
                      {error.tags.length > 0 && (
                        <div className="flex flex-wrap gap-1 mt-2">
                          {error.tags.map(tag => (
                            <span 
                              key={tag} 
                              className="text-xs px-2 py-0.5 bg-gray-100 dark:bg-gray-800 rounded-full"
                            >
                              {tag}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>
                    
                    {/* Expanded content */}
                    {expandedErrorId === error.id && (
                      <div className="p-4 pt-0 border-t mt-2 animate-fade-in">
                        <div className="grid gap-4">
                          <div>
                            <h4 className="text-sm font-medium mb-1">Error Description</h4>
                            <p className="text-sm text-gray-600 dark:text-gray-300 whitespace-pre-line">
                              {error.description || "No description provided."}
                            </p>
                          </div>
                          
                          <div>
                            <h4 className="text-sm font-medium mb-1">Solution</h4>
                            {error.solution ? (
                              <p className="text-sm text-gray-600 dark:text-gray-300 whitespace-pre-line">
                                {error.solution}
                              </p>
                            ) : (
                              <div className="flex flex-col gap-2">
                                <p className="text-sm text-gray-500 dark:text-gray-400 italic">
                                  No solution added yet.
                                </p>
                                <Textarea
                                  placeholder="Add your solution or correction here..."
                                  className="min-h-[80px]"
                                  value={error.solution}
                                  onChange={(e) => updateSolution(error.id, e.target.value)}
                                />
                                <Button 
                                  variant="outline" 
                                  size="sm" 
                                  className="self-end mt-1"
                                  onClick={() => updateSolution(error.id, error.solution)}
                                >
                                  Save Solution
                                </Button>
                              </div>
                            )}
                          </div>
                          
                          <div className="flex justify-end pt-2 border-t">
                            <Button
                              variant={error.status === 'solved' ? 'outline' : 'default'}
                              size="sm"
                              onClick={() => toggleErrorStatus(error.id)}
                              className={error.status === 'solved' ? '' : 'bg-green-600 hover:bg-green-700'}
                            >
                              {error.status === 'solved' ? (
                                <>
                                  <X className="h-4 w-4 mr-1" /> Mark as Unsolved
                                </>
                              ) : (
                                <>
                                  <Check className="h-4 w-4 mr-1" /> Mark as Solved
                                </>
                              )}
                            </Button>
                          </div>
                        </div>
                      </div>
                    )}
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <div className="text-center py-12 bg-gray-50 dark:bg-gray-800/50 rounded-lg">
              <AlertTriangle className="h-12 w-12 text-gray-300 mx-auto mb-4" />
              <h3 className="text-lg font-medium mb-2">No errors found</h3>
              <p className="text-gray-500 dark:text-gray-400 mb-4">
                {searchQuery || subjectFilter !== 'all' || statusFilter !== 'all' || selectedTags.length > 0 
                  ? 'Try changing your search filters'
                  : 'Start tracking your mistakes to improve your learning'}
              </p>
              <Button onClick={() => setIsAddDialogOpen(true)}>
                <Plus className="mr-2 h-4 w-4" /> Log Your First Error
              </Button>
            </div>
          )}
        </div>
      </div>
      
      {errors.length > 0 && (
        <div className="mt-8">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle>Learning From Your Mistakes</CardTitle>
              <CardDescription>
                Tips to help you avoid making the same errors in the future
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <div className="bg-purple-100 dark:bg-purple-900/30 p-2 rounded-full">
                    <BookOpen className="h-5 w-5 text-purple-600 dark:text-purple-300" />
                  </div>
                  <div>
                    <h3 className="font-medium">Review Regularly</h3>
                    <p className="text-sm text-gray-600 dark:text-gray-300">
                      Set aside time each week to review your error log and reinforce correct approaches.
                    </p>
                  </div>
                </div>
                
                <div className="flex items-start gap-3">
                  <div className="bg-blue-100 dark:bg-blue-900/30 p-2 rounded-full">
                    <FileQuestion className="h-5 w-5 text-blue-600 dark:text-blue-300" />
                  </div>
                  <div>
                    <h3 className="font-medium">Look for Patterns</h3>
                    <p className="text-sm text-gray-600 dark:text-gray-300">
                      Identify repeated mistake types to focus your study efforts on problem areas.
                    </p>
                  </div>
                </div>
                
                <div className="flex items-start gap-3">
                  <div className="bg-green-100 dark:bg-green-900/30 p-2 rounded-full">
                    <CheckCircle className="h-5 w-5 text-green-600 dark:text-green-300" />
                  </div>
                  <div>
                    <h3 className="font-medium">Practice Similar Problems</h3>
                    <p className="text-sm text-gray-600 dark:text-gray-300">
                      For each error, find and solve similar problems to reinforce the correct approach.
                    </p>
                  </div>
                </div>
                
                <div className="flex items-start gap-3">
                  <div className="bg-amber-100 dark:bg-amber-900/30 p-2 rounded-full">
                    <Star className="h-5 w-5 text-amber-600 dark:text-amber-300" />
                  </div>
                  <div>
                    <h3 className="font-medium">Create Reminder Notes</h3>
                    <p className="text-sm text-gray-600 dark:text-gray-300">
                      Make quick reference cards for frequently forgotten formulas or concepts.
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}
