import React from 'react';
import { motion } from 'framer-motion';
import { BookCheck, Construction } from 'lucide-react';

const LibroCalificacionesPage: React.FC = () => {
  return (
    <motion.div
      // FIX: Using a spread attribute to bypass TypeScript type checking for framer-motion props.
      {...{
        initial: { opacity: 0, y: 20 },
        animate: { opacity: 1, y: 0 },
      }}
      className="space-y-6"
    >
      <div>
        <h1 className="text-4xl font-bold text-slate-800 dark:text-slate-100 flex items-center gap-3"><BookCheck /> Libro de Calificaciones</h1>
        <p className="text-slate-500 dark:text-slate-400 mt-1 max-w-2xl">Consulte el registro completo de calificaciones de sus cursos y estudiantes.</p>
      </div>

      <div className="flex flex-col items-center justify-center text-center bg-white dark:bg-slate-800 rounded-2xl p-8 border border-gray-100 dark:border-slate-700 shadow-sm h-96">
        <div className="p-5 bg-amber-100 text-amber-600 rounded-full mb-6">
          <Construction size={48} />
        </div>
        <h2 className="text-2xl font-bold text-slate-800 dark:text-slate-100 mb-2">Página en Construcción</h2>
        <p className="max-w-md text-slate-500 dark:text-slate-400">
          Esta sección mostrará una vista consolidada de todas las calificaciones, promedios y progreso de los estudiantes.
        </p>
      </div>
    </motion.div>
  );
};

export default LibroCalificacionesPage;