import React from 'react';
import Header from './Header';
import TeacherSidebar from './TeacherSidebar';
import { useUIStore } from '../../store/uiStore';

interface LayoutProps {
  children: React.ReactNode;
}

const TeacherLayout: React.FC<LayoutProps> = ({ children }) => {
  const { isSidebarCollapsed } = useUIStore();

  return (
    <div className="flex h-screen bg-slate-100">
      <TeacherSidebar />
      <div className={`flex flex-col flex-1 transition-all duration-300 ease-in-out ${isSidebarCollapsed ? 'ml-20' : 'ml-64'}`}>
        <Header />
        <main className="flex-1 p-4 sm:p-6 lg:p-8 overflow-y-auto">
            <div className="max-w-screen-2xl mx-auto">
              {children}
            </div>
        </main>
      </div>
    </div>
  );
};

export default TeacherLayout;
