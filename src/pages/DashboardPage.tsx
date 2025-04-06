
import { Link } from 'react-router-dom';
import { ChevronLeft } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ProgressChart } from '@/components/ProgressChart';
import { CategoryProgressChart } from '@/components/CategoryProgressChart';
import { WeakChaptersList } from '@/components/WeakChaptersList';

const DashboardPage = () => {
  return (
    <div className="container max-w-6xl py-8">
      <Link to="/" className="inline-flex items-center text-sm text-gray-500 hover:text-gray-700 mb-4">
        <ChevronLeft className="h-4 w-4 mr-1" />
        Back to Home
      </Link>
      
      <h1 className="text-3xl font-bold mb-6">Study Dashboard</h1>
      
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
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        <Card>
          <CardHeader>
            <CardTitle>Maths - Category Breakdown</CardTitle>
          </CardHeader>
          <CardContent>
            <CategoryProgressChart subject="Maths" />
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>Physics - Category Breakdown</CardTitle>
          </CardHeader>
          <CardContent>
            <CategoryProgressChart subject="Physics" />
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>Chemistry - Category Breakdown</CardTitle>
          </CardHeader>
          <CardContent>
            <CategoryProgressChart subject="Chemistry" />
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
