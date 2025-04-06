
import { useAuth } from '@/context/AuthContext';
import { LoginModal } from '@/components/LoginModal';
import { Header } from '@/components/Header';
import { Outlet } from 'react-router-dom';

const Index = () => {
  const { user, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-pulse text-lg">Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col">
      {!user && <LoginModal />}
      <Header />
      <main className="flex-1">
        <Outlet />
      </main>
    </div>
  );
};

export default Index;
