import * as React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Card, CardContent } from '@/components/Card';
import { Button } from '@/components/Button';
import { Modal } from '@/components/Modal';
import { useStore, Voucher, PrintTemplate } from '@/store';
import { Printer, Minus, Plus, Ticket, CheckCircle2, AlertCircle } from 'lucide-react';
import { generateVoucherHtml } from '@/lib/TemplateEngine';

export function ResellerCetak() {
  const { currentUser, vouchers, printVouchers, printBatch, rollbackPrint, settings, printTemplates, commitPrint, rollbackPrintCount } = useStore();
  const [selectedPackage, setSelectedPackage] = React.useState<any>(null);
  const [qty, setQty] = React.useState(1);
  const [selectedTemplateId, setSelectedTemplateId] = React.useState<string>('');
  const [isModalOpen, setIsModalOpen] = React.useState(false);
  const [isBatchModalOpen, setIsBatchModalOpen] = React.useState(false);
  const [printedVouchers, setPrintedVouchers] = React.useState<Voucher[]>([]);
  const [currentTransactionId, setCurrentTransactionId] = React.useState<string | null>(null);
  const [isSuccessModalOpen, setIsSuccessModalOpen] = React.useState(false);

  if (!currentUser) return null;

  // Find latest batchId for this reseller
  const resellerVouchersAll = vouchers.filter((v) => v.resellerId === currentUser.id && v.status === 'available');
  const latestBatchId = resellerVouchersAll.length > 0 
    ? resellerVouchersAll.reduce((latest, v) => (v.batchId && v.batchId > latest ? v.batchId : latest), resellerVouchersAll[0].batchId || '')
    : '';

  const resellerVouchers = resellerVouchersAll.filter(v => String(v.batchId || '') === String(latestBatchId));

  const packages = resellerVouchers.reduce((acc, curr) => {
    const key = `${curr.price}-${curr.period}-${curr.group}`;
    if (!acc[key]) {
      acc[key] = {
        price: curr.price,
        period: curr.period,
        group: curr.group,
        count: 0,
        printed: 0,
        batchId: curr.batchId,
      };
    }
    acc[key].count += 1;
    if (curr.printCount && curr.printCount > 0) {
      acc[key].printed += 1;
    }
    return acc;
  }, {} as Record<string, { price: number; period: string; group: string; count: number; printed: number; batchId?: string }>);

  const packageList = Object.values(packages).sort((a, b) => a.price - b.price);

  const handleSelectPackage = (pkg: any) => {
    setSelectedPackage(pkg);
    setQty(1);
    setIsModalOpen(true);
  };

  const activeTemplates = printTemplates.filter(t => {
    if (!t.isActive) return false;
    const isThermal = t.paperPreset === 'THERMAL80' || t.paperPreset === 'THERMAL58';
    if (isThermal && currentUser.canPrintThermal === false) return false;
    if (!isThermal && currentUser.canPrintMass === false) return false;
    return true;
  });

  React.useEffect(() => {
    if (activeTemplates.length > 0 && (!selectedTemplateId || !activeTemplates.find(t => t.id === selectedTemplateId))) {
      setSelectedTemplateId(activeTemplates[0].id);
    }
  }, [activeTemplates, selectedTemplateId]);

  const selectedTemplate = printTemplates.find(t => t.id === selectedTemplateId);
  const isSelectedThermal = selectedTemplate?.paperPreset === 'THERMAL80' || selectedTemplate?.paperPreset === 'THERMAL58';

  React.useEffect(() => {
    if (!isSelectedThermal && selectedPackage) {
      setQty(selectedPackage.count);
    }
  }, [isSelectedThermal, selectedPackage]);

  const handlePrint = () => {
    if (!selectedPackage) return;
    const template = printTemplates.find(t => t.id === selectedTemplateId);
    const isThermal = template?.paperPreset === 'THERMAL80' || template?.paperPreset === 'THERMAL58';

    try {
      const result = printVouchers(
        currentUser.id,
        selectedPackage.price,
        selectedPackage.period,
        selectedPackage.group,
        qty,
        isThermal,
        selectedPackage.batchId
      );
      setPrintedVouchers(result.vouchers);
      setCurrentTransactionId(result.transactionId || null);
      setIsModalOpen(false);
      setIsSuccessModalOpen(true);
    } catch (error: any) {
      alert(error.message);
    }
  };

  const handlePrintBatch = () => {
    if (!latestBatchId) return;
    const template = printTemplates.find(t => t.id === selectedTemplateId);
    const isThermal = template?.paperPreset === 'THERMAL80' || template?.paperPreset === 'THERMAL58';

    try {
      const result = printBatch(currentUser.id, latestBatchId, isThermal);
      setPrintedVouchers(result.vouchers);
      setCurrentTransactionId(result.transactionId || null);
      setIsBatchModalOpen(false);
      setIsSuccessModalOpen(true);
    } catch (error: any) {
      alert(error.message);
    }
  };

  const handleBrowserPrint = () => {
    const template = printTemplates.find(t => t.id === selectedTemplateId);
    if (!template) {
      alert('Pilih template cetak terlebih dahulu');
      return;
    }

    const printWindow = window.open('', '_blank');
    if (!printWindow) {
      alert('Pop-up diblokir oleh browser. Silakan izinkan pop-up untuk situs ini.');
      return;
    }
    
    const html = `
      <!DOCTYPE html>
      <html>
        <head>
          <title>Print Vouchers</title>
          <style>${template.cssText}</style>
        </head>
        <body>
          <div class="print-container with-crop">
            ${generateVoucherHtml(printedVouchers, currentUser.wifiName || settings.businessName || 'WIFI VOUCHER', currentUser.logoUrl)}
          </div>
          <script>
            window.onload = () => {
              window.print();
            }
          </script>
        </body>
      </html>
    `;
    printWindow.document.write(html);
    printWindow.document.close();
  };

  const handleConfirmSuccess = () => {
    if (currentTransactionId) {
      commitPrint(currentTransactionId);
    }
    setIsSuccessModalOpen(false);
    setPrintedVouchers([]);
    setCurrentTransactionId(null);
  };

  const handleConfirmFailed = () => {
    if (currentTransactionId) {
      rollbackPrint(currentTransactionId);
    } else if (printedVouchers.length > 0) {
      rollbackPrintCount(printedVouchers.map(v => v.id));
    }
    setIsSuccessModalOpen(false);
    setPrintedVouchers([]);
    setCurrentTransactionId(null);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-6"
    >
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Cetak Voucher</h1>
          <p className="text-sm text-slate-500">Pilih paket voucher dari batch terbaru untuk dicetak.</p>
        </div>
        {latestBatchId && resellerVouchers.length > 0 && (
          <Button onClick={() => setIsBatchModalOpen(true)} className="flex items-center gap-2">
            <Printer className="h-4 w-4" />
            Cetak Semua Batch
          </Button>
        )}
      </div>

      <div className="grid grid-cols-2 gap-4">
        {packageList.length === 0 ? (
          <div className="col-span-2 flex flex-col items-center justify-center py-12 text-center">
            <div className="mb-4 rounded-full bg-slate-100 p-4">
              <Ticket className="h-8 w-8 text-slate-400" />
            </div>
            <h3 className="text-lg font-medium text-slate-900">Stok Habis</h3>
            <p className="text-sm text-slate-500">Hubungi operator untuk menambah stok voucher.</p>
          </div>
        ) : (
          packageList.map((pkg, idx) => (
            <Card
              key={idx}
              hoverable
              onClick={() => handleSelectPackage(pkg)}
              className="bg-white/80 backdrop-blur-xl border-white/50 cursor-pointer overflow-hidden relative group"
            >
              <div className="absolute top-0 right-0 bg-blue-500 text-white text-[10px] font-bold px-2 py-1 rounded-bl-xl">
                Stok: {pkg.count}
              </div>
              {pkg.printed > 0 && (
                <div className="absolute top-0 left-0 bg-emerald-500 text-white text-[10px] font-bold px-2 py-1 rounded-br-xl">
                  Tercetak: {pkg.printed}
                </div>
              )}
              <CardContent className="p-4 flex flex-col items-center text-center pt-6">
                <div className="text-2xl font-bold text-blue-600 mb-1">
                  Rp {pkg.price.toLocaleString('id-ID')}
                </div>
                <div className="text-sm font-medium text-slate-700">{pkg.period}</div>
                <div className="text-xs text-slate-500 mt-1">{pkg.group}</div>
              </CardContent>
            </Card>
          ))
        )}
      </div>

      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Konfirmasi Cetak"
      >
        {selectedPackage && (
          <div className="space-y-6">
            <div className="bg-slate-50 rounded-2xl p-4 text-center border border-slate-100">
              <div className="text-sm text-slate-500 mb-1">Paket Terpilih</div>
              <div className="text-xl font-bold text-slate-900">
                {selectedPackage.period} - Rp {selectedPackage.price.toLocaleString('id-ID')}
              </div>
              <div className="text-xs text-slate-400 mt-1">Stok tersedia: {selectedPackage.count}</div>
            </div>

            {isSelectedThermal ? (
              <div className="flex flex-col items-center gap-4">
                <label className="text-sm font-medium text-slate-700">Jumlah Cetak</label>
                <div className="flex items-center gap-4 bg-white border border-slate-200 rounded-2xl p-2 shadow-sm">
                  <button
                    onClick={() => setQty(Math.max(1, qty - 1))}
                    className="p-2 rounded-xl hover:bg-slate-100 text-slate-600 transition-colors"
                  >
                    <Minus className="h-5 w-5" />
                  </button>
                  <span className="text-2xl font-bold w-12 text-center text-slate-900">{qty}</span>
                  <button
                    onClick={() => setQty(Math.min(selectedPackage.count, qty + 1))}
                    className="p-2 rounded-xl hover:bg-slate-100 text-slate-600 transition-colors"
                  >
                    <Plus className="h-5 w-5" />
                  </button>
                </div>
              </div>
            ) : (
              <div className="bg-amber-50 text-amber-800 text-sm p-3 rounded-xl border border-amber-100 text-center">
                Mencetak seluruh voucher dalam paket ini ({selectedPackage.count} pcs) menggunakan template A4/F4.
              </div>
            )}

            {activeTemplates.length > 0 && (
              <div className="flex flex-col gap-2">
                <label className="text-sm font-medium text-slate-700">Template Cetak</label>
                <select
                  value={selectedTemplateId}
                  onChange={(e) => setSelectedTemplateId(e.target.value)}
                  className="w-full rounded-xl border-slate-200 bg-white px-4 py-2 text-sm shadow-sm focus:border-blue-500 focus:ring-blue-500"
                >
                  {activeTemplates.map(t => (
                    <option key={t.id} value={t.id}>{t.name} ({t.paperPreset})</option>
                  ))}
                </select>
              </div>
            )}

            <div className="bg-blue-50 text-blue-800 text-sm p-3 rounded-xl border border-blue-100 flex justify-between items-center">
              <span className="font-medium">Total Bayar:</span>
              <span className="font-bold text-lg">Rp {(selectedPackage.price * qty).toLocaleString('id-ID')}</span>
            </div>

            <Button onClick={handlePrint} className="w-full gap-2" size="lg">
              <Printer className="h-5 w-5" />
              Preview & Cetak
            </Button>
          </div>
        )}
      </Modal>

      <Modal
        isOpen={isBatchModalOpen}
        onClose={() => setIsBatchModalOpen(false)}
        title="Konfirmasi Cetak Semua Batch"
      >
        <div className="space-y-6">
          <div className="bg-slate-50 rounded-2xl p-4 text-center border border-slate-100">
            <div className="text-sm text-slate-500 mb-1">Total Voucher di Batch</div>
            <div className="text-xl font-bold text-slate-900">
              {resellerVouchers.length} Voucher
            </div>
            <div className="text-xs text-slate-400 mt-1">Batch ID: {latestBatchId}</div>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-slate-700">Rincian Paket:</label>
            <ul className="text-sm text-slate-600 space-y-1">
              {packageList.map((pkg, idx) => (
                <li key={idx} className="flex justify-between">
                  <span>{pkg.period} ({pkg.group})</span>
                  <span className="font-medium">{pkg.count} pcs x Rp {pkg.price.toLocaleString('id-ID')}</span>
                </li>
              ))}
            </ul>
          </div>

          {activeTemplates.length > 0 && (
            <div className="flex flex-col gap-2">
              <label className="text-sm font-medium text-slate-700">Template Cetak</label>
              <select
                value={selectedTemplateId}
                onChange={(e) => setSelectedTemplateId(e.target.value)}
                className="w-full rounded-xl border-slate-200 bg-white px-4 py-2 text-sm shadow-sm focus:border-blue-500 focus:ring-blue-500"
              >
                {activeTemplates.map(t => (
                  <option key={t.id} value={t.id}>{t.name} ({t.paperPreset})</option>
                ))}
              </select>
            </div>
          )}

          <div className="bg-blue-50 text-blue-800 text-sm p-3 rounded-xl border border-blue-100 flex justify-between items-center">
            <span className="font-medium">Total Bayar:</span>
            <span className="font-bold text-lg">
              Rp {packageList.reduce((sum, pkg) => sum + pkg.price * pkg.count, 0).toLocaleString('id-ID')}
            </span>
          </div>

          <Button onClick={handlePrintBatch} className="w-full gap-2" size="lg">
            <Printer className="h-5 w-5" />
            Preview & Cetak Semua
          </Button>
        </div>
      </Modal>

      <Modal
        isOpen={isSuccessModalOpen}
        onClose={() => {}} // Disable outside click close
        title="Preview & Konfirmasi"
      >
        <div className="space-y-6">
          <div className="flex flex-col items-center justify-center text-center mb-4">
            <div className="h-16 w-16 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center mb-3">
              <Printer className="h-8 w-8" />
            </div>
            <h3 className="text-lg font-bold text-slate-900">Silakan Cetak Voucher</h3>
            <p className="text-sm text-slate-500">Klik tombol cetak di bawah, lalu konfirmasi hasilnya.</p>
          </div>

          <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 max-h-64 overflow-y-auto space-y-3 print-area">
            {printedVouchers.map((v, i) => (
              <div key={i} className="bg-white p-3 rounded-xl border border-slate-200 border-dashed text-center shadow-sm">
                {currentUser.logoUrl && (
                  <img src={currentUser.logoUrl} alt="Logo" className="h-8 w-auto mx-auto mb-1 object-contain" />
                )}
                <div className="font-bold text-sm mb-1">{currentUser.wifiName || settings.businessName || 'WIFI VOUCHER'}</div>
                <div className="text-xs text-slate-500 mb-2">{settings.ssid && `SSID: ${settings.ssid}`}</div>
                <div className="text-2xl font-mono font-bold tracking-widest text-slate-900 my-2">{v.code}</div>
                <div className="flex justify-between text-[10px] text-slate-500 mt-2 border-t border-slate-100 pt-2">
                  <span>{v.period}</span>
                  <span>Rp {v.price.toLocaleString('id-ID')}</span>
                </div>
              </div>
            ))}
          </div>

          <Button onClick={handleBrowserPrint} className="w-full gap-2 mb-4" size="lg" variant="secondary">
            <Printer className="h-5 w-5" />
            Buka Dialog Print
          </Button>

          <div className="border-t border-slate-100 pt-4">
            <p className="text-sm font-medium text-slate-700 mb-3 text-center">Apakah voucher berhasil dicetak dengan baik?</p>
            <div className="flex gap-3">
              <Button variant="outline" onClick={handleConfirmFailed} className="flex-1 text-red-600 hover:text-red-700 hover:bg-red-50 border-red-200">
                <AlertCircle className="h-4 w-4 mr-2" />
                Gagal / Batal
              </Button>
              <Button onClick={handleConfirmSuccess} className="flex-1 bg-emerald-600 hover:bg-emerald-700 text-white">
                <CheckCircle2 className="h-4 w-4 mr-2" />
                Ya, Berhasil
              </Button>
            </div>
          </div>
        </div>
      </Modal>
    </motion.div>
  );
}
