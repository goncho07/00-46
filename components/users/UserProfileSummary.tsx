import React from 'react';
// FIX: Import GenericUser from types.ts
import { GenericUser, Student, Staff, ParentTutor } from '../../types';
import { TrendingUp, BarChart, Clock, AlertTriangle, Percent, Phone, Mail, User, Shield } from 'lucide-react';
import Tag from '../ui/Tag';

const isStudent = (user: GenericUser): user is Student => 'studentCode' in user;
const isStaff = (user: GenericUser): user is Staff => 'area' in user;
const isParent = (user: GenericUser): user is ParentTutor => 'relation' in user;

const KpiItem: React.FC<{ icon: React.ElementType, value: string, label: string, color: string }> = ({ icon: Icon, value, label, color }) => (
    <div className="flex items-center gap-4 p-4 bg-slate-50 dark:bg-slate-800 rounded-lg">
        <div className={`p-3 rounded-full ${color}`}>
            <Icon size={24} />
        </div>
        <div>
            <p className="text-2xl font-bold text-slate-800 dark:text-slate-100">{value}</p>
            <p className="text-sm font-semibold text-slate-500 dark:text-slate-400">{label}</p>
        </div>
    </div>
);

const UserProfileSummary: React.FC<{ user: GenericUser }> = ({ user }) => {
    
    const renderStudentSummary = (student: Student) => (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <KpiItem icon={TrendingUp} value={student.averageGrade.toFixed(1)} label="Promedio Bimestral" color="bg-indigo-100 text-indigo-600 dark:bg-indigo-500/20 dark:text-indigo-300" />
            <KpiItem icon={BarChart} value={`${student.attendancePercentage}%`} label="Asistencia" color="bg-emerald-100 text-emerald-600 dark:bg-emerald-500/20 dark:text-emerald-300" />
            <KpiItem icon={Clock} value={`${student.tardinessCount}`} label="Tardanzas" color="bg-amber-100 text-amber-600 dark:bg-amber-500/20 dark:text-amber-300" />
            <KpiItem icon={AlertTriangle} value={`${student.behaviorIncidents}`} label="Incidencias" color="bg-rose-100 text-rose-600 dark:bg-rose-500/20 dark:text-rose-300" />
        </div>
    );

    const renderStaffSummary = (staff: Staff) => (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
             <KpiItem icon={Percent} value={`${staff.notesProgress || 0}%`} label="Avance Carga de Notas" color="bg-teal-100 text-teal-600 dark:bg-teal-500/20 dark:text-teal-300" />
             <KpiItem icon={BarChart} value={`${staff.attendancePercentage || 0}%`} label="Asistencia Periodo" color="bg-emerald-100 text-emerald-600 dark:bg-emerald-500/20 dark:text-emerald-300" />
        </div>
    );

    const renderParentSummary = (parent: ParentTutor) => (
        <div className="text-center p-8 bg-slate-50 dark:bg-slate-800 rounded-lg">
            <p className="text-slate-500 dark:text-slate-400">Resumen para apoderados próximamente.</p>
        </div>
    );
    
    const contactInfo = [
        { icon: User, label: 'DNI / Código', value: isStudent(user) ? user.documentNumber : user.dni },
        { icon: Mail, label: 'Email', value: isParent(user) ? user.email : `${isStudent(user) ? user.studentCode : user.dni}@colegio.edu.pe` },
        ...(isParent(user) ? [{ icon: Phone, label: 'Teléfono', value: user.phone }] : []),
    ];

    return (
        <div className="space-y-6">
            {isStudent(user) && user.academicRisk && (
                <div className="p-4 bg-amber-100 text-amber-800 dark:bg-amber-500/20 dark:text-amber-300 rounded-lg flex items-center gap-3">
                    <AlertTriangle size={20} />
                    <p className="font-semibold text-sm">Este estudiante se encuentra en riesgo académico debido a su promedio o inasistencias.</p>
                </div>
            )}
            
            <div className="bg-white dark:bg-slate-800/50 p-6 rounded-xl border border-slate-200/80 dark:border-slate-700/80">
                <h3 className="text-lg font-bold text-slate-800 dark:text-slate-100 mb-4">Indicadores Clave</h3>
                {isStudent(user) && renderStudentSummary(user)}
                {isStaff(user) && renderStaffSummary(user)}
                {isParent(user) && renderParentSummary(user)}
            </div>
            
            <div className="bg-white dark:bg-slate-800/50 p-6 rounded-xl border border-slate-200/80 dark:border-slate-700/80">
                 <h3 className="text-lg font-bold text-slate-800 dark:text-slate-100 mb-4">Información de Contacto y Grupos</h3>
                 <div className="space-y-3">
                     {contactInfo.map(info => (
                         <div key={info.label} className="flex items-center text-sm">
                            <info.icon size={16} className="text-slate-400 mr-3" />
                            <span className="font-semibold text-slate-500 dark:text-slate-400 w-28">{info.label}:</span>
                            <span className="text-slate-700 dark:text-slate-200">{info.value}</span>
                         </div>
                     ))}
                     <div className="flex items-start text-sm">
                        <Shield size={16} className="text-slate-400 mr-3 mt-0.5" />
                        <span className="font-semibold text-slate-500 dark:text-slate-400 w-28 shrink-0">Etiquetas:</span>
                        <div className="flex flex-wrap gap-1.5">
                            {user.tags.length > 0 ? user.tags.map(tag => <Tag key={tag}>{tag}</Tag>) : <span className="text-slate-500 dark:text-slate-400">Sin etiquetas</span>}
                        </div>
                    </div>
                 </div>
            </div>
        </div>
    );
};

export default UserProfileSummary;