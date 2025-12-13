import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ArrowLeft, Plus, Workflow, MoreVertical, Trash2, Boxes, Sparkles, Eye } from 'lucide-react';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import type { Pipeline, Board, User, Task } from '../App';
import { StageColumn } from './StageColumn';
import { CreateTaskModal } from './CreateTaskModal';
import { TaskDetailModal } from './TaskDetailModal';
import type { BoardInfoDTO } from '../functions/models/Board_model';
import type { UserInfo } from '../functions/models/UserInfoDTO';

type PipelineViewProps = {
  pipeline: Pipeline;
  board: BoardInfoDTO;
  user: UserInfo;
  users: User[];
  onBack: () => void;
  onDeletePipeline: (pipelineId: string) => void;
  onUpdatePipeline: (pipeline: Pipeline) => void;
};

export function PipelineView({ 
  pipeline, 
  board, 
  user, 
  users, 
  onBack, 
  onDeletePipeline,
  onUpdatePipeline 
}: PipelineViewProps) {
  const [tasks, setTasks] = useState<Task[]>([
    {
      id: '1',
      titulo: 'Diseñar página de inicio',
      descripcion: 'Crear el diseño de la landing page con Figma',
      pipelineId: pipeline.id,
      etapaId: pipeline.etapas[0]?.id || '',
      tableroId: board.id,
      asignadoA: user.id,
      prioridad: 'alta',
      estado: 'en_progreso',
      fechaLimite: new Date('2024-12-10'),
      fechaCreacion: new Date('2024-11-25'),
      comentarios: []
    },
    {
      id: '2',
      titulo: 'Implementar sistema de autenticación',
      descripcion: 'Agregar login y registro con JWT',
      pipelineId: pipeline.id,
      etapaId: pipeline.etapas[1]?.id || '',
      tableroId: board.id,
      asignadoA: '2',
      prioridad: 'media',
      estado: 'en_progreso',
      fechaLimite: new Date('2024-12-15'),
      fechaCreacion: new Date('2024-11-26'),
      comentarios: []
    }
  ]);
  const [selectedStageId, setSelectedStageId] = useState<string | null>(null);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);
  const [showMenu, setShowMenu] = useState(false);

  // Get current user's role in the board
  const currentUserRole = board.miembros.find(m => m.userId === user.id)?.role;
  const canCreateTask = currentUserRole === 'owner' || currentUserRole === 'miembro';
  const canMoveTask = currentUserRole === 'owner' || currentUserRole === 'miembro';
  const canDelete = currentUserRole === 'owner';
  const isReadOnly = currentUserRole === 'invitado';

  const handleCreateTask = (
    titulo: string,
    descripcion: string,
    prioridad: 'baja' | 'media' | 'alta',
    asignadoA: string,
    fechaLimite?: Date
  ) => {
    if (!selectedStageId || !canCreateTask) return;

    const newTask: Task = {
      id: Date.now().toString(),
      titulo,
      descripcion,
      pipelineId: pipeline.id,
      etapaId: selectedStageId,
      tableroId: board.id,
      asignadoA,
      prioridad,
      estado: 'pendiente',
      fechaLimite,
      fechaCreacion: new Date(),
      comentarios: []
    };

    setTasks([...tasks, newTask]);
    setShowCreateModal(false);
    setSelectedStageId(null);
  };

  const handleMoveTask = (taskId: string, newEtapaId: string) => {
    if (!canMoveTask) return;
    setTasks(tasks.map(task => 
      task.id === taskId ? { ...task, etapaId: newEtapaId } : task
    ));
  };

  const handleDeleteTask = (taskId: string) => {
    if (!canDelete) return;
    setTasks(tasks.filter(t => t.id !== taskId));
    setSelectedTask(null);
  };

  const handleUpdateTask = (updatedTask: Task) => {
    setTasks(tasks.map(t => t.id === updatedTask.id ? updatedTask : t));
  };

  const handleDeletePipelineClick = () => {
    if (window.confirm('¿Estás seguro de que quieres eliminar este pipeline? Esta acción eliminará todas las tareas.')) {
      onDeletePipeline(pipeline.id);
    }
  };

  const sortedStages = [...pipeline.etapas].sort((a, b) => a.orden - b.orden);

  return (
    <DndProvider backend={HTML5Backend}>
      <div className="min-h-screen bg-[#fafafa]">
        {/* Header */}
        <header className="bg-white border-b border-slate-200 sticky top-0 z-20 backdrop-blur-sm bg-white/90">
          <div className="max-w-[1800px] mx-auto px-6 py-4">
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
                  <div className="flex items-center justify-center w-10 h-10 bg-gradient-to-br from-violet-600 to-purple-600 rounded-xl shadow-lg shadow-violet-500/30">
                    <Workflow className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h1 className="text-lg text-slate-900">{pipeline.nombre}</h1>
                      <span className="px-2 py-0.5 bg-violet-50 text-violet-700 rounded-lg text-xs border border-violet-200">
                        Pipeline
                      </span>
                      {isReadOnly && (
                        <span className="px-2 py-0.5 bg-slate-100 text-slate-600 rounded-lg text-xs border border-slate-200 flex items-center gap-1">
                          <Eye className="w-3 h-3" />
                          Solo lectura
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-slate-500">
                      <Boxes className="w-3 h-3 inline mr-1" />
                      {board.nombre} • {pipeline.descripcion}
                    </p>
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-3">
                {isReadOnly && (
                  <div className="px-3 py-1.5 bg-amber-50 text-amber-700 rounded-xl border border-amber-200 text-xs flex items-center gap-2">
                    <Eye className="w-4 h-4" />
                    <span>Modo vista: No puedes crear ni editar</span>
                  </div>
                )}
                {canDelete && (
                  <div className="relative">
                    <button
                      onClick={() => setShowMenu(!showMenu)}
                      className="p-2 text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-xl transition-all"
                    >
                      <MoreVertical className="w-5 h-5" />
                    </button>
                    {showMenu && (
                      <div className="absolute right-0 mt-2 w-56 bg-white rounded-xl shadow-lg border border-slate-200 py-1 z-10">
                        <button
                          onClick={() => {
                            handleDeletePipelineClick();
                            setShowMenu(false);
                          }}
                          className="w-full px-4 py-2 text-left text-red-600 hover:bg-red-50 flex items-center gap-2 text-sm"
                        >
                          <Trash2 className="w-4 h-4" />
                          Eliminar Pipeline
                        </button>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>
        </header>

        {/* Kanban Board */}
        <div className="max-w-[1800px] mx-auto px-6 py-8">
          <div className="mb-6">
            <div className="flex items-center gap-3 mb-2">
              <Sparkles className="w-5 h-5 text-violet-600" />
              <h2 className="text-xl text-slate-900">Etapas del Pipeline</h2>
            </div>
            <p className="text-sm text-slate-600">
              {canMoveTask 
                ? 'Arrastra y suelta las tareas entre etapas para gestionar su progreso' 
                : 'Vista de solo lectura - No puedes mover tareas'
              }
            </p>
          </div>

          <div className="flex gap-5 overflow-x-auto pb-4">
            {sortedStages.map((stage) => (
              <StageColumn
                key={stage.id}
                stage={stage}
                tasks={tasks.filter(t => t.etapaId === stage.id)}
                users={users}
                canAddTask={canCreateTask}
                canMoveTask={canMoveTask}
                onAddTask={() => {
                  if (canCreateTask) {
                    setSelectedStageId(stage.id);
                    setShowCreateModal(true);
                  }
                }}
                onMoveTask={handleMoveTask}
                onTaskClick={setSelectedTask}
              />
            ))}
          </div>
        </div>

        {/* Create Task Modal */}
        {showCreateModal && selectedStageId && (
          <CreateTaskModal
            users={users}
            currentUserId={user.id}
            onClose={() => {
              setShowCreateModal(false);
              setSelectedStageId(null);
            }}
            onCreate={handleCreateTask}
          />
        )}

        {/* Task Detail Modal */}
        {selectedTask && (
          <TaskDetailModal
            task={selectedTask}
            pipeline={pipeline}
            users={users}
            currentUser={user}
            onClose={() => setSelectedTask(null)}
            onDelete={handleDeleteTask}
            onUpdate={handleUpdateTask}
          />
        )}
      </div>
    </DndProvider>
  );
}