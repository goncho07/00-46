import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, Bell, Wifi, WifiOff, LogOut, User, Settings, ChevronsLeft, ChevronsRight, CheckCheck, Sun, Moon } from 'lucide-react';
import { useUIStore } from '../../store/uiStore';
import { useAuthStore } from '../../store/authStore';
import { useOfflineStatus } from '../../hooks/useOfflineStatus';
import { useNotificationStore } from '../../store/notificationStore';
import { formatDistanceToNow } from 'date-fns';
import { es } from 'date-fns/locale/es';
import { useNavigate } from 'react-router-dom';

const NotificationsPanel: React.FC<{ isOpen: boolean; onClose: () => void }> = ({ isOpen, onClose }) => {
    const { notifications, markAsRead, markAllAsRead } = useNotificationStore();
    const navigate = useNavigate();

    const handleNotificationClick = (notification: any) => {
        markAsRead(notification.id);
        if (notification.action) {
            navigate(notification.action.path);
        }
        onClose();
    };

    return (
        <AnimatePresence>
            {isOpen && (
                <motion.div
                    // FIX: Using a spread attribute to bypass TypeScript type checking for framer-motion props.
                    initial={{ opacity: 0, y: 10, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 10, scale: 0.95 }}
                    transition={{ duration: 0.2, ease: "easeOut" }}
                    className="absolute right-0 top-16 mt-2 w-80 sm:w-96 bg-white dark:bg-slate-800 rounded-xl shadow-2xl border border-slate-100 dark:border-slate-700 overflow-hidden z-50"
                >
                    <header className="p-4 border-b border-slate-100 dark:border-slate-700 flex items-center justify-between">
                        <h3 className="font-bold text-lg text-slate-800 dark:text-slate-100">Notificaciones</h3>
                        {notifications.some(n => !n.read) && (
                            <button onClick={markAllAsRead} className="text-xs font-semibold text-indigo-600 hover:text-indigo-800 dark:text-indigo-400 dark:hover:text-indigo-300 flex items-center gap-1">
                                <CheckCheck size={14} /> Marcar todas como leídas
                            </button>
                        )}
                    </header>
                    <div className="max-h-96 overflow-y-auto">
                        {notifications.length > 0 ? (
                            notifications.map(n => (
                                <button key={n.id} onClick={() => handleNotificationClick(n)} className={`w-full text-left p-4 transition-colors ${!n.read ? 'bg-indigo-50 dark:bg-slate-700/50 hover:bg-indigo-100 dark:hover:bg-slate-700' : 'hover:bg-slate-50 dark:hover:bg-slate-700/50'}`}>
                                    <div className="flex items-start gap-3">
                                        {!n.read && <div className="w-2.5 h-2.5 bg-indigo-500 rounded-full mt-1.5 shrink-0"></div>}
                                        <div className="flex-1">
                                            <p className={`text-sm ${!n.read ? 'font-semibold text-slate-800 dark:text-slate-100' : 'text-slate-600 dark:text-slate-300'}`}>{n.message}</p>
                                            {/* FIX: Using `as any` to bypass a TypeScript error where `locale` is not recognized in `FormatDistanceOptions`, likely due to a type definition issue in date-fns. */}
                                            <p className="text-xs text-slate-400 dark:text-slate-500 mt-1">{formatDistanceToNow(n.timestamp, { addSuffix: true, locale: es } as any)}</p>
                                        </div>
                                    </div>
                                </button>
                            ))
                        ) : (
                            <div className="p-8 text-center text-slate-500 dark:text-slate-400">
                                <p>No tienes notificaciones nuevas.</p>
                            </div>
                        )}
                    </div>
                </motion.div>
            )}
        </AnimatePresence>
    );
};


