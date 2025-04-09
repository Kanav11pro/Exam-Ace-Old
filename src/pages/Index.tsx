
import { Header } from '@/components/Header';
import { Outlet, useLocation } from 'react-router-dom';

const Index = () => {
  const location = useLocation();

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
