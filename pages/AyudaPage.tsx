import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { HelpCircle, Search, ChevronDown, Phone, Mail, Building } from 'lucide-react';
import Card from '../components/ui/Card';
import PageHeader from '../components/ui/PageHeader';

const faqData = {
  'Primeros Pasos': [
    {
      q: '¿Cómo restauro mi contraseña?',
      a: 'Para restaurar su contraseña, haga clic en el enlace "¿Olvidó su contraseña?" en la pantalla de inicio de sesión. Se le enviarán instrucciones a su correo electrónico registrado.'
    },
    {
      q: '¿Cómo actualizo mi información de perfil?',
      a: 'Puede actualizar su información de perfil haciendo clic en su avatar en la esquina superior derecha, seleccionando "Perfil" y luego haciendo clic en el botón "Editar".'
    },
    {
      q: '¿El sistema funciona sin conexión a internet?',
      a: 'Sí, funciones críticas como la toma de asistencia por QR están diseñadas para operar sin conexión. Los datos se sincronizarán automáticamente una vez que recupere la conexión a internet.'
    }
  ],
  'Gestión de Asistencia': [
    {
      q: '¿Cómo se justifica una inasistencia?',
      a: 'Vaya al módulo de Asistencia, seleccione la vista de "Estudiantes", busque al alumno y haga clic en el icono de "Ver Detalles". Si el estudiante tiene una ausencia, verá un botón para "Justificar Ausencia".'
    },
    {
      q: '¿Puedo generar reportes de asistencia?',
      a: 'Sí, en el módulo de Asistencia, en la pestaña "Dashboard", encontrará una sección para generar reportes mensuales. Puede seleccionar el mes y el año para generar un documento PDF listo para imprimir.'
    },
    {
      q: '¿Qué significa un estudiante "en riesgo" en el módulo de asistencia?',
      a: 'Un estudiante es marcado "en riesgo" si acumula un número significativo de faltas injustificadas o tardanzas, según los umbrales definidos en la configuración del sistema. Esto sirve como una alerta temprana para la intervención.'
    }
  ],
  'Módulo Académico': [
    {
      q: '¿Cómo monitoreo el avance de carga de notas de los docentes?',
      a: 'En el Módulo Académico, seleccione la opción "Avance por Docente". Verá una tabla con el progreso de cada docente, su estado (Al día, En riesgo, Atrasado) y podrá enviarles recordatorios.'
    },
    {
      q: '¿Es posible aprobar actas de notas desde el sistema?',
      a: 'Sí. El módulo de "Actas y Certificados" le permite revisar las actas generadas por el personal. Podrá aprobarlas, rechazarlas o solicitar correcciones directamente desde la plataforma.'
    }
  ],
  'Reportes y UGEL': [
    {
      q: '¿Qué tipo de reportes puedo generar?',
      a: 'El sistema permite generar una variedad de reportes consolidados sobre asistencia, matrícula y rendimiento académico. Estos reportes están diseñados para cumplir con los formatos solicitados por la UGEL y para el análisis interno.'
    },
    {
      q: '¿Puedo exportar los datos a Excel?',
      a: 'Sí, la mayoría de las tablas y reportes tienen una opción para exportar los datos en formato PDF y Excel (CSV), lo que le permite realizar un análisis más profundo si es necesario.'
    }
  ]
};

type FaqCategory = keyof typeof faqData;

