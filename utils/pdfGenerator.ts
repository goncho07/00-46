import jsPDF from 'jspdf';
import 'jspdf-autotable';
import { Student } from '../types';

// FIX: Removed module augmentation for jsPDF and will cast to `any` to avoid TS errors.
// This is a workaround for when TS cannot resolve the module for augmentation.

export const generateFichaMatricula = (student: Student) => {
    const doc = new jsPDF();
    
    doc.setFontSize(18);
    doc.text("Ficha Única de Matrícula - SIAGIE", 14, 22);
    doc.setFontSize(11);
    doc.text("IEE 6049 Ricardo Palma", 14, 28);
    
    (doc as any).autoTable({
        startY: 40,
        head: [['Campo', 'Información del Estudiante']],
        body: [
            ['Apellidos y Nombres', student.fullName],
            ['DNI', student.documentNumber],
            ['Código de Estudiante', student.studentCode],
            ['Fecha de Nacimiento', student.birthDate],
            ['Género', student.gender],
            ['Grado y Sección', `${student.grade} "${student.section}"`],
            ['Condición', student.condition],
            ['Estado de Matrícula', student.enrollmentStatus],
        ],
        theme: 'grid',
        headStyles: { fillColor: [41, 128, 185] },
    });
    
    doc.text("Firma del Apoderado:", 14, (doc as any).autoTable.previous.finalY + 20);
    doc.line(14, (doc as any).autoTable.previous.finalY + 30, 80, (doc as any).autoTable.previous.finalY + 30);
    
    doc.text("Firma del Director:", 130, (doc as any).autoTable.previous.finalY + 20);
    doc.line(130, (doc as any).autoTable.previous.finalY + 30, 196, (doc as any).autoTable.previous.finalY + 30);
    
    doc.save(`Ficha_Matricula_${student.documentNumber}.pdf`);
};

export const generateCarnet = (students: Student[]) => {
    const doc = new jsPDF('p', 'mm', 'a4');
    const cardWidth = 85.6;
    const cardHeight = 53.98;
    const marginX = 15;
    const marginY = 15;
    let x = marginX;
    let y = marginY;

    students.forEach((student, index) => {
        if (index > 0 && index % 8 === 0) {
            doc.addPage();
            x = marginX;
            y = marginY;
        }

        // Card Background
        doc.setFillColor(79, 70, 229); // indigo-600
        doc.roundedRect(x, y, cardWidth, cardHeight, 3, 3, 'F');
        
        // Header
        doc.setFontSize(8);
        doc.setTextColor(255, 255, 255);
        doc.text("IEE 6049 Ricardo Palma", x + 5, y + 8);
        doc.setFontSize(10);
        doc.text("CARNET ESCOLAR 2025", x + 5, y + 13);

        // Photo
        doc.setFillColor(255, 255, 255);
        doc.rect(x + 5, y + 18, 25, 30, 'F');
        doc.addImage(student.avatarUrl, 'JPEG', x + 5.5, y + 18.5, 24, 29);

        // Details
        doc.setFontSize(9);
        doc.setTextColor(255, 255, 255);
        doc.text(student.fullName.toUpperCase(), x + 33, y + 25, { maxWidth: 50 });
        
        doc.setFontSize(8);
        doc.setTextColor(200, 200, 255);
        doc.text("DNI:", x + 33, y + 35);
        doc.text("GRADO:", x + 33, y + 40);
        doc.text("SECCIÓN:", x + 55, y + 40);

        doc.setTextColor(255, 255, 255);
        doc.text(student.documentNumber, x + 40, y + 35);
        doc.text(student.grade, x + 43, y + 40);
        doc.text(student.section, x + 68, y + 40);

        // Move to next position
        if ((index + 1) % 2 === 0) {
            x = marginX;
            y += cardHeight + 5;
        } else {
            x += cardWidth + 5;
        }
    });

    doc.save(`Carnets_Escolares.pdf`);
};