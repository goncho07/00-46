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
    const [highlightedIndex, setHighlightedIndex] = useState<number>(-1);
    const suggestionsListId = React.useId();
    const tablistId = React.useId();

    const searchSuggestions = useMemo(() => {
        if (!searchTerm) return [];
        const term = searchTerm.toLowerCase().trim();
        return allUsers.filter(user => {
            const name = 'studentCode' in user ? user.fullName : user.name;
            const code = 'studentCode' in user ? user.studentCode : user.dni;
            const email = 'relation' in user ? user.email : `${code}@colegio.edu.pe`;
            return name.toLowerCase().includes(term) || code.includes(term) || email.toLowerCase().includes(term);
        }).slice(0, 5);
    }, [searchTerm, allUsers]);

    const tabCounts = useMemo(() => {
        const base = { Todos: allUsers.length, Personal: 0, Estudiantes: 0, Apoderados: 0 } as Record<string, number>;
        allUsers.forEach(user => {
            if ('studentCode' in user) {
                base.Estudiantes += 1;
            } else if ('relation' in user) {
                base.Apoderados += 1;
            } else {
                base.Personal += 1;
            }
        });
        return base;
    }, [allUsers]);

    const handleOptionSelect = (user: GenericUser) => {
        onSelect(user);
        setHighlightedIndex(-1);
        setIsFocused(false);
    };

    const handleKeyDown: React.KeyboardEventHandler<HTMLInputElement> = (event) => {
        if (!isFocused && ['ArrowDown', 'ArrowUp'].includes(event.key)) {
            setIsFocused(true);
        }

        switch (event.key) {
            case 'ArrowDown':
                event.preventDefault();
                setHighlightedIndex(prev => {
                    const nextIndex = prev + 1;
                    return nextIndex >= searchSuggestions.length ? 0 : nextIndex;
                });
                break;
            case 'ArrowUp':
                event.preventDefault();
                setHighlightedIndex(prev => {
                    if (searchSuggestions.length === 0) return -1;
                    const nextIndex = prev - 1;
                    return nextIndex < 0 ? searchSuggestions.length - 1 : nextIndex;
                });
                break;
            case 'Enter':
                if (highlightedIndex >= 0 && searchSuggestions[highlightedIndex]) {
                    event.preventDefault();
                    handleOptionSelect(searchSuggestions[highlightedIndex]);
                }
                break;
            case 'Escape':
                setIsFocused(false);
                setHighlightedIndex(-1);
                break;
        }
    };

    React.useEffect(() => {
        if (searchSuggestions.length === 0) {
            setHighlightedIndex(-1);
        } else if (highlightedIndex >= searchSuggestions.length) {
            setHighlightedIndex(searchSuggestions.length - 1);
        }
    }, [searchSuggestions, highlightedIndex]);

    return (
        <div className="space-y-4">
            <div>
                <div className="border-b border-slate-200 dark:border-slate-700">
                    <nav className="-mb-px flex space-x-6" aria-label="Cambiar segmento de usuarios" role="tablist" id={tablistId}>
                        {TABS.map((tab) => {
                            const isActive = activeTab === tab.id;
                            const count = tabCounts[tab.id] ?? tabCounts.Todos;
                            return (
                                <button
                                    key={tab.id}
                                    type="button"
                                    onClick={() => onTabChange(tab.id)}
                                    role="tab"
                                    aria-selected={isActive}
                                    aria-controls="users-panel"
                                    className={`shrink-0 flex items-center gap-2 px-1 py-4 text-sm font-semibold whitespace-nowrap border-b-2 transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 rounded-t-md ${
                                        isActive
                                            ? 'border-indigo-500 text-indigo-600 dark:text-indigo-400'
                                            : 'border-transparent text-slate-500 hover:border-slate-300 hover:text-slate-700 dark:text-slate-400 dark:hover:border-slate-600 dark:hover:text-slate-200'
                                    }`}
                                >
                                    <tab.icon size={18} aria-hidden />
                                    <span>{tab.label}</span>
                                    <span className="ml-1 inline-flex items-center justify-center rounded-full bg-slate-100 dark:bg-slate-700 px-2 py-0.5 text-xs font-semibold text-slate-500 dark:text-slate-300">
                                        {count}
                                    </span>
                                </button>
                            );
                        })}
                    </nav>
                </div>
            </div>

            <div className="flex items-center gap-2">
                <div className="relative flex-grow">
                    <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
                    <input
                        type="text"
                        role="combobox"
                        aria-autocomplete="list"
                        aria-expanded={isFocused && searchSuggestions.length > 0}
                        aria-controls={suggestionsListId}
                        aria-activedescendant={highlightedIndex >= 0 && searchSuggestions[highlightedIndex] ? `${suggestionsListId}-option-${highlightedIndex}` : undefined}
                        value={searchTerm}
                        onChange={e => onSearchChange(e.target.value)}
                        onFocus={() => setIsFocused(true)}
                        onBlur={() => setTimeout(() => setIsFocused(false), 150)}
                        onKeyDown={handleKeyDown}
                        placeholder="Buscar por nombre, DNI/código, correo..."
                        className="w-full pl-10 pr-4 py-2.5 border border-slate-200 dark:border-slate-600 rounded-full bg-white dark:bg-slate-700 dark:text-slate-100 focus:ring-2 focus:ring-indigo-500 transition focus:outline-none"
                    />
                    <p className="mt-2 text-xs text-slate-500 dark:text-slate-400">Tip: usa combinaciones como "Inicial 3" o "@colegio" para resultados rápidos.</p>
                    <AnimatePresence>
                    {isFocused && searchSuggestions.length > 0 && (
                        <motion.div
                            initial={{ opacity: 0, y: -5 }}
                            animate={{ opacity: 1, y: 5 }}
                            exit={{ opacity: 0, y: -5 }}
                            className="absolute top-full mt-1 w-full bg-white dark:bg-slate-800 rounded-lg shadow-lg border border-slate-200 dark:border-slate-700 z-30 overflow-hidden"
                        >
                           <ul id={suggestionsListId} role="listbox">
                                {searchSuggestions.map((user, index) => {
                                    const name = 'studentCode' in user ? user.fullName : user.name;
                                    const role = 'studentCode' in user ? 'Estudiante' : ('relation' in user ? 'Apoderado' : user.category);
                                    const optionId = `${suggestionsListId}-option-${index}`;
                                    const isActive = highlightedIndex === index;
                                    return (
                                        <li key={'studentCode' in user ? user.documentNumber : user.dni} role="presentation">
                                            <button
                                                type="button"
                                                id={optionId}
                                                role="option"
                                                aria-selected={isActive}
                                                onMouseDown={e => e.preventDefault()}
                                                onClick={() => handleOptionSelect(user)}
                                                className={`w-full flex items-center gap-3 p-3 text-left transition-colors ${isActive ? 'bg-indigo-50 dark:bg-indigo-500/20' : 'hover:bg-slate-50 dark:hover:bg-slate-700'}`}
                                            >
                                                <img src={user.avatarUrl} alt="" className="w-8 h-8 rounded-full" aria-hidden />
                                                <div>
                                                    <p className="font-semibold text-sm text-slate-800 dark:text-slate-100 capitalize">{name.toLowerCase()}</p>
                                                    <p className="text-xs text-slate-500 dark:text-slate-400">{role}</p>
                                                </div>
                                            </button>
                                        </li>
                                    );
                                })}
                           </ul>
                        </motion.div>
                    )}
                    </AnimatePresence>
                </div>
                 <button
                    type="button"
                    onClick={onSaveView}
                    className="flex items-center gap-2 px-4 py-2.5 bg-white dark:bg-slate-700 text-slate-600 dark:text-slate-200 text-sm font-semibold rounded-full border border-slate-200 dark:border-slate-600 hover:bg-slate-50 dark:hover:bg-slate-600 transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-indigo-500 dark:focus-visible:ring-offset-slate-900"
                    aria-label="Guardar la combinación de filtros actual"
                 >
                    <Save size={16} aria-hidden />
                    <span className="hidden md:inline">Guardar vista</span>
                </button>
            </div>
        </div>
    );
};

export default UserListHeader;