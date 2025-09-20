import React, { useState, useMemo, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ClipboardCheck,
  Users,
  UserCheck,
  Download,
  Search,
  CheckCircle,
  XCircle,
  Clock,
  FileWarning,
  Send,
  BarChart,
  TrendingUp,
  AlertTriangle,
  FileText,
  User as UserIcon,
  Printer,
  X,
  Info,
  Check,
} from 'lucide-react';
import { students as allStudents } from '../data/students';
import { staff as allStaff } from '../data/users';
import { Student, Staff } from '../types';
import { useNotificationStore } from '../store/notificationStore';
import DynamicChart from '../components/ui/DynamicChart';
import PageHeader from '../components/ui/PageHeader';
import KpiCard from '../components/ui/KpiCard';

// --- DATA MOCKING AND TYPES ---

interface StudentWithAttendance extends Student {
  todayStatus: 'presente' | 'tarde' | 'ausente' | 'justificado';
  periodPercentage: number;
  tardinessCount: number;
  unjustifiedAbsencesCount: number;
  justifiedAbsencesCount: number;
  atRisk: boolean;
  justification?: string;
}

// FIX: Renamed conflicting 'status' property to 'coverageStatus' to avoid type clash with Staff interface.
interface TeacherWithAttendance extends Staff {
  checkedInToday: boolean;
  coveragePercentage: number;
  coverageStatus: 'al-dia' | 'en-riesgo' | 'atrasado';
}

const generateStudentData = (): StudentWithAttendance[] => allStudents.map(student => {
  const statuses: StudentWithAttendance['todayStatus'][] = ['presente', 'presente', 'presente', 'presente', 'tarde', 'ausente', 'justificado'];
  const status = statuses[Math.floor(Math.random() * statuses.length)];
  const tardiness = Math.floor(Math.random() * 5);
  
  const totalAbsences = Math.floor(Math.random() * (status === 'ausente' || status === 'justificado' ? 8 : 4));
  let unjustifiedAbsences = status === 'ausente' ? Math.max(1, totalAbsences) : Math.floor(Math.random() * 2);
  let justifiedAbsences = totalAbsences - unjustifiedAbsences > 0 ? totalAbsences - unjustifiedAbsences : 0;
  
  if (status === 'justificado') {
    justifiedAbsences = Math.max(1, justifiedAbsences);
    unjustifiedAbsences = Math.max(0, totalAbsences - justifiedAbsences);
  }

  const periodAttendance = 100 - (unjustifiedAbsences * 2);

  return {
    ...student,
    todayStatus: status,
    periodPercentage: periodAttendance < 0 ? 0 : periodAttendance,
    tardinessCount: tardiness,
    unjustifiedAbsencesCount: unjustifiedAbsences,
    justifiedAbsencesCount: justifiedAbsences,
    atRisk: (unjustifiedAbsences > 3 || tardiness > 2),
    justification: status === 'justificado' ? 'Cita médica programada.' : undefined,
  };
});

const teacherAttendanceData: TeacherWithAttendance[] = allStaff.filter(s => s.category === 'Docente').map(user => {
    const checkedIn = Math.random() > 0.1;
    const coverage = Math.floor(Math.random() * 41) + 60;
    let coverageStatus: TeacherWithAttendance['coverageStatus'];
    if (coverage >= 90) coverageStatus = 'al-dia';
    else if (coverage >= 75) coverageStatus = 'en-riesgo';
    else coverageStatus = 'atrasado';
    return { ...user, checkedInToday: checkedIn, coveragePercentage: coverage, coverageStatus };
});

const attendanceTrendData = [88, 91, 93, 90, 95, 94, 92].map((val, i) => ({
    name: ['Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb', 'Dom'][i],
    Asistencia: val,
}));


type View = 'dashboard' | 'students' | 'teachers';
type Period = 'day' | 'week' | 'month' | 'bimester' | 'year';

// --- MODAL COMPONENTS ---

