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
    const roleFilterId = React.useId();
    const levelFilterId = React.useId();
    const statusFilterId = React.useId();
    const tagFilterId = React.useId();
    const descriptionId = React.useId();

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
        <aside className="lg:col-span-1 space-y-6" aria-label="Panel de filtros de usuarios">
            <div className="p-4 bg-white dark:bg-slate-800 rounded-xl border border-slate-200/80 dark:border-slate-700/80">
                <div className="flex items-center gap-2 mb-4">
                    <Filter size={18} className="text-indigo-500" />
                    <div>
                        <h3 className="font-semibold text-slate-800 dark:text-slate-100">Filtrar resultados</h3>
                        <p id={descriptionId} className="text-xs text-slate-500 dark:text-slate-400">Refina la tabla según rol, estado y etiquetas clave.</p>
                    </div>
                </div>
                <form className="space-y-5" aria-describedby={descriptionId}>
                    {savedViews.length > 0 && (
                        <section aria-label="Vistas guardadas" className="space-y-2">
                            <p className="text-sm font-medium text-slate-500 dark:text-slate-400">Vistas personalizadas</p>
                            <ul className="flex flex-wrap gap-1" role="list">
                                {savedViews.map(view => (
                                    <li key={view.id} role="listitem">
                                        <div className="group flex items-center overflow-hidden rounded-md border border-indigo-200 dark:border-indigo-500/40">
                                            <button
                                                type="button"
                                                onClick={() => onSelectView(view)}
                                                className="px-2 py-1 text-xs font-semibold bg-indigo-50 text-indigo-700 dark:bg-indigo-500/10 dark:text-indigo-200 transition-colors group-hover:bg-indigo-100 dark:group-hover:bg-indigo-500/20"
                                                aria-label={`Aplicar vista ${view.name}`}
                                            >
                                                {view.name}
                                            </button>
                                            <button
                                                type="button"
                                                onClick={() => onRemoveView(view.id)}
                                                className="px-1.5 py-1 text-indigo-400 hover:text-rose-500 dark:text-indigo-300 transition-colors"
                                                aria-label={`Eliminar vista ${view.name}`}
                                            >
                                                <Trash2 size={12} />
                                            </button>
                                        </div>
                                    </li>
                                ))}
                            </ul>
                        </section>
                    )}

                    {contextualUserRoles.length > 0 && (
                        <section>
                            <label htmlFor={roleFilterId} className="text-sm font-medium text-slate-500 dark:text-slate-400">
                                Rol de usuario
                            </label>
                            <p className="text-xs text-slate-400 dark:text-slate-500 mt-0.5">Muestra solo perfiles del tipo seleccionado.</p>
                            <select
                                id={roleFilterId}
                                value={filters.role}
                                onChange={e => handleFilterChange('role', e.target.value)}
                                className="w-full mt-2 p-2 text-sm border border-slate-200 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500"
                            >
                                {contextualUserRoles.map(role => (
                                    <option key={role} value={role}>{role}</option>
                                ))}
                            </select>
                        </section>
                    )}

                    {activeTab !== 'Apoderados' && (
                        <section>
                            <label htmlFor={levelFilterId} className="text-sm font-medium text-slate-500 dark:text-slate-400">
                                Nivel educativo
                            </label>
                            <p className="text-xs text-slate-400 dark:text-slate-500 mt-0.5">Ideal para ubicar aulas o áreas específicas.</p>
                            <select
                                id={levelFilterId}
                                value={filters.level}
                                onChange={e => handleFilterChange('level', e.target.value)}
                                className="w-full mt-2 p-2 text-sm border border-slate-200 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500"
                            >
                                {USER_LEVELS.map(level => (
                                    <option key={level} value={level}>{level}</option>
                                ))}
                            </select>
                        </section>
                    )}

                    <section>
                        <label htmlFor={statusFilterId} className="text-sm font-medium text-slate-500 dark:text-slate-400">
                            Estado de acceso
                        </label>
                        <p className="text-xs text-slate-400 dark:text-slate-500 mt-0.5">Controla el estado operativo de las cuentas.</p>
                        <select
                            id={statusFilterId}
                            value={filters.status}
                            onChange={e => handleFilterChange('status', e.target.value)}
                            className="w-full mt-2 p-2 text-sm border border-slate-200 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500"
                        >
                            {USER_STATUSES.map(status => (
                                <option key={status} value={status}>{status}</option>
                            ))}
                        </select>
                    </section>

                    <section>
                        <label htmlFor={tagFilterId} className="text-sm font-medium text-slate-500 dark:text-slate-400">
                            Etiquetas
                        </label>
                        <p className="text-xs text-slate-400 dark:text-slate-500 mt-0.5">Busca por atributos rápidos como becas, refuerzo o comités.</p>
                        <input
                            id={tagFilterId}
                            type="text"
                            value={filters.tagFilter}
                            onChange={e => handleFilterChange('tagFilter', e.target.value)}
                            placeholder="Ej: beca, refuerzo..."
                            className="w-full mt-2 p-2 text-sm border border-slate-200 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500"
                        />
                    </section>

                    <Button
                        type="button"
                        variant="tertiary"
                        onClick={resetFilters}
                        className="w-full !justify-center"
                    >
                        Limpiar filtros
                    </Button>
                </form>
            </div>
        </aside>
    );
};

export default UserFilters;