import { ActivityLog } from '../types';

export const activityLogs: ActivityLog[] = [
  {
    id: 'log-1',
    timestamp: '2025-07-29T09:05:00Z',
    user: 'Ángel G. Morales',
    userAvatar: 'https://picsum.photos/seed/director/48/48',
    action: 'Cambio de Estado',
    details: 'Cambió el estado de "Activo" a "Suspendido". Motivo: Comportamiento disruptivo.',
    targetUser: 'Mendoza Castillo, Luis Fernando',
    ipAddress: '200.48.225.120'
  },
  {
    id: 'log-2',
    timestamp: '2025-07-29T08:30:00Z',
    user: 'GOMEZ PEREZ, MARIA ELENA',
    userAvatar: 'https://picsum.photos/seed/10203040/100/100',
    action: 'Creación',
    details: 'Creó un nuevo perfil de docente para el área de Primaria.',
    targetUser: 'CASTRO MONTES LILI',
    ipAddress: '200.48.225.110'
  },
  {
    id: 'log-3',
    timestamp: '2025-07-28T15:00:00Z',
    user: 'Ángel G. Morales',
    userAvatar: 'https://picsum.photos/seed/director/48/48',
    action: 'Exportación',
    details: 'Exportó la lista de estudiantes de 5to Grado a formato CSV.',
    targetUser: 'N/A',
    ipAddress: '200.48.225.120'
  },
  {
    id: 'log-4',
    timestamp: '2025-07-28T11:45:00Z',
    user: 'RAMIREZ SOTO, JUAN CARLOS',
    userAvatar: 'https://picsum.photos/seed/20304050/100/100',
    action: 'Reseteo de Contraseña',
    details: 'Reseteó la contraseña para el docente.',
    targetUser: 'AQUINO POMA FREDDY',
    ipAddress: '190.12.78.200'
  },
  {
    id: 'log-5',
    timestamp: '2025-07-27T10:10:00Z',
    user: 'Ángel G. Morales',
    userAvatar: 'https://picsum.photos/seed/director/48/48',
    action: 'Acceso Administrativo',
    details: 'Inició sesión en el sistema.',
    targetUser: 'N/A',
    ipAddress: '200.48.225.120'
  },
  {
    id: 'log-6',
    timestamp: '2025-07-27T09:00:00Z',
    user: 'GOMEZ PEREZ, MARIA ELENA',
    userAvatar: 'https://picsum.photos/seed/10203040/100/100',
    action: 'Actualización',
    details: 'Actualizó la información de contacto del apoderado.',
    targetUser: 'GRANDE SILVA, MARÍA',
    ipAddress: '200.48.225.110'
  },
  {
    id: 'log-7',
    timestamp: '2025-07-28T21:00:00Z',
    user: 'CHUMBE VARGAS, SOFÍA',
    userAvatar: 'https://picsum.photos/seed/40345678/100/100',
    action: 'Inicio de Sesión',
    details: 'Inicio de sesión exitoso.',
    targetUser: 'CHUMBE VARGAS, SOFÍA',
    ipAddress: '190.233.89.2'
  },
  {
    id: 'log-8',
    timestamp: '2025-07-29T11:00:00Z',
    user: 'BUENDIA SANTIAGO VLADIMIR',
    userAvatar: 'https://picsum.photos/seed/09747266/100/100',
    action: 'Inicio de Sesión',
    details: 'Inicio de sesión exitoso.',
    targetUser: 'BUENDIA SANTIAGO VLADIMIR',
    ipAddress: '190.233.89.15'
  },
];