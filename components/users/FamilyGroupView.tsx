import React, { useMemo } from 'react';
// FIX: Import GenericUser from types.ts
import { Student, ParentTutor, GenericUser } from '../../types';
import { Phone, Mail, User, Users } from 'lucide-react';
import Button from '../ui/Button';

interface FamilyGroupViewProps {
    student: Student;
    allUsers: GenericUser[];
}

const isStudent = (user: GenericUser): user is Student => 'studentCode' in user;
const isParent = (user: GenericUser): user is ParentTutor => 'relation' in user;

const FamilyGroupView: React.FC<FamilyGroupViewProps> = ({ student, allUsers }) => {

    const family = useMemo(() => {
        const tutors = allUsers.filter(u => isParent(u) && student.tutorIds.includes(u.dni)) as ParentTutor[];
        
        const siblings = allUsers.filter(u => 
            isStudent(u) && 
            u.documentNumber !== student.documentNumber && 
            u.tutorIds.some(tutorId => student.tutorIds.includes(tutorId))
        ) as Student[];

        return { tutors, siblings };
    }, [student, allUsers]);

    return (
        <div className="space-y-6">
            <div className="bg-white dark:bg-slate-800/50 p-6 rounded-xl border border-slate-200/80 dark:border-slate-700/80">
                <h3 className="text-lg font-bold text-slate-800 dark:text-slate-100 mb-4 flex items-center gap-2"><Users size={20}/> Apoderados Vinculados</h3>
                {family.tutors.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {family.tutors.map(tutor => (
                            <div key={tutor.dni} className="p-4 bg-slate-50 dark:bg-slate-800 rounded-lg flex flex-col justify-between">
                                <div className="flex items-center gap-3">
                                    <img src={tutor.avatarUrl} alt={tutor.name} className="w-12 h-12 rounded-full"/>
                                    <div>
                                        <p className="font-bold text-slate-800 dark:text-slate-100 capitalize">{tutor.name.toLowerCase()}</p>
                                        <p className="text-sm font-semibold text-indigo-600 dark:text-indigo-400">{tutor.relation}</p>
                                    </div>
                                </div>
                                <div className="mt-4 flex items-center gap-2">
                                    <a href={`tel:${tutor.phone}`} className="flex-1">
                                        <Button variant="secondary" className="w-full !justify-center" icon={Phone}>Llamar</Button>
                                    </a>
                                    <a href={`mailto:${tutor.email}`} className="flex-1">
                                         <Button variant="secondary" className="w-full !justify-center" icon={Mail}>Email</Button>
                                    </a>
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <p className="text-sm text-slate-500 dark:text-slate-400">No hay apoderados vinculados a este estudiante.</p>
                )}
            </div>

            <div className="bg-white dark:bg-slate-800/50 p-6 rounded-xl border border-slate-200/80 dark:border-slate-700/80">
                 <h3 className="text-lg font-bold text-slate-800 dark:text-slate-100 mb-4 flex items-center gap-2"><User size={20}/> Hermanos en la Institución</h3>
                 {family.siblings.length > 0 ? (
                     <div className="space-y-2">
                         {family.siblings.map(sibling => (
                            <div key={sibling.documentNumber} className="flex items-center justify-between p-3 bg-slate-50 dark:bg-slate-800 rounded-lg">
                                <div className="flex items-center gap-3">
                                    <img src={sibling.avatarUrl} alt={sibling.fullName} className="w-10 h-10 rounded-full"/>
                                    <div>
                                        <p className="font-semibold text-slate-700 dark:text-slate-200 capitalize">{sibling.fullName.toLowerCase()}</p>
                                        <p className="text-xs text-slate-500 dark:text-slate-400">{sibling.grade} "{sibling.section}"</p>
                                    </div>
                                </div>
                                <Button variant="tertiary">Ver Perfil</Button>
                            </div>
                         ))}
                     </div>
                 ) : (
                    <p className="text-sm text-slate-500 dark:text-slate-400">No se encontraron hermanos matriculados en el sistema.</p>
                 )}
            </div>
        </div>
    );
};

export default FamilyGroupView;