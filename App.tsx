import React, { useEffect } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import Layout from './components/layout/Layout';
import Dashboard from './pages/Dashboard';
import UsersPage from './pages/UsersPage';
import MatriculaPage from './pages/MatriculaPage';
import AcademicoPage from './pages/AcademicoPage';
import AsistenciaPage from './pages/AsistenciaPage';
import ComunicacionesPage from './pages/ComunicacionesPage';
import ReportesPage from './pages/ReportesPage';
import RecursosPage from './pages/RecursosPage';
import AdminFinanzasPage from './pages/AdminFinanzasPage';
import AyudaPage from './pages/AyudaPage';
import QRScannerPage from './pages/QRScannerPage';
import LoginPage from './pages/LoginPage';
import AccessTypePage from './pages/AccessTypePage';
import { useAuthStore } from './store/authStore';
import { useUIStore } from './store/uiStore';
import PlaceholderPage from './pages/PlaceholderPage';
import { Handshake } from 'lucide-react';
import AvanceDocentesPage from './pages/AvanceDocentesPage';
import MonitoreoCursosPage from './pages/MonitoreoCursosPage';
import MonitoreoEstudiantesPage from './pages/MonitoreoEstudiantesPage';
import ActasCertificadosPage from './pages/ActasCertificadosPage';
import ReportesAcademicosPage from './pages/ReportesAcademicosPage';
import ConfiguracionAcademicaPage from './pages/ConfiguracionAcademicaPage';
import TeacherLayout from './components/layout/TeacherLayout';
import TeacherDashboard from './pages/TeacherDashboard';
import RegistrarNotasPage from './pages/RegistrarNotasPage';
import LibroCalificacionesPage from './pages/LibroCalificacionesPage';
import ConvivenciaPage from './pages/ConvivenciaPage';
import SettingsPage from './pages/SettingsPage';
import RolesPage from './pages/RolesPage';
import ActivityLogPage from './pages/ActivityLogPage';


const DirectorRoutes = () => (
  <Layout>
    <Routes>
      <Route path="/" element={<Dashboard />} />
      <Route path="/usuarios" element={<UsersPage />} />
      <Route path="/matricula" element={<MatriculaPage />} />
      <Route path="/academico" element={<AcademicoPage />} />
      <Route path="/academico/avance-docentes" element={<AvanceDocentesPage />} />
      <Route path="/academico/monitoreo-cursos" element={<MonitoreoCursosPage />} />
      <Route path="/academico/monitoreo-estudiantes" element={<MonitoreoEstudiantesPage />} />
      <Route path="/academico/actas-certificados" element={<ActasCertificadosPage />} />
      <Route path="/academico/reportes-descargas" element={<ReportesAcademicosPage />} />
      <Route path="/academico/configuracion" element={<ConfiguracionAcademicaPage />} />
      <Route path="/asistencia" element={<AsistenciaPage />} />
      <Route path="/asistencia/scan" element={<QRScannerPage />} />
      <Route path="/comunicaciones" element={<ComunicacionesPage />} />
      <Route path="/reportes" element={<ReportesPage />} />
      <Route path="/recursos" element={<RecursosPage />} />
      <Route path="/admin" element={<AdminFinanzasPage />} />
      <Route path="/settings" element={<SettingsPage />} />
      <Route path="/settings/roles" element={<RolesPage />} />
      <Route path="/settings/activity-log" element={<ActivityLogPage />} />
      <Route path="/ayuda" element={<AyudaPage />} />
      <Route path="/convivencia" element={<ConvivenciaPage />} />
      <Route path="*" element={<Navigate to="/" />} />
    </Routes>
  </Layout>
);

const TeacherRoutes = () => (
    <TeacherLayout>
        <Routes>
            <Route path="/" element={<TeacherDashboard />} />
            <Route path="/registrar-notas" element={<RegistrarNotasPage />} />
            <Route path="/libro-calificaciones" element={<LibroCalificacionesPage />} />
            <Route path="*" element={<Navigate to="/" />} />
        </Routes>
    </TeacherLayout>
);


const App: React.FC = () => {
    const { isAuthenticated, user } = useAuthStore();
    const { setTheme } = useUIStore();

    useEffect(() => {
        const storedTheme = localStorage.getItem('theme');
        const systemPrefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
        if (storedTheme === 'dark' || (!storedTheme && systemPrefersDark)) {
            setTheme('dark');
        } else {
            setTheme('light');
        }
    }, [setTheme]);

    if (!isAuthenticated) {
        return (
            <Routes>
                <Route path="/login" element={<LoginPage />} />
                <Route path="/access-type" element={<AccessTypePage />} />
                <Route path="*" element={<Navigate to="/access-type" />} />
            </Routes>
        );
    }
    
    return user?.role === 'director' ? <DirectorRoutes /> : <TeacherRoutes />;
};

export default App;