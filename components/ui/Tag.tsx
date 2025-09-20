import React from 'react';

const tagColors: { [key: string]: string } = {
    'beca': 'bg-blue-100 text-blue-800 dark:bg-blue-500/20 dark:text-blue-300 ring-1 ring-inset ring-blue-200 dark:ring-blue-500/30',
    'refuerzo': 'bg-amber-100 text-amber-800 dark:bg-amber-500/20 dark:text-amber-300 ring-1 ring-inset ring-amber-200 dark:ring-amber-500/30',
    'tercio': 'bg-emerald-100 text-emerald-800 dark:bg-emerald-500/20 dark:text-emerald-300 ring-1 ring-inset ring-emerald-200 dark:ring-emerald-500/30',
    'convivencia': 'bg-rose-100 text-rose-800 dark:bg-rose-500/20 dark:text-rose-300 ring-1 ring-inset ring-rose-200 dark:ring-rose-500/30',
};

const getDefaultTagColor = (tag: string) => {
    const colors = [
        'bg-slate-100 text-slate-800 dark:bg-slate-700 dark:text-slate-200 ring-1 ring-inset ring-slate-200 dark:ring-slate-600',
        'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200 ring-1 ring-inset ring-gray-200 dark:ring-gray-600',
        'bg-zinc-100 text-zinc-800 dark:bg-zinc-700 dark:text-zinc-200 ring-1 ring-inset ring-zinc-200 dark:ring-zinc-600',
        'bg-stone-100 text-stone-800 dark:bg-stone-700 dark:text-stone-200 ring-1 ring-inset ring-stone-200 dark:ring-stone-600',
    ];
    let hash = 0;
    for (let i = 0; i < tag.length; i++) {
        hash = tag.charCodeAt(i) + ((hash << 5) - hash);
    }
    return colors[Math.abs(hash) % colors.length];
};

const getTagColor = (tag: string): string => {
    const lowerTag = tag.toLowerCase();
    for (const key in tagColors) {
        if (lowerTag.includes(key)) {
            return tagColors[key];
        }
    }
    return getDefaultTagColor(tag);
};

interface TagProps {
  children: React.ReactNode;
  className?: string;
}

const Tag: React.FC<TagProps> = ({ children, className = '' }) => {
    const colorClass = typeof children === 'string' ? getTagColor(children) : getDefaultTagColor('default');
    return (
        <span className={`inline-block px-2 py-0.5 text-xs font-semibold rounded-full ${colorClass} ${className}`}>
            {children}
        </span>
    );
};

export default Tag;