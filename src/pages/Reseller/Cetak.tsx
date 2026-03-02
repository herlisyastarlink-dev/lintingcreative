import * as React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Card, CardContent } from '@/components/Card';
import { Button } from '@/components/Button';
import { Modal } from '@/components/Modal';
import { useStore, Voucher, PrintTemplate } from '@/store';
import { Printer, Minus, Plus, Ticket, CheckCircle2, AlertCircle, FileText, Receipt } from 'lucide-react';
import { generateVoucherHtml } from '@/lib/TemplateEngine';
import { cn } from '@/lib/utils';

export function ResellerCetak() {
  const { currentUser, users, vouchers, printVouchers, printBatch, rollbackPrint, settings, printTemplates, commitPrint, rollbackPrintCount, addPrintTemplate } = useStore();
  
  const actualUser = users.find(u => u.id === currentUser?.id) || currentUser;
  const canThermal = actualUser?.canPrintThermal ?? true;
  const canMass = actualUser?.canPrintMass ?? true;
  
  const [activeTab, setActiveTab] = React.useState<'thermal' | 'mass'>('thermal');

  // Ensure default thermal templates exist
  React.useEffect(() => {
    const hasThermal80 = printTemplates.some(t => t.id === 'tpl-default-thermal-80');
    const hasThermal58 = printTemplates.some(t => t.id === 'tpl-default-thermal-58');

    if (!hasThermal80) {
      addPrintTemplate({
        id: 'tpl-default-thermal-80',
        name: 'Thermal 80mm',
        paperPreset: 'THERMAL80',
        widthMm: 80,
        heightMm: 50,
        orientation: 'portrait',
        columns: 1,
        rows: 1,
        marginMm: 2,
        gapXmm: 0,
        gapYmm: 0,
        effectiveWidthMm: 76,
        effectiveHeightMm: 46,
        voucherWidthMm: 76,
        voucherHeightMm: 46,
        cssText: `:root {\n  --paper-w-mm: 80;\n  --paper-h-mm: 50;\n  --margin-mm: 2;\n  --gap-x-mm: 0;\n  --gap-y-mm: 0;\n  --voucher-w-mm: 76;\n  --voucher-h-mm: 46;\n  --cols: 1;\n  --rows: 1;\n}\n/* CSS Variabel akan di-inject secara dinamis oleh sistem */\nbody {\n  margin: 0;\n  padding: 0;\n  background: #fff;\n  font-family: 'Courier New', Courier, monospace;\n}\n.print-container {\n  width: calc(var(--paper-w-mm) * 1mm);\n  padding: calc(var(--margin-mm) * 1mm);\n  box-sizing: border-box;\n  display: grid;\n  grid-template-columns: repeat(var(--cols), 1fr);\n  gap: calc(var(--gap-y-mm) * 1mm) calc(var(--gap-x-mm) * 1mm);\n}\n.voucher {\n  width: calc(var(--voucher-w-mm) * 1mm);\n  height: calc(var(--voucher-h-mm) * 1mm);\n  border: 1px dashed #000;\n  box-sizing: border-box;\n  padding: 4mm;\n  display: flex;\n  flex-direction: column;\n  justify-content: center;\n  align-items: center;\n  text-align: center;\n  page-break-inside: avoid;\n}\n.logo {\n  max-height: 8mm;\n  margin-bottom: 2mm;\n}\n.business-name {\n  font-size: 12pt;\n  font-weight: bold;\n  margin-bottom: 1mm;\n}\n.ssid {\n  font-size: 9pt;\n  margin-bottom: 2mm;\n}\n.code {\n  font-size: 16pt;\n  font-weight: bold;\n  letter-spacing: 2px;\n  margin: 2mm 0;\n}\n.details {\n  display: flex;\n  justify-content: space-between;\n  width: 100%;\n  font-size: 8pt;\n  margin-top: auto;\n  border-top: 1px solid #000;\n  padding-top: 1mm;\n}`,
        isActive: true,
      } as any);
    }

    if (!hasThermal58) {
      addPrintTemplate({
        id: 'tpl-default-thermal-58',
        name: 'Thermal 58mm',
        paperPreset: 'THERMAL58',
        widthMm: 58,
        heightMm: 40,
        orientation: 'portrait',
        columns: 1,
        rows: 1,
        marginMm: 2,
        gapXmm: 0,
        gapYmm: 0,
        effectiveWidthMm: 54,
        effectiveHeightMm: 36,
        voucherWidthMm: 54,
        voucherHeightMm: 36,
        cssText: `:root {\n  --paper-w-mm: 58;\n  --paper-h-mm: 40;\n  --margin-mm: 2;\n  --gap-x-mm: 0;\n  --gap-y-mm: 0;\n  --voucher-w-mm: 54;\n  --voucher-h-mm: 36;\n  --cols: 1;\n  --rows: 1;\n}\n/* CSS Variabel akan di-inject secara dinamis oleh sistem */\nbody {\n  margin: 0;\n  padding: 0;\n  background: #fff;\n  font-family: 'Courier New', Courier, monospace;\n}\n.print-container {\n  width: calc(var(--paper-w-mm) * 1mm);\n  padding: calc(var(--margin-mm) * 1mm);\n  box-sizing: border-box;\n  display: grid;\n  grid-template-columns: repeat(var(--cols), 1fr);\n  gap: calc(var(--gap-y-mm) * 1mm) calc(var(--gap-x-mm) * 1mm);\n}\n.voucher {\n  width: calc(var(--voucher-w-mm) * 1mm);\n  height: calc(var(--voucher-h-mm) * 1mm);\n  border: 1px dashed #000;\n  box-sizing: border-box;\n  padding: 4mm;\n  display: flex;\n  flex-direction: column;\n  justify-content: center;\n  align-items: center;\n  text-align: center;\n  page-break-inside: avoid;\n}\n.logo {\n  max-height: 8mm;\n  margin-bottom: 2mm;\n}\n.business-name {\n  font-size: 12pt;\n  font-weight: bold;\n  margin-bottom: 1mm;\n}\n.ssid {\n  font-size: 9pt;\n  margin-bottom: 2mm;\n}\n.code {\n  font-size: 16pt;\n  font-weight: bold;\n  letter-spacing: 2px;\n  margin: 2mm 0;\n}\n.details {\n  display: flex;\n  justify-content: space-between;\n  width: 100%;\n  font-size: 8pt;\n  margin-top: auto;\n  border-top: 1px solid #000;\n  padding-top: 1mm;\n}`,
        isActive: true,
      } as any);
    }
  }, [printTemplates, addPrintTemplate]);

  React.useEffect(() => {
    if (!canThermal && canMass) setActiveTab('mass');
    if (canThermal && !canMass) setActiveTab('thermal');
  }, [canThermal, canMass]);

  // Thermal State
  const [selectedPackage, setSelectedPackage] = React.useState<any>(null);
  const [qty, setQty] = React.useState(1);
  const [selectedTemplateId, setSelectedTemplateId] = React.useState<string>('');
  const [isModalOpen, setIsModalOpen] = React.useState(false);
  const [isBatchModalOpen, setIsBatchModalOpen] = React.useState(false);
  
  // Mass State
  const [selectedBatchMass, setSelectedBatchMass] = React.useState<string>('');
  const [selectedFilterMass, setSelectedFilterMass] = React.useState<string>('all');
  const [selectedTemplateMass, setSelectedTemplateMass] = React.useState<string>('');

  // Shared Print State
  const [printedVouchers, setPrintedVouchers] = React.useState<Voucher[]>([]);
  const [currentTransactionId, setCurrentTransactionId] = React.useState<string | null>(null);
  const [isSuccessModalOpen, setIsSuccessModalOpen] = React.useState(false);

  if (!currentUser) return null;

  // --- Data Preparation ---
  const resellerVouchersAll = vouchers.filter((v) => v.resellerId === currentUser.id && v.status === 'available');
  
  // Thermal Data (Latest Batch)
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

  // Mass Data
  const uniqueBatches = Array.from(new Set(resellerVouchersAll.map(v => v.batchId).filter(Boolean))) as string[];
  uniqueBatches.sort((a, b) => b.localeCompare(a)); // Descending

  React.useEffect(() => {
    if (uniqueBatches.length > 0 && !selectedBatchMass) {
      setSelectedBatchMass(uniqueBatches[0]);
    }
  }, [uniqueBatches, selectedBatchMass]);

  const vouchersInSelectedBatch = resellerVouchersAll.filter(v => v.batchId === selectedBatchMass);
  const massFilters = Array.from(new Set(vouchersInSelectedBatch.map(v => v.price.toString())));
  massFilters.sort((a, b) => Number(a) - Number(b));

  // Templates
  let thermalTemplates = printTemplates.filter(t => t.isActive && (t.paperPreset === 'THERMAL80' || t.paperPreset === 'THERMAL58'));
  if (thermalTemplates.length === 0) {
    thermalTemplates = printTemplates.filter(t => t.id.startsWith('tpl-default-thermal'));
  }

  let massTemplates = printTemplates.filter(t => t.isActive && t.paperPreset !== 'THERMAL80' && t.paperPreset !== 'THERMAL58');
  if (massTemplates.length === 0) {
    massTemplates = printTemplates.filter(t => t.id.startsWith('tpl-default-f4'));
  }

  React.useEffect(() => {
    if (thermalTemplates.length > 0 && (!selectedTemplateId || !thermalTemplates.find(t => t.id === selectedTemplateId))) {
      setSelectedTemplateId(thermalTemplates[0].id);
    }
  }, [thermalTemplates, selectedTemplateId]);

  React.useEffect(() => {
    if (massTemplates.length > 0 && (!selectedTemplateMass || !massTemplates.find(t => t.id === selectedTemplateMass))) {
      setSelectedTemplateMass(massTemplates[0].id);
    }
  }, [massTemplates, selectedTemplateMass]);

  // --- Handlers ---
  const handleSelectPackage = (pkg: any) => {
    setSelectedPackage(pkg);
    setQty(1);
    setIsModalOpen(true);
  };

  const handlePrintThermal = () => {
    if (!selectedPackage) return;
    try {
      const result = printVouchers(
        currentUser.id,
        selectedPackage.price,
        selectedPackage.period,
        selectedPackage.group,
        qty,
        true, // isThermal
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

  const handlePrintBatchThermal = () => {
    if (!latestBatchId) return;
    try {
      const result = printBatch(currentUser.id, latestBatchId, true);
      setPrintedVouchers(result.vouchers);
      setCurrentTransactionId(result.transactionId || null);
      setIsBatchModalOpen(false);
      setIsSuccessModalOpen(true);
    } catch (error: any) {
      alert(error.message);
    }
  };

  const handlePrintMass = () => {
    if (!selectedBatchMass || !selectedTemplateMass) {
      alert('Pilih batch dan template terlebih dahulu');
      return;
    }

    try {
      const priceFilter = selectedFilterMass === 'all' ? undefined : Number(selectedFilterMass);
      const result = printBatch(currentUser.id, selectedBatchMass, false, priceFilter);
      setPrintedVouchers(result.vouchers);
      setCurrentTransactionId(result.transactionId || null);
      setIsSuccessModalOpen(true);
    } catch (error: any) {
      alert(error.message);
    }
  };

  const handleBrowserPrint = () => {
    const templateId = activeTab === 'thermal' ? selectedTemplateId : selectedTemplateMass;
    const template = printTemplates.find(t => t.id === templateId);
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
      <div className="mb-6 flex items-start justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Cetak Voucher</h1>
          <p className="text-sm text-slate-500 mt-1">
            {activeTab === 'thermal' 
              ? 'Pilih paket voucher dari batch terbaru untuk dicetak.'
              : 'Cetak massal voucher berdasarkan batch upload.'}
          </p>
        </div>
        {activeTab === 'thermal' && canThermal && latestBatchId && resellerVouchers.length > 0 && (
          <Button onClick={() => setIsBatchModalOpen(true)} className="flex items-center gap-2 bg-slate-900 text-white hover:bg-slate-800 rounded-2xl shadow-[0_4px_14px_0_rgb(0,0,0,0.2)]">
            <Printer className="h-4 w-4" />
            <span className="hidden sm:inline">Cetak Semua Batch</span>
            <span className="sm:hidden">Semua</span>
          </Button>
        )}
      </div>

      {canThermal && canMass && (
        <div className="flex rounded-2xl bg-slate-100 p-1 mb-6">
          <button
            className={cn(
              "flex-1 rounded-xl py-2.5 text-sm font-bold transition-all flex items-center justify-center gap-2",
              activeTab === 'thermal' ? "bg-white text-slate-900 shadow-sm" : "text-slate-500 hover:text-slate-700"
            )}
            onClick={() => setActiveTab('thermal')}
          >
            <Receipt className="h-4 w-4" /> Thermal
          </button>
          <button
            className={cn(
              "flex-1 rounded-xl py-2.5 text-sm font-bold transition-all flex items-center justify-center gap-2",
              activeTab === 'mass' ? "bg-white text-slate-900 shadow-sm" : "text-slate-500 hover:text-slate-700"
            )}
            onClick={() => setActiveTab('mass')}
          >
            <FileText className="h-4 w-4" /> Massal (A4/F4)
          </button>
        </div>
      )}

      {(!canThermal && !canMass) && (
        <div className="flex flex-col items-center justify-center py-16 text-center">
          <div className="mb-4 rounded-full bg-red-50 p-4">
            <AlertCircle className="h-8 w-8 text-red-500" />
          </div>
          <h3 className="text-lg font-bold text-slate-900">Akses Ditolak</h3>
          <p className="text-sm text-slate-500 max-w-sm mt-1">Anda tidak memiliki hak akses untuk mencetak voucher. Silakan hubungi operator.</p>
        </div>
      )}

      {activeTab === 'thermal' && canThermal && (
        <div className="grid grid-cols-2 gap-4">
          {packageList.length === 0 ? (
            <div className="col-span-2 flex flex-col items-center justify-center py-12 text-center">
              <div className="mb-4 rounded-full bg-slate-100 p-4">
                <Ticket className="h-8 w-8 text-slate-400" />
              </div>
              <h3 className="text-lg font-bold text-slate-900">Stok Habis</h3>
              <p className="text-sm text-slate-500">Hubungi operator untuk menambah stok voucher.</p>
            </div>
          ) : (
            packageList.map((pkg, idx) => (
              <Card
                key={idx}
                hoverable
                onClick={() => handleSelectPackage(pkg)}
                className="bg-white border-slate-100 cursor-pointer overflow-hidden relative group rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.04)]"
              >
                <div className="absolute top-0 right-0 bg-blue-600 text-white text-[10px] font-bold px-3 py-1.5 rounded-bl-xl rounded-tr-3xl shadow-sm">
                  Stok: {pkg.count}
                </div>
                {pkg.printed > 0 && (
                  <div className="absolute top-0 left-0 bg-emerald-500 text-white text-[10px] font-bold px-3 py-1.5 rounded-br-xl rounded-tl-3xl shadow-sm">
                    Tercetak: {pkg.printed}
                  </div>
                )}
                <CardContent className="p-5 flex flex-col items-center text-center pt-8">
                  <div className="text-2xl font-extrabold text-blue-600 mb-1 tracking-tight">
                    Rp {pkg.price.toLocaleString('id-ID')}
                  </div>
                  <div className="text-sm font-bold text-slate-700">{pkg.period}</div>
                  <div className="text-xs font-medium text-slate-500 mt-1">{pkg.group}</div>
                </CardContent>
              </Card>
            ))
          )}
        </div>
      )}

      {activeTab === 'mass' && canMass && (
        <Card className="bg-white border-slate-100 shadow-[0_8px_30px_rgb(0,0,0,0.04)] rounded-3xl">
          <CardContent className="p-6 space-y-5">
            <div className="space-y-1.5">
              <label className="text-sm font-bold text-slate-900">Pilih Batch Upload</label>
              <select
                value={selectedBatchMass}
                onChange={(e) => setSelectedBatchMass(e.target.value)}
                className="flex h-12 w-full rounded-2xl border-0 bg-slate-100/80 px-4 py-3 text-sm text-slate-900 focus:bg-white focus:ring-2 focus:ring-slate-900 focus:outline-none shadow-inner shadow-slate-200/50"
              >
                {uniqueBatches.length === 0 && <option value="">Tidak ada batch tersedia</option>}
                {uniqueBatches.map(b => (
                  <option key={b} value={b}>Batch: {b}</option>
                ))}
              </select>
            </div>

            <div className="space-y-1.5">
              <label className="text-sm font-bold text-slate-900">Filter Voucher</label>
              <select
                value={selectedFilterMass}
                onChange={(e) => setSelectedFilterMass(e.target.value)}
                className="flex h-12 w-full rounded-2xl border-0 bg-slate-100/80 px-4 py-3 text-sm text-slate-900 focus:bg-white focus:ring-2 focus:ring-slate-900 focus:outline-none shadow-inner shadow-slate-200/50"
              >
                <option value="all">Semua Harga ({vouchersInSelectedBatch.length} pcs)</option>
                {massFilters.map(price => {
                  const count = vouchersInSelectedBatch.filter(v => v.price.toString() === price).length;
                  return (
                    <option key={price} value={price}>Rp {Number(price).toLocaleString('id-ID')} ({count} pcs)</option>
                  );
                })}
              </select>
            </div>

            <div className="space-y-1.5">
              <label className="text-sm font-bold text-slate-900">Pilih Template</label>
              <select
                value={selectedTemplateMass}
                onChange={(e) => setSelectedTemplateMass(e.target.value)}
                className="flex h-12 w-full rounded-2xl border-0 bg-slate-100/80 px-4 py-3 text-sm text-slate-900 focus:bg-white focus:ring-2 focus:ring-slate-900 focus:outline-none shadow-inner shadow-slate-200/50"
              >
                {massTemplates.length === 0 && <option value="">Tidak ada template A4/F4 aktif</option>}
                {massTemplates.map(t => (
                  <option key={t.id} value={t.id}>{t.name} ({t.paperPreset})</option>
                ))}
              </select>
            </div>

            <Button onClick={handlePrintMass} className="w-full h-12 text-base mt-2" disabled={!selectedBatchMass || massTemplates.length === 0}>
              <Printer className="h-5 w-5 mr-2" /> Cetak Massal
            </Button>
          </CardContent>
        </Card>
      )}

      {/* Modals */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Konfirmasi Cetak Thermal"
      >
        {selectedPackage && (
          <div className="space-y-6">
            <div className="bg-slate-50 rounded-2xl p-5 text-center border border-slate-100">
              <div className="text-sm font-medium text-slate-500 mb-1">Paket Terpilih</div>
              <div className="text-2xl font-extrabold text-slate-900 tracking-tight">
                {selectedPackage.period} - Rp {selectedPackage.price.toLocaleString('id-ID')}
              </div>
              <div className="text-xs font-medium text-slate-400 mt-2">Stok tersedia: {selectedPackage.count}</div>
            </div>

            <div className="space-y-4">
              <div className="flex flex-col gap-2">
                <label className="text-sm font-semibold text-slate-700">Jumlah Cetak</label>
                <div className="flex items-center justify-between bg-slate-50 border border-slate-200 rounded-xl p-1.5">
                  <button
                    onClick={() => setQty(Math.max(1, qty - 1))}
                    className="h-12 w-12 flex items-center justify-center rounded-lg bg-white text-slate-600 shadow-sm border border-slate-100 hover:bg-slate-50 hover:text-slate-900 transition-all active:scale-95"
                    disabled={qty <= 1}
                  >
                    <Minus className="h-5 w-5" />
                  </button>
                  <div className="flex-1 text-center">
                    <span className="text-2xl font-bold text-slate-900 tracking-tight">{qty}</span>
                    <span className="text-xs text-slate-400 block font-medium">lembar</span>
                  </div>
                  <button
                    onClick={() => setQty(Math.min(selectedPackage.count, qty + 1))}
                    className="h-12 w-12 flex items-center justify-center rounded-lg bg-slate-900 text-white shadow-md hover:bg-slate-800 transition-all active:scale-95 disabled:opacity-50 disabled:active:scale-100"
                    disabled={qty >= selectedPackage.count}
                  >
                    <Plus className="h-5 w-5" />
                  </button>
                </div>
              </div>
            </div>

            {thermalTemplates.length > 0 && (
              <div className="flex flex-col gap-1.5">
                <label className="text-sm font-bold text-slate-900">Template Thermal</label>
                <select
                  value={selectedTemplateId}
                  onChange={(e) => setSelectedTemplateId(e.target.value)}
                  className="flex h-12 w-full rounded-2xl border-0 bg-slate-100/80 px-4 py-3 text-sm text-slate-900 focus:bg-white focus:ring-2 focus:ring-slate-900 focus:outline-none shadow-inner shadow-slate-200/50"
                >
                  {thermalTemplates.map(t => (
                    <option key={t.id} value={t.id}>{t.name} ({t.paperPreset})</option>
                  ))}
                </select>
              </div>
            )}

            <div className="bg-blue-50/50 text-blue-900 p-5 rounded-xl border border-blue-100 flex justify-between items-center shadow-sm">
              <div className="flex flex-col">
                <span className="text-xs font-semibold text-blue-600 uppercase tracking-wider mb-0.5">Total Bayar</span>
                <span className="font-extrabold text-2xl tracking-tight text-blue-950">Rp {(selectedPackage.price * qty).toLocaleString('id-ID')}</span>
              </div>
              <div className="h-10 w-10 bg-blue-100 rounded-full flex items-center justify-center text-blue-600">
                <Ticket className="h-5 w-5" />
              </div>
            </div>

            <Button onClick={handlePrintThermal} className="w-full h-14 text-base font-bold shadow-lg shadow-blue-900/20" disabled={thermalTemplates.length === 0}>
              <Printer className="h-5 w-5 mr-2" /> Preview & Cetak
            </Button>
          </div>
        )}
      </Modal>

      <Modal
        isOpen={isBatchModalOpen}
        onClose={() => setIsBatchModalOpen(false)}
        title="Cetak Semua Batch (Thermal)"
      >
        <div className="space-y-6">
          <div className="bg-slate-50 rounded-2xl p-5 text-center border border-slate-100">
            <div className="text-sm font-medium text-slate-500 mb-1">Total Voucher di Batch</div>
            <div className="text-3xl font-extrabold text-slate-900 tracking-tight">
              {resellerVouchers.length} <span className="text-lg font-bold text-slate-500">Voucher</span>
            </div>
            <div className="text-xs font-medium text-slate-400 mt-2">Batch ID: {latestBatchId}</div>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-bold text-slate-900">Rincian Paket:</label>
            <ul className="text-sm font-medium text-slate-600 space-y-2 bg-white p-4 rounded-2xl border border-slate-100">
              {packageList.map((pkg, idx) => (
                <li key={idx} className="flex justify-between items-center">
                  <span>{pkg.period} ({pkg.group})</span>
                  <span className="font-bold text-slate-900">{pkg.count} pcs x Rp {pkg.price.toLocaleString('id-ID')}</span>
                </li>
              ))}
            </ul>
          </div>

          {thermalTemplates.length > 0 && (
            <div className="flex flex-col gap-1.5">
              <label className="text-sm font-bold text-slate-900">Template Thermal</label>
              <select
                value={selectedTemplateId}
                onChange={(e) => setSelectedTemplateId(e.target.value)}
                className="flex h-12 w-full rounded-2xl border-0 bg-slate-100/80 px-4 py-3 text-sm text-slate-900 focus:bg-white focus:ring-2 focus:ring-slate-900 focus:outline-none shadow-inner shadow-slate-200/50"
              >
                {thermalTemplates.map(t => (
                  <option key={t.id} value={t.id}>{t.name} ({t.paperPreset})</option>
                ))}
              </select>
            </div>
          )}

          <div className="bg-blue-50 text-blue-900 p-4 rounded-2xl border border-blue-100 flex justify-between items-center">
            <span className="font-bold text-sm">Total Bayar:</span>
            <span className="font-extrabold text-xl tracking-tight">
              Rp {packageList.reduce((sum, pkg) => sum + pkg.price * pkg.count, 0).toLocaleString('id-ID')}
            </span>
          </div>

          <Button onClick={handlePrintBatchThermal} className="w-full h-12 text-base" disabled={thermalTemplates.length === 0}>
            <Printer className="h-5 w-5 mr-2" /> Preview & Cetak Semua
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
            <div className="h-16 w-16 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center mb-4 shadow-sm">
              <Printer className="h-8 w-8" />
            </div>
            <h3 className="text-xl font-extrabold text-slate-900 tracking-tight">Silakan Cetak Voucher</h3>
            <p className="text-sm font-medium text-slate-500 mt-1">Klik tombol cetak di bawah, lalu konfirmasi hasilnya.</p>
          </div>

          <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 max-h-64 overflow-y-auto space-y-3 print-area shadow-inner">
            {printedVouchers.map((v, i) => (
              <div key={i} className="bg-white p-4 rounded-xl border border-slate-200 border-dashed text-center shadow-sm">
                {currentUser.logoUrl && (
                  <img src={currentUser.logoUrl} alt="Logo" className="h-8 w-auto mx-auto mb-2 object-contain" />
                )}
                <div className="font-bold text-sm mb-1 text-slate-900">{currentUser.wifiName || settings.businessName || 'WIFI VOUCHER'}</div>
                <div className="text-xs font-medium text-slate-500 mb-3">{settings.ssid && `SSID: ${settings.ssid}`}</div>
                <div className="text-2xl font-mono font-extrabold tracking-widest text-slate-900 my-2">{v.code}</div>
                <div className="flex justify-between text-[10px] font-bold text-slate-500 mt-3 border-t border-slate-100 pt-3 uppercase tracking-wider">
                  <span>{v.period}</span>
                  <span>Rp {v.price.toLocaleString('id-ID')}</span>
                </div>
              </div>
            ))}
          </div>

          <Button onClick={handleBrowserPrint} className="w-full h-12 text-base mb-4" variant="secondary">
            <Printer className="h-5 w-5 mr-2" /> Buka Dialog Print
          </Button>

          <div className="border-t border-slate-100 pt-5">
            <p className="text-sm font-bold text-slate-900 mb-4 text-center">Apakah voucher berhasil dicetak dengan baik?</p>
            <div className="flex gap-3">
              <Button variant="outline" onClick={handleConfirmFailed} className="flex-1 h-12 text-red-600 hover:text-red-700 hover:bg-red-50 border-red-200 font-bold">
                <AlertCircle className="h-5 w-5 mr-2" /> Gagal / Batal
              </Button>
              <Button onClick={handleConfirmSuccess} className="flex-1 h-12 bg-emerald-600 hover:bg-emerald-700 text-white font-bold shadow-[0_4px_14px_0_rgb(16,185,129,0.3)]">
                <CheckCircle2 className="h-5 w-5 mr-2" /> Ya, Berhasil
              </Button>
            </div>
          </div>
        </div>
      </Modal>
    </motion.div>
  );
}
