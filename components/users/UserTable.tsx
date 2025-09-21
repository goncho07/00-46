import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion';
import {
  ChevronsUpDown,
  ArrowUp,
  ArrowDown,
  MoreVertical,
  Eye,
  KeyRound,
  Info,
  Send,
  Search,
  RefreshCw,
  Plus,
  ChevronLeft,
  ChevronRight,
  User,
  Shield,
  GraduationCap,
  Users2,
  UserX,
  Pencil,
} from 'lucide-react';
import { UserRole, UserStatus, Student, Staff, ParentTutor, GenericUser, SortConfig } from '../../types';
import Tag from '../ui/Tag';
import Button from '../ui/Button';

const getStatusChipClass = (status: UserStatus) => {
  switch (status) {
    case 'Activo':
      return 'bg-emerald-100 text-emerald-800 dark:bg-emerald-500/20 dark:text-emerald-300 ring-1 ring-inset ring-emerald-200 dark:ring-emerald-500/30';
    case 'Inactivo':
      return 'bg-slate-200 text-slate-800 dark:bg-slate-700 dark:text-slate-200 ring-1 ring-inset ring-slate-300 dark:ring-slate-600';
    case 'Suspendido':
      return 'bg-amber-100 text-amber-800 dark:bg-amber-500/20 dark:text-amber-300 ring-1 ring-inset ring-amber-200 dark:ring-amber-500/30';
    case 'Egresado':
      return 'bg-sky-100 text-sky-800 dark:bg-sky-500/20 dark:text-sky-300 ring-1 ring-inset ring-sky-200 dark:ring-sky-500/30';
    case 'Pendiente':
      return 'bg-sky-100 text-sky-800 dark:bg-sky-500/20 dark:text-sky-300 ring-1 ring-inset ring-sky-200 dark:ring-sky-500/30';
    default:
      return 'bg-gray-100 text-gray-800';
  }
};

const getRole = (user: GenericUser) => {
  if ('studentCode' in user) return 'Estudiante';
  if ('relation' in user) return 'Apoderado';
  if ('category' in user) return user.category;
  return 'N/A';
};

const getRoleIcon = (role: UserRole | 'N/A') => {
  const props = { size: 16, className: 'shrink-0' };
  switch (role) {
    case 'Director':
    case 'Administrativo':
      return <Shield {...props} className="text-blue-500" />;
    case 'Docente':
    case 'Apoyo':
      return <GraduationCap {...props} className="text-emerald-500" />;
    case 'Estudiante':
      return <User {...props} className="text-indigo-500" />;
    case 'Apoderado':
      return <Users2 {...props} className="text-purple-500" />;
    default:
      return <User {...props} className="text-slate-500" />;
  }
};

type AllUserKeys = SortConfig['key'];

type TableHeaderProps = {
  columnKey: AllUserKeys;
  label: string;
  sortConfig: SortConfig | null;
  onSort: (key: AllUserKeys) => void;
  className?: string;
  isSticky?: boolean;
};

const TableHeader: React.FC<TableHeaderProps> = ({ columnKey, label, sortConfig, onSort, className = '', isSticky = false }) => {
  const isActive = sortConfig?.key === columnKey;
  const ariaSort = isActive ? (sortConfig?.direction === 'asc' ? 'ascending' : 'descending') : 'none';

  return (
    <th
      scope="col"
      aria-sort={ariaSort as 'none' | 'ascending' | 'descending'}
      className={`px-6 py-3 text-sm font-semibold text-slate-600 dark:text-slate-300 whitespace-nowrap bg-slate-50 dark:bg-slate-800/80 backdrop-blur-sm z-20 ${isSticky ? 'sticky top-0' : ''} ${className}`}
    >
      <button
        type="button"
        onClick={() => onSort(columnKey)}
        className="flex items-center gap-1 group w-full h-full focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 rounded"
        aria-label={`Ordenar por ${label}`}
      >
        {label}
        <div className="opacity-40 group-hover:opacity-100 transition-opacity" aria-hidden>
          {isActive ? (sortConfig?.direction === 'asc' ? <ArrowUp size={14} /> : <ArrowDown size={14} />) : <ChevronsUpDown size={14} />}
        </div>
      </button>
    </th>
  );
};

type UserTableRowProps = {
  user: GenericUser;
  isSelected: boolean;
  onSelect: () => void;
  onAction: (action: string, user: GenericUser, event: React.MouseEvent<HTMLButtonElement>) => void;
};

