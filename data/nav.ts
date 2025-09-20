import {
  Home,
  Users,
  BookOpen,
  FileSpreadsheet,
  MessageSquare,
  Briefcase,
  HelpCircle,
  UsersRound,
  ClipboardCheck,
  Warehouse,
  Settings,
  Edit,
  BookCheck as BookCheckTeacher,
} from 'lucide-react';
import { NavItem } from '../types';

export const directorNavItems: NavItem[] = [
  { to: '/', text: 'Inicio', icon: Home },
  { to: '/usuarios', text: 'Usuarios', icon: UsersRound },
  { to: '/matricula', text: 'Matrícula', icon: Users },
  { to: '/academico', text: 'Académico', icon: BookOpen },
  { to: '/asistencia', text: 'Asistencia', icon: ClipboardCheck },
  { to: '/comunicaciones', text: 'Comunicaciones', icon: MessageSquare },
  { to: '/reportes', text: 'Reportes', icon: FileSpreadsheet },
  { to: '/recursos', text: 'Recursos', icon: Warehouse },
  { to: '/admin', text: 'Administración y Finanzas', icon: Briefcase },
  { to: '/settings', text: 'Configuración', icon: Settings },
  { to: '/ayuda', text: 'Ayuda', icon: HelpCircle },
];

export const teacherNavItems: NavItem[] = [
  { to: '/', text: 'Inicio', icon: Home },
  { to: '/registrar-notas', text: 'Registrar Notas', icon: Edit },
  { to: '/libro-calificaciones', text: 'Libro de Calificaciones', icon: BookCheckTeacher },
  { to: '/comunicaciones', text: 'Comunicaciones', icon: MessageSquare },
  { to: '/ayuda', text: 'Ayuda', icon: HelpCircle },
];
