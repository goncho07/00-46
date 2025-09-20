import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Button from '../ui/Button';
// FIX: Import types from types.ts
import { ScheduleModalState, GenericUser } from '../../types';

interface ScheduleDeactivationModalProps extends ScheduleModalState {
    onClose: () => void;
}

const ScheduleDeactivationModal: React.FC<ScheduleDeactivationModalProps> = ({ isOpen, onClose, onConfirm, users }) => {
    const [date, setDate] = useState('');

    const handleConfirm = () => {
        if(date) {
            onConfirm(date);
            setDate('');
        }
    };
    
    return (
        <AnimatePresence>
            {isOpen && (
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 bg-black/50 z-[60] flex items-center justify-center p-4" onClick={onClose}>
                    <motion.div initial={{ scale: 0.9 }} animate={{ scale: 1, y: 0 }} className="bg-white dark:bg-slate-800 rounded-2xl shadow-xl w-full max-w-md" onClick={e => e.stopPropagation()}>
                         <div className="p-6">
                            <h3 className="text-lg font-bold text-slate-800 dark:text-slate-100">Programar Baja de Usuario(s)</h3>
                            <p className="text-sm text-slate-500 dark:text-slate-400 mt-2">Seleccione una fecha para desactivar automáticamente la(s) cuenta(s) de: <strong>{users.length > 1 ? `${users.length} usuarios` : (users[0] as any)?.name}</strong>.</p>
                            <label htmlFor="deactivation-date" className="sr-only">Fecha de baja</label>
                            <input id="deactivation-date" type="date" value={date} onChange={e => setDate(e.target.value)} min={new Date().toISOString().split("T")[0]} className="w-full mt-4 p-2 text-sm border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500" />
                            <div className="mt-6 flex justify-end gap-2">
                                <Button variant="secondary" onClick={onClose}>Cancelar</Button>
                                <Button onClick={handleConfirm} disabled={!date} className="bg-amber-600 text-white hover:bg-amber-700">Programar Baja</Button>
                            </div>
                        </div>
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>
    );
};

export default ScheduleDeactivationModal;