
import { useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import { Header } from '@/components/Header';
import { Outlet, useNavigate, useLocation } from 'react-router-dom';

const Index = () => {
  const { user, isLoading } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    // Redirect to login page if user is not authenticated
    if (!isLoading && !user && location.pathname !== '/auth') {
      navigate('/auth');
    }
  }, [user, isLoading, navigate, location.pathname]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-gray-950 dark:to-indigo-950">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-t-blue-600 border-b-blue-600 border-r-transparent border-l-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <div className="text-lg font-medium text-gray-700 dark:text-gray-300">Loading...</div>
        </div>
      </div>
    );
  }

  // If not logged in, don't render the main layout
  if (!user && location.pathname !== '/auth') {
    return null;
  }

  return (
    <div className="min-h-screen flex flex-col bg-gray-50 dark:bg-gray-950">
      {location.pathname !== '/auth' && <Header />}
      <main className="flex-1">
        <Outlet />
      </main>
    </div>
  );
};

export default Index;
