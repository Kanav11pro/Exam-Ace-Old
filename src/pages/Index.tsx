
import { Header } from '@/components/Header';
import { Sidebar } from '@/components/Sidebar';
import { Outlet, useLocation } from 'react-router-dom';
import { useIsMobile } from '@/hooks/use-mobile';
import { motion } from 'framer-motion';

const Index = () => {
  const location = useLocation();
  const isMobile = useIsMobile();
  const showSidebar = location.pathname !== '/auth' && !isMobile;

  return (
    <div className="min-h-screen flex flex-col bg-gray-50 dark:bg-gray-950 relative overflow-hidden">
      {/* Decorative SVG elements for study theme */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        {/* Abstract book shapes */}
        <motion.div 
          className="absolute top-10 right-[5%] w-24 h-32 bg-indigo-100 dark:bg-indigo-900/20 rounded-lg opacity-30"
          animate={{ 
            rotate: [0, 5, 0, -5, 0],
            y: [0, 10, 0]
          }}
          transition={{ 
            duration: 20, 
            repeat: Infinity,
            repeatType: "reverse"
          }}
        />
        <motion.div 
          className="absolute top-[35%] left-[3%] w-16 h-20 bg-green-100 dark:bg-green-900/20 rounded-lg opacity-20"
          animate={{ 
            rotate: [0, -5, 0, 5, 0],
            y: [0, -10, 0]
          }}
          transition={{ 
            duration: 15, 
            repeat: Infinity,
            repeatType: "reverse",
            delay: 2
          }}
        />
        <motion.div 
          className="absolute bottom-[15%] right-[8%] w-20 h-28 bg-amber-100 dark:bg-amber-900/20 rounded-lg opacity-25"
          animate={{ 
            rotate: [0, 8, 0, -8, 0],
            y: [0, 15, 0]
          }}
          transition={{ 
            duration: 25, 
            repeat: Infinity,
            repeatType: "reverse",
            delay: 5
          }}
        />
        
        {/* Floating mathematical symbols */}
        <div className="hidden md:block">
          {["∫", "∑", "π", "√", "Δ", "∞", "θ", "≈", "≠", "α", "β", "λ"].map((symbol, index) => (
            <motion.div
              key={index}
              className="absolute text-gray-300 dark:text-gray-700 text-opacity-20 font-serif"
              style={{
                fontSize: `${Math.random() * 3 + 1}rem`,
                left: `${Math.random() * 90 + 5}%`,
                top: `${Math.random() * 80 + 10}%`,
              }}
              animate={{
                y: [0, Math.random() * 30 - 15],
                opacity: [0.1, 0.3, 0.1],
                rotate: [0, Math.random() * 40 - 20]
              }}
              transition={{
                duration: Math.random() * 20 + 10,
                repeat: Infinity,
                repeatType: "reverse",
                delay: Math.random() * 5
              }}
            >
              {symbol}
            </motion.div>
          ))}
        </div>
        
        {/* Radial gradient background effects */}
        <div className="absolute inset-0 bg-gradient-radial from-indigo-50/10 to-transparent dark:from-indigo-950/10 opacity-70" />
      </div>
      
      {location.pathname !== '/auth' && <Header />}
      
      <div className="flex flex-1 relative">
        {showSidebar && <Sidebar />}
        
        <motion.main 
          className={`flex-1 pb-6 relative ${showSidebar ? 'md:pl-[72px]' : ''}`}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          key={location.pathname}
        >
          <Outlet />
        </motion.main>
      </div>
      
      <footer className="py-4 px-4 md:px-6 border-t relative z-10">
        <div className="container mx-auto text-center text-sm text-gray-500 dark:text-gray-400">
          <p>© {new Date().getFullYear()} JEE Prepometer. All rights reserved.</p>
        </div>
      </footer>
      
      {/* Global CSS for study-themed styling with fix for navigation dropdown overlap */}
      <style>
        {`
        /* Navigation menu fixes */
        .navigation-menu-content {
          z-index: 1000;
          background-color: var(--background);
          border: 1px solid var(--border);
          border-radius: 0.5rem;
          box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1);
          overflow: hidden;
        }
        
        /* 3D book effect for cards */
        .book-card {
          box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05);
          transform-style: preserve-3d;
          transition: all 0.3s ease;
        }
        
        .book-card:hover {
          transform: rotateX(5deg) rotateY(-5deg);
          box-shadow: 15px 15px 20px rgba(0, 0, 0, 0.2);
        }
        
        /* Study blobs */
        .study-blob {
          position: absolute;
          border-radius: 50%;
          filter: blur(50px);
          opacity: 0.15;
          z-index: -1;
        }
        
        .study-blob-1 {
          width: 300px;
          height: 300px;
          background: linear-gradient(135deg, #4F46E5, #6366F1);
          top: 10%;
          right: 5%;
          animation: move1 25s infinite alternate;
        }
        
        .study-blob-2 {
          width: 250px;
          height: 250px;
          background: linear-gradient(135deg, #10B981, #34D399);
          bottom: 5%;
          left: 10%;
          animation: move2 20s infinite alternate;
        }
        
        .study-blob-3 {
          width: 200px;
          height: 200px;
          background: linear-gradient(135deg, #F59E0B, #FBBF24);
          top: 30%;
          left: 5%;
          animation: move3 30s infinite alternate;
        }
        
        @keyframes move1 {
          0% { transform: translate(0, 0) scale(1); }
          100% { transform: translate(50px, 20px) scale(1.1); }
        }
        
        @keyframes move2 {
          0% { transform: translate(0, 0) scale(1); }
          100% { transform: translate(-30px, 50px) scale(1.15); }
        }
        
        @keyframes move3 {
          0% { transform: translate(0, 0) scale(1); }
          100% { transform: translate(20px, -40px) scale(0.9); }
        }
        
        /* Glow effects */
        .glow-effect {
          box-shadow: 0 0 15px rgba(79, 70, 229, 0.1);
          position: relative;
        }
        
        .glow-effect::after {
          content: '';
          position: absolute;
          top: -2px;
          left: -2px;
          right: -2px;
          bottom: -2px;
          background: linear-gradient(45deg, #4F46E5, #34D399, #F59E0B, #4F46E5);
          z-index: -1;
          filter: blur(10px);
          opacity: 0;
          transition: opacity 0.3s;
          border-radius: inherit;
        }
        
        .glow-effect:hover::after {
          opacity: 0.4;
        }
        
        /* Button animations */
        .btn-bounce {
          transition: transform 0.2s cubic-bezier(0.34, 1.56, 0.64, 1);
        }
        
        .btn-bounce:hover {
          transform: scale(1.1);
        }
        
        .btn-bounce:active {
          transform: scale(0.95);
        }
        `}
      </style>
    </div>
  );
};

export default Index;
