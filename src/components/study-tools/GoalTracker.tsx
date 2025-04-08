
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { useToast } from '@/components/ui/use-toast';
import { CircleCheck, Target, Calendar, Trash2, Clock, CheckCircle2, Edit2, Plus } from 'lucide-react';
import { motion } from 'framer-motion';

type Goal = {
  id: string;
  title: string;
  description: string;
  subject?: string;
  deadline?: string;
  progress: number;
  milestones: {
    id: string;
    title: string;
    completed: boolean;
  }[];
  createdAt: string;
  completed: boolean;
  completedAt?: string;
};

export function GoalTracker() {
  const [goals, setGoals] = useState<Goal[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [editingGoal, setEditingGoal] = useState<Goal | null>(null);
  
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [subject, setSubject] = useState("");
  const [deadline, setDeadline] = useState("");
  const [milestones, setMilestones] = useState<{id: string; title: string; completed: boolean}[]>([]);
  const [newMilestone, setNewMilestone] = useState("");
  const [filter, setFilter] = useState<'all' | 'active' | 'completed'>('all');
  const [sortBy, setSortBy] = useState<'recent' | 'deadline' | 'progress'>('recent');
  
  const { toast } = useToast();
  
  // Load goals from localStorage on component mount
  useEffect(() => {
    const savedGoals = localStorage.getItem('jeeGoals');
    if (savedGoals) {
      try {
        setGoals(JSON.parse(savedGoals));
      } catch (e) {
        console.error('Error loading goals:', e);
        setGoals([]);
      }
    }
  }, []);
  
  // Save goals to localStorage when they change
  useEffect(() => {
    localStorage.setItem('jeeGoals', JSON.stringify(goals));
  }, [goals]);
  
  // Add milestone to current form
  const addMilestone = () => {
    if (!newMilestone.trim()) return;
    
    const milestone = {
      id: Date.now().toString(),
      title: newMilestone,
      completed: false
    };
    
    setMilestones([...milestones, milestone]);
    setNewMilestone("");
  };
  
  // Remove milestone from current form
  const removeMilestone = (id: string) => {
    setMilestones(milestones.filter(m => m.id !== id));
  };
  
  // Save or update goal
  const saveGoal = () => {
    if (!title.trim()) {
      toast({
        title: "Title required",
        description: "Please enter a title for your goal",
        variant: "destructive"
      });
      return;
    }
    
    if (editingGoal) {
      // Update existing goal
      setGoals(goals.map(goal => 
        goal.id === editingGoal.id ? {
          ...goal,
          title,
          description,
          subject: subject || undefined,
          deadline: deadline || undefined,
          milestones,
        } : goal
      ));
      
      toast({
        title: "Goal updated",
        description: "Your goal has been updated successfully"
      });
    } else {
      // Create new goal
      const newGoal: Goal = {
        id: Date.now().toString(),
        title,
        description,
        subject: subject || undefined,
        deadline: deadline || undefined,
        progress: 0,
        milestones,
        createdAt: new Date().toISOString(),
        completed: false
      };
      
      setGoals([newGoal, ...goals]);
      
      toast({
        title: "Goal created",
        description: "Your goal has been created successfully"
      });
    }
    
    // Reset form
    resetForm();
  };
  
  // Reset form
  const resetForm = () => {
    setTitle("");
    setDescription("");
    setSubject("");
    setDeadline("");
    setMilestones([]);
    setNewMilestone("");
    setEditingGoal(null);
    setShowForm(false);
  };
  
  // Edit goal
  const editGoal = (goal: Goal) => {
    setTitle(goal.title);
    setDescription(goal.description);
    setSubject(goal.subject || "");
    setDeadline(goal.deadline || "");
    setMilestones([...goal.milestones]);
    setEditingGoal(goal);
    setShowForm(true);
  };
  
  // Delete goal
  const deleteGoal = (id: string) => {
    setGoals(goals.filter(goal => goal.id !== id));
    
    toast({
      title: "Goal deleted",
      description: "Your goal has been deleted successfully"
    });
  };
  
  // Toggle milestone completion
  const toggleMilestone = (goalId: string, milestoneId: string) => {
    setGoals(goals.map(goal => {
      if (goal.id === goalId) {
        const updatedMilestones = goal.milestones.map(milestone => 
          milestone.id === milestoneId ? { ...milestone, completed: !milestone.completed } : milestone
        );
        
        // Calculate new progress
        const completedCount = updatedMilestones.filter(m => m.completed).length;
        const newProgress = updatedMilestones.length > 0 
          ? Math.round((completedCount / updatedMilestones.length) * 100) 
          : 0;
          
        return {
          ...goal,
          milestones: updatedMilestones,
          progress: newProgress,
          completed: newProgress === 100,
          completedAt: newProgress === 100 ? new Date().toISOString() : goal.completedAt
        };
      }
      return goal;
    }));
  };
  
  // Toggle goal completion
  const toggleGoalCompletion = (goal: Goal) => {
    setGoals(goals.map(g => {
      if (g.id === goal.id) {
        const completed = !g.completed;
        return {
          ...g,
          completed,
          completedAt: completed ? new Date().toISOString() : undefined,
          progress: completed ? 100 : g.milestones.filter(m => m.completed).length / g.milestones.length * 100
        };
      }
      return g;
    }));
    
    toast({
      title: goal.completed ? "Goal marked as incomplete" : "Goal completed",
      description: goal.completed 
        ? "You can continue working on this goal" 
        : "Congratulations on completing your goal!"
    });
  };
  
  // Filter and sort goals
  const filteredSortedGoals = [...goals]
    .filter(goal => {
      if (filter === 'all') return true;
      return filter === 'completed' ? goal.completed : !goal.completed;
    })
    .sort((a, b) => {
      if (sortBy === 'deadline') {
        if (!a.deadline) return 1;
        if (!b.deadline) return -1;
        return new Date(a.deadline).getTime() - new Date(b.deadline).getTime();
      } else if (sortBy === 'progress') {
        return b.progress - a.progress;
      } else {
        // recent
        return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
      }
    });
  
  return (
    <div className="animate-fade-in space-y-6">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
          <div>
            <h2 className="text-2xl font-bold flex items-center gap-2">
              <Target className="h-6 w-6" />
              Goal Tracker
            </h2>
            <p className="text-gray-500 dark:text-gray-400">Set academic goals and track your progress</p>
          </div>
          
          <Button 
            onClick={() => setShowForm(!showForm)}
            className={showForm ? 'bg-gray-500' : ''}
          >
            {showForm ? 'Cancel' : (
              <>
                <Plus className="mr-2 h-4 w-4" />
                New Goal
              </>
            )}
          </Button>
        </div>
        
        {showForm && (
          <motion.div 
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4 mb-6"
          >
            <h3 className="text-lg font-medium mb-4">
              {editingGoal ? 'Edit Goal' : 'Create New Goal'}
            </h3>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">Goal Title *</label>
                <Input
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="E.g., Master Calculus"
                  className="w-full"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-1">Description</label>
                <Input
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Briefly describe your goal"
                  className="w-full"
                />
              </div>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-1">Subject (Optional)</label>
                  <Select
                    value={subject}
                    onValueChange={setSubject}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select a subject" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="">None</SelectItem>
                      <SelectItem value="Maths">Mathematics</SelectItem>
                      <SelectItem value="Physics">Physics</SelectItem>
                      <SelectItem value="Chemistry">Chemistry</SelectItem>
                      <SelectItem value="General">General</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium mb-1">Deadline (Optional)</label>
                  <Input
                    type="date"
                    value={deadline}
                    onChange={(e) => setDeadline(e.target.value)}
                    className="w-full"
                  />
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-2">Milestones</label>
                
                <div className="flex gap-2 mb-2">
                  <Input
                    value={newMilestone}
                    onChange={(e) => setNewMilestone(e.target.value)}
                    placeholder="Add a milestone"
                    className="flex-1"
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' && newMilestone.trim()) {
                        e.preventDefault();
                        addMilestone();
                      }
                    }}
                  />
                  <Button onClick={addMilestone} disabled={!newMilestone.trim()}>Add</Button>
                </div>
                
                <ul className="space-y-2 mt-3">
                  {milestones.map((milestone) => (
                    <li 
                      key={milestone.id}
                      className="flex items-center justify-between bg-white dark:bg-gray-800 p-2 rounded-md"
                    >
                      <span>{milestone.title}</span>
                      <Button 
                        variant="ghost" 
                        size="icon"
                        onClick={() => removeMilestone(milestone.id)}
                        className="h-8 w-8 text-red-500 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-900/20"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </li>
                  ))}
                  
                  {milestones.length === 0 && (
                    <li className="text-gray-500 dark:text-gray-400 text-sm">
                      No milestones yet. Add some to track progress.
                    </li>
                  )}
                </ul>
              </div>
              
              <div className="flex justify-end gap-2 pt-2">
                <Button variant="outline" onClick={resetForm}>Cancel</Button>
                <Button onClick={saveGoal}>
                  {editingGoal ? 'Update Goal' : 'Create Goal'}
                </Button>
              </div>
            </div>
          </motion.div>
        )}
        
        <div className="flex flex-col sm:flex-row gap-3 mb-4">
          <Select value={filter} onValueChange={(value) => setFilter(value as any)}>
            <SelectTrigger className="w-full sm:w-40">
              <SelectValue placeholder="Filter" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Goals</SelectItem>
              <SelectItem value="active">Active</SelectItem>
              <SelectItem value="completed">Completed</SelectItem>
            </SelectContent>
          </Select>
          
          <Select value={sortBy} onValueChange={(value) => setSortBy(value as any)}>
            <SelectTrigger className="w-full sm:w-40">
              <SelectValue placeholder="Sort by" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="recent">Most Recent</SelectItem>
              <SelectItem value="deadline">Deadline</SelectItem>
              <SelectItem value="progress">Progress</SelectItem>
            </SelectContent>
          </Select>
        </div>
        
        <div className="space-y-4">
          {filteredSortedGoals.length > 0 ? (
            filteredSortedGoals.map((goal) => (
              <Card 
                key={goal.id} 
                className={`animate-fade-in overflow-hidden ${
                  goal.completed ? 'border-green-200 dark:border-green-900' : ''
                }`}
              >
                <CardContent className="p-5">
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <Button
                          variant="ghost"
                          size="icon"
                          className={`h-8 w-8 rounded-full ${
                            goal.completed 
                              ? 'text-green-500 hover:text-green-600 hover:bg-green-50 dark:hover:bg-green-900/20' 
                              : 'text-gray-400 hover:text-gray-500'
                          }`}
                          onClick={() => toggleGoalCompletion(goal)}
                        >
                          <CircleCheck className="h-6 w-6" />
                        </Button>
                        
                        <h3 className={`font-medium text-lg ${goal.completed ? 'line-through text-gray-500' : ''}`}>
                          {goal.title}
                        </h3>
                      </div>
                      
                      {goal.description && (
                        <p className="text-gray-500 dark:text-gray-400 mt-1 text-sm">
                          {goal.description}
                        </p>
                      )}
                      
                      <div className="flex flex-wrap gap-x-4 gap-y-1 mt-3 text-xs text-gray-500 dark:text-gray-400">
                        {goal.subject && (
                          <div className="flex items-center gap-1">
                            <span>Subject:</span>
                            <span className="font-medium">{goal.subject}</span>
                          </div>
                        )}
                        
                        {goal.deadline && (
                          <div className="flex items-center gap-1">
                            <Calendar className="h-3 w-3" />
                            <span>Due: {new Date(goal.deadline).toLocaleDateString()}</span>
                          </div>
                        )}
                        
                        {goal.completed && goal.completedAt && (
                          <div className="flex items-center gap-1">
                            <CheckCircle2 className="h-3 w-3 text-green-500" />
                            <span>Completed: {new Date(goal.completedAt).toLocaleDateString()}</span>
                          </div>
                        )}
                      </div>
                      
                      <div className="my-3">
                        <div className="flex items-center justify-between text-xs mb-1">
                          <span>Progress</span>
                          <span>{goal.progress}%</span>
                        </div>
                        <Progress value={goal.progress} className="h-2" />
                      </div>
                      
                      {goal.milestones.length > 0 && (
                        <div className="mt-4">
                          <h4 className="text-sm font-medium mb-2">Milestones</h4>
                          <ul className="space-y-1">
                            {goal.milestones.map((milestone) => (
                              <li key={milestone.id} className="text-sm">
                                <div className="flex items-center gap-2">
                                  <Checkbox
                                    id={`milestone-${goal.id}-${milestone.id}`}
                                    checked={milestone.completed}
                                    onCheckedChange={() => toggleMilestone(goal.id, milestone.id)}
                                    disabled={goal.completed}
                                  />
                                  <label 
                                    htmlFor={`milestone-${goal.id}-${milestone.id}`}
                                    className={`cursor-pointer ${milestone.completed ? 'line-through text-gray-500' : ''}`}
                                  >
                                    {milestone.title}
                                  </label>
                                </div>
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}
                    </div>
                    
                    <div className="flex flex-col gap-2">
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 text-gray-500"
                        onClick={() => editGoal(goal)}
                      >
                        <Edit2 className="h-4 w-4" />
                      </Button>
                      
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 text-red-500 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-900/20"
                        onClick={() => deleteGoal(goal.id)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))
          ) : (
            <div className="text-center py-12 text-gray-500 dark:text-gray-400">
              <Target className="h-12 w-12 mx-auto mb-3 opacity-30" />
              <p>No goals found. Create your first goal!</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
