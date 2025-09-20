import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Briefcase, BarChart, FileText, Settings, Plus, Download, ArrowUpRight, ArrowDownLeft, Banknote } from 'lucide-react';
import Card from '../components/ui/Card';
import DynamicChart from '../components/ui/DynamicChart';
import PageHeader from '../components/ui/PageHeader';
import Button from '../components/ui/Button';
import KpiCard from '../components/ui/KpiCard';

type FinanceTab = 'resumen' | 'transacciones' | 'pagos' | 'configuracion';

// Mock Data
const transactions = [
    { id: 'T-001', date: '2025-07-28', description: 'Donación APAFA', category: 'Donaciones', type: 'Ingreso', amount: 500.00 },
    { id: 'T-002', date: '2025-07-27', description: 'Compra de material de limpieza', category: 'Mantenimiento', type: 'Gasto', amount: -150.70 },
    { id: 'T-003', date: '2025-07-25', description: 'Pago de servicio de internet', category: 'Servicios', type: 'Gasto', amount: -250.00 },
    { id: 'T-004', date: '2025-07-22', description: 'Ingreso por concesión de quiosco', category: 'Concesiones', type: 'Ingreso', amount: 800.00 },
];

const studentPayments = [
    { id: 'P-001', student: 'QUISPE ROJAS, ANA SOFÍA', concept: 'Cuota APAFA 2025', amount: 100.00, dueDate: '2025-03-31', status: 'Pagado' },
    { id: 'P-002', student: 'MENDOZA CASTILLO, LUIS FERNANDO', concept: 'Cuota APAFA 2025', amount: 100.00, dueDate: '2025-03-31', status: 'Pendiente' },
    { id: 'P-003', student: 'TORRES FLORES, CAMILA VALERIA', concept: 'Material Didáctico Anual', amount: 50.00, dueDate: '2025-04-15', status: 'Pagado' },
];

const incomeVsExpenseData = [
    { name: 'Feb', Ingresos: 2400, Gastos: 1800 },
    { name: 'Mar', Ingresos: 1398, Gastos: 1200 },
    { name: 'Abr', Ingresos: 9800, Gastos: 2000 },
    { name: 'May', Ingresos: 3908, Gastos: 2500 },
    { name: 'Jun', Ingresos: 4800, Gastos: 1900 },
    { name: 'Jul', Ingresos: 3800, Gastos: 2100 },
];

const expenseBreakdownData = [
    { name: 'Servicios', value: 1250 },
    { name: 'Mantenimiento', value: 850 },
    { name: 'Materiales', value: 600 },
    { name: 'Administrativo', value: 400 },
    { name: 'Otros', value: 300 },
];


