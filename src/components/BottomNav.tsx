import * as React from 'react';
import { NavLink } from 'react-router-dom';
import { motion } from 'motion/react';
import { cn } from '@/lib/utils';
import { useStore } from '@/store';
import {
  UploadCloud,
  LayoutDashboard,
  Printer,
  FileText,
  Ticket,
  UserCircle2,
} from 'lucide-react';

export function BottomNav() {
  const { currentUser } = useStore();

  if (!currentUser) return null;

  const operatorLinks = [
    { to: '/operator/import', icon: UploadCloud, label: 'Import' },
    { to: '/operator', icon: LayoutDashboard, label: 'Dashboard' },
    { to: '/operator/print', icon: Printer, label: 'Print' },
  ];

  const resellerLinks = [
    { to: '/reseller/cetak', icon: Ticket, label: 'Cetak' },
    { to: '/reseller', icon: LayoutDashboard, label: 'Dashboard' },
    { to: '/reseller/pengaturan', icon: UserCircle2, label: 'Profil' },
  ];

  const links = currentUser.role === 'operator' ? operatorLinks : resellerLinks;

  return (
    <div className="fixed bottom-6 left-1/2 z-50 w-full max-w-sm -translate-x-1/2 px-4">
      <nav className="flex items-center justify-around rounded-3xl border border-white/20 bg-white/80 p-2 shadow-xl shadow-blue-900/10 backdrop-blur-xl">
        {links.map((link) => (
          <NavLink
            key={link.to}
            to={link.to}
            end={link.to === '/operator' || link.to === '/reseller'}
            className={({ isActive }) =>
              cn(
                'relative flex flex-col items-center justify-center rounded-2xl p-3 text-xs font-medium transition-colors',
                isActive ? 'text-blue-600' : 'text-slate-500 hover:text-slate-900 hover:bg-slate-100/50'
              )
            }
          >
            {({ isActive }) => (
              <>
                {isActive && (
                  <motion.div
                    layoutId="bottom-nav-active"
                    className="absolute inset-0 rounded-2xl bg-blue-50/80 shadow-inner shadow-blue-500/10"
                    transition={{ type: 'spring', bounce: 0.2, duration: 0.6 }}
                  />
                )}
                <link.icon
                  className={cn('relative z-10 mb-1 h-6 w-6', isActive && 'drop-shadow-sm')}
                  strokeWidth={isActive ? 2.5 : 2}
                />
                <span className="relative z-10">{link.label}</span>
              </>
            )}
          </NavLink>
        ))}
      </nav>
    </div>
  );
}
