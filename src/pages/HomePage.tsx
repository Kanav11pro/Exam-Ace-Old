
import { SubjectCard } from '@/components/SubjectCard';
import { Card, CardContent } from '@/components/ui/card';
import { Link } from 'react-router-dom';
import { useStudyStats } from '@/context/StudyStatsContext';

const HomePage = () => {
  const { studyStreak, getTotalStudyTime } = useStudyStats();
  
  return (
    <div className="container max-w-6xl py-8">
      <div className="bg-gradient-to-br from-indigo-50 to-purple-50 dark:from-indigo-950 dark:to-purple-950 rounded-lg p-6 mb-8 shadow-md animate-fade-in">
        <h1 className="text-3xl font-bold mb-2 text-center bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
          JEE Prepometer Study Hub
        </h1>
        <p className="text-center text-gray-600 dark:text-gray-300">
          Track your JEE preparation progress and boost your productivity
        </p>
        
        <div className="mt-4 grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="bg-white/70 dark:bg-gray-800/50 p-3 rounded-lg text-center shadow-sm">
            <div className="text-xs text-gray-500 dark:text-gray-400">Study Streak</div>
            <div className="text-xl font-bold">{studyStreak.current} days 🔥</div>
          </div>
          <div className="bg-white/70 dark:bg-gray-800/50 p-3 rounded-lg text-center shadow-sm">
            <div className="text-xs text-gray-500 dark:text-gray-400">Total Study Time</div>
            <div className="text-xl font-bold">{Math.round(getTotalStudyTime() / 60 * 10) / 10}h</div>
          </div>
          <div className="bg-white/70 dark:bg-gray-800/50 p-3 rounded-lg text-center shadow-sm">
            <div className="text-xs text-gray-500 dark:text-gray-400">Tools Available</div>
            <div className="text-xl font-bold">20+</div>
          </div>
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6">
        <SubjectCard 
          subject="Maths" 
          variant="maths" 
        />
        <SubjectCard 
          subject="Physics" 
          variant="physics" 
        />
        <SubjectCard 
          subject="Chemistry" 
          variant="chemistry" 
        />
        <SubjectCard 
          subject="Dashboard" 
          variant="dashboard" 
        />
      </div>
      
      <div className="mt-6">
        <Link to="/tools">
          <Card className="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-950 dark:to-indigo-950 hover:shadow-lg transition-shadow duration-300 animate-fade-in border-0">
            <CardContent className="p-6 flex items-center justify-between">
              <div>
                <h2 className="text-2xl font-bold mb-1">Study Tools</h2>
                <p className="text-gray-600 dark:text-gray-300">
                  Access 20+ productivity tools to enhance your preparation
                </p>
              </div>
              <div className="text-4xl">🧰</div>
            </CardContent>
          </Card>
        </Link>
      </div>
    </div>
  );
};

export default HomePage;
