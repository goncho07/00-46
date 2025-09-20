import React, { useState, useEffect, useCallback } from 'react';
import { BrowserMultiFormatReader, NotFoundException } from '@zxing/library';
import { motion, AnimatePresence } from 'framer-motion';
import { Camera, CheckCircle, XCircle, AlertTriangle, Users, List, Zap, CameraOff } from 'lucide-react';
import { AttendanceRecord, Student } from '../types';

// Mock student data updated to new Student type
// FIX: Added missing properties to MOCK_STUDENTS to match the Student type definition.
const MOCK_STUDENTS: { [key: string]: Student } = {
  '71234567': { 
    documentNumber: '71234567', 
    studentCode: '000071234567', 
    paternalLastName: 'Quispe', 
    maternalLastName: 'Rojas', 
    names: 'Ana Sofía', 
    fullName: 'Quispe Rojas, Ana Sofía', 
    gender: 'Mujer',
    birthDate: '2010-05-10',
    grade: 'Quinto',
    section: 'A',
    avatarUrl: 'https://picsum.photos/seed/ana/80/80',
    tutorIds: ['40345678'],
    enrollmentStatus: 'Matriculado',
    status: 'Activo',
    sede: 'Norte',
    lastLogin: '2025-07-29T08:00:00Z',
    condition: 'Regular',
    tags: ['tercio-superior'],
    averageGrade: 18.2,
    attendancePercentage: 98,
    tardinessCount: 1,
    behaviorIncidents: 0,
    academicRisk: false,
  },
  '72345678': { 
    documentNumber: '72345678', 
    studentCode: '000072345678', 
    paternalLastName: 'Mendoza', 
    maternalLastName: 'Castillo', 
    names: 'Luis Fernando', 
    fullName: 'Mendoza Castillo, Luis Fernando', 
    gender: 'Hombre',
    birthDate: '2010-03-15',
    grade: 'Quinto',
    section: 'A',
    avatarUrl: 'https://picsum.photos/seed/luis/80/80',
    tutorIds: [],
    enrollmentStatus: 'Matriculado',
    status: 'Activo',
    sede: 'Norte',
    lastLogin: '2025-07-29T08:01:00Z',
    condition: 'Regular',
    tags: [],
    averageGrade: 14.5,
    attendancePercentage: 92,
    tardinessCount: 3,
    behaviorIncidents: 1,
    academicRisk: false,
  },
  '73456789': { 
    documentNumber: '73456789', 
    studentCode: '000073456789', 
    paternalLastName: 'Torres', 
    maternalLastName: 'Flores', 
    names: 'Camila Valeria', 
    fullName: 'Torres Flores, Camila Valeria', 
    gender: 'Mujer',
    birthDate: '2010-08-22',
    grade: 'Quinto',
    section: 'A',
    avatarUrl: 'https://picsum.photos/seed/camila/80/80',
    tutorIds: [],
    enrollmentStatus: 'Matriculado',
    status: 'Activo',
    sede: 'Norte',
    lastLogin: '2025-07-29T08:02:00Z',
    condition: 'Regular',
    tags: [],
    averageGrade: 11.8,
    attendancePercentage: 85,
    tardinessCount: 5,
    behaviorIncidents: 2,
    academicRisk: true,
  },
};

