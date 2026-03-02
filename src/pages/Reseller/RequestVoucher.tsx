import * as React from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent } from '@/components/Card';
import { Button } from '@/components/Button';
import { Input } from '@/components/Input';
import { useStore, VoucherRequestItem } from '@/store';
import { Send, Clock, CheckCircle2, XCircle, Plus, Trash2 } from 'lucide-react';

export function ResellerRequestVoucher() {
  const { currentUser, requestVouchers, voucherRequests } = useStore();
  const [items, setItems] = React.useState<VoucherRequestItem[]>([{ price: 0, quantity: 0 }]);
  const [successMsg, setSuccessMsg] = React.useState('');

  if (!currentUser) return null;

  const myRequests = voucherRequests
    .filter((req) => req.resellerId === currentUser.id)
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

  const handleAddItem = () => {
    setItems([...items, { price: 0, quantity: 0 }]);
  };

  const handleRemoveItem = (index: number) => {
    setItems(items.filter((_, i) => i !== index));
  };

  const handleChangeItem = (index: number, field: keyof VoucherRequestItem, value: number) => {
    const newItems = [...items];
    newItems[index][field] = value;
    setItems(newItems);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const validItems = items.filter(item => item.price > 0 && item.quantity > 0);
    if (validItems.length === 0) return;

    requestVouchers(currentUser.id, validItems);
    setItems([{ price: 0, quantity: 0 }]);
    setSuccessMsg('Request berhasil dikirim ke Operator!');
    setTimeout(() => setSuccessMsg(''), 3000);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-6"
    >
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-slate-900">Request Voucher</h1>
        <p className="text-sm text-slate-500">Minta stok voucher baru ke Operator.</p>
      </div>

      <Card className="bg-white/80 backdrop-blur-xl border-white/50">
        <CardContent className="p-6">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-3">
              {items.map((item, index) => (
                <div key={index} className="flex items-end gap-3">
                  <div className="flex-1">
                    <Input
                      label={index === 0 ? "Harga Voucher (Rp)" : undefined}
                      type="number"
                      placeholder="Contoh: 2000"
                      value={item.price || ''}
                      onChange={(e) => handleChangeItem(index, 'price', Number(e.target.value))}
                      required
                    />
                  </div>
                  <div className="flex-1">
                    <Input
                      label={index === 0 ? "Jumlah (Pcs)" : undefined}
                      type="number"
                      placeholder="Contoh: 100"
                      value={item.quantity || ''}
                      onChange={(e) => handleChangeItem(index, 'quantity', Number(e.target.value))}
                      required
                    />
                  </div>
                  {items.length > 1 && (
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => handleRemoveItem(index)}
                      className="text-red-500 border-red-200 hover:bg-red-50 hover:text-red-600 px-3"
                    >
                      <Trash2 className="h-5 w-5" />
                    </Button>
                  )}
                </div>
              ))}
            </div>
            
            <Button
              type="button"
              variant="outline"
              onClick={handleAddItem}
              className="w-full border-dashed border-2 text-slate-500 hover:text-slate-700 hover:border-slate-400"
            >
              <Plus className="h-4 w-4 mr-2" />
              Tambah Item
            </Button>

            {successMsg && (
              <div className="p-3 bg-emerald-50 text-emerald-700 text-sm rounded-xl border border-emerald-100 flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4" />
                {successMsg}
              </div>
            )}
            <Button type="submit" className="w-full gap-2">
              <Send className="h-4 w-4" />
              Kirim Request
            </Button>
          </form>
        </CardContent>
      </Card>

      <div>
        <h2 className="text-lg font-semibold text-slate-800 mb-4 px-1">Riwayat Request</h2>
        <div className="space-y-3">
          {myRequests.length === 0 ? (
            <div className="text-center py-8 text-slate-500 text-sm bg-slate-50 rounded-2xl border border-slate-100">
              Belum ada riwayat request
            </div>
          ) : (
            myRequests.map((req) => (
              <Card key={req.id} className="bg-white/80 backdrop-blur-xl border-white/50">
                <CardContent className="p-4 flex items-center justify-between">
                  <div>
                    {req.items ? (
                      <div className="space-y-1">
                        {req.items.map((item, idx) => (
                          <div key={idx} className="text-sm">
                            <span className="font-bold text-slate-900">Rp {item.price.toLocaleString('id-ID')}</span>
                            <span className="text-slate-500 ml-2">{item.quantity} pcs</span>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <>
                        <div className="font-bold text-slate-900">Rp {(req.price || 0).toLocaleString('id-ID')}</div>
                        <div className="text-sm text-slate-500">{req.quantity || 0} pcs</div>
                      </>
                    )}
                    <div className="text-xs text-slate-400 mt-2">
                      {new Date(req.createdAt).toLocaleString('id-ID')}
                    </div>
                  </div>
                  <div>
                    {req.status === 'pending' && (
                      <span className="flex items-center gap-1 text-xs font-medium text-amber-600 bg-amber-50 px-2 py-1 rounded-full border border-amber-100">
                        <Clock className="h-3 w-3" /> Menunggu
                      </span>
                    )}
                    {req.status === 'completed' && (
                      <span className="flex items-center gap-1 text-xs font-medium text-emerald-600 bg-emerald-50 px-2 py-1 rounded-full border border-emerald-100">
                        <CheckCircle2 className="h-3 w-3" /> Selesai
                      </span>
                    )}
                    {req.status === 'rejected' && (
                      <span className="flex items-center gap-1 text-xs font-medium text-red-600 bg-red-50 px-2 py-1 rounded-full border border-red-100">
                        <XCircle className="h-3 w-3" /> Ditolak
                      </span>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </div>
      </div>
    </motion.div>
  );
}
