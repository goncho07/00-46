import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Warehouse, Search, Plus, Library, FlaskConical, Calendar, Laptop, ArrowRight } from 'lucide-react';
import PageHeader from '../components/ui/PageHeader';

type ResourceTab = 'inventario' | 'prestamos' | 'reservas' | 'activos';

// Mock Data
const inventoryItems = [
    { id: 'LIB-001', name: 'El Caballero Carmelo', category: 'Biblioteca', stock: 15, available: 10, status: 'Disponible' },
    { id: 'LAB-001', name: 'Microscopio Compuesto', category: 'Laboratorio', stock: 10, available: 8, status: 'Disponible' },
    { id: 'LIB-002', name: 'Cien Años de Soledad', category: 'Biblioteca', stock: 20, available: 5, status: 'Préstamo Alto' },
    { id: 'LAB-002', name: 'Kit de Disección', category: 'Laboratorio', stock: 25, available: 25, status: 'Disponible' },
    { id: 'LIB-003', name: 'Álgebra de Baldor', category: 'Biblioteca', stock: 30, available: 0, status: 'Agotado' },
];

const loans = [
    { id: 'L-001', item: 'El Caballero Carmelo', borrower: 'QUISPE ROJAS, ANA SOFÍA', loanDate: '2025-07-20', dueDate: '2025-08-05', status: 'Activo' },
    { id: 'L-002', item: 'Microscopio Compuesto', borrower: 'SOTELO RODRÍGUEZ FELIX YVAN', loanDate: '2025-07-18', dueDate: '2025-07-25', status: 'Vencido' },
    { id: 'L-003', item: 'Cien Años de Soledad', borrower: 'TORRES FLORES, CAMILA VALERIA', loanDate: '2025-07-22', dueDate: '2025-08-08', status: 'Activo' },
];

const reservations = [
    { id: 'R-001', space: 'Laboratorio de Química', reservedBy: 'BUENDIA SANTIAGO VLADIMIR', date: '2025-08-01', time: '10:00 - 12:00' },
    { id: 'R-002', space: 'Sala de Proyecciones', reservedBy: 'AQUINO POMA FREDDY', date: '2025-08-01', time: '14:00 - 16:00' },
    { id: 'R-003', space: 'Cancha de Fútbol', reservedBy: 'VIZCARRA HERRERA GUSTAVO', date: '2025-08-02', time: '09:00 - 11:00' },
]

