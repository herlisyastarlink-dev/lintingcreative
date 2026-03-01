import * as React from 'react';
import { useStore } from '@/store';
import { LogOut, User as UserIcon, Settings, Zap, UserCircle2 } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { useNavigate } from 'react-router-dom';

export function Header() {
  const { currentUser, logout, settings } = useStore();
  const navigate = useNavigate();
  const [isMenuOpen, setIsMenuOpen] = React.useState(false);

  if (!currentUser) return null;

  return (
    <header className="sticky top-0 z-40 w-full border-b border-white/20 bg-white/60 backdrop-blur-xl shadow-sm">
      <div className="flex h-16 items-center justify-between px-4 sm:px-6">
        <div className="flex items-center gap-2">
          {currentUser.role === 'reseller' && currentUser.logoUrl ? (
            <img src={currentUser.logoUrl} alt="Logo" className="h-8 w-8 rounded-xl object-cover shadow-sm" />
          ) : (
            <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-gradient-to-br from-blue-500 to-blue-600 text-white shadow-sm shadow-blue-500/30">
              <Zap className="h-4 w-4" />
            </div>
          )}
          <span className="font-semibold text-slate-800 tracking-tight">
            {currentUser.role === 'reseller' && currentUser.wifiName ? currentUser.wifiName : (settings.businessName || 'LINTING CREATIVE')}
          </span>
        </div>

        <div className="relative">
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="flex h-10 w-10 items-center justify-center rounded-full bg-slate-100 border-2 border-white shadow-sm hover:ring-2 hover:ring-blue-500/50 transition-all focus:outline-none overflow-hidden"
          >
            {currentUser.photoUrl ? (
              <img src={currentUser.photoUrl} alt={currentUser.name} className="h-full w-full object-cover" />
            ) : (
              <UserIcon className="h-5 w-5 text-slate-600" />
            )}
          </button>

          <AnimatePresence>
            {isMenuOpen && (
              <>
                <div
                  className="fixed inset-0 z-40"
                  onClick={() => setIsMenuOpen(false)}
                />
                <motion.div
                  initial={{ opacity: 0, scale: 0.95, y: 10 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95, y: 10 }}
                  className="absolute right-0 top-12 z-50 mt-2 w-56 origin-top-right rounded-2xl bg-white/90 backdrop-blur-xl p-2 shadow-xl border border-white/20 ring-1 ring-black/5"
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
              </>
            )}
          </AnimatePresence>
        </div>
      </div>
    </header>
  );
}
