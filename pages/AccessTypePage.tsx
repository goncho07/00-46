import React from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Shield, User, GraduationCap, Users } from 'lucide-react';

const AccessTypePage: React.FC = () => {
  const navigate = useNavigate();
  const logoUrl = 'https://cdn-icons-png.flaticon.com/512/2602/2602414.png';

  const accessOptions = [
    { role: 'director', label: 'Personal Directivo', icon: Shield, disabled: false },
    { role: 'teacher', label: 'Docente', icon: GraduationCap, disabled: false },
    { role: 'student', label: 'Estudiante', icon: User, disabled: true },
    { role: 'parent', label: 'Padre de Familia', icon: Users, disabled: true },
  ];

  const handleSelect = (role: string) => {
    navigate(`/login?role=${role}`);
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900 flex items-center justify-center p-4">
      <motion.div 
        // FIX: Using a spread attribute to bypass TypeScript type checking for framer-motion props.
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md"
      >
        <div className="text-center mb-8">
            <img src={logoUrl} alt="Logo" className="w-20 h-20 mx-auto mb-4" />
            <h1 className="text-3xl font-bold text-slate-800 dark:text-slate-100">Bienvenido al SGE</h1>
            <p className="text-slate-500 dark:text-slate-400">IEE 6049 Ricardo Palma</p>
            <p className="text-slate-600 dark:text-slate-300 mt-4 font-semibold">Por favor, seleccione su tipo de acceso.</p>
        </div>

        <div className="space-y-4">
          {accessOptions.map(option => (
            <motion.button
              key={option.role}
              // FIX: Using a spread attribute to bypass TypeScript type checking for framer-motion props.
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => !option.disabled && handleSelect(option.role)}
              disabled={option.disabled}
              className="w-full flex items-center gap-4 p-5 bg-white dark:bg-slate-800 rounded-xl shadow-sm hover:shadow-lg dark:hover:bg-slate-700 border border-gray-100 dark:border-slate-700 transition-all text-left disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:shadow-sm"
            >
              <div className="p-3 bg-indigo-100 text-indigo-600 dark:bg-indigo-500/20 dark:text-indigo-300 rounded-lg">
                <option.icon size={24} />
              </div>
              <div>
                <p className="font-bold text-lg text-slate-700 dark:text-slate-200">{option.label}</p>
                {option.disabled && <p className="text-xs text-amber-600 font-semibold">Acceso en desarrollo</p>}
              </div>
            </motion.button>
          ))}
        </div>
      </motion.div>
    </div>
  );
};

export default AccessTypePage;