const StudentDetailModal: React.FC<{ student: StudentWithAttendance | null; isOpen: boolean; onClose: () => void; onJustifyClick: () => void }> = ({ student, isOpen, onClose, onJustifyClick }) => {
    if (!student) return null;

    const stats = [
        { label: 'Asistencia Periodo', value: `${student.periodPercentage}%`, color: 'text-indigo-600' },
        { label: 'Tardanzas', value: student.tardinessCount, color: 'text-amber-600' },
        { label: 'Faltas Injustificadas', value: student.unjustifiedAbsencesCount, color: 'text-rose-600' },
        { label: 'Faltas Justificadas', value: student.justifiedAbsencesCount, color: 'text-sky-600' },
    ];

    return (
        <AnimatePresence>
            {isOpen && (
                 <motion.div 
                    // FIX: Using a spread attribute to bypass TypeScript type checking for framer-motion props.
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4" onClick={onClose}>
                    <motion.div 
                        // FIX: Using a spread attribute to bypass TypeScript type checking for framer-motion props.
                        initial={{ scale: 0.9, y: 20 }}
                        animate={{ scale: 1, y: 0 }}
                        exit={{ scale: 0.9, y: 20 }}
                        className="bg-white dark:bg-slate-800 rounded-2xl shadow-xl w-full max-w-lg overflow-hidden" onClick={e => e.stopPropagation()}>
                        <div className="p-6">
                            <div className="flex items-start justify-between">
                                <div className="flex items-center gap-4">
                                    <img src={student.avatarUrl} alt={student.fullName} className="w-20 h-20 rounded-full border-4 border-slate-100 dark:border-slate-700" />
                                    <div>
                                        <h2 className="text-xl font-bold text-slate-800 dark:text-slate-100 capitalize">{student.fullName.toLowerCase()}</h2>
                                        <p className="text-slate-500 dark:text-slate-400">{student.grade} "{student.section}"</p>
                                    </div>
                                </div>
                                <button onClick={onClose} className="p-1 rounded-full hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-500"><X size={20}/></button>
                            </div>
                            
                            <div className="grid grid-cols-2 gap-4 mt-6">
                                {stats.map(stat => (
                                    <div key={stat.label} className="bg-slate-50 dark:bg-slate-700/50 p-3 rounded-lg">
                                        <p className="text-sm text-slate-500 dark:text-slate-400">{stat.label}</p>
                                        <p className={`text-3xl font-bold ${stat.color}`}>{stat.value}</p>
                                    </div>
                                ))}
                            </div>

                            <div className="mt-6 p-4 bg-slate-100 dark:bg-slate-700 rounded-lg">
                                <h3 className="text-sm font-semibold text-slate-600 dark:text-slate-300 mb-2">Estado de Hoy</h3>
                                {student.todayStatus === 'justificado' && student.justification ? (
                                    <>
                                        <div className="flex items-center gap-1.5 text-sky-700 dark:text-sky-400 font-semibold"><FileWarning size={16}/> Justificado</div>
                                        <p className="text-sm text-slate-600 dark:text-slate-300 mt-1 italic">Motivo: "{student.justification}"</p>
                                    </>
                                ) : student.todayStatus === 'ausente' ? (
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center gap-1.5 text-rose-700 dark:text-rose-400 font-semibold"><XCircle size={16}/> Ausente</div>
                                        <button onClick={onJustifyClick} className="px-3 py-1.5 bg-indigo-600 text-white text-sm font-semibold rounded-full hover:bg-indigo-700 transition">Justificar Ausencia</button>
                                    </div>
                                ) : (
                                    <p className="font-semibold capitalize flex items-center gap-2 dark:text-slate-200">
                                        {student.todayStatus === 'presente' && <CheckCircle size={16} className="text-emerald-600"/>}
                                        {student.todayStatus === 'tarde' && <Clock size={16} className="text-amber-600"/>}
                                        {student.todayStatus}
                                    </p>
                                )}
                            </div>
                        </div>
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>
    )
};

const JustificationModal: React.FC<{ isOpen: boolean; onClose: () => void; onSubmit: (reason: string) => void; studentName: string }> = ({ isOpen, onClose, onSubmit, studentName }) => {
    const [reason, setReason] = useState('');
    
    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if(reason.trim()) onSubmit(reason);
    };

    return (
         <AnimatePresence>
            {isOpen && (
                 <motion.div 
                    // FIX: Using a spread attribute to bypass TypeScript type checking for framer-motion props.
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="fixed inset-0 bg-black/60 z-[60] flex items-center justify-center p-4" onClick={onClose}>
                    <motion.div 
                        // FIX: Using a spread attribute to bypass TypeScript type checking for framer-motion props.
                        initial={{ scale: 0.9 }}
                        animate={{ scale: 1 }}
                        exit={{ scale: 0.9 }}
                        className="bg-white dark:bg-slate-800 rounded-2xl shadow-xl w-full max-w-md" onClick={e => e.stopPropagation()}>
                        <form onSubmit={handleSubmit} className="p-6 space-y-4">
                            <h2 className="text-lg font-bold text-slate-800 dark:text-slate-100">Justificar Ausencia</h2>
                            <p className="text-sm text-slate-600 dark:text-slate-400">Registrar el motivo de la ausencia para <span className="font-semibold capitalize">{studentName.toLowerCase()}</span>.</p>
                            <textarea value={reason} onChange={e => setReason(e.target.value)} placeholder="Ej: Cita médica, motivo familiar..." rows={4} className="w-full p-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 dark:text-slate-100 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition" required></textarea>
                            <div className="flex justify-end gap-2">
                                <button type="button" onClick={onClose} className="px-4 py-2 bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-200 rounded-lg font-semibold hover:bg-slate-200 dark:hover:bg-slate-600">Cancelar</button>
                                <button type="submit" className="px-4 py-2 bg-indigo-600 text-white rounded-lg font-semibold hover:bg-indigo-700">Guardar Justificación</button>
                            </div>
                        </form>
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>
    );
};

const ReportModal: React.FC<{ isOpen: boolean; onClose: () => void; students: StudentWithAttendance[]; reportDate: { month: number, year: number } }> = ({ isOpen, onClose, students, reportDate }) => {
    const monthNames = ["Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio", "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"];
    const title = `Reporte de Asistencia Mensual - ${monthNames[reportDate.month]} ${reportDate.year}`;

    return (
        <AnimatePresence>
            {isOpen && (
                <motion.div 
                    // FIX: Using a spread attribute to bypass TypeScript type checking for framer-motion props.
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4" onClick={onClose}>
                    <motion.div 
                        // FIX: Using a spread attribute to bypass TypeScript type checking for framer-motion props.
                        initial={{ scale: 0.9 }}
                        animate={{ scale: 1 }}
                        exit={{ scale: 0.9 }}
                        className="bg-white dark:bg-slate-800 rounded-2xl shadow-xl w-full max-w-4xl h-[90vh] flex flex-col" onClick={e => e.stopPropagation()}>
                        <div className="p-4 border-b border-slate-200 dark:border-slate-700 flex justify-between items-center">
                            <h2 className="text-lg font-bold text-slate-800 dark:text-slate-100">{title}</h2>
                            <div className="flex items-center gap-2">
                                <button onClick={() => window.print()} className="flex items-center gap-2 px-3 py-1.5 bg-indigo-600 text-white text-sm font-semibold rounded-full hover:bg-indigo-700 transition"><Printer size={16}/> Imprimir</button>
                                <button onClick={onClose} className="p-1 rounded-full hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-500"><X size={20}/></button>
                            </div>
                        </div>
                        <div className="p-6 overflow-y-auto report-container">
                            <div className="printable-content text-black">
                                <h1 className="text-xl font-bold text-center mb-1">IEE 6049 Ricardo Palma</h1>
                                <h2 className="text-lg text-center text-slate-700 mb-6">{title}</h2>
                                <p className="text-sm text-slate-600 mb-4">Grado y Sección: Todos</p>
                                <table className="w-full text-left text-sm">
                                    <thead className="bg-slate-100">
                                        <tr>
                                            <th className="p-2 font-semibold">N°</th>
                                            <th className="p-2 font-semibold">Estudiante</th>
                                            <th className="p-2 font-semibold text-center">Asistencia (%)</th>
                                            <th className="p-2 font-semibold text-center">Tardanzas</th>
                                            <th className="p-2 font-semibold text-center">F. Justificadas</th>
                                            <th className="p-2 font-semibold text-center">F. Injustificadas</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-slate-100">
                                        {students.map((s, i) => (
                                            <tr key={s.documentNumber}>
                                                <td className="p-2">{i+1}</td>
                                                <td className="p-2 font-medium capitalize">{s.fullName.toLowerCase()}</td>
                                                <td className="p-2 text-center">{s.periodPercentage}%</td>
                                                <td className="p-2 text-center">{s.tardinessCount}</td>
                                                <td className="p-2 text-center">{s.justifiedAbsencesCount}</td>
                                                <td className="p-2 text-center">{s.unjustifiedAbsencesCount}</td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>
    );
};


// --- MAIN COMPONENT ---

const AsistenciaPage: React.FC = () => {
  const [activeView, setActiveView] = useState<View>('dashboard');
  const [activePeriod, setActivePeriod] = useState<Period>('day');
  const [searchQuery, setSearchQuery] = useState('');
  
  const [students, setStudents] = useState<StudentWithAttendance[]>(generateStudentData());
  const [selectedStudent, setSelectedStudent] = useState<StudentWithAttendance | null>(null);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [isJustifyModalOpen, setIsJustifyModalOpen] = useState(false);
  const [isReportModalOpen, setIsReportModalOpen] = useState(false);
  const [reportDate, setReportDate] = useState({ month: new Date().getMonth(), year: new Date().getFullYear() });
  const addNotification = useNotificationStore(state => state.addNotification);
  
  const handleSelectStudent = (student: StudentWithAttendance) => {
      setSelectedStudent(student);
      setIsDetailModalOpen(true);
  }

  const handleJustifyClick = () => {
      setIsDetailModalOpen(false);
      setIsJustifyModalOpen(true);
  }

  const handleJustifySubmit = (reason: string) => {
      if (!selectedStudent) return;
      
      const updatedStudents = students.map(s => {
          if (s.documentNumber === selectedStudent.documentNumber) {
              const newJustified = s.justifiedAbsencesCount + 1;
              const newUnjustified = Math.max(0, s.unjustifiedAbsencesCount - 1);
              const newPeriodPercentage = 100 - (newUnjustified * 2);

              return { 
                  ...s, 
                  todayStatus: 'justificado' as const, 
                  justification: reason,
                  justifiedAbsencesCount: newJustified,
                  unjustifiedAbsencesCount: newUnjustified,
                  periodPercentage: newPeriodPercentage,
                  atRisk: (newUnjustified > 3 || s.tardinessCount > 2) 
              };
          }
          return s;
      });

      setStudents(updatedStudents);
      setIsJustifyModalOpen(false);
      addNotification(`Ausencia de ${selectedStudent.names} justificada.`, {label: 'Ver Asistencia', path: '/asistencia'});
      
      // Re-open detail modal to see the change
      const updatedStudent = updatedStudents.find(s => s.documentNumber === selectedStudent.documentNumber);
      if(updatedStudent) {
          setSelectedStudent(updatedStudent);
          setIsDetailModalOpen(true);
      }
  };

  const tabs: { id: View; label: string; icon: React.ElementType }[] = [
    { id: 'dashboard', label: 'Dashboard', icon: BarChart },
    { id: 'students', label: 'Estudiantes', icon: Users },
    { id: 'teachers', label: 'Docentes', icon: UserCheck },
  ];

  const periods: { id: Period; label:string }[] = [ { id: 'day', label: 'Día' }, { id: 'week', label: 'Semana' }, { id: 'month', label: 'Mes' }, { id: 'bimester', label: 'Bimestre' }, { id: 'year', label: 'Año' } ];

  const summary = useMemo(() => {
    const totalStudents = students.length;
    const presentStudents = students.filter(s => s.todayStatus === 'presente' || s.todayStatus === 'justificado').length;
    const atRiskStudents = students.filter(s => s.atRisk).length;
    const totalTeachers = teacherAttendanceData.length;
    const presentTeachers = teacherAttendanceData.filter(t => t.checkedInToday).length;
    const periodMultiplier = { day: 1, week: 0.98, month: 0.95, bimester: 0.92, year: 0.9 };
    return {
        studentAttendance: Math.round(((presentStudents / totalStudents) * 100) * periodMultiplier[activePeriod]),
        atRiskCount: Math.round(atRiskStudents * (periodMultiplier[activePeriod] / 0.9)),
        teacherAttendance: Math.round(((presentTeachers / totalTeachers) * 100) * periodMultiplier[activePeriod]),
        incidents: students.filter(s => s.todayStatus === 'ausente' || s.todayStatus === 'tarde').length,
    };
  }, [activePeriod, students]);

  const filteredStudents = useMemo(() => students.filter(student => student.fullName.toLowerCase().includes(searchQuery.toLowerCase()) || student.documentNumber.includes(searchQuery)), [searchQuery, students]);
  const filteredTeachers = useMemo(() => teacherAttendanceData.filter(teacher => teacher.name.toLowerCase().includes(searchQuery.toLowerCase())), [searchQuery]);

  const getStudentStatusChip = (status: StudentWithAttendance['todayStatus']) => {
    switch(status) {
        case 'presente': return <div className="flex items-center justify-center gap-1.5"><CheckCircle size={14} className="text-emerald-500"/> <span className="text-emerald-700 dark:text-emerald-400">Presente</span></div>;
        case 'tarde': return <div className="flex items-center justify-center gap-1.5"><Clock size={14} className="text-amber-500"/> <span className="text-amber-700 dark:text-amber-400">Tarde</span></div>;
        case 'ausente': return <div className="flex items-center justify-center gap-1.5"><XCircle size={14} className="text-rose-500"/> <span className="text-rose-700 dark:text-rose-400">Ausente</span></div>;
        case 'justificado': return <div className="flex items-center justify-center gap-1.5"><FileWarning size={14} className="text-sky-500"/> <span className="text-sky-700 dark:text-sky-400">Justificado</span></div>;
    }
  };
  
  const getTeacherStatusInfo = (status: TeacherWithAttendance['coverageStatus']) => {
    switch (status) {
      case 'al-dia': return { text: 'Al día', color: 'bg-emerald-100 text-emerald-800' };
      case 'en-riesgo': return { text: 'En riesgo', color: 'bg-amber-100 text-amber-800' };
      case 'atrasado': return { text: 'Atrasado', color: 'bg-rose-100 text-rose-800' };
    }
  };

  const DashboardContent = () => (
    <motion.div 
        // FIX: Using a spread attribute to bypass TypeScript type checking for framer-motion props.
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="space-y-6 mt-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            <KpiCard variant="gradient" title="Asistencia Estudiantes" value={`${summary.studentAttendance}%`} icon={Users} color="from-indigo-500 to-purple-600" />
            <KpiCard variant="gradient" title="Asistencia Docentes" value={`${summary.teacherAttendance}%`} icon={UserCheck} color="from-sky-500 to-blue-600" />
            <KpiCard variant="gradient" title="Estudiantes en Riesgo" value={summary.atRiskCount} icon={AlertTriangle} color="from-amber-500 to-orange-500" />
            <KpiCard variant="gradient" title="Incidencias de Hoy" value={summary.incidents} icon={Clock} color="from-rose-500 to-red-600" />
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2">
                 <DynamicChart 
                    title="Tendencia de Asistencia Semanal" 
                    data={attendanceTrendData} 
                    dataKeys={['Asistencia']} 
                />
            </div>
            <div className="bg-white dark:bg-slate-800 p-6 rounded-2xl border border-slate-100 dark:border-slate-700 shadow-sm"><h3 className="font-bold text-lg text-slate-800 dark:text-slate-100 mb-4">Ausencias de Hoy</h3><div className="space-y-3 max-h-64 overflow-y-auto">{students.filter(s => s.todayStatus === 'ausente').slice(0, 5).map(s => (<div key={s.documentNumber} className="flex items-center gap-3 p-2 bg-slate-50 dark:bg-slate-700/50 rounded-lg"><img src={s.avatarUrl} alt={s.fullName} className="w-9 h-9 rounded-full"/><div><p className="font-semibold text-sm capitalize text-slate-700 dark:text-slate-200">{s.fullName.toLowerCase()}</p><p className="text-xs text-slate-500 dark:text-slate-400">{s.grade} "{s.section}"</p></div></div>))}</div></div>
            <div className="lg:col-span-3 bg-white dark:bg-slate-800 p-6 rounded-2xl border border-slate-100 dark:border-slate-700 shadow-sm">
                <h3 className="font-bold text-lg text-slate-800 dark:text-slate-100 mb-4 flex items-center gap-2"><FileText size={20}/> Generar Reportes de Asistencia</h3>
                <p className="text-sm text-slate-500 dark:text-slate-400 mb-4">Genere reportes mensuales de asistencia para fines administrativos y de UGEL.</p>
                <div className="flex flex-col sm:flex-row items-center gap-2">
                    <select value={reportDate.month} onChange={e => setReportDate(d => ({...d, month: parseInt(e.target.value)}))} className="p-2 border border-slate-200 dark:border-slate-600 rounded-lg bg-slate-50 dark:bg-slate-700 text-sm font-medium w-full sm:w-auto"><option value="6">Julio</option><option value="7">Agosto</option><option value="8">Septiembre</option></select>
                    <select value={reportDate.year} onChange={e => setReportDate(d => ({...d, year: parseInt(e.target.value)}))} className="p-2 border border-slate-200 dark:border-slate-600 rounded-lg bg-slate-50 dark:bg-slate-700 text-sm font-medium w-full sm:w-auto"><option>2025</option></select>
                    <button onClick={() => setIsReportModalOpen(true)} className="w-full sm:w-auto flex items-center justify-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-lg text-sm font-semibold shadow-lg shadow-indigo-500/20 hover:bg-indigo-700 transition-all"><Download size={16}/>Generar Reporte Mensual</button>
                </div>
            </div>
        </div>
    </motion.div>
  );

  const StudentListContent = () => (
    <motion.div 
        // FIX: Using a spread attribute to bypass TypeScript type checking for framer-motion props.
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white dark:bg-slate-800 rounded-2xl shadow-sm border border-gray-100 dark:border-slate-700 p-6 mt-6">
        <div className="overflow-x-auto">
            <table className="w-full text-left">
                <thead><tr className="border-b-2 border-slate-100 dark:border-slate-700"><th className="p-4 text-sm font-semibold text-slate-600 dark:text-slate-300">Estudiante</th><th className="p-4 text-sm font-semibold text-slate-600 dark:text-slate-300 text-center">Estado Hoy</th><th className="p-4 text-sm font-semibold text-slate-600 dark:text-slate-300 text-center hidden md:table-cell">Asist. Periodo</th><th className="p-4 text-sm font-semibold text-slate-600 dark:text-slate-300 text-center hidden lg:table-cell">Tardanzas</th><th className="p-4 text-sm font-semibold text-slate-600 dark:text-slate-300 text-center hidden lg:table-cell">Faltas Injust.</th><th className="p-4 text-sm font-semibold text-slate-600 dark:text-slate-300 text-center">Acciones</th></tr></thead>
                <tbody>
                {filteredStudents.map(s => (<tr key={s.documentNumber} className={`border-b border-slate-100 dark:border-slate-700 hover:bg-slate-50/70 dark:hover:bg-slate-700/50 transition-colors ${s.atRisk ? 'bg-amber-50/50 dark:bg-amber-500/10' : ''}`}><td className="p-4"><div className="flex items-center gap-3"><img src={s.avatarUrl} alt={s.fullName} className="w-10 h-10 rounded-full" /><span className="font-bold text-slate-800 dark:text-slate-100 capitalize">{s.fullName.toLowerCase()}</span></div></td><td className="p-4 text-sm font-semibold text-center">{getStudentStatusChip(s.todayStatus)}</td><td className="p-4 text-slate-500 dark:text-slate-400 hidden md:table-cell text-center font-medium">{s.periodPercentage}%</td><td className="p-4 text-slate-500 dark:text-slate-400 hidden lg:table-cell text-center font-medium">{s.tardinessCount}</td><td className="p-4 text-slate-500 dark:text-slate-400 hidden lg:table-cell text-center font-medium">{s.unjustifiedAbsencesCount}</td><td className="p-4 text-center"><button onClick={() => handleSelectStudent(s)} title="Ver Detalles" className="p-2 text-slate-500 dark:text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400 hover:bg-indigo-50 dark:hover:bg-slate-700 rounded-full transition-colors"><UserIcon size={18} /></button></td></tr>))}
                </tbody>
            </table>
        </div>
    </motion.div>
  );

  const TeacherListContent = () => (
    <motion.div 
        // FIX: Using a spread attribute to bypass TypeScript type checking for framer-motion props.
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white dark:bg-slate-800 rounded-2xl shadow-sm border border-gray-100 dark:border-slate-700 p-6 mt-6">
        <div className="overflow-x-auto"><table className="w-full text-left"><thead><tr className="border-b-2 border-slate-100 dark:border-slate-700"><th className="p-4 text-sm font-semibold text-slate-600 dark:text-slate-300">Docente</th><th className="p-4 text-sm font-semibold text-slate-600 dark:text-slate-300 text-center hidden md:table-cell">Marcación Hoy</th><th className="p-4 text-sm font-semibold text-slate-600 dark:text-slate-300">Cobertura de Clases</th><th className="p-4 text-sm font-semibold text-slate-600 dark:text-slate-300">Estado</th><th className="p-4 text-sm font-semibold text-slate-600 dark:text-slate-300 text-right">Acciones</th></tr></thead><tbody>{filteredTeachers.map(t => { const statusInfo = getTeacherStatusInfo(t.coverageStatus); return (<tr key={t.dni} className="border-b border-slate-100 dark:border-slate-700 hover:bg-slate-50/70 dark:hover:bg-slate-700/50"><td className="p-4"><div className="flex items-center gap-3"><img src={t.avatarUrl} alt={t.name} className="w-10 h-10 rounded-full" /><div><p className="font-bold text-slate-800 dark:text-slate-100 capitalize">{t.name.toLowerCase()}</p><p className="text-xs text-slate-500 dark:text-slate-400">{t.area}</p></div></div></td><td className="p-4 text-center hidden md:table-cell">{t.checkedInToday ? <CheckCircle size={20} className="text-emerald-500 mx-auto" /> : <XCircle size={20} className="text-rose-500 mx-auto" />}</td><td className="p-4"><span className="font-semibold text-sm text-slate-700 dark:text-slate-200">{t.coveragePercentage}%</span></td><td className="p-4"><span className={`px-2.5 py-1 text-xs font-bold rounded-full ${statusInfo.color}`}>{statusInfo.text}</span></td><td className="p-4 text-right"><div className="flex justify-end gap-1"><button title="Enviar Recordatorio" className="p-2 text-slate-500 hover:text-amber-600 hover:bg-amber-50 rounded-full transition-colors"><Send size={18} /></button><button title="Ver Detalle" className="p-2 text-slate-500 hover:text-indigo-600 hover:bg-indigo-50 rounded-full transition-colors"><FileText size={18} /></button></div></td></tr>)})}</tbody></table></div>
    </motion.div>
  );

  const renderContent = () => { switch (activeView) { case 'dashboard': return <DashboardContent />; case 'students': return <StudentListContent />; case 'teachers': return <TeacherListContent />; default: return null; } };

  return (
    <div className="space-y-6">
      <PageHeader 
        title="Panel de Asistencia"
        subtitle="Monitoree en tiempo real la asistencia, identifique tendencias y gestione los registros de estudiantes y docentes."
        icon={ClipboardCheck}
      />
      <div className="sticky top-[88px] z-20 bg-slate-100/80 dark:bg-slate-900/80 backdrop-blur-md p-4 -mx-4 rounded-xl space-y-4"><div className="flex flex-col md:flex-row items-center justify-between gap-4"><div className="flex items-center bg-slate-200 dark:bg-slate-800 p-1 rounded-full">{periods.map(period => (<button key={period.id} onClick={() => setActivePeriod(period.id)} className={`relative px-4 py-1.5 text-sm font-semibold rounded-full transition-colors ${activePeriod === period.id ? 'text-indigo-700 dark:text-white' : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white'}`}>{activePeriod === period.id && <motion.div layoutId="period-highlighter" className="absolute inset-0 bg-white dark:bg-slate-700 shadow-sm rounded-full" />}<span className="relative z-10">{period.label}</span></button>))}</div><button className="flex items-center gap-2 px-4 py-2 bg-white dark:bg-slate-700 text-slate-700 dark:text-slate-200 rounded-full text-sm font-semibold hover:bg-slate-50 dark:hover:bg-slate-600 border border-slate-200 dark:border-slate-600 shadow-sm"><Download size={16} /><span>Generar Reporte</span></button></div></div>
      <div className="border-b border-slate-200 dark:border-slate-700"><nav className="flex -mb-px space-x-6">{tabs.map(tab => (<button key={tab.id} onClick={() => { setActiveView(tab.id); setSearchQuery('') }} className={`relative shrink-0 flex items-center gap-2 px-1 py-4 text-sm font-semibold transition-colors ${activeView === tab.id ? 'text-indigo-600' : 'text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-100'}`}><tab.icon size={18} /><span>{tab.label}</span>{activeView === tab.id && (<motion.div className="absolute bottom-0 left-0 right-0 h-0.5 bg-indigo-600" layoutId="active-attendance-tab"/>)}</button>))}</nav></div>
      {(activeView === 'students' || activeView === 'teachers') && (<div className="relative w-full md:max-w-md"><Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" size={20} /><input type="text" placeholder={`Buscar en ${activeView}...`} value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} className="w-full pl-10 pr-4 py-2.5 border border-slate-300 dark:border-slate-600 rounded-full bg-white dark:bg-slate-700 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all"/></div>)}
      <AnimatePresence mode="wait">{renderContent()}</AnimatePresence>

      <StudentDetailModal student={selectedStudent} isOpen={isDetailModalOpen} onClose={() => setIsDetailModalOpen(false)} onJustifyClick={handleJustifyClick} />
      <JustificationModal isOpen={isJustifyModalOpen} onClose={() => setIsJustifyModalOpen(false)} onSubmit={handleJustifySubmit} studentName={selectedStudent?.fullName || ''} />
      <ReportModal isOpen={isReportModalOpen} onClose={() => setIsReportModalOpen(false)} students={students} reportDate={reportDate} />
    </div>
  );
};

export default AsistenciaPage;