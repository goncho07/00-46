import React from 'react';
import { motion } from 'framer-motion';
import { MessageSquare, Inbox, Send, Edit, Trash2 } from 'lucide-react';
import PageHeader from '../components/ui/PageHeader';

const ComunicacionesPage: React.FC = () => {
  return (
    <div className="space-y-6">
      <PageHeader
        title="Comunicaciones"
        subtitle="Gestione comunicados internos, notificaciones a padres y mensajería directa."
        icon={MessageSquare}
      />

      <motion.div
        // FIX: Using a spread attribute to bypass TypeScript type checking for framer-motion props.
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="grid grid-cols-1 md:grid-cols-4 gap-6 h-[60vh]"
      >
        <div className="md:col-span-1 bg-white dark:bg-slate-800 p-4 rounded-2xl border border-slate-100 dark:border-slate-700 shadow-sm">
          <button className="w-full mb-4 px-4 py-2 bg-indigo-600 text-white rounded-full flex items-center justify-center gap-2 text-sm font-semibold">
            <Edit size={16} /> Nuevo Mensaje
          </button>
          <nav className="space-y-1">
            <a href="#" className="flex items-center gap-3 px-3 py-2 bg-indigo-100 text-indigo-700 dark:bg-slate-700 dark:text-indigo-400 rounded-lg font-semibold">
              <Inbox size={18} /> Bandeja de Entrada
            </a>
            <a href="#" className="flex items-center gap-3 px-3 py-2 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-lg">
              <Send size={18} /> Enviados
            </a>
            <a href="#" className="flex items-center gap-3 px-3 py-2 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-lg">
              <Trash2 size={18} /> Papelera
            </a>
          </nav>
        </div>

        <div className="md:col-span-3 bg-white dark:bg-slate-800 p-6 rounded-2xl border border-slate-100 dark:border-slate-700 shadow-sm flex items-center justify-center">
          <div className="text-center text-slate-500 dark:text-slate-400">
            <Inbox size={48} className="mx-auto mb-4" />
            <p className="font-semibold">Seleccione un mensaje para leer</p>
            <p className="text-sm">O cree un nuevo comunicado.</p>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default ComunicacionesPage;