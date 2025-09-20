import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft, LogIn, Shield, GraduationCap } from 'lucide-react';
import { useAuthStore } from '../store/authStore';

const LoginPage: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const login = useAuthStore((state) => state.login);

  const searchParams = new URLSearchParams(location.search);
  const role = searchParams.get('role') as 'director' | 'teacher';

  const [dni, setDni] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  if (!role) {
    navigate('/access-type');
    return null;
  }

  const roleInfo = {
    director: {
      title: 'Acceso Directivo',
      icon: Shield,
    },
    teacher: {
      title: 'Acceso Docente',
      icon: GraduationCap,
    },
  };

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    // Simple mock validation
    if ((role === 'director' && dni === 'director' && password === 'password') || 
        (role === 'teacher' && dni === 'docente' && password === 'password')) {
      setError('');
      login(role);
      navigate('/');
    } else {
      setError('Credenciales incorrectas. Intente de nuevo.');
    }
  };
  
  const logoUrl = 'https://cdn-icons-png.flaticon.com/512/2602/2602414.png';
  const RoleIcon = roleInfo[role].icon;

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900 flex flex-col items-center justify-center p-4">
       <div className="absolute top-4 left-4">
            <button onClick={() => navigate('/access-type')} className="flex items-center gap-2 px-4 py-2 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 rounded-full text-sm font-semibold hover:bg-slate-100 dark:hover:bg-slate-700 border border-slate-200 dark:border-slate-700 shadow-sm focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-indigo-500">
                <ArrowLeft size={16} />
                <span>Cambiar Rol</span>
            </button>
       </div>
      <motion.div
        // FIX: Using a spread attribute to bypass TypeScript type checking for framer-motion props.
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-sm"
      >
        <div className="text-center mb-8">
            <img src={logoUrl} alt="Logo" className="w-16 h-16 mx-auto mb-4" />
            <h1 className="text-2xl font-bold text-slate-800 dark:text-slate-100 flex items-center justify-center gap-2">
                <RoleIcon className="text-indigo-600" />
                {roleInfo[role].title}
            </h1>
            <p className="text-slate-500 dark:text-slate-400">IEE 6049 Ricardo Palma</p>
        </div>

        <div className="bg-white dark:bg-slate-800 p-8 rounded-2xl shadow-lg border border-gray-100 dark:border-slate-700">
            <form onSubmit={handleLogin} className="space-y-6">
                 <div>
                    <label htmlFor="dni" className="block text-sm font-semibold text-slate-600 dark:text-slate-300 mb-1">DNI o Usuario</label>
                    <input 
                        id="dni"
                        type="text"
                        value={dni}
                        onChange={(e) => setDni(e.target.value)}
                        placeholder={role === 'director' ? 'Usuario: director' : 'Usuario: docente'}
                        className="w-full px-4 py-2.5 border border-slate-200 dark:border-slate-600 rounded-lg bg-gray-50 dark:bg-slate-700 dark:text-slate-100 focus:bg-white dark:focus:bg-slate-600 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition focus:outline-none"
                        required
                    />
                </div>
                 <div>
                    <label htmlFor="password"className="block text-sm font-semibold text-slate-600 dark:text-slate-300 mb-1">Contraseña</label>
                    <input 
                        id="password"
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="Contraseña: password"
                        className="w-full px-4 py-2.5 border border-slate-200 dark:border-slate-600 rounded-lg bg-gray-50 dark:bg-slate-700 dark:text-slate-100 focus:bg-white dark:focus:bg-slate-600 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition focus:outline-none"
                        required
                    />
                </div>

                {error && <p className="text-sm text-rose-600 text-center">{error}</p>}
                
                <motion.button 
                    type="submit"
                    // FIX: Using a spread attribute to bypass TypeScript type checking for framer-motion props.
                    whileHover={{ scale: 1.03 }}
                    whileTap={{ scale: 0.98 }}
                    className="w-full flex items-center justify-center gap-2 px-5 py-3 bg-indigo-600 text-white rounded-full text-base font-semibold shadow-lg shadow-indigo-500/20 hover:bg-indigo-700 transition-all focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-indigo-500"
                >
                    <LogIn size={18} />
                    <span>Ingresar</span>
                </motion.button>
            </form>
        </div>
      </motion.div>
    </div>
  );
};

export default LoginPage;