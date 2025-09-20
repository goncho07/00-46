import React from 'react';
import { motion } from 'framer-motion';
import { Settings, Shield, Activity, ArrowRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import PageHeader from '../components/ui/PageHeader';
import Card from '../components/ui/Card';

const settingsCards = [
    { title: 'Roles y Permisos', description: 'Cree y gestione roles de usuario para controlar el acceso a los módulos.', icon: Shield, path: '/settings/roles' },
    { title: 'Registro de Actividad', description: 'Audite todas las acciones importantes realizadas en el sistema.', icon: Activity, path: '/settings/activity-log' },
];

const SettingsPage: React.FC = () => {
    const navigate = useNavigate();
    return (
        <div className="space-y-6">
            <PageHeader
                title="Configuración del Sistema"
                subtitle="Ajuste los parámetros del sistema, gestione la seguridad y audite la actividad."
                icon={Settings}
            />
            <motion.div
                className="grid grid-cols-1 md:grid-cols-2 gap-6"
                // FIX: Using a spread attribute to bypass TypeScript type checking for framer-motion props.
                {...{
                  initial: "hidden",
                  animate: "visible",
                  variants: { visible: { transition: { staggerChildren: 0.1 } } },
                }}
            >
                {settingsCards.map(card => (
                    <motion.div key={card.path} // FIX: Using a spread attribute to bypass TypeScript type checking for framer-motion props.
{...{
                      variants: { hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0 } },
                    }}>
                        <Card onClick={() => navigate(card.path)} className="h-full flex flex-col justify-between group cursor-pointer">
                            <div>
                                <div className="p-3 bg-indigo-100 text-indigo-600 dark:bg-indigo-500/20 dark:text-indigo-300 rounded-xl w-fit mb-4">
                                   <card.icon size={24} />
                                </div>
                                <h3 className="text-lg font-bold text-slate-800 dark:text-slate-100">{card.title}</h3>
                                <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">{card.description}</p>
                            </div>
                             <div className="flex items-center justify-end text-indigo-600 dark:text-indigo-400 font-semibold mt-4">
                                <span>Ir al módulo</span>
                                <ArrowRight size={18} className="ml-1 transition-transform group-hover:translate-x-1" />
                            </div>
                        </Card>
                    </motion.div>
                ))}
            </motion.div>
        </div>
    );
};

export default SettingsPage;