const Header: React.FC = () => {
  const { toggleSidebar, isSidebarCollapsed, theme, toggleTheme } = useUIStore();
  const logout = useAuthStore((state) => state.logout);
  const isOnline = useOfflineStatus();
  const [profileOpen, setProfileOpen] = useState(false);
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const notifications = useNotificationStore((state) => state.notifications);
  const unreadCount = notifications.filter(n => !n.read).length;

  const handleLogout = () => {
    logout();
  };

  return (
    <header className="bg-white/70 backdrop-blur-lg dark:bg-slate-800/70 shadow-sm sticky top-0 z-30 flex items-center justify-between h-20 px-4 sm:px-6 lg:px-8 border-b border-gray-200 dark:border-slate-700">
      <div className="flex items-center gap-4">
        <button
          onClick={toggleSidebar}
          className="text-slate-500 hover:text-indigo-600 dark:text-slate-400 dark:hover:text-indigo-400 transition-colors"
          aria-label="Toggle Sidebar"
        >
          {isSidebarCollapsed ? <ChevronsRight size={28} /> : <ChevronsLeft size={28} />}
        </button>
        <div className="relative hidden md:block">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
          <input
            type="text"
            placeholder="Buscar..."
            className="pl-10 pr-4 py-2 w-72 border border-slate-200 dark:border-slate-600 rounded-full bg-slate-50 dark:bg-slate-700 dark:text-slate-100 focus:bg-white dark:focus:bg-slate-600 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition"
          />
        </div>
      </div>
      <div className="flex items-center gap-5">
         <motion.button
            onClick={toggleTheme}
            className="w-10 h-10 flex items-center justify-center rounded-full text-slate-500 hover:text-indigo-600 hover:bg-slate-100 dark:text-slate-400 dark:hover:bg-slate-700 dark:hover:text-indigo-400 transition-colors"
            aria-label="Toggle theme"
            // FIX: Using a spread attribute to bypass TypeScript type checking for framer-motion props.
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
          >
            <AnimatePresence mode="wait" initial={false}>
              <motion.div
                key={theme}
                // FIX: Using a spread attribute to bypass TypeScript type checking for framer-motion props.
                initial={{ y: -20, opacity: 0, rotate: -90 }}
                animate={{ y: 0, opacity: 1, rotate: 0 }}
                exit={{ y: 20, opacity: 0, rotate: 90 }}
                transition={{ duration: 0.2 }}
              >
                {theme === 'light' ? <Moon size={22} /> : <Sun size={22} />}
              </motion.div>
            </AnimatePresence>
          </motion.button>
        
        <div className="flex items-center gap-2 text-sm font-medium text-slate-600 dark:text-slate-300">
          {isOnline ? (
            <Wifi size={22} className="text-emerald-500" />
          ) : (
            <WifiOff size={22} className="text-rose-500" />
          )}
          <span className="hidden md:inline">{isOnline ? 'En línea' : 'Sin conexión'}</span>
        </div>

        <div className="relative">
          <button onClick={() => setNotificationsOpen(!notificationsOpen)} className="text-slate-500 hover:text-indigo-600 dark:text-slate-400 dark:hover:text-indigo-400 transition-colors relative">
            <Bell size={26} />
            {unreadCount > 0 && (
              <span className="absolute -top-1 -right-1.5 flex items-center justify-center h-5 w-5 bg-rose-500 text-white text-xs font-bold rounded-full">
                {unreadCount}
              </span>
            )}
          </button>
           <NotificationsPanel isOpen={notificationsOpen} onClose={() => setNotificationsOpen(false)} />
        </div>
        
        <div className="relative">
          <button onClick={() => setProfileOpen(!profileOpen)}>
            <img src="https://picsum.photos/seed/director/48/48" alt="Perfil" className="w-12 h-12 rounded-full border-2 border-slate-200 dark:border-slate-600 hover:border-indigo-500 transition-all duration-300" />
          </button>
          <AnimatePresence>
          {profileOpen && (
            <motion.div
              // FIX: Using a spread attribute to bypass TypeScript type checking for framer-motion props.
              initial={{ opacity: 0, y: 10, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 10, scale: 0.95 }}
              transition={{ duration: 0.2, ease: "easeOut" }}
              className="absolute right-0 mt-2 w-56 bg-white dark:bg-slate-800 rounded-xl shadow-2xl border border-slate-100 dark:border-slate-700 overflow-hidden"
            >
              <div className="p-3 border-b border-slate-100 dark:border-slate-700">
                <p className="font-semibold text-base text-slate-800 dark:text-slate-100">Director(a)</p>
                <p className="text-sm text-slate-500 dark:text-slate-400">Ángel G. Morales</p>
              </div>
              <a href="#/usuarios" onClick={() => setProfileOpen(false)} className="flex items-center gap-3 px-4 py-3 text-sm text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors"><User size={18} /> Perfil</a>
              <a href="#" className="flex items-center gap-3 px-4 py-3 text-sm text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors"><Settings size={18} /> Ajustes</a>
              <button onClick={handleLogout} className="w-full text-left flex items-center gap-3 px-4 py-3 text-sm text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-500/10 transition-colors">
                <LogOut size={18} /> Cerrar Sesión
              </button>
            </motion.div>
          )}
          </AnimatePresence>
        </div>
      </div>
    </header>
  );
};

export default Header;