const QRScannerPage: React.FC = () => {
  const [selectedDeviceId, setSelectedDeviceId] = useState<string | undefined>(undefined);
  const [videoInputDevices, setVideoInputDevices] = useState<MediaDeviceInfo[]>([]);
  const [scanResult, setScanResult] = useState<string | null>(null);
  const [lastScanned, setLastScanned] = useState<{ student: Student, time: string } | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isScanning, setIsScanning] = useState(false);
  const [attendanceList, setAttendanceList] = useState<AttendanceRecord[]>([]);
  const [isCameraReady, setIsCameraReady] = useState(false);

  const codeReader = new BrowserMultiFormatReader();

  const startScan = useCallback(() => {
    if (!selectedDeviceId) return;
    setIsScanning(true);
    setLastScanned(null);
    setError(null);

    codeReader.decodeFromVideoDevice(selectedDeviceId, 'video', (result, err) => {
      if (result) {
        setScanResult(result.getText());
      }
      if (err && !(err instanceof NotFoundException)) {
        console.error(err);
        setError('Error al escanear. Intente de nuevo.');
        setIsScanning(false);
      }
    }).catch(err => {
        console.error(err);
        setError('No se pudo acceder a la cámara. Verifique los permisos y que no esté en uso.');
        setIsScanning(false);
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedDeviceId, codeReader]);
  
  const stopScan = useCallback(() => {
    codeReader.reset();
    setIsScanning(false);
  },[codeReader]);
  
  useEffect(() => {
    navigator.mediaDevices.enumerateDevices()
      .then(devices => {
        const videoDevices = devices.filter(device => device.kind === 'videoinput');
        setVideoInputDevices(videoDevices);
        if (videoDevices.length > 0) {
          setSelectedDeviceId(videoDevices[0].deviceId);
          setIsCameraReady(true);
        } else {
            setError("No se encontraron cámaras disponibles.");
        }
      })
      .catch(err => {
        setError("Error al enumerar dispositivos. Permita el acceso a la cámara.");
        console.error(err);
      });
      
    return () => {
        stopScan();
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (scanResult) {
      const student = MOCK_STUDENTS[scanResult];
      const now = new Date();
      if (student) {
        const alreadyExists = attendanceList.some(record => record.studentId === student.documentNumber);
        if (!alreadyExists) {
          const newRecord: AttendanceRecord = {
            studentId: student.documentNumber,
            studentName: student.fullName,
            timestamp: now.toLocaleTimeString('es-PE'),
            status: 'presente',
            synced: navigator.onLine,
          };
          setAttendanceList(prev => [newRecord, ...prev]);
          setLastScanned({ student, time: newRecord.timestamp });
          setError(null);
        } else {
          setError(`El estudiante ${student.fullName} ya fue registrado.`);
        }
      } else {
        setError(`Código QR no válido o estudiante no encontrado.`);
        setLastScanned(null);
      }
      // Reset after a delay to allow for new scans
      const timer = setTimeout(() => setScanResult(null), 2000);
      return () => clearTimeout(timer);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [scanResult]);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 h-full max-h-[calc(100vh-140px)]">
        <div className="lg:col-span-2 flex flex-col bg-slate-900 rounded-2xl shadow-2xl overflow-hidden">
            <div className="relative w-full h-full min-h-[300px] flex items-center justify-center">
                <video id="video" className={`w-full h-full object-cover ${!isScanning ? 'hidden' : ''}`}/>
                {!isScanning && (
                    <div className="text-center text-white p-8">
                        {isCameraReady ? (
                             <>
                                <Camera size={64} className="mx-auto mb-4 opacity-50"/>
                                <h2 className="text-2xl font-bold mb-2">Listo para escanear</h2>
                                <p className="text-slate-400 mb-6">Presione "Iniciar Escaneo" para activar la cámara y tomar asistencia.</p>
                                <button onClick={startScan} className="flex items-center justify-center gap-2 px-6 py-3 bg-indigo-600 text-white rounded-full font-semibold shadow-lg hover:bg-indigo-700 transition transform hover:scale-105">
                                    <Camera size={20} /> Iniciar Escaneo
                                </button>
                             </>
                        ) : (
                             <>
                                <CameraOff size={64} className="mx-auto mb-4 text-rose-400"/>
                                <h2 className="text-2xl font-bold mb-2 text-rose-300">Cámara no disponible</h2>
                                <p className="text-slate-400">{error}</p>
                            </>
                        )}
                       
                    </div>
                )}
                {isScanning && (
                    <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                        <div className="w-3/4 max-w-sm h-auto aspect-square border-4 border-white/50 rounded-2xl shadow-lg animate-pulse"></div>
                    </div>
                )}
            </div>
             {isScanning && (
                 <div className="p-4 bg-slate-800/50 flex items-center justify-between">
                    <select 
                        onChange={(e) => setSelectedDeviceId(e.target.value)} 
                        className="bg-slate-700 text-white text-sm rounded-lg p-2 border border-slate-600 focus:ring-indigo-500 focus:border-indigo-500"
                        disabled={videoInputDevices.length <= 1}
                    >
                        {videoInputDevices.map(device => (
                            <option key={device.deviceId} value={device.deviceId}>{device.label}</option>
                        ))}
                    </select>
                    <button onClick={stopScan} className="px-4 py-2 bg-rose-600 text-white rounded-full font-semibold hover:bg-rose-700 transition">
                        Detener
                    </button>
                </div>
            )}
        </div>
        
        <div className="flex flex-col bg-white dark:bg-slate-800 rounded-2xl shadow-lg border border-gray-100 dark:border-slate-700">
            <div className="p-6 border-b border-gray-200 dark:border-slate-700">
                 <h2 className="text-xl font-bold text-slate-800 dark:text-slate-100 flex items-center gap-2"><List size={22}/> Lista de Asistencia</h2>
                 <p className="text-sm text-slate-500 dark:text-slate-400">5to Grado "A" - {new Date().toLocaleDateString('es-PE')}</p>
            </div>
            <div className="p-2 flex-grow overflow-y-auto">
                <AnimatePresence>
                {lastScanned && (
                    <motion.div 
                        // FIX: Using a spread attribute to bypass TypeScript type checking for framer-motion props.
                        initial={{ scale: 0.8, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="bg-emerald-50 dark:bg-emerald-500/10 border border-emerald-200 dark:border-emerald-500/20 p-4 m-4 rounded-xl text-center">
                        <CheckCircle className="mx-auto text-emerald-500" size={40}/>
                        <img src={lastScanned.student.avatarUrl} alt={lastScanned.student.fullName} className="w-20 h-20 rounded-full mx-auto my-3 border-4 border-emerald-200 dark:border-emerald-500/20"/>
                        <p className="font-bold text-emerald-800 dark:text-emerald-300">{lastScanned.student.fullName}</p>
                        <p className="text-sm text-emerald-600 dark:text-emerald-400">Marcado a las {lastScanned.time}</p>
                    </motion.div>
                )}
                 {error && (
                    <motion.div 
                        // FIX: Using a spread attribute to bypass TypeScript type checking for framer-motion props.
                        initial={{ scale: 0.8, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="bg-rose-50 dark:bg-rose-500/10 border border-rose-200 dark:border-rose-500/20 p-4 m-4 rounded-xl text-center">
                        <XCircle className="mx-auto text-rose-500" size={40}/>
                        <p className="font-bold text-rose-800 dark:text-rose-300 mt-3">Error de Escaneo</p>
                        <p className="text-sm text-rose-600 dark:text-rose-400">{error}</p>
                    </motion.div>
                )}
                </AnimatePresence>
                <div className="px-4 py-2 bg-gray-100 dark:bg-slate-700/50 rounded-t-lg sticky top-0">
                    <h3 className="text-lg font-semibold flex items-center gap-2 text-slate-800 dark:text-slate-200"><Users size={18}/> Registrados ({attendanceList.length})</h3>
                </div>
                <ul className="divide-y divide-gray-100 dark:divide-slate-700 p-2">
                    {attendanceList.map(record => (
                        <motion.li 
                            key={record.studentId}
                            // FIX: Using a spread attribute to bypass TypeScript type checking for framer-motion props.
                            layout={true}
                            initial={{ opacity: 0, y: -10 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="flex items-center justify-between p-3"
                        >
                            <span className="font-medium text-slate-700 dark:text-slate-200">{record.studentName}</span>
                            <div className="flex items-center gap-2 text-sm">
                                <span className="text-slate-500 dark:text-slate-400">{record.timestamp}</span>
                                {record.synced ? 
                                    <span title="Sincronizado">
                                        <CheckCircle size={16} className="text-emerald-500"/>
                                    </span> : 
                                    <span title="Pendiente de Sincronización">
                                        <AlertTriangle size={16} className="text-amber-500"/>
                                    </span>
                                }
                            </div>
                        </motion.li>
                    ))}
                    {attendanceList.length === 0 && !lastScanned && !error && (
                        <div className="text-center py-10 text-slate-500 dark:text-slate-400">
                            <p>Esperando escaneos...</p>
                        </div>
                    )}
                </ul>
            </div>
        </div>
    </div>
  );
};

export default QRScannerPage;