
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/components/ui/use-toast';
import { format } from 'date-fns';
import { Bookmark, Plus, Search, Trash2, ExternalLink, FolderOpen, Tag, Edit, FileEdit, Copy, ChevronDown, ChevronUp, Link2 } from 'lucide-react';

// Types
interface BookmarkItem {
  id: string;
  title: string;
  url: string;
  subject: string;
  category: string;
  notes?: string;
  tags: string[];
  dateAdded: string; // ISO string
  lastVisited?: string; // ISO string
}

export function BookmarkManager() {
  const [bookmarks, setBookmarks] = useState<BookmarkItem[]>([]);
  const [filteredBookmarks, setFilteredBookmarks] = useState<BookmarkItem[]>([]);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [subjectFilter, setSubjectFilter] = useState('all');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [expandedBookmarkId, setExpandedBookmarkId] = useState<string | null>(null);
  const [editingBookmark, setEditingBookmark] = useState<BookmarkItem | null>(null);
  
  // New bookmark form state
  const [newBookmark, setNewBookmark] = useState<Omit<BookmarkItem, 'id' | 'dateAdded' | 'lastVisited'>>({
    title: '',
    url: '',
    subject: 'Maths',
    category: 'article',
    notes: '',
    tags: [],
  });
  
  // All available tags
  const [allTags, setAllTags] = useState<string[]>([
    'important', 'difficult', 'revision', 'exam', 'theory', 'video', 'problems', 'formula',
    'notes', 'visualization', 'reference', 'tutorial', 'solved', 'practice'
  ]);
  
  // Available categories
  const categories = [
    { value: 'article', label: 'Article/Website' },
    { value: 'video', label: 'Video' },
    { value: 'pdf', label: 'PDF/Document' },
    { value: 'questionbank', label: 'Question Bank' },
    { value: 'notes', label: 'Notes' },
    { value: 'other', label: 'Other' },
  ];
  
  const { toast } = useToast();
  
  // Load bookmarks from localStorage
  useEffect(() => {
    const savedBookmarks = localStorage.getItem('jeeBookmarks');
    if (savedBookmarks) {
      try {
        setBookmarks(JSON.parse(savedBookmarks));
      } catch (e) {
        console.error('Error loading bookmarks:', e);
        setBookmarks([]);
      }
    }
  }, []);
  
  // Save bookmarks to localStorage
  useEffect(() => {
    if (bookmarks.length > 0) {
      localStorage.setItem('jeeBookmarks', JSON.stringify(bookmarks));
    }
  }, [bookmarks]);
  
  // Apply filters to bookmarks
  useEffect(() => {
    let filtered = [...bookmarks];
    
    // Apply subject filter
    if (subjectFilter !== 'all') {
      filtered = filtered.filter(bookmark => bookmark.subject === subjectFilter);
    }
    
    // Apply category filter
    if (categoryFilter !== 'all') {
      filtered = filtered.filter(bookmark => bookmark.category === categoryFilter);
    }
    
    // Apply tag filters
    if (selectedTags.length > 0) {
      filtered = filtered.filter(bookmark => 
        selectedTags.some(tag => bookmark.tags.includes(tag))
      );
    }
    
    // Apply search query
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(bookmark => 
        bookmark.title.toLowerCase().includes(query) ||
        bookmark.url.toLowerCase().includes(query) ||
        (bookmark.notes && bookmark.notes.toLowerCase().includes(query)) ||
        bookmark.tags.some(tag => tag.toLowerCase().includes(query))
      );
    }
    
    // Sort by date added (newest first)
    filtered.sort((a, b) => new Date(b.dateAdded).getTime() - new Date(a.dateAdded).getTime());
    
    setFilteredBookmarks(filtered);
  }, [bookmarks, subjectFilter, categoryFilter, searchQuery, selectedTags]);
  
  // Extract all unique tags from bookmarks
  useEffect(() => {
    if (bookmarks.length > 0) {
      const tagsFromBookmarks = bookmarks.flatMap(bookmark => bookmark.tags);
      const uniqueTags = [...new Set([...allTags, ...tagsFromBookmarks])];
      setAllTags(uniqueTags);
    }
  }, [bookmarks]);
  
  // Add a new bookmark
  const addBookmark = () => {
    // Basic validation
    if (!newBookmark.title.trim()) {
      toast({
        title: "Title is required",
        description: "Please enter a title for your bookmark",
        variant: "destructive",
      });
      return;
    }
    
    if (!newBookmark.url.trim()) {
      toast({
        title: "URL is required",
        description: "Please enter a URL for your bookmark",
        variant: "destructive",
      });
      return;
    }
    
    // Add http:// if missing from URL
    let url = newBookmark.url;
    if (!url.startsWith('http://') && !url.startsWith('https://')) {
      url = 'https://' + url;
    }
    
    const newBookmarkComplete: BookmarkItem = {
      id: Date.now().toString(),
      ...newBookmark,
      url,
      dateAdded: new Date().toISOString(),
    };
    
    setBookmarks(prev => [...prev, newBookmarkComplete]);
    setIsAddDialogOpen(false);
    
    // Extract new tags and add them to allTags
    const newTags = newBookmark.tags.filter(tag => !allTags.includes(tag));
    if (newTags.length > 0) {
      setAllTags(prev => [...prev, ...newTags]);
    }
    
    // Reset form
    setNewBookmark({
      title: '',
      url: '',
      subject: 'Maths',
      category: 'article',
      notes: '',
      tags: [],
    });
    
    toast({
      title: "Bookmark added",
      description: "Your bookmark has been successfully saved",
    });
  };
  
  // Update an existing bookmark
  const updateBookmark = () => {
    if (!editingBookmark) return;
    
    // Basic validation
    if (!editingBookmark.title.trim() || !editingBookmark.url.trim()) {
      toast({
        title: "Missing information",
        description: "Title and URL are required",
        variant: "destructive",
      });
      return;
    }
    
    // Add http:// if missing from URL
    let url = editingBookmark.url;
    if (!url.startsWith('http://') && !url.startsWith('https://')) {
      url = 'https://' + url;
    }
    
    setBookmarks(prev => 
      prev.map(bookmark => 
        bookmark.id === editingBookmark.id 
          ? { ...editingBookmark, url } 
          : bookmark
      )
    );
    
    setIsEditDialogOpen(false);
    setEditingBookmark(null);
    
    toast({
      title: "Bookmark updated",
      description: "Your changes have been saved",
    });
  };
  
  // Delete a bookmark
  const deleteBookmark = (id: string) => {
    setBookmarks(prev => prev.filter(bookmark => bookmark.id !== id));
    
    toast({
      title: "Bookmark deleted",
      description: "The bookmark has been removed",
    });
  };
  
  // Toggle tag selection for filtering
  const toggleTagFilter = (tag: string) => {
    if (selectedTags.includes(tag)) {
      setSelectedTags(prev => prev.filter(t => t !== tag));
    } else {
      setSelectedTags(prev => [...prev, tag]);
    }
  };
  
  // Toggle tag selection for new bookmark
  const toggleBookmarkTag = (tag: string) => {
    if (newBookmark.tags.includes(tag)) {
      setNewBookmark({
        ...newBookmark,
        tags: newBookmark.tags.filter(t => t !== tag)
      });
    } else {
      setNewBookmark({
        ...newBookmark,
        tags: [...newBookmark.tags, tag]
      });
    }
  };
  
  // Toggle tag selection for editing bookmark
  const toggleEditBookmarkTag = (tag: string) => {
    if (!editingBookmark) return;
    
    if (editingBookmark.tags.includes(tag)) {
      setEditingBookmark({
        ...editingBookmark,
        tags: editingBookmark.tags.filter(t => t !== tag)
      });
    } else {
      setEditingBookmark({
        ...editingBookmark,
        tags: [...editingBookmark.tags, tag]
      });
    }
  };
  
  // Add custom tag to new bookmark
  const addCustomTag = (e: React.KeyboardEvent<HTMLInputElement>, type: 'new' | 'edit') => {
    if (e.key === 'Enter' && e.currentTarget.value.trim()) {
      const newTag = e.currentTarget.value.trim().toLowerCase();
      
      if (type === 'new') {
        if (!newBookmark.tags.includes(newTag)) {
          setNewBookmark({
            ...newBookmark,
            tags: [...newBookmark.tags, newTag]
          });
        }
      } else if (type === 'edit' && editingBookmark) {
        if (!editingBookmark.tags.includes(newTag)) {
          setEditingBookmark({
            ...editingBookmark,
            tags: [...editingBookmark.tags, newTag]
          });
        }
      }
      
      if (!allTags.includes(newTag)) {
        setAllTags(prev => [...prev, newTag]);
      }
      
      e.currentTarget.value = '';
    }
  };
  
  // Open bookmark URL and update last visited date
  const openBookmark = (bookmark: BookmarkItem) => {
    // Update last visited date
    setBookmarks(prev => 
      prev.map(item => 
        item.id === bookmark.id 
          ? { ...item, lastVisited: new Date().toISOString() } 
          : item
      )
    );
    
    // Open URL in new tab
    window.open(bookmark.url, '_blank', 'noopener,noreferrer');
  };
  
  // Copy bookmark URL to clipboard
  const copyUrl = (url: string) => {
    navigator.clipboard.writeText(url).then(() => {
      toast({
        title: "URL copied",
        description: "Link copied to clipboard",
      });
    });
  };
  
  // Toggle bookmark expansion
  const toggleBookmarkExpansion = (id: string) => {
    setExpandedBookmarkId(expandedBookmarkId === id ? null : id);
  };
  
  // Format dates
  const formatDate = (dateString: string) => {
    return format(new Date(dateString), 'MMM d, yyyy');
  };
  
  // Get subject color classes
  const getSubjectColor = (subject: string) => {
    switch (subject) {
      case 'Maths':
        return 'bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-300';
      case 'Physics':
        return 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300';
      case 'Chemistry':
        return 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300';
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300';
    }
  };
  
  // Get category icon
  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'article':
        return <FileEdit className="h-4 w-4" />;
      case 'video':
        return <ExternalLink className="h-4 w-4" />;
      case 'pdf':
        return <FileEdit className="h-4 w-4" />;
      case 'questionbank':
        return <Copy className="h-4 w-4" />;
      case 'notes':
        return <FileEdit className="h-4 w-4" />;
      default:
        return <Link2 className="h-4 w-4" />;
    }
  };
  
  // Get category label
  const getCategoryLabel = (category: string) => {
    const found = categories.find(c => c.value === category);
    return found ? found.label : 'Other';
  };
  
  return (
    <div className="container max-w-6xl py-6">
      <div className="mb-6">
        <h1 className="text-3xl font-bold mb-2">Bookmark Manager</h1>
        <p className="text-gray-600 dark:text-gray-300">
          Save and organize your important study resources
        </p>
      </div>
      
      <div className="flex flex-col md:flex-row gap-4 justify-between items-start mb-6">
        <div className="flex flex-col sm:flex-row gap-2 w-full md:w-auto">
          <div className="relative w-full sm:w-64">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <Input
              placeholder="Search bookmarks..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
          
          <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
            <DialogTrigger asChild>
              <Button className="whitespace-nowrap">
                <Plus className="mr-2 h-4 w-4" /> Add Bookmark
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-lg">
              <DialogHeader>
                <DialogTitle>Add New Bookmark</DialogTitle>
                <DialogDescription>
                  Save a useful link for your JEE preparation
                </DialogDescription>
              </DialogHeader>
              
              <div className="grid gap-4 py-4">
                <div className="grid gap-2">
                  <Label htmlFor="bookmark-title" className="font-medium">Title</Label>
                  <Input
                    id="bookmark-title"
                    value={newBookmark.title}
                    onChange={(e) => setNewBookmark({...newBookmark, title: e.target.value})}
                    placeholder="E.g., Integration Formulas Reference"
                  />
                </div>
                
                <div className="grid gap-2">
                  <Label htmlFor="bookmark-url" className="font-medium">URL</Label>
                  <Input
                    id="bookmark-url"
                    value={newBookmark.url}
                    onChange={(e) => setNewBookmark({...newBookmark, url: e.target.value})}
                    placeholder="E.g., https://example.com/integration-formulas"
                  />
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="grid gap-2">
                    <Label htmlFor="bookmark-subject" className="font-medium">Subject</Label>
                    <Select
                      value={newBookmark.subject}
                      onValueChange={(value) => setNewBookmark({...newBookmark, subject: value})}
                    >
                      <SelectTrigger id="bookmark-subject">
                        <SelectValue placeholder="Select subject" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Maths">Mathematics</SelectItem>
                        <SelectItem value="Physics">Physics</SelectItem>
                        <SelectItem value="Chemistry">Chemistry</SelectItem>
                        <SelectItem value="General">General</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div className="grid gap-2">
                    <Label htmlFor="bookmark-category" className="font-medium">Resource Type</Label>
                    <Select
                      value={newBookmark.category}
                      onValueChange={(value) => setNewBookmark({...newBookmark, category: value})}
                    >
                      <SelectTrigger id="bookmark-category">
                        <SelectValue placeholder="Select type" />
                      </SelectTrigger>
                      <SelectContent>
                        {categories.map(category => (
                          <SelectItem key={category.value} value={category.value}>
                            {category.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                
                <div className="grid gap-2">
                  <Label htmlFor="bookmark-notes" className="font-medium">Notes (Optional)</Label>
                  <Textarea
                    id="bookmark-notes"
                    value={newBookmark.notes || ''}
                    onChange={(e) => setNewBookmark({...newBookmark, notes: e.target.value})}
                    placeholder="Add any notes about this resource..."
                    rows={3}
                  />
                </div>
                
                <div className="grid gap-2">
                  <Label className="font-medium">Tags</Label>
                  <div className="flex flex-wrap gap-2 mb-2">
                    {allTags.map(tag => (
                      <Badge
                        key={tag}
                        variant={newBookmark.tags.includes(tag) ? "default" : "outline"}
                        className="cursor-pointer"
                        onClick={() => toggleBookmarkTag(tag)}
                      >
                        {tag}
                      </Badge>
                    ))}
                  </div>
                  <div className="flex items-center gap-2">
                    <Input
                      placeholder="Add custom tag (press Enter)"
                      onKeyDown={(e) => addCustomTag(e, 'new')}
                      className="flex-1"
                    />
                  </div>
                </div>
              </div>
              
              <DialogFooter>
                <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>
                  Cancel
                </Button>
                <Button onClick={addBookmark}>
                  Save Bookmark
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {/* Filters sidebar */}
        <div className="col-span-1">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-lg">Filters</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <Label htmlFor="subject-filter" className="text-sm font-medium block mb-2">Subject</Label>
                  <Select
                    value={subjectFilter}
                    onValueChange={setSubjectFilter}
                  >
                    <SelectTrigger id="subject-filter">
                      <SelectValue placeholder="Filter by subject" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Subjects</SelectItem>
                      <SelectItem value="Maths">Mathematics</SelectItem>
                      <SelectItem value="Physics">Physics</SelectItem>
                      <SelectItem value="Chemistry">Chemistry</SelectItem>
                      <SelectItem value="General">General</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div>
                  <Label htmlFor="category-filter" className="text-sm font-medium block mb-2">Resource Type</Label>
                  <Select
                    value={categoryFilter}
                    onValueChange={setCategoryFilter}
                  >
                    <SelectTrigger id="category-filter">
                      <SelectValue placeholder="Filter by type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Types</SelectItem>
                      {categories.map(category => (
                        <SelectItem key={category.value} value={category.value}>
                          {category.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                
                <div>
                  <Label className="text-sm font-medium block mb-2">Tags</Label>
                  <div className="flex flex-wrap gap-2">
                    {allTags.slice(0, 15).map(tag => (
                      <Badge
                        key={tag}
                        variant={selectedTags.includes(tag) ? "default" : "outline"}
                        className="cursor-pointer"
                        onClick={() => toggleTagFilter(tag)}
                      >
                        {tag}
                      </Badge>
                    ))}
                    {allTags.length > 15 && (
                      <div className="text-xs text-gray-500 mt-2">
                        +{allTags.length - 15} more tags
                      </div>
                    )}
                  </div>
                </div>
                
                {(subjectFilter !== 'all' || categoryFilter !== 'all' || selectedTags.length > 0 || searchQuery) && (
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    className="mt-2"
                    onClick={() => {
                      setSubjectFilter('all');
                      setCategoryFilter('all');
                      setSelectedTags([]);
                      setSearchQuery('');
                    }}
                  >
                    Clear All Filters
                  </Button>
                )}
                
                <div className="pt-3 border-t">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-sm font-medium">Bookmark Stats</span>
                  </div>
                  <div className="text-sm">
                    <div className="flex justify-between mb-1">
                      <span className="text-gray-600 dark:text-gray-400">Total:</span>
                      <span>{bookmarks.length}</span>
                    </div>
                    <div className="flex justify-between mb-1">
                      <span className="text-gray-600 dark:text-gray-400">Mathematics:</span>
                      <span>{bookmarks.filter(b => b.subject === 'Maths').length}</span>
                    </div>
                    <div className="flex justify-between mb-1">
                      <span className="text-gray-600 dark:text-gray-400">Physics:</span>
                      <span>{bookmarks.filter(b => b.subject === 'Physics').length}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600 dark:text-gray-400">Chemistry:</span>
                      <span>{bookmarks.filter(b => b.subject === 'Chemistry').length}</span>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
        
        {/* Bookmarks list */}
        <div className="col-span-1 md:col-span-3">
          <Tabs defaultValue="all" className="mb-6">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="all">All</TabsTrigger>
              <TabsTrigger value="Maths">Maths</TabsTrigger>
              <TabsTrigger value="Physics">Physics</TabsTrigger>
              <TabsTrigger value="Chemistry">Chemistry</TabsTrigger>
            </TabsList>
            
            <TabsContent value="all" className="mt-4">
              <BookmarkList 
                bookmarks={filteredBookmarks}
                expandedBookmarkId={expandedBookmarkId}
                toggleBookmarkExpansion={toggleBookmarkExpansion}
                openBookmark={openBookmark}
                copyUrl={copyUrl}
                deleteBookmark={deleteBookmark}
                setEditingBookmark={setEditingBookmark}
                setIsEditDialogOpen={setIsEditDialogOpen}
                getSubjectColor={getSubjectColor}
                getCategoryIcon={getCategoryIcon}
                getCategoryLabel={getCategoryLabel}
                formatDate={formatDate}
              />
            </TabsContent>
            
            <TabsContent value="Maths" className="mt-4">
              <BookmarkList 
                bookmarks={filteredBookmarks.filter(b => b.subject === 'Maths')}
                expandedBookmarkId={expandedBookmarkId}
                toggleBookmarkExpansion={toggleBookmarkExpansion}
                openBookmark={openBookmark}
                copyUrl={copyUrl}
                deleteBookmark={deleteBookmark}
                setEditingBookmark={setEditingBookmark}
                setIsEditDialogOpen={setIsEditDialogOpen}
                getSubjectColor={getSubjectColor}
                getCategoryIcon={getCategoryIcon}
                getCategoryLabel={getCategoryLabel}
                formatDate={formatDate}
              />
            </TabsContent>
            
            <TabsContent value="Physics" className="mt-4">
              <BookmarkList 
                bookmarks={filteredBookmarks.filter(b => b.subject === 'Physics')}
                expandedBookmarkId={expandedBookmarkId}
                toggleBookmarkExpansion={toggleBookmarkExpansion}
                openBookmark={openBookmark}
                copyUrl={copyUrl}
                deleteBookmark={deleteBookmark}
                setEditingBookmark={setEditingBookmark}
                setIsEditDialogOpen={setIsEditDialogOpen}
                getSubjectColor={getSubjectColor}
                getCategoryIcon={getCategoryIcon}
                getCategoryLabel={getCategoryLabel}
                formatDate={formatDate}
              />
            </TabsContent>
            
            <TabsContent value="Chemistry" className="mt-4">
              <BookmarkList 
                bookmarks={filteredBookmarks.filter(b => b.subject === 'Chemistry')}
                expandedBookmarkId={expandedBookmarkId}
                toggleBookmarkExpansion={toggleBookmarkExpansion}
                openBookmark={openBookmark}
                copyUrl={copyUrl}
                deleteBookmark={deleteBookmark}
                setEditingBookmark={setEditingBookmark}
                setIsEditDialogOpen={setIsEditDialogOpen}
                getSubjectColor={getSubjectColor}
                getCategoryIcon={getCategoryIcon}
                getCategoryLabel={getCategoryLabel}
                formatDate={formatDate}
              />
            </TabsContent>
          </Tabs>
        </div>
      </div>
      
      {/* Edit bookmark dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>Edit Bookmark</DialogTitle>
            <DialogDescription>
              Update your saved bookmark
            </DialogDescription>
          </DialogHeader>
          
          {editingBookmark && (
            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <Label htmlFor="edit-bookmark-title" className="font-medium">Title</Label>
                <Input
                  id="edit-bookmark-title"
                  value={editingBookmark.title}
                  onChange={(e) => setEditingBookmark({...editingBookmark, title: e.target.value})}
                />
              </div>
              
              <div className="grid gap-2">
                <Label htmlFor="edit-bookmark-url" className="font-medium">URL</Label>
                <Input
                  id="edit-bookmark-url"
                  value={editingBookmark.url}
                  onChange={(e) => setEditingBookmark({...editingBookmark, url: e.target.value})}
                />
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="edit-bookmark-subject" className="font-medium">Subject</Label>
                  <Select
                    value={editingBookmark.subject}
                    onValueChange={(value) => setEditingBookmark({...editingBookmark, subject: value})}
                  >
                    <SelectTrigger id="edit-bookmark-subject">
                      <SelectValue placeholder="Select subject" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Maths">Mathematics</SelectItem>
                      <SelectItem value="Physics">Physics</SelectItem>
                      <SelectItem value="Chemistry">Chemistry</SelectItem>
                      <SelectItem value="General">General</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="grid gap-2">
                  <Label htmlFor="edit-bookmark-category" className="font-medium">Resource Type</Label>
                  <Select
                    value={editingBookmark.category}
                    onValueChange={(value) => setEditingBookmark({...editingBookmark, category: value})}
                  >
                    <SelectTrigger id="edit-bookmark-category">
                      <SelectValue placeholder="Select type" />
                    </SelectTrigger>
                    <SelectContent>
                      {categories.map(category => (
                        <SelectItem key={category.value} value={category.value}>
                          {category.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
              
              <div className="grid gap-2">
                <Label htmlFor="edit-bookmark-notes" className="font-medium">Notes (Optional)</Label>
                <Textarea
                  id="edit-bookmark-notes"
                  value={editingBookmark.notes || ''}
                  onChange={(e) => setEditingBookmark({...editingBookmark, notes: e.target.value})}
                  rows={3}
                />
              </div>
              
              <div className="grid gap-2">
                <Label className="font-medium">Tags</Label>
                <div className="flex flex-wrap gap-2 mb-2">
                  {allTags.map(tag => (
                    <Badge
                      key={tag}
                      variant={editingBookmark.tags.includes(tag) ? "default" : "outline"}
                      className="cursor-pointer"
                      onClick={() => toggleEditBookmarkTag(tag)}
                    >
                      {tag}
                    </Badge>
                  ))}
                </div>
                <div className="flex items-center gap-2">
                  <Input
                    placeholder="Add custom tag (press Enter)"
                    onKeyDown={(e) => addCustomTag(e, 'edit')}
                    className="flex-1"
                  />
                </div>
              </div>
            </div>
          )}
          
          <DialogFooter>
            <Button variant="outline" onClick={() => {
              setIsEditDialogOpen(false);
              setEditingBookmark(null);
            }}>
              Cancel
            </Button>
            <Button onClick={updateBookmark}>
              Save Changes
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

// BookmarkList component to display the list of bookmarks
interface BookmarkListProps {
  bookmarks: BookmarkItem[];
  expandedBookmarkId: string | null;
  toggleBookmarkExpansion: (id: string) => void;
  openBookmark: (bookmark: BookmarkItem) => void;
  copyUrl: (url: string) => void;
  deleteBookmark: (id: string) => void;
  setEditingBookmark: (bookmark: BookmarkItem) => void;
  setIsEditDialogOpen: (open: boolean) => void;
  getSubjectColor: (subject: string) => string;
  getCategoryIcon: (category: string) => React.ReactNode;
  getCategoryLabel: (category: string) => string;
  formatDate: (dateString: string) => string;
}

function BookmarkList({
  bookmarks,
  expandedBookmarkId,
  toggleBookmarkExpansion,
  openBookmark,
  copyUrl,
  deleteBookmark,
  setEditingBookmark,
  setIsEditDialogOpen,
  getSubjectColor,
  getCategoryIcon,
  getCategoryLabel,
  formatDate
}: BookmarkListProps) {
  if (bookmarks.length === 0) {
    return (
      <div className="text-center py-12 bg-gray-50 dark:bg-gray-800/50 rounded-lg">
        <Bookmark className="h-12 w-12 text-gray-300 mx-auto mb-4" />
        <h3 className="text-lg font-medium mb-2">No bookmarks found</h3>
        <p className="text-gray-500 dark:text-gray-400 mb-4">
          Try changing your filters or add your first bookmark
        </p>
      </div>
    );
  }
  
  return (
    <div className="space-y-4">
      {bookmarks.map(bookmark => (
        <Card key={bookmark.id} className="overflow-hidden">
          <CardContent className="p-0">
            <div className="p-4">
              <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-2 mb-2">
                <div className="flex-1">
                  <div className="flex items-center mb-1">
                    <Badge className={`mr-2 ${getSubjectColor(bookmark.subject)}`}>
                      {bookmark.subject}
                    </Badge>
                    <div className="flex items-center text-xs text-gray-500 dark:text-gray-400">
                      <FolderOpen className="h-3 w-3 mr-1" />
                      <span>{getCategoryLabel(bookmark.category)}</span>
                    </div>
                  </div>
                  
                  <h3 
                    className="font-semibold text-lg hover:text-primary cursor-pointer" 
                    onClick={() => openBookmark(bookmark)}
                  >
                    {bookmark.title}
                  </h3>
                  
                  <div className="flex items-center mt-1 text-sm text-gray-500 dark:text-gray-400 truncate">
                    <Link2 className="h-3 w-3 flex-shrink-0 mr-1" />
                    <a 
                      href={bookmark.url} 
                      className="truncate hover:underline"
                      target="_blank" 
                      rel="noopener noreferrer"
                      onClick={(e) => {
                        e.preventDefault();
                        openBookmark(bookmark);
                      }}
                    >
                      {bookmark.url}
                    </a>
                  </div>
                </div>
                
                <div className="flex items-center mt-1 sm:mt-0 space-x-1">
                  <Button
                    variant="outline"
                    size="sm"
                    className="h-8"
                    onClick={() => openBookmark(bookmark)}
                  >
                    <ExternalLink className="h-3 w-3 mr-1" /> Open
                  </Button>
                  
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8"
                    onClick={(e) => {
                      e.stopPropagation();
                      copyUrl(bookmark.url);
                    }}
                  >
                    <Copy className="h-4 w-4" />
                  </Button>
                  
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8"
                    onClick={(e) => {
                      e.stopPropagation();
                      setEditingBookmark(bookmark);
                      setIsEditDialogOpen(true);
                    }}
                  >
                    <Edit className="h-4 w-4" />
                  </Button>
                  
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8 text-red-500 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20"
                    onClick={(e) => {
                      e.stopPropagation();
                      deleteBookmark(bookmark.id);
                    }}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
              
              {bookmark.tags.length > 0 && (
                <div className="flex flex-wrap gap-1 mt-2">
                  {bookmark.tags.map(tag => (
                    <div 
                      key={tag} 
                      className="text-xs px-2 py-0.5 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center"
                    >
                      <Tag className="h-3 w-3 mr-1" />
                      {tag}
                    </div>
                  ))}
                </div>
              )}
              
              <div 
                className="mt-2 flex items-center text-xs text-gray-500 dark:text-gray-400 cursor-pointer"
                onClick={() => toggleBookmarkExpansion(bookmark.id)}
              >
                <span>Added {formatDate(bookmark.dateAdded)}</span>
                {bookmark.lastVisited && (
                  <>
                    <span className="mx-2">•</span>
                    <span>Last visited {formatDate(bookmark.lastVisited)}</span>
                  </>
                )}
                
                {(bookmark.notes || expandedBookmarkId === bookmark.id) && (
                  <div className="ml-auto">
                    {expandedBookmarkId === bookmark.id ? (
                      <ChevronUp className="h-4 w-4" />
                    ) : (
                      <ChevronDown className="h-4 w-4" />
                    )}
                  </div>
                )}
              </div>
              
              {expandedBookmarkId === bookmark.id && bookmark.notes && (
                <div className="mt-3 pt-3 border-t animate-fade-in">
                  <div className="text-sm">
                    <h4 className="font-medium mb-1">Notes:</h4>
                    <p className="text-gray-600 dark:text-gray-300 whitespace-pre-line">
                      {bookmark.notes}
                    </p>
                  </div>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
