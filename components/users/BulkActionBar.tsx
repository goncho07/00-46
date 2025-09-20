import React from 'react';
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion';
import { X, Power, Info, Send, Download, UserX } from 'lucide-react';

interface BulkActionBarProps {
    count: number;
    onClear: () => void;
    onAction: (action: string) => void;
}

const BulkActionBar: React.FC<BulkActionBarProps> = ({ count, onClear, onAction }) => {
    const shouldReduceMotion = useReducedMotion();

    return (
        <AnimatePresence initial={!shouldReduceMotion}>
            {count > 0 && (
                <motion.div
                    role="status"
                    aria-live="polite"
                    aria-atomic
                    initial={shouldReduceMotion ? undefined : { y: -100, opacity: 0 }}
                    animate={shouldReduceMotion ? undefined : { y: 0, opacity: 1 }}
                    exit={shouldReduceMotion ? undefined : { y: -100, opacity: 0 }}
                    transition={{ type: 'spring', stiffness: 200, damping: 25 }}
                    className="fixed top-24 left-1/2 -translate-x-1/2 w-auto bg-slate-800/90 dark:bg-slate-900/90 backdrop-blur-sm text-white rounded-xl shadow-2xl z-40 flex items-center gap-6 px-4 py-3 border border-slate-700"
                >
                    <div className="flex items-center gap-2">
                        <span className="bg-indigo-500 text-white text-sm font-bold w-6 h-6 flex items-center justify-center rounded-full" aria-hidden>{count}</span>
                        <span className="font-semibold text-base">{count} seleccionados</span>
                        <button type="button" onClick={onClear} className="ml-2 text-slate-300 hover:text-white transition focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-400 rounded-full" aria-label="Limpiar selección">
                            <X size={20} />
                        </button>
                    </div>
                    <div className="h-6 w-px bg-slate-600" aria-hidden></div>
                    <div className="flex items-center gap-2">
                        <button type="button" onClick={() => onAction('activate')} title="Activar" aria-label="Activar usuarios seleccionados" className="flex items-center gap-1.5 p-2 text-sm rounded-lg hover:bg-slate-700 transition"><Power size={16} /></button>
                        <button type="button" onClick={() => onAction('suspend')} title="Suspender" aria-label="Suspender usuarios seleccionados" className="flex items-center gap-1.5 p-2 text-sm rounded-lg hover:bg-slate-700 transition"><Info size={16} /></button>
                        <button type="button" onClick={() => onAction('resend-invitation')} title="Reenviar invitación" aria-label="Reenviar invitación" className="flex items-center gap-1.5 p-2 text-sm rounded-lg hover:bg-slate-700 transition"><Send size={16} /></button>
                        <button type="button" onClick={() => onAction('generate-carnets')} title="Generar carnets" aria-label="Generar carnets" className="flex items-center gap-1.5 p-2 text-sm rounded-lg hover:bg-slate-700 transition"><UserX size={16} /></button>
                        <button type="button" onClick={() => onAction('export-selected')} title="Exportar" aria-label="Exportar usuarios seleccionados" className="flex items-center gap-1.5 p-2 text-sm rounded-lg hover:bg-slate-700 transition"><Download size={16} /></button>
                    </div>
                </motion.div>
            )}
        </AnimatePresence>
    );
};

export default BulkActionBar;