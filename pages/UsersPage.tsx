import React, { useState, useMemo, useEffect, useCallback, useRef } from 'react';
import { useSearchParams } from 'react-router-dom';
import {
    Users, UploadCloud, Plus
} from 'lucide-react';
import { staff as initialStaff } from '../data/users';
import { students as initialStudents } from '../data/students';
import { parents as initialParents } from '../data/parents';
import { Staff, Student, ParentTutor, UserStatus, ActivityLog, GenericUser, SortConfig, ConfirmationModalState, UserRole } from '../types';
import { useDebounce } from '../hooks/useDebounce';
import { activityLogs as initialActivityLogs } from '../data/activityLogs';
import { useNotificationStore } from '../store/notificationStore';
import { useSavedViewsStore } from '../store/savedViewsStore';
import { generateCarnet } from '../utils/pdfGenerator';

import PageHeader from '../components/ui/PageHeader';
import Button from '../components/ui/Button';
import UserListHeader from '../components/users/UserListHeader';
import UserFilters from '../components/users/UserFilters';
import UserKpiCards from '../components/users/UserKpiCards';
import UserTable from '../components/users/UserTable';
import BulkActionBar from '../components/users/BulkActionBar';
import UserDetailDrawer from '../components/users/UserDetailDrawer';
import UserImportModal from '../components/users/UserImportModal';
import ConfirmationModal from '../components/users/ConfirmationModal';

// --- DATA TRANSFORMATION ---
const useUsers = () => {
    return useMemo(() => {
        return [...initialStaff, ...initialStudents, ...initialParents];
    }, []);
};


