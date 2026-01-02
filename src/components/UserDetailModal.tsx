import { motion } from 'motion/react';
import { X, User as UserIcon, Calendar, Mail, Award, LayoutGrid, Workflow, CheckSquare, MessageSquare, TrendingUp } from 'lucide-react';
import { User, Board, Pipeline, Task } from '../App';
import type { UserInfo } from '../functions/models/UserInfoDTO';
import type { BoardInfoDTO } from '../functions/models/Board_model';
import type { PipelinesInfo } from '../functions/models/Pipeline_model';
import type { TaskInfoDTO } from '../functions/models/Task_model';

type UserDetailModalProps = {
  user: UserInfo;
  boards: BoardInfoDTO[];
  pipelines: PipelinesInfo[];
  tasks: TaskInfoDTO[];
  onClose: () => void;
};

export function UserDetailModal({ user, boards, pipelines, tasks, onClose }: UserDetailModalProps) {
  // Calculate user metrics
  const userBoards = boards.filter(b => b.ownerId === user.id);
  const userPipelines = pipelines.filter(p => p.ownerId === user.id);
  const userTasks = tasks.filter(t => t.asignadoA === user.id);
  const userComments = tasks.reduce((acc, task) => {
    return acc + task.comentarios.filter(c => c.userId === user.id).length;
  }, 0);

  const metrics = [
    {
      label: 'Tableros creados',
      value: userBoards.length,
      icon: LayoutGrid,
      color: 'from-blue-500 to-indigo-500',
      bgColor: 'bg-blue-50',
      textColor: 'text-blue-600'
    },
    {
      label: 'Pipelines creados',
      value: userPipelines.length,
      icon: Workflow,
      color: 'from-purple-500 to-pink-500',
      bgColor: 'bg-purple-50',
      textColor: 'text-purple-600'
    },
    {
      label: 'Tareas asignadas',
      value: userTasks.length,
      icon: CheckSquare,
      color: 'from-green-500 to-emerald-500',
      bgColor: 'bg-green-50',
      textColor: 'text-green-600'
    },
    {
      label: 'Comentarios realizados',
      value: userComments,
      icon: MessageSquare,
      color: 'from-orange-500 to-amber-500',
      bgColor: 'bg-orange-50',
      textColor: 'text-orange-600'
    }
  ];

  const getRoleBadge = (rol: string) => {
    const config = {
      admin: { label: 'Admin', bg: 'bg-purple-100', text: 'text-purple-700', icon: '👑' },
      miembro: { label: 'Miembro', bg: 'bg-blue-100', text: 'text-blue-700', icon: '👤' },
      invitado: { label: 'Invitado', bg: 'bg-slate-100', text: 'text-slate-700', icon: '👥' }
    };
    return config[rol as keyof typeof config] || config.miembro;
  };

  const roleBadge = getRoleBadge(user.rol);

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-50">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="bg-white rounded-2xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-hidden flex flex-col"
      >
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-slate-200 bg-gradient-to-r from-blue-50 to-indigo-50">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-blue-500 to-indigo-500 flex items-center justify-center text-white text-2xl shadow-lg">
              {user.nombre.charAt(0).toUpperCase()}
            </div>
            <div>
              <h2 className="text-xl text-slate-900">{user.nombre}</h2>
              <div className="flex items-center gap-2 mt-1">
                <Mail className="w-4 h-4 text-slate-500" />
                <span className="text-sm text-slate-600">{user.correo}</span>
              </div>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-slate-600 hover:bg-white rounded-xl transition-all"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {/* General Information */}
          <div>
            <h3 className="flex items-center gap-2 text-base text-slate-900 mb-4">
              <UserIcon className="w-5 h-5 text-blue-600" />
              Información general
            </h3>
            <div className="grid grid-cols-3 gap-4">
              <div className="bg-slate-50 rounded-xl p-4 border border-slate-200">
                <div className="flex items-center gap-2 text-xs text-slate-600 mb-2">
                  <Award className="w-4 h-4" />
                  <span>Rol global</span>
                </div>
                <span className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm ${roleBadge.bg} ${roleBadge.text}`}>
                  <span>{roleBadge.icon}</span>
                  {roleBadge.label}
                </span>
              </div>
              <div className="bg-slate-50 rounded-xl p-4 border border-slate-200">
                <div className="flex items-center gap-2 text-xs text-slate-600 mb-2">
                  <Calendar className="w-4 h-4" />
                  <span>Fecha de registro</span>
                </div>
                <p className="text-sm text-slate-900">
                  {user.fechaRegistro.toLocaleDateString('es-ES', {
                    day: 'numeric',
                    month: 'long',
                    year: 'numeric'
                  })}
                </p>
              </div>
              <div className="bg-slate-50 rounded-xl p-4 border border-slate-200">
                <div className="flex items-center gap-2 text-xs text-slate-600 mb-2">
                  <TrendingUp className="w-4 h-4" />
                  <span>Estado</span>
                </div>
                <span className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm bg-green-50 text-green-700">
                  <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
                  Activo
                </span>
              </div>
            </div>
          </div>

          {/* User Metrics */}
          <div>
            <h3 className="flex items-center gap-2 text-base text-slate-900 mb-4">
              <TrendingUp className="w-5 h-5 text-blue-600" />
              Métricas de actividad
            </h3>
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
              {metrics.map((metric) => {
                const Icon = metric.icon;
                return (
                  <motion.div
                    key={metric.label}
                    whileHover={{ scale: 1.02 }}
                    className={`${metric.bgColor} rounded-xl p-4 border border-slate-200 transition-all`}
                  >
                    <div className="flex items-center justify-between mb-3">
                      <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${metric.color} flex items-center justify-center text-white shadow-lg`}>
                        <Icon className="w-5 h-5" />
                      </div>
                    </div>
                    <p className={`text-3xl ${metric.textColor} mb-1`}>{metric.value}</p>
                    <p className="text-sm text-slate-600">{metric.label}</p>
                  </motion.div>
                );
              })}
            </div>
          </div>

          {/* User Boards */}
          {userBoards.length > 0 && (
            <div>
              <h3 className="flex items-center gap-2 text-base text-slate-900 mb-4">
                <LayoutGrid className="w-5 h-5 text-blue-600" />
                Tableros creados ({userBoards.length})
              </h3>
              <div className="space-y-2">
                {userBoards.map((board) => {
                  const boardPipelines = pipelines.filter(p => p.tableroId === board.id);
                  const boardTasks = tasks.filter(t => t.tableroId === board.id);
                  
                  return (
                    <motion.div
                      key={board.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="bg-slate-50 rounded-xl p-4 border border-slate-200 hover:border-blue-300 transition-all"
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex-1">
                          <h4 className="text-sm text-slate-900">{board.nombre}</h4>
                          {board.descripcion && (
                            <p className="text-xs text-slate-600 mt-1">{board.descripcion}</p>
                          )}
                          <div className="flex items-center gap-4 mt-2">
                            <span className="text-xs text-slate-500">
                              {boardPipelines.length} pipelines
                            </span>
                            <span className="text-xs text-slate-500">
                              {boardTasks.length} tareas
                            </span>
                            <span className="text-xs text-slate-500">
                              {board.miembros.length} miembros
                            </span>
                          </div>
                        </div>
                        <span className={`px-3 py-1 rounded-lg text-xs ${
                          board.estado === 'activo' 
                            ? 'bg-green-50 text-green-700' 
                            : 'bg-slate-100 text-slate-600'
                        }`}>
                          {board.estado === 'activo' ? 'Activo' : 'Archivado'}
                        </span>
                      </div>
                    </motion.div>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      </motion.div>
    </div>
  );
}
