import { useState } from 'react';
import { LoginPage } from './components/LoginPage';
import { RegisterPage } from './components/RegisterPage';
import { Dashboard } from './components/Dashboard';
import type { UserInfo } from './functions/models/UserInfoDTO';
import type { SessionDTO } from './functions/models/LoginDTO';

export type User = {
  id: string;
  nombre: string;
  correo: string;
  edad: number;
  rol: 'admin' | 'miembro' | 'invitado';
  fechaRegistro: Date;
};


export type BoardMember = {
  userId: string;
  role: 'owner' | 'miembro' | 'invitado';
  addedAt: Date;
};

export type Stage = {
  id: string;
  nombre: string;
  orden: number;
};

export type CommentAttachment = {
  id: string;
  nombre: string;
  url: string;
  tipo: string;
  tamaño: number;
};

export type Comment = {
  id: string;
  taskId: string;
  userId: string;
  texto: string;
  adjuntos: CommentAttachment[];
  fechaCreacion: Date;
};

export type Task = {
  id: string;
  titulo: string;
  descripcion: string;
  pipelineId: string;
  etapaId: string;
  tableroId: string;
  asignadoA?: string;
  prioridad: 'baja' | 'media' | 'alta';
  estado: 'pendiente' | 'en_progreso' | 'completada';
  fechaLimite?: Date;
  fechaFinalizacion?: Date;
  fechaCreacion: Date;
  comentarios: Comment[];
};

export type Pipeline = {
  id: string;
  nombre: string;
  descripcion: string;
  tableroId: string;
  ownerId: string;
  etapas: Stage[];
  estado: 'activo' | 'archivado';
  fechaCreacion: Date;
};

export type Board = {
  id: string;
  nombre: string;
  descripcion: string;
  ownerId: string;
  miembros: BoardMember[];
  estado: 'activo' | 'archivado';
  fechaCreacion: Date;
};

type Page = 'login' | 'register' | 'dashboard';

export default function App() {
  const [currentPage, setCurrentPage] = useState<Page>('login');
  const [currentUser, setCurrentUser] = useState<SessionDTO | null>(null);


  const handleLogout = () => {
    setCurrentUser(null);
    setCurrentPage('login');
  };

  const handleLoginSuccess = (user: SessionDTO) => {
    setCurrentUser(user);
    setCurrentPage('dashboard');
  };

  const handleRegisterSuccess = () => {
    // Puedes mostrar un Swal aquí si quieres
    setCurrentPage('login');
  };

  return (
    <div className="min-h-screen bg-[#fafafa]">
      {currentPage === 'login' && (
        <LoginPage 
          onLogin={handleLoginSuccess}
          onNavigateToRegister={() => setCurrentPage('register')}
        />
      )}
      {currentPage === 'register' && (
        <RegisterPage
          onRegister={handleRegisterSuccess}
          onNavigateToLogin={() => setCurrentPage('login')}
        />
      )}
      {currentPage === 'dashboard' && currentUser && (
        <Dashboard 
          onLogout={handleLogout}
        />
      )}
    </div>
  );
}