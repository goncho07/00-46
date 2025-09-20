import React from 'react';
import { useLocation, Link } from 'react-router-dom';
import { ChevronRight, Home } from 'lucide-react';
import { directorNavItems, teacherNavItems } from '../../data/nav';
import { useAuthStore } from '../../store/authStore';

const breadcrumbNameMap: { [key: string]: string } = {
  '/academico/avance-docentes': 'Avance por Docente',
  '/academico/monitoreo-cursos': 'Monitoreo por Cursos',
  '/academico/monitoreo-estudiantes': 'Monitoreo por Estudiantes',
  '/academico/actas-certificados': 'Actas y Certificados',
  '/academico/reportes-descargas': 'Reportes y Descargas',
  '/academico/configuracion': 'Configuración Académica',
  '/asistencia/scan': 'Escanear QR',
  '/settings/roles': 'Roles y Permisos',
  '/settings/activity-log': 'Registro de Actividad',
};

const Breadcrumbs: React.FC = () => {
    const location = useLocation();
    const { user } = useAuthStore();
    const pathnames = location.pathname.split('/').filter((x) => x);
    
    // Add settings subpages for lookup
    const directorItemsWithSubpages = [
        ...directorNavItems,
        { to: '/settings/roles', text: 'Roles y Permisos', icon: Home },
        { to: '/settings/activity-log', text: 'Registro de Actividad', icon: Home },
    ];
    
    const navItems = user?.role === 'director' ? directorItemsWithSubpages : teacherNavItems;

    const getBreadcrumbName = (to: string) => {
        if (breadcrumbNameMap[to]) {
            return breadcrumbNameMap[to];
        }
        const navItem = navItems.find(item => item.to === to);
        return navItem ? navItem.text : to.split('/').pop()?.replace(/-/g, ' ');
    };

    if (pathnames.length === 0) {
        return null;
    }

    return (
        <nav aria-label="breadcrumb" className="flex items-center text-sm font-semibold text-slate-500 dark:text-slate-400 mb-4">
            <Link to="/" className="hover:text-indigo-600 dark:hover:text-indigo-400 flex items-center gap-1.5 transition-colors">
                <Home size={16} />
                Inicio
            </Link>
            {pathnames.map((value, index) => {
                const last = index === pathnames.length - 1;
                const to = `/${pathnames.slice(0, index + 1).join('/')}`;
                const name = getBreadcrumbName(to);

                return (
                    <span key={to} className="flex items-center capitalize">
                        <ChevronRight size={18} className="text-slate-400 dark:text-slate-500 mx-1" />
                        {last ? (
                            <span className="text-slate-700 dark:text-slate-200">{name}</span>
                        ) : (
                            <Link to={to} className="hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors">{name}</Link>
                        )}
                    </span>
                );
            })}
        </nav>
    );
};

export default Breadcrumbs;