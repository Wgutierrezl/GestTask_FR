import { useEffect, useState } from 'react';
import { motion } from 'motion/react';
import { 
  X, Trash2, Calendar, User, AlertCircle, Clock, 
  Edit2, Check, Workflow, CheckSquare, Flag, MessageSquare,
  Paperclip, Send, Download, FileText, Image as ImageIcon, File
} from 'lucide-react';
import type { Task, Pipeline, User as UserType, Comment, CommentAttachment } from '../App';
import type { PipelinesInfo } from '../functions/models/Pipeline_model';
import type { TaskInfoDTO } from '../functions/models/Task_model';
import type { BoardMemberInfo, BoardMemberInfoDTO } from '../functions/models/Board_model';
import { GetCommentsByTaskId } from '../functions/comments_functions/comments.functions';
import { AddComment } from '../functions/comments_functions/comments.functions';
import type { CommentInfo, CreateCommentDTO, FileInputDTO } from '../functions/models/comment_model';
import Swal from 'sweetalert2';

type TaskDetailModalProps = {
  task: TaskInfoDTO;
  boardId: string; 
  pipeline: PipelinesInfo;
  users: BoardMemberInfo[];
  currentUser: string;
  onClose: () => void;
  onDelete: (taskId: string) => void;
  onUpdate: (task: TaskInfoDTO) => void;
};

const priorityConfig: Record<'Baja' | 'Media' | 'Alta', {
  color: string;
  bg: string;
  border: string;
  label: string;
  icon: string;
}> = {
  Baja: { color: 'text-green-600', bg: 'bg-green-50', border: 'border-green-200', label: 'Baja', icon: '🟢' },
  Media:{ color: 'text-yellow-600', bg: 'bg-yellow-50', border: 'border-yellow-200', label: 'Media', icon: '🟡' },
  Alta: { color: 'text-red-600', bg: 'bg-red-50', border: 'border-red-200', label: 'Alta', icon: '🔴' }
};

const estadoConfig = {
  Inactivo: { color: 'text-slate-600', bg: 'bg-slate-50', label: 'Inactivo' },
  Activo: { color: 'text-green-600', bg: 'bg-green-50', label: 'Activo' }
};

