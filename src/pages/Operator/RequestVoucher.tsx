import * as React from 'react';
import { motion } from 'motion/react';
import { Card, CardContent } from '@/components/Card';
import { Button } from '@/components/Button';
import { useStore } from '@/store';
import { Clock, CheckCircle2, XCircle, UserCircle2 } from 'lucide-react';

export function OperatorRequestVoucher() {
  const { voucherRequests, updateRequestStatus, users } = useStore();

  const requests = [...voucherRequests].sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

  const getResellerName = (id: string) => {
    const user = users.find((u) => u.id === id);
    return user ? user.name : 'Unknown Reseller';
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-6"
    >
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-slate-900">Request Voucher</h1>
        <p className="text-sm text-slate-500">Kelola permintaan voucher dari reseller.</p>
      </div>

      <div className="space-y-4">
        {requests.length === 0 ? (
          <div className="text-center py-12 text-slate-500 text-sm bg-slate-50 rounded-2xl border border-slate-100">
            Belum ada request masuk
          </div>
        ) : (
          requests.map((req) => (
            <Card key={req.id} className="bg-white/80 backdrop-blur-xl border-white/50">
              <CardContent className="p-5">
                <div className="flex items-start justify-between">
                  <div className="flex items-start gap-3">
                    <div className="h-10 w-10 bg-blue-50 text-blue-600 rounded-full flex items-center justify-center mt-1">
                      <UserCircle2 className="h-5 w-5" />
                    </div>
                    <div>
                      <div className="font-bold text-slate-900">{getResellerName(req.resellerId)}</div>
                      <div className="text-sm text-slate-500 mt-1">
                        {req.items ? (
                          <ul className="list-disc pl-4 space-y-1">
                            {req.items.map((item, idx) => (
                              <li key={idx}>
                                Meminta <span className="font-medium">{item.quantity} pcs</span> voucher <span className="font-medium">Rp {item.price.toLocaleString('id-ID')}</span>
                              </li>
                            ))}
                          </ul>
                        ) : (
                          <span>
                            Meminta <span className="font-medium">{req.quantity || 0} pcs</span> voucher <span className="font-medium">Rp {(req.price || 0).toLocaleString('id-ID')}</span>
                          </span>
                        )}
                      </div>
                      <div className="text-xs text-slate-400 mt-2">
                        {new Date(req.createdAt).toLocaleString('id-ID')}
                      </div>
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
                </div>

                {req.status === 'pending' && (
                  <div className="flex gap-2 mt-4 pt-4 border-t border-slate-100">
                    <Button
                      variant="outline"
                      size="sm"
                      className="flex-1 text-red-600 hover:text-red-700 hover:bg-red-50 border-red-200"
                      onClick={() => updateRequestStatus(req.id, 'rejected')}
                    >
                      Tolak
                    </Button>
                    <Button
                      size="sm"
                      className="flex-1 bg-emerald-600 hover:bg-emerald-700 text-white"
                      onClick={() => updateRequestStatus(req.id, 'completed')}
                    >
                      Selesai (Sudah Generate)
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </motion.div>
  );
}
