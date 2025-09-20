import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FileSpreadsheet, Download, Filter, BarChart2, Users, BookOpen, ChevronDown, Calendar, Printer, FileText, ArrowRight } from 'lucide-react';
import Card from '../components/ui/Card';
import DynamicChart from '../components/ui/DynamicChart';
import PageHeader from '../components/ui/PageHeader';
import Button from '../components/ui/Button';

// --- MOCK DATA & TYPES ---

type ReportTab = 'asistencia' | 'matricula' | 'academico';

const MOCK_DATA = {
  asistencia: {
    overallPercentage: 92,
    totalAbsences: 154,
    atRiskStudents: 12,
    trend: [88, 91, 93, 90, 95, 94, 92],
    byGrade: [
        { name: '1er Grado', value: 15 }, 
        { name: '2do Grado', value: 22 }, 
        { name: '3er Grado', value: 31 }, 
        { name: '4to Grado', value: 28 }, 
        { name: '5to Grado', value: 25 }, 
        { name: '6to Grado', value: 33 }
    ],
  },
  matricula: {
    totalStudents: 1681,
    newEnrollments: 45,
    withdrawals: 8,
    byGrade: [{ name: 'Inicial', value: 252 }, { name: 'Primaria', value: 756 }, { name: 'Secundaria', value: 673 }],
  },
  academico: {
    overallAverage: 15.8,
    passRate: 96,
    studentsAtRisk: 34,
    byCourse: [
        { name: 'Matemática', value: 14.5 }, 
        { name: 'Comunicación', value: 16.2 }, 
        { name: 'Ciencia', value: 15.9 }, 
        { name: 'Sociales', value: 16.5 },
        { name: 'Arte', value: 17.1 },
        { name: 'Ed. Física', value: 17.5 }
    ],
  }
};

const attendanceTrendData = MOCK_DATA.asistencia.trend.map((val, i) => ({
    name: ['Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb', 'Dom'][i],
    Asistencia: val,
}));

// --- COMPONENTS ---

const KpiCard: React.FC<{ title: string; value: string | number; icon: React.ElementType, color: string }> = ({ title, value, icon: Icon, color }) => (
    <div className="bg-white dark:bg-slate-800 p-6 rounded-2xl border border-slate-100 dark:border-slate-700 shadow-sm flex items-start justify-between">
        <div>
            <p className="text-sm font-semibold text-slate-500 dark:text-slate-400">{title}</p>
            <p className="text-4xl font-bold text-slate-800 dark:text-slate-100 mt-2">{value}</p>
        </div>
        <div className={`p-3 rounded-xl ${color}`}>
            <Icon size={24} />
        </div>
    </div>
);


const ReportesPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<ReportTab>('asistencia');

  const tabs: { id: ReportTab; label: string; icon: React.ElementType, color: string }[] = [
    { id: 'asistencia', label: 'Asistencia', icon: BarChart2, color: 'text-indigo-600 dark:text-indigo-300 bg-indigo-100 dark:bg-indigo-500/20' },
    { id: 'matricula', label: 'Matrícula', icon: Users, color: 'text-emerald-600 dark:text-emerald-300 bg-emerald-100 dark:bg-emerald-500/20' },
    { id: 'academico', label: 'Académico', icon: BookOpen, color: 'text-sky-600 dark:text-sky-300 bg-sky-100 dark:bg-sky-500/20' },
  ];

  const renderDashboard = () => {
    switch (activeTab) {
      case 'asistencia':
        return (
          <motion.div 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <KpiCard title="Asistencia General" value={`${MOCK_DATA.asistencia.overallPercentage}%`} icon={BarChart2} color={tabs[0].color} />
              <KpiCard title="Total de Ausencias" value={MOCK_DATA.asistencia.totalAbsences} icon={Users} color="text-rose-600 dark:text-rose-300 bg-rose-100 dark:bg-rose-500/20" />
              <KpiCard title="Alumnos en Riesgo" value={MOCK_DATA.asistencia.atRiskStudents} icon={Users} color="text-amber-600 dark:text-amber-300 bg-amber-100 dark:bg-amber-500/20" />
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <DynamicChart title="Tendencia de Asistencia (Semanal)" data={attendanceTrendData} dataKeys={['Asistencia']} colors={['#4f46e5']} />
              <DynamicChart title="Distribución de Ausencias por Grado" data={MOCK_DATA.asistencia.byGrade} dataKeys={['value']} nameKey="name" />
            </div>
          </motion.div>
        );
      case 'matricula':
        return (
          <motion.div 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <KpiCard title="Total Matriculados" value={MOCK_DATA.matricula.totalStudents} icon={Users} color={tabs[1].color} />
              <KpiCard title="Nuevas Matrículas" value={MOCK_DATA.matricula.newEnrollments} icon={Users} color="text-blue-600 dark:text-blue-300 bg-blue-100 dark:bg-blue-500/20" />
              <KpiCard title="Estudiantes Retirados" value={MOCK_DATA.matricula.withdrawals} icon={Users} color="text-slate-600 dark:text-slate-300 bg-slate-100 dark:bg-slate-700" />
            </div>
            <DynamicChart title="Distribución de Estudiantes por Nivel" data={MOCK_DATA.matricula.byGrade} dataKeys={['value']} nameKey="name"/>
          </motion.div>
        );
      case 'academico':
        return (
           <motion.div 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <KpiCard title="Promedio General" value={MOCK_DATA.academico.overallAverage} icon={BookOpen} color={tabs[2].color} />
              <KpiCard title="Tasa de Aprobación" value={`${MOCK_DATA.academico.passRate}%`} icon={Users} color="text-emerald-600 dark:text-emerald-300 bg-emerald-100 dark:bg-emerald-500/20" />
              <KpiCard title="Alumnos en Riesgo Acad." value={MOCK_DATA.academico.studentsAtRisk} icon={Users} color="text-amber-600 dark:text-amber-300 bg-amber-100 dark:bg-amber-500/20" />
            </div>
            <DynamicChart title="Promedio por Curso" data={MOCK_DATA.academico.byCourse} dataKeys={['value']} nameKey="name"/>
          </motion.div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="Generador de Reportes"
        subtitle="Visualice datos consolidados y genere reportes para UGEL y uso interno."
        icon={FileSpreadsheet}
      />

      <Card className="!p-0">
        <div className="p-4 border-b border-slate-200 dark:border-slate-700 flex flex-col sm:flex-row justify-between items-center gap-4">
          <nav className="flex flex-wrap gap-2">
            {tabs.map(tab => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`relative flex items-center gap-2 px-4 py-2 text-sm font-semibold rounded-full transition-colors ${
                    activeTab === tab.id
                      ? 'bg-indigo-600 text-white shadow-md'
                      : 'bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-200 hover:bg-slate-200 dark:hover:bg-slate-600'
                  }`}
                >
                  <Icon size={16} />
                  <span>{tab.label}</span>
                </button>
              );
            })}
          </nav>
          <div className="flex items-center gap-2">
            <Button variant="primary" icon={Download}>Descargar Reporte</Button>
          </div>
        </div>
        <div className="p-6">
          <AnimatePresence mode="wait">
            {renderDashboard()}
          </AnimatePresence>
        </div>
      </Card>
    </div>
  );
};

export default ReportesPage;
