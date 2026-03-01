import * as React from 'react';
import { motion } from 'motion/react';
import { Card, CardContent } from '@/components/Card';
import { Input } from '@/components/Input';
import { Button } from '@/components/Button';
import { Modal } from '@/components/Modal';
import { useStore } from '@/store';
import { Search, Filter, Trash2, Layers } from 'lucide-react';

export function OperatorDataVoucher() {
  const { vouchers, users, deleteVoucher, deleteVouchersByBatch, deleteAllVouchers } = useStore();
  const resellers = users.filter((u) => u.role === 'reseller');

  const [search, setSearch] = React.useState('');
  const [filterReseller, setFilterReseller] = React.useState('');
  const [isBatchModalOpen, setIsBatchModalOpen] = React.useState(false);

  const filteredVouchers = vouchers.filter((v) => {
    const matchSearch = v.code.toLowerCase().includes(search.toLowerCase()) || v.group.toLowerCase().includes(search.toLowerCase());
    const matchReseller = filterReseller ? v.resellerId === filterReseller : true;
    return matchSearch && matchReseller;
  });

  // Group vouchers by batchId
  const batches = React.useMemo(() => {
    const grouped = vouchers.reduce((acc, v) => {
      if (!v.batchId) return acc;
      if (!acc[v.batchId]) {
        acc[v.batchId] = { id: v.batchId, count: 0, available: 0, used: 0, pending: 0, printed: 0 };
      }
      acc[v.batchId].count++;
      if (v.status === 'available') acc[v.batchId].available++;
      if (v.status === 'used') acc[v.batchId].used++;
      if (v.status === 'pending') acc[v.batchId].pending++;
      if (v.printCount && v.printCount > 0) acc[v.batchId].printed++;
      return acc;
    }, {} as Record<string, { id: string; count: number; available: number; used: number; pending: number; printed: number }>);
    return Object.values(grouped).sort((a, b) => b.id.localeCompare(a.id));
  }, [vouchers]);

  const handleDeleteBatch = (batchId: string) => {
    if (confirm('Apakah Anda yakin ingin menghapus semua voucher dalam batch ini?')) {
      deleteVouchersByBatch(batchId);
    }
  };

  const handleDeleteAll = () => {
    if (confirm('PERINGATAN: Apakah Anda yakin ingin menghapus SEMUA data voucher? Tindakan ini tidak dapat dibatalkan.')) {
      deleteAllVouchers();
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-4"
    >
      <div className="mb-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Data Voucher</h1>
          <p className="text-sm text-slate-500">Kelola semua voucher yang tersedia.</p>
        </div>
        <div className="flex items-center gap-2">
          <Button onClick={() => setIsBatchModalOpen(true)} variant="outline" className="flex items-center gap-2 text-slate-600 border-slate-200 hover:bg-slate-50 hover:text-slate-900">
            <Layers className="h-4 w-4" />
            Hapus Per Batch
          </Button>
          <Button onClick={handleDeleteAll} variant="outline" className="flex items-center gap-2 text-red-600 border-red-200 hover:bg-red-50 hover:text-red-700">
            <Trash2 className="h-4 w-4" />
            Hapus Semua
          </Button>
        </div>
      </div>

      <div className="flex flex-col gap-3 sm:flex-row">
        <div className="relative flex-1">
          <Input
            placeholder="Cari kode atau grup..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-10"
          />
          <Search className="absolute left-3 top-[11px] h-5 w-5 text-slate-400" />
        </div>
        <div className="relative w-full sm:w-48">
          <select
            className="flex h-11 w-full appearance-none rounded-xl border border-slate-200 bg-white px-3 py-2 pl-10 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 transition-all"
            value={filterReseller}
            onChange={(e) => setFilterReseller(e.target.value)}
          >
            <option value="">Semua Reseller</option>
            {resellers.map((r) => (
              <option key={r.id} value={r.id}>
                {r.name}
              </option>
            ))}
          </select>
          <Filter className="absolute left-3 top-[11px] h-5 w-5 text-slate-400" />
        </div>
      </div>

      <div className="space-y-3">
        {filteredVouchers.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-12 text-center">
            <div className="mb-4 rounded-full bg-slate-100 p-4">
              <Search className="h-8 w-8 text-slate-400" />
            </div>
            <h3 className="text-lg font-medium text-slate-900">Tidak ada voucher</h3>
            <p className="text-sm text-slate-500">Data voucher kosong atau tidak ditemukan.</p>
          </div>
        ) : (
          filteredVouchers.map((v) => (
            <Card key={v.id} className="bg-white/80 backdrop-blur-xl border-white/50 overflow-hidden">
              <CardContent className="p-4 flex items-center justify-between">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="font-mono font-bold text-slate-900">{v.code}</span>
                    <span
                      className={`inline-flex items-center rounded-full px-2 py-0.5 text-[10px] font-medium uppercase tracking-wider ${
                        v.status === 'available'
                          ? 'bg-emerald-50 text-emerald-700 ring-1 ring-inset ring-emerald-600/20'
                          : v.status === 'pending'
                          ? 'bg-amber-50 text-amber-700 ring-1 ring-inset ring-amber-600/20'
                          : 'bg-slate-100 text-slate-600 ring-1 ring-inset ring-slate-500/10'
                      }`}
                    >
                      {v.status}
                    </span>
                    {v.printCount && v.printCount > 0 && (
                      <span className="inline-flex items-center rounded-full px-2 py-0.5 text-[10px] font-medium bg-blue-50 text-blue-700 ring-1 ring-inset ring-blue-600/20">
                        Tercetak {v.printCount}x
                      </span>
                    )}
                  </div>
                  <div className="text-xs text-slate-500 flex items-center gap-2">
                    <span>{v.group}</span>
                    <span>•</span>
                    <span>{v.period}</span>
                    <span>•</span>
                    <span className="font-medium text-blue-600">Rp {v.price.toLocaleString('id-ID')}</span>
                  </div>
                  {v.resellerId && (
                    <div className="text-[10px] text-slate-400 mt-1">
                      Reseller: {resellers.find((r) => r.id === v.resellerId)?.name || 'Unknown'}
                    </div>
                  )}
                </div>
                <button
                  onClick={() => deleteVoucher(v.id)}
                  className="p-2 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-xl transition-colors"
                >
                  <Trash2 className="h-5 w-5" />
                </button>
              </CardContent>
            </Card>
          ))
        )}
      </div>

      <Modal
        isOpen={isBatchModalOpen}
        onClose={() => setIsBatchModalOpen(false)}
        title="Hapus Voucher Per Batch"
      >
        <div className="space-y-4">
          {batches.length === 0 ? (
            <div className="text-center py-8 text-slate-500">
              Tidak ada data batch voucher.
            </div>
          ) : (
            <div className="space-y-3 max-h-[60vh] overflow-y-auto pr-2">
              {batches.map((batch) => (
                <div key={batch.id} className="bg-slate-50 border border-slate-200 rounded-xl p-4 flex items-center justify-between">
                  <div>
                    <div className="font-medium text-slate-900 text-sm mb-1">Batch ID: {batch.id}</div>
                    <div className="text-xs text-slate-500 flex flex-wrap gap-3">
                      <span>Total: {batch.count}</span>
                      <span className="text-emerald-600">Tersedia: {batch.available}</span>
                      {batch.used > 0 && <span className="text-slate-400">Terpakai: {batch.used}</span>}
                      {batch.pending > 0 && <span className="text-amber-600">Pending: {batch.pending}</span>}
                      {batch.printed > 0 && <span className="text-blue-600">Tercetak: {batch.printed}</span>}
                    </div>
                  </div>
                  <Button
                    variant="outline"
                    onClick={() => handleDeleteBatch(batch.id)}
                    className="text-red-600 border-red-200 hover:bg-red-50 hover:text-red-700"
                    size="sm"
                  >
                    <Trash2 className="h-4 w-4 mr-2" />
                    Hapus
                  </Button>
                </div>
              ))}
            </div>
          )}
        </div>
      </Modal>
    </motion.div>
  );
}
