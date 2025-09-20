import React from 'react';
import { motion } from 'framer-motion';
import { Scaling, Construction } from 'lucide-react';

const CompetenciasPonderacionesPage: React.FC = () => {
  return (
    <motion.div
      // FIX: Using a spread attribute to bypass TypeScript type checking for framer-motion props.
      {...{
        initial: { opacity: 0, y: 20 },
        animate: { opacity: 1, y: 0 },
        transition: { duration: 0.5 },
      }}
      className="flex flex-col items-center justify-center h-full text-center bg-white rounded-2xl p-8 border border-gray-100 shadow-sm"
    >
      <div className="p-5 bg-amber-100 text-amber-600 rounded-full mb-6">
        <Scaling size={48} />
      </div>
      <h1 className="text-4xl font-bold text-slate-800 mb-2">Competencias y Ponderaciones</h1>
      <p className="max-w-2xl text-slate-500 mb-6">
        Define las competencias, criterios de evaluación y su peso en la calificación final.
      </p>
      <div className="flex items-center gap-2 text-amber-700 bg-amber-100 px-4 py-2 rounded-full font-semibold">
        <Construction size={20} />
        <span>Módulo en Construcción</span>
      </div>
    </motion.div>
  );
};

export default CompetenciasPonderacionesPage;