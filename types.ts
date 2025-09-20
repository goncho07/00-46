import { LucideProps } from "lucide-react";
import React from "react";

export type UserStatus = 'Activo' | 'Inactivo' | 'Suspendido' | 'Egresado' | 'Pendiente';
export type Sede = 'Norte' | 'Sur';

export interface NavItem {
  to: string;
  text: string;
  icon: React.ComponentType<LucideProps>;
}

export interface Student {
  documentNumber: string;
  studentCode: string;
  paternalLastName: string;
  maternalLastName: string;
  names: string;
  fullName: string;
  gender: 'Hombre' | 'Mujer';
  birthDate: string;
  grade: string;
  section: string;
  avatarUrl: string;
  tutorIds: string[];
  enrollmentStatus: 'Matriculado' | 'Trasladado' | 'Retirado';
  status: UserStatus;
  sede: Sede;
  lastLogin?: string | null;
  condition: 'Regular' | 'Beca' | 'Inclusión';
  tags: string[];
  // --- Ficha 360° KPIs ---
  averageGrade: number; // Promedio ponderado del bimestre actual
  attendancePercentage: number; // Porcentaje de asistencia del bimestre
  tardinessCount: number; // Conteo de tardanzas en el bimestre
  behaviorIncidents: number; // Conteo de incidencias de convivencia
  academicRisk: boolean; // Indicador de riesgo académico
}

export interface Staff {
  dni: string;
  name: string;
  area: string;
  role: string;
  avatarUrl: string;
  category: 'Docente' | 'Administrativo' | 'Apoyo' | 'Director';
  status: UserStatus;
  sede: Sede;
  lastLogin?: string | null;
  tags: string[];
  // --- Ficha 360° KPIs ---
  notesProgress?: number; // Porcentaje de avance en carga de notas
  attendancePercentage?: number; // Porcentaje de asistencia del personal
}

export interface ParentTutor {
  dni: string;
  name: string;
  email: string;
  phone: string;
  avatarUrl:string;
  relation: string;
  status: UserStatus;
  sede: Sede;
  lastLogin?: string | null;
  verified: boolean;
  tags: string[];
}

// FIX: Moved GenericUser here to be accessible globally
export type GenericUser = Student | Staff | ParentTutor;

export interface AttendanceRecord {
  studentId: string;
  studentName: string;
  timestamp: string;
  status: 'presente' | 'tarde' | 'ausente';
  synced: boolean;
}

export interface Notification {
  id: number;
  message: string;
  timestamp: Date;
  read: boolean;
  action?: {
    label: string;
    path: string;
  };
}

export type PermissionModuleKey =
  | 'estudiantes'
  | 'docentes'
  | 'administrativos'
  | 'padres'
  | 'academico'
  | 'asistencia'
  | 'comunicaciones'
  | 'reportes';

export interface Permissions {
  view: boolean;
  create: boolean;
  edit: boolean;
  delete: boolean;
}

export interface PermissionModule {
  key: PermissionModuleKey;
  label: string;
}

export interface Role {
  id: string;
  name: string;
  description: string;
  permissions: Record<PermissionModuleKey, Permissions>;
}

export interface Vacancy {
    grade: string;
    total: number;
    enrolled: number;
}

export interface AcademicPeriod {
    id: string;
    year: number;
    levels: string[];
    vacancies: Vacancy[];
    status: 'Publicado' | 'Cerrado' | 'Borrador';
}

export interface Competency {
    id: string;
    name: string;
    description: string;
}

export interface ActivityLog {
  id: string;
  timestamp: string; // ISO date string
  user: string; // User who performed the action
  userAvatar: string;
  action: 'Creación' | 'Actualización' | 'Cambio de Estado' | 'Reseteo de Contraseña' | 'Exportación' | 'Acceso Administrativo' | 'Invitación Enviada' | 'Inicio de Sesión' | 'Generar Carnet';
  details: string;
  targetUser?: string; // User who was affected
  ipAddress?: string;
}

export interface SavedView {
    id: string;
    name: string;
    filters: any;
}

// --- TYPES MOVED FROM UsersPage.tsx ---
export type UserRole = 'Docente' | 'Administrativo' | 'Apoyo' | 'Director' | 'Estudiante' | 'Apoderado';
export type UserLevel = 'Inicial' | 'Primaria' | 'Secundaria' | 'N/A';
export type SortConfig = { key: keyof Student | keyof Staff | keyof ParentTutor, direction: 'asc' | 'desc' };
export type ConfirmationModalState = {
    isOpen: boolean;
    title: string;
    message: string;
    onConfirm: (reason?: string) => void;
    confirmText?: string;
    confirmClass?: string;
    withReason?: boolean;
};
export interface ScheduleModalState {
    isOpen: boolean;
    onConfirm: (date: string) => void;
    users: GenericUser[];
}
