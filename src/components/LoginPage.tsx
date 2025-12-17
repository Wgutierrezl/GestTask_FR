import { useState } from 'react';
import { motion } from 'motion/react';
import { Boxes, Mail, Lock, ArrowRight } from 'lucide-react';
import { LogUser } from '../functions/user_functions/user';
import Swal from 'sweetalert2';
import type { SessionDTO } from '../functions/models/LoginDTO';

type LoginPageProps = {
  onLogin: (session:SessionDTO) => void;
  onNavigateToRegister: () => void;
};

export function LoginPage({ onLogin ,onNavigateToRegister }: LoginPageProps) {
  const [correo, setCorreo] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try{
      const session=await LogUser({email:correo,password:password})
      if(!session){
        Swal.fire('error','usuario o contraseña incorrecta','error');
        return ;
      }

      localStorage.setItem('userId',session.userId);
      localStorage.setItem('rol',session.rol);
      localStorage.setItem('token',session.token);
      localStorage.setItem('nombre',session.nombre);

      Swal.fire('Informacion','te has logeado correctamente','info');

      onLogin(session);

    }catch(error:any){
      Swal.fire('error',`ha ocurrido un error inesperado ${error}`);

    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      <div className="absolute inset-0 bg-grid-slate-200 [mask-image:linear-gradient(0deg,white,rgba(255,255,255,0.6))] pointer-events-none"></div>
      
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="w-full max-w-md relative z-10"
      >
        {/* Logo & Brand */}
        <div className="text-center mb-10">
          <motion.div
            initial={{ scale: 0, rotate: -180 }}
            animate={{ scale: 1, rotate: 0 }}
            transition={{ delay: 0.2, type: "spring", stiffness: 200, damping: 15 }}
            className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-2xl mb-5 shadow-lg shadow-blue-500/30"
          >
            <Boxes className="w-8 h-8 text-white" />
          </motion.div>
          <motion.h1 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="text-4xl mb-2 bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 bg-clip-text text-transparent tracking-tight"
          >
            GestTask
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="text-slate-600"
          >
            Gestiona proyectos con tableros y pipelines
          </motion.p>
        </div>

        {/* Login Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-white/80 backdrop-blur-xl rounded-3xl shadow-2xl shadow-slate-200/50 p-8 border border-slate-200/50"
        >
          <h2 className="text-2xl mb-6 text-slate-900">Iniciar Sesión</h2>
          
          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-sm mb-2 text-slate-700">Correo electrónico</label>
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                <input
                  type="email"
                  value={correo}
                  onChange={(e) => setCorreo(e.target.value)}
                  className="w-full pl-12 pr-4 py-3.5 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all bg-white"
                  placeholder="tu@email.com"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-sm mb-2 text-slate-700">Contraseña</label>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-12 pr-4 py-3.5 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all bg-white"
                  placeholder="••••••••"
                  required
                />
              </div>
            </div>

            <button
              type="submit"
              className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white py-3.5 rounded-xl hover:from-blue-700 hover:to-indigo-700 transition-all shadow-lg shadow-blue-500/30 hover:shadow-xl hover:shadow-blue-500/40 flex items-center justify-center gap-2 group"
            >
              Ingresar
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-slate-600 text-sm">
              ¿No tienes cuenta?{' '}
              <button
                onClick={onNavigateToRegister}
                className="text-blue-600 hover:text-blue-700 font-medium"
              >
                Regístrate gratis
              </button>
            </p>
          </div>

          {/* <div className="mt-6 pt-6 border-t border-slate-100">
            <div className="bg-blue-50 rounded-xl p-4">
              <p className="text-sm text-slate-600 mb-2">💡 Prueba la demo:</p>
              <p className="text-xs font-mono bg-white px-3 py-2 rounded-lg text-slate-700 border border-slate-200">
                demo@gesttask.com
              </p>
            </div>
          </div> */}
        </motion.div>

        {/* Footer */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
          className="text-center text-slate-500 text-sm mt-8"
        >
          Organiza • Colabora • Entrega
        </motion.p>
      </motion.div>
    </div>
  );
}
