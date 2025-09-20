import React, { useMemo } from 'react';
import KpiCard from '../ui/KpiCard';
// FIX: Import GenericUser from types.ts
import { GenericUser, UserStatus } from '../../types';
import { Users, CheckCircle, PowerOff, UserX } from 'lucide-react';

interface UserKpiCardsProps {
    users: GenericUser[];
    activeStatus: UserStatus | 'Todos';
    onStatusChange: (status: UserStatus | 'Todos') => void;
}

const UserKpiCards: React.FC<UserKpiCardsProps> = ({ users, activeStatus, onStatusChange }) => {

    const kpiCounts = useMemo(() => ({
        Total: users.length,
        Activos: users.filter(u => u.status === 'Activo').length,
        Inactivos: users.filter(u => u.status === 'Inactivo' || u.status === 'Egresado').length,
        Suspendidos: users.filter(u => u.status === 'Suspendido').length,
    }), [users]);

    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <KpiCard title="Total" value={kpiCounts.Total} active={activeStatus === 'Todos'} onClick={() => onStatusChange('Todos')} icon={Users} />
            <KpiCard title="Activos" value={kpiCounts.Activos} active={activeStatus === 'Activo'} onClick={() => onStatusChange('Activo')} icon={CheckCircle} />
            <KpiCard title="Inactivos" value={kpiCounts.Inactivos} active={activeStatus === 'Inactivo'} onClick={() => onStatusChange('Inactivo')} icon={PowerOff} />
            <KpiCard title="Suspendidos" value={kpiCounts.Suspendidos} active={activeStatus === 'Suspendido'} onClick={() => onStatusChange('Suspendido')} icon={UserX} />
        </div>
    );
};

export default UserKpiCards;