import React from 'react';
import { motion } from 'framer-motion';
import { BookCheck, Construction, ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const MonitoreoCursosPage: React.FC = () => {
  const navigate = useNavigate();
  return (
    <motion.div
      // FIX: Using a spread attribute to bypass TypeScript type checking for framer-motion props.
      {...{
        initial: { opacity: 0, y: 20 },
        animate: { opacity: 1, y: 0 },
        transition: { duration: 0.5 },
      }}
      className="h-full"
    >
      <button onClick={() => navigate('/academico')} className="flex items-center gap-2 mb-6 px-4 py-2 bg-white text-slate-700 font-semibold rounded-full hover:bg-slate-100 transition-colors border border-slate-200">
          <ArrowLeft size={18} /> Volver al Panel
      </button>

      <div className="flex flex-col items-center justify-center text-center bg-white rounded-2xl p-8 border border-gray-100 shadow-sm h-[calc(100%-60px)]">
        <div className="p-5 bg-blue-100 text-blue-600 rounded-full mb-6">
          <BookCheck size={48} />
        </div>
        <h1 className="text-4xl font-bold text-slate-800 mb-2">Monitoreo por Cursos</h1>
        <p className="max-w-2xl text-slate-500 mb-6">
          Revise el estado de carga de notas, promedios y distribución de calificaciones por cada curso. Marque cursos como revisados o solicite correcciones.
        </p>
        <div className="flex items-center gap-2 text-amber-700 bg-amber-100 px-4 py-2 rounded-full font-semibold">
          <Construction size={20} />
          <span>Módulo en Construcción</span>
        </div>
      </div>
    </motion.div>
  );
};

export default MonitoreoCursosPage;