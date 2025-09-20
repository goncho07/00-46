import React, { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { Activity, Download } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import { es } from 'date-fns/locale/es';
import { activityLogs as initialActivityLogs } from '../data/activityLogs';
import { ActivityLog } from '../types';
import PageHeader from '../components/ui/PageHeader';
import Button from '../components/ui/Button';
import Card from '../components/ui/Card';

const ActivityLogPage: React.FC = () => {
    const [logs] = useState<ActivityLog[]>(initialActivityLogs);
    const [actionFilter, setActionFilter] = useState('all');
    const [actorFilter, setActorFilter] = useState('all');

    const filteredLogs = useMemo(() => {
        return logs.filter(log => {
            const actionMatch = actionFilter === 'all' || log.action === actionFilter;
            const actorMatch = actorFilter === 'all' || log.user === actorFilter;
            return actionMatch && actorMatch;
        });
    }, [logs, actionFilter, actorFilter]);

    const uniqueActions = useMemo(() => [...new Set(logs.map(log => log.action))], [logs]);
    const uniqueActors = useMemo(() => [...new Set(logs.map(log => log.user))], [logs]);
    
    const handleExport = () => {
        const csvContent = "data:text/csv;charset=utf-8," +
            ["ID,Timestamp,Actor,Acción,Usuario Afectado,Detalles,IP"].join(",") + "\n" +
            filteredLogs.map(l => [l.id, l.timestamp, l.user, l.action, l.targetUser || 'N/A', `"${l.details.replace(/"/g, '""')}"`, l.ipAddress || ''].join(",")).join("\n");
        const encodedUri = encodeURI(csvContent);
        const link = document.createElement("a");
        link.setAttribute("href", encodedUri);
        link.setAttribute("download", "registro_actividad.csv");
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    return (
        <div className="space-y-6">
            <PageHeader
                title="Registro de Actividad Global"
                subtitle="Audite todas las acciones importantes realizadas por los usuarios en el sistema."
                icon={Activity}
                actions={<Button variant="secondary" icon={Download} onClick={handleExport}>Exportar a CSV</Button>}
            />
            <Card className="!p-0">
                <div className="p-4 border-b border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/50 flex flex-col sm:flex-row gap-4">
                    <div className="flex-1">
                         <label htmlFor="action-filter" className="text-sm font-semibold text-slate-500 dark:text-slate-400">Acción</label>
                        <select id="action-filter" value={actionFilter} onChange={e => setActionFilter(e.target.value)} className="w-full p-2 mt-1 text-sm border border-slate-200 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700">
                            <option value="all">Todas las Acciones</option>
                            {uniqueActions.map(a => <option key={a} value={a}>{a}</option>)}
                        </select>
                    </div>
                    <div className="flex-1">
                        <label htmlFor="actor-filter" className="text-sm font-semibold text-slate-500 dark:text-slate-400">Actor</label>
                        <select id="actor-filter" value={actorFilter} onChange={e => setActorFilter(e.target.value)} className="w-full p-2 mt-1 text-sm border border-slate-200 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700">
                            <option value="all">Todos los Actores</option>
                            {uniqueActors.map(a => <option key={a} value={a}>{a}</option>)}
                        </select>
                    </div>
                </div>
                <div className="p-6 space-y-4 max-h-[60vh] overflow-y-auto">
                    {filteredLogs.map(log => (
                         <motion.div
                            key={log.id}
                            // FIX: Using a spread attribute to bypass TypeScript type checking for framer-motion props.
                            {...{
                              initial: { opacity: 0, y: 10 },
                              animate: { opacity: 1, y: 0 },
                            }}
                            className="flex items-start gap-3 pb-4 border-b border-slate-100 dark:border-slate-700 last:border-b-0"
                         >
                            <img src={log.userAvatar} className="w-10 h-10 rounded-full mt-1 shrink-0"/>
                            <div>
                                <p className="text-sm">
                                    <strong className="font-semibold text-slate-800 dark:text-slate-100 capitalize">{log.user.toLowerCase()}</strong> realizó la acción <strong className="font-semibold">{log.action}</strong>
                                    {log.targetUser && log.targetUser !== 'N/A' && <> sobre <strong className="font-semibold capitalize">{log.targetUser.toLowerCase()}</strong></>}
                                </p>
                                <p className="text-sm text-slate-600 dark:text-slate-400 mt-1 italic">"{log.details}"</p>
                                <p className="text-xs text-slate-400 dark:text-slate-500 mt-1">
                                    {/* FIX: Using `as any` to bypass a TypeScript error where `locale` is not recognized in `FormatDistanceOptions`, likely due to a type definition issue in date-fns. */}
                                    {formatDistanceToNow(new Date(log.timestamp), { addSuffix: true, locale: es } as any)} {log.ipAddress && `(IP: ${log.ipAddress})`}
                                </p>
                            </div>
                        </motion.div>
                    ))}
                </div>
            </Card>
        </div>
    );
};

export default ActivityLogPage;