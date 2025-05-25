
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { studyTools } from '@/data/jeeData';
import { 
  Search, Filter, Heart, Clock, Star, Zap, 
  ChevronLeft, Grid3X3, List, Bookmark
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useToast } from '@/components/ui/use-toast';

const StudyToolsPage = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [favorites, setFavorites] = useState<string[]>([]);
  const [recentlyUsed, setRecentlyUsed] = useState<string[]>([]);
  const { toast } = useToast();

  // Load favorites and recently used from localStorage
  useEffect(() => {
    const savedFavorites = localStorage.getItem('studyToolsFavorites');
    const savedRecent = localStorage.getItem('studyToolsRecent');
    
    if (savedFavorites) {
      setFavorites(JSON.parse(savedFavorites));
    }
    if (savedRecent) {
      setRecentlyUsed(JSON.parse(savedRecent));
    }
  }, []);

  // Save to localStorage when favorites change
  useEffect(() => {
    localStorage.setItem('studyToolsFavorites', JSON.stringify(favorites));
  }, [favorites]);

  useEffect(() => {
    localStorage.setItem('studyToolsRecent', JSON.stringify(recentlyUsed));
  }, [recentlyUsed]);

  const categories = ['all', 'productivity', 'revision', 'organization', 'practice', 'wellbeing'];
  
  const filteredTools = studyTools.filter(tool => {
    const matchesSearch = tool.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         tool.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || tool.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const favoriteTools = studyTools.filter(tool => favorites.includes(tool.id));
  const recentTools = studyTools.filter(tool => recentlyUsed.includes(tool.id));

  const toggleFavorite = (toolId: string) => {
    setFavorites(prev => {
      const newFavorites = prev.includes(toolId) 
        ? prev.filter(id => id !== toolId)
        : [...prev, toolId];
      
      toast({
        title: prev.includes(toolId) ? "Removed from favorites" : "Added to favorites",
        description: "Your favorites have been updated",
      });
      
      return newFavorites;
    });
  };

  const addToRecent = (toolId: string) => {
    setRecentlyUsed(prev => {
      const filtered = prev.filter(id => id !== toolId);
      return [toolId, ...filtered].slice(0, 10); // Keep only last 10
    });
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'productivity': return '⚡';
      case 'revision': return '🔄';
      case 'organization': return '📋';
      case 'practice': return '📝';
      case 'wellbeing': return '🧘';
      default: return '🛠️';
    }
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'productivity': return 'bg-blue-100 text-blue-700 border-blue-200 dark:bg-blue-900/30 dark:text-blue-300';
      case 'revision': return 'bg-green-100 text-green-700 border-green-200 dark:bg-green-900/30 dark:text-green-300';
      case 'organization': return 'bg-purple-100 text-purple-700 border-purple-200 dark:bg-purple-900/30 dark:text-purple-300';
      case 'practice': return 'bg-orange-100 text-orange-700 border-orange-200 dark:bg-orange-900/30 dark:text-orange-300';
      case 'wellbeing': return 'bg-pink-100 text-pink-700 border-pink-200 dark:bg-pink-900/30 dark:text-pink-300';
      default: return 'bg-gray-100 text-gray-700 border-gray-200 dark:bg-gray-900/30 dark:text-gray-300';
    }
  };

  const ToolCard = ({ tool, index }: { tool: typeof studyTools[0], index: number }) => (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1 }}
      className="group"
    >
      <Card className="h-full transition-all duration-300 hover:shadow-lg hover:-translate-y-1 cursor-pointer relative overflow-hidden">
        <div className="absolute top-3 right-3 z-10">
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8 opacity-0 group-hover:opacity-100 transition-opacity"
            onClick={(e) => {
              e.preventDefault();
              toggleFavorite(tool.id);
            }}
          >
            <Heart 
              className={`h-4 w-4 ${favorites.includes(tool.id) ? 'fill-red-500 text-red-500' : 'text-gray-400'}`} 
            />
          </Button>
        </div>
        
        <Link 
          to={`/tools/${tool.id}`}
          onClick={() => addToRecent(tool.id)}
          className="block h-full"
        >
          <CardHeader className="pb-3">
            <div className="flex items-start gap-3">
              <div className="text-3xl">{tool.icon}</div>
              <div className="flex-1 min-w-0">
                <CardTitle className="text-lg group-hover:text-primary transition-colors">
                  {tool.name}
                </CardTitle>
                <Badge 
                  variant="outline" 
                  className={`mt-2 ${getCategoryColor(tool.category)}`}
                >
                  {getCategoryIcon(tool.category)} {tool.category}
                </Badge>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <CardDescription className="text-sm leading-relaxed">
              {tool.description}
            </CardDescription>
            
            {recentlyUsed.includes(tool.id) && (
              <Badge variant="outline" className="mt-3 bg-blue-50 text-blue-600 border-blue-200">
                <Clock className="h-3 w-3 mr-1" />
                Recently Used
              </Badge>
            )}
          </CardContent>
        </Link>
      </Card>
    </motion.div>
  );

  const ListToolCard = ({ tool, index }: { tool: typeof studyTools[0], index: number }) => (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: index * 0.05 }}
    >
      <Card className="hover:shadow-md transition-all duration-200">
        <Link 
          to={`/tools/${tool.id}`}
          onClick={() => addToRecent(tool.id)}
          className="block"
        >
          <CardContent className="p-4">
            <div className="flex items-center gap-4">
              <div className="text-2xl">{tool.icon}</div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <h3 className="font-semibold hover:text-primary transition-colors">{tool.name}</h3>
                  <Badge variant="outline" className={`${getCategoryColor(tool.category)} text-xs`}>
                    {tool.category}
                  </Badge>
                  {recentlyUsed.includes(tool.id) && (
                    <Badge variant="outline" className="bg-blue-50 text-blue-600 border-blue-200 text-xs">
                      Recent
                    </Badge>
                  )}
                </div>
                <p className="text-sm text-muted-foreground">{tool.description}</p>
              </div>
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8"
                onClick={(e) => {
                  e.preventDefault();
                  toggleFavorite(tool.id);
                }}
              >
                <Heart 
                  className={`h-4 w-4 ${favorites.includes(tool.id) ? 'fill-red-500 text-red-500' : 'text-gray-400'}`} 
                />
              </Button>
            </div>
          </CardContent>
        </Link>
      </Card>
    </motion.div>
  );

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
              Study Tools
            </h1>
            <p className="text-muted-foreground mt-2">
              Enhance your learning experience with our comprehensive suite of study tools
            </p>
          </div>
          
          <div className="flex items-center gap-2">
            <Button
              variant={viewMode === 'grid' ? 'default' : 'outline'}
              size="icon"
              onClick={() => setViewMode('grid')}
            >
              <Grid3X3 className="h-4 w-4" />
            </Button>
            <Button
              variant={viewMode === 'list' ? 'default' : 'outline'}
              size="icon"
              onClick={() => setViewMode('list')}
            >
              <List className="h-4 w-4" />
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
                  placeholder="Search study tools..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
              
              <div className="flex gap-2 flex-wrap">
                {categories.map((category) => (
                  <Button
                    key={category}
                    variant={selectedCategory === category ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => setSelectedCategory(category)}
                    className="capitalize"
                  >
                    {getCategoryIcon(category)} {category}
                  </Button>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Content */}
      <Tabs defaultValue="all" className="space-y-6">
        <TabsList className="grid w-full grid-cols-3 lg:w-fit">
          <TabsTrigger value="all" className="flex items-center gap-2">
            <Zap className="h-4 w-4" />
            All Tools ({filteredTools.length})
          </TabsTrigger>
          <TabsTrigger value="favorites" className="flex items-center gap-2">
            <Heart className="h-4 w-4" />
            Favorites ({favoriteTools.length})
          </TabsTrigger>
          <TabsTrigger value="recent" className="flex items-center gap-2">
            <Clock className="h-4 w-4" />
            Recent ({recentTools.length})
          </TabsTrigger>
        </TabsList>

        <TabsContent value="all" className="space-y-6">
          {filteredTools.length === 0 ? (
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center py-12"
            >
              <Search className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-medium mb-2">No tools found</h3>
              <p className="text-muted-foreground">Try adjusting your search or filters</p>
            </motion.div>
          ) : (
            <div className={
              viewMode === 'grid' 
                ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6" 
                : "space-y-4"
            }>
              <AnimatePresence>
                {filteredTools.map((tool, index) => 
                  viewMode === 'grid' 
                    ? <ToolCard key={tool.id} tool={tool} index={index} />
                    : <ListToolCard key={tool.id} tool={tool} index={index} />
                )}
              </AnimatePresence>
            </div>
          )}
        </TabsContent>

        <TabsContent value="favorites">
          {favoriteTools.length === 0 ? (
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center py-12"
            >
              <Heart className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-medium mb-2">No favorite tools yet</h3>
              <p className="text-muted-foreground">Add tools to your favorites by clicking the heart icon</p>
            </motion.div>
          ) : (
            <div className={
              viewMode === 'grid' 
                ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6" 
                : "space-y-4"
            }>
              {favoriteTools.map((tool, index) => 
                viewMode === 'grid' 
                  ? <ToolCard key={tool.id} tool={tool} index={index} />
                  : <ListToolCard key={tool.id} tool={tool} index={index} />
              )}
            </div>
          )}
        </TabsContent>

        <TabsContent value="recent">
          {recentTools.length === 0 ? (
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center py-12"
            >
              <Clock className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-medium mb-2">No recently used tools</h3>
              <p className="text-muted-foreground">Tools you use will appear here for quick access</p>
            </motion.div>
          ) : (
            <div className={
              viewMode === 'grid' 
                ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6" 
                : "space-y-4"
            }>
              {recentTools.map((tool, index) => 
                viewMode === 'grid' 
                  ? <ToolCard key={tool.id} tool={tool} index={index} />
                  : <ListToolCard key={tool.id} tool={tool} index={index} />
              )}
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default StudyToolsPage;