const UserTableRow: React.FC<UserTableRowProps> = React.memo(({ user, isSelected, onSelect, onAction }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement | null>(null);
  const menuId = React.useId();
  const checkboxId = React.useId();
  const nameId = React.useId();
  const shouldReduceMotion = useReducedMotion();

  useEffect(() => {
    if (!isMenuOpen) return;

    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsMenuOpen(false);
      }
    };

    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setIsMenuOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('keydown', handleEscape);

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleEscape);
    };
  }, [isMenuOpen]);

  const name = 'studentCode' in user ? user.fullName : user.name;
  const email = 'relation' in user ? user.email : `${'studentCode' in user ? user.studentCode : user.dni}@colegio.edu.pe`;
  const level = 'grade' in user ? `${user.grade} "${user.section}"` : ('area' in user ? user.area : 'N/A');
  const role = getRole(user);
  const isStudent = role === 'Estudiante';

  return (
    <tr
      className={`border-b border-slate-100 dark:border-slate-700 transition-colors text-sm h-[72px] ${isSelected ? 'bg-indigo-50 dark:bg-indigo-500/10' : 'hover:bg-slate-50 dark:hover:bg-slate-800/50'}`}
      aria-selected={isSelected}
    >
      <td onClick={e => e.stopPropagation()} className="sticky left-0 bg-inherit px-6 w-12 z-10">
        <input
          id={checkboxId}
          type="checkbox"
          checked={isSelected}
          onChange={onSelect}
          aria-labelledby={nameId}
          className="h-4 w-4 rounded border-slate-300 text-indigo-600 focus:ring-indigo-500 focus-visible:ring-offset-2 dark:focus-visible:ring-offset-slate-900"
        />
      </td>
      <td className="sticky left-12 bg-inherit px-6 min-w-64 z-10">
        <div className="flex items-center gap-3">
          <img src={user.avatarUrl} alt={name} className="w-10 h-10 rounded-full" />
          <div>
            <div className="flex items-center gap-2">
              <button
                id={nameId}
                type="button"
                onClick={e => onAction('view-details', user, e)}
                className="text-left font-semibold text-slate-800 dark:text-slate-100 capitalize hover:underline focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-indigo-500 dark:focus-visible:ring-offset-slate-900 rounded"
              >
                {name.toLowerCase()}
              </button>
            </div>
            <span className="text-xs text-slate-500 dark:text-slate-400 block truncate">{email}</span>
          </div>
        </div>
      </td>
      <td className="px-6 text-slate-600 dark:text-slate-300">
        <div className="flex items-center gap-2">{getRoleIcon(role)}<span>{role}</span></div>
      </td>
      <td className="px-6 text-slate-600 dark:text-slate-300">{level}</td>
      <td className="px-6">
        <span className={`inline-flex items-center px-2 py-0.5 text-xs font-semibold rounded-full ${getStatusChipClass(user.status)}`} aria-label={`Estado ${user.status}`}>
          {user.status}
        </span>
      </td>
      <td className="px-6">
        <div className="flex flex-wrap gap-1">
          {user.tags.length > 0 ? user.tags.map(tag => <Tag key={tag}>{tag}</Tag>) : <span className="text-xs text-slate-400 italic">Sin etiquetas</span>}
        </div>
      </td>
      <td onClick={e => e.stopPropagation()} className="sticky right-0 bg-inherit px-6 text-center w-20">
        <div className="relative inline-block text-left" ref={menuRef}>
          <button
            type="button"
            onClick={() => setIsMenuOpen(prev => !prev)}
            className="p-2 rounded-full hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-500 dark:text-slate-400 focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-indigo-500"
            aria-haspopup="menu"
            aria-expanded={isMenuOpen}
            aria-controls={menuId}
            aria-label="Más acciones"
          >
            <MoreVertical size={18} />
          </button>
          <AnimatePresence initial={!shouldReduceMotion}>
            {isMenuOpen && (
              <motion.div
                id={menuId}
                role="menu"
                initial={shouldReduceMotion ? undefined : { opacity: 0, scale: 0.95, y: -10 }}
                animate={shouldReduceMotion ? undefined : { opacity: 1, scale: 1, y: 0 }}
                exit={shouldReduceMotion ? undefined : { opacity: 0, scale: 0.95, y: -10 }}
                transition={{ duration: shouldReduceMotion ? 0 : 0.12 }}
                className="origin-top-right absolute right-0 mt-2 w-60 rounded-md shadow-lg bg-white dark:bg-slate-800 ring-1 ring-black ring-opacity-5 dark:ring-slate-700 z-30"
              >
                <div className="py-1" role="none">
                  <button type="button" onClick={e => { onAction('view-details', user, e); setIsMenuOpen(false); }} className="flex items-center gap-3 w-full text-left px-4 py-2 text-sm text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-700" role="menuitem"><Eye size={16} /> Ver ficha 360°</button>
                  <button type="button" onClick={e => { onAction('edit-profile', user, e); setIsMenuOpen(false); }} className="flex items-center gap-3 w-full text-left px-4 py-2 text-sm text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-700" role="menuitem"><Pencil size={16} /> Editar perfil</button>
                  <div className="my-1 h-px bg-slate-100 dark:bg-slate-700" role="presentation" />
                  {isStudent && (
                    <>
                      <button type="button" onClick={e => { onAction('generate-carnet', user, e); setIsMenuOpen(false); }} className="flex items-center gap-3 w-full text-left px-4 py-2 text-sm text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-700" role="menuitem"><UserX size={16} /> Generar carnet escolar</button>
                      <div className="my-1 h-px bg-slate-100 dark:bg-slate-700" role="presentation" />
                    </>
                  )}
                  {user.status === 'Pendiente' ? (
                    <button type="button" onClick={e => { onAction('resend-invitation', user, e); setIsMenuOpen(false); }} className="flex items-center gap-3 w-full text-left px-4 py-2 text-sm text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-700" role="menuitem"><Send size={16} /> Reenviar invitación</button>
                  ) : (
                    <button type="button" onClick={e => { onAction('reset-password', user, e); setIsMenuOpen(false); }} className="flex items-center gap-3 w-full text-left px-4 py-2 text-sm text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-700" role="menuitem"><KeyRound size={16} /> Restablecer contraseña</button>
                  )}
                  <button type="button" onClick={e => { onAction('suspend', user, e); setIsMenuOpen(false); }} className="flex items-center gap-3 w-full text-left px-4 py-2 text-sm text-amber-700 dark:text-amber-400 hover:bg-amber-50 dark:hover:bg-amber-500/10" role="menuitem"><Info size={16} /> Suspender</button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </td>
    </tr>
  );
});

