import { useEffect, useState } from 'react';
import { motion } from 'motion/react';
import { X, CheckSquare, Calendar, User, AlertCircle } from 'lucide-react';
import type { Board, User as UserType } from '../App';
import type { BoardMemberInfo, BoardMemberInfoDTO } from '../functions/models/Board_model';

type CreateTaskModalProps = {
  users: BoardMemberInfo[];
  userRole: BoardMemberInfo ;
  currentUserId: string;

  onClose: () => void;
  onCreate: (
    titulo: string, 
    descripcion: string, 
    prioridad: 'Baja' | 'Media' | 'Alta',
    asignadoA: string,
    fechaLimite?: Date
  ) => void;
};

export function CreateTaskModal({ users, userRole ,currentUserId, onClose, onCreate }: CreateTaskModalProps) {
  const [titulo, setTitulo] = useState('');
  const [descripcion, setDescripcion] = useState('');
  const [prioridad, setPrioridad] = useState<'Baja' | 'Media' | 'Alta'>('Media');
  const [asignadoA, setAsignadoA] = useState('');
  const [fechaLimite, setFechaLimite] = useState('');

  useEffect(() => {
    if (users.length === 1) {
      setAsignadoA(users[0].usuarioId.id);
    }
  }, [users]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (titulo.trim()) {
      const deadline = fechaLimite ? new Date(fechaLimite) : undefined;
      onCreate(titulo, descripcion, prioridad, asignadoA, deadline);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-50">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="bg-white rounded-2xl shadow-2xl w-full max-w-lg"
      >
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-slate-200">
          <div className="flex items-center gap-3">
            <div className="flex items-center justify-center w-10 h-10 bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl">
              <CheckSquare className="w-5 h-5 text-blue-600" />
            </div>
            <h2 className="text-xl text-slate-900">Nueva Tarea</h2>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-slate-600 transition-colors p-2 hover:bg-slate-100 rounded-lg"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-5">
          <div>
            <label className="block text-sm mb-2 text-slate-700">Título de la Tarea</label>
            <input
              type="text"
              value={titulo}
              onChange={(e) => setTitulo(e.target.value)}
              className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
              placeholder="Ej: Implementar autenticación"
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
              placeholder="Describe los detalles de la tarea..."
            />
          </div>

          <div>
            <label className="block text-sm mb-2 text-slate-700 flex items-center gap-2">
              <AlertCircle className="w-4 h-4" />
              Prioridad
            </label>
            <div className="grid grid-cols-3 gap-3">
              <button
                type="button"
                onClick={() => setPrioridad('Baja')}
                className={`px-4 py-3 rounded-xl border-2 transition-all text-sm ${
                  prioridad === 'Baja'
                    ? 'border-green-500 bg-green-50 text-green-700'
                    : 'border-slate-200 text-slate-600 hover:border-slate-300'
                }`}
              >
                🟢 Baja
              </button>
              <button
                type="button"
                onClick={() => setPrioridad('Media')}
                className={`px-4 py-3 rounded-xl border-2 transition-all text-sm ${
                  prioridad === 'Media'
                    ? 'border-yellow-500 bg-yellow-50 text-yellow-700'
                    : 'border-slate-200 text-slate-600 hover:border-slate-300'
                }`}
              >
                🟡 Media
              </button>
              <button
                type="button"
                onClick={() => setPrioridad('Alta')}
                className={`px-4 py-3 rounded-xl border-2 transition-all text-sm ${
                  prioridad === 'Alta'
                    ? 'border-red-500 bg-red-50 text-red-700'
                    : 'border-slate-200 text-slate-600 hover:border-slate-300'
                }`}
              >
                🔴 Alta
              </button>
            </div>
          </div>

          <div>
            <label className="block text-sm mb-2 text-slate-700 flex items-center gap-2">
              <User className="w-4 h-4" />
              Asignar a
            </label>
            <select
              value={asignadoA}
              onChange={(e) => setAsignadoA(e.target.value)}
              className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all appearance-none bg-white"
            >
              <option value="" disabled>
                Selecciona un usuario
              </option>
              {users.map((user) => (
                <option key={user.usuarioId.id} value={user.usuarioId.id}>
                  {user.usuarioId.nombre} {user.usuarioId.id === currentUserId ? '(Yo)' : ''}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm mb-2 text-slate-700 flex items-center gap-2">
              <Calendar className="w-4 h-4" />
              Fecha límite (opcional)
            </label>
            <input
              type="date"
              value={fechaLimite}
              onChange={(e) => setFechaLimite(e.target.value)}
              className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
              min={new Date().toISOString().split('T')[0]}
            />
          </div>

          {/* Actions */}
          <div className="flex gap-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-3 border border-slate-300 text-slate-700 rounded-xl hover:bg-slate-50 transition-all"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="flex-1 px-4 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-xl hover:from-blue-700 hover:to-indigo-700 transition-all shadow-lg shadow-blue-500/30"
            >
              Crear Tarea
            </button>
          </div>
        </form>
      </motion.div>
    </div>
  );
}
