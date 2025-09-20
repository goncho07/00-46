import { AcademicPeriod } from '../types';

export const initialPeriods: AcademicPeriod[] = [
  {
    id: 'period-2025',
    year: 2025,
    levels: ['Primaria', 'Secundaria'],
    vacancies: [
      { grade: 'Primer Grado', total: 60, enrolled: 58 },
      { grade: 'Segundo Grado', total: 60, enrolled: 60 },
      { grade: 'Tercer Grado', total: 90, enrolled: 85 },
      { grade: 'Cuarto Grado', total: 90, enrolled: 90 },
      { grade: 'Quinto Grado', total: 90, enrolled: 78 },
      { grade: 'Sexto Grado', total: 90, enrolled: 88 },
    ],
    status: 'Publicado',
  },
  {
    id: 'period-2024',
    year: 2024,
    levels: ['Primaria', 'Secundaria'],
    vacancies: [
      { grade: 'Primer Grado', total: 60, enrolled: 60 },
      { grade: 'Segundo Grado', total: 60, enrolled: 60 },
      { grade: 'Tercer Grado', total: 90, enrolled: 90 },
      { grade: 'Cuarto Grado', total: 90, enrolled: 90 },
      { grade: 'Quinto Grado', total: 90, enrolled: 90 },
      { grade: 'Sexto Grado', total: 90, enrolled: 90 },
    ],
    status: 'Cerrado',
  },
];
