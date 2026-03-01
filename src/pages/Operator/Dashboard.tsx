import { Link } from 'react-router-dom';
import { motion } from 'motion/react';
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
        <Card className="bg-gradient-to-br from-blue-600 to-blue-500 text-white border-none shadow-lg shadow-blue-500/30">
          <CardContent className="p-4">
            <div className="flex items-center gap-2 text-blue-100 mb-2">
              <TrendingUp className="h-4 w-4" />
              <span className="text-xs font-medium uppercase tracking-wider">Total Omzet</span>
            </div>
            <div className="text-2xl font-bold">
              Rp {totalOmzet.toLocaleString('id-ID')}
            </div>
          </CardContent>
        </Card>

        <Card className="bg-white/80 backdrop-blur-xl border-white/50">
          <CardContent className="p-4">
            <div className="flex items-center gap-2 text-slate-500 mb-2">
              <CreditCard className="h-4 w-4" />
              <span className="text-xs font-medium uppercase tracking-wider">Voucher Aktif</span>
            </div>
            <div className="text-2xl font-bold text-slate-800">
              {availableVouchers} <span className="text-sm font-normal text-slate-400">/ {totalVouchers}</span>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
      >
        <h2 className="text-lg font-semibold text-slate-800 mb-4 px-1">Menu Utama</h2>
        <div className="grid grid-cols-2 gap-4">
          {menuItems.map((item, index) => (
            <Link key={item.title} to={item.to}>
              <Card hoverable className="h-full bg-white/60 border-white/40">
                <CardContent className="p-5 flex flex-col items-center justify-center text-center gap-3">
                  <div className={`p-3 rounded-2xl ${item.bg} ${item.color}`}>
                    <item.icon className="h-6 w-6" />
                  </div>
                  <span className="text-sm font-medium text-slate-700 leading-tight">
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
