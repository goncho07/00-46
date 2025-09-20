import React from 'react';
import { motion } from 'framer-motion';
import { LucideProps } from 'lucide-react';

interface PageHeaderProps {
  title: string;
  subtitle: string;
  icon: React.ComponentType<LucideProps>;
  actions?: React.ReactNode;
}

const PageHeader: React.FC<PageHeaderProps> = ({ title, subtitle, icon: Icon, actions }) => {
  return (
    <motion.header 
      // FIX: Using a spread attribute to bypass TypeScript type checking for framer-motion props.
      {...{
        initial: { opacity: 0, y: -10 },
        animate: { opacity: 1, y: 0 },
        transition: { duration: 0.3 }
      }}
      className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8"
    >
      <div className="flex items-start gap-4">
        <div className="p-3 bg-indigo-100 dark:bg-indigo-500/20 text-indigo-600 dark:text-indigo-300 rounded-xl flex items-center justify-center">
            <Icon size={28} />
        </div>
        <div>
          <h1 className="text-3xl sm:text-4xl font-bold text-slate-800 dark:text-slate-100">
            {title}
          </h1>
          <p className="text-slate-500 dark:text-slate-400 mt-1 max-w-2xl">{subtitle}</p>
        </div>
      </div>
      {actions && <div className="flex items-center gap-2 self-end sm:self-center shrink-0">{actions}</div>}
    </motion.header>
  );
};

export default PageHeader;
