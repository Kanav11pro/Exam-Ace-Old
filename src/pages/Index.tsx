
import { Header } from '@/components/Header';
import { Sidebar } from '@/components/Sidebar';
import { Outlet, useLocation } from 'react-router-dom';
import { useIsMobile } from '@/hooks/use-mobile';
import { motion } from 'framer-motion';

const Index = () => {
  const location = useLocation();
  const isMobile = useIsMobile();
  const showSidebar = location.pathname !== '/auth';

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-background via-background/98 to-primary/5 relative overflow-hidden">
      {/* Enhanced Decorative Background */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden -z-10">
        {/* Dynamic gradient blobs */}
        <motion.div 
          className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-br from-primary/20 via-secondary/20 to-accent/20 rounded-full blur-3xl opacity-60"
          animate={{ 
            scale: [1, 1.3, 1],
            rotate: [0, 180, 360],
            x: [0, 50, 0],
            y: [0, 30, 0]
          }}
          transition={{ 
            duration: 30, 
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />
        <motion.div 
          className="absolute bottom-0 left-0 w-80 h-80 bg-gradient-to-tr from-secondary/20 via-accent/20 to-primary/20 rounded-full blur-3xl opacity-50"
          animate={{ 
            scale: [1.2, 1, 1.2],
            rotate: [360, 180, 0],
            x: [0, -30, 0],
            y: [0, -40, 0]
          }}
          transition={{ 
            duration: 25, 
            repeat: Infinity,
            ease: "easeInOut",
            delay: 5
          }}
        />
        
        {/* Floating particles */}
        {Array.from({ length: 20 }).map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-2 h-2 bg-gradient-to-r from-primary/30 to-secondary/30 rounded-full"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
            }}
            animate={{
              y: [0, -100, 0],
              opacity: [0, 1, 0],
              scale: [0, 1, 0],
            }}
            transition={{
              duration: Math.random() * 10 + 10,
              repeat: Infinity,
              delay: Math.random() * 5,
              ease: "easeInOut"
            }}
          />
        ))}

        {/* Grid pattern overlay */}
        <div className="absolute inset-0 opacity-5">
          <div className="grid grid-cols-12 h-full gap-4 p-4">
            {Array.from({ length: 144 }).map((_, i) => (
              <div key={i} className="border border-current opacity-20" />
            ))}
          </div>
        </div>
      </div>
      
      {location.pathname !== '/auth' && <Header />}
      
      <div className="flex flex-1 relative">
        {showSidebar && <Sidebar />}
        
        <motion.main 
          className={`flex-1 pb-6 relative overflow-x-hidden ${
            showSidebar && !isMobile ? 'md:ml-[72px]' : ''
          }`}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, ease: "easeOut" }}
          key={location.pathname}
        >
          <div className="min-h-full px-4 sm:px-6 lg:px-8">
            <Outlet />
          </div>
        </motion.main>
      </div>
      
      <footer className="py-6 px-4 md:px-6 border-t border-border/50 bg-background/80 backdrop-blur-sm relative z-10">
        <div className="container mx-auto">
          <div className="text-center text-sm text-muted-foreground space-y-2">
            <p className="font-medium">© {new Date().getFullYear()} JEE Prepometer. All rights reserved.</p>
            <p className="text-xs">Revolutionizing JEE preparation with AI-powered insights</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;
