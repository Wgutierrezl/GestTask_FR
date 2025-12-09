import { useState } from 'react';
import { motion } from 'motion/react';
import { X, LayoutGrid, Users, Check } from 'lucide-react';
import type { User } from '../App';

type CreateBoardModalProps = {
  users: User[];
  currentUserId: string;
  onClose: () => void;
  onCreate: (nombre: string, descripcion: string, miembros: string[]) => void;
};

export function CreateBoardModal({ users, currentUserId, onClose, onCreate }: CreateBoardModalProps) {
  const [nombre, setNombre] = useState('');
  const [descripcion, setDescripcion] = useState('');
  const [selectedMembers, setSelectedMembers] = useState<string[]>([]);

  const availableUsers = users.filter(u => u.id !== currentUserId);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (nombre.trim()) {
      onCreate(nombre, descripcion, selectedMembers);
    }
  };

  const toggleMember = (userId: string) => {
    if (selectedMembers.includes(userId)) {
      setSelectedMembers(selectedMembers.filter(id => id !== userId));
    } else {
      setSelectedMembers([...selectedMembers, userId]);
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
              <LayoutGrid className="w-5 h-5 text-blue-600" />
            </div>
            <h2 className="text-xl text-slate-900">Crear Nuevo Tablero</h2>
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
            <label className="block text-sm mb-2 text-slate-700">Nombre del Tablero</label>
            <input
              type="text"
              value={nombre}
              onChange={(e) => setNombre(e.target.value)}
              className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
              placeholder="Ej: Proyecto de Marketing Digital"
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
              placeholder="Describe el propósito de este tablero..."
            />
          </div>

          <div>
            <label className="block text-sm mb-3 text-slate-700 flex items-center gap-2">
              <Users className="w-4 h-4" />
              Agregar Miembros (opcional)
            </label>
            <div className="space-y-2 max-h-40 overflow-y-auto">
              {availableUsers.length === 0 ? (
                <p className="text-sm text-slate-500 text-center py-4">
                  No hay otros usuarios disponibles
                </p>
              ) : (
                availableUsers.map((user) => (
                  <div
                    key={user.id}
                    onClick={() => toggleMember(user.id)}
                    className={`flex items-center justify-between p-3 border rounded-xl cursor-pointer transition-all ${
                      selectedMembers.includes(user.id)
                        ? 'border-blue-300 bg-blue-50'
                        : 'border-slate-200 hover:border-slate-300 hover:bg-slate-50'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-500 to-indigo-500 flex items-center justify-center text-white text-sm">
                        {user.nombre.charAt(0).toUpperCase()}
                      </div>
                      <div>
                        <p className="text-sm text-slate-900">{user.nombre}</p>
                        <p className="text-xs text-slate-500">{user.correo}</p>
                      </div>
                    </div>
                    {selectedMembers.includes(user.id) && (
                      <div className="w-5 h-5 rounded-full bg-blue-600 flex items-center justify-center">
                        <Check className="w-3 h-3 text-white" />
                      </div>
                    )}
                  </div>
                ))
              )}
            </div>
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
              Crear Tablero
            </button>
          </div>
        </form>
      </motion.div>
    </div>
  );
}
