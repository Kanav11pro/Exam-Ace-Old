
import { Link } from 'react-router-dom';
import { useJEEData } from '@/context/jee'; // Updated import path
import { ProgressBar } from './ProgressBar';
import { subjectIcons } from '@/data/jeeData';

interface SubjectCardProps {
  subject: string;
  variant: 'maths' | 'physics' | 'chemistry' | 'dashboard';
}

export function SubjectCard({ subject, variant }: SubjectCardProps) {
  const { getSubjectProgress, getTotalProgress } = useJEEData();
  
  // Calculate the progress percentage based on subject or total
  const progress = subject === 'Dashboard' 
    ? getTotalProgress() 
    : getSubjectProgress(subject);

  return (
    <Link
      to={subject === 'Dashboard' ? '/dashboard' : `/subject/${subject}`}
      className={`subject-card subject-card-${variant} p-6 h-40 flex flex-col justify-between group`}
    >
      <div className="flex justify-between items-start">
        <h2 className="text-2xl font-bold">{subject}</h2>
        <span className="text-4xl" role="img" aria-label={subject}>
          {subjectIcons[subject as keyof typeof subjectIcons]}
        </span>
      </div>
      
      <div className="mt-auto">
        <ProgressBar 
          progress={progress} 
          variant={variant} 
          showPercentage 
        />
      </div>
    </Link>
  );
}
