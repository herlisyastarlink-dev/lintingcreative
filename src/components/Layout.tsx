import { Outlet } from 'react-router-dom';
import { Header } from '@/components/Header';
import { BottomNav } from '@/components/BottomNav';

export function Layout() {
  return (
    <div className="min-h-screen bg-slate-50 pb-32 relative overflow-hidden">
      {/* Modern Background Elements */}
      <div className="fixed inset-0 z-0 pointer-events-none">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50"></div>
        <div className="absolute top-[-10%] right-[-5%] w-96 h-96 bg-blue-400/20 rounded-full blur-3xl opacity-50"></div>
        <div className="absolute bottom-[-10%] left-[-5%] w-96 h-96 bg-purple-400/20 rounded-full blur-3xl opacity-50"></div>
      </div>

      <div className="relative z-10">
        <Header />
        <main className="mx-auto max-w-md p-4 sm:p-6">
          <Outlet />
        </main>
        <BottomNav />
      </div>
    </div>
  );
}
