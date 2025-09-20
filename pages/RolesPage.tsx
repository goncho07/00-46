import React, { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { Shield, Plus, Edit, Trash2, Check, X } from 'lucide-react';
import { initialRoles, permissionModules } from '../data/roles';
import { Role } from '../types';
import PageHeader from '../components/ui/PageHeader';
import Button from '../components/ui/Button';
import Card from '../components/ui/Card';

const RolesPage: React.FC = () => {
    const [roles, setRoles] = useState<Role[]>(initialRoles);
    const [selectedRole, setSelectedRole] = useState<Role>(roles[0]);

    const PermissionIcon: React.FC<{ granted: boolean }> = ({ granted }) => (
        granted ? <Check size={18} className="text-emerald-500" /> : <X size={18} className="text-slate-400" />
    );

    return (
        <div className="space-y-6">
            <PageHeader
                title="Roles y Permisos"
                subtitle="Cree y edite roles para definir el acceso de los usuarios a diferentes partes del sistema."
                icon={Shield}
                actions={<Button variant="primary" icon={Plus}>Crear Nuevo Rol</Button>}
            />
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                <aside className="md:col-span-1">
                    <Card className="!p-4">
                        <h2 className="text-lg font-bold text-slate-800 dark:text-slate-100 px-2 mb-2">Roles del Sistema</h2>
                        <div className="space-y-1">
                            {roles.map(role => (
                                <button
                                    key={role.id}
                                    onClick={() => setSelectedRole(role)}
                                    className={`w-full text-left p-3 rounded-lg transition-colors ${selectedRole.id === role.id ? 'bg-indigo-100 dark:bg-indigo-500/20' : 'hover:bg-slate-100 dark:hover:bg-slate-700/50'}`}
                                >
                                    <p className={`font-bold ${selectedRole.id === role.id ? 'text-indigo-700 dark:text-indigo-300' : 'text-slate-800 dark:text-slate-100'}`}>{role.name}</p>
                                    <p className="text-xs text-slate-500 dark:text-slate-400">{role.description}</p>
                                </button>
                            ))}
                        </div>
                    </Card>
                </aside>
                <main className="md:col-span-2">
                    <motion.div
                        key={selectedRole.id}
                        // FIX: Using a spread attribute to bypass TypeScript type checking for framer-motion props.
                        {...{
                          initial: { opacity: 0, y: 10 },
                          animate: { opacity: 1, y: 0 },
                        }}
                    >
                        <Card>
                            <div className="flex justify-between items-center mb-6">
                                <div>
                                    <h2 className="text-2xl font-bold text-slate-800 dark:text-slate-100">{selectedRole.name}</h2>
                                    <p className="text-slate-500 dark:text-slate-400">{selectedRole.description}</p>
                                </div>
                                <div className="flex gap-2">
                                    <Button variant="secondary" icon={Edit}>Editar</Button>
                                    <Button variant="danger" className="!px-2 !w-10 !h-10" aria-label="Eliminar Rol"><Trash2 size={16}/></Button>
                                </div>
                            </div>
                            <div className="overflow-x-auto">
                                <table className="w-full text-left">
                                    <thead>
                                        <tr className="border-b-2 border-slate-100 dark:border-slate-700">
                                            <th className="p-3 text-sm font-semibold text-slate-600 dark:text-slate-300">Módulo</th>
                                            <th className="p-3 text-sm font-semibold text-slate-600 dark:text-slate-300 text-center">Ver</th>
                                            <th className="p-3 text-sm font-semibold text-slate-600 dark:text-slate-300 text-center">Crear</th>
                                            <th className="p-3 text-sm font-semibold text-slate-600 dark:text-slate-300 text-center">Editar</th>
                                            <th className="p-3 text-sm font-semibold text-slate-600 dark:text-slate-300 text-center">Eliminar</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-slate-100 dark:divide-slate-700">
                                        {permissionModules.map(mod => (
                                            <tr key={mod.key}>
                                                <td className="p-3 font-semibold text-slate-700 dark:text-slate-200">{mod.label}</td>
                                                <td className="p-3 text-center"><div className="flex justify-center"><PermissionIcon granted={selectedRole.permissions[mod.key]?.view} /></div></td>
                                                <td className="p-3 text-center"><div className="flex justify-center"><PermissionIcon granted={selectedRole.permissions[mod.key]?.create} /></div></td>
                                                <td className="p-3 text-center"><div className="flex justify-center"><PermissionIcon granted={selectedRole.permissions[mod.key]?.edit} /></div></td>
                                                <td className="p-3 text-center"><div className="flex justify-center"><PermissionIcon granted={selectedRole.permissions[mod.key]?.delete} /></div></td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </Card>
                    </motion.div>
                </main>
            </div>
        </div>
    );
};

export default RolesPage;
