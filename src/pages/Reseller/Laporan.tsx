import * as React from 'react';
import { motion } from 'motion/react';
import { Card, CardContent } from '@/components/Card';
import { useStore } from '@/store';
import { FileText, Calendar, TrendingUp, Ticket } from 'lucide-react';
import { format, parseISO } from 'date-fns';
import { id } from 'date-fns/locale';

export function ResellerLaporan() {
  const { currentUser, transactions } = useStore();

  if (!currentUser) return null;

  const resellerTransactions = transactions.filter((t) => t.resellerId === currentUser.id);
  const totalOmzet = resellerTransactions.reduce((sum, t) => sum + t.totalAmount, 0);
  const totalVoucherTerjual = resellerTransactions.reduce((sum, t) => sum + t.vouchers.length, 0);

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-6"
    >
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-slate-900">Laporan Penjualan</h1>
        <p className="text-sm text-slate-500">Ringkasan transaksi voucher Anda.</p>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <Card className="bg-gradient-to-br from-emerald-500 to-emerald-600 text-white border-none shadow-lg shadow-emerald-500/30">
          <CardContent className="p-4">
            <div className="flex items-center gap-2 text-emerald-100 mb-2">
              <TrendingUp className="h-4 w-4" />
              <span className="text-xs font-medium uppercase tracking-wider">Total Omzet</span>
            </div>
            <div className="text-xl font-bold">
              Rp {totalOmzet.toLocaleString('id-ID')}
            </div>
          </CardContent>
        </Card>

        <Card className="bg-white/80 backdrop-blur-xl border-white/50">
          <CardContent className="p-4">
            <div className="flex items-center gap-2 text-slate-500 mb-2">
              <Ticket className="h-4 w-4" />
              <span className="text-xs font-medium uppercase tracking-wider">Voucher Terjual</span>
            </div>
            <div className="text-2xl font-bold text-slate-800">
              {totalVoucherTerjual} <span className="text-sm font-normal text-slate-400">pcs</span>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="space-y-4">
        <h2 className="text-lg font-semibold text-slate-800 px-1">Riwayat Cetak</h2>
        
        {resellerTransactions.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-12 text-center">
            <div className="mb-4 rounded-full bg-slate-100 p-4">
              <FileText className="h-8 w-8 text-slate-400" />
            </div>
            <h3 className="text-lg font-medium text-slate-900">Belum ada transaksi</h3>
            <p className="text-sm text-slate-500">Riwayat cetak voucher akan muncul di sini.</p>
          </div>
        ) : (
          <div className="space-y-3">
            {resellerTransactions.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()).map((t) => (
              <Card key={t.id} className="bg-white/80 backdrop-blur-xl border-white/50">
                <CardContent className="p-4">
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <div className="font-semibold text-slate-900">{t.packageDetails}</div>
                      <div className="flex items-center gap-1 text-xs text-slate-500 mt-1">
                        <Calendar className="h-3 w-3" />
                        {format(parseISO(t.date), 'dd MMM yyyy HH:mm', { locale: id })}
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="font-bold text-emerald-600">Rp {t.totalAmount.toLocaleString('id-ID')}</div>
                      <div className="text-xs text-slate-500 mt-1">{t.vouchers.length} voucher</div>
                    </div>
                  </div>
                  <div className="mt-3 pt-3 border-t border-slate-100">
                    <div className="text-xs font-medium text-slate-500 mb-1">Kode Voucher:</div>
                    <div className="flex flex-wrap gap-1">
                      {t.vouchers.map((code) => (
                        <span key={code} className="inline-flex items-center rounded-md bg-slate-100 px-2 py-1 text-[10px] font-mono font-medium text-slate-600">
                          {code}
                        </span>
                      ))}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </motion.div>
  );
}
