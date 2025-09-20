import React from 'react';
import { motion } from 'framer-motion';
import { Settings, ArrowLeft, Save } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
// FIX: Explicitly import AcademicLevels type for stronger typing.
import { useAcademicSettingsStore, AcademicLevels } from '../store/academicSettingsStore';
import Card from '../components/ui/Card';

const ConfiguracionAcademicaPage: React.FC = () => {
  const navigate = useNavigate();
  const { enabledLevels, toggleLevel } = useAcademicSettingsStore();

  // FIX: Use the imported AcademicLevels type to define the key type, preventing incorrect type inference.
  const levels: { key: keyof AcademicLevels; label: string }[] = [
    { key: 'inicial', label: 'Nivel Inicial' },
    { key: 'primaria', label: 'Nivel Primaria' },
    { key: 'secundaria', label: 'Nivel Secundaria' },
  ];

  return (
    <motion.div
      // FIX: Using a spread attribute to bypass TypeScript type checking for framer-motion props.
      {...{
        initial: { opacity: 0, y: 20 },
        animate: { opacity: 1, y: 0 },
        transition: { duration: 0.5 },
      }}
      className="h-full space-y-6"
    >
      <div>
        <button onClick={() => navigate('/academico')} className="flex items-center gap-2 mb-4 text-sm text-slate-600 font-semibold hover:text-indigo-600 transition-colors">
            <ArrowLeft size={18} /> Volver al Panel Principal
        </button>
        <h1 className="text-4xl font-bold text-slate-800 flex items-center gap-3"><Settings/> Configuración Académica</h1>
        <p className="text-slate-500 mt-1 max-w-2xl">Gestione los niveles educativos ofertados y otros parámetros del año académico.</p>
      </div>

      <Card>
        <h2 className="text-xl font-bold text-slate-800 mb-2">Niveles Educativos Ofertados</h2>
        <p className="text-sm text-slate-500 mb-6">Habilite o deshabilite los niveles que la institución educativa ofrece. Esto afectará las opciones disponibles en Matrícula y otros módulos.</p>
        
        <div className="space-y-4 max-w-sm">
          {levels.map(level => (
            <div key={level.key} className="flex items-center justify-between p-4 bg-slate-50 rounded-lg">
              <label htmlFor={level.key} className="font-semibold text-slate-700">{level.label}</label>
              <button
                id={level.key}
                onClick={() => toggleLevel(level.key)}
                className={`relative inline-flex items-center h-6 rounded-full w-11 transition-colors ${enabledLevels[level.key] ? 'bg-indigo-600' : 'bg-slate-300'}`}
              >
                <span className={`inline-block w-4 h-4 transform bg-white rounded-full transition-transform ${enabledLevels[level.key] ? 'translate-x-6' : 'translate-x-1'}`} />
              </button>
            </div>
          ))}
        </div>
      </Card>

      <div className="flex justify-end">
        <button className="flex items-center gap-2 px-5 py-2.5 bg-indigo-600 text-white rounded-full text-sm font-semibold shadow-lg shadow-indigo-500/20 hover:bg-indigo-700 transition-all">
          <Save size={18} />
          <span>Guardar Configuración</span>
        </button>
      </div>

    </motion.div>
  );
};

export default ConfiguracionAcademicaPage;