const AyudaPage: React.FC = () => {
  const [activeCategory, setActiveCategory] = useState<FaqCategory>('Primeros Pasos');
  const [expandedQuestion, setExpandedQuestion] = useState<number | null>(0);
  const [searchQuery, setSearchQuery] = useState('');

  const filteredFaqs = useMemo(() => {
    if (!searchQuery) {
      return faqData[activeCategory];
    }
    const allFaqs = Object.values(faqData).flat();
    return allFaqs.filter(faq => 
      faq.q.toLowerCase().includes(searchQuery.toLowerCase()) || 
      faq.a.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [searchQuery, activeCategory]);
  
  const currentCategoryLabel = searchQuery ? 'Resultados de la Búsqueda' : activeCategory;

  return (
    <div className="space-y-6">
      <PageHeader
        title="Centro de Ayuda"
        subtitle="Encuentre respuestas a preguntas frecuentes, guías y recursos de soporte."
        icon={HelpCircle}
      />

      <div className="relative w-full">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={22} />
        <input 
          type="text" 
          placeholder="Busque por palabra clave (ej. 'contraseña', 'reporte'...)" 
          value={searchQuery}
          onChange={e => setSearchQuery(e.target.value)}
          className="w-full pl-12 pr-4 py-3 border border-slate-200 dark:border-slate-700 rounded-full bg-white dark:bg-slate-800 text-lg dark:text-slate-100 shadow-sm"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* Categories Sidebar */}
        <aside className="lg:col-span-1 space-y-2">
           <h2 className="px-3 text-sm font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Categorías</h2>
            {Object.keys(faqData).map(category => (
                <button 
                    key={category} 
                    onClick={() => {
                      setActiveCategory(category as FaqCategory);
                      setSearchQuery('');
                      setExpandedQuestion(0);
                    }}
                    className={`w-full text-left px-4 py-2.5 rounded-lg font-semibold transition-colors ${activeCategory === category && !searchQuery ? 'bg-indigo-600 text-white' : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700'}`}
                >
                    {category}
                </button>
            ))}
            <Card className="mt-6 !p-0 overflow-hidden">
                <div className="p-4 bg-slate-50 dark:bg-slate-700/50">
                    <h3 className="font-bold text-slate-800 dark:text-slate-100">Contacto de Soporte</h3>
                </div>
                <div className="p-4 space-y-3 text-sm">
                    <div className="flex items-start gap-3"><Mail size={16} className="text-slate-500 mt-0.5 shrink-0"/><div><p className="font-semibold text-slate-700 dark:text-slate-200">Soporte Técnico SGE</p><p className="text-slate-500 dark:text-slate-400">soporte.sge@ugel01.gob.pe</p></div></div>
                    <div className="flex items-start gap-3"><Phone size={16} className="text-slate-500 mt-0.5 shrink-0"/><div><p className="font-semibold text-slate-700 dark:text-slate-200">Mesa de Ayuda UGEL 01</p><p className="text-slate-500 dark:text-slate-400">(01) 719-5880 Anexo 101</p></div></div>
                    <div className="flex items-start gap-3"><Building size={16} className="text-slate-500 mt-0.5 shrink-0"/><div><p className="font-semibold text-slate-700 dark:text-slate-200">Área de SIAGIE</p><p className="text-slate-500 dark:text-slate-400">siagie@ugel01.gob.pe</p></div></div>
                </div>
            </Card>
        </aside>

        {/* FAQ Content */}
        <main className="lg:col-span-3">
          <h2 className="text-2xl font-bold text-slate-800 dark:text-slate-100 mb-4">{currentCategoryLabel}</h2>
          <div className="space-y-3">
            {filteredFaqs.length > 0 ? filteredFaqs.map((faq, index) => (
                <div key={index} className="border border-slate-200 dark:border-slate-700 rounded-lg overflow-hidden bg-white dark:bg-slate-800">
                    <button 
                        onClick={() => setExpandedQuestion(expandedQuestion === index ? null : index)}
                        className="w-full flex justify-between items-center p-4 text-left"
                    >
                        <span className="font-bold text-slate-700 dark:text-slate-200">{faq.q}</span>
                        <motion.div // FIX: Using a spread attribute to bypass TypeScript type checking for framer-motion props.
animate={{ rotate: expandedQuestion === index ? 180 : 0 }}
                        >
                            <ChevronDown className="text-slate-500" />
                        </motion.div>
                    </button>
                    <AnimatePresence>
                    {expandedQuestion === index && (
                        <motion.div
                          // FIX: Using a spread attribute to bypass TypeScript type checking for framer-motion props.
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: 'auto', opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          transition={{ duration: 0.3, ease: "easeInOut" }}
                        >
                          <div className="px-4 pb-4 text-slate-600 dark:text-slate-300 leading-relaxed">
                            {faq.a}
                          </div>
                        </motion.div>
                    )}
                    </AnimatePresence>
                </div>
            )) : (
              <div className="text-center py-12">
                <p className="font-semibold text-slate-600 dark:text-slate-300">No se encontraron resultados</p>
                <p className="text-sm text-slate-500 dark:text-slate-400">Intente con otra palabra clave o seleccione una categoría.</p>
              </div>
            )}
          </div>
        </main>
      </div>
    </div>
  );
};

export default AyudaPage;