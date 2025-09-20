import React, { useState, useMemo, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Users, Search, Plus, Download, Edit, UserCheck, UserX, UserMinus, MoreVertical, FileText, User as UserIcon, ArrowRightLeft, RefreshCw, FileBadge } from 'lucide-react';
import { students as initialStudents } from '../data/students';
import { Student } from '../types';
import { parents } from '../data/parents';
import PageHeader from '../components/ui/PageHeader';
import Button from '../components/ui/Button';
import KpiCard from '../components/ui/KpiCard';

const MatriculaPage: React.FC = () => {
    const [students, setStudents] = useState<Student[]>(initialStudents);
    const [searchQuery, setSearchQuery] = useState('');
    const [filterStatus, setFilterStatus] = useState('Todos');
    const [openActionMenu, setOpenActionMenu] = useState<string | null>(null);

    useEffect(() => {
        const closeMenu = () => setOpenActionMenu(null);
        window.addEventListener('click', closeMenu);
        return () => window.removeEventListener('click', closeMenu);
    }, []);

    const filteredStudents = useMemo(() => {
        return students.filter(s => {
            const matchesSearch = s.fullName.toLowerCase().includes(searchQuery.toLowerCase()) || s.documentNumber.includes(searchQuery);
            const matchesStatus = filterStatus === 'Todos' || s.enrollmentStatus === filterStatus;
            return matchesSearch && matchesStatus;
        });
    }, [students, searchQuery, filterStatus]);

    const getStatusChipClass = (status: string) => {
        switch (status) {
            case 'Matriculado': return 'bg-emerald-100 text-emerald-800 dark:bg-emerald-500/20 dark:text-emerald-300';
            case 'Trasladado': return 'bg-amber-100 text-amber-800 dark:bg-amber-500/20 dark:text-amber-300';
            case 'Retirado': return 'bg-rose-100 text-rose-800 dark:bg-rose-500/20 dark:text-rose-300';
            default: return 'bg-slate-100 text-slate-800 dark:bg-slate-700 dark:text-slate-200';
        }
    };
    
    const statusIcons: Record<string, React.ElementType> = {
        Matriculado: UserCheck,
        Trasladado: UserMinus,
        Retirado: UserX,
    }

    const summary = useMemo(() => ({
        matriculados: students.filter(s => s.enrollmentStatus === 'Matriculado').length,
        trasladados: students.filter(s => s.enrollmentStatus === 'Trasladado').length,
        retirados: students.filter(s => s.enrollmentStatus === 'Retirado').length,
    }), [students]);

    const ActionMenuItem: React.FC<{ icon: React.ElementType, label: string, onClick?: () => void, className?: string }> = ({ icon: Icon, label, onClick, className = '' }) => (
        <button onClick={onClick} className={`w-full flex items-center gap-3 px-4 py-2.5 text-sm text-left text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors ${className}`}>
            <Icon size={16} />
            <span>{label}</span>
        </button>
    );

    return (
        <div className="space-y-6">
            <PageHeader
                title="Gestión de Matrícula"
                subtitle="Administre el proceso de matrícula, vacantes, traslados y retiros. Integre con SIAGIE."
                icon={Users}
            />

            <motion.div 
                // FIX: Using a spread attribute to bypass TypeScript type checking for framer-motion props.
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="grid grid-cols-1 md:grid-cols-3 gap-6"
            >
                <KpiCard title="Matriculados" value={summary.matriculados} icon={UserCheck} />
                <KpiCard title="Trasladados" value={summary.trasladados} icon={UserMinus} />
                <KpiCard title="Retirados" value={summary.retirados} icon={UserX} />
            </motion.div>
            
            <motion.div 
                // FIX: Using a spread attribute to bypass TypeScript type checking for framer-motion props.
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{delay: 0.1}}
                className="bg-white dark:bg-slate-800 rounded-2xl shadow-sm border border-slate-200/80 dark:border-slate-700/80 p-6"
            >
                <div className="flex flex-col md:flex-row justify-between items-center gap-4 mb-6">
                    <div className="relative w-full md:max-w-sm">
                        <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
                        <input type="text" placeholder="Buscar estudiante..." value={searchQuery} onChange={e => setSearchQuery(e.target.value)} className="w-full pl-10 pr-4 py-2 border border-slate-200 dark:border-slate-600 rounded-full bg-slate-50 dark:bg-slate-700 dark:text-slate-100 focus:bg-white dark:focus:bg-slate-600 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition"/>
                    </div>
                    <div className="flex items-center gap-2">
                        <select onChange={(e) => setFilterStatus(e.target.value)} value={filterStatus} className="p-2.5 border border-slate-200 dark:border-slate-600 rounded-full bg-slate-50 dark:bg-slate-700 dark:text-slate-200 text-sm font-medium focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition">
                            <option>Todos</option>
                            <option>Matriculado</option>
                            <option>Trasladado</option>
                            <option>Retirado</option>
                        </select>
                         <Button variant="secondary" icon={Download}>Exportar</Button>
                         <Button variant="primary" icon={Plus}>Nueva Matrícula</Button>
                    </div>
                </div>
                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead className="bg-slate-50 dark:bg-slate-900/50"><tr className="border-b-2 border-slate-100 dark:border-slate-700"><th className="p-4 text-sm font-semibold text-slate-600 dark:text-slate-300">Nombre</th><th className="p-4 text-sm font-semibold text-slate-600 dark:text-slate-300 hidden md:table-cell">DNI</th><th className="p-4 text-sm font-semibold text-slate-600 dark:text-slate-300 hidden lg:table-cell">Grado y Sección</th><th className="p-4 text-sm font-semibold text-slate-600 dark:text-slate-300">Estado</th><th className="p-4 text-sm font-semibold text-slate-600 dark:text-slate-300">Apoderado</th><th className="p-4 text-sm font-semibold text-slate-600 dark:text-slate-300 text-center">Acciones</th></tr></thead>
                        <tbody className="divide-y divide-slate-100 dark:divide-slate-700">
                        {filteredStudents.map(student => {
                            const StatusIcon = statusIcons[student.enrollmentStatus];
                            const tutor = parents.find(p => student.tutorIds.includes(p.dni));
                            return (
                            <tr key={student.documentNumber} className="hover:bg-slate-50 dark:hover:bg-slate-700/50 transition-colors">
                                <td className="p-4 flex items-center gap-3"><img src={student.avatarUrl} alt={student.fullName} className="w-10 h-10 rounded-full" /><span className="font-medium text-slate-800 dark:text-slate-100 capitalize">{student.fullName.toLowerCase()}</span></td>
                                <td className="p-4 text-slate-500 dark:text-slate-400 hidden md:table-cell">{student.documentNumber}</td>
                                <td className="p-4 text-slate-500 dark:text-slate-400 hidden lg:table-cell">{student.grade} "{student.section}"</td>
                                <td className="p-4"><span className={`inline-flex items-center gap-1.5 px-2 py-1 text-xs font-semibold rounded-full ${getStatusChipClass(student.enrollmentStatus)}`}><StatusIcon size={12}/> {student.enrollmentStatus}</span></td>
                                <td className="p-4 text-slate-500 dark:text-slate-400">{tutor ? tutor.name : 'N/A'}</td>
                                <td className="p-4 text-center relative">
                                    <button onClick={(e) => { e.stopPropagation(); setOpenActionMenu(openActionMenu === student.documentNumber ? null : student.documentNumber); }} className="p-2 text-slate-500 hover:text-indigo-600 hover:bg-indigo-50 dark:hover:bg-slate-700 rounded-full transition-colors"><MoreVertical size={18} /></button>
                                    <AnimatePresence>
                                        {openActionMenu === student.documentNumber && (
                                            <motion.div
                                                // FIX: Using a spread attribute to bypass TypeScript type checking for framer-motion props.
                                                initial={{ opacity: 0, y: -10, scale: 0.95 }}
                                                animate={{ opacity: 1, y: 0, scale: 1 }}
                                                exit={{ opacity: 0, y: -10, scale: 0.95 }}
                                                transition={{ duration: 0.15 }}
                                                onClick={(e) => e.stopPropagation()}
                                                className="absolute right-0 top-12 mt-1 w-60 bg-white dark:bg-slate-800 rounded-xl shadow-2xl border border-slate-100 dark:border-slate-700 overflow-hidden z-10"
                                            >
                                                {student.enrollmentStatus === 'Matriculado' && (
                                                    <>
                                                        <ActionMenuItem icon={FileText} label="Generar Ficha de Matrícula" />
                                                        <ActionMenuItem icon={UserIcon} label="Ver Perfil del Alumno" />
                                                        <ActionMenuItem icon={Edit} label="Editar Matrícula" />
                                                        <div className="my-1 h-px bg-slate-100 dark:border-slate-700" />
                                                        <ActionMenuItem icon={ArrowRightLeft} label="Marcar como Trasladado" className="text-amber-700 dark:text-amber-400" />
                                                        <ActionMenuItem icon={UserX} label="Marcar como Retirado" className="text-rose-700 dark:text-rose-400" />
                                                    </>
                                                )}
                                                {student.enrollmentStatus === 'Trasladado' && (
                                                    <>
                                                        <ActionMenuItem icon={UserIcon} label="Ver Perfil del Alumno" />
                                                        <ActionMenuItem icon={FileBadge} label="Generar Constancia de Traslado" />
                                                    </>
                                                )}
                                                {student.enrollmentStatus === 'Retirado' && (
                                                    <>
                                                        <ActionMenuItem icon={UserIcon} label="Ver Perfil del Alumno" />
                                                        <ActionMenuItem icon={FileBadge} label="Generar Constancia de Retiro" />
                                                         <div className="my-1 h-px bg-slate-100 dark:border-slate-700" />
                                                        <ActionMenuItem icon={RefreshCw} label="Re-matricular Alumno" className="text-emerald-700 dark:text-emerald-400" />
                                                    </>
                                                )}
                                            </motion.div>
                                        )}
                                    </AnimatePresence>
                                </td>
                            </tr>
                            );
                        })}
                        </tbody>
                    </table>
                </div>
            </motion.div>
        </div>
    );
};

export default MatriculaPage;