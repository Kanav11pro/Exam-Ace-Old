
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Checkbox } from '@/components/ui/checkbox';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { format } from 'date-fns';
import { useToast } from '@/components/ui/use-toast';
import { Calendar as CalendarIcon, Trash2, Plus, Clock, AlertTriangle, CheckCircle2 } from 'lucide-react';

// Define backlog item types
type Priority = 'low' | 'medium' | 'high' | 'critical';
type Status = 'pending' | 'in-progress' | 'completed' | 'deferred';

interface BacklogItem {
  id: string;
  title: string;
  description: string;
  subject: string;
  chapter?: string;
  priority: Priority;
  status: Status;
  dueDate: Date | null;
  createdAt: Date;
  completedAt: Date | null;
}

export function BacklogManagement() {
  // State for backlog items
  const [backlogItems, setBacklogItems] = useState<BacklogItem[]>([]);
  const [filteredItems, setFilteredItems] = useState<BacklogItem[]>([]);
  
  // State for filters
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [subjectFilter, setSubjectFilter] = useState<string>('all');
  const [priorityFilter, setPriorityFilter] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  
  // State for new item form
  const [showAddForm, setShowAddForm] = useState(false);
  const [newItem, setNewItem] = useState<Omit<BacklogItem, 'id' | 'createdAt' | 'completedAt'>>({
    title: '',
    description: '',
    subject: 'Maths',
    chapter: '',
    priority: 'medium',
    status: 'pending',
    dueDate: null,
  });
  
  const { toast } = useToast();
  
  // Load backlog items from localStorage
  useEffect(() => {
    const savedItems = localStorage.getItem('jeeBacklogItems');
    if (savedItems) {
      try {
        // Parse dates correctly
        const items = JSON.parse(savedItems, (key, value) => {
          if (key === 'dueDate' || key === 'createdAt' || key === 'completedAt') {
            return value ? new Date(value) : null;
          }
          return value;
        });
        setBacklogItems(items);
      } catch (e) {
        console.error('Error loading backlog items:', e);
        setBacklogItems([]);
      }
    }
  }, []);
  
  // Save backlog items to localStorage
  useEffect(() => {
    if (backlogItems.length > 0) {
      localStorage.setItem('jeeBacklogItems', JSON.stringify(backlogItems));
    }
  }, [backlogItems]);
  
  // Apply filters to items
  useEffect(() => {
    let filtered = [...backlogItems];
    
    // Apply status filter
    if (statusFilter !== 'all') {
      filtered = filtered.filter(item => item.status === statusFilter);
    }
    
    // Apply subject filter
    if (subjectFilter !== 'all') {
      filtered = filtered.filter(item => item.subject === subjectFilter);
    }
    
    // Apply priority filter
    if (priorityFilter !== 'all') {
      filtered = filtered.filter(item => item.priority === priorityFilter);
    }
    
    // Apply search query
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(
        item => 
          item.title.toLowerCase().includes(query) || 
          item.description.toLowerCase().includes(query) ||
          (item.chapter && item.chapter.toLowerCase().includes(query))
      );
    }
    
    // Sort by priority and due date
    filtered.sort((a, b) => {
      const priorityOrder = { critical: 0, high: 1, medium: 2, low: 3 };
      const statusOrder = { 'in-progress': 0, pending: 1, deferred: 2, completed: 3 };
      
      // First sort by status
      if (statusOrder[a.status] !== statusOrder[b.status]) {
        return statusOrder[a.status] - statusOrder[b.status];
      }
      
      // Then sort by priority
      if (priorityOrder[a.priority] !== priorityOrder[b.priority]) {
        return priorityOrder[a.priority] - priorityOrder[b.priority];
      }
      
      // Then sort by due date
      if (a.dueDate && b.dueDate) {
        return a.dueDate.getTime() - b.dueDate.getTime();
      } else if (a.dueDate) {
        return -1;
      } else if (b.dueDate) {
        return 1;
      }
      
      // Finally sort by creation date
      return b.createdAt.getTime() - a.createdAt.getTime();
    });
    
    setFilteredItems(filtered);
  }, [backlogItems, statusFilter, subjectFilter, priorityFilter, searchQuery]);
  
  // Add new backlog item
  const addBacklogItem = () => {
    if (!newItem.title.trim()) {
      toast({
        title: "Title is required",
        description: "Please enter a title for your backlog item",
        variant: "destructive",
      });
      return;
    }
    
    const newBacklogItem: BacklogItem = {
      id: Date.now().toString(),
      ...newItem,
      createdAt: new Date(),
      completedAt: null,
    };
    
    setBacklogItems(prev => [...prev, newBacklogItem]);
    
    // Reset form
    setNewItem({
      title: '',
      description: '',
      subject: 'Maths',
      chapter: '',
      priority: 'medium',
      status: 'pending',
      dueDate: null,
    });
    setShowAddForm(false);
    
    toast({
      title: "Item added to backlog",
      description: "Your backlog item has been successfully added",
    });
  };
  
  // Update item status
  const updateItemStatus = (id: string, status: Status) => {
    setBacklogItems(prev => 
      prev.map(item => {
        if (item.id === id) {
          return {
            ...item, 
            status,
            completedAt: status === 'completed' ? new Date() : null
          };
        }
        return item;
      })
    );
    
    toast({
      title: `Item marked as ${status}`,
    });
  };
  
  // Delete backlog item
  const deleteBacklogItem = (id: string) => {
    setBacklogItems(prev => prev.filter(item => item.id !== id));
    
    toast({
      title: "Item removed",
      description: "The backlog item has been deleted",
    });
  };
  
  // Get badge color based on priority
  const getPriorityBadgeColor = (priority: Priority) => {
    switch (priority) {
      case 'critical': return 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300';
      case 'high': return 'bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-300';
      case 'medium': return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300';
      case 'low': return 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300';
      default: return 'bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-300';
    }
  };
  
  // Get status badge color
  const getStatusBadgeColor = (status: Status) => {
    switch (status) {
      case 'completed': return 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300';
      case 'in-progress': return 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300';
      case 'pending': return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300';
      case 'deferred': return 'bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-300';
      default: return 'bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-300';
    }
  };
  
  // Helper to format date
  const formatDate = (date: Date | null) => {
    if (!date) return 'No date set';
    return format(date, 'PPP');
  };
  
  // Check if item is overdue
  const isOverdue = (item: BacklogItem) => {
    if (!item.dueDate || item.status === 'completed') return false;
    return new Date() > item.dueDate;
  };
  
  return (
    <div className="container max-w-6xl py-6">
      <div className="mb-6">
        <h1 className="text-3xl font-bold mb-2">Backlog Management</h1>
        <p className="text-gray-600 dark:text-gray-300">Organize and track your pending topics, questions, and study materials</p>
      </div>
      
      <Tabs defaultValue="all" onValueChange={setStatusFilter}>
        <div className="flex flex-col md:flex-row gap-4 justify-between items-start mb-6">
          <TabsList className="mb-2 md:mb-0">
            <TabsTrigger value="all">All Items</TabsTrigger>
            <TabsTrigger value="pending">Pending</TabsTrigger>
            <TabsTrigger value="in-progress">In Progress</TabsTrigger>
            <TabsTrigger value="completed">Completed</TabsTrigger>
          </TabsList>
          
          <div className="flex flex-col sm:flex-row gap-2 w-full md:w-auto">
            <Input 
              placeholder="Search backlog..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full sm:w-60"
            />
            <Button onClick={() => setShowAddForm(true)}>
              <Plus className="mr-2 h-4 w-4" /> Add Item
            </Button>
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <div>
            <Select value={subjectFilter} onValueChange={setSubjectFilter}>
              <SelectTrigger>
                <SelectValue placeholder="Filter by subject" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Subjects</SelectItem>
                <SelectItem value="Maths">Mathematics</SelectItem>
                <SelectItem value="Physics">Physics</SelectItem>
                <SelectItem value="Chemistry">Chemistry</SelectItem>
                <SelectItem value="Other">Other</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <div>
            <Select value={priorityFilter} onValueChange={setPriorityFilter}>
              <SelectTrigger>
                <SelectValue placeholder="Filter by priority" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Priorities</SelectItem>
                <SelectItem value="critical">Critical</SelectItem>
                <SelectItem value="high">High</SelectItem>
                <SelectItem value="medium">Medium</SelectItem>
                <SelectItem value="low">Low</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
        
        {showAddForm && (
          <Card className="mb-6 animate-fade-in">
            <CardHeader>
              <CardTitle>Add New Backlog Item</CardTitle>
              <CardDescription>Add a new topic, question, or material to your study backlog</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4">
                <div className="grid gap-2">
                  <label htmlFor="title" className="text-sm font-medium">Title</label>
                  <Input 
                    id="title"
                    value={newItem.title}
                    onChange={(e) => setNewItem({...newItem, title: e.target.value})}
                    placeholder="E.g., Complex Numbers Problems"
                  />
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="grid gap-2">
                    <label htmlFor="subject" className="text-sm font-medium">Subject</label>
                    <Select 
                      value={newItem.subject} 
                      onValueChange={(value) => setNewItem({...newItem, subject: value})}
                    >
                      <SelectTrigger id="subject">
                        <SelectValue placeholder="Select subject" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Maths">Mathematics</SelectItem>
                        <SelectItem value="Physics">Physics</SelectItem>
                        <SelectItem value="Chemistry">Chemistry</SelectItem>
                        <SelectItem value="Other">Other</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div className="grid gap-2">
                    <label htmlFor="chapter" className="text-sm font-medium">Chapter (Optional)</label>
                    <Input 
                      id="chapter"
                      value={newItem.chapter || ''}
                      onChange={(e) => setNewItem({...newItem, chapter: e.target.value})}
                      placeholder="E.g., Integration"
                    />
                  </div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="grid gap-2">
                    <label htmlFor="priority" className="text-sm font-medium">Priority</label>
                    <Select 
                      value={newItem.priority} 
                      onValueChange={(value: Priority) => setNewItem({...newItem, priority: value})}
                    >
                      <SelectTrigger id="priority">
                        <SelectValue placeholder="Select priority" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="low">Low</SelectItem>
                        <SelectItem value="medium">Medium</SelectItem>
                        <SelectItem value="high">High</SelectItem>
                        <SelectItem value="critical">Critical</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div className="grid gap-2">
                    <label htmlFor="due-date" className="text-sm font-medium">Due Date (Optional)</label>
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button
                          variant="outline"
                          className="w-full justify-start text-left font-normal"
                        >
                          <CalendarIcon className="mr-2 h-4 w-4" />
                          {newItem.dueDate ? format(newItem.dueDate, 'PPP') : <span>Pick a date</span>}
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0">
                        <Calendar
                          mode="single"
                          selected={newItem.dueDate || undefined}
                          onSelect={(date) => setNewItem({...newItem, dueDate: date})}
                          initialFocus
                        />
                      </PopoverContent>
                    </Popover>
                  </div>
                </div>
                
                <div className="grid gap-2">
                  <label htmlFor="description" className="text-sm font-medium">Description (Optional)</label>
                  <Textarea 
                    id="description"
                    value={newItem.description}
                    onChange={(e) => setNewItem({...newItem, description: e.target.value})}
                    placeholder="Add details about what you need to study"
                    rows={3}
                  />
                </div>
              </div>
            </CardContent>
            <CardFooter className="flex justify-between">
              <Button variant="outline" onClick={() => setShowAddForm(false)}>Cancel</Button>
              <Button onClick={addBacklogItem}>Add to Backlog</Button>
            </CardFooter>
          </Card>
        )}
        
        <TabsContent value="all" className="mt-0">
          {filteredItems.length > 0 ? (
            <div className="grid grid-cols-1 gap-4">
              {filteredItems.map((item) => (
                <Card 
                  key={item.id} 
                  className={`overflow-hidden ${isOverdue(item) ? 'border-red-300 dark:border-red-700' : ''}`}
                >
                  <CardContent className="p-0">
                    <div className="p-4">
                      <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-2 mb-2">
                        <div className="flex-1">
                          <div className="flex items-center gap-2">
                            <h3 className="font-semibold text-lg">{item.title}</h3>
                            {isOverdue(item) && (
                              <Badge variant="outline" className="bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300">
                                <AlertTriangle className="h-3 w-3 mr-1" /> Overdue
                              </Badge>
                            )}
                          </div>
                          <div className="flex flex-wrap items-center gap-2 mt-1">
                            <Badge className={getPriorityBadgeColor(item.priority)}>
                              {item.priority.charAt(0).toUpperCase() + item.priority.slice(1)} Priority
                            </Badge>
                            <Badge className={getStatusBadgeColor(item.status)}>
                              {item.status === 'in-progress' ? 'In Progress' : 
                               item.status.charAt(0).toUpperCase() + item.status.slice(1)}
                            </Badge>
                            <span className="text-sm text-gray-500 dark:text-gray-400">
                              {item.subject} {item.chapter ? `• ${item.chapter}` : ''}
                            </span>
                          </div>
                        </div>
                        
                        <div className="flex items-center">
                          {item.dueDate && (
                            <div className="text-xs text-gray-500 dark:text-gray-400 flex items-center mr-4">
                              <Clock className="h-3 w-3 mr-1" /> 
                              Due: {format(item.dueDate, 'MMM d, yyyy')}
                            </div>
                          )}
                          
                          <Button 
                            variant="ghost" 
                            size="icon"
                            onClick={() => deleteBacklogItem(item.id)}
                            className="h-8 w-8 text-red-500 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                      
                      {item.description && (
                        <p className="text-sm text-gray-600 dark:text-gray-300 mt-2 mb-3">
                          {item.description}
                        </p>
                      )}
                      
                      {item.status !== 'completed' ? (
                        <div className="flex flex-wrap gap-2 mt-2">
                          {item.status !== 'pending' && (
                            <Button 
                              variant="outline" 
                              size="sm"
                              onClick={() => updateItemStatus(item.id, 'pending')}
                            >
                              Mark as Pending
                            </Button>
                          )}
                          
                          {item.status !== 'in-progress' && (
                            <Button 
                              variant="outline" 
                              size="sm"
                              onClick={() => updateItemStatus(item.id, 'in-progress')}
                              className="border-blue-200 text-blue-600 hover:bg-blue-50 hover:text-blue-700 dark:border-blue-800 dark:text-blue-400 dark:hover:bg-blue-900/20"
                            >
                              Start Working
                            </Button>
                          )}
                          
                          <Button 
                            variant="outline" 
                            size="sm"
                            onClick={() => updateItemStatus(item.id, 'completed')}
                            className="border-green-200 text-green-600 hover:bg-green-50 hover:text-green-700 dark:border-green-800 dark:text-green-400 dark:hover:bg-green-900/20"
                          >
                            <CheckCircle2 className="h-3 w-3 mr-1" /> Mark Complete
                          </Button>
                          
                          {item.status !== 'deferred' && (
                            <Button 
                              variant="outline" 
                              size="sm"
                              onClick={() => updateItemStatus(item.id, 'deferred')}
                              className="border-gray-200 text-gray-600 hover:bg-gray-50 hover:text-gray-700 dark:border-gray-700 dark:text-gray-400 dark:hover:bg-gray-800"
                            >
                              Defer
                            </Button>
                          )}
                        </div>
                      ) : (
                        <div className="mt-2 text-sm text-gray-500 dark:text-gray-400 italic">
                          Completed {item.completedAt ? format(item.completedAt, 'PPP') : ''}
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <div className="text-center py-12 bg-gray-50 dark:bg-gray-800/50 rounded-lg">
              <div className="mx-auto w-24 h-24 bg-gray-100 dark:bg-gray-700 rounded-full flex items-center justify-center mb-4">
                <div className="text-4xl">📋</div>
              </div>
              <h3 className="text-lg font-medium mb-2">No backlog items found</h3>
              <p className="text-gray-500 dark:text-gray-400 mb-4">
                {searchQuery || statusFilter !== 'all' || subjectFilter !== 'all' || priorityFilter !== 'all'
                  ? 'Try changing your filters or search query'
                  : 'Add your first backlog item to stay organized'}
              </p>
              {!showAddForm && (
                <Button onClick={() => setShowAddForm(true)}>
                  <Plus className="mr-2 h-4 w-4" /> Add New Item
                </Button>
              )}
            </div>
          )}
        </TabsContent>
        
        <TabsContent value="pending" className="mt-0">
          {/* Pending items shown automatically through status filter */}
        </TabsContent>
        
        <TabsContent value="in-progress" className="mt-0">
          {/* In Progress items shown automatically through status filter */}
        </TabsContent>
        
        <TabsContent value="completed" className="mt-0">
          {/* Completed items shown automatically through status filter */}
        </TabsContent>
      </Tabs>
    </div>
  );
}
