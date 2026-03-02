import * as React from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent } from '@/components/Card';
import { useStore } from '@/store';
import { Ticket, TrendingUp, CreditCard } from 'lucide-react';
import { Link } from 'react-router-dom';

export function ResellerDashboard() {
  const { currentUser, vouchers, transactions } = useStore();

  if (!currentUser) return null;

  const resellerVouchers = vouchers.filter((v) => v.resellerId === currentUser.id);
  const availableVouchers = resellerVouchers.filter((v) => v.status === 'available').length;
  const resellerTransactions = transactions.filter((t) => t.resellerId === currentUser.id);
  const totalOmzet = resellerTransactions.reduce((sum, t) => sum + t.totalAmount, 0);

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
              <span className="text-[10px] font-bold uppercase tracking-widest">Stok Voucher</span>
            </div>
            <div className="text-2xl font-extrabold tracking-tight text-slate-900 relative z-10">
              {availableVouchers} <span className="text-sm font-medium text-slate-400">/ {resellerVouchers.length}</span>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="space-y-4"
      >
        <h2 className="text-lg font-bold text-slate-900 mb-4 px-1 flex items-center gap-2">
          <div className="w-1 h-6 bg-blue-600 rounded-full"></div>
          Shortcut
        </h2>
        <Link to="/reseller/cetak">
          <Card hoverable className="bg-white/80 backdrop-blur-xl border-white/50 shadow-sm hover:shadow-md transition-all group">
            <CardContent className="p-5 flex items-center gap-5">
              <div className="p-4 bg-blue-50 rounded-[1.25rem] text-blue-600 shadow-sm group-hover:scale-110 transition-transform duration-300">
                <Ticket className="h-7 w-7" />
              </div>
              <div>
                <h3 className="text-base font-bold text-slate-900 group-hover:text-blue-600 transition-colors">Cetak Voucher</h3>
                <p className="text-sm text-slate-500 mt-0.5">Cetak A4/F4 atau Thermal</p>
              </div>
            </CardContent>
          </Card>
        </Link>
        <Link to="/reseller/request">
          <Card hoverable className="bg-white/80 backdrop-blur-xl border-white/50 shadow-sm hover:shadow-md transition-all group">
            <CardContent className="p-5 flex items-center gap-5">
              <div className="p-4 bg-purple-50 rounded-[1.25rem] text-purple-600 shadow-sm group-hover:scale-110 transition-transform duration-300">
                <Ticket className="h-7 w-7" />
              </div>
              <div>
                <h3 className="text-base font-bold text-slate-900 group-hover:text-purple-600 transition-colors">Request Voucher</h3>
                <p className="text-sm text-slate-500 mt-0.5">Minta stok voucher baru</p>
              </div>
            </CardContent>
          </Card>
        </Link>
      </motion.div>
    </div>
  );
}
