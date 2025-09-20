import React from 'react';
import { Filter, Trash2 } from 'lucide-react';
import { UserStatus, SavedView } from '../../types';
import Button from '../ui/Button';

const USER_ROLES = ['Todos', 'Director', 'Administrativo', 'Docente', 'Apoyo', 'Estudiante', 'Apoderado'];
const USER_LEVELS = ['Todos', 'Inicial', 'Primaria', 'Secundaria'];
const USER_STATUSES: (UserStatus | 'Todos')[] = ['Todos', 'Activo', 'Inactivo', 'Suspendido', 'Pendiente', 'Egresado'];

interface UserFiltersProps {
    activeTab: string;
    filters: {
        searchTerm: string;
        tagFilter: string;
        status: UserStatus | 'Todos';
        level: string;
        role: string;
    };
    setFilters: React.Dispatch<React.SetStateAction<UserFiltersProps['filters']>>;
    savedViews: SavedView[];
    onSelectView: (view: SavedView) => void;
    onRemoveView: (id: string) => void;
}

const UserFilters: React.FC<UserFiltersProps> = ({ activeTab, filters, setFilters, savedViews, onSelectView, onRemoveView }) => {

    const handleFilterChange = (key: keyof typeof filters, value: string) => {
        setFilters(prev => ({ ...prev, [key]: value }));
    };

    const resetFilters = () => {
        setFilters({
            searchTerm: '',
            tagFilter: '',
            status: 'Todos',
            level: 'Todos',
            role: 'Todos',
        });
    };

    const contextualUserRoles = React.useMemo(() => {
        if (activeTab === 'Personal') {
            return ['Todos', 'Director', 'Administrativo', 'Docente', 'Apoyo'];
        }
        if (activeTab === 'Estudiantes' || activeTab === 'Apoderados') {
            return [];
        }
        return USER_ROLES;
    }, [activeTab]);

    return (
        <aside className="lg:col-span-1 space-y-6">
            <div className="p-4 bg-white dark:bg-slate-800 rounded-xl border border-slate-200/80 dark:border-slate-700/80">
                <h3 className="font-semibold text-slate-800 dark:text-slate-100 flex items-center gap-2 mb-4"><Filter size={18}/> Filtros</h3>
                <div className="space-y-4">
                    {savedViews.length > 0 && (
                        <div>
                            <label className="text-sm font-medium text-slate-500 dark:text-slate-400">Vistas Guardadas</label>
                            <div className="flex flex-wrap gap-1 mt-1">
                                {savedViews.map(view => (
                                    <div key={view.id} className="group flex items-center">
                                        <button onClick={() => onSelectView(view)} className="px-2 py-1 text-xs font-semibold bg-indigo-100 text-indigo-700 dark:bg-indigo-500/20 dark:text-indigo-300 rounded-l-md group-hover:bg-indigo-200 dark:group-hover:bg-indigo-500/30 transition-colors">
                                            {view.name}
                                        </button>
                                        <button onClick={() => onRemoveView(view.id)} className="px-1.5 py-1 bg-indigo-100 dark:bg-indigo-500/20 group-hover:bg-indigo-200 dark:group-hover:bg-indigo-500/30 rounded-r-md text-indigo-400 hover:text-rose-500 transition-colors">
                                            <Trash2 size={12} />
                                        </button>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}
                    {contextualUserRoles.length > 0 && (
                        <div>
                            <label htmlFor="role-filter" className="text-sm font-medium text-slate-500 dark:text-slate-400">Rol de Usuario</label>
                            <select id="role-filter" value={filters.role} onChange={e => handleFilterChange('role', e.target.value)} className="w-full mt-1 p-2 text-sm border border-slate-200 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500">
                                {contextualUserRoles.map(role => <option key={role} value={role}>{role}</option>)}
                            </select>
                        </div>
                    )}
                    {activeTab !== 'Apoderados' && (
                        <div>
                            <label htmlFor="level-filter" className="text-sm font-medium text-slate-500 dark:text-slate-400">Nivel</label>
                            <select id="level-filter" value={filters.level} onChange={e => handleFilterChange('level', e.target.value)} className="w-full mt-1 p-2 text-sm border border-slate-200 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500">
                                {USER_LEVELS.map(level => <option key={level} value={level}>{level}</option>)}
                            </select>
                        </div>
                    )}
                    <div>
                        <label htmlFor="status-filter" className="text-sm font-medium text-slate-500 dark:text-slate-400">Estado</label>
                        <select id="status-filter" value={filters.status} onChange={e => handleFilterChange('status', e.target.value)} className="w-full mt-1 p-2 text-sm border border-slate-200 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500">
                            {USER_STATUSES.map(status => <option key={status} value={status}>{status}</option>)}
                        </select>
                    </div>
                    <div>
                        <label htmlFor="tag-filter" className="text-sm font-medium text-slate-500 dark:text-slate-400">Etiquetas</label>
                        <input id="tag-filter" type="text" value={filters.tagFilter} onChange={e => handleFilterChange('tagFilter', e.target.value)} placeholder="Ej: beca, refuerzo..." className="w-full mt-1 p-2 text-sm border border-slate-200 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500"/>
                    </div>
                    <Button variant="tertiary" onClick={resetFilters} className="w-full !justify-center">Limpiar Filtros</Button>
                </div>
            </div>
        </aside>
    );
};

export default UserFilters;