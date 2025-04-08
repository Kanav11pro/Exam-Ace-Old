
import { Link } from 'react-router-dom';
import { ChevronLeft, Clock, Target, Award, Calendar, TrendingUp, Zap, BarChart } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ProgressChart } from '@/components/ProgressChart';
import { CategoryProgressChart } from '@/components/CategoryProgressChart';
import { WeakChaptersList } from '@/components/WeakChaptersList';
import { useJEEData } from '@/context/JEEDataContext';
import { useStudyStats } from '@/context/StudyStatsContext';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  BarChart as RechartBarChart,
  Bar,
  XAxis,
  YAxis,
  ResponsiveContainer,
  Tooltip,
  LineChart,
  Line,
  CartesianGrid,
  Legend
} from 'recharts';

const DashboardPage = () => {
  const { getWeakChapters } = useJEEData();
  const { getTotalStudyTime, getStudyTimeByDay, studyStreak } = useStudyStats();
  
  const weakChapters = getWeakChapters();
  const totalStudyMinutes = getTotalStudyTime();
  const mathsStudyMinutes = getTotalStudyTime('Maths');
  const physicsStudyMinutes = getTotalStudyTime('Physics');
  const chemistryStudyMinutes = getTotalStudyTime('Chemistry');
  
  // Get study time for last 7 days
  const weeklyData = getStudyTimeByDay(7);
  const weeklyStudyData = Object.entries(weeklyData).map(([date, minutes]) => ({
    date: new Date(date).toLocaleDateString('en-US', { weekday: 'short' }),
    minutes
  })).reverse();
  
  // Generate sample data for more visualizations
  const subjectImportanceData = [
    { name: 'Maths', value: 35 },
    { name: 'Physics', value: 40 },
    { name: 'Chemistry', value: 25 },
  ];
  
  const difficultyDistribution = [
    { level: 'Easy', chapters: 12 },
    { level: 'Medium', chapters: 24 },
    { level: 'Hard', chapters: 14 },
  ];
  
  return (
    <div className="container max-w-6xl py-8">
      <Link to="/" className="inline-flex items-center text-sm text-gray-500 hover:text-gray-700 mb-4">
        <ChevronLeft className="h-4 w-4 mr-1" />
        Back to Home
      </Link>
      
      <h1 className="text-3xl font-bold mb-6">Study Dashboard</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <Card className="bg-gradient-to-br from-purple-50 to-indigo-50 dark:from-indigo-950 dark:to-purple-950 border-none shadow-md hover:shadow-lg transition-shadow animate-fade-in">
          <CardHeader className="pb-2">
            <CardTitle className="text-lg flex items-center">
              <Clock className="h-4 w-4 mr-2 text-purple-500" />
              Total Study Time
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{Math.round(totalStudyMinutes / 60 * 10) / 10}h</div>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              {totalStudyMinutes} minutes logged
            </p>
          </CardContent>
        </Card>
        
        <Card className="bg-gradient-to-br from-green-50 to-emerald-50 dark:from-emerald-950 dark:to-green-950 border-none shadow-md hover:shadow-lg transition-shadow animate-fade-in">
          <CardHeader className="pb-2">
            <CardTitle className="text-lg flex items-center">
              <Target className="h-4 w-4 mr-2 text-green-500" />
              Study Streak
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{studyStreak.current} days 🔥</div>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Longest: {studyStreak.longest} days
            </p>
          </CardContent>
        </Card>
        
        <Card className="bg-gradient-to-br from-amber-50 to-yellow-50 dark:from-yellow-950 dark:to-amber-950 border-none shadow-md hover:shadow-lg transition-shadow animate-fade-in">
          <CardHeader className="pb-2">
            <CardTitle className="text-lg flex items-center">
              <Award className="h-4 w-4 mr-2 text-amber-500" />
              Weak Areas
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{weakChapters.length}</div>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Chapters need improvement
            </p>
          </CardContent>
        </Card>
        
        <Card className="bg-gradient-to-br from-blue-50 to-cyan-50 dark:from-cyan-950 dark:to-blue-950 border-none shadow-md hover:shadow-lg transition-shadow animate-fade-in">
          <CardHeader className="pb-2">
            <CardTitle className="text-lg flex items-center">
              <Calendar className="h-4 w-4 mr-2 text-blue-500" />
              Today's Activity
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{weeklyStudyData[0]?.minutes || 0}m</div>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Minutes today
            </p>
          </CardContent>
        </Card>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">Overall Progress</CardTitle>
          </CardHeader>
          <CardContent>
            <ProgressChart title="All Subjects" />
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">Maths Progress</CardTitle>
          </CardHeader>
          <CardContent>
            <ProgressChart subject="Maths" title="Maths" />
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">Physics Progress</CardTitle>
          </CardHeader>
          <CardContent>
            <ProgressChart subject="Physics" title="Physics" />
          </CardContent>
        </Card>
      </div>
      
      <div className="mb-8">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <TrendingUp className="h-4 w-4 mr-2" />
              Weekly Study Activity
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={weeklyStudyData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="date" />
                  <YAxis label={{ value: 'Minutes', angle: -90, position: 'insideLeft' }} />
                  <Tooltip 
                    formatter={(value) => [`${value} min`, 'Study Time']}
                    contentStyle={{ 
                      backgroundColor: 'rgba(255, 255, 255, 0.9)',
                      borderRadius: '0.5rem',
                      border: 'none',
                      boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)'
                    }}
                  />
                  <Legend />
                  <Bar dataKey="minutes" fill="#8884d8" name="Study Time (minutes)" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        <Card>
          <CardHeader>
            <CardTitle>Subject Distribution</CardTitle>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="progress">
              <TabsList className="mb-4">
                <TabsTrigger value="progress">Progress by Subject</TabsTrigger>
                <TabsTrigger value="time">Study Time</TabsTrigger>
              </TabsList>
              
              <TabsContent value="progress" className="animate-fade-in">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                  <Card>
                    <CardHeader className="p-3">
                      <CardTitle className="text-sm">Maths</CardTitle>
                    </CardHeader>
                    <CardContent className="p-3 pt-0">
                      <CategoryProgressChart subject="Maths" />
                    </CardContent>
                  </Card>
                  
                  <Card>
                    <CardHeader className="p-3">
                      <CardTitle className="text-sm">Physics</CardTitle>
                    </CardHeader>
                    <CardContent className="p-3 pt-0">
                      <CategoryProgressChart subject="Physics" />
                    </CardContent>
                  </Card>
                  
                  <Card>
                    <CardHeader className="p-3">
                      <CardTitle className="text-sm">Chemistry</CardTitle>
                    </CardHeader>
                    <CardContent className="p-3 pt-0">
                      <CategoryProgressChart subject="Chemistry" />
                    </CardContent>
                  </Card>
                </div>
              </TabsContent>
              
              <TabsContent value="time" className="animate-fade-in">
                <div className="h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart 
                      data={[
                        { subject: 'Maths', minutes: mathsStudyMinutes },
                        { subject: 'Physics', minutes: physicsStudyMinutes },
                        { subject: 'Chemistry', minutes: chemistryStudyMinutes },
                      ]}
                      layout="vertical"
                    >
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis type="number" />
                      <YAxis dataKey="subject" type="category" />
                      <Tooltip formatter={(value) => [`${value} min`, 'Study Time']} />
                      <Legend />
                      <Bar 
                        dataKey="minutes" 
                        name="Study Time (minutes)" 
                        fill="#8884d8" 
                        radius={[0, 4, 4, 0]}
                      />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>Advanced Insights</CardTitle>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="importance">
              <TabsList className="mb-4">
                <TabsTrigger value="importance">Subject Importance</TabsTrigger>
                <TabsTrigger value="difficulty">Difficulty</TabsTrigger>
              </TabsList>
              
              <TabsContent value="importance" className="animate-fade-in">
                <div className="h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <RechartBarChart data={subjectImportanceData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="name" />
                      <YAxis />
                      <Tooltip />
                      <Legend />
                      <Bar 
                        dataKey="value" 
                        name="Weightage in JEE (%)" 
                        fill="#82ca9d" 
                        radius={[4, 4, 0, 0]}
                      />
                    </RechartBarChart>
                  </ResponsiveContainer>
                </div>
              </TabsContent>
              
              <TabsContent value="difficulty" className="animate-fade-in">
                <div className="h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={difficultyDistribution}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="level" />
                      <YAxis />
                      <Tooltip />
                      <Legend />
                      <Bar 
                        dataKey="chapters" 
                        name="Number of Chapters" 
                        fill="#ffc658" 
                        radius={[4, 4, 0, 0]}
                      />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Zap className="h-4 w-4 mr-2" />
              Study Efficiency
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart
                  data={[
                    { day: 'Mon', efficiency: 65 },
                    { day: 'Tue', efficiency: 59 },
                    { day: 'Wed', efficiency: 80 },
                    { day: 'Thu', efficiency: 81 },
                    { day: 'Fri', efficiency: 56 },
                    { day: 'Sat', efficiency: 55 },
                    { day: 'Sun', efficiency: 40 },
                  ]}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="day" />
                  <YAxis label={{ value: 'Efficiency %', angle: -90, position: 'insideLeft' }} />
                  <Tooltip />
                  <Legend />
                  <Line 
                    type="monotone" 
                    dataKey="efficiency" 
                    stroke="#8884d8" 
                    name="Study Efficiency (%)"
                    activeDot={{ r: 8 }}
                    strokeWidth={2}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>Weak Areas</CardTitle>
          </CardHeader>
          <CardContent>
            <WeakChaptersList />
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default DashboardPage;
