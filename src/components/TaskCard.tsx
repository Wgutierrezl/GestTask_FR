import { useDrag } from 'react-dnd';
import { motion } from 'motion/react';
import { GripVertical, Calendar, AlertCircle } from 'lucide-react';
import type { Task, User } from '../App';
import type { TaskInfoDTO } from '../functions/models/Task_model';
import type { BoardMemberInfoDTO } from '../functions/models/Board_model';
import type { UserInfo } from '../functions/models/UserInfoDTO';

type TaskCardProps = {
  task: TaskInfoDTO;
  user: UserInfo;
  userRole: BoardMemberInfoDTO ;
  index: number;
  canDrag?: boolean;
  onClick: () => void;
};

const priorityConfig = {
  Baja: {
    bg: 'bg-green-50',
    text: 'text-green-700',
    border: 'border-green-200',
    dot: 'bg-green-500',
    label: 'Baja'
  },
  Media: {
    bg: 'bg-yellow-50',
    text: 'text-yellow-700',
    border: 'border-yellow-200',
    dot: 'bg-yellow-500',
    label: 'Media'
  },
  Alta: {
    bg: 'bg-red-50',
    text: 'text-red-700',
    border: 'border-red-200',
    dot: 'bg-red-500',
    label: 'Alta'
  }
} as const;

const estadoConfig = {
  Inactivo: { bg: 'bg-slate-50', text: 'text-slate-600', label: 'Activo' },
  Activo: { bg: 'bg-green-50', text: 'text-green-700', label: 'Inactivo' }
};

export function TaskCard({ task, user, userRole, index, canDrag = true, onClick }: TaskCardProps) {
  const [{ isDragging }, drag] = useDrag(() => ({
    type: 'TASK',
    item: { id: task.id },
    collect: (monitor) => ({
      isDragging: monitor.isDragging()
    }),
    canDrag: canDrag
  }));

  const assignedUser = userRole.usuarioId === task.asignadoA ? user : null;
  const priorityKey =
    (task.prioridad && task.prioridad in priorityConfig
      ? task.prioridad
      : 'Media') as keyof typeof priorityConfig;

  const priorityStyle = priorityConfig[priorityKey];
  const estadoStyle = estadoConfig[task.estado as keyof typeof estadoConfig];

  const isOverdue = task.fechaLimite && new Date(task.fechaLimite) < new Date() && task.estado !== 'completada';

  return (
    <motion.div
      ref={canDrag as unknown as React.Ref<HTMLDivElement>}
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.03 }}
      onClick={onClick}
      className={`bg-white rounded-xl p-4 border border-slate-200 hover:border-blue-300 hover:shadow-md cursor-pointer transition-all group ${
        isDragging ? 'opacity-50 scale-95' : ''
      }`}
    >
      {/* Drag Handle & Priority */}
      <div className="flex items-start gap-2 mb-3">
        {canDrag && (
          <div className="mt-0.5 text-slate-300 opacity-0 group-hover:opacity-100 transition-opacity cursor-grab active:cursor-grabbing">
            <GripVertical className="w-4 h-4" />
          </div>
        )}
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-2">
            <div className={`w-1.5 h-1.5 rounded-full ${priorityStyle.dot}`}></div>
            <span className={`text-xs ${priorityStyle.text}`}>
              {priorityStyle.label}
            </span>
          </div>
          <h4 className="text-slate-900 mb-2 line-clamp-2 group-hover:text-blue-600 transition-colors">
            {task.titulo}
          </h4>
          {task.descripcion && (
            <p className="text-sm text-slate-500 line-clamp-2 mb-3">
              {task.descripcion}
            </p>
          )}
        </div>
      </div>

      {/* Footer */}
      <div className="flex items-center justify-between pt-3 border-t border-slate-100">
        <div className="flex items-center gap-2">
          {/* Assigned User */}
          {assignedUser && (
            <div 
              className="w-6 h-6 rounded-full bg-gradient-to-br from-blue-500 to-indigo-500 flex items-center justify-center text-white text-xs"
              title={assignedUser.nombre}
            >
              {assignedUser.nombre.charAt(0).toUpperCase()}
            </div>
          )}
          
          {/* Due Date */}
          {task.fechaLimite && (
            <div className={`flex items-center gap-1 px-2 py-1 rounded-lg text-xs ${
              isOverdue 
                ? 'bg-red-50 text-red-700 border border-red-200' 
                : 'bg-slate-50 text-slate-600'
            }`}>
              {isOverdue && <AlertCircle className="w-3 h-3" />}
              <Calendar className="w-3 h-3" />
              <span>
                {new Date(task.fechaLimite).toLocaleDateString('es-ES', { 
                  day: 'numeric', 
                  month: 'short' 
                })}
              </span>
            </div>
          )}
        </div>

        {/* Estado */}
        <span className={`px-2 py-1 rounded-lg text-xs ${estadoStyle.bg} ${estadoStyle.text}`}>
          {estadoStyle.label}
        </span>
      </div>
    </motion.div>
  );
}