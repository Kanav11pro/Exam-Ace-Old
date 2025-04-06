
import { SubjectCard } from '@/components/SubjectCard';

const HomePage = () => {
  return (
    <div className="container max-w-6xl py-8">
      <h1 className="text-3xl font-bold mb-6 text-center">
        JEE Prepometer Study Hub
      </h1>
      
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
    </div>
  );
};

export default HomePage;
