import React from 'react';
import { motion } from 'framer-motion';
import { UserSearch, Construction, ArrowLeft, ArrowRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const MonitoreoEstudiantesPage: React.FC = () => {
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
        <div className="p-5 bg-amber-100 text-amber-600 rounded-full mb-6">
          <UserSearch size={48} />
        </div>
        <h1 className="text-4xl font-bold text-slate-800 mb-2">Monitoreo por Estudiantes</h1>
        <p className="max-w-2xl text-slate-500 mb-6">
          Busque estudiantes, identifique casos en riesgo por su promedio o asistencia, y revise su ficha académica detallada para un seguimiento oportuno.
        </p>
        <div className="flex items-center gap-2 text-amber-700 bg-amber-100 px-4 py-2 rounded-full font-semibold mb-8">
          <Construction size={20} />
          <span>Módulo en Construcción</span>
        </div>
         <button
            onClick={() => navigate('/usuarios')}
            className="inline-flex items-center gap-2 px-6 py-3 bg-indigo-600 text-white rounded-full font-bold shadow-lg hover:bg-indigo-700 transition transform hover:scale-105"
          >
            Ir a Gestión de Usuarios <ArrowRight size={18} />
          </button>
      </div>
    </motion.div>
  );
};

export default MonitoreoEstudiantesPage;