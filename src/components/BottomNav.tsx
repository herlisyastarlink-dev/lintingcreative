import * as React from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';
import { useStore } from '@/store';
import {
  UploadCloud,
  LayoutDashboard,
  Printer,
  Ticket,
  UserCircle2,
} from 'lucide-react';

export function BottomNav() {
  const { currentUser } = useStore();
  const location = useLocation();

  if (!currentUser) return null;

  const operatorLinks = [
    { to: '/operator/import', icon: UploadCloud, label: 'Import' },
    { to: '/operator', icon: LayoutDashboard, label: 'Beranda' },
    { to: '/operator/print', icon: Printer, label: 'Print' },
  ];

  const resellerLinks = [
    { to: '/reseller/cetak', icon: Ticket, label: 'Cetak' },
    { to: '/reseller', icon: LayoutDashboard, label: 'Beranda' },
    { to: '/reseller/pengaturan', icon: UserCircle2, label: 'Profil' },
  ];

  const links = currentUser.role === 'operator' ? operatorLinks : resellerLinks;

  return (
    <div className="fixed bottom-6 left-1/2 z-50 w-full max-w-[20rem] -translate-x-1/2 px-4">
      <nav className="relative flex items-center justify-between rounded-3xl bg-slate-900/90 p-2 shadow-2xl shadow-blue-900/40 backdrop-blur-xl border border-white/10 ring-1 ring-white/5">
        {links.map((link) => {
          const isActive = location.pathname === link.to || (link.to !== '/operator' && link.to !== '/reseller' && location.pathname.startsWith(link.to));
          
          return (
            <NavLink
              key={link.to}
              to={link.to}
              end={link.to === '/operator' || link.to === '/reseller'}
              className={({ isActive }) =>
                cn(
                  'relative flex flex-1 flex-col items-center justify-center py-3 transition-all duration-300 rounded-2xl',
                  'group hover:bg-white/5'
                )
              }
            >
              {({ isActive }) => (
                <>
                  {isActive && (
                    <motion.div
                      layoutId="bottom-nav-active"
                      className="absolute inset-0 rounded-2xl bg-gradient-to-br from-blue-600 to-purple-600 shadow-lg shadow-blue-600/30"
                      transition={{ type: 'spring', bounce: 0.15, duration: 0.5 }}
                    />
                  )}
                  
                  <div className="relative z-10 flex flex-col items-center gap-1">
                      <link.icon
                        className={cn(
                          'h-5 w-5 transition-all duration-300',
                          isActive ? 'text-white scale-110' : 'text-slate-400 group-hover:text-slate-200'
                        )}
                        strokeWidth={isActive ? 2.5 : 2}
                      />
                      <span className={cn(
                          "text-[10px] font-bold tracking-wider uppercase transition-all duration-300",
                          isActive ? "text-white translate-y-0" : "text-slate-500 group-hover:text-slate-300"
                      )}>
                          {link.label}
                      </span>
                  </div>
                </>
              )}
            </NavLink>
          );
        })}
      </nav>
    </div>
  );
}
