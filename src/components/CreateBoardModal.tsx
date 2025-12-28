import { useState } from 'react';
import { motion } from 'motion/react';
import { X, LayoutGrid } from 'lucide-react';
import type { BoardInfoDTO } from '../functions/models/Board_model';
import { CreateBoard } from '../functions/board_functions/board.functions';
import Swal from 'sweetalert2';

interface Props {
  onClose: () => void;
  onCreate : (board:BoardInfoDTO) => void;
}

export function CreateBoardModal({ onClose, onCreate } : Props ) {
  const [nombre, setNombre] = useState('');
  const [descripcion, setDescripcion] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try{
      const response=await CreateBoard({nombre, descripcion})
      if(!response){
        Swal.fire('Error','no hemos logrado crear el tablero','error');
        return;
      }

      Swal.fire('Informacion','tablero creado correctamente','success');
      onCreate(response);
      onClose();

    }catch(error:any){
      Swal.fire('error','ha ocurrido un error inesperado','error');
      return;
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
