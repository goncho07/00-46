import React from 'react';
import { motion } from 'framer-motion';
import { Handshake, Construction, ExternalLink } from 'lucide-react';

const ConvivenciaPage: React.FC = () => {
  return (
    <motion.div
      // FIX: Using a spread attribute to bypass TypeScript type checking for framer-motion props.
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="flex flex-col items-center justify-center h-full text-center bg-white dark:bg-slate-800 rounded-2xl p-8 border border-gray-100 dark:border-slate-700 shadow-sm"
    >
      <div className="p-5 bg-indigo-100 text-indigo-600 rounded-full mb-6">
        <Handshake size={48} />
      </div>
      <h1 className="text-4xl font-bold text-slate-800 dark:text-slate-100 mb-2">Módulo de Convivencia Escolar</h1>
      <p className="max-w-2xl text-slate-500 dark:text-slate-400 mb-6">
        Registro de incidencias disciplinarias y casos de convivencia escolar, con niveles de gravedad y seguimiento, e integración con SISEVE.
      </p>
      <div className="flex items-center gap-2 text-amber-700 bg-amber-100 px-4 py-2 rounded-full font-semibold">
        <Construction size={20} />
        <span>Módulo en Construcción</span>
      </div>
      <a
        href="https://siseve.minedu.gob.pe/"
        target="_blank"
        rel="noopener noreferrer"
        className="mt-8 inline-flex items-center gap-2 px-6 py-3 bg-rose-600 text-white rounded-full font-bold shadow-lg hover:bg-rose-700 transition transform hover:scale-105"
      >
        Reportar Violencia Escolar en SíseVe <ExternalLink size={18} />
      </a>
    </motion.div>
  );
};

export default ConvivenciaPage;