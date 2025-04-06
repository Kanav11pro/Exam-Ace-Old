
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';
import { useJEEData } from '@/context/JEEDataContext';

interface ProgressChartProps {
  subject?: string;
  title: string;
}

export function ProgressChart({ subject, title }: ProgressChartProps) {
  const { getSubjectProgress, getTotalProgress } = useJEEData();
  
  const progress = subject ? getSubjectProgress(subject) : getTotalProgress();
  const remaining = 100 - progress;
  
  const data = [
    { name: 'Completed', value: progress },
    { name: 'Remaining', value: remaining }
  ];

  // Define colors based on subject
  const colors = subject === 'Maths' 
    ? ['#0891b2', '#e2e8f0'] 
    : subject === 'Physics' 
      ? ['#15803d', '#e2e8f0'] 
      : subject === 'Chemistry' 
        ? ['#f97316', '#e2e8f0'] 
        : ['#8b5cf6', '#e2e8f0'];

  return (
    <div className="h-48">
      <h3 className="text-center font-medium mb-2">{title}</h3>
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie
            data={data}
            cx="50%"
            cy="50%"
            innerRadius={60}
            outerRadius={80}
            paddingAngle={5}
            dataKey="value"
            startAngle={90}
            endAngle={-270}
          >
            {data.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={colors[index % colors.length]} />
            ))}
          </Pie>
          <Tooltip 
            formatter={(value: number) => [`${Math.round(value)}%`, 'Progress']}
            contentStyle={{ 
              backgroundColor: 'rgba(255, 255, 255, 0.9)',
              borderRadius: '0.5rem',
              border: 'none',
              boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)'
            }}
          />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
}
