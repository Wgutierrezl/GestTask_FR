import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Workflow, Plus, GripVertical, Trash2 } from 'lucide-react';

type CreatePipelineModalProps = {
  onClose: () => void;
  onCreate: (nombre: string, descripcion: string, etapas: { nombre: string; orden: number }[]) => void;
};

type StageInput = {
  id: string;
  nombre: string;
  orden: number;
};

export function CreatePipelineModal({ onClose, onCreate }: CreatePipelineModalProps) {
  const [nombre, setNombre] = useState('');
  const [descripcion, setDescripcion] = useState('');
  const [etapas, setEtapas] = useState<StageInput[]>([
    { id: '1', nombre: 'Por Hacer', orden: 0 },
    { id: '2', nombre: 'En Progreso', orden: 1 },
    { id: '3', nombre: 'Completado', orden: 2 }
  ]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (nombre.trim() && etapas.length > 0 && etapas.every(e => e.nombre.trim())) {
      onCreate(nombre, descripcion, etapas.map((e, idx) => ({ nombre: e.nombre, orden: idx })));
    } else {
      alert('Por favor completa el nombre del pipeline y al menos una etapa');
    }
  };

  const addEtapa = () => {
    const newEtapa: StageInput = {
      id: Date.now().toString(),
      nombre: '',
      orden: etapas.length
    };
    setEtapas([...etapas, newEtapa]);
  };

  const removeEtapa = (id: string) => {
    if (etapas.length <= 1) {
      alert('Debe haber al menos una etapa');
      return;
    }
    setEtapas(etapas.filter(e => e.id !== id));
  };

  const updateEtapa = (id: string, nombre: string) => {
    setEtapas(etapas.map(e => e.id === id ? { ...e, nombre } : e));
  };

  const moveEtapa = (index: number, direction: 'up' | 'down') => {
    const newEtapas = [...etapas];
    const targetIndex = direction === 'up' ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= newEtapas.length) return;
    [newEtapas[index], newEtapas[targetIndex]] = [newEtapas[targetIndex], newEtapas[index]];
    setEtapas(newEtapas.map((e, idx) => ({ ...e, orden: idx })));
  };

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-50">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-hidden flex flex-col"
      >
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-slate-200">
          <div className="flex items-center gap-3">
            <div className="flex items-center justify-center w-10 h-10 bg-gradient-to-br from-violet-50 to-purple-50 rounded-xl">
              <Workflow className="w-5 h-5 text-violet-600" />
            </div>
            <h2 className="text-xl text-slate-900">Crear Nuevo Pipeline</h2>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-slate-600 transition-colors p-2 hover:bg-slate-100 rounded-lg"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-6 space-y-5">
          <div>
            <label className="block text-sm mb-2 text-slate-700">Nombre del Pipeline</label>
            <input
              type="text"
              value={nombre}
              onChange={(e) => setNombre(e.target.value)}
              className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
              placeholder="Ej: Desarrollo Frontend"
              required
              autoFocus
            />
          </div>

          <div>
            <label className="block text-sm mb-2 text-slate-700">Descripción</label>
            <textarea
              value={descripcion}
              onChange={(e) => setDescripcion(e.target.value)}
              className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all resize-none"
              rows={3}
              placeholder="Describe el propósito de este pipeline..."
            />
          </div>

          {/* Etapas Section */}
          <div>
            <div className="flex items-center justify-between mb-3">
              <label className="block text-sm text-slate-700">
                Etapas del Pipeline
              </label>
              <button
                type="button"
                onClick={addEtapa}
                className="flex items-center gap-1 px-3 py-1.5 text-sm text-blue-600 hover:bg-blue-50 rounded-lg transition-all"
              >
                <Plus className="w-4 h-4" />
                Agregar Etapa
              </button>
            </div>
            <p className="text-xs text-slate-500 mb-3">
              Define las etapas por las que pasarán tus tareas. Ejemplo: Por Hacer → En Progreso → Completado
            </p>
            
            <div className="space-y-2">
              <AnimatePresence>
                {etapas.map((etapa, index) => (
                  <motion.div
                    key={etapa.id}
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    className="flex items-center gap-2"
                  >
                    <div className="flex flex-col gap-1">
                      <button
                        type="button"
                        onClick={() => moveEtapa(index, 'up')}
                        disabled={index === 0}
                        className="text-slate-400 hover:text-slate-600 disabled:opacity-30 disabled:cursor-not-allowed"
                      >
                        <GripVertical className="w-4 h-4" />
                      </button>
                    </div>
                    <div className="flex-1 relative">
                      <div className="absolute left-4 top-1/2 -translate-y-1/2 text-xs text-slate-400 font-medium">
                        {index + 1}
                      </div>
                      <input
                        type="text"
                        value={etapa.nombre}
                        onChange={(e) => updateEtapa(etapa.id, e.target.value)}
                        className="w-full pl-10 pr-4 py-2.5 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all text-sm"
                        placeholder={`Etapa ${index + 1}`}
                        required
                      />
                    </div>
                    <button
                      type="button"
                      onClick={() => removeEtapa(etapa.id)}
                      className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-all"
                      disabled={etapas.length <= 1}
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
          </div>

          {/* Preview */}
          <div className="bg-slate-50 rounded-xl p-4 border border-slate-200">
            <p className="text-xs text-slate-600 mb-3">Vista previa del flujo:</p>
            <div className="flex items-center gap-2 flex-wrap">
              {etapas.map((etapa, index) => (
                <div key={etapa.id} className="flex items-center gap-2">
                  <div className="px-3 py-1.5 bg-white text-slate-700 rounded-lg text-sm border border-slate-200">
                    {etapa.nombre || `Etapa ${index + 1}`}
                  </div>
                  {index < etapas.length - 1 && (
                    <span className="text-slate-400">→</span>
                  )}
                </div>
              ))}
            </div>
          </div>
        </form>

        {/* Actions */}
        <div className="flex gap-3 p-6 border-t border-slate-200">
          <button
            type="button"
            onClick={onClose}
            className="flex-1 px-4 py-3 border border-slate-300 text-slate-700 rounded-xl hover:bg-slate-50 transition-all"
          >
            Cancelar
          </button>
          <button
            onClick={handleSubmit}
            className="flex-1 px-4 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-xl hover:from-blue-700 hover:to-indigo-700 transition-all shadow-lg shadow-blue-500/30"
          >
            Crear Pipeline
          </button>
        </div>
      </motion.div>
    </div>
  );
}
