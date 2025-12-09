import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ArrowLeft, Plus, Boxes, Users, MoreVertical, Trash2, Archive, Workflow, Sparkles, UserCog, Eye } from 'lucide-react';
import type { Board, User, Pipeline } from '../App';
import { PipelineView } from './PipelineView';
import { CreatePipelineModal } from './CreatePipelineModal';
import { ManageMembersModal } from './ManageMembersModal';

type BoardViewProps = {
  board: Board;
  user: User;
  users: User[];
  onBack: () => void;
  onDeleteBoard: (boardId: string) => void;
  onUpdateBoard: (board: Board) => void;
};

export function BoardView({ board, user, users, onBack, onDeleteBoard, onUpdateBoard }: BoardViewProps) {
  const [pipelines, setPipelines] = useState<Pipeline[]>([
    {
      id: '1',
      nombre: 'Desarrollo Frontend',
      descripcion: 'Pipeline para gestionar el desarrollo del frontend',
      tableroId: board.id,
      ownerId: user.id,
      estado: 'activo',
      etapas: [
        { id: '1-1', nombre: 'Por Hacer', orden: 0 },
        { id: '1-2', nombre: 'En Progreso', orden: 1 },
        { id: '1-3', nombre: 'En Revisión', orden: 2 },
        { id: '1-4', nombre: 'Completado', orden: 3 }
      ],
      fechaCreacion: new Date('2024-11-16')
    },
    {
      id: '2',
      nombre: 'Desarrollo Backend',
      descripcion: 'Pipeline para la implementación del backend y APIs',
      tableroId: board.id,
      ownerId: user.id,
      estado: 'activo',
      etapas: [
        { id: '2-1', nombre: 'Diseño', orden: 0 },
        { id: '2-2', nombre: 'Implementación', orden: 1 },
        { id: '2-3', nombre: 'Testing', orden: 2 },
        { id: '2-4', nombre: 'Desplegado', orden: 3 }
      ],
      fechaCreacion: new Date('2024-11-17')
    }
  ]);
  const [selectedPipeline, setSelectedPipeline] = useState<Pipeline | null>(null);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showMenu, setShowMenu] = useState(false);
  const [showManageMembersModal, setShowManageMembersModal] = useState(false);

  const handleCreatePipeline = (nombre: string, descripcion: string, etapas: { nombre: string; orden: number }[]) => {
    const newPipeline: Pipeline = {
      id: Date.now().toString(),
      nombre,
      descripcion,
      tableroId: board.id,
      ownerId: user.id,
      estado: 'activo',
      etapas: etapas.map((e, idx) => ({
        id: `${Date.now()}-${idx}`,
        nombre: e.nombre,
        orden: e.orden
      })),
      fechaCreacion: new Date()
    };
    setPipelines([...pipelines, newPipeline]);
    setShowCreateModal(false);
  };

  const handleDeletePipeline = (pipelineId: string) => {
    setPipelines(pipelines.filter(p => p.id !== pipelineId));
    if (selectedPipeline?.id === pipelineId) {
      setSelectedPipeline(null);
    }
  };

  const handleUpdatePipeline = (updatedPipeline: Pipeline) => {
    setPipelines(pipelines.map(p => p.id === updatedPipeline.id ? updatedPipeline : p));
    setSelectedPipeline(updatedPipeline);
  };

  const handleDeleteBoardClick = () => {
    if (window.confirm('¿Estás seguro de que quieres eliminar este tablero? Esta acción eliminará todos los pipelines y tareas.')) {
      onDeleteBoard(board.id);
    }
  };

  // Get current user's role in the board
  const currentUserRole = board.miembros.find(m => m.userId === user.id)?.role;
  const canCreatePipeline = currentUserRole === 'owner' || currentUserRole === 'miembro';
  const canDelete = currentUserRole === 'owner';
  const canManageMembers = currentUserRole === 'owner';

  const boardMemberIds = board.miembros.map(m => m.userId);
  const boardMembers = users.filter(u => boardMemberIds.includes(u.id));
  const activePipelines = pipelines.filter(p => p.estado === 'activo');

  if (selectedPipeline) {
    return (
      <PipelineView
        pipeline={selectedPipeline}
        board={board}
        user={user}
        users={users}
        onBack={() => setSelectedPipeline(null)}
        onDeletePipeline={handleDeletePipeline}
        onUpdatePipeline={handleUpdatePipeline}
      />
    );
  }

  return (
    <div className="min-h-screen bg-[#fafafa]">
      {/* Header */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-20 backdrop-blur-sm bg-white/90">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <button
                onClick={onBack}
                className="flex items-center gap-2 px-3 py-2 text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-xl transition-all"
              >
                <ArrowLeft className="w-5 h-5" />
                <span className="text-sm">Volver</span>
              </button>
              <div className="h-8 w-px bg-slate-200"></div>
              <div className="flex items-center gap-3">
                <div className="flex items-center justify-center w-10 h-10 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-xl shadow-lg shadow-blue-500/30">
                  <Boxes className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h1 className="text-lg text-slate-900">{board.nombre}</h1>
                  <p className="text-xs text-slate-500">{board.descripcion}</p>
                </div>
              </div>
            </div>
            <div className="flex items-center gap-3">
              {/* Members Button - Click to manage */}
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  if (canManageMembers) {
                    setShowManageMembersModal(true);
                  }
                }}
                className={`flex items-center gap-2 px-3 py-2 bg-slate-50 rounded-xl border border-slate-200 transition-all ${
                  canManageMembers ? 'hover:border-blue-300 hover:bg-blue-50 cursor-pointer' : ''
                }`}
                title={canManageMembers ? 'Gestionar miembros' : 'Ver miembros'}
              >
                {canManageMembers ? <UserCog className="w-4 h-4 text-slate-600" /> : <Users className="w-4 h-4 text-slate-600" />}
                <div className="flex -space-x-2">
                  {boardMembers.slice(0, 3).map((member) => {
                    const memberRole = board.miembros.find(m => m.userId === member.id)?.role;
                    return (
                      <div
                        key={member.id}
                        className={`w-7 h-7 rounded-full flex items-center justify-center text-white text-xs border-2 border-white ${
                          memberRole === 'owner' 
                            ? 'bg-gradient-to-br from-amber-500 to-orange-500' 
                            : memberRole === 'miembro'
                            ? 'bg-gradient-to-br from-blue-500 to-indigo-500'
                            : 'bg-gradient-to-br from-slate-400 to-slate-500'
                        }`}
                        title={`${member.nombre} (${memberRole === 'owner' ? 'Propietario' : memberRole === 'miembro' ? 'Miembro' : 'Invitado'})`}
                      >
                        {member.nombre.charAt(0).toUpperCase()}
                      </div>
                    );
                  })}
                  {boardMembers.length > 3 && (
                    <div className="w-7 h-7 rounded-full bg-slate-200 flex items-center justify-center text-slate-600 text-xs border-2 border-white">
                      +{boardMembers.length - 3}
                    </div>
                  )}
                </div>
                {canManageMembers && <span className="text-sm text-slate-600">Gestionar</span>}
              </button>
              
              {/* Menu */}
              <div className="relative">
                <button
                  onClick={() => setShowMenu(!showMenu)}
                  className="p-2 text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-xl transition-all"
                >
                  <MoreVertical className="w-5 h-5" />
                </button>
                {showMenu && (
                  <div className="absolute right-0 mt-2 w-56 bg-white rounded-xl shadow-lg border border-slate-200 py-1 z-10">
                    {canManageMembers && (
                      <>
                        <button
                          onClick={() => {
                            setShowManageMembersModal(true);
                            setShowMenu(false);
                          }}
                          className="w-full px-4 py-2 text-left text-slate-700 hover:bg-slate-50 flex items-center gap-2 text-sm"
                        >
                          <UserCog className="w-4 h-4" />
                          Gestionar Miembros
                        </button>
                        <div className="h-px bg-slate-200 my-1"></div>
                      </>
                    )}
                    {canDelete && (
                      <button
                        onClick={() => {
                          handleDeleteBoardClick();
                          setShowMenu(false);
                        }}
                        className="w-full px-4 py-2 text-left text-red-600 hover:bg-red-50 flex items-center gap-2 text-sm"
                      >
                        <Trash2 className="w-4 h-4" />
                        Eliminar Tablero
                      </button>
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Info Section */}
        <div className="mb-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex items-start justify-between"
          >
            <div>
              <div className="flex items-center gap-3 mb-3">
                <Sparkles className="w-6 h-6 text-blue-600" />
                <h2 className="text-3xl text-slate-900">Pipelines del Tablero</h2>
              </div>
              <p className="text-slate-600 mb-4">
                Cada pipeline contiene sus propias etapas para organizar tareas
              </p>
              <div className="flex items-center gap-4 text-sm text-slate-500">
                <div className="flex items-center gap-2">
                  <Workflow className="w-4 h-4" />
                  <span>{activePipelines.length} pipeline{activePipelines.length !== 1 ? 's' : ''} activo{activePipelines.length !== 1 ? 's' : ''}</span>
                </div>
              </div>
            </div>
            {canCreatePipeline ? (
              <button
                onClick={() => setShowCreateModal(true)}
                className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-xl hover:from-blue-700 hover:to-indigo-700 transition-all shadow-lg shadow-blue-500/30 hover:shadow-xl hover:shadow-blue-500/40"
              >
                <Plus className="w-5 h-5" />
                Crear Pipeline
              </button>
            ) : (
              <div className="px-6 py-3 bg-slate-100 text-slate-500 rounded-xl border border-slate-200 flex items-center gap-2">
                <Eye className="w-5 h-5" />
                <span>Solo lectura</span>
              </div>
            )}
          </motion.div>
        </div>

        {/* Pipelines Grid */}
        {activePipelines.length === 0 ? (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center py-20"
          >
            <div className="inline-flex items-center justify-center w-20 h-20 bg-slate-100 rounded-2xl mb-6">
              <Workflow className="w-10 h-10 text-slate-400" />
            </div>
            <h3 className="text-xl text-slate-900 mb-2">No hay pipelines en este tablero</h3>
            <p className="text-slate-500 mb-8 max-w-md mx-auto">
              {canCreatePipeline 
                ? 'Crea tu primer pipeline con etapas personalizadas para organizar tus tareas'
                : 'No hay pipelines disponibles en este tablero'
              }
            </p>
            {canCreatePipeline && (
              <button
                onClick={() => setShowCreateModal(true)}
                className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-xl hover:from-blue-700 hover:to-indigo-700 transition-all shadow-lg shadow-blue-500/30"
              >
                <Plus className="w-5 h-5" />
                Crear Primer Pipeline
              </button>
            )}
          </motion.div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <AnimatePresence>
              {activePipelines.map((pipeline, index) => (
                <motion.div
                  key={pipeline.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  transition={{ delay: index * 0.05 }}
                  onClick={() => setSelectedPipeline(pipeline)}
                  className="bg-white rounded-2xl p-6 border border-slate-200 hover:border-blue-300 hover:shadow-lg hover:shadow-blue-500/10 cursor-pointer transition-all group"
                >
                  {/* Header */}
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center justify-center w-12 h-12 bg-gradient-to-br from-violet-50 to-purple-50 rounded-xl group-hover:from-violet-100 group-hover:to-purple-100 transition-all">
                      <Workflow className="w-6 h-6 text-violet-600" />
                    </div>
                    <div className={`px-2.5 py-1 rounded-lg text-xs ${
                      pipeline.estado === 'activo' 
                        ? 'bg-green-50 text-green-700 border border-green-200' 
                        : 'bg-slate-100 text-slate-600 border border-slate-200'
                    }`}>
                      {pipeline.estado === 'activo' ? 'Activo' : 'Archivado'}
                    </div>
                  </div>

                  {/* Content */}
                  <h3 className="text-lg text-slate-900 mb-2 group-hover:text-blue-600 transition-colors">
                    {pipeline.nombre}
                  </h3>
                  <p className="text-sm text-slate-500 mb-4 line-clamp-2 min-h-[2.5rem]">
                    {pipeline.descripcion}
                  </p>

                  {/* Etapas Preview */}
                  <div className="mb-4">
                    <p className="text-xs text-slate-500 mb-2">Etapas del pipeline:</p>
                    <div className="flex flex-wrap gap-2">
                      {pipeline.etapas.sort((a, b) => a.orden - b.orden).map((etapa) => (
                        <span
                          key={etapa.id}
                          className="px-2.5 py-1 bg-slate-50 text-slate-700 rounded-lg text-xs border border-slate-200"
                        >
                          {etapa.nombre}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Footer */}
                  <div className="flex items-center justify-between pt-4 border-t border-slate-100">
                    <span className="text-sm text-slate-600">{pipeline.etapas.length} etapa{pipeline.etapas.length !== 1 ? 's' : ''}</span>
                    <span className="text-xs text-slate-400">
                      {pipeline.fechaCreacion.toLocaleDateString('es-ES', { day: 'numeric', month: 'short' })}
                    </span>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        )}
      </div>

      {/* Create Pipeline Modal */}
      {showCreateModal && (
        <CreatePipelineModal
          onClose={() => setShowCreateModal(false)}
          onCreate={handleCreatePipeline}
        />
      )}

      {/* Manage Members Modal */}
      {showManageMembersModal && (
        <ManageMembersModal
          board={board}
          users={users}
          currentUserId={user.id}
          onClose={() => setShowManageMembersModal(false)}
          onUpdateBoard={onUpdateBoard}
        />
      )}
    </div>
  );
}