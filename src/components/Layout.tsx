import { Outlet } from 'react-router-dom';
import { Header } from '@/components/Header';
import { BottomNav } from '@/components/BottomNav';

export function Layout() {
  return (
    <div className="min-h-screen bg-slate-50/50 pb-32">
      <Header />
      <main className="mx-auto max-w-md p-4 sm:p-6">
        <Outlet />
      </main>
      <BottomNav />
    </div>
  );
}
