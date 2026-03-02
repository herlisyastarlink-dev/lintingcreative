import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Card, CardContent } from '@/components/Card';
import { useStore } from '@/store';
import {
  Ticket,
  Users,
  Settings,
  Printer,
  TrendingUp,
  CreditCard,
} from 'lucide-react';

export function OperatorDashboard() {
  const { vouchers, users, transactions } = useStore();

  const totalVouchers = vouchers.length;
  const availableVouchers = vouchers.filter((v) => v.status === 'available').length;
  const totalResellers = users.filter((u) => u.role === 'reseller').length;
  const totalOmzet = transactions.reduce((sum, t) => sum + t.totalAmount, 0);

  const menuItems = [
    {
      title: 'Data Voucher',
      icon: Ticket,
      to: '/operator/voucher',
      color: 'text-blue-600',
      bg: 'bg-blue-100',
    },
    {
      title: 'Kelola Reseller',
      icon: Users,
      to: '/operator/reseller',
      color: 'text-pink-600',
      bg: 'bg-pink-100',
    },
    {
      title: 'Management Cetak',
      icon: Printer,
      to: '/operator/cetak',
      color: 'text-emerald-600',
      bg: 'bg-emerald-100',
    },
    {
      title: 'Request Voucher',
      icon: Ticket,
      to: '/operator/request',
      color: 'text-purple-600',
      bg: 'bg-purple-100',
    },
    {
      title: 'Pengaturan',
      icon: Settings,
      to: '/operator/pengaturan',
      color: 'text-amber-600',
      bg: 'bg-amber-100',
    },
  ];

  return (
    <div className="space-y-6">
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="grid grid-cols-2 gap-4"
      >
        <Card className="bg-slate-900/90 backdrop-blur-xl text-white border-none shadow-xl shadow-slate-900/20">
          <CardContent className="p-5 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-20 h-20 bg-white/10 rounded-bl-full -mr-4 -mt-4"></div>
            <div className="flex items-center gap-2 text-slate-400 mb-3 relative z-10">
              <TrendingUp className="h-4 w-4" />
              <span className="text-[10px] font-bold uppercase tracking-widest">Total Omzet</span>
            </div>
            <div className="text-2xl font-extrabold tracking-tight relative z-10">
              Rp {totalOmzet.toLocaleString('id-ID')}
            </div>
          </CardContent>
        </Card>

        <Card className="bg-white/80 backdrop-blur-xl border-white/50 shadow-lg shadow-slate-200/50">
          <CardContent className="p-5 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-20 h-20 bg-blue-50 rounded-bl-full -mr-4 -mt-4"></div>
            <div className="flex items-center gap-2 text-slate-400 mb-3 relative z-10">
              <CreditCard className="h-4 w-4" />
              <span className="text-[10px] font-bold uppercase tracking-widest">Voucher Aktif</span>
            </div>
            <div className="text-2xl font-extrabold tracking-tight text-slate-900 relative z-10">
              {availableVouchers} <span className="text-sm font-medium text-slate-400">/ {totalVouchers}</span>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
      >
        <h2 className="text-lg font-bold text-slate-900 mb-4 px-1 flex items-center gap-2">
          <div className="w-1 h-6 bg-blue-600 rounded-full"></div>
          Menu Utama
        </h2>
        <div className="grid grid-cols-2 gap-4">
          {menuItems.map((item, index) => (
            <Link key={item.title} to={item.to}>
              <Card hoverable className="h-full bg-white/80 backdrop-blur-xl border-white/50 shadow-sm hover:shadow-md transition-all group">
                <CardContent className="p-5 flex flex-col items-start gap-4">
                  <div className={`p-3 rounded-2xl ${item.bg} ${item.color} shadow-sm group-hover:scale-110 transition-transform duration-300`}>
                    <item.icon className="h-6 w-6" />
                  </div>
                  <span className="text-sm font-bold text-slate-900 leading-tight group-hover:text-blue-600 transition-colors">
                    {item.title}
                  </span>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      </motion.div>
    </div>
  );
}
