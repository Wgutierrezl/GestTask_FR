import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Plus, LogOut, Boxes, LayoutGrid, Users, Sparkles, Archive } from 'lucide-react';
import type { Board, BoardMember, User } from '../App';
import { BoardView } from './BoardView';
import { CreateBoardModal } from './CreateBoardModal';
import type { UserInfo } from '../functions/models/UserInfoDTO';
import { GetMyBoards } from '../functions/board_functions/board.functions';
import { GetProfile } from '../functions/user_functions/user';
import type { BoardInfoDTO } from '../functions/models/Board_model';
import Swal from 'sweetalert2';

type DashboardProps = {  
  onLogout: () => void;
};

export function Dashboard({ onLogout }: DashboardProps) {
  const [boards, setBoards] = useState<BoardInfoDTO[]>();
  const [user, setUser] = useState<UserInfo | null>(null);
  const [selectedBoard, setSelectedBoard] = useState<BoardInfoDTO | undefined>();
  const [showCreateModal, setShowCreateModal] = useState(false);

  useEffect(()=> {
    const fetchData=async()=>{
      try{
        const [userProfile,boardRes] = await Promise.all([
          GetProfile(),
          GetMyBoards()
        ]);

        setUser(userProfile || null);

        if(!boardRes){
          setBoards([]);
          return [];
        }

        if(!boardRes || boardRes.length===0){
          Swal.fire('Informacion','Aun no tienes tableros creados','info');
          setBoards([]);
          return ;

        }

        setBoards(boardRes);

      }catch(error:any){
        Swal.fire('Error',`ha ocurrido un error inesperado ${error}`);
        setBoards([]);
        return [];
      }
    }

    fetchData();
  },[]);


  const handleDeleteBoard = (boardId: string) => {
      /* setSelectedBoard(board); */
    setBoards(prev =>
      prev ? prev.filter(board => board.id !== boardId) : []
    );
  };

  const handleUpdateBoard = (board: BoardInfoDTO) => {
    setSelectedBoard(board);
  };

  const handleBoardCreated = (newBoard: BoardInfoDTO) => {
    setBoards(prev => prev ? [newBoard, ...prev] : [newBoard]);
  };

  if (selectedBoard) {
    return (
      <BoardView
        board={selectedBoard}
        user={user}
        onBack={() => setSelectedBoard(undefined)}
        onDeleteboard={handleDeleteBoard}
      />
    );
  }

  const activeBoards = boards?.filter(b => b.estado === 'activo');

  return (
    <div className="min-h-screen bg-[#fafafa]">
      {/* Header */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-20 backdrop-blur-sm bg-white/90">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="flex items-center justify-center w-10 h-10 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-xl shadow-lg shadow-blue-500/30">
                <Boxes className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-lg bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                  GestTask
                </h1>
                {/* <p className="text-xs text-slate-500">Hola, {user.nombre}</p> */}
              </div>
            </div>
            <button
              onClick={onLogout}
              className="flex items-center gap-2 px-4 py-2 text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-xl transition-all"
            >
              <LogOut className="w-4 h-4" />
              <span className="text-sm">Salir</span>
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Hero Section */}
        <div className="mb-12">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex items-start justify-between"
          >
            <div>
              <div className="flex items-center gap-3 mb-3">
                <Sparkles className="w-6 h-6 text-blue-600" />
                <h2 className="text-3xl text-slate-900">Mis Tableros</h2>
              </div>
              <p className="text-slate-600">
                Organiza tus proyectos con tableros, pipelines y etapas personalizables
              </p>
              <div className="flex items-center gap-4 mt-4 text-sm text-slate-500">
                <div className="flex items-center gap-2">
                  <LayoutGrid className="w-4 h-4" />
                  <span>{activeBoards?.length} tableros activos</span>
                </div>
              </div>
            </div>
            <button
              onClick={() => setShowCreateModal(true)}
              className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-xl hover:from-blue-700 hover:to-indigo-700 transition-all shadow-lg shadow-blue-500/30 hover:shadow-xl hover:shadow-blue-500/40"
            >
              <Plus className="w-5 h-5" />
              Crear Tablero
            </button>
          </motion.div>
        </div>

        {/* Boards Grid */}
        {activeBoards?.length === 0 ? (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center py-20"
          >
            <div className="inline-flex items-center justify-center w-20 h-20 bg-slate-100 rounded-2xl mb-6">
              <LayoutGrid className="w-10 h-10 text-slate-400" />
            </div>
            <h3 className="text-xl text-slate-900 mb-2">No tienes tableros aún</h3>
            <p className="text-slate-500 mb-8 max-w-md mx-auto">
              Crea tu primer tablero para comenzar a organizar proyectos con pipelines y etapas
            </p>
            <button
              onClick={() => setShowCreateModal(true)}
              className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-xl hover:from-blue-700 hover:to-indigo-700 transition-all shadow-lg shadow-blue-500/30"
            >
              <Plus className="w-5 h-5" />
              Crear Primer Tablero
            </button>
          </motion.div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            <AnimatePresence>
              {activeBoards?.map((board, index) => {
                return (
                  <motion.div
                    key={board.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.9 }}
                    transition={{ delay: index * 0.05 }}
                    onClick={() => setSelectedBoard(board)}
                    className="bg-white rounded-2xl p-6 border border-slate-200 hover:border-blue-300 hover:shadow-lg hover:shadow-blue-500/10 cursor-pointer transition-all group"
                  >
                    {/* Header */}
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex items-center justify-center w-12 h-12 bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl group-hover:from-blue-100 group-hover:to-indigo-100 transition-all">
                        <LayoutGrid className="w-6 h-6 text-blue-600" />
                      </div>
                      <div className={`px-2.5 py-1 rounded-lg text-xs ${
                        board.estado === 'activo' 
                          ? 'bg-green-50 text-green-700 border border-green-200' 
                          : 'bg-slate-100 text-slate-600 border border-slate-200'
                      }`}>
                        {board.estado === 'activo' ? 'Activo' : 'Archivado'}
                      </div>
                    </div>

                    {/* Content */}
                    <h3 className="text-lg text-slate-900 mb-2 group-hover:text-blue-600 transition-colors line-clamp-2">
                      {board.nombre}
                    </h3>
                    <p className="text-sm text-slate-500 mb-4 line-clamp-2 min-h-[2.5rem]">
                      {board.descripcion}
                    </p>

                    {/* Footer */}
                    <div className="flex items-center justify-between pt-4 border-t border-slate-100">
                      <div className="flex items-center gap-2">  
                      </div>
                      <span className="text-xs text-slate-400">
                        {board.fechaCreacion.toLocaleDateString('es-ES', { day: 'numeric', month: 'short' })}
                      </span>
                    </div>
                  </motion.div>
                );
              })}
            </AnimatePresence>
          </div>
        )}
      </div>

      {/* Create Board Modal */}
      {showCreateModal && (
        <CreateBoardModal
          onClose={() => setShowCreateModal(false)}
          onCreate={handleBoardCreated}
        />
      )}
    </div>
  );
}