const RecursosPage: React.FC = () => {
    const [activeTab, setActiveTab] = useState<ResourceTab>('inventario');

    const tabs: { id: ResourceTab, label: string, icon: React.ElementType }[] = [
        { id: 'inventario', label: 'Inventario', icon: Library },
        { id: 'prestamos', label: 'Préstamos', icon: ArrowRight },
        { id: 'reservas', label: 'Reservas', icon: Calendar },
        { id: 'activos', label: 'Activos Fijos', icon: Laptop },
    ];
    
    const getStatusChipClass = (status: string) => {
        switch (status) {
            case 'Disponible': return 'bg-emerald-100 text-emerald-800 dark:bg-emerald-500/20 dark:text-emerald-300';
            case 'Préstamo Alto': return 'bg-amber-100 text-amber-800 dark:bg-amber-500/20 dark:text-amber-300';
            case 'Agotado': return 'bg-rose-100 text-rose-800 dark:bg-rose-500/20 dark:text-rose-300';
            case 'Activo': return 'bg-sky-100 text-sky-800 dark:bg-sky-500/20 dark:text-sky-300';
            case 'Vencido': return 'bg-rose-100 text-rose-800 dark:bg-rose-500/20 dark:text-rose-300';
            default: return 'bg-slate-100 text-slate-800 dark:bg-slate-700 dark:text-slate-200';
        }
    };

    const renderContent = () => {
        switch (activeTab) {
            case 'inventario':
                return <motion.div 
                    // FIX: Using a spread attribute to bypass TypeScript type checking for framer-motion props.
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    >
                    <div className="overflow-x-auto">
                        <table className="w-full text-left">
                            <thead><tr className="border-b-2 border-slate-100 dark:border-slate-700"><th className="p-4 text-sm font-semibold text-slate-600 dark:text-slate-300">Item</th><th className="p-4 text-sm font-semibold text-slate-600 dark:text-slate-300">Categoría</th><th className="p-4 text-sm font-semibold text-slate-600 dark:text-slate-300">Stock</th><th className="p-4 text-sm font-semibold text-slate-600 dark:text-slate-300">Disponibles</th><th className="p-4 text-sm font-semibold text-slate-600 dark:text-slate-300">Estado</th></tr></thead>
                            <tbody>{inventoryItems.map(item => <tr key={item.id} className="border-b border-slate-100 dark:border-slate-700 hover:bg-slate-50/70 dark:hover:bg-slate-700/50">
                                <td className="p-4 font-bold text-slate-800 dark:text-slate-100">{item.name}</td>
                                <td className="p-4 text-slate-500 dark:text-slate-400">{item.category}</td>
                                <td className="p-4 text-slate-500 dark:text-slate-400 font-medium">{item.stock}</td>
                                <td className="p-4 text-slate-500 dark:text-slate-400 font-medium">{item.available}</td>
                                <td className="p-4"><span className={`px-2 py-1 text-xs font-semibold rounded-full ${getStatusChipClass(item.status)}`}>{item.status}</span></td>
                            </tr>)}</tbody>
                        </table>
                    </div>
                </motion.div>;
            case 'prestamos':
                 return <motion.div 
                    // FIX: Using a spread attribute to bypass TypeScript type checking for framer-motion props.
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    >
                    <div className="overflow-x-auto">
                        <table className="w-full text-left">
                            <thead><tr className="border-b-2 border-slate-100 dark:border-slate-700"><th className="p-4 text-sm font-semibold text-slate-600 dark:text-slate-300">Item</th><th className="p-4 text-sm font-semibold text-slate-600 dark:text-slate-300">Prestatario</th><th className="p-4 text-sm font-semibold text-slate-600 dark:text-slate-300">Fecha Préstamo</th><th className="p-4 text-sm font-semibold text-slate-600 dark:text-slate-300">Fecha Devolución</th><th className="p-4 text-sm font-semibold text-slate-600 dark:text-slate-300">Estado</th></tr></thead>
                            <tbody>{loans.map(loan => <tr key={loan.id} className="border-b border-slate-100 dark:border-slate-700 hover:bg-slate-50/70 dark:hover:bg-slate-700/50">
                                <td className="p-4 font-bold text-slate-800 dark:text-slate-100">{loan.item}</td>
                                <td className="p-4 text-slate-500 dark:text-slate-400 capitalize">{loan.borrower.toLowerCase()}</td>
                                <td className="p-4 text-slate-500 dark:text-slate-400">{loan.loanDate}</td>
                                <td className="p-4 text-slate-500 dark:text-slate-400">{loan.dueDate}</td>
                                <td className="p-4"><span className={`px-2 py-1 text-xs font-semibold rounded-full ${getStatusChipClass(loan.status)}`}>{loan.status}</span></td>
                            </tr>)}</tbody>
                        </table>
                    </div>
                </motion.div>;
            case 'reservas':
                return <motion.div 
                    // FIX: Using a spread attribute to bypass TypeScript type checking for framer-motion props.
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    >
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {reservations.map(r => (
                            <div key={r.id} className="bg-slate-50 dark:bg-slate-700/50 p-4 rounded-lg border border-slate-200 dark:border-slate-700">
                                <p className="font-bold text-indigo-700 dark:text-indigo-400">{r.space}</p>
                                <p className="text-sm text-slate-600 dark:text-slate-300 capitalize">Reservado por: {r.reservedBy.toLowerCase()}</p>
                                <p className="text-sm font-semibold text-slate-800 dark:text-slate-100 mt-2">{r.date} | {r.time}</p>
                            </div>
                        ))}
                    </div>
                </motion.div>;
            default: return null;
        }
    }

    return (
        <div className="space-y-6">
            <PageHeader 
                title="Módulo de Recursos"
                subtitle="Gestión de inventarios de bibliotecas y laboratorios, préstamos y devoluciones, control de activos y reservas de aulas e infraestructura."
                icon={Warehouse}
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
                    <div className="flex items-center gap-4">
                        <div className="relative w-full md:w-auto">
                            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
                            <input type="text" placeholder="Buscar..." className="w-full pl-10 pr-4 py-2 border border-slate-200 dark:border-slate-600 rounded-full bg-white dark:bg-slate-700 dark:text-slate-200"/>
                        </div>
                        <button className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-full text-sm font-semibold shadow-lg shadow-indigo-500/20 hover:bg-indigo-700 transition-all">
                            <Plus size={18} />
                            <span>Nuevo Registro</span>
                        </button>
                    </div>
                </div>

                <AnimatePresence mode="wait">
                    {renderContent()}
                </AnimatePresence>
            </div>
        </div>
    );
};

export default RecursosPage;