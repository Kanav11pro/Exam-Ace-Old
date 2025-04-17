
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { useJEEData } from '@/context/jee'; // Changed from '@/context/JEEDataContext'
import { categoryLabels } from '@/data/jeeData';

interface CategoryProgressChartProps {
  subject: string;
}

export function CategoryProgressChart({ subject }: CategoryProgressChartProps) {
  const { jeeData, getProgressByCategory } = useJEEData();
  
  const chapters = Object.keys(jeeData.subjects[subject] || {});
  
  // Calculate average progress for each category
  const categoryProgress = {
    learn: 0,
    practice: 0,
    tests: 0,
    revise: 0
  };
  
  if (chapters.length > 0) {
    for (const category of ['learn', 'practice', 'tests', 'revise'] as const) {
      const totalProgress = chapters.reduce(
        (sum, chapter) => sum + getProgressByCategory(subject, chapter, category),
        0
      );
      categoryProgress[category] = Math.round(totalProgress / chapters.length);
    }
  }
  
  const data = [
    { name: 'Learn', progress: categoryProgress.learn, emoji: '📚' },
    { name: 'Practice', progress: categoryProgress.practice, emoji: '📝' },
    { name: 'Tests', progress: categoryProgress.tests, emoji: '🧪' },
    { name: 'Revise', progress: categoryProgress.revise, emoji: '🔄' }
  ];

  // Define colors based on subject
  const barColor = subject === 'Maths' 
    ? '#0891b2' 
    : subject === 'Physics' 
      ? '#15803d' 
      : '#f97316';

  return (
    <div className="h-64">
      <h3 className="text-center font-medium mb-2">{subject} - Category Progress</h3>
      <ResponsiveContainer width="100%" height="100%">
        <BarChart
          data={data}
          margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="name" tick={{ fontSize: 12 }} />
          <YAxis
            tickFormatter={(value) => `${value}%`}
            domain={[0, 100]}
          />
          <Tooltip
            formatter={(value: number) => [`${value}%`, 'Progress']}
            labelFormatter={(label) => {
              const item = data.find(d => d.name === label);
              return `${item?.emoji} ${label}`;
            }}
            contentStyle={{ 
              backgroundColor: 'rgba(255, 255, 255, 0.9)',
              borderRadius: '0.5rem',
              border: 'none',
              boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)'
            }}
          />
          <Bar 
            dataKey="progress" 
            fill={barColor} 
            radius={[4, 4, 0, 0]} 
            animationDuration={1500}
          />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
