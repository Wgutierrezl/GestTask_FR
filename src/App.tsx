import { useState } from 'react';
import { LoginPage } from './components/LoginPage';
import { RegisterPage } from './components/RegisterPage';
import { Dashboard } from './components/Dashboard';

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
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [users, setUsers] = useState<User[]>([
    { 
      id: '1', 
      correo: 'demo@gesttask.com', 
      nombre: 'Ana García',
      edad: 28,
      rol: 'admin',
      fechaRegistro: new Date('2024-01-15')
    },
    { 
      id: '2', 
      correo: 'carlos@gesttask.com', 
      nombre: 'Carlos Méndez',
      edad: 32,
      rol: 'miembro',
      fechaRegistro: new Date('2024-02-20')
    },
    { 
      id: '3', 
      correo: 'laura@gesttask.com', 
      nombre: 'Laura Martínez',
      edad: 26,
      rol: 'miembro',
      fechaRegistro: new Date('2024-03-10')
    }
  ]);

  const handleLogin = (correo: string, password: string) => {
    const user = users.find(u => u.correo === correo);
    if (user) {
      setCurrentUser(user);
      setCurrentPage('dashboard');
    } else {
      alert('Usuario no encontrado. Intenta con demo@gesttask.com');
    }
  };

  const handleRegister = (correo: string, password: string, nombre: string, edad: number, rol: 'admin' | 'miembro' | 'invitado') => {
    const newUser: User = {
      id: Date.now().toString(),
      correo,
      nombre,
      edad,
      rol,
      fechaRegistro: new Date()
    };
    setUsers([...users, newUser]);
    setCurrentUser(newUser);
    setCurrentPage('dashboard');
  };

  const handleLogout = () => {
    setCurrentUser(null);
    setCurrentPage('login');
  };

  return (
    <div className="min-h-screen bg-[#fafafa]">
      {currentPage === 'login' && (
        <LoginPage 
          onLogin={handleLogin}
          onNavigateToRegister={() => setCurrentPage('register')}
        />
      )}
      {currentPage === 'register' && (
        <RegisterPage 
          onRegister={handleRegister}
          onNavigateToLogin={() => setCurrentPage('login')}
        />
      )}
      {currentPage === 'dashboard' && currentUser && (
        <Dashboard 
          user={currentUser}
          users={users}
          onLogout={handleLogout}
        />
      )}
    </div>
  );
}