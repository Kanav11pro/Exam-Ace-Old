
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { X, ChevronLeft, ChevronRight, BookOpen, Target, CheckCircle, Lightbulb } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface StudyTool {
  id: string;
  name: string;
  description: string;
  detailedDescription: string;
  usageGuide: string[];
  benefits: string[];
  icon: React.ReactNode;
  category: 'time' | 'content' | 'practice' | 'wellness' | 'organization';
}

interface StudyToolsGuideProps {
  isOpen: boolean;
  onClose: () => void;
  tools: StudyTool[];
}

export function StudyToolsGuide({ isOpen, onClose, tools }: StudyToolsGuideProps) {
  const [selectedTool, setSelectedTool] = useState<StudyTool | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  const categories = [
    { id: 'all', name: 'All Tools', icon: <BookOpen className="h-4 w-4" /> },
    { id: 'time', name: 'Time Management', icon: <Target className="h-4 w-4" /> },
    { id: 'content', name: 'Content & Notes', icon: <BookOpen className="h-4 w-4" /> },
    { id: 'practice', name: 'Practice & Revision', icon: <CheckCircle className="h-4 w-4" /> },
    { id: 'wellness', name: 'Wellness & Focus', icon: <Lightbulb className="h-4 w-4" /> },
    { id: 'organization', name: 'Organization', icon: <Target className="h-4 w-4" /> }
  ];

  const filteredTools = selectedCategory === 'all' 
    ? tools 
    : tools.filter(tool => tool.category === selectedCategory);

  const getCategoryColor = (category: string) => {
    const colors: Record<string, string> = {
      'time': 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300',
      'content': 'bg-violet-100 text-violet-800 dark:bg-violet-900/30 dark:text-violet-300',
      'practice': 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300',
      'wellness': 'bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-300',
      'organization': 'bg-cyan-100 text-cyan-800 dark:bg-cyan-900/30 dark:text-cyan-300'
    };
    return colors[category] || 'bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-300';
  };

  const currentToolIndex = selectedTool ? filteredTools.findIndex(tool => tool.id === selectedTool.id) : -1;
  
  const goToPreviousTool = () => {
    if (currentToolIndex > 0) {
      setSelectedTool(filteredTools[currentToolIndex - 1]);
    }
  };

  const goToNextTool = () => {
    if (currentToolIndex < filteredTools.length - 1) {
      setSelectedTool(filteredTools[currentToolIndex + 1]);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-6xl h-[90vh] p-0">
        <DialogHeader className="p-6 pb-0">
          <DialogTitle className="text-2xl font-bold flex items-center gap-2">
            <BookOpen className="h-6 w-6 text-blue-600" />
            Study Tools Complete Guide
          </DialogTitle>
        </DialogHeader>
        
        <div className="flex-1 overflow-hidden">
          {!selectedTool ? (
            // Main guide view
            <div className="h-full flex">
              {/* Sidebar */}
              <div className="w-80 bg-gray-50 dark:bg-gray-900 border-r border-gray-200 dark:border-gray-700 p-6 overflow-y-auto">
                <h3 className="font-semibold text-lg mb-4">Categories</h3>
                <div className="space-y-2">
                  {categories.map(category => (
                    <Button
                      key={category.id}
                      variant={selectedCategory === category.id ? 'default' : 'ghost'}
                      className="w-full justify-start"
                      onClick={() => setSelectedCategory(category.id)}
                    >
                      {category.icon}
                      <span className="ml-2">{category.name}</span>
                      <Badge variant="secondary" className="ml-auto">
                        {category.id === 'all' ? tools.length : tools.filter(t => t.category === category.id).length}
                      </Badge>
                    </Button>
                  ))}
                </div>
              </div>
              
              {/* Main content */}
              <div className="flex-1 p-6 overflow-y-auto">
                <div className="mb-6">
                  <h2 className="text-xl font-semibold mb-2">
                    {categories.find(c => c.id === selectedCategory)?.name} 
                    ({filteredTools.length} tools)
                  </h2>
                  <p className="text-gray-600 dark:text-gray-400">
                    Click on any tool to view detailed usage guide and tips
                  </p>
                </div>
                
                <motion.div 
                  className="grid grid-cols-1 md:grid-cols-2 gap-4"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.3 }}
                >
                  {filteredTools.map((tool, index) => (
                    <motion.div
                      key={tool.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.05 }}
                    >
                      <Card 
                        className="cursor-pointer hover:shadow-lg transition-all duration-200 hover:-translate-y-1"
                        onClick={() => setSelectedTool(tool)}
                      >
                        <CardContent className="p-4">
                          <div className="flex items-start gap-3">
                            <div className="bg-gray-100 dark:bg-gray-800 p-2 rounded-lg">
                              {tool.icon}
                            </div>
                            <div className="flex-1">
                              <h3 className="font-semibold text-sm mb-1">{tool.name}</h3>
                              <p className="text-xs text-gray-600 dark:text-gray-400 mb-2">
                                {tool.description}
                              </p>
                              <Badge className={`text-xs ${getCategoryColor(tool.category)}`}>
                                {tool.category}
                              </Badge>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    </motion.div>
                  ))}
                </motion.div>
              </div>
            </div>
          ) : (
            // Detailed tool view
            <AnimatePresence mode="wait">
              <motion.div
                key={selectedTool.id}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.3 }}
                className="h-full overflow-y-auto"
              >
                {/* Tool header */}
                <div className="bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 p-6 border-b border-gray-200 dark:border-gray-700">
                  <div className="flex items-center justify-between mb-4">
                    <Button
                      variant="ghost"
                      onClick={() => setSelectedTool(null)}
                      className="flex items-center gap-2"
                    >
                      <ChevronLeft className="h-4 w-4" />
                      Back to Guide
                    </Button>
                    
                    <div className="flex items-center gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={goToPreviousTool}
                        disabled={currentToolIndex <= 0}
                      >
                        <ChevronLeft className="h-4 w-4" />
                        Previous
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={goToNextTool}
                        disabled={currentToolIndex >= filteredTools.length - 1}
                      >
                        Next
                        <ChevronRight className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-4">
                    <div className="bg-white dark:bg-gray-800 p-4 rounded-xl shadow-lg">
                      {selectedTool.icon}
                    </div>
                    <div>
                      <h1 className="text-2xl font-bold text-gray-800 dark:text-gray-200">
                        {selectedTool.name}
                      </h1>
                      <p className="text-gray-600 dark:text-gray-400 mt-1">
                        {selectedTool.description}
                      </p>
                      <Badge className={`mt-2 ${getCategoryColor(selectedTool.category)}`}>
                        {selectedTool.category}
                      </Badge>
                    </div>
                  </div>
                </div>
                
                {/* Tool content */}
                <div className="p-6">
                  <Tabs defaultValue="overview" className="w-full">
                    <TabsList className="grid w-full grid-cols-3">
                      <TabsTrigger value="overview">Overview</TabsTrigger>
                      <TabsTrigger value="usage">Usage Guide</TabsTrigger>
                      <TabsTrigger value="benefits">Benefits & Tips</TabsTrigger>
                    </TabsList>
                    
                    <TabsContent value="overview" className="mt-6">
                      <Card>
                        <CardHeader>
                          <CardTitle className="flex items-center gap-2">
                            <BookOpen className="h-5 w-5" />
                            What is {selectedTool.name}?
                          </CardTitle>
                        </CardHeader>
                        <CardContent>
                          <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                            {selectedTool.detailedDescription}
                          </p>
                        </CardContent>
                      </Card>
                    </TabsContent>
                    
                    <TabsContent value="usage" className="mt-6">
                      <Card>
                        <CardHeader>
                          <CardTitle className="flex items-center gap-2">
                            <Target className="h-5 w-5" />
                            How to Use {selectedTool.name}
                          </CardTitle>
                        </CardHeader>
                        <CardContent>
                          <div className="space-y-4">
                            {selectedTool.usageGuide.map((step, index) => (
                              <div key={index} className="flex items-start gap-3">
                                <div className="bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-300 rounded-full w-8 h-8 flex items-center justify-center text-sm font-semibold flex-shrink-0">
                                  {index + 1}
                                </div>
                                <p className="text-gray-700 dark:text-gray-300 pt-1">
                                  {step}
                                </p>
                              </div>
                            ))}
                          </div>
                        </CardContent>
                      </Card>
                    </TabsContent>
                    
                    <TabsContent value="benefits" className="mt-6">
                      <Card>
                        <CardHeader>
                          <CardTitle className="flex items-center gap-2">
                            <CheckCircle className="h-5 w-5" />
                            Benefits & Pro Tips
                          </CardTitle>
                        </CardHeader>
                        <CardContent>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                              <h4 className="font-semibold text-green-700 dark:text-green-400 mb-3 flex items-center gap-2">
                                <CheckCircle className="h-4 w-4" />
                                Key Benefits
                              </h4>
                              <ul className="space-y-2">
                                {selectedTool.benefits.map((benefit, index) => (
                                  <li key={index} className="flex items-center gap-2 text-sm">
                                    <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                                    <span className="text-gray-700 dark:text-gray-300">{benefit}</span>
                                  </li>
                                ))}
                              </ul>
                            </div>
                            
                            <div>
                              <h4 className="font-semibold text-amber-700 dark:text-amber-400 mb-3 flex items-center gap-2">
                                <Lightbulb className="h-4 w-4" />
                                Pro Tips
                              </h4>
                              <div className="bg-amber-50 dark:bg-amber-900/20 p-4 rounded-lg">
                                <p className="text-sm text-amber-800 dark:text-amber-300">
                                  💡 Combine this tool with other study tools for maximum effectiveness. 
                                  Start with small sessions and gradually increase duration as you build the habit.
                                </p>
                              </div>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    </TabsContent>
                  </Tabs>
                </div>
              </motion.div>
            </AnimatePresence>
          )}
        </div>
        
        <Button
          variant="ghost"
          size="icon"
          className="absolute top-4 right-4"
          onClick={onClose}
        >
          <X className="h-4 w-4" />
        </Button>
      </DialogContent>
    </Dialog>
  );
}
