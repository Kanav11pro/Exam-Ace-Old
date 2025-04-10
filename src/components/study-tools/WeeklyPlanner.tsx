
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { useToast } from '@/components/ui/use-toast';
import { format, addDays, startOfWeek, subWeeks, addWeeks, isSameDay, parseISO } from 'date-fns';
import { Calendar, Clock, Trash2, Plus, PenLine, AlarmCheck, AlarmClock } from 'lucide-react';

interface StudyTask {
  id: string;
  title: string;
  subject: string;
  date: string; // ISO string
  startTime: string; // 24h format: "14:00"
  endTime: string; // 24h format: "16:00"
  completed: boolean;
}

export function WeeklyPlanner() {
  const [tasks, setTasks] = useState<StudyTask[]>([]);
  const [weekStart, setWeekStart] = useState<Date>(() => startOfWeek(new Date(), { weekStartsOn: 1 }));
  const [selectedDay, setSelectedDay] = useState<Date>(new Date());
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  
  // New task form state
  const [newTask, setNewTask] = useState<Omit<StudyTask, 'id' | 'completed'>>({
    title: '',
    subject: 'Maths',
    date: new Date().toISOString(),
    startTime: '09:00',
    endTime: '10:00',
  });
  
  const { toast } = useToast();
  
  // Load tasks from localStorage
  useEffect(() => {
    const savedTasks = localStorage.getItem('jeeWeeklyPlannerTasks');
    if (savedTasks) {
      try {
        setTasks(JSON.parse(savedTasks));
      } catch (e) {
        console.error('Error loading weekly planner tasks:', e);
        setTasks([]);
      }
    }
  }, []);
  
  // Save tasks to localStorage
  useEffect(() => {
    if (tasks.length > 0) {
      localStorage.setItem('jeeWeeklyPlannerTasks', JSON.stringify(tasks));
    }
  }, [tasks]);
  
  // Generate days of the week
  const weekDays = Array.from({ length: 7 }, (_, i) => addDays(weekStart, i));
  
  // Get readable day name (Monday, Tuesday, etc.)
  const getDayName = (date: Date) => format(date, 'EEEE');
  
  // Go to previous week
  const goToPreviousWeek = () => {
    setWeekStart(subWeeks(weekStart, 1));
  };
  
  // Go to next week
  const goToNextWeek = () => {
    setWeekStart(addWeeks(weekStart, 1));
  };
  
  // Go to current week
  const goToCurrentWeek = () => {
    setWeekStart(startOfWeek(new Date(), { weekStartsOn: 1 }));
    setSelectedDay(new Date());
  };
  
  // Add a new task
  const addTask = () => {
    if (!newTask.title.trim()) {
      toast({
        title: "Title required",
        description: "Please enter a task title",
        variant: "destructive",
      });
      return;
    }
    
    const newTaskComplete: StudyTask = {
      id: Date.now().toString(),
      ...newTask,
      completed: false,
    };
    
    setTasks(prev => [...prev, newTaskComplete]);
    setIsAddDialogOpen(false);
    
    // Reset form
    setNewTask({
      title: '',
      subject: 'Maths',
      date: selectedDay.toISOString(),
      startTime: '09:00',
      endTime: '10:00',
    });
    
    toast({
      title: "Task added",
      description: "Your study task has been added to the planner",
    });
  };
  
  // Toggle task completion status
  const toggleTaskCompletion = (taskId: string) => {
    setTasks(prev => 
      prev.map(task => 
        task.id === taskId ? { ...task, completed: !task.completed } : task
      )
    );
  };
  
  // Delete task
  const deleteTask = (taskId: string) => {
    setTasks(prev => prev.filter(task => task.id !== taskId));
    
    toast({
      title: "Task deleted",
      description: "The task has been removed from your planner",
    });
  };
  
  // Get tasks for a specific day
  const getTasksForDay = (date: Date) => {
    return tasks.filter(task => {
      const taskDate = parseISO(task.date);
      return isSameDay(taskDate, date);
    });
  };
  
  // Handle selecting a day
  const handleDaySelect = (date: Date) => {
    setSelectedDay(date);
    setNewTask(prev => ({
      ...prev,
      date: date.toISOString()
    }));
  };
  
  // Format study time display
  const formatTimeRange = (startTime: string, endTime: string) => {
    return `${startTime} - ${endTime}`;
  };
  
  // Calculate duration in hours
  const calculateDuration = (startTime: string, endTime: string) => {
    const [startHour, startMinute] = startTime.split(':').map(Number);
    const [endHour, endMinute] = endTime.split(':').map(Number);
    
    let hours = endHour - startHour;
    let minutes = endMinute - startMinute;
    
    if (minutes < 0) {
      hours -= 1;
      minutes += 60;
    }
    
    if (hours < 0) {
      hours += 24; // Handle next day
    }
    
    return hours + (minutes / 60);
  };
  
  // Get subject color
  const getSubjectColor = (subject: string) => {
    switch (subject) {
      case 'Maths':
        return 'bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-300 border-purple-200 dark:border-purple-800';
      case 'Physics':
        return 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300 border-blue-200 dark:border-blue-800';
      case 'Chemistry':
        return 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300 border-green-200 dark:border-green-800';
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300 border-gray-200 dark:border-gray-700';
    }
  };
  
  // Calculate total study hours for selected day
  const calculateTotalHours = (date: Date) => {
    const dayTasks = getTasksForDay(date);
    return dayTasks.reduce((total, task) => {
      return total + calculateDuration(task.startTime, task.endTime);
    }, 0);
  };
  
  // Calculate weekly totals by subject
  const calculateWeeklyTotals = () => {
    const subjectTotals: Record<string, number> = {
      'Maths': 0,
      'Physics': 0,
      'Chemistry': 0,
      'Other': 0
    };
    
    weekDays.forEach(day => {
      const dayTasks = getTasksForDay(day);
      dayTasks.forEach(task => {
        const duration = calculateDuration(task.startTime, task.endTime);
        if (subjectTotals[task.subject] !== undefined) {
          subjectTotals[task.subject] += duration;
        } else {
          subjectTotals['Other'] += duration;
        }
      });
    });
    
    return subjectTotals;
  };
  
  const weeklyTotals = calculateWeeklyTotals();
  
  return (
    <div className="container max-w-6xl py-6">
      <div className="mb-6">
        <h1 className="text-3xl font-bold mb-2">Weekly Study Planner</h1>
        <p className="text-gray-600 dark:text-gray-300">Organize your study schedule for effective time management</p>
      </div>
      
      <div className="flex flex-col sm:flex-row items-center justify-between mb-6 gap-4">
        <div className="flex items-center space-x-2">
          <Button variant="outline" onClick={goToPreviousWeek}>
            Previous Week
          </Button>
          <Button variant="outline" onClick={goToCurrentWeek}>
            Current Week
          </Button>
          <Button variant="outline" onClick={goToNextWeek}>
            Next Week
          </Button>
        </div>
        
        <h2 className="text-lg font-medium">
          Week of {format(weekStart, 'MMM d')} - {format(addDays(weekStart, 6), 'MMM d, yyyy')}
        </h2>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-7 gap-4 mb-8">
        {weekDays.map((day) => {
          const isToday = isSameDay(day, new Date());
          const isSelected = isSameDay(day, selectedDay);
          const dayTasks = getTasksForDay(day);
          const totalHours = calculateTotalHours(day);
          
          return (
            <Card 
              key={day.toISOString()} 
              className={`cursor-pointer transition-all ${isToday ? 'border-primary' : ''} ${isSelected ? 'ring-2 ring-primary ring-offset-2' : ''}`}
              onClick={() => handleDaySelect(day)}
            >
              <CardHeader className={`p-3 ${isToday ? 'bg-primary/10' : ''}`}>
                <CardTitle className="text-center text-sm">
                  {getDayName(day)}
                  <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                    {format(day, 'MMM d')}
                  </div>
                </CardTitle>
              </CardHeader>
              <CardContent className="p-3">
                <div className="text-center mb-2">
                  <span className="text-xs bg-gray-100 dark:bg-gray-800 px-2 py-1 rounded-full">
                    {totalHours.toFixed(1)} hrs
                  </span>
                </div>
                <div className="space-y-1">
                  {dayTasks.slice(0, 3).map((task) => (
                    <div 
                      key={task.id} 
                      className={`text-xs p-1 rounded border ${getSubjectColor(task.subject)} ${task.completed ? 'opacity-60 line-through' : ''}`}
                    >
                      {task.title.length > 14 ? task.title.substring(0, 14) + '...' : task.title}
                    </div>
                  ))}
                  {dayTasks.length > 3 && (
                    <div className="text-xs text-center text-gray-500">
                      +{dayTasks.length - 3} more
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>
      
      <div className="flex flex-col lg:flex-row gap-6">
        <div className="w-full lg:w-3/4">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="flex justify-between items-center">
                <div>
                  Tasks for {format(selectedDay, 'EEEE, MMMM d')}
                </div>
                <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
                  <DialogTrigger asChild>
                    <Button size="sm">
                      <Plus className="h-4 w-4 mr-2" /> Add Task
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Add Study Task</DialogTitle>
                      <DialogDescription>
                        Schedule a new study session for {format(selectedDay, 'EEEE, MMMM d')}
                      </DialogDescription>
                    </DialogHeader>
                    
                    <div className="grid gap-4 py-4">
                      <div className="grid gap-2">
                        <label htmlFor="task-title" className="text-sm font-medium">Task Title</label>
                        <Input
                          id="task-title"
                          value={newTask.title}
                          onChange={(e) => setNewTask({...newTask, title: e.target.value})}
                          placeholder="E.g., Solve Integration Problems"
                        />
                      </div>
                      
                      <div className="grid gap-2">
                        <label htmlFor="task-subject" className="text-sm font-medium">Subject</label>
                        <Select
                          value={newTask.subject}
                          onValueChange={(value) => setNewTask({...newTask, subject: value})}
                        >
                          <SelectTrigger id="task-subject">
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
                      
                      <div className="grid grid-cols-2 gap-4">
                        <div className="grid gap-2">
                          <label htmlFor="start-time" className="text-sm font-medium">Start Time</label>
                          <Input
                            id="start-time"
                            type="time"
                            value={newTask.startTime}
                            onChange={(e) => setNewTask({...newTask, startTime: e.target.value})}
                          />
                        </div>
                        
                        <div className="grid gap-2">
                          <label htmlFor="end-time" className="text-sm font-medium">End Time</label>
                          <Input
                            id="end-time"
                            type="time"
                            value={newTask.endTime}
                            onChange={(e) => setNewTask({...newTask, endTime: e.target.value})}
                          />
                        </div>
                      </div>
                    </div>
                    
                    <DialogFooter>
                      <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>
                        Cancel
                      </Button>
                      <Button onClick={addTask}>
                        Add to Schedule
                      </Button>
                    </DialogFooter>
                  </DialogContent>
                </Dialog>
              </CardTitle>
            </CardHeader>
            <CardContent>
              {getTasksForDay(selectedDay).length > 0 ? (
                <div className="space-y-3">
                  {getTasksForDay(selectedDay).map((task) => (
                    <div 
                      key={task.id} 
                      className={`border p-3 rounded-lg ${task.completed ? 'bg-gray-50 dark:bg-gray-900/30' : ''}`}
                    >
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between">
                        <div className="flex-1">
                          <div className="flex items-start">
                            <div>
                              <div className={`inline-block px-2 py-1 rounded text-xs mb-2 ${getSubjectColor(task.subject)}`}>
                                {task.subject}
                              </div>
                              <h4 className={`font-medium ${task.completed ? 'line-through text-gray-500 dark:text-gray-400' : ''}`}>
                                {task.title}
                              </h4>
                            </div>
                          </div>
                          <div className="flex items-center mt-1 text-sm text-gray-500 dark:text-gray-400">
                            <Clock className="h-3 w-3 mr-1" />
                            {formatTimeRange(task.startTime, task.endTime)}
                            <span className="mx-2">•</span>
                            {calculateDuration(task.startTime, task.endTime).toFixed(1)} hours
                          </div>
                        </div>
                        
                        <div className="flex items-center mt-2 sm:mt-0">
                          <Button
                            variant="outline"
                            size="sm"
                            className={`mr-2 ${task.completed ? 'border-green-200 text-green-600' : ''}`}
                            onClick={(e) => {
                              e.stopPropagation();
                              toggleTaskCompletion(task.id);
                            }}
                          >
                            {task.completed ? (
                              <>
                                <AlarmCheck className="h-3 w-3 mr-1" /> Completed
                              </>
                            ) : (
                              <>
                                <AlarmClock className="h-3 w-3 mr-1" /> Mark Complete
                              </>
                            )}
                          </Button>
                          
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8 text-red-500 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20"
                            onClick={(e) => {
                              e.stopPropagation();
                              deleteTask(task.id);
                            }}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-12">
                  <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gray-100 dark:bg-gray-800 mb-4">
                    <Calendar className="h-8 w-8 text-gray-400" />
                  </div>
                  <h3 className="text-lg font-medium mb-2">No tasks scheduled</h3>
                  <p className="text-gray-500 dark:text-gray-400 mb-4">
                    Plan your study sessions for {format(selectedDay, 'EEEE')}
                  </p>
                  <Button onClick={() => setIsAddDialogOpen(true)}>
                    <Plus className="h-4 w-4 mr-2" /> Add Study Task
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
        
        <div className="w-full lg:w-1/4">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle>Weekly Summary</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <h4 className="text-sm font-medium mb-2">Total Study Hours</h4>
                  <div className="text-3xl font-bold">
                    {Object.values(weeklyTotals).reduce((a, b) => a + b, 0).toFixed(1)}
                  </div>
                  <div className="text-sm text-gray-500 dark:text-gray-400">
                    hours this week
                  </div>
                </div>
                
                <div>
                  <h4 className="text-sm font-medium mb-2">Subject Breakdown</h4>
                  <div className="space-y-2">
                    {Object.entries(weeklyTotals).map(([subject, hours]) => (
                      <div key={subject} className="flex justify-between items-center">
                        <div className="flex items-center">
                          <div className={`w-3 h-3 rounded-full mr-2 ${
                            subject === 'Maths' ? 'bg-purple-500' :
                            subject === 'Physics' ? 'bg-blue-500' :
                            subject === 'Chemistry' ? 'bg-green-500' :
                            'bg-gray-500'
                          }`} />
                          <span>{subject}</span>
                        </div>
                        <span>{hours.toFixed(1)} hrs</span>
                      </div>
                    ))}
                  </div>
                </div>
                
                <div className="pt-4 border-t">
                  <h4 className="text-sm font-medium mb-2">Study Session Tips</h4>
                  <ul className="text-sm text-gray-600 dark:text-gray-300 space-y-2">
                    <li className="flex items-start">
                      <span className="mr-2">•</span>
                      Take a 5 minute break every 25 minutes
                    </li>
                    <li className="flex items-start">
                      <span className="mr-2">•</span>
                      Review material from the previous day
                    </li>
                    <li className="flex items-start">
                      <span className="mr-2">•</span>
                      Mix up subjects to stay engaged
                    </li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
