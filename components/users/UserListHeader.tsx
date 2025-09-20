import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, Shield, GraduationCap, Users2, UsersRound, Save, User } from 'lucide-react';
// FIX: Import GenericUser from types.ts
import { GenericUser } from '../../types';

const TABS = [
    { id: 'Todos', label: 'Todos', icon: UsersRound },
    { id: 'Personal', label: 'Personal', icon: Shield },
    { id: 'Estudiantes', label: 'Estudiantes', icon: GraduationCap },
    { id: 'Apoderados', label: 'Apoderados', icon: Users2 }
];

interface UserListHeaderProps {
    activeTab: string;
    onTabChange: (tabId: string) => void;
    searchTerm: string;
    onSearchChange: (term: string) => void;
    onSaveView: () => void;
    allUsers: GenericUser[];
    onSelect: (user: GenericUser) => void;
}

const UserListHeader: React.FC<UserListHeaderProps> = ({ activeTab, onTabChange, searchTerm, onSearchChange, onSaveView, allUsers, onSelect }) => {
    const [isFocused, setIsFocused] = useState(false);

    const searchSuggestions = useMemo(() => {
        if (!searchTerm) return [];
        return allUsers.filter(user => {
            const name = 'studentCode' in user ? user.fullName : user.name;
            return name.toLowerCase().includes(searchTerm.toLowerCase());
        }).slice(0, 5);
    }, [searchTerm, allUsers]);

    return (
        <div className="space-y-4">
            <div>
                <div className="border-b border-slate-200 dark:border-slate-700">
                    <nav className="-mb-px flex space-x-6" aria-label="Tabs">
                        {TABS.map((tab) => (
                            <button
                                key={tab.id}
                                onClick={() => onTabChange(tab.id)}
                                className={`shrink-0 flex items-center gap-2 px-1 py-4 text-sm font-semibold whitespace-nowrap border-b-2 transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 rounded-t-md ${
                                    activeTab === tab.id
                                        ? 'border-indigo-500 text-indigo-600 dark:text-indigo-400'
                                        : 'border-transparent text-slate-500 hover:border-slate-300 hover:text-slate-700 dark:text-slate-400 dark:hover:border-slate-600 dark:hover:text-slate-200'
                                }`}
                            >
                                <tab.icon size={18} />
                                {tab.label}
                            </button>
                        ))}
                    </nav>
                </div>
            </div>

            <div className="flex items-center gap-2">
                <div className="relative flex-grow">
                    <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
                    <input type="text" value={searchTerm} 
                        onChange={e => onSearchChange(e.target.value)} 
                        onFocus={() => setIsFocused(true)}
                        onBlur={() => setTimeout(() => setIsFocused(false), 150)} // Delay to allow click
                        placeholder="Buscar por nombre, DNI/código, correo..." 
                        className="w-full pl-10 pr-4 py-2.5 border border-slate-200 dark:border-slate-600 rounded-full bg-white dark:bg-slate-700 dark:text-slate-100 focus:ring-2 focus:ring-indigo-500 transition focus:outline-none"
                    />
                    <AnimatePresence>
                    {isFocused && searchSuggestions.length > 0 && (
                        <motion.div 
                            initial={{ opacity: 0, y: -5 }}
                            animate={{ opacity: 1, y: 5 }}
                            exit={{ opacity: 0, y: -5 }}
                            className="absolute top-full mt-1 w-full bg-white dark:bg-slate-800 rounded-lg shadow-lg border border-slate-200 dark:border-slate-700 z-30 overflow-hidden"
                        >
                           <ul>
                                {searchSuggestions.map(user => {
                                    const name = 'studentCode' in user ? user.fullName : user.name;
                                    const role = 'studentCode' in user ? 'Estudiante' : ('relation' in user ? 'Apoderado' : user.category);
                                    return (
                                        <li key={'studentCode' in user ? user.documentNumber : user.dni}>
                                            <button onClick={() => onSelect(user)} className="w-full flex items-center gap-3 p-3 text-left hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors">
                                                <img src={user.avatarUrl} alt={name} className="w-8 h-8 rounded-full" />
                                                <div>
                                                    <p className="font-semibold text-sm text-slate-800 dark:text-slate-100 capitalize">{name.toLowerCase()}</p>
                                                    <p className="text-xs text-slate-500 dark:text-slate-400">{role}</p>
                                                </div>
                                            </button>
                                        </li>
                                    )
                                })}
                           </ul>
                        </motion.div>
                    )}
                    </AnimatePresence>
                </div>
                 <button onClick={onSaveView} className="flex items-center gap-2 px-4 py-2.5 bg-white dark:bg-slate-700 text-slate-600 dark:text-slate-200 text-sm font-semibold rounded-full border border-slate-200 dark:border-slate-600 hover:bg-slate-50 dark:hover:bg-slate-600 transition-colors">
                    <Save size={16} />
                    <span className="hidden md:inline">Guardar Vista</span>
                </button>
            </div>
        </div>
    );
};

export default UserListHeader;