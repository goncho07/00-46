import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, File } from 'lucide-react';
import { GenericUser } from '../../types';
import Button from '../ui/Button';

interface UserImportModalProps {
    isOpen: boolean;
    onClose: () => void;
    onImport: (newUsers: GenericUser[]) => void;
}

const UserImportModal: React.FC<UserImportModalProps> = ({ isOpen, onClose, onImport }) => {
    const [step, setStep] = useState(1);
    const [file, setFile] = useState<File | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [parsedData, setParsedData] = useState<{data: any[], errors: any[]}>({data: [], errors: []});

    const handleDownloadTemplate = (e: React.MouseEvent<HTMLAnchorElement>) => {
        e.preventDefault();
        const csvHeaders = "nombre_completo,dni_codigo,email,rol,tags\n";
        const blob = new Blob([csvHeaders], { type: 'text/csv;charset=utf-8;' });
        const link = document.createElement("a");
        if (link.download !== undefined) {
            const url = URL.createObjectURL(blob);
            link.setAttribute("href", url);
            link.setAttribute("download", "plantilla_usuarios.csv");
            link.style.visibility = 'hidden';
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
        }
    };
    
    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            setFile(e.target.files[0]);
        }
    };

    const handleParseAndValidate = () => {
        if (!file) return;
        setIsLoading(true);
        setTimeout(() => { // Simulate processing time
            const reader = new FileReader();
            reader.onload = (e) => {
                const text = e.target?.result as string;
                const rows = text.split('\n').slice(1); // Assume header row
                const validRows: any[] = [];
                const errorRows: any[] = [];
                rows.forEach((rowStr, index) => {
                    const cols = rowStr.split(',');
                    if (cols.length >= 4) { // name, email, role, code
                        validRows.push({ name: cols[0], email: cols[1], role: cols[2], code: cols[3], status: 'Activo' });
                    } else if(rowStr.trim()) {
                        errorRows.push({ row: index + 2, message: 'Número incorrecto de columnas' });
                    }
                });
                setParsedData({ data: validRows, errors: errorRows });
                setStep(2);
                setIsLoading(false);
            };
            reader.readAsText(file);
        }, 1500);
    };
    
    const handleConfirmImport = () => {
        setIsLoading(true);
        setTimeout(() => { // Simulate import
            const newUsers: GenericUser[] = parsedData.data.map(d => ({
                ...d, id: d.code, avatarUrl: `https://picsum.photos/seed/${d.code}/80/80`, level: 'N/A', lastLogin: null, twoFactorEnabled: false, roles: [d.role], tags: []
            }));
            onImport(newUsers);
            handleClose();
        }, 1000);
    };

    const handleClose = () => {
        setStep(1);
        setFile(null);
        setParsedData({data: [], errors: []});
        setIsLoading(false);
        onClose();
    };
    
    return (
         <AnimatePresence>
        {isOpen && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4" onClick={handleClose}>
                <motion.div initial={{ scale: 0.9, y: 20 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.9, y: 20 }} className="relative bg-white dark:bg-slate-900 shadow-2xl rounded-2xl w-full max-w-2xl flex flex-col max-h-[90vh]" onClick={e => e.stopPropagation()}>
                    <header className="p-6 border-b border-slate-200 dark:border-slate-700 shrink-0"><div className="flex justify-between items-center"><h2 className="text-2xl font-bold text-slate-800 dark:text-slate-100">Importar Usuarios desde CSV</h2><button onClick={handleClose} className="p-2 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-500"><X size={20} /></button></div></header>
                    <main className="flex-1 overflow-y-auto p-6">
                        {step === 1 && (
                            <div>
                                <p className="mb-4 text-slate-600 dark:text-slate-300">Suba un archivo CSV con las columnas: <code>nombre_completo, dni_codigo, email, rol, tags</code>. <a href="#" onClick={handleDownloadTemplate} className="text-indigo-600 font-semibold hover:underline focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 rounded">Descargar plantilla</a>.</p>
                                <div className="mt-4 flex justify-center px-6 pt-5 pb-6 border-2 border-slate-300 dark:border-slate-600 border-dashed rounded-md">
                                    <div className="space-y-1 text-center">
                                        <File size={48} className="mx-auto text-slate-400"/>
                                        <div className="flex text-sm text-slate-600 dark:text-slate-400">
                                            <label htmlFor="file-upload" className="relative cursor-pointer bg-white dark:bg-slate-900 rounded-md font-medium text-indigo-600 hover:text-indigo-500 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-indigo-500">
                                                <span>Seleccione un archivo</span>
                                                <input id="file-upload" name="file-upload" type="file" className="sr-only" accept=".csv" onChange={handleFileChange} />
                                            </label>
                                            <p className="pl-1">o arrástrelo aquí</p>
                                        </div>
                                        {file && <p className="text-xs text-slate-500">{file.name}</p>}
                                    </div>
                                </div>
                            </div>
                        )}
                        {step === 2 && (
                            <div>
                                <p className="text-lg font-semibold">Validación de Datos</p>
                                <div className="mt-2 p-3 bg-slate-100 dark:bg-slate-800 rounded-lg flex justify-around">
                                    <p><span className="font-bold text-emerald-600">{parsedData.data.length}</span> registros listos para importar.</p>
                                    <p><span className="font-bold text-rose-600">{parsedData.errors.length}</span> registros con errores.</p>
                                </div>
                                {parsedData.errors.length > 0 && <div className="mt-4 text-rose-600">Errores encontrados: {parsedData.errors.map(e => `Fila ${e.row}: ${e.message}`).join(', ')}</div>}
                            </div>
                        )}
                    </main>
                    <footer className="p-6 border-t border-slate-200 dark:border-slate-700 shrink-0 flex justify-end items-center gap-2">
                        {step === 1 && <Button onClick={handleParseAndValidate} disabled={!file || isLoading}>{isLoading ? 'Validando...' : 'Validar Archivo'}</Button>}
                        {step === 2 && <>
                            <Button variant="secondary" onClick={() => setStep(1)} disabled={isLoading}>Atrás</Button>
                            <Button variant="primary" onClick={handleConfirmImport} disabled={parsedData.data.length === 0 || isLoading}>{isLoading ? 'Importando...' : 'Confirmar e Importar'}</Button>
                        </>}
                    </footer>
                </motion.div>
            </motion.div>
        )}
        </AnimatePresence>
    );
};

export default UserImportModal;