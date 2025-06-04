
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useLocation } from 'react-router-dom';
import { 
  BarChart3, 
  Clock, 
  Calendar, 
  GraduationCap,
  ExternalLink,
  Menu,
  X
} from 'lucide-react';
import { useIsMobile } from '@/hooks/use-mobile';
import {
  Drawer,
  DrawerContent,
  DrawerDescription,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from '@/components/ui/drawer';
import { Button } from '@/components/ui/button';

const TopNavbar = () => {
  const location = useLocation();
  const isMobile = useIsMobile();
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  
  const tabs = [
    {
      id: 'prepometer',
      label: 'Prepometer',
      icon: BarChart3,
      href: '/prepometer',
      isActive: location.pathname === '/prepometer' || location.pathname === '/',
      isExternal: false
    },
    {
      id: 'hours-challenge',
      label: 'Hours Challenge',
      icon: Clock,
      href: 'https://hourschallenge.netlify.app/',
      isActive: false,
      isExternal: true
    },
    {
      id: 'daily-planner',
      label: 'Daily Planner',
      icon: Calendar,
      href: 'https://planjee.netlify.app/',
      isActive: false,
      isExternal: true
    }
  ];

  const handleTabClick = (tab: typeof tabs[0]) => {
    if (tab.isExternal) {
      window.open(tab.href, '_blank', 'noopener,noreferrer');
    } else {
      window.location.href = tab.href;
    }
    setIsDrawerOpen(false);
  };

  const MobileMenu = () => (
    <Drawer open={isDrawerOpen} onOpenChange={setIsDrawerOpen}>
      <DrawerTrigger asChild>
        <Button variant="ghost" size="icon" className="md:hidden">
          <Menu className="h-5 w-5" />
        </Button>
      </DrawerTrigger>
      <DrawerContent>
        <DrawerHeader>
          <DrawerTitle>Navigation</DrawerTitle>
          <DrawerDescription>Choose a tool to navigate to</DrawerDescription>
        </DrawerHeader>
        <div className="p-4 space-y-2">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => handleTabClick(tab)}
                className={`
                  w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors
                  ${tab.isActive 
                    ? 'bg-primary text-primary-foreground' 
                    : 'bg-muted hover:bg-accent text-foreground'
                  }
                `}
              >
                <Icon className="h-5 w-5" />
                <span className="text-base font-medium">{tab.label}</span>
                {tab.isExternal && (
                  <ExternalLink className="h-4 w-4 ml-auto opacity-60" />
                )}
              </button>
            );
          })}
        </div>
      </DrawerContent>
    </Drawer>
  );

  const DesktopTabs = () => (
    <div className="hidden md:flex items-center bg-background/80 backdrop-blur-sm rounded-2xl p-1.5 shadow-inner border">
      {tabs.map((tab) => {
        const Icon = tab.icon;
        return (
          <button
            key={tab.id}
            onClick={() => handleTabClick(tab)}
            className={`
              relative flex items-center gap-2 px-4 py-2.5 rounded-xl font-medium text-sm transition-all duration-300
              ${tab.isActive 
                ? 'bg-primary text-primary-foreground shadow-md' 
                : 'text-muted-foreground hover:text-foreground hover:bg-accent/50'
              }
            `}
          >
            <Icon className={`h-4 w-4 ${tab.isActive ? '' : ''}`} />
            
            <span className="whitespace-nowrap">
              {tab.label}
            </span>
            
            {tab.isExternal && (
              <ExternalLink className="h-3 w-3 opacity-60" />
            )}
          </button>
        );
      })}
    </div>
  );

  return (
    <nav className="sticky top-0 z-50 bg-background/80 backdrop-blur-lg border-b shadow-sm">
      <div className="container max-w-7xl mx-auto px-4 py-4">
        <div className="flex items-center justify-between gap-4">
          {/* Site Title */}
          <div className="flex items-center gap-2">
            <div className="flex items-center justify-center w-8 h-8 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-lg shadow-md">
              <GraduationCap className="h-5 w-5 text-white" />
            </div>
            <h1 className="text-lg sm:text-xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
              Exam-Ace
            </h1>
          </div>

          {/* Desktop Navigation */}
          <DesktopTabs />

          {/* Mobile Navigation */}
          <div className="flex items-center gap-2">
            <MobileMenu />
          </div>
        </div>
      </div>
    </nav>
  );
};

export default TopNavbar;
