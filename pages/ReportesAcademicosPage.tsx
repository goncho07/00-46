import React from 'react';
import { motion } from 'framer-motion';
import { FileDown, Construction, ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const ReportesAcademicosPage: React.FC = () => {
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
        <div className="p-5 bg-red-100 text-red-600 rounded-full mb-6">
          <FileDown size={48} />
        </div>
        <h1 className="text-4xl font-bold text-slate-800 mb-2">Reportes y Descargas</h1>
        <p className="max-w-2xl text-slate-500 mb-6">
          Acceda a un repositorio centralizado para generar, descargar y programar el envío de todos los reportes académicos, desde resúmenes ejecutivos hasta matrices de calificación.
        </p>
        <div className="flex items-center gap-2 text-amber-700 bg-amber-100 px-4 py-2 rounded-full font-semibold">
          <Construction size={20} />
          <span>Módulo en Construcción</span>
        </div>
      </div>
    </motion.div>
  );
};

export default ReportesAcademicosPage;