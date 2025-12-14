import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, UserPlus, Crown, User as UserIcon, Eye, Shield, Trash2 } from 'lucide-react';
import type { Board, User, BoardMember } from '../App';
import type { BoardInfoDTO } from '../functions/models/Board_model';

type ManageMembersModalProps = {
  board: BoardInfoDTO;
  users: User[];
  currentUserId: string;
  onClose: () => void;
  onUpdateBoard: (board: Board) => void;
};

export function ManageMembersModal({ board, users, currentUserId, onClose, onUpdateBoard }: ManageMembersModalProps) {
  const [selectedUserId, setSelectedUserId] = useState<string>('');
  const [selectedRole, setSelectedRole] = useState<'miembro' | 'invitado'>('miembro');

  const currentUserRole = board.miembros.find(m => m.userId === currentUserId)?.role;
  const isOwner = currentUserRole === 'owner';

  const boardMemberIds = board.miembros.map(m => m.userId);
  const availableUsers = users.filter(u => !boardMemberIds.includes(u.id));

  const handleAddMember = () => {
    if (!selectedUserId || !isOwner) return;

    const newMember: BoardMember = {
      userId: selectedUserId,
      role: selectedRole,
      addedAt: new Date()
    };

    const updatedBoard = {
      ...board,
      miembros: [...board.miembros, newMember]
    };

    onUpdateBoard(updatedBoard);
    setSelectedUserId('');
  };

  const handleRemoveMember = (userId: string) => {
    if (!isOwner || userId === board.ownerId) return;

    const updatedBoard = {
      ...board,
      miembros: board.miembros.filter(m => m.userId !== userId)
    };

    onUpdateBoard(updatedBoard);
  };

  const handleChangeRole = (userId: string, newRole: 'owner' | 'miembro' | 'invitado') => {
    if (!isOwner || userId === board.ownerId) return;

    const updatedBoard = {
      ...board,
      miembros: board.miembros.map(m =>
        m.userId === userId ? { ...m, role: newRole } : m
      )
    };

    onUpdateBoard(updatedBoard);
  };

  const getRoleIcon = (role: 'owner' | 'miembro' | 'invitado') => {
    switch (role) {
      case 'owner':
        return <Crown className="w-4 h-4" />;
      case 'miembro':
        return <UserIcon className="w-4 h-4" />;
      case 'invitado':
        return <Eye className="w-4 h-4" />;
    }
  };

  const getRoleBadgeStyle = (role: 'owner' | 'miembro' | 'invitado') => {
    switch (role) {
      case 'owner':
        return 'bg-amber-50 text-amber-700 border-amber-200';
      case 'miembro':
        return 'bg-blue-50 text-blue-700 border-blue-200';
      case 'invitado':
        return 'bg-slate-50 text-slate-700 border-slate-200';
    }
  };

  const getRoleLabel = (role: 'owner' | 'miembro' | 'invitado') => {
    switch (role) {
      case 'owner':
        return 'Propietario';
      case 'miembro':
        return 'Miembro';
      case 'invitado':
        return 'Invitado';
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-hidden"
      >
        {/* Header */}
        <div className="px-6 py-5 border-b border-slate-200 flex items-center justify-between">
          <div>
            <h2 className="text-xl text-slate-900">Gestionar Miembros</h2>
            <p className="text-sm text-slate-500 mt-1">{board.nombre}</p>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-slate-100 rounded-xl transition-all"
          >
            <X className="w-5 h-5 text-slate-600" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto max-h-[calc(90vh-180px)]">
          {/* Add Member Section - Only visible for owners */}
          {isOwner && availableUsers.length > 0 && (
            <div className="mb-6 p-4 bg-blue-50 border border-blue-200 rounded-xl">
              <div className="flex items-center gap-2 mb-3">
                <UserPlus className="w-5 h-5 text-blue-600" />
                <h3 className="text-slate-900">Agregar Nuevo Miembro</h3>
              </div>
              <div className="flex gap-3">
                <select
                  value={selectedUserId}
                  onChange={(e) => setSelectedUserId(e.target.value)}
                  className="flex-1 px-3 py-2 bg-white border border-slate-300 rounded-xl text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">Seleccionar usuario...</option>
                  {availableUsers.map(user => (
                    <option key={user.id} value={user.id}>
                      {user.nombre} ({user.correo})
                    </option>
                  ))}
                </select>
                <select
                  value={selectedRole}
                  onChange={(e) => setSelectedRole(e.target.value as 'miembro' | 'invitado')}
                  className="px-3 py-2 bg-white border border-slate-300 rounded-xl text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="miembro">Miembro</option>
                  <option value="invitado">Invitado</option>
                </select>
                <button
                  onClick={handleAddMember}
                  disabled={!selectedUserId}
                  className="px-4 py-2 bg-blue-600 text-white rounded-xl hover:bg-blue-700 disabled:bg-slate-300 disabled:cursor-not-allowed transition-all"
                >
                  Agregar
                </button>
              </div>
            </div>
          )}

          {/* Current Members List */}
          <div>
            <h3 className="text-slate-900 mb-3 flex items-center gap-2">
              <Shield className="w-5 h-5 text-slate-600" />
              Miembros Actuales ({board.miembros.length})
            </h3>
            <div className="space-y-2">
              {board.miembros.map((member) => {
                const user = users.find(u => u.id === member.userId);
                if (!user) return null;

                const isCurrentUser = member.userId === currentUserId;
                const isBoardOwner = member.userId === board.ownerId;

                return (
                  <div
                    key={member.userId}
                    className="p-4 bg-slate-50 rounded-xl border border-slate-200 hover:border-slate-300 transition-all"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3 flex-1">
                        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-indigo-500 flex items-center justify-center text-white">
                          {user.nombre.charAt(0).toUpperCase()}
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center gap-2">
                            <p className="text-slate-900">
                              {user.nombre}
                              {isCurrentUser && <span className="text-slate-500 text-sm ml-1">(Tú)</span>}
                            </p>
                          </div>
                          <p className="text-sm text-slate-500">{user.correo}</p>
                        </div>
                      </div>

                      <div className="flex items-center gap-3">
                        {/* Role Selector or Badge */}
                        {isOwner && !isBoardOwner ? (
                          <select
                            value={member.role}
                            onChange={(e) => handleChangeRole(member.userId, e.target.value as 'owner' | 'miembro' | 'invitado')}
                            className={`px-3 py-1.5 rounded-lg text-xs border flex items-center gap-1.5 ${getRoleBadgeStyle(member.role)}`}
                          >
                            <option value="miembro">Miembro</option>
                            <option value="invitado">Invitado</option>
                          </select>
                        ) : (
                          <div className={`px-3 py-1.5 rounded-lg text-xs border flex items-center gap-1.5 ${getRoleBadgeStyle(member.role)}`}>
                            {getRoleIcon(member.role)}
                            <span>{getRoleLabel(member.role)}</span>
                          </div>
                        )}

                        {/* Remove Button - Only for owners, can't remove self or board owner */}
                        {isOwner && !isBoardOwner && !isCurrentUser && (
                          <button
                            onClick={() => handleRemoveMember(member.userId)}
                            className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-all"
                            title="Remover miembro"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Permissions Info */}
          <div className="mt-6 p-4 bg-slate-50 rounded-xl border border-slate-200">
            <h4 className="text-sm text-slate-900 mb-3">Permisos por Rol:</h4>
            <div className="space-y-2 text-xs text-slate-600">
              <div className="flex items-start gap-2">
                <Crown className="w-4 h-4 text-amber-600 mt-0.5 flex-shrink-0" />
                <div>
                  <span className="text-slate-900">Propietario:</span> Control total del tablero, pipelines, tareas y miembros
                </div>
              </div>
              <div className="flex items-start gap-2">
                <UserIcon className="w-4 h-4 text-blue-600 mt-0.5 flex-shrink-0" />
                <div>
                  <span className="text-slate-900">Miembro:</span> Puede crear pipelines, tareas, comentar y mover tareas. No puede eliminar
                </div>
              </div>
              <div className="flex items-start gap-2">
                <Eye className="w-4 h-4 text-slate-600 mt-0.5 flex-shrink-0" />
                <div>
                  <span className="text-slate-900">Invitado:</span> Solo puede ver y comentar. No puede crear ni editar
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-slate-200 flex justify-end">
          <button
            onClick={onClose}
            className="px-6 py-2.5 bg-slate-900 text-white rounded-xl hover:bg-slate-800 transition-all"
          >
            Cerrar
          </button>
        </div>
      </motion.div>
    </div>
  );
}