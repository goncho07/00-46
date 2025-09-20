import React from 'react';
import { motion } from 'framer-motion';
import { LucideProps, Construction, ExternalLink } from 'lucide-react';

interface PlaceholderPageProps {
  title: string;
  description: string;
  icon: React.ComponentType<LucideProps>;
}

const PlaceholderPage: React.FC<PlaceholderPageProps> = ({ title, description, icon: Icon }) => {
  const isConvivencia = title.toLowerCase().includes('convivencia');
  const isMatricula = title.toLowerCase().includes('matrícula');

  return (
    <div
      className="flex flex-col items-center justify-center h-full text-center bg-white dark:bg-slate-800 rounded-2xl p-8 border border-gray-100 dark:border-slate-700 shadow-sm"
    >
      <div className="p-5 bg-indigo-100 text-indigo-600 rounded-full mb-6">
        <Icon size={48} />
      </div>
      <h1 className="text-4xl font-bold text-slate-800 dark:text-slate-100 mb-2">{title}</h1>
      <p className="max-w-md text-slate-500 dark:text-slate-400 mb-6">{description}</p>
      
      <div className="flex items-center gap-2 text-amber-700 bg-amber-100 px-4 py-2 rounded-full font-semibold">
          <Construction size={20} />
          <span>Módulo en Construcción</span>
      </div>

      {isConvivencia && (
          <a
            href="https://siseve.minedu.gob.pe/"
            target="_blank"
            rel="noopener noreferrer"
            className="mt-8 inline-flex items-center gap-2 px-6 py-3 bg-rose-600 text-white rounded-full font-bold shadow-lg hover:bg-rose-700 transition transform hover:scale-105"
          >
            Reportar Violencia Escolar en SíseVe <ExternalLink size={18} />
          </a>
      )}

      {isMatricula && (
           <a
            href="https://web.siagie.minedu.gob.pe/"
            target="_blank"
            rel="noopener noreferrer"
            className="mt-8 inline-flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-full font-bold shadow-lg hover:bg-blue-700 transition transform hover:scale-105"
          >
            Ir al portal SIAGIE <ExternalLink size={18} />
          </a>
      )}

      <div className="mt-12 text-xs text-slate-400 dark:text-slate-500 max-w-lg text-center">
          <p className="font-semibold">Aviso de Privacidad (Ley 29733)</p>
          <p>Este sistema gestiona datos personales de estudiantes y personal educativo. El tratamiento de esta información cumple con la Ley de Protección de Datos Personales del Perú. Para más información, consulte la sección de Administración.</p>
      </div>

    </div>
  );
};

export default PlaceholderPage;