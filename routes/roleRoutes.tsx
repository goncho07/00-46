import Layout from '../components/layout/Layout';
import TeacherLayout from '../components/layout/TeacherLayout';
import Dashboard from '../pages/Dashboard';
import UsersPage from '../pages/UsersPage';
import MatriculaPage from '../pages/MatriculaPage';
import AcademicoPage from '../pages/AcademicoPage';
import AvanceDocentesPage from '../pages/AvanceDocentesPage';
import MonitoreoCursosPage from '../pages/MonitoreoCursosPage';
import MonitoreoEstudiantesPage from '../pages/MonitoreoEstudiantesPage';
import ActasCertificadosPage from '../pages/ActasCertificadosPage';
import ReportesAcademicosPage from '../pages/ReportesAcademicosPage';
import ConfiguracionAcademicaPage from '../pages/ConfiguracionAcademicaPage';
import AsistenciaPage from '../pages/AsistenciaPage';
import QRScannerPage from '../pages/QRScannerPage';
import ComunicacionesPage from '../pages/ComunicacionesPage';
import ReportesPage from '../pages/ReportesPage';
import RecursosPage from '../pages/RecursosPage';
import AdminFinanzasPage from '../pages/AdminFinanzasPage';
import SettingsPage from '../pages/SettingsPage';
import RolesPage from '../pages/RolesPage';
import ActivityLogPage from '../pages/ActivityLogPage';
import AyudaPage from '../pages/AyudaPage';
import ConvivenciaPage from '../pages/ConvivenciaPage';
import TeacherDashboard from '../pages/TeacherDashboard';
import RegistrarNotasPage from '../pages/RegistrarNotasPage';
import LibroCalificacionesPage from '../pages/LibroCalificacionesPage';

import type { RoleRouteConfig } from './types';

export const roleRouteConfig: RoleRouteConfig = {
  director: {
    layout: Layout,
    fallback: '/',
    routes: [
      { path: '/', Component: Dashboard },
      { path: '/usuarios', Component: UsersPage },
      { path: '/matricula', Component: MatriculaPage },
      { path: '/academico', Component: AcademicoPage },
      { path: '/academico/avance-docentes', Component: AvanceDocentesPage },
      { path: '/academico/monitoreo-cursos', Component: MonitoreoCursosPage },
      { path: '/academico/monitoreo-estudiantes', Component: MonitoreoEstudiantesPage },
      { path: '/academico/actas-certificados', Component: ActasCertificadosPage },
      { path: '/academico/reportes-descargas', Component: ReportesAcademicosPage },
      { path: '/academico/configuracion', Component: ConfiguracionAcademicaPage },
      { path: '/asistencia', Component: AsistenciaPage },
      { path: '/asistencia/scan', Component: QRScannerPage },
      { path: '/comunicaciones', Component: ComunicacionesPage },
      { path: '/reportes', Component: ReportesPage },
      { path: '/recursos', Component: RecursosPage },
      { path: '/admin', Component: AdminFinanzasPage },
      { path: '/settings', Component: SettingsPage },
      { path: '/settings/roles', Component: RolesPage },
      { path: '/settings/activity-log', Component: ActivityLogPage },
      { path: '/ayuda', Component: AyudaPage },
      { path: '/convivencia', Component: ConvivenciaPage },
    ],
  },
  teacher: {
    layout: TeacherLayout,
    fallback: '/',
    routes: [
      { path: '/', Component: TeacherDashboard },
      { path: '/registrar-notas', Component: RegistrarNotasPage },
      { path: '/libro-calificaciones', Component: LibroCalificacionesPage },
    ],
  },
};