const AdminFinanzasPage: React.FC = () => {
    const [activeTab, setActiveTab] = useState<FinanceTab>('resumen');
    
    const tabs: { id: FinanceTab, label: string, icon: React.ElementType }[] = [
        { id: 'resumen', label: 'Resumen', icon: BarChart },
        { id: 'transacciones', label: 'Ingresos y Gastos', icon: FileText },
        { id: 'pagos', label: 'Pagos de Alumnos', icon: Banknote },
        { id: 'configuracion', label: 'Configuración', icon: Settings },
    ];
    
    const getStatusChipClass = (status: string) => {
        switch (status) {
            case 'Pagado': return 'bg-emerald-100 text-emerald-800';
            case 'Pendiente': return 'bg-amber-100 text-amber-800';
            default: return 'bg-slate-100 text-slate-800';
        }
    };
    
    const renderContent = () => {
        switch (activeTab) {
            case 'resumen':
                return <motion.div 
                    // FIX: Using a spread attribute to bypass TypeScript type checking for framer-motion props.
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <KpiCard title="Ingresos del Mes" value="S/ 1,300.00" icon={ArrowUpRight} />
                        <KpiCard title="Gastos del Mes" value="S/ 400.70" icon={ArrowDownLeft} />
                        <KpiCard title="Balance del Mes" value="S/ 899.30" icon={Banknote} />
                    </div>
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                      <DynamicChart 
                        title="Ingresos vs. Gastos (Últimos 6 meses)"
                        data={incomeVsExpenseData}
                        dataKeys={['Ingresos', 'Gastos']}
                      />
                      <DynamicChart 
                        title="Desglose de Gastos por Categoría"
                        data={expenseBreakdownData}
                        dataKeys={['value']}
                        nameKey="name"
                      />
                    </div>
                </motion.div>;
            case 'transacciones':
                return <motion.div 
                    // FIX: Using a spread attribute to bypass TypeScript type checking for framer-motion props.
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    >
                    <div className="overflow-x-auto">
                        <table className="w-full text-left">
                            <thead><tr className="border-b-2 border-slate-100 dark:border-slate-700"><th className="p-4 text-sm font-semibold text-slate-600 dark:text-slate-300">Fecha</th><th className="p-4 text-sm font-semibold text-slate-600 dark:text-slate-300">Descripción</th><th className="p-4 text-sm font-semibold text-slate-600 dark:text-slate-300">Categoría</th><th className="p-4 text-sm font-semibold text-slate-600 dark:text-slate-300">Tipo</th><th className="p-4 text-sm font-semibold text-slate-600 dark:text-slate-300 text-right">Monto (S/)</th></tr></thead>
                            <tbody>{transactions.map(t => <tr key={t.id} className="border-b border-slate-100 dark:border-slate-700 hover:bg-slate-50/70 dark:hover:bg-slate-700/50">
                                <td className="p-4 text-slate-500 dark:text-slate-400">{t.date}</td>
                                <td className="p-4 font-bold text-slate-800 dark:text-slate-100">{t.description}</td>
                                <td className="p-4 text-slate-500 dark:text-slate-400">{t.category}</td>
                                <td className={`p-4 font-medium flex items-center gap-2 ${t.type === 'Ingreso' ? 'text-emerald-600' : 'text-rose-600'}`}>{t.type === 'Ingreso' ? <ArrowUpRight size={16}/> : <ArrowDownLeft size={16}/>}{t.type}</td>
                                <td className={`p-4 text-right font-bold ${t.type === 'Ingreso' ? 'text-emerald-600' : 'text-rose-600'}`}>{Math.abs(t.amount).toFixed(2)}</td>
                            </tr>)}</tbody>
                        </table>
                    </div>
                </motion.div>;
            case 'pagos':
                return <motion.div 
                    // FIX: Using a spread attribute to bypass TypeScript type checking for framer-motion props.
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    >
                     <div className="overflow-x-auto">
                        <table className="w-full text-left">
                            <thead><tr className="border-b-2 border-slate-100 dark:border-slate-700"><th className="p-4 text-sm font-semibold text-slate-600 dark:text-slate-300">Estudiante</th><th className="p-4 text-sm font-semibold text-slate-600 dark:text-slate-300">Concepto</th><th className="p-4 text-sm font-semibold text-slate-600 dark:text-slate-300">Monto (S/)</th><th className="p-4 text-sm font-semibold text-slate-600 dark:text-slate-300">Estado</th></tr></thead>
                            <tbody>{studentPayments.map(p => <tr key={p.id} className="border-b border-slate-100 dark:border-slate-700 hover:bg-slate-50/70 dark:hover:bg-slate-700/50">
                                <td className="p-4 font-bold text-slate-800 dark:text-slate-100 capitalize">{p.student.toLowerCase()}</td>
                                <td className="p-4 text-slate-500 dark:text-slate-400">{p.concept}</td>
                                <td className="p-4 text-slate-500 dark:text-slate-400 font-medium">{p.amount.toFixed(2)}</td>
                                <td className="p-4"><span className={`px-2 py-1 text-xs font-semibold rounded-full ${getStatusChipClass(p.status)}`}>{p.status}</span></td>
                            </tr>)}</tbody>
                        </table>
                    </div>
                </motion.div>;
            case 'configuracion':
                return <motion.div 
                    // FIX: Using a spread attribute to bypass TypeScript type checking for framer-motion props.
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <Card><h3 className="font-bold text-lg text-slate-800 dark:text-slate-100">Parámetros Institucionales</h3><p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Define el año fiscal, RUC, y otros datos de la institución.</p></Card>
                    <Card><h3 className="font-bold text-lg text-slate-800 dark:text-slate-100">Gestión de Cuotas</h3><p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Configura conceptos de pago (APAFA, materiales, etc.) y sus montos.</p></Card>
                    <Card><h3 className="font-bold text-lg text-slate-800 dark:text-slate-100">Categorías Financieras</h3><p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Administra las categorías para ingresos y gastos.</p></Card>
                </motion.div>;
            default: return null;
        }
    }

    return (
        <div className="space-y-6">
            <PageHeader
                title="Administración y Finanzas"
                subtitle="Gestión de ingresos, gastos, pagos y configuración de parámetros institucionales."
                icon={Briefcase}
            />
            
             <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-sm border border-gray-100 dark:border-slate-700 p-6">
                <div className="flex flex-col md:flex-row justify-between items-center gap-4 mb-6 pb-6 border-b border-slate-200 dark:border-slate-700">
                     <nav className="flex flex-wrap gap-2">
                        {tabs.map(tab => (
                            <button key={tab.id} onClick={() => setActiveTab(tab.id)} className={`relative flex items-center gap-2 px-4 py-2 text-sm font-semibold rounded-full transition-colors ${activeTab === tab.id ? 'bg-indigo-600 text-white shadow-md' : 'bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-200 hover:bg-slate-200 dark:hover:bg-slate-600'}`}>
                                <tab.icon size={16} />
                                <span>{tab.label}</span>
                            </button>
                        ))}
                    </nav>
                     <div className="flex items-center gap-2">
                        <Button variant="secondary" icon={Download}>Exportar Reporte</Button>
                        <Button variant="primary" icon={Plus}>Nuevo Registro</Button>
                    </div>
                </div>

                <AnimatePresence mode="wait">
                    {renderContent()}
                </AnimatePresence>
            </div>
        </div>
    );
};

export default AdminFinanzasPage;