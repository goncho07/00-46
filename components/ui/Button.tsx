import React from 'react';
// FIX: Import HTMLMotionProps to correctly type props for motion components, resolving type conflicts.
import { motion, HTMLMotionProps } from 'framer-motion';
import { LucideProps } from 'lucide-react';

type ButtonVariant = 'primary' | 'secondary' | 'tertiary' | 'danger';

// FIX: Extend HTMLMotionProps<'button'> instead of React.ButtonHTMLAttributes to avoid type conflicts between React's default HTML attributes and framer-motion's props, which was the root cause of the error.
interface ButtonProps extends HTMLMotionProps<'button'> {
  children: React.ReactNode;
  variant?: ButtonVariant;
  icon?: React.ComponentType<LucideProps>;
  className?: string;
}

const Button: React.FC<ButtonProps> = ({ children, variant = 'primary', icon: Icon, className = '', ...props }) => {
  const baseClasses = "flex items-center justify-center gap-2 px-4 py-2 rounded-full text-sm font-semibold transition-all disabled:opacity-50 disabled:cursor-not-allowed focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-indigo-500 dark:focus-visible:ring-offset-slate-900";

  const variantClasses = {
    primary: 'bg-indigo-600 text-white shadow-lg shadow-indigo-500/20 hover:bg-indigo-700',
    secondary: 'bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-700 border border-slate-200 dark:border-slate-700 shadow-sm',
    tertiary: 'bg-transparent text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700',
    danger: 'bg-rose-600 text-white shadow-lg shadow-rose-500/20 hover:bg-rose-700'
  };

  const IconComponent = Icon ? <Icon size={16} /> : null;

  // FIX: Removed the problematic spread attribute wrapper and passed motion props directly, spreading the remaining props. This resolves the TypeScript error.
  return (
    <motion.button
      className={`${baseClasses} ${variantClasses[variant]} ${className}`}
      whileHover={{ scale: 1.03 }}
      whileTap={{ scale: 0.98 }}
      transition={{ type: 'spring', stiffness: 400, damping: 15 }}
      {...props}
    >
      {IconComponent}
      <span>{children}</span>
    </motion.button>
  );
};

export default Button;