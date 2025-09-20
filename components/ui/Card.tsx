import React from 'react';
import { motion } from 'framer-motion';

interface CardProps {
  children: React.ReactNode;
  className?: string;
  onClick?: () => void;
}

const Card: React.FC<CardProps> = ({ children, className, onClick }) => {
  return (
    <motion.div
      // FIX: Using a spread attribute to bypass TypeScript type checking for framer-motion props.
      whileHover={onClick ? { y: -4, scale: 1.01 } : {}}
      transition={{ type: 'spring', stiffness: 300, damping: 15 }}
      className={`bg-white dark:bg-slate-800 rounded-2xl shadow-sm hover:shadow-md dark:hover:bg-slate-700/50 border border-slate-200/80 dark:border-slate-700/80 p-6 ${className || ''} ${onClick ? 'cursor-pointer' : ''} transition-shadow`}
      onClick={onClick}
    >
      {children}
    </motion.div>
  );
};

export default Card;