const UserTableRowSkeleton = () => (
  <tr className="border-b border-slate-100 dark:border-slate-700 h-[72px]" aria-hidden>
    <td className="sticky left-0 bg-inherit px-6 w-12 z-10"><div className="h-4 w-4 rounded bg-slate-200 dark:bg-slate-700 animate-pulse" /></td>
    <td className="sticky left-12 bg-inherit px-6 min-w-64 z-10">
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-full bg-slate-200 dark:bg-slate-700 animate-pulse" />
        <div>
          <div className="h-4 w-32 rounded bg-slate-200 dark:bg-slate-700 animate-pulse" />
          <div className="h-3 w-40 rounded bg-slate-200 dark:bg-slate-700 animate-pulse mt-1" />
        </div>
      </div>
    </td>
    <td className="px-6"><div className="h-4 w-24 rounded bg-slate-200 dark:bg-slate-700 animate-pulse" /></td>
    <td className="px-6"><div className="h-4 w-20 rounded bg-slate-200 dark:bg-slate-700 animate-pulse" /></td>
    <td className="px-6"><div className="h-4 w-16 rounded-full bg-slate-200 dark:bg-slate-700 animate-pulse" /></td>
    <td className="px-6"><div className="flex gap-1"><div className="h-4 w-12 rounded-full bg-slate-200 dark:bg-slate-700 animate-pulse" /><div className="h-4 w-16 rounded-full bg-slate-200 dark:bg-slate-700 animate-pulse" /></div></td>
    <td className="px-6"><div className="h-6 w-6 rounded-full bg-slate-200 dark:bg-slate-700 animate-pulse mx-auto" /></td>
  </tr>
);

type EmptyStateProps = {
  onClearFilters: () => void;
  onCreateUser: (e: React.MouseEvent<HTMLButtonElement>) => void;
};

const EmptyState: React.FC<EmptyStateProps> = ({ onClearFilters, onCreateUser }) => (
  <tr>
    <td colSpan={7} className="text-center py-20">
      <div className="max-w-md mx-auto">
        <Search size={48} className="mx-auto text-slate-400 dark:text-slate-500" />
        <h3 className="mt-4 text-xl font-bold text-slate-800 dark:text-slate-100">No se encontraron resultados</h3>
        <p className="mt-1 text-slate-500 dark:text-slate-400">
          Ajuste los filtros o el término de búsqueda para ampliar los resultados.
        </p>
        <div className="mt-6 flex items-center justify-center gap-2">
          <Button type="button" variant="secondary" onClick={onClearFilters} icon={RefreshCw}>Limpiar filtros</Button>
          <Button type="button" variant="primary" onClick={onCreateUser} icon={Plus}>Crear usuario</Button>
        </div>
      </div>
    </td>
  </tr>
);

type PaginationProps = {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
};

