import { Role, PermissionModuleKey, Permissions, PermissionModule } from '../types';

const allPermissionModules: PermissionModule[] = [
    { key: 'estudiantes', label: 'Estudiantes' },
    { key: 'docentes', label: 'Docentes' },
    { key: 'administrativos', label: 'Administrativos' },
    { key: 'padres', label: 'Padres/Tutores' },
    { key: 'academico', label: 'Gestión Académica' },
    { key: 'asistencia', label: 'Asistencia' },
    { key: 'comunicaciones', label: 'Comunicaciones' },
    { key: 'reportes', label: 'Reportes' },
];

const generatePermissions = (rules: Partial<Record<PermissionModuleKey, { v?: boolean; c?: boolean; e?: boolean; d?: boolean }>>): Record<PermissionModuleKey, Permissions> => {
    const permissions: any = {};
    allPermissionModules.forEach(module => {
        permissions[module.key] = {
            view: rules[module.key]?.v ?? false,
            create: rules[module.key]?.c ?? false,
            edit: rules[module.key]?.e ?? false,
            delete: rules[module.key]?.d ?? false,
        };
    });
    return permissions;
};

export const initialRoles: Role[] = [
  {
    id: 'director',
    name: 'Director',
    description: 'Acceso total a todos los módulos y configuraciones del sistema.',
    permissions: generatePermissions({
      estudiantes: { v: true, c: true, e: true, d: true },
      docentes: { v: true, c: true, e: true, d: true },
      administrativos: { v: true, c: true, e: true, d: true },
      padres: { v: true, c: true, e: true, d: true },
      academico: { v: true, c: true, e: true, d: true },
      asistencia: { v: true, c: true, e: true, d: true },
      comunicaciones: { v: true, c: true, e: true, d: true },
      reportes: { v: true, c: true, e: true, d: true },
    }),
  },
  {
    id: 'docente',
    name: 'Docente',
    description: 'Acceso para gestionar sus cursos, registrar notas y asistencia de sus alumnos asignados.',
    permissions: generatePermissions({
      estudiantes: { v: true },
      academico: { v: true, e: true },
      asistencia: { v: true, e: true },
      comunicaciones: { v: true, c: true },
    }),
  },
  {
    id: 'secretaria',
    name: 'Secretaría Académica',
    description: 'Gestiona matrículas, datos de estudiantes y emite certificados.',
    permissions: generatePermissions({
      estudiantes: { v: true, c: true, e: true },
      padres: { v: true, c: true, e: true },
      academico: { v: true },
      reportes: { v: true, c: true },
    }),
  },
];

export const permissionModules: PermissionModule[] = allPermissionModules;
