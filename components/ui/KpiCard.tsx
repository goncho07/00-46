import React from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import { LucideProps } from 'lucide-react';

interface KpiCardProps {
  title: string;
  value: string | number;
  icon: React.ComponentType<LucideProps>;
  variant?: 'gradient' | 'flat';
  color?: string; // e.g., 'from-sky-400 to-blue-500' for gradient
  change?: string;
  onClick?: () => void;
  active?: boolean; // for flat variant filtering
  className?: string;
  itemVariants?: any; // For framer-motion variants
}

const KpiCard: React.FC<KpiCardProps> = ({
  title,
  value,
  icon: Icon,
  variant = 'flat',
  color,
  change,
  onClick,
  active = false,
  className = '',
  itemVariants,
}) => {
  const shouldReduceMotion = useReducedMotion();
  const interactiveMotionProps = onClick && !shouldReduceMotion
    ? { whileHover: { y: -3, scale: 1.02 }, transition: { type: 'spring', stiffness: 300, damping: 15 } }
    : {};

  const interactiveProps = onClick
    ? {
        type: 'button' as const,
        onClick,
        'aria-pressed': active,
        'aria-label': `${title}: ${value}`,
        role: 'button' as const,
      }
    : {};

  const BaseComponent = onClick ? motion.button : motion.div;

  if (variant === 'gradient') {
    const Wrapper = onClick ? motion.button : motion.div;
    return (
      <Wrapper
        {...interactiveMotionProps}
        {...interactiveProps}
        {...(itemVariants ? { variants: itemVariants } : {})}
        className={`relative overflow-hidden rounded-2xl text-white p-6 shadow-lg flex flex-col justify-between h-44 bg-gradient-to-br ${color} ${className}`}
      >
        <div className="absolute -right-6 -top-6 text-white/10">
          <Icon size={100} strokeWidth={1.5} />
        </div>
        <div className="relative z-10">
          <p className="font-semibold text-white/90">{title}</p>
          <p className="text-4xl font-bold mt-2">{value}</p>
        </div>
        {change && (
          <div className="relative z-10">
            <span className="text-xs bg-white/20 px-2 py-1 rounded-full font-semibold">{change}</span>
          </div>
        )}
      </Wrapper>
    );
  }

  // Flat variant
  return (
    <BaseComponent
      {...interactiveMotionProps}
      {...interactiveProps}
      className={`p-4 rounded-xl border transition-all duration-200 text-left ${onClick ? 'cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-indigo-500 dark:focus-visible:ring-offset-slate-900' : ''} ${active ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-500/30 border-indigo-600' : 'bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-700/50'} ${className}`}
    >
        <div className="flex items-center justify-between">
            <p className={`font-semibold ${active ? 'text-white/90' : 'text-slate-600 dark:text-slate-300'}`}>{title}</p>
            <Icon size={20} className={active ? 'text-white/80' : 'text-slate-400 dark:text-slate-500'} />
        </div>
        <p className={`text-3xl font-bold mt-2 ${active ? 'text-white' : 'text-slate-800 dark:text-slate-100'}`}>{value}</p>
        {change && (
            <p className={`text-xs mt-1 ${active ? 'text-white/70' : 'text-slate-500 dark:text-slate-400'}`}>{change}</p>
        )}
    </BaseComponent>
  );
};

export default KpiCard;
