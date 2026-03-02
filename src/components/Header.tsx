import * as React from 'react';
import { useStore } from '@/store';
import { LogOut, User as UserIcon, Zap, UserCircle2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';

export function Header() {
  const { currentUser, logout, settings } = useStore();
  const navigate = useNavigate();
  const [isMenuOpen, setIsMenuOpen] = React.useState(false);

  if (!currentUser) return null;

  return (
    <header className="sticky top-0 z-40 w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg shadow-blue-900/20">
      <div className="flex h-16 items-center justify-between px-4 sm:px-6 max-w-md mx-auto">
        <div className="flex items-center gap-3">
          {currentUser.role === 'reseller' && currentUser.logoUrl ? (
            <img src={currentUser.logoUrl} alt="Logo" className="h-10 w-auto object-contain" />
          ) : settings?.logoUrl ? (
            <img src={settings.logoUrl} alt="App Logo" className="h-10 w-auto object-contain" />
          ) : (
            <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-white/20 text-white shadow-sm backdrop-blur-sm">
              <Zap className="h-5 w-5" />
            </div>
          )}
          <div className="flex flex-col">
            <span className="font-bold text-white tracking-tight leading-tight">
              {currentUser.role === 'reseller' && currentUser.wifiName ? currentUser.wifiName : (settings?.businessName || 'LINTING CREATIVE')}
            </span>
            <span className="text-[10px] font-medium text-blue-100 uppercase tracking-wider">
              {currentUser.role === 'operator' ? 'Operator Panel' : 'Reseller Panel'}
            </span>
          </div>
        </div>

        <div className="relative">
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="flex h-10 w-10 items-center justify-center rounded-full bg-white/20 border-2 border-white/30 shadow-sm hover:bg-white/30 transition-all focus:outline-none overflow-hidden backdrop-blur-sm"
          >
            {currentUser.photoUrl ? (
              <img src={currentUser.photoUrl} alt={currentUser.name} className="h-full w-full object-cover" />
            ) : (
              <UserIcon className="h-5 w-5 text-white" />
            )}
          </button>

          <AnimatePresence>
            {isMenuOpen && (
              <div className="absolute right-0 top-12 z-50">
                <div
                  className="fixed inset-0 z-40"
                  onClick={() => setIsMenuOpen(false)}
                />
                <motion.div
                  initial={{ opacity: 0, scale: 0.95, y: 10 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95, y: 10 }}
                  className="relative z-50 mt-2 w-56 origin-top-right rounded-2xl bg-white/90 backdrop-blur-xl p-2 shadow-xl border border-white/20 ring-1 ring-black/5"
                >
                  <div className="px-3 py-2 border-b border-slate-100 mb-2">
                    <p className="text-sm font-medium text-slate-900 truncate">{currentUser.name}</p>
                    <p className="text-xs text-slate-500 truncate">@{currentUser.username}</p>
                    <span className="mt-1 inline-flex items-center rounded-full bg-blue-50 px-2 py-0.5 text-xs font-medium text-blue-700 ring-1 ring-inset ring-blue-700/10 capitalize">
                      {currentUser.role}
                    </span>
                  </div>
                  
                  <button
                    className="flex w-full items-center gap-2 rounded-xl px-3 py-2 text-sm text-slate-700 hover:bg-slate-100 transition-colors"
                    onClick={() => {
                      setIsMenuOpen(false);
                      navigate(`/${currentUser.role}/pengaturan`);
                    }}
                  >
                    <UserCircle2 className="h-4 w-4" />
                    Profil
                  </button>

                  <button
                    className="flex w-full items-center gap-2 rounded-xl px-3 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors mt-1"
                    onClick={() => {
                      setIsMenuOpen(false);
                      logout();
                      navigate('/login');
                    }}
                  >
                    <LogOut className="h-4 w-4" />
                    Keluar
                  </button>
                </motion.div>
              </div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </header>
  );
}
