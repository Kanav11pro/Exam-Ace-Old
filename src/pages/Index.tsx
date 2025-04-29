
import { Header } from '@/components/Header';
import { Sidebar } from '@/components/Sidebar';
import { Outlet, useLocation } from 'react-router-dom';
import { useIsMobile } from '@/hooks/use-mobile';

const Index = () => {
  const location = useLocation();
  const isMobile = useIsMobile();
  const showSidebar = location.pathname !== '/auth' && !isMobile;

  return (
    <div className="min-h-screen flex flex-col bg-gray-50 dark:bg-gray-950">
      {location.pathname !== '/auth' && <Header />}
      
      <div className="flex flex-1 relative">
        {showSidebar && <Sidebar />}
        
        <main className={`flex-1 pb-6 ${showSidebar ? 'md:pl-[72px]' : ''}`}>
          <Outlet />
        </main>
      </div>
      
      <footer className="py-4 px-4 md:px-6 border-t">
        <div className="container mx-auto text-center text-sm text-gray-500 dark:text-gray-400">
          <p>© {new Date().getFullYear()} JEE Prepometer. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
};

export default Index;
