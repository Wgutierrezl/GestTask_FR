import { useDrop } from 'react-dnd';
import { motion } from 'motion/react';
import { Plus, Eye } from 'lucide-react';
import type { Stage, Task, User } from '../App';
import { TaskCard } from './TaskCard';
import type { TaskInfoDTO } from '../functions/models/Task_model';
import type { BoardMemberInfo, BoardMemberInfoDTO } from '../functions/models/Board_model';
import type { UserInfo } from '../functions/models/UserInfoDTO';

type StageColumnProps = {
  stage: Stage;
  tasks: TaskInfoDTO[];
  user: UserInfo;
  userRole: BoardMemberInfo ;
  canAddTask?: boolean;
  canMoveTask?: boolean;
  onAddTask: () => void;
  onMoveTask: (taskId: string, newEtapaId: string) => void;
  onTaskClick: (task: TaskInfoDTO) => void;
};

export function StageColumn({ 
  stage, 
  tasks, 
  user,
  userRole,
  canAddTask = true,
  canMoveTask = true,
  onAddTask, 
  onMoveTask, 
  onTaskClick 
}: StageColumnProps) {
  const [{ isOver }, dropRef] = useDrop<
    { id: string },
    void,
    { isOver: boolean }
    >(() => ({
    accept: 'TASK',
    drop: (item) => {
        if (canMoveTask) onMoveTask(item.id, stage.id);
    },
    collect: (monitor) => ({
        isOver: monitor.isOver()
    }),
    canDrop: () => canMoveTask
    }));

  return (
    <div className="flex-shrink-0 w-80">
      <div className="bg-slate-50 rounded-2xl border border-slate-200 p-4 h-full">
        {/* Stage Header */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-blue-600"></div>
            <h3 className="text-sm text-slate-900">{stage.nombre}</h3>
            <span className="px-2 py-0.5 bg-white text-slate-600 rounded-lg text-xs border border-slate-200">
              {tasks.length}
            </span>
          </div>
        </div>

        {/* Drop Zone */}
        <div
          ref={dropRef as unknown as React.Ref<HTMLDivElement>}
          className={`space-y-3 min-h-[400px] transition-all rounded-xl ${
            isOver && canMoveTask ? 'bg-blue-50 p-2 border-2 border-dashed border-blue-300' : ''
          }`}
        >
          {tasks.map((task, index) => (
            <TaskCard 
              key={task.id} 
              task={task} 
              user={user}
              userRole={userRole}
              index={index}
              canDrag={canMoveTask}
              onClick={() => onTaskClick(task)}
            />
          ))}
          {tasks.length === 0 && !isOver && (
            <div className="flex items-center justify-center h-32 text-slate-400 text-sm">
              No hay tareas aún
            </div>
          )}
        </div>

        {/* Add Task Button */}
        {canAddTask ? (
          <button
            onClick={onAddTask}
            className="w-full mt-3 flex items-center justify-center gap-2 px-4 py-2.5 text-slate-600 hover:text-slate-900 hover:bg-white rounded-xl transition-all border-2 border-dashed border-slate-300 hover:border-blue-400 hover:bg-blue-50 group"
          >
            <Plus className="w-4 h-4" />
            <span className="text-sm">Agregar tarea</span>
          </button>
        ) : (
          <div className="w-full mt-3 flex items-center justify-center gap-2 px-4 py-2.5 text-slate-400 bg-slate-100 rounded-xl border border-slate-200">
            <Eye className="w-4 h-4" />
            <span className="text-sm">Solo lectura</span>
          </div>
        )}
      </div>
    </div>
  );
}