// --- MAIN PAGE COMPONENT ---
const UsersPage: React.FC = () => {
    const allUsers = useUsers();
    const [users, setUsers] = useState<GenericUser[]>(allUsers);
    const [searchParams, setSearchParams] = useSearchParams();
    const addNotification = useNotificationStore(state => state.addNotification);
    const triggerElementRef = useRef<HTMLButtonElement | null>(null);
    const { savedViews, addView, removeView } = useSavedViewsStore();

    // State
    const [filters, setFilters] = useState({
        searchTerm: searchParams.get('q') || '',
        tagFilter: searchParams.get('tags') || '',
        status: (searchParams.get('status') as UserStatus | 'Todos') || 'Todos',
        level: searchParams.get('nivel') || 'Todos',
        role: searchParams.get('rol') || 'Todos',
    });
    const [activeTab, setActiveTab] = useState(searchParams.get('tab') || 'Todos');
    const [drawerState, setDrawerState] = useState<{ open: boolean; user: GenericUser | null; initialTab?: string }>({ open: false, user: null });
    const [isImportModalOpen, setIsImportModalOpen] = useState(false);
    const [selectedUsers, setSelectedUsers] = useState<Set<string>>(new Set());
    const [sortConfig, setSortConfig] = useState<SortConfig | null>({ key: 'fullName', direction: 'asc' });
    const [isLoading, setIsLoading] = useState(false);
    const [currentPage, setCurrentPage] = useState(1);
    const [activityLogs, setActivityLogs] = useState<ActivityLog[]>(initialActivityLogs);
    const [confirmationModal, setConfirmationModal] = useState<ConfirmationModalState>({ isOpen: false, title: '', message: '', onConfirm: () => {} });
    
    const debouncedSearch = useDebounce(filters.searchTerm, 300);
    const debouncedTagFilter = useDebounce(filters.tagFilter, 300);
    
    const addActivityLog = useCallback((action: ActivityLog['action'], details: string, targetUser?: string, ipAddress?: string) => {
        const newLog: ActivityLog = {
            id: `log-${Date.now()}`,
            timestamp: new Date().toISOString(),
            user: 'Director(a)',
            userAvatar: 'https://picsum.photos/seed/director/48/48',
            action,
            details,
            targetUser,
            ipAddress,
        };
        setActivityLogs(prev => [newLog, ...prev]);
    }, []);

    useEffect(() => {
        const params = new URLSearchParams();
        if (debouncedSearch) params.set('q', debouncedSearch);
        if (activeTab !== 'Todos') params.set('tab', activeTab);
        if (filters.level !== 'Todos') params.set('nivel', filters.level);
        if (filters.status !== 'Todos') params.set('status', filters.status);
        if (filters.role !== 'Todos') params.set('rol', filters.role);
        if (debouncedTagFilter) params.set('tags', debouncedTagFilter);
        setSearchParams(params, { replace: true });
        
        setIsLoading(true);
        const timer = setTimeout(() => setIsLoading(false), 500);
        return () => clearTimeout(timer);
    }, [debouncedSearch, activeTab, filters.level, filters.status, filters.role, debouncedTagFilter, setSearchParams]);

    const isStaff = (user: GenericUser): user is Staff => 'area' in user;
    const isStudent = (user: GenericUser): user is Student => 'studentCode' in user;
    const isParent = (user: GenericUser): user is ParentTutor => 'relation' in user;

    const tabFilteredUsers = useMemo(() => {
        if (activeTab === 'Todos') return users;
        if (activeTab === 'Personal') return users.filter(isStaff);
        if (activeTab === 'Estudiantes') return users.filter(isStudent);
        if (activeTab === 'Apoderados') return users.filter(isParent);
        return users;
    }, [users, activeTab]);

    const filteredUsers = useMemo(() => {
        return tabFilteredUsers
            .filter(user => {
                const name = isStudent(user) ? user.fullName : user.name;
                const code = isStudent(user) ? user.studentCode : user.dni;
                const email = isParent(user) ? user.email : `${code}@colegio.edu.pe`;
                
                const searchMatch = debouncedSearch ? (name.toLowerCase().includes(debouncedSearch.toLowerCase()) || code.includes(debouncedSearch) || email.toLowerCase().includes(debouncedSearch.toLowerCase())) : true;
                const statusMatch = filters.status === 'Todos' || user.status === filters.status;
                const levelMatch = filters.level === 'Todos' || (isStudent(user) && user.grade.includes(filters.level)) || (isStaff(user) && user.area.includes(filters.level));
                
                let roleMatch = true;
                if (filters.role !== 'Todos') {
                    if (isStaff(user)) roleMatch = user.category === filters.role;
                    else if (isStudent(user)) roleMatch = 'Estudiante' === filters.role;
                    else if (isParent(user)) roleMatch = 'Apoderado' === filters.role;
                }

                const tagMatch = debouncedTagFilter ? user.tags.some(tag => tag.toLowerCase().includes(debouncedTagFilter.toLowerCase())) : true;
                return searchMatch && statusMatch && levelMatch && roleMatch && tagMatch;
            })
            .sort((a, b) => {
                if (!sortConfig) return 0;
                const { key, direction } = sortConfig;
                const valA = (a as any)[key];
                const valB = (b as any)[key];

                if (valA === null || valA === undefined) return 1;
                if (valB === null || valB === undefined) return -1;
                if (valA < valB) return direction === 'asc' ? -1 : 1;
                if (valA > valB) return direction === 'asc' ? 1 : -1;
                return 0;
            });
    }, [tabFilteredUsers, debouncedSearch, filters, sortConfig]);

    const paginatedUsers = useMemo(() => {
        return filteredUsers.slice((currentPage - 1) * 50, currentPage * 50);
    }, [filteredUsers, currentPage]);
    
    const totalPages = Math.ceil(filteredUsers.length / 50);
    
    useEffect(() => { setCurrentPage(1); }, [activeTab, filters, debouncedSearch, debouncedTagFilter]);

    const handleTabChange = (tabId: string) => {
        setActiveTab(tabId);
        setFilters(f => ({ ...f, role: 'Todos' }));
    };
    
    // FIX: Added name and role to the type to reflect data from the form, resolving type errors.
    const handleSaveUser = (userToSave: Partial<GenericUser> & { userType: UserRole | 'Personal', name?: string, role?: string }) => {
        const id = isStudent(userToSave as GenericUser) ? (userToSave as Student).documentNumber : (userToSave as Staff | ParentTutor).dni;
        // FIX: Safely access fullName or name from the partial user object.
        const name = (userToSave as Partial<Student>).fullName || userToSave.name;
        
        const isNewUser = !id || !users.some(u => (isStudent(u) ? u.documentNumber : u.dni) === id);

        if (isNewUser) {
            let newUser: GenericUser;
            const newId = (Math.floor(Math.random() * 90000000) + 10000000).toString();
            const baseData = {
                avatarUrl: `https://ui-avatars.com/api/?name=${(userToSave.name || 'Nuevo Usuario').replace(/\s/g, '+')}&background=random`,
                lastLogin: null,
                status: 'Pendiente' as UserStatus,
                tags: userToSave.tags || [],
            };

            switch(userToSave.userType) {
                case 'Estudiante':
                    newUser = {
                        ...baseData,
                        ...userToSave,
                        documentNumber: newId,
                        studentCode: `0000${newId}`,
                        fullName: userToSave.name || 'Nuevo Estudiante',
                        paternalLastName: '',
                        maternalLastName: '',
                        names: userToSave.name || 'Nuevo Estudiante',
                        tutorIds: [],
                        enrollmentStatus: 'Matriculado',
                        averageGrade: 0, attendancePercentage: 100, tardinessCount: 0, behaviorIncidents: 0, academicRisk: false,
                    } as Student;
                    break;
                case 'Docente':
                case 'Administrativo':
                case 'Apoyo':
                case 'Director':
                case 'Personal': // Fallback for general 'Personal'
                    newUser = {
                        ...baseData,
                        ...userToSave,
                        dni: newId,
                        name: userToSave.name || 'Nuevo Personal',
                        category: userToSave.role as Staff['category'] || 'Docente',
                    } as Staff;
                    break;
                case 'Apoderado':
                     newUser = {
                        ...baseData,
                        ...userToSave,
                        dni: newId,
                        name: userToSave.name || 'Nuevo Apoderado',
                        verified: false,
                        relation: 'Apoderado',
                    } as ParentTutor;
                    break;
                default:
                    console.error("Unknown user type:", userToSave.userType);
                    return;
            }

            setUsers(prevUsers => [newUser, ...prevUsers]);
            // FIX: Used a type guard to safely access name/fullName on the new user object, preventing type errors.
            const newUserName = isStudent(newUser) ? newUser.fullName : newUser.name;
            addActivityLog('Creación', `Se creó el perfil para ${newUserName} (${userToSave.userType}).`, newUserName);
            addNotification(`Usuario "${newUserName}" creado exitosamente. Se ha enviado una invitación.`, { label: 'Ver Usuario', path: `/usuarios?q=${newId}` });
        } else {
            setUsers(prevUsers => prevUsers.map(u => ((isStudent(u) ? u.documentNumber : u.dni) === id ? { ...u, ...userToSave } : u)));
            addActivityLog('Actualización', `Se actualizaron los datos del perfil.`, name);
            addNotification(`Usuario "${name}" actualizado exitosamente.`);
        }
        setDrawerState({ open: false, user: null });
    };

    const handleUserAction = (action: string, user: GenericUser, event?: React.MouseEvent<HTMLButtonElement>) => {
        if (event) triggerElementRef.current = event.currentTarget;
        
        const name = isStudent(user) ? user.fullName : user.name;
        const email = isParent(user) ? user.email : `${(isStudent(user) ? user.studentCode : user.dni)}@colegio.edu.pe`;
        
        const performStatusChange = (newStatus: UserStatus, reason?: string) => {
            const id = isStudent(user) ? user.documentNumber : user.dni;
            setUsers(users.map(u => (isStudent(u) ? u.documentNumber : u.dni) === id ? { ...u, status: newStatus } : u));
            addActivityLog('Cambio de Estado', `Estado cambiado a "${newStatus}". ${reason ? 'Motivo: ' + reason : ''}`, name);
            addNotification(`El estado de ${name} ha sido actualizado a "${newStatus}".`);
            setConfirmationModal(prev => ({...prev, isOpen: false}));
        };

        switch(action) {
            case 'view-details': setDrawerState({ open: true, user, initialTab: 'resumen' }); break;
            case 'edit-profile': setDrawerState({ open: true, user, initialTab: 'editar' }); break;
            case 'reset-password': 
                setConfirmationModal({ isOpen: true, title: 'Restablecer Contraseña', message: `Se enviará un enlace seguro para restablecer la contraseña a ${email}. ¿Desea continuar?`, onConfirm: () => {
                    addActivityLog('Reseteo de Contraseña', `Se envió un enlace de recuperación a ${email}`, name);
                    addNotification(`Enlace de recuperación enviado a ${name}`);
                    setConfirmationModal(prev => ({...prev, isOpen: false}));
                }, confirmText: 'Sí, Enviar Enlace' });
                break;
            case 'suspend':
                setConfirmationModal({ isOpen: true, title: `Suspender Usuario`, message: `¿Desea suspender la cuenta de ${name}? No podrá acceder al sistema.`, withReason: true, onConfirm: (reason) => performStatusChange('Suspendido', reason), confirmText: 'Sí, Suspender', confirmClass: 'bg-amber-600' });
                break;
            case 'resend-invitation':
                addActivityLog('Invitación Enviada', `Se reenvió la invitación a ${email}`, name);
                addNotification(`Invitación reenviada a ${name}`);
                break;
            case 'generate-carnet':
                if (isStudent(user)) generateCarnet([user]);
                break;
        }
    };
    
    const handleBulkAction = (action: string) => {
        const selectedCount = selectedUsers.size;
        
        const performBulkChange = (newStatus: UserStatus) => {
            setUsers(prevUsers => prevUsers.map(u => selectedUsers.has(isStudent(u) ? u.documentNumber : u.dni) ? { ...u, status: newStatus } : u));
            addActivityLog('Cambio de Estado', `Se cambió el estado a "${newStatus}" para ${selectedCount} usuarios.`);
            addNotification(`${selectedCount} usuarios actualizados a "${newStatus}".`);
            setSelectedUsers(new Set());
            setConfirmationModal({ isOpen: false, title: '', message: '', onConfirm: () => {} });
        };
        
        const performBulkResend = () => {
            addActivityLog('Invitación Enviada', `Se reenviaron invitaciones a ${selectedCount} usuarios.`);
            addNotification(`Invitaciones reenviadas a ${selectedCount} usuarios.`);
            setSelectedUsers(new Set());
            setConfirmationModal({ isOpen: false, title: '', message: '', onConfirm: () => {} });
        };
    
        switch(action) {
            case 'activate':
                setConfirmationModal({ isOpen: true, title: 'Activar Usuarios', message: `¿Está seguro de que desea activar ${selectedCount} usuarios seleccionados?`, onConfirm: () => performBulkChange('Activo'), confirmText: 'Sí, Activar' });
                break;
            case 'suspend':
                setConfirmationModal({ isOpen: true, title: 'Suspender Usuarios', message: `¿Está seguro de que desea suspender ${selectedCount} usuarios seleccionados?`, onConfirm: () => performBulkChange('Suspendido'), confirmText: 'Sí, Suspender', confirmClass: 'bg-amber-600' });
                break;
            case 'resend-invitation':
                 setConfirmationModal({ isOpen: true, title: 'Reenviar Invitaciones', message: `¿Está seguro de que desea reenviar la invitación a ${selectedCount} usuarios seleccionados?`, onConfirm: performBulkResend, confirmText: 'Sí, Reenviar' });
                break;
            case 'generate-carnets':
                const studentsToPrint = users.filter(u => isStudent(u) && selectedUsers.has(u.documentNumber)) as Student[];
                generateCarnet(studentsToPrint);
                addActivityLog('Generar Carnet', `Se generaron carnets para ${studentsToPrint.length} estudiantes.`);
                break;
            case 'export-selected':
                const dataToExport = users.filter(u => selectedUsers.has(isStudent(u) ? u.documentNumber : u.dni));
                const csvContent = "data:text/csv;charset=utf-8," + ["ID,Nombre,Email,Roles,Estado"].join(",") + "\n" + dataToExport.map(u => {
                    const id = isStudent(u) ? u.documentNumber : u.dni;
                    const name = isStudent(u) ? u.fullName : u.name;
                    const email = isParent(u) ? u.email : `${id}@colegio.edu.pe`;
                    const role = isStudent(u) ? 'Estudiante' : (isParent(u) ? 'Apoderado' : u.category);
                    return [id, `"${name}"`, email, role, u.status].join(",");
                }).join("\n");
                const encodedUri = encodeURI(csvContent);
                const link = document.createElement("a");
                link.setAttribute("href", encodedUri);
                link.setAttribute("download", "export_usuarios_seleccionados.csv");
                document.body.appendChild(link);
                link.click();
                document.body.removeChild(link);
                addActivityLog('Exportación', `Se exportaron los datos de ${selectedUsers.size} usuarios seleccionados.`);
                break;
        }
    };
    
    const handlePredictiveSearchSelect = (user: GenericUser) => {
        setFilters(f => ({...f, searchTerm: ''}));
        setDrawerState({ open: true, user, initialTab: 'resumen' });
    }

    const handleCreateUserClick = (event: React.MouseEvent<HTMLButtonElement>) => {
        triggerElementRef.current = event.currentTarget;
        setDrawerState({ open: true, user: null, initialTab: 'editar' });
    };
    
    return (
        <div className="space-y-6">
            <PageHeader
                title="Gestión de Usuarios"
                subtitle="Administre perfiles, roles y permisos de toda la comunidad educativa."
                icon={Users}
                actions={
                    <>
                        <Button variant="secondary" icon={UploadCloud} onClick={() => setIsImportModalOpen(true)}>Importar</Button>
                        <Button variant="primary" icon={Plus} onClick={handleCreateUserClick}>Crear Usuario</Button>
                    </>
                }
            />
            
            <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
                <UserFilters 
                    activeTab={activeTab} 
                    filters={filters} 
                    setFilters={setFilters} 
                    savedViews={savedViews}
                    onSelectView={(view) => setFilters(view.filters)}
                    onRemoveView={(id) => removeView(id)}
                />

                <main className="lg:col-span-3 space-y-4">
                    <UserKpiCards 
                        users={tabFilteredUsers}
                        activeStatus={filters.status}
                        onStatusChange={(status) => setFilters(f => ({ ...f, status }))}
                    />
                    
                    <UserListHeader
                        activeTab={activeTab}
                        onTabChange={handleTabChange}
                        searchTerm={filters.searchTerm}
                        onSearchChange={(term) => setFilters(f => ({ ...f, searchTerm: term }))}
                        onSaveView={() => {
                            const name = prompt("Nombre para la nueva vista:", `Vista - ${new Date().toLocaleDateString()}`);
                            if (name) addView({ id: `view-${Date.now()}`, name, filters });
                        }}
                        allUsers={users}
                        onSelect={handlePredictiveSearchSelect}
                    />

                    <UserTable
                        isLoading={isLoading}
                        users={paginatedUsers}
                        selectedUsers={selectedUsers}
                        setSelectedUsers={setSelectedUsers}
                        sortConfig={sortConfig}
                        setSortConfig={setSortConfig}
                        onAction={handleUserAction}
                        onClearFilters={() => setFilters({ searchTerm: '', tagFilter: '', status: 'Todos', level: 'Todos', role: 'Todos' })}
                        onCreateUser={handleCreateUserClick}
                        currentPage={currentPage}
                        totalPages={totalPages}
                        onPageChange={setCurrentPage}
                    />
                </main>
            </div>
           
            <BulkActionBar count={selectedUsers.size} onClear={() => setSelectedUsers(new Set())} onAction={handleBulkAction} />
            <UserDetailDrawer 
                isOpen={drawerState.open} 
                user={drawerState.user}
                initialTab={drawerState.initialTab}
                allUsers={allUsers}
                allLogs={activityLogs} 
                onClose={() => setDrawerState({ open: false, user: null })}
                onSave={handleSaveUser}
                triggerElementRef={triggerElementRef}
            />
            <UserImportModal isOpen={isImportModalOpen} onClose={() => setIsImportModalOpen(false)} onImport={(newUsers) => setUsers(prev => [...prev, ...newUsers])}/>
            <ConfirmationModal {...confirmationModal} onClose={() => setConfirmationModal(prev => ({...prev, isOpen: false}))} />
        </div>
    );
};

export default UsersPage;