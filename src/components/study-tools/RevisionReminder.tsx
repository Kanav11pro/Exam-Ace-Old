
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Checkbox } from '@/components/ui/checkbox';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/components/ui/use-toast';
import { format, addDays, isBefore, parseISO, differenceInDays, isToday, isPast, addWeeks } from 'date-fns';
import { CalendarDays, Clock, Trash2, Plus, CalendarClock, BellRing, CheckCircle2, ChevronDown, ChevronUp, Calendar as CalendarIcon, BookOpen, BrainCircuit, Flame } from 'lucide-react';

// Define revision item type
interface RevisionItem {
  id: string;
  subject: string;
  chapter: string;
  title: string;
  notes?: string;
  initialDate: string; // ISO date
  revisionDates: string[]; // Array of ISO dates
  completedRevisions: string[]; // Array of ISO dates
  importance: 'low' | 'medium' | 'high';
  active: boolean;
}

// Spaced repetition intervals (in days)
const SPACED_REPETITION_INTERVALS = [1, 3, 7, 14, 30, 60, 90];

export function RevisionReminder() {
  const [revisionItems, setRevisionItems] = useState<RevisionItem[]>([]);
  const [filteredItems, setFilteredItems] = useState<RevisionItem[]>([]);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [filterType, setFilterType] = useState<'all' | 'due' | 'upcoming' | 'completed'>('due');
  const [subjectFilter, setSubjectFilter] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [expandedItemId, setExpandedItemId] = useState<string | null>(null);
  
  // New revision item form state
  const [newItem, setNewItem] = useState<Omit<RevisionItem, 'id' | 'revisionDates' | 'completedRevisions' | 'active'>>({
    subject: 'Maths',
    chapter: '',
    title: '',
    notes: '',
    initialDate: new Date().toISOString(),
    importance: 'medium',
  });
  
  const { toast } = useToast();
  
  // Load revision items from localStorage
  useEffect(() => {
    const savedItems = localStorage.getItem('jeeRevisionItems');
    if (savedItems) {
      try {
        setRevisionItems(JSON.parse(savedItems));
      } catch (e) {
        console.error('Error loading revision items:', e);
        setRevisionItems([]);
      }
    }
  }, []);
  
  // Save revision items to localStorage
  useEffect(() => {
    if (revisionItems.length > 0) {
      localStorage.setItem('jeeRevisionItems', JSON.stringify(revisionItems));
    }
  }, [revisionItems]);
  
  // Apply filters to items
  useEffect(() => {
    let filtered = [...revisionItems];
    
    // Apply subject filter
    if (subjectFilter !== 'all') {
      filtered = filtered.filter(item => item.subject === subjectFilter);
    }
    
    // Apply search query
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(item => 
        item.title.toLowerCase().includes(query) ||
        item.chapter.toLowerCase().includes(query) ||
        (item.notes && item.notes.toLowerCase().includes(query))
      );
    }
    
    // Apply status filter
    if (filterType === 'due') {
      filtered = filtered.filter(item => {
        if (!item.active) return false;
        
        // Check if there are due revisions
        const dueRevisions = item.revisionDates.filter(date => {
          const revisionDate = parseISO(date);
          return isPast(revisionDate) && !item.completedRevisions.includes(date);
        });
        
        return dueRevisions.length > 0;
      });
    } else if (filterType === 'upcoming') {
      filtered = filtered.filter(item => {
        if (!item.active) return false;
        
        // Check if there are upcoming revisions in next 7 days
        const upcomingRevisions = item.revisionDates.filter(date => {
          const revisionDate = parseISO(date);
          return !isPast(revisionDate) && differenceInDays(revisionDate, new Date()) <= 7;
        });
        
        return upcomingRevisions.length > 0;
      });
    } else if (filterType === 'completed') {
      filtered = filtered.filter(item => {
        // Find next revision date
        const nextRevisionIndex = item.revisionDates.findIndex(date => !item.completedRevisions.includes(date));
        
        // If all revisions are completed
        return nextRevisionIndex === -1 && item.revisionDates.length > 0 && item.completedRevisions.length > 0;
      });
    }
    
    // Sort items based on next revision date
    filtered.sort((a, b) => {
      // Find next revision dates
      const aNextRevision = a.revisionDates.find(date => !a.completedRevisions.includes(date));
      const bNextRevision = b.revisionDates.find(date => !b.completedRevisions.includes(date));
      
      // If a has no next revision, but b does, b comes first
      if (!aNextRevision && bNextRevision) return 1;
      
      // If b has no next revision, but a does, a comes first
      if (aNextRevision && !bNextRevision) return -1;
      
      // If neither has next revisions, sort by initial date (newest first)
      if (!aNextRevision && !bNextRevision) {
        return new Date(b.initialDate).getTime() - new Date(a.initialDate).getTime();
      }
      
      // Sort by next revision date
      return new Date(aNextRevision!).getTime() - new Date(bNextRevision!).getTime();
    });
    
    setFilteredItems(filtered);
  }, [revisionItems, subjectFilter, searchQuery, filterType]);
  
  // Generate revision dates based on spaced repetition
  const generateRevisionDates = (initialDate: Date): string[] => {
    return SPACED_REPETITION_INTERVALS.map(interval => 
      addDays(initialDate, interval).toISOString()
    );
  };
  
  // Add a new revision item
  const addRevisionItem = () => {
    if (!newItem.title.trim() || !newItem.chapter.trim()) {
      toast({
        title: "Missing information",
        description: "Please provide both a title and chapter",
        variant: "destructive",
      });
      return;
    }
    
    const initialDate = parseISO(newItem.initialDate);
    const revisionDates = generateRevisionDates(initialDate);
    
    const newRevisionItem: RevisionItem = {
      id: Date.now().toString(),
      ...newItem,
      revisionDates,
      completedRevisions: [],
      active: true,
    };
    
    setRevisionItems(prev => [...prev, newRevisionItem]);
    setIsAddDialogOpen(false);
    
    // Reset form
    setNewItem({
      subject: 'Maths',
      chapter: '',
      title: '',
      notes: '',
      initialDate: new Date().toISOString(),
      importance: 'medium',
    });
    
    toast({
      title: "Revision scheduled",
      description: "Your topic has been added to the revision schedule",
    });
  };
  
  // Mark a specific revision as completed
  const markRevisionCompleted = (itemId: string, revisionDate: string) => {
    setRevisionItems(prev => prev.map(item => {
      if (item.id === itemId) {
        // Add the date to completed revisions if not already there
        if (!item.completedRevisions.includes(revisionDate)) {
          return {
            ...item,
            completedRevisions: [...item.completedRevisions, revisionDate]
          };
        }
      }
      return item;
    }));
    
    toast({
      title: "Revision completed",
      description: "Keep up the good work!",
    });
  };
  
  // Mark a specific revision as incomplete (undo completion)
  const markRevisionIncomplete = (itemId: string, revisionDate: string) => {
    setRevisionItems(prev => prev.map(item => {
      if (item.id === itemId) {
        return {
          ...item,
          completedRevisions: item.completedRevisions.filter(date => date !== revisionDate)
        };
      }
      return item;
    }));
  };
  
  // Delete a revision item
  const deleteRevisionItem = (id: string) => {
    setRevisionItems(prev => prev.filter(item => item.id !== id));
    
    toast({
      title: "Item removed",
      description: "The revision item has been deleted",
    });
  };
  
  // Toggle active status
  const toggleActiveStatus = (id: string) => {
    setRevisionItems(prev => prev.map(item => {
      if (item.id === id) {
        return {
          ...item,
          active: !item.active
        };
      }
      return item;
    }));
    
    toast({
      title: "Status updated",
      description: "The revision status has been updated",
    });
  };
  
  // Format date for display
  const formatDate = (dateString: string) => {
    return format(parseISO(dateString), 'MMM d, yyyy');
  };
  
  // Calculate revision status
  const getRevisionStatus = (item: RevisionItem) => {
    // Find the next revision date that hasn't been completed
    const nextRevisionDate = item.revisionDates.find(date => !item.completedRevisions.includes(date));
    
    if (!nextRevisionDate) {
      return 'completed';
    }
    
    const nextDate = parseISO(nextRevisionDate);
    
    if (isToday(nextDate)) {
      return 'today';
    } else if (isPast(nextDate)) {
      return 'overdue';
    } else {
      return 'upcoming';
    }
  };
  
  // Get style for revision status
  const getStatusStyle = (status: string) => {
    switch (status) {
      case 'overdue':
        return 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300';
      case 'today':
        return 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300';
      case 'upcoming':
        return 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300';
      case 'completed':
        return 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300';
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300';
    }
  };
  
  // Get style for importance
  const getImportanceStyle = (importance: string) => {
    switch (importance) {
      case 'high':
        return 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300';
      case 'medium':
        return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300';
      case 'low':
        return 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300';
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300';
    }
  };
  
  // Calculate completion percentage
  const calculateCompletionPercentage = (item: RevisionItem) => {
    if (item.revisionDates.length === 0) return 0;
    return Math.round((item.completedRevisions.length / item.revisionDates.length) * 100);
  };
  
  // Find next revision date
  const getNextRevisionDate = (item: RevisionItem) => {
    const nextRevision = item.revisionDates.find(date => !item.completedRevisions.includes(date));
    return nextRevision ? parseISO(nextRevision) : null;
  };
  
  // Toggle expansion of an item
  const toggleItemExpansion = (id: string) => {
    setExpandedItemId(expandedItemId === id ? null : id);
  };
  
  return (
    <div className="container max-w-6xl py-6">
      <div className="mb-6">
        <h1 className="text-3xl font-bold mb-2">Revision Reminder</h1>
        <p className="text-gray-600 dark:text-gray-300">
          Schedule your revision based on the proven spaced repetition technique
        </p>
      </div>
      
      <div className="flex flex-col md:flex-row gap-4 justify-between items-start mb-6">
        <Tabs 
          defaultValue="due" 
          onValueChange={(value) => setFilterType(value as 'all' | 'due' | 'upcoming' | 'completed')}
          className="w-full md:w-auto"
        >
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="all">All</TabsTrigger>
            <TabsTrigger value="due">Due</TabsTrigger>
            <TabsTrigger value="upcoming">Upcoming</TabsTrigger>
            <TabsTrigger value="completed">Completed</TabsTrigger>
          </TabsList>
        </Tabs>
        
        <div className="flex flex-col sm:flex-row gap-2 w-full md:w-auto">
          <Input 
            placeholder="Search topics..." 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full sm:w-60"
          />
          <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="mr-2 h-4 w-4" /> Add Topic
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-lg">
              <DialogHeader>
                <DialogTitle>Add New Revision Topic</DialogTitle>
                <DialogDescription>
                  Add a new topic to your spaced repetition schedule
                </DialogDescription>
              </DialogHeader>
              
              <div className="grid gap-4 py-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="grid gap-2">
                    <label htmlFor="revision-subject" className="text-sm font-medium">Subject</label>
                    <Select
                      value={newItem.subject}
                      onValueChange={(value) => setNewItem({...newItem, subject: value})}
                    >
                      <SelectTrigger id="revision-subject">
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
                    <label htmlFor="revision-chapter" className="text-sm font-medium">Chapter/Topic</label>
                    <Input
                      id="revision-chapter"
                      value={newItem.chapter}
                      onChange={(e) => setNewItem({...newItem, chapter: e.target.value})}
                      placeholder="E.g., Integration, Kinematics"
                    />
                  </div>
                </div>
                
                <div className="grid gap-2">
                  <label htmlFor="revision-title" className="text-sm font-medium">Title</label>
                  <Input
                    id="revision-title"
                    value={newItem.title}
                    onChange={(e) => setNewItem({...newItem, title: e.target.value})}
                    placeholder="E.g., Integration by Parts, Projectile Motion"
                  />
                </div>
                
                <div className="grid gap-2">
                  <label htmlFor="revision-notes" className="text-sm font-medium">Notes (Optional)</label>
                  <Textarea
                    id="revision-notes"
                    value={newItem.notes || ''}
                    onChange={(e) => setNewItem({...newItem, notes: e.target.value})}
                    placeholder="Add details about what you need to revise"
                    rows={3}
                  />
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="grid gap-2">
                    <label htmlFor="revision-date" className="text-sm font-medium">Initial Study Date</label>
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button
                          variant="outline"
                          className="w-full justify-start text-left font-normal"
                        >
                          <CalendarIcon className="mr-2 h-4 w-4" />
                          {format(parseISO(newItem.initialDate), 'PPP')}
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0">
                        <Calendar
                          mode="single"
                          selected={parseISO(newItem.initialDate)}
                          onSelect={(date) => setNewItem({...newItem, initialDate: (date || new Date()).toISOString()})}
                          initialFocus
                        />
                      </PopoverContent>
                    </Popover>
                  </div>
                  
                  <div className="grid gap-2">
                    <label htmlFor="revision-importance" className="text-sm font-medium">Importance</label>
                    <Select
                      value={newItem.importance}
                      onValueChange={(value: 'low' | 'medium' | 'high') => setNewItem({...newItem, importance: value})}
                    >
                      <SelectTrigger id="revision-importance">
                        <SelectValue placeholder="Select importance" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="low">Low - Review when time permits</SelectItem>
                        <SelectItem value="medium">Medium - Important concept</SelectItem>
                        <SelectItem value="high">High - Critical for exam</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </div>
              
              <DialogFooter>
                <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>
                  Cancel
                </Button>
                <Button onClick={addRevisionItem}>
                  Schedule Revisions
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </div>
      
      {/* Subject filter */}
      <div className="mb-6">
        <Select value={subjectFilter} onValueChange={setSubjectFilter}>
          <SelectTrigger className="w-full md:w-48">
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
      
      {filteredItems.length > 0 ? (
        <div className="space-y-4">
          {filteredItems.map(item => {
            const status = getRevisionStatus(item);
            const nextRevisionDate = getNextRevisionDate(item);
            const completionPercentage = calculateCompletionPercentage(item);
            
            return (
              <Card 
                key={item.id} 
                className={`overflow-hidden ${!item.active ? 'opacity-60' : ''} ${
                  status === 'overdue' && item.active ? 'border-red-300 dark:border-red-700' : ''
                }`}
              >
                <CardContent className="p-0">
                  <div 
                    className="p-4 cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-900/10"
                    onClick={() => toggleItemExpansion(item.id)}
                  >
                    <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-2 mb-2">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <div className={`px-2 py-0.5 text-xs rounded-full ${getImportanceStyle(item.importance)}`}>
                            {item.importance.charAt(0).toUpperCase() + item.importance.slice(1)} Priority
                          </div>
                          <div className={`px-2 py-0.5 text-xs rounded-full ${getStatusStyle(status)}`}>
                            {status === 'overdue' ? 'Overdue' : 
                             status === 'today' ? 'Due Today' : 
                             status === 'upcoming' ? 'Upcoming' : 'Completed'}
                          </div>
                        </div>
                        
                        <h3 className="font-semibold text-lg">{item.title}</h3>
                        
                        <div className="flex items-center text-sm text-gray-600 dark:text-gray-300 mt-1">
                          <span className="font-medium">{item.subject}</span>
                          <span className="mx-2">•</span>
                          <span>{item.chapter}</span>
                        </div>
                      </div>
                      
                      <div className="flex items-center mt-1 sm:mt-0">
                        <div className="text-sm text-gray-500 dark:text-gray-400 mr-4">
                          {completionPercentage}% Complete
                        </div>
                        
                        <Button
                          variant="outline"
                          size="sm"
                          className={`mr-2 ${!item.active ? 'bg-gray-100 dark:bg-gray-800' : ''}`}
                          onClick={(e) => {
                            e.stopPropagation();
                            toggleActiveStatus(item.id);
                          }}
                        >
                          {item.active ? 'Active' : 'Paused'}
                        </Button>
                        
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8 text-red-500 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20"
                          onClick={(e) => {
                            e.stopPropagation();
                            deleteRevisionItem(item.id);
                          }}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                    
                    <div className="mt-3 flex justify-between items-center">
                      <div className="text-sm">
                        <span className="text-gray-500 dark:text-gray-400">Initial study: </span>
                        <span>{formatDate(item.initialDate)}</span>
                        
                        {nextRevisionDate && (
                          <>
                            <span className="mx-2">•</span>
                            <span className="text-gray-500 dark:text-gray-400">Next revision: </span>
                            <span>{formatDate(nextRevisionDate.toISOString())}</span>
                          </>
                        )}
                      </div>
                      
                      <div>
                        {expandedItemId === item.id ? (
                          <ChevronUp className="h-4 w-4 text-gray-400" />
                        ) : (
                          <ChevronDown className="h-4 w-4 text-gray-400" />
                        )}
                      </div>
                    </div>
                  </div>
                  
                  {/* Expanded content */}
                  {expandedItemId === item.id && (
                    <div className="p-4 pt-0 border-t mt-2 animate-fade-in">
                      {item.notes && (
                        <div className="mb-4">
                          <h4 className="text-sm font-medium mb-1">Notes</h4>
                          <p className="text-sm text-gray-600 dark:text-gray-300 whitespace-pre-line">
                            {item.notes}
                          </p>
                        </div>
                      )}
                      
                      <h4 className="text-sm font-medium mb-3">Revision Schedule</h4>
                      <div className="space-y-2">
                        {item.revisionDates.map((date, index) => {
                          const revisionDate = parseISO(date);
                          const isCompleted = item.completedRevisions.includes(date);
                          const isPastDue = isPast(revisionDate) && !isCompleted;
                          const isDueToday = isToday(revisionDate) && !isCompleted;
                          
                          return (
                            <div 
                              key={date} 
                              className={`flex items-center justify-between p-2 rounded ${
                                isCompleted ? 'bg-gray-50 dark:bg-gray-800/50' : 
                                isPastDue ? 'bg-red-50 dark:bg-red-900/10' :
                                isDueToday ? 'bg-green-50 dark:bg-green-900/10' : ''
                              }`}
                            >
                              <div className="flex items-center">
                                <div className="w-6 h-6 flex items-center justify-center mr-3">
                                  {isCompleted ? (
                                    <CheckCircle2 className="h-5 w-5 text-green-500" />
                                  ) : (
                                    <span className="w-5 h-5 rounded-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center text-xs">
                                      {index + 1}
                                    </span>
                                  )}
                                </div>
                                
                                <div>
                                  <div className="text-sm font-medium">
                                    {formatDate(date)}
                                    {isDueToday && (
                                      <span className="ml-2 text-green-600 dark:text-green-400 text-xs">
                                        Today
                                      </span>
                                    )}
                                    {isPastDue && (
                                      <span className="ml-2 text-red-600 dark:text-red-400 text-xs">
                                        Overdue
                                      </span>
                                    )}
                                  </div>
                                  
                                  <div className="text-xs text-gray-500 dark:text-gray-400">
                                    {index === 0 ? '1 day after initial study' : 
                                     index === 1 ? '3 days after initial study' :
                                     index === 2 ? '1 week after initial study' :
                                     index === 3 ? '2 weeks after initial study' :
                                     index === 4 ? '1 month after initial study' :
                                     index === 5 ? '2 months after initial study' :
                                     '3 months after initial study'}
                                  </div>
                                </div>
                              </div>
                              
                              {!isCompleted && (
                                <Button
                                  variant="outline"
                                  size="sm"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    markRevisionCompleted(item.id, date);
                                  }}
                                  className={isDueToday || isPastDue ? 'border-green-200 text-green-600 hover:bg-green-50 hover:text-green-700 dark:border-green-800 dark:text-green-400 dark:hover:bg-green-900/20' : ''}
                                >
                                  Mark Complete
                                </Button>
                              )}
                              
                              {isCompleted && (
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    markRevisionIncomplete(item.id, date);
                                  }}
                                >
                                  Undo
                                </Button>
                              )}
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            );
          })}
        </div>
      ) : (
        <div className="text-center py-12 bg-gray-50 dark:bg-gray-800/50 rounded-lg">
          <CalendarDays className="h-12 w-12 text-gray-300 mx-auto mb-4" />
          <h3 className="text-lg font-medium mb-2">No revision items found</h3>
          <p className="text-gray-500 dark:text-gray-400 mb-4">
            {searchQuery || subjectFilter !== 'all' || filterType !== 'all' 
              ? 'Try changing your search filters'
              : 'Add your first topic to start with spaced repetition'}
          </p>
          <Button onClick={() => setIsAddDialogOpen(true)}>
            <Plus className="mr-2 h-4 w-4" /> Add Your First Topic
          </Button>
        </div>
      )}
      
      {revisionItems.length > 0 && (
        <div className="mt-8 grid grid-cols-1 lg:grid-cols-3 gap-6">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-lg flex items-center">
                <CalendarClock className="mr-2 h-5 w-5" /> 
                About Spaced Repetition
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-gray-600 dark:text-gray-300 mb-4">
                Spaced repetition is scientifically proven to help you remember information for longer periods by reviewing material at increasing intervals.
              </p>
              
              <div className="text-sm space-y-2">
                <div className="flex items-center gap-2">
                  <div className="w-5 h-5 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center text-xs text-blue-600 dark:text-blue-300">
                    1
                  </div>
                  <span>First review: 1 day after learning</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-5 h-5 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center text-xs text-blue-600 dark:text-blue-300">
                    2
                  </div>
                  <span>Second review: 3 days after learning</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-5 h-5 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center text-xs text-blue-600 dark:text-blue-300">
                    3
                  </div>
                  <span>Third review: 7 days after learning</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-5 h-5 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center text-xs text-blue-600 dark:text-blue-300">
                    4
                  </div>
                  <span>Fourth review: 14 days after learning</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-5 h-5 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center text-xs text-blue-600 dark:text-blue-300">
                    5+
                  </div>
                  <span>Further reviews: 30, 60, 90 days later</span>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-lg flex items-center">
                <BrainCircuit className="mr-2 h-5 w-5" /> 
                Revision Statistics
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600 dark:text-gray-300">Total Topics:</span>
                  <span className="font-medium">{revisionItems.length}</span>
                </div>
                
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600 dark:text-gray-300">Active Topics:</span>
                  <span className="font-medium">{revisionItems.filter(item => item.active).length}</span>
                </div>
                
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600 dark:text-gray-300">Completed Topics:</span>
                  <span className="font-medium">
                    {revisionItems.filter(item => {
                      const nextRevision = item.revisionDates.find(date => !item.completedRevisions.includes(date));
                      return !nextRevision && item.revisionDates.length > 0;
                    }).length}
                  </span>
                </div>
                
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600 dark:text-gray-300">Overdue Revisions:</span>
                  <span className="font-medium">
                    {revisionItems.filter(item => {
                      if (!item.active) return false;
                      const overdueRevisions = item.revisionDates.filter(date => {
                        const revisionDate = parseISO(date);
                        return isPast(revisionDate) && !isToday(revisionDate) && !item.completedRevisions.includes(date);
                      });
                      return overdueRevisions.length > 0;
                    }).length}
                  </span>
                </div>
                
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600 dark:text-gray-300">Due Today:</span>
                  <span className="font-medium">
                    {revisionItems.filter(item => {
                      if (!item.active) return false;
                      const dueTodayRevisions = item.revisionDates.filter(date => {
                        const revisionDate = parseISO(date);
                        return isToday(revisionDate) && !item.completedRevisions.includes(date);
                      });
                      return dueTodayRevisions.length > 0;
                    }).length}
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-lg flex items-center">
                <Flame className="mr-2 h-5 w-5" /> 
                Effective Revision Tips
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="text-sm text-gray-600 dark:text-gray-300 space-y-2">
                <li className="flex items-start">
                  <span className="mr-2">•</span>
                  When revising, actively recall information before checking notes
                </li>
                <li className="flex items-start">
                  <span className="mr-2">•</span>
                  Explain concepts out loud as if teaching someone else
                </li>
                <li className="flex items-start">
                  <span className="mr-2">•</span>
                  Focus on understanding rather than memorizing
                </li>
                <li className="flex items-start">
                  <span className="mr-2">•</span>
                  Connect new information to things you already know
                </li>
                <li className="flex items-start">
                  <span className="mr-2">•</span>
                  Practice solving problems without looking at solutions
                </li>
                <li className="flex items-start">
                  <span className="mr-2">•</span>
                  Take short breaks between revision sessions for better retention
                </li>
              </ul>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}