export function TaskDetailModal({ 
  task, 
  boardId,
  pipeline, 
  users, 
  currentUser, 
  onClose, 
  onDelete, 
  onUpdate 
}: TaskDetailModalProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [editedTitulo, setEditedTitulo] = useState(task.titulo);
  const [editedDescripcion, setEditedDescripcion] = useState(task.descripcion);
  const [editedPrioridad, setEditedPrioridad] = useState(task.prioridad);
  const [editedEstado, setEditedEstado] = useState(task.estado);
  const [editedAsignadoA, setEditedAsignadoA] = useState(task.asignadoA || '');
  const [editedFechaLimite, setEditedFechaLimite] = useState(
    task.fechaLimite ? new Date(task.fechaLimite).toISOString().split('T')[0] : ''
  );
  const [comments, setComments] = useState<CommentInfo[]>([]);

  // Comment state
  const [newComment, setNewComment] = useState('');
  const [attachments, setAttachments] = useState<File[]>([]);
  const [isUploadingFiles, setIsUploadingFiles] = useState(false);

  const assignedUser = users.find(u => u.usuarioId.id === task.asignadoA);
  const currentStage = pipeline.etapas.find(e => e.id === task.etapaId);
  const priorityStyle = priorityConfig[task.prioridad] ?? priorityConfig.Baja;
  const estadoStyle = estadoConfig[task.estado] ?? estadoConfig.Inactivo;

  useEffect(()=> {
    const fetchComments = async () => {
      try{
        const fetchedComments = await GetCommentsByTaskId(task.id);
        if (!fetchedComments) {
          setComments([]);
          return;
        } 

        if(fetchedComments.length===0){
          setComments([]);
          return ;
        }

        setComments(fetchedComments);

      }catch(error: any){
        Swal.fire('Error',`ha ocurrido un error inesperado ${error.message ?? error}`,'error');
        setComments([]);
        return;
      }
    }
    fetchComments();

  },[task.id]);

  /* const handleSaveEdit = () => {
    const updatedTask: Task = {
      ...task,
      titulo: editedTitulo,
      descripcion: editedDescripcion,
      prioridad: editedPrioridad,
      estado: editedEstado,
      asignadoA: editedAsignadoA,
      fechaLimite: editedFechaLimite ? new Date(editedFechaLimite) : undefined,
      fechaFinalizacion: editedEstado === 'Inactivo' && task.estado !== 'Inactivo' 
        ? new Date() 
        : task.fechaFinalizacion
    };
    onUpdate(updatedTask);
    setIsEditing(false);
  }; */

  /* const handleDelete = () => {
    if (window.confirm('¿Estás seguro de que quieres eliminar esta tarea?')) {
      onDelete(task.id);
    }
  }; */

  /* const handleFileAttachment = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;

    setIsUploadingFiles(true);

    Array.from(files).forEach((file) => {
      const reader = new FileReader();
      
      reader.onload = (event) => {
        const newAttachment: CommentAttachment = {
          id: Date.now().toString() + Math.random(),
          nombre: file.name,
          url: event.target?.result as string,
          tipo: file.type,
          tamaño: file.size
        };
        
        setAttachments(prev => [...prev, newAttachment]);
        setIsUploadingFiles(false);
      };
      
      reader.readAsDataURL(file);
    });

    // Reset input
    e.target.value = '';
  }; */

  const handleFileAttachment = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
      if (!files) return;

      setAttachments((prev) => [...prev, ...Array.from(files)]);
      e.target.value = '';
  };

  /* const handleRemoveAttachment = (attachmentId: string) => {
    setAttachments(prev => prev.filter(a => a.id !== attachmentId));
  }; */

  const handleAddComment = async () => {
    if (!newComment.trim() && attachments.length === 0) return;

    const dto: CreateCommentDTO = {
      tareaId: task.id,
      mensaje: newComment,
      archivos: attachments
    };

    try {
      const savedComment = await AddComment(dto, boardId);

      if (savedComment) {
        setComments((prev) => [...prev, savedComment]);
      }

      setNewComment('');
      setAttachments([]);
    } catch (error) {
      Swal.fire("Error", "Hubo un problema al agregar el comentario.", "error");
    }
  };
  
  const formatFileSize = (bytes: number) => {
    if (bytes < 1024) return bytes + ' B';
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
    return (bytes / (1024 * 1024)).toFixed(1) + ' MB';
  };

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-50">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-hidden flex flex-col"
      >
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-slate-200">
          <div className="flex items-center gap-3">
            <div className="flex items-center justify-center w-10 h-10 bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl">
              <CheckSquare className="w-5 h-5 text-blue-600" />
            </div>
            <div>
              <h2 className="text-lg text-slate-900">Detalle de Tarea</h2>
              <div className="flex items-center gap-2 text-xs text-slate-500">
                <Workflow className="w-3 h-3" />
                <span>{pipeline.nombre} → {currentStage?.nombre}</span>
              </div>
            </div>
          </div>
          <div className="flex items-center gap-2">
            {!isEditing && (
              <button
                onClick={() => setIsEditing(true)}
                className="p-2 text-blue-600 hover:bg-blue-50 rounded-xl transition-all"
                title="Editar"
              >
                <Edit2 className="w-5 h-5" />
              </button>
            )}
            <button
              /* onClick={handleDelete} */
              className="p-2 text-red-600 hover:bg-red-50 rounded-xl transition-all"
              title="Eliminar"
            >
              <Trash2 className="w-5 h-5" />
            </button>
            <button
              onClick={onClose}
              className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-xl transition-all"
            >
              <X className="w-6 h-6" />
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {/* Title & Description */}
          {isEditing ? (
            <div className="space-y-4">
              <div>
                <label className="block text-sm mb-2 text-slate-700">Título</label>
                <input
                  type="text"
                  value={editedTitulo}
                  onChange={(e) => setEditedTitulo(e.target.value)}
                  className="w-full px-4 py-2.5 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm mb-2 text-slate-700">Descripción</label>
                <textarea
                  value={editedDescripcion}
                  onChange={(e) => setEditedDescripcion(e.target.value)}
                  className="w-full px-4 py-2.5 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 resize-none"
                  rows={4}
                />
              </div>
            </div>
          ) : (
            <div>
              <h3 className="text-2xl text-slate-900 mb-3">{task.titulo}</h3>
              {task.descripcion && (
                <p className="text-slate-600 whitespace-pre-wrap">{task.descripcion}</p>
              )}
            </div>
          )}

          {/* Properties Grid */}
          <div className="grid grid-cols-2 gap-4">
            {/* Priority */}
            <div className="bg-slate-50 rounded-xl p-4 border border-slate-200">
              <div className="flex items-center gap-2 text-sm text-slate-600 mb-2">
                <Flag className="w-4 h-4" />
                <span>Prioridad</span>
              </div>
              {isEditing ? (
                <select
                  value={editedPrioridad}
                  onChange={(e) => setEditedPrioridad(e.target.value as 'Baja' | 'Media' | 'Alta')}
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 text-sm"
                >
                  <option value="Baja">🟢 Baja</option>
                  <option value="Media">🟡 Media</option>
                  <option value="Alta">🔴 Alta</option>
                </select>
              ) : (
                <span className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm  ${priorityStyle.color} border ${priorityStyle.border}`}>
                  {priorityStyle.icon} {priorityStyle.label}
                </span>
              )}
            </div>

            {/* Estado */}
            <div className="bg-slate-50 rounded-xl p-4 border border-slate-200">
              <div className="flex items-center gap-2 text-sm text-slate-600 mb-2">
                <AlertCircle className="w-4 h-4" />
                <span>Estado</span>
              </div>
              {isEditing ? (
                <select
                  value={editedEstado}
                  onChange={(e) => setEditedEstado(e.target.value as 'Inactivo' | 'Activo')}
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 text-sm"
                >
                  <option value="Inactivo">Inactivo</option>
                  <option value="Activo">Activo</option>
                </select>
              ) : (
                <span className={`inline-flex items-center px-3 py-1.5 rounded-lg text-sm ${estadoStyle.bg} ${estadoStyle.color}`}>
                  {estadoStyle.label}
                </span>
              )}
            </div>

            {/* Assigned To */}
            <div className="bg-slate-50 rounded-xl p-4 border border-slate-200">
              <div className="flex items-center gap-2 text-sm text-slate-600 mb-2">
                <User className="w-4 h-4" />
                <span>Asignado a</span>
              </div>
              {isEditing ? (
                <select
                  value={editedAsignadoA}
                  onChange={(e) => setEditedAsignadoA(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 text-sm"
                >
                  <option value="">Sin asignar</option>
                  {users.map((user) => (
                    <option key={user.usuarioId.id} value={user.usuarioId.id}>
                      {user.usuarioId.nombre}
                    </option>
                  ))}
                </select>
              ) : (
                assignedUser ? (
                  <div className="flex items-center gap-2">
                    <div className="w-7 h-7 rounded-full bg-gradient-to-br from-blue-500 to-indigo-500 flex items-center justify-center text-white text-sm">
                      {assignedUser.usuarioId.id.charAt(0).toUpperCase()}
                    </div>
                    <span className="text-sm text-slate-900">{assignedUser.usuarioId.nombre}</span>
                  </div>
                ) : (
                  <span className="text-sm text-slate-500">Sin asignar</span>
                )
              )}
            </div>

            {/* Due Date */}
            <div className="bg-slate-50 rounded-xl p-4 border border-slate-200">
              <div className="flex items-center gap-2 text-sm text-slate-600 mb-2">
                <Calendar className="w-4 h-4" />
                <span>Fecha límite</span>
              </div>
              {isEditing ? (
                <input
                  type="date"
                  value={editedFechaLimite}
                  onChange={(e) => setEditedFechaLimite(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 text-sm"
                />
              ) : (
                task.fechaLimite ? (
                  <span className="text-sm text-slate-900">
                    {new Date(task.fechaLimite).toLocaleDateString('es-ES', { 
                      day: 'numeric', 
                      month: 'long',
                      year: 'numeric'
                    })}
                  </span>
                ) : (
                  <span className="text-sm text-slate-500">No definida</span>
                )
              )}
            </div>
          </div>

          {/* Timestamps */}
          <div className="grid grid-cols-2 gap-4 pt-4 border-t border-slate-200">
            <div>
              <div className="flex items-center gap-2 text-xs text-slate-500 mb-1">
                <Clock className="w-3 h-3" />
                <span>Fecha de creación</span>
              </div>
              <p className="text-sm text-slate-700">
                {task.fechaLimite.toLocaleDateString('es-ES', { 
                  day: 'numeric', 
                  month: 'long',
                  year: 'numeric',
                  hour: '2-digit',
                  minute: '2-digit'
                })}
              </p>
            </div>
            {task.fechaFinalizacion && (
              <div>
                <div className="flex items-center gap-2 text-xs text-slate-500 mb-1">
                  <Check className="w-3 h-3" />
                  <span>Fecha de finalización</span>
                </div>
                <p className="text-sm text-slate-700">
                  {task.fechaFinalizacion.toLocaleDateString('es-ES', { 
                    day: 'numeric', 
                    month: 'long',
                    year: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit'
                  })}
                </p>
              </div>
            )}
          </div>

          {/* Edit Actions */}
          {isEditing && (
            <div className="flex gap-3 pt-4">
              <button
                onClick={() => {
                  setIsEditing(false);
                  setEditedTitulo(task.titulo);
                  setEditedDescripcion(task.descripcion);
                  setEditedPrioridad(task.prioridad);
                  setEditedEstado(task.estado);
                  setEditedAsignadoA(task.asignadoA || '');
                  setEditedFechaLimite(task.fechaLimite ? new Date(task.fechaLimite).toISOString().split('T')[0] : '');
                }}
                className="flex-1 px-4 py-2.5 border border-slate-300 text-slate-700 rounded-xl hover:bg-slate-50 transition-all"
              >
                Cancelar
              </button>
              <button
                /* onClick={handleSaveEdit} */
                className="flex-1 px-4 py-2.5 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-all flex items-center justify-center gap-2"
              >
                <Check className="w-4 h-4" />
                Guardar Cambios
              </button>
            </div>
          )}

          {/* Comments Section */}
          <div className="pt-4 border-t border-slate-200 space-y-4">
            <div className="flex items-center gap-2 mb-4">
              <MessageSquare className="w-5 h-5 text-blue-600" />
              <h3 className="text-base text-slate-900">Comentarios</h3>
              <span className="px-2 py-0.5 bg-blue-50 text-blue-600 rounded-full text-xs">
                {comments.length}
              </span>
            </div>

            {/* Existing Comments */}
            {comments.length > 0 && (
              <div className="space-y-3 mb-4">
                {comments.map((comment) => {
                  const commentUser = users.find(u => u.usuarioId.id === comment.usuario.id);
                  return (
                    <motion.div
                      key={comment.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="bg-slate-50 rounded-xl p-4 border border-slate-200"
                    >
                      <div className="flex items-start gap-3">
                        <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-500 to-indigo-500 flex items-center justify-center text-white text-sm flex-shrink-0">
                          {commentUser?.usuarioId.nombre.charAt(0).toUpperCase() || 'U'}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-1">
                            <span className="text-sm text-slate-900">{commentUser?.usuarioId.nombre || 'Usuario'}</span>
                            {/* <span className="text-xs text-slate-500">
                              {comment.fechaCreacion.toLocaleDateString('es-ES', { 
                                day: 'numeric', 
                                month: 'short',
                                hour: '2-digit',
                                minute: '2-digit'
                              })}
                            </span> */}
                          </div>
                          {comment.mensaje && (
                            <p className="text-sm text-slate-600 whitespace-pre-wrap">{comment.mensaje}</p>
                          )}
                          
                          {/* Comment Attachments */}
                          {comment.archivos && comment.archivos.length > 0 && (
                            <div className="mt-3 space-y-2">
                              {comment.archivos.map((attachment) => (
                                <div
                                  key={attachment.id}
                                  className="flex items-center gap-2 bg-white rounded-lg p-2 border border-slate-200 hover:border-blue-300 transition-all group"
                                >
                                  {/* <div className="flex items-center justify-center w-8 h-8 bg-blue-50 rounded-lg">
                                    {getFileIcon(attachment.url)}
                                  </div> */}
                                  <div className="flex-1 min-w-0">
                                    <p className="text-sm text-slate-900 truncate">{attachment.nombre}</p>
                                    {/* <p className="text-xs text-slate-500">{formatFileSize(attachment.)}</p> */}
                                  </div>
                                  <a
                                    href={attachment.url}
                                    download={attachment.nombre}
                                    className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-all opacity-0 group-hover:opacity-100"
                                    title="Descargar"
                                  >
                                    <Download className="w-4 h-4" />
                                  </a>
                                </div>
                              ))}
                            </div>
                          )}
                        </div>
                      </div>
                    </motion.div>
                  );
                })}
              </div>
            )}

            {/* New Comment Input */}
            <div className="space-y-3">
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-500 to-indigo-500 flex items-center justify-center text-white text-sm flex-shrink-0">
                  {currentUser.charAt(0).toUpperCase()}
                </div>
                <div className="flex-1">
                  <textarea
                    value={newComment}
                    onChange={(e) => setNewComment(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' && (e.metaKey || e.ctrlKey)) {
                        handleAddComment();
                      }
                    }}
                    className="w-full px-4 py-2.5 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 resize-none text-sm"
                    placeholder="Escribe un comentario... (Ctrl/Cmd + Enter para enviar)"
                    rows={3}
                  />
                  
                  {/* Pending Attachments */}
                  {attachments.length > 0 && (
                    <div className="mt-2 space-y-2">
                      {attachments.map((attachment) => (
                        <div
                          key={attachment.name}
                          className="flex items-center gap-2 bg-blue-50 rounded-lg p-2 border border-blue-200"
                        >
                          <div className="flex items-center justify-center w-8 h-8 bg-blue-100 rounded-lg">
                            {/* {getFileIcon(attachment.tipo)} */}
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="text-sm text-slate-900 truncate">{attachment.name}</p>
                            <p className="text-xs text-slate-500">{formatFileSize(attachment.size)}</p>
                          </div>
                          <button
                            /* onClick={() => handleRemoveAttachment(attachment.id)} */
                            className="p-1.5 text-red-600 hover:bg-red-50 rounded-lg transition-all"
                            title="Eliminar"
                          >
                            <X className="w-4 h-4" />
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                  
                  {/* Actions */}
                  <div className="flex items-center justify-between mt-3">
                    <div className="flex items-center gap-2">
                      <input
                        type="file"
                        multiple
                        onChange={handleFileAttachment}
                        className="hidden"
                        id="commentFileInput"
                        accept="image/*,.pdf,.doc,.docx,.txt"
                      />
                      <label
                        htmlFor="commentFileInput"
                        className="flex items-center gap-2 px-3 py-2 text-sm text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-lg cursor-pointer transition-all"
                      >
                        <Paperclip className="w-4 h-4" />
                        <span>Adjuntar archivo</span>
                      </label>
                      {isUploadingFiles && (
                        <span className="text-xs text-slate-500">Cargando...</span>
                      )}
                    </div>
                    <button
                      onClick={handleAddComment}
                      disabled={!newComment.trim() && attachments.length === 0}
                      className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed text-sm"
                    >
                      <Send className="w-4 h-4" />
                      <span>Comentar</span>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
}