import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X, LogOut, ChevronRight } from 'lucide-react';
import useAuthStore from '../store/authStore';
import PageTransition from './PageTransition';

const DashboardLayout = ({ title, children, sidebarLinks, activeTab, onTabChange }) => {
  const { user, logout } = useAuthStore();
  const location = useLocation();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-dark-bg pt-20 flex">
      {/* Mobile Sidebar Overlay */}
      <AnimatePresence>
        {isSidebarOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-slate-900/50 z-40 lg:hidden"
            onClick={() => setIsSidebarOpen(false)}
          />
        )}
      </AnimatePresence>

      {/* Sidebar */}
      <aside className={`fixed lg:sticky top-20 left-0 h-[calc(100vh-5rem)] w-72 bg-white dark:bg-dark-card border-r border-slate-200 dark:border-dark-border z-50 transform transition-transform duration-300 ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'} flex flex-col`}>
        <div className="p-6 border-b border-slate-100 dark:border-dark-border">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-full bg-primary-100 dark:bg-primary-900/50 flex items-center justify-center text-primary-600 dark:text-primary-400 font-bold text-xl">
              {user?.name.charAt(0)}
            </div>
            <div>
              <p className="font-bold text-slate-900 dark:text-white">{user?.name}</p>
              <p className="text-xs text-slate-500 dark:text-slate-400 capitalize">{user?.role} Account</p>
            </div>
          </div>
        </div>

        <nav className="flex-1 overflow-y-auto p-4 space-y-2">
          {sidebarLinks.map((link) => {
            const isActive = activeTab === link.id || (link.path && location.pathname.includes(link.path));
            const LinkEl = link.path ? Link : 'button';
            
            return (
              <LinkEl
                key={link.title}
                to={link.path}
                onClick={() => {
                  if (onTabChange) onTabChange(link.id);
                  setIsSidebarOpen(false);
                }}
                className={`flex items-center gap-3 w-full px-4 py-3 rounded-xl transition-all ${
                  isActive 
                    ? 'bg-primary-50 text-primary-700 dark:bg-primary-900/30 dark:text-primary-400 font-semibold' 
                    : 'text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800'
                }`}
              >
                <link.icon className={`w-5 h-5 ${isActive ? 'text-primary-600 dark:text-primary-400' : 'text-slate-400'}`} />
                {link.title}
                {isActive && <ChevronRight className="w-4 h-4 ml-auto opacity-50" />}
              </LinkEl>
            )
          })}
        </nav>

        <div className="p-4 border-t border-slate-100 dark:border-dark-border">
          <button 
            onClick={logout}
            className="flex items-center gap-3 w-full px-4 py-3 text-red-600 hover:bg-red-50 dark:hover:bg-red-500/10 rounded-xl transition-colors font-medium"
          >
            <LogOut className="w-5 h-5" />
            Sign Out
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 w-full lg:max-w-[calc(100vw-18rem)] overflow-x-hidden">
        <div className="p-6 md:p-8 lg:p-10">
          <div className="flex items-center justify-between mb-8">
            <h1 className="text-3xl font-bold text-slate-900 dark:text-white">{title}</h1>
            <button 
              className="lg:hidden p-2 bg-white dark:bg-dark-card border border-slate-200 dark:border-dark-border rounded-lg"
              onClick={() => setIsSidebarOpen(true)}
            >
              <Menu className="w-6 h-6 text-slate-600 dark:text-slate-300" />
            </button>
          </div>
          <PageTransition>
            {children}
          </PageTransition>
        </div>
      </main>
    </div>
  );
};

export default DashboardLayout;
