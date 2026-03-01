import * as React from 'react';
import { motion } from 'motion/react';
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
              <span className="text-xs font-medium uppercase tracking-wider">Stok Voucher</span>
            </div>
            <div className="text-2xl font-bold text-slate-800">
              {availableVouchers} <span className="text-sm font-normal text-slate-400">/ {resellerVouchers.length}</span>
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
        <h2 className="text-lg font-semibold text-slate-800 mb-4 px-1">Shortcut</h2>
        <Link to="/reseller/cetak">
          <Card hoverable className="bg-gradient-to-r from-blue-50 to-pink-50 border-white/40">
            <CardContent className="p-6 flex items-center gap-4">
              <div className="p-4 bg-white rounded-2xl text-blue-600 shadow-sm">
                <Ticket className="h-8 w-8" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-slate-900">Cetak Voucher</h3>
                <p className="text-sm text-slate-500">Cetak A4/F4 atau Thermal dari batch terbaru</p>
              </div>
            </CardContent>
          </Card>
        </Link>
        <Link to="/reseller/request">
          <Card hoverable className="bg-gradient-to-r from-emerald-50 to-teal-50 border-white/40">
            <CardContent className="p-6 flex items-center gap-4">
              <div className="p-4 bg-white rounded-2xl text-emerald-600 shadow-sm">
                <Ticket className="h-8 w-8" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-slate-900">Request Voucher</h3>
                <p className="text-sm text-slate-500">Minta stok voucher baru ke Operator</p>
              </div>
            </CardContent>
          </Card>
        </Link>
      </motion.div>
    </div>
  );
}
