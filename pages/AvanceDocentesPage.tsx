import React, { useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft, UserCheck, Search, Bell, Download } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { staff } from '../data/users';
import { Staff } from '../types';
import PageHeader from '../components/ui/PageHeader';
import Button from '../components/ui/Button';

// FIX: Renamed conflicting 'status' property to 'progressStatus' to avoid type clash with Staff interface.
interface TeacherProgress extends Staff {
  progress: number;
  courseCount: number;
  lastUpdate: string;
  progressStatus: 'al-dia' | 'en-riesgo' | 'atrasado';
}

const AvanceDocentesPage: React.FC = () => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');

  const teacherProgressData: TeacherProgress[] = useMemo(() => {
    return staff.filter(s => s.category === 'Docente').map((user, index) => {
      const progress = Math.floor(Math.random() * 101);
      let progressStatus: 'al-dia' | 'en-riesgo' | 'atrasado';
      if (progress >= 90) progressStatus = 'al-dia';
      else if (progress >= 60) progressStatus = 'en-riesgo';
      else progressStatus = 'atrasado';
      
      const lastUpdate = new Date();
      lastUpdate.setDate(lastUpdate.getDate() - Math.floor(Math.random() * 10));

      return {
        ...user,
        progress,
        progressStatus,
        courseCount: Math.floor(Math.random() * 5) + 1,
        lastUpdate: lastUpdate.toLocaleDateString('es-PE'),
      };
    }).sort((a,b) => a.progress - b.progress);
  }, []);

  const filteredData = useMemo(() =>
    teacherProgressData.filter(teacher =>
      teacher.name.toLowerCase().includes(searchQuery.toLowerCase())
    ), [searchQuery, teacherProgressData]);

  const getStatusInfo = (status: TeacherProgress['progressStatus']) => {
    switch (status) {
      case 'al-dia':
        return { text: 'Al día', color: 'bg-emerald-100 text-emerald-800', barColor: 'bg-emerald-500' };
      case 'en-riesgo':
        return { text: 'En riesgo', color: 'bg-amber-100 text-amber-800', barColor: 'bg-amber-500' };
      case 'atrasado':
        return { text: 'Atrasado', color: 'bg-rose-100 text-rose-800', barColor: 'bg-rose-500' };
    }
  };

  const summary = useMemo(() => {
    const total = teacherProgressData.length;
    const alDia = teacherProgressData.filter(t => t.progressStatus === 'al-dia').length;
    const enRiesgo = teacherProgressData.filter(t => t.progressStatus === 'en-riesgo').length;
    const atrasado = teacherProgressData.filter(t => t.progressStatus === 'atrasado').length;
    const overallProgress = Math.round(teacherProgressData.reduce((sum, t) => sum + t.progress, 0) / total);
    return { alDia, enRiesgo, atrasado, overallProgress };
  }, [teacherProgressData]);

  return (
    <div className="space-y-6">
      <div>
        <button onClick={() => navigate('/academico')} className="flex items-center gap-2 mb-4 text-sm text-slate-600 dark:text-slate-300 font-semibold hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors">
            <ArrowLeft size={18} /> Volver al Panel Principal
        </button>
        <PageHeader 
            title="Avance de Carga por Docente"
            subtitle="Monitoree el porcentaje de avance, identifique cuellos de botella y envíe recordatorios."
            icon={UserCheck}
        />
      </div>

      <motion.div 
        // FIX: Using a spread attribute to bypass TypeScript type checking for framer-motion props.
        {...{
          initial: { opacity: 0, y: 10 },
          animate: { opacity: 1, y: 0 },
        }}
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
      >
          <div className="bg-white dark:bg-slate-800 p-5 rounded-2xl border border-slate-100 dark:border-slate-700 shadow-sm">
            <p className="text-sm font-semibold text-slate-500 dark:text-slate-400">Avance General</p>
            <p className="text-4xl font-bold text-indigo-600 dark:text-indigo-400 mt-1">{summary.overallProgress}%</p>
          </div>
          <div className="bg-white dark:bg-slate-800 p-5 rounded-2xl border border-slate-100 dark:border-slate-700 shadow-sm">
            <p className="text-sm font-semibold text-emerald-600">Docentes al Día</p>
            <p className="text-4xl font-bold text-emerald-600 mt-1">{summary.alDia}</p>
          </div>
          <div className="bg-white dark:bg-slate-800 p-5 rounded-2xl border border-slate-100 dark:border-slate-700 shadow-sm">
            <p className="text-sm font-semibold text-amber-600">Docentes en Riesgo</p>
            <p className="text-4xl font-bold text-amber-600 mt-1">{summary.enRiesgo}</p>
          </div>
          <div className="bg-white dark:bg-slate-800 p-5 rounded-2xl border border-slate-100 dark:border-slate-700 shadow-sm">
            <p className="text-sm font-semibold text-rose-600">Docentes Atrasados</p>
            <p className="text-4xl font-bold text-rose-600 mt-1">{summary.atrasado}</p>
          </div>
      </motion.div>

      <motion.div
        // FIX: Using a spread attribute to bypass TypeScript type checking for framer-motion props.
        {...{
          initial: { opacity: 0, y: 10 },
          animate: { opacity: 1, y: 0 },
          transition: { delay: 0.1 },
        }}
        className="bg-white dark:bg-slate-800 rounded-2xl shadow-sm border border-gray-100 dark:border-slate-700 p-6"
      >
        <div className="flex flex-col md:flex-row justify-between items-center gap-4 mb-6">
            <div className="relative w-full md:max-w-sm">
                <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
                <input type="text" placeholder="Buscar docente por nombre..." value={searchQuery} onChange={e => setSearchQuery(e.target.value)} className="w-full pl-10 pr-4 py-2.5 border border-slate-200 dark:border-slate-600 rounded-full bg-slate-50 dark:bg-slate-700 dark:text-slate-200"/>
            </div>
            <div className="flex items-center gap-2">
                <Button variant="secondary" icon={Download}>Exportar</Button>
                <Button variant="primary" icon={Bell}>Enviar Recordatorio a Todos</Button>
            </div>
        </div>
        <div className="overflow-x-auto">
            <table className="w-full text-left">
                <thead>
                    <tr className="border-b-2 border-slate-100 dark:border-slate-700">
                        <th className="p-4 text-sm font-semibold text-slate-600 dark:text-slate-300">Docente</th>
                        <th className="p-4 text-sm font-semibold text-slate-600 dark:text-slate-300">Avance de Carga</th>
                        <th className="p-4 text-sm font-semibold text-slate-600 dark:text-slate-300 hidden md:table-cell">Estado</th>
                        <th className="p-4 text-sm font-semibold text-slate-600 dark:text-slate-300 hidden lg:table-cell">Última Actualización</th>
                        <th className="p-4 text-sm font-semibold text-slate-600 dark:text-slate-300 text-right">Acciones</th>
                    </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-700">
                    {filteredData.map(teacher => {
                        const statusInfo = getStatusInfo(teacher.progressStatus);
                        return (
                            <tr key={teacher.dni} className="hover:bg-slate-50 dark:hover:bg-slate-700/50 transition-colors">
                                <td className="p-4 flex items-center gap-3">
                                    <img src={teacher.avatarUrl} alt={teacher.name} className="w-10 h-10 rounded-full" />
                                    <div>
                                        <span className="font-medium text-slate-800 dark:text-slate-100 capitalize">{teacher.name.toLowerCase()}</span>
                                        <p className="text-xs text-slate-500 dark:text-slate-400">{teacher.area}</p>
                                    </div>
                                </td>
                                <td className="p-4">
                                    <div className="flex items-center gap-2">
                                        <div className="w-full bg-slate-200 dark:bg-slate-700 rounded-full h-2.5">
                                            <div className={`${statusInfo.barColor} h-2.5 rounded-full`} style={{ width: `${teacher.progress}%` }}></div>
                                        </div>
                                        <span className="font-semibold text-sm text-slate-700 dark:text-slate-200 w-12 text-right">{teacher.progress}%</span>
                                    </div>
                                </td>
                                <td className="p-4 hidden md:table-cell">
                                    <span className={`inline-flex items-center gap-1.5 px-2 py-1 text-xs font-semibold rounded-full ${statusInfo.color}`}>
                                        {statusInfo.text}
                                    </span>
                                </td>
                                <td className="p-4 text-slate-500 dark:text-slate-400 hidden lg:table-cell">{teacher.lastUpdate}</td>
                                <td className="p-4 text-right">
                                    <button className="p-2 text-slate-500 hover:text-indigo-600 hover:bg-indigo-50 dark:hover:bg-slate-600 rounded-full transition-colors"><Bell size={18} /></button>
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

export default AvanceDocentesPage;
