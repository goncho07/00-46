import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Button from '../ui/Button';
// FIX: Import ConfirmationModalState from types.ts
import { ConfirmationModalState } from '../../types';

interface ConfirmationModalProps extends ConfirmationModalState {
    onClose: () => void;
}

const ConfirmationModal: React.FC<ConfirmationModalProps> = ({ isOpen, onClose, onConfirm, title, message, confirmText = "Confirmar", confirmClass = "bg-rose-600", withReason = false }) => {
    const [reason, setReason] = useState('');
    
    const handleConfirm = () => {
        onConfirm(reason);
        setReason(''); // Reset reason after confirm
    };

    return (
        <AnimatePresence>
            {isOpen && (
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 bg-black/50 z-[60] flex items-center justify-center p-4" onClick={onClose}>
                    <motion.div initial={{ scale: 0.9, y: 20 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.9, y: 20 }} className="bg-white dark:bg-slate-800 rounded-2xl shadow-xl w-full max-w-md" onClick={e => e.stopPropagation()}>
                        <div className="p-6">
                            <h3 className="text-lg font-bold text-slate-800 dark:text-slate-100">{title}</h3>
                            <p className="text-sm text-slate-500 dark:text-slate-400 mt-2">{message}</p>
                            {withReason && (
                                <>
                                <label htmlFor="confirmation-reason" className="sr-only">Motivo (opcional)</label>
                                <textarea id="confirmation-reason" value={reason} onChange={e => setReason(e.target.value)} placeholder="Motivo (opcional)..." className="w-full mt-4 p-2 text-sm border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500" rows={2}></textarea>
                                </>
                            )}
                            <div className="mt-6 flex justify-end gap-2">
                                <Button variant="secondary" onClick={onClose}>Cancelar</Button>
                                <Button variant="danger" onClick={handleConfirm} className={`!${confirmClass}`}>{confirmText}</Button>
                            </div>
                        </div>
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>
    );
};

export default ConfirmationModal;