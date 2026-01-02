import { useState } from 'react';
import { motion } from 'motion/react';
import {
  Shield, Users, LayoutGrid, Workflow, CheckSquare, MessageSquare,
  TrendingUp, ArrowLeft, Eye, Search, Calendar, Award
} from 'lucide-react';
import { User, Board, Pipeline, Task } from '../App';
import { UserDetailModal } from './UserDetailModal';
import type { UserInfo } from '../functions/models/UserInfoDTO';
import type { BoardInfoDTO } from '../functions/models/Board_model';
import type { PipelinesInfo } from '../functions/models/Pipeline_model';
import type { TaskInfoDTO } from '../functions/models/Task_model';
import type { CommentInfo } from '../functions/models/comment_model';

type AdminDashboardProps = {
  users: UserInfo[];
  boards: BoardInfoDTO[];
  pipelines: PipelinesInfo[];
  tasks: TaskInfoDTO[];
  comments: CommentInfo[];
  onBack: () => void;
};

export function AdminDashboard({ users, boards, pipelines, tasks, comments, onBack }: AdminDashboardProps) {
  const [selectedUser, setSelectedUser] = useState<UserInfo | null>(null);
  const [searchTerm, setSearchTerm] = useState('');

  // Calculate global metrics
  const totalUsers = users.length;
  const totalBoards = boards.length;
  const totalPipelines = pipelines.length;
  const totalTasks = tasks.length;
  const totalComments = comments.length;

  const metrics = [
    {
      label: 'Usuarios registrados',
      value: totalUsers,
      icon: Users,
      color: 'from-blue-500 to-indigo-500',
      bgColor: 'bg-blue-50',
      textColor: 'text-blue-600'
    },
    {
      label: 'Tableros creados',
      value: totalBoards,
      icon: LayoutGrid,
      color: 'from-purple-500 to-pink-500',
      bgColor: 'bg-purple-50',
      textColor: 'text-purple-600'
    },
    {
      label: 'Pipelines totales',
      value: totalPipelines,
      icon: Workflow,
      color: 'from-green-500 to-emerald-500',
      bgColor: 'bg-green-50',
      textColor: 'text-green-600'
    },
    {
      label: 'Tareas totales',
      value: totalTasks,
      icon: CheckSquare,
      color: 'from-orange-500 to-amber-500',
      bgColor: 'bg-orange-50',
      textColor: 'text-orange-600'
    },
    {
      label: 'Comentarios totales',
      value: totalComments,
      icon: MessageSquare,
      color: 'from-pink-500 to-rose-500',
      bgColor: 'bg-pink-50',
      textColor: 'text-pink-600'
    }
  ];

  // Filter users by search term
  const filteredUsers = users.filter(user =>
    user.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.correo.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Get user statistics
  const getUserStats = (userId: string) => {
    const userBoards = boards.filter(b => b.ownerId === userId).length;
    const userPipelines = pipelines.filter(p => p.ownerId === userId).length;
    const userTasks = tasks.filter(t => t.asignadoA === userId).length;
    const userComments = tasks.reduce((acc, task) => {
      return acc + task.comentarios.filter(c => c.userId === userId).length;
    }, 0);
    return { userBoards, userPipelines, userTasks, userComments };
  };

  const getRoleBadge = (rol: string) => {
    const config = {
      admin: { label: 'Admin', bg: 'bg-purple-100', text: 'text-purple-700', icon: '👑' },
      miembro: { label: 'Miembro', bg: 'bg-blue-100', text: 'text-blue-700', icon: '👤' },
      invitado: { label: 'Invitado', bg: 'bg-slate-100', text: 'text-slate-700', icon: '👥' }
    };
    return config[rol as keyof typeof config] || config.miembro;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button
              onClick={onBack}
              className="p-2 text-slate-600 hover:text-slate-900 hover:bg-white rounded-xl transition-all"
            >
              <ArrowLeft className="w-6 h-6" />
            </button>
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center text-white shadow-lg">
                <Shield className="w-6 h-6" />
              </div>
              <div>
                <h1 className="text-2xl text-slate-900">Panel de Administración</h1>
                <p className="text-sm text-slate-600">Gestión global de la plataforma GestTask</p>
              </div>
            </div>
          </div>
          <div className="flex items-center gap-2 px-4 py-2 bg-purple-50 text-purple-700 rounded-xl border border-purple-200">
            <Shield className="w-4 h-4" />
            <span className="text-sm">Modo Administrador</span>
          </div>
        </div>

        {/* Global Metrics */}
        <div>
          <div className="flex items-center gap-2 mb-4">
            <TrendingUp className="w-5 h-5 text-blue-600" />
            <h2 className="text-lg text-slate-900">Resumen general</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
            {metrics.map((metric) => {
              const Icon = metric.icon;
              return (
                <motion.div
                  key={metric.label}
                  whileHover={{ scale: 1.02, y: -2 }}
                  className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm hover:shadow-md transition-all"
                >
                  <div className="flex items-center justify-between mb-4">
                    <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${metric.color} flex items-center justify-center text-white shadow-lg`}>
                      <Icon className="w-6 h-6" />
                    </div>
                  </div>
                  <p className={`text-3xl ${metric.textColor} mb-2`}>{metric.value}</p>
                  <p className="text-sm text-slate-600">{metric.label}</p>
                </motion.div>
              );
            })}
          </div>
        </div>

        {/* User Management */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <Users className="w-5 h-5 text-blue-600" />
              <h2 className="text-lg text-slate-900">Gestión de usuarios</h2>
              <span className="px-2 py-0.5 bg-blue-50 text-blue-600 rounded-full text-xs">
                {filteredUsers.length}
              </span>
            </div>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input
                type="text"
                placeholder="Buscar usuarios..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 pr-4 py-2 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 text-sm"
              />
            </div>
          </div>

          {/* Users Table */}
          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-slate-200 bg-slate-50">
                    <th className="text-left px-6 py-4 text-xs text-slate-600 uppercase tracking-wider">
                      Usuario
                    </th>
                    <th className="text-left px-6 py-4 text-xs text-slate-600 uppercase tracking-wider">
                      Correo
                    </th>
                    <th className="text-left px-6 py-4 text-xs text-slate-600 uppercase tracking-wider">
                      Rol
                    </th>
                    <th className="text-left px-6 py-4 text-xs text-slate-600 uppercase tracking-wider">
                      Fecha de registro
                    </th>
                    <th className="text-left px-6 py-4 text-xs text-slate-600 uppercase tracking-wider">
                      Actividad
                    </th>
                    <th className="text-center px-6 py-4 text-xs text-slate-600 uppercase tracking-wider">
                      Acciones
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200">
                  {filteredUsers.map((user) => {
                    const stats = getUserStats(user._id);
                    const roleBadge = getRoleBadge(user.rol);
                    
                    return (
                      <motion.tr
                        key={user._id}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="hover:bg-slate-50 transition-colors"
                      >
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-indigo-500 flex items-center justify-center text-white text-sm">
                              {user.nombre.charAt(0).toUpperCase()}
                            </div>
                            <div>
                              <p className="text-sm text-slate-900">{user.nombre}</p>
                              <p className="text-xs text-slate-500">ID: {user.id}</p>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <p className="text-sm text-slate-900">{user.correo}</p>
                        </td>
                        <td className="px-6 py-4">
                          <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs ${roleBadge.bg} ${roleBadge.text}`}>
                            <span>{roleBadge.icon}</span>
                            {roleBadge.label}
                          </span>
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-2">
                            <Calendar className="w-4 h-4 text-slate-400" />
                            <span className="text-sm text-slate-600">
                              {user.fechaRegistro.toLocaleDateString('es-ES', {
                                day: 'numeric',
                                month: 'short',
                                year: 'numeric'
                              })}
                            </span>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-3 text-xs text-slate-600">
                            <div className="flex items-center gap-1">
                              <LayoutGrid className="w-3 h-3" />
                              <span>{stats.userBoards}</span>
                            </div>
                            <div className="flex items-center gap-1">
                              <Workflow className="w-3 h-3" />
                              <span>{stats.userPipelines}</span>
                            </div>
                            <div className="flex items-center gap-1">
                              <CheckSquare className="w-3 h-3" />
                              <span>{stats.userTasks}</span>
                            </div>
                            <div className="flex items-center gap-1">
                              <MessageSquare className="w-3 h-3" />
                              <span>{stats.userComments}</span>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex items-center justify-center gap-2">
                            <button
                              onClick={() => setSelectedUser(user)}
                              className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-all"
                              title="Ver detalle"
                            >
                              <Eye className="w-4 h-4" />
                            </button>
                          </div>
                        </td>
                      </motion.tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>

      {/* User Detail Modal */}
      {selectedUser && (
        <UserDetailModal
          user={selectedUser}
          boards={boards}
          pipelines={pipelines}
          tasks={tasks}
          onClose={() => setSelectedUser(null)}
        />
      )}
    </div>
  );
}