const Pagination: React.FC<PaginationProps> = ({ currentPage, totalPages, onPageChange }) => {
  if (totalPages <= 1) return null;

  const goToPage = (page: number) => {
    onPageChange(Math.min(Math.max(page, 1), totalPages));
  };

  return (
    <nav aria-label="Paginación de usuarios" className="flex items-center justify-between mt-4 gap-4 flex-wrap">
      <Button type="button" variant="secondary" onClick={() => goToPage(currentPage - 1)} disabled={currentPage === 1}>
        <ChevronLeft size={16} /> Anterior
      </Button>
      <span className="text-sm text-slate-500 dark:text-slate-400" aria-live="polite">
        Página {currentPage} de {totalPages}
      </span>
      <Button type="button" variant="secondary" onClick={() => goToPage(currentPage + 1)} disabled={currentPage === totalPages}>
        Siguiente <ChevronRight size={16} />
      </Button>
    </nav>
  );
};

type UserTableProps = {
  isLoading: boolean;
  users: GenericUser[];
  selectedUsers: Set<string>;
  setSelectedUsers: React.Dispatch<React.SetStateAction<Set<string>>>;
  sortConfig: SortConfig | null;
  setSortConfig: (config: SortConfig) => void;
  onAction: (action: string, user: GenericUser, event: React.MouseEvent<HTMLButtonElement>) => void;
  onClearFilters: () => void;
  onCreateUser: (event: React.MouseEvent<HTMLButtonElement>) => void;
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
};

const UserTable: React.FC<UserTableProps> = ({
  isLoading,
  users,
  selectedUsers,
  setSelectedUsers,
  sortConfig,
  setSortConfig,
  onAction,
  onClearFilters,
  onCreateUser,
  currentPage,
  totalPages,
  onPageChange,
}) => {
  const handleSort = (key: AllUserKeys) => {
    setSortConfig({
      key,
      direction: sortConfig && sortConfig.key === key && sortConfig.direction === 'asc' ? 'desc' : 'asc',
    });
  };

  const getId = (user: GenericUser) => ('studentCode' in user ? user.documentNumber : user.dni);

  const handleSelectAll = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSelectedUsers(e.target.checked ? new Set(users.map(getId)) : new Set());
  };

  const isPageSelected = users.length > 0 && selectedUsers.size > 0 && users.every(u => selectedUsers.has(getId(u)));

  return (
    <>
      <div className="overflow-x-auto bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-slate-200/80 dark:border-slate-700/80">
        <table className="w-full" aria-describedby="user-table-caption">
          <caption id="user-table-caption" className="sr-only">
            Tabla de usuarios del sistema de gestión escolar con información de contacto, estado y etiquetas.
          </caption>
          <thead>
            <tr className="border-b-2 border-slate-200 dark:border-slate-700">
              <th className="sticky left-0 bg-slate-50 dark:bg-slate-800/80 px-6 w-12 z-20">
                <input
                  type="checkbox"
                  checked={isPageSelected}
                  onChange={handleSelectAll}
                  className="h-4 w-4 rounded border-slate-300 text-indigo-600 focus:ring-indigo-500"
                  aria-label="Seleccionar fila actual"
                />
              </th>
              <TableHeader columnKey={'fullName'} label="Nombre" sortConfig={sortConfig} onSort={handleSort} className="sticky left-12 min-w-64" isSticky />
              <TableHeader columnKey={'role'} label="Rol" sortConfig={sortConfig} onSort={handleSort} isSticky />
              <TableHeader columnKey={'grade'} label="Nivel/Área" sortConfig={sortConfig} onSort={handleSort} isSticky />
              <TableHeader columnKey={'status'} label="Estado" sortConfig={sortConfig} onSort={handleSort} isSticky />
              <th className="px-6 py-3 text-sm font-semibold text-slate-600 dark:text-slate-300 whitespace-nowrap bg-slate-50 dark:bg-slate-800/80 backdrop-blur-sm z-20 sticky top-0">
                Etiquetas
              </th>
              <th className="px-6 py-3 text-sm font-semibold text-slate-600 dark:text-slate-300 text-center sticky right-0 bg-slate-50 dark:bg-slate-800/80 z-20">
                Acciones
              </th>
            </tr>
          </thead>
          <tbody>
            {isLoading ? (
              Array.from({ length: 10 }).map((_, i) => <UserTableRowSkeleton key={`skeleton-${i}`} />)
            ) : users.length > 0 ? (
              users.map(user => {
                const id = getId(user);
                return (
                  <UserTableRow
                    key={id}
                    user={user}
                    isSelected={selectedUsers.has(id)}
                    onSelect={() => {
                      setSelectedUsers(prev => {
                        const next = new Set(prev);
                        if (next.has(id)) {
                          next.delete(id);
                        } else {
                          next.add(id);
                        }
                        return next;
                      });
                    }}
                    onAction={onAction}
                  />
                );
              })
            ) : (
              <EmptyState onClearFilters={onClearFilters} onCreateUser={onCreateUser} />
            )}
          </tbody>
        </table>
      </div>
      <Pagination currentPage={currentPage} totalPages={totalPages} onPageChange={onPageChange} />
    </>
  );
};

export default UserTable;
