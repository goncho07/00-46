import React from 'react';
import { motion } from 'framer-motion';
import { Edit, BookOpen, Construction } from 'lucide-react';

const RegistrarNotasPage: React.FC = () => {
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
        <h1 className="text-4xl font-bold text-slate-800 dark:text-slate-100 flex items-center gap-3"><Edit /> Registrar Notas</h1>
        <p className="text-slate-500 dark:text-slate-400 mt-1 max-w-2xl">Seleccione un curso y período para ingresar o modificar las calificaciones de los estudiantes.</p>
      </div>

       <div className="flex flex-col items-center justify-center text-center bg-white dark:bg-slate-800 rounded-2xl p-8 border border-gray-100 dark:border-slate-700 shadow-sm h-96">
        <div className="p-5 bg-amber-100 text-amber-600 rounded-full mb-6">
          <Construction size={48} />
        </div>
        <h2 className="text-2xl font-bold text-slate-800 dark:text-slate-100 mb-2">Página en Construcción</h2>
        <p className="max-w-md text-slate-500 dark:text-slate-400">
          Esta sección permitirá el registro detallado de notas por competencias y criterios de evaluación.
        </p>
      </div>

    </motion.div>
  );
};

export default RegistrarNotasPage;