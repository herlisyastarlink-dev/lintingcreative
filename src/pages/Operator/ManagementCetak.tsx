import * as React from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent } from '@/components/Card';
import { Button } from '@/components/Button';
import { Input } from '@/components/Input';
import { Modal } from '@/components/Modal';
import { useStore, PrintTemplate } from '@/store';
import { Printer, LayoutTemplate, FileText, Plus, Trash2, Edit2, CheckCircle2, AlertCircle } from 'lucide-react';
import { calculateTemplate, TemplateParams, CalculationResult } from '@/lib/TemplateCalculator';
import { DEFAULT_TEMPLATE_CSS, generateVoucherHtml } from '@/lib/TemplateEngine';

export function OperatorManagementCetak() {
  const { settings, updateSettings, printTemplates, addPrintTemplate, updatePrintTemplate, deletePrintTemplate } = useStore();
  const [isMappingModalOpen, setIsMappingModalOpen] = React.useState(false);
  const [isTemplateModalOpen, setIsTemplateModalOpen] = React.useState(false);
  const [selectedTemplate, setSelectedTemplate] = React.useState<PrintTemplate | null>(null);

  const [newMapping, setNewMapping] = React.useState({ price: '', color: 'bg-blue-100', accent: 'text-blue-700' });

  // Template Form State
  const [tab, setTab] = React.useState<'param' | 'css' | 'preview'>('param');
  const [tplName, setTplName] = React.useState('');
  const [tplParams, setTplParams] = React.useState<TemplateParams>({
    paperPreset: 'F4',
    orientation: 'landscape',
    columns: 5,
    rows: 6,
    marginMm: 5,
    gapXmm: 4,
    gapYmm: 4,
  });
  const [tplCalc, setTplCalc] = React.useState<CalculationResult | null>(null);
  const [tplCss, setTplCss] = React.useState('');
  const [showDetail, setShowDetail] = React.useState(false);

  React.useEffect(() => {
    const calc = calculateTemplate(tplParams);
    setTplCalc(calc);
  }, [tplParams]);

  React.useEffect(() => {
    // Inject default thermal templates if they don't exist
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
        cssText: `:root {\n  --paper-w-mm: 80;\n  --paper-h-mm: 50;\n  --margin-mm: 2;\n  --gap-x-mm: 0;\n  --gap-y-mm: 0;\n  --voucher-w-mm: 76;\n  --voucher-h-mm: 46;\n  --cols: 1;\n  --rows: 1;\n}\n${DEFAULT_TEMPLATE_CSS}`,
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
        cssText: `:root {\n  --paper-w-mm: 58;\n  --paper-h-mm: 40;\n  --margin-mm: 2;\n  --gap-x-mm: 0;\n  --gap-y-mm: 0;\n  --voucher-w-mm: 54;\n  --voucher-h-mm: 36;\n  --cols: 1;\n  --rows: 1;\n}\n${DEFAULT_TEMPLATE_CSS}`,
        isActive: true,
      } as any);
    }
  }, [printTemplates, addPrintTemplate]);

  const handleOpenAddTemplate = () => {
    setSelectedTemplate(null);
    setTplName('');
    setTplParams({
      paperPreset: 'F4',
      orientation: 'landscape',
      columns: 5,
      rows: 6,
      marginMm: 5,
      gapXmm: 4,
      gapYmm: 4,
    });
    setTplCss('');
    setTab('param');
    setIsTemplateModalOpen(true);
  };

  const handleOpenEditTemplate = (t: PrintTemplate) => {
    setSelectedTemplate(t);
    setTplName(t.name);
    setTplParams({
      paperPreset: t.paperPreset,
      customWidth: t.paperPreset === 'CUSTOM' ? (t.orientation === 'portrait' ? t.widthMm : t.heightMm) : undefined,
      customHeight: t.paperPreset === 'CUSTOM' ? (t.orientation === 'portrait' ? t.heightMm : t.widthMm) : undefined,
      orientation: t.orientation,
      columns: t.columns,
      rows: t.rows,
      marginMm: t.marginMm,
      gapXmm: t.gapXmm,
      gapYmm: t.gapYmm,
    });
    setTplCss(t.cssText);
    setTab('param');
    setIsTemplateModalOpen(true);
  };

  const handleSaveTemplate = () => {
    if (!tplCalc || tplCalc.error) {
      alert('Perbaiki error pada parameter sebelum menyimpan.');
      return;
    }

    const finalCss = tplCss || `:root {
  --paper-w-mm: ${tplCalc.widthMm};
  --paper-h-mm: ${tplCalc.heightMm};
  --margin-mm: ${tplParams.marginMm};
  --gap-x-mm: ${tplParams.gapXmm};
  --gap-y-mm: ${tplParams.gapYmm};
  --voucher-w-mm: ${tplCalc.voucherWidthMm.toFixed(2)};
  --voucher-h-mm: ${tplCalc.voucherHeightMm.toFixed(2)};
  --cols: ${tplParams.columns};
  --rows: ${tplParams.rows};
}
${DEFAULT_TEMPLATE_CSS}`;

    const templateData = {
      name: tplName || 'Template Baru',
      paperPreset: tplParams.paperPreset,
      widthMm: tplCalc.widthMm,
      heightMm: tplCalc.heightMm,
      orientation: tplParams.orientation,
      columns: tplParams.columns,
      rows: tplParams.rows,
      marginMm: tplParams.marginMm,
      gapXmm: tplParams.gapXmm,
      gapYmm: tplParams.gapYmm,
      effectiveWidthMm: tplCalc.effectiveWidthMm,
      effectiveHeightMm: tplCalc.effectiveHeightMm,
      voucherWidthMm: tplCalc.voucherWidthMm,
      voucherHeightMm: tplCalc.voucherHeightMm,
      cssText: finalCss,
      isActive: true,
    };

    if (selectedTemplate) {
      updatePrintTemplate(selectedTemplate.id, templateData);
    } else {
      addPrintTemplate(templateData);
    }
    setIsTemplateModalOpen(false);
  };

  const handleDeleteTemplate = (id: string) => {
    if (window.confirm('Hapus template ini?')) {
      deletePrintTemplate(id);
    }
  };

  const handleTestPrint = (t: PrintTemplate) => {
    const printWindow = window.open('', '_blank');
    if (!printWindow) {
      alert('Pop-up diblokir oleh browser. Silakan izinkan pop-up untuk situs ini.');
      return;
    }
    
    const html = `
      <!DOCTYPE html>
      <html>
        <head>
          <title>Test Print - ${t.name}</title>
          <style>${t.cssText}</style>
        </head>
        <body>
          <div class="print-container with-crop">
            ${generateVoucherHtml(Array.from({ length: t.columns * t.rows }), settings.businessName || 'WIFI VOUCHER')}
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

  const getPreviewHtml = () => {
    if (!tplCalc) return '';
    const css = tplCss || `:root {
  --paper-w-mm: ${tplCalc.widthMm};
  --paper-h-mm: ${tplCalc.heightMm};
  --margin-mm: ${tplParams.marginMm};
  --gap-x-mm: ${tplParams.gapXmm};
  --gap-y-mm: ${tplParams.gapYmm};
  --voucher-w-mm: ${tplCalc.voucherWidthMm.toFixed(2)};
  --voucher-h-mm: ${tplCalc.voucherHeightMm.toFixed(2)};
  --cols: ${tplParams.columns};
  --rows: ${tplParams.rows};
}
${DEFAULT_TEMPLATE_CSS}`;

    return `
      <!DOCTYPE html>
      <html>
        <head>
          <style>
            body { background: #f1f5f9; padding: 20px; display: flex; justify-content: center; }
            ${css}
            .print-container { box-shadow: 0 10px 25px -5px rgba(0,0,0,0.1); transform-origin: top center; transform: scale(0.6); }
          </style>
        </head>
        <body>
          <div class="print-container with-crop">
            ${generateVoucherHtml(Array.from({ length: tplCalc.totalVouchers }), settings.businessName || 'WIFI VOUCHER')}
          </div>
        </body>
      </html>
    `;
  };

  const handleAddMapping = () => {
    if (!newMapping.price) return;
    const mappings = [...(settings.templateMappings || [])];
    mappings.push({
      price: Number(newMapping.price),
      color: newMapping.color,
      accent: newMapping.accent,
    });
    updateSettings({ templateMappings: mappings });
    setNewMapping({ price: '', color: 'bg-blue-100', accent: 'text-blue-700' });
  };

  const handleDeleteMapping = (index: number) => {
    const mappings = [...(settings.templateMappings || [])];
    mappings.splice(index, 1);
    updateSettings({ templateMappings: mappings });
  };

  const colorOptions = [
    { label: 'Biru', color: 'bg-blue-100', accent: 'text-blue-700' },
    { label: 'Hijau', color: 'bg-emerald-100', accent: 'text-emerald-700' },
    { label: 'Merah', color: 'bg-red-100', accent: 'text-red-700' },
    { label: 'Kuning', color: 'bg-amber-100', accent: 'text-amber-700' },
    { label: 'Pink', color: 'bg-pink-100', accent: 'text-pink-700' },
    { label: 'Ungu', color: 'bg-purple-100', accent: 'text-purple-700' },
    { label: 'Abu-abu', color: 'bg-slate-100', accent: 'text-slate-700' },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-6"
    >
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Management Cetak</h1>
          <p className="text-sm text-slate-500">Atur template print global untuk semua reseller.</p>
        </div>
        <Button onClick={handleOpenAddTemplate} size="sm" className="gap-2">
          <Plus className="h-4 w-4" />
          <span className="hidden sm:inline">Tambah</span>
        </Button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {Array.from(new Map(printTemplates.map(t => [t.id, t])).values()).map((t) => (
          <Card key={t.id} className="bg-white/80 backdrop-blur-xl border-white/50">
            <CardContent className="p-5">
              <div className="flex items-start gap-4">
                <div className="p-3 bg-blue-50 text-blue-600 rounded-2xl">
                  <LayoutTemplate className="h-6 w-6" />
                </div>
                <div className="flex-1">
                  <div className="flex justify-between items-start">
                    <h3 className="font-semibold text-slate-900">{t.name}</h3>
                    <button onClick={() => handleDeleteTemplate(t.id)} className="text-slate-400 hover:text-red-500">
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                  <p className="text-xs text-slate-500 mb-3">{t.columns * t.rows} voucher per halaman ({t.paperPreset} {t.orientation})</p>
                  <div className="flex gap-2">
                    <Button 
                      variant="outline" 
                      size="sm" 
                      className="flex-1 text-xs h-8"
                      onClick={() => handleOpenEditTemplate(t)}
                    >
                      <Edit2 className="h-3 w-3 mr-1" /> Edit
                    </Button>
                    <Button size="sm" className="flex-1 text-xs h-8" onClick={() => handleTestPrint(t)}>
                      Test Print
                    </Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <Card className="bg-blue-50/50 border-blue-100 mt-6">
        <CardContent className="p-4">
          <h4 className="font-medium text-blue-900 mb-2 text-sm">Mapping Template per Harga</h4>
          <p className="text-xs text-blue-700 mb-4">
            Anda dapat mengatur warna atau aksen template berbeda untuk setiap nominal harga voucher (misal: 2000 warna biru, 5000 warna merah).
          </p>
          <Button variant="secondary" className="w-full text-sm" onClick={() => setIsMappingModalOpen(true)}>
            Atur Mapping Warna
          </Button>
        </CardContent>
      </Card>

      <Modal
        isOpen={isTemplateModalOpen}
        onClose={() => setIsTemplateModalOpen(false)}
        title={selectedTemplate ? `Edit Template: ${selectedTemplate.name}` : 'Tambah Template Baru'}
        className="max-w-6xl h-[90vh]"
      >
        <div className="flex flex-col h-full max-h-[calc(90vh-100px)]">
          <div className="flex border-b border-slate-200 mb-4">
            <button
              className={`px-4 py-2 text-sm font-medium border-b-2 transition-colors ${tab === 'param' ? 'border-blue-600 text-blue-600' : 'border-transparent text-slate-500 hover:text-slate-700'}`}
              onClick={() => setTab('param')}
            >
              Parameter
            </button>
            <button
              className={`px-4 py-2 text-sm font-medium border-b-2 transition-colors ${tab === 'css' ? 'border-blue-600 text-blue-600' : 'border-transparent text-slate-500 hover:text-slate-700'}`}
              onClick={() => setTab('css')}
            >
              CSS & Live Preview
            </button>
          </div>

          <div className="flex-1 overflow-hidden">
            {tab === 'param' && (
              <div className="h-full overflow-y-auto pr-2 space-y-4">
                <Input
                  label="Nama Template"
                  placeholder="Contoh: F4 Landscape 5x6"
                  value={tplName}
                  onChange={(e) => setTplName(e.target.value)}
                />
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium text-slate-700 mb-1.5 block">Paper Preset</label>
                    <select
                      className="flex h-11 w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500"
                      value={tplParams.paperPreset}
                      onChange={(e) => setTplParams({ ...tplParams, paperPreset: e.target.value as any })}
                    >
                      <option value="A4">A4 (210x297 mm)</option>
                      <option value="F4">F4 (215x330 mm)</option>
                      <option value="THERMAL80">Thermal 80mm</option>
                      <option value="THERMAL58">Thermal 58mm</option>
                      <option value="CUSTOM">Custom</option>
                    </select>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-slate-700 mb-1.5 block">Orientasi</label>
                    <div className="flex rounded-xl bg-slate-100 p-1">
                      <button
                        className={`flex-1 rounded-lg py-1.5 text-sm font-medium ${tplParams.orientation === 'portrait' ? 'bg-white text-blue-600 shadow-sm' : 'text-slate-500'}`}
                        onClick={() => setTplParams({ ...tplParams, orientation: 'portrait' })}
                      >
                        Portrait
                      </button>
                      <button
                        className={`flex-1 rounded-lg py-1.5 text-sm font-medium ${tplParams.orientation === 'landscape' ? 'bg-white text-blue-600 shadow-sm' : 'text-slate-500'}`}
                        onClick={() => setTplParams({ ...tplParams, orientation: 'landscape' })}
                      >
                        Landscape
                      </button>
                    </div>
                  </div>
                </div>

                {tplParams.paperPreset === 'CUSTOM' && (
                  <div className="grid grid-cols-2 gap-4">
                    <Input
                      label="Lebar Kertas (mm)"
                      type="number"
                      value={tplParams.customWidth || ''}
                      onChange={(e) => setTplParams({ ...tplParams, customWidth: Number(e.target.value) })}
                    />
                    <Input
                      label="Tinggi Kertas (mm)"
                      type="number"
                      value={tplParams.customHeight || ''}
                      onChange={(e) => setTplParams({ ...tplParams, customHeight: Number(e.target.value) })}
                    />
                  </div>
                )}

                <div className="grid grid-cols-2 gap-4">
                  <Input
                    label="Kolom (C)"
                    type="number"
                    value={tplParams.columns}
                    onChange={(e) => setTplParams({ ...tplParams, columns: Number(e.target.value) })}
                  />
                  <Input
                    label="Baris (R)"
                    type="number"
                    value={tplParams.rows}
                    onChange={(e) => setTplParams({ ...tplParams, rows: Number(e.target.value) })}
                  />
                </div>

                <div className="grid grid-cols-3 gap-4">
                  <Input
                    label="Margin (mm)"
                    type="number"
                    value={tplParams.marginMm}
                    onChange={(e) => setTplParams({ ...tplParams, marginMm: Number(e.target.value) })}
                  />
                  <Input
                    label="Gap X (mm)"
                    type="number"
                    value={tplParams.gapXmm}
                    onChange={(e) => setTplParams({ ...tplParams, gapXmm: Number(e.target.value) })}
                  />
                  <Input
                    label="Gap Y (mm)"
                    type="number"
                    value={tplParams.gapYmm}
                    onChange={(e) => setTplParams({ ...tplParams, gapYmm: Number(e.target.value) })}
                  />
                </div>

                <div className="pt-4">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input type="checkbox" checked={showDetail} onChange={(e) => setShowDetail(e.target.checked)} className="rounded text-blue-600" />
                    <span className="text-sm font-medium text-slate-700">Tampilkan perhitungan detail</span>
                  </label>
                </div>

                {showDetail && tplCalc && (
                  <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 text-sm space-y-2 font-mono">
                    <div className="flex justify-between"><span>Kertas Final:</span> <span>{tplCalc.widthMm} x {tplCalc.heightMm} mm</span></div>
                    <div className="flex justify-between"><span>Area Efektif:</span> <span>{tplCalc.effectiveWidthMm} x {tplCalc.effectiveHeightMm} mm</span></div>
                    <div className="flex justify-between"><span>Total Gap (X/Y):</span> <span>{tplCalc.gapXTotal} / {tplCalc.gapYTotal} mm</span></div>
                    <div className="flex justify-between font-bold text-blue-700 border-t pt-2">
                      <span>Ukuran Voucher:</span> 
                      <span>{tplCalc.voucherWidthMm.toFixed(1)} x {tplCalc.voucherHeightMm.toFixed(1)} mm</span>
                    </div>
                    <div className="flex justify-between text-slate-500"><span>Total per halaman:</span> <span>{tplCalc.totalVouchers} pcs</span></div>
                  </div>
                )}

                {tplCalc?.error && (
                  <div className="flex items-center gap-2 rounded-xl bg-red-50 p-3 text-sm text-red-700 border border-red-100">
                    <AlertCircle className="h-5 w-5" /> {tplCalc.error}
                  </div>
                )}
                {tplCalc?.warning && (
                  <div className="flex items-center gap-2 rounded-xl bg-amber-50 p-3 text-sm text-amber-700 border border-amber-100">
                    <AlertCircle className="h-5 w-5" /> {tplCalc.warning}
                  </div>
                )}
              </div>
            )}

            {tab === 'css' && (
              <div className="h-full flex flex-col lg:flex-row gap-4">
                <div className="flex-1 flex flex-col h-full">
                  <div className="flex justify-between items-center mb-2">
                    <p className="text-xs text-slate-500 font-bold uppercase">CSS Editor</p>
                    <p className="text-[10px] text-slate-400">Gunakan var: --paper-w-mm, --voucher-w-mm</p>
                  </div>
                  <textarea
                    className="flex-1 w-full rounded-xl border border-slate-200 bg-slate-900 text-slate-50 p-4 font-mono text-xs focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 resize-none leading-relaxed"
                    value={tplCss}
                    onChange={(e) => setTplCss(e.target.value)}
                    placeholder="/* Masukkan CSS kustom di sini */"
                    spellCheck={false}
                  />
                </div>
                <div className="flex-1 flex flex-col h-full bg-slate-100 rounded-xl overflow-hidden border border-slate-200 relative">
                  <div className="absolute top-2 right-2 z-10 bg-white/80 backdrop-blur px-2 py-1 rounded text-[10px] font-bold text-slate-500 border border-slate-200">
                    Live Preview
                  </div>
                  <iframe
                    srcDoc={getPreviewHtml()}
                    className="w-full h-full border-0"
                    title="Preview"
                  />
                </div>
              </div>
            )}
          </div>

          <div className="flex justify-end gap-2 pt-4 border-t border-slate-100 mt-4">
            <Button variant="ghost" onClick={() => setIsTemplateModalOpen(false)}>Batal</Button>
            <Button onClick={handleSaveTemplate} disabled={!!tplCalc?.error}>Simpan Template</Button>
          </div>
        </div>
      </Modal>

      <Modal
        isOpen={isMappingModalOpen}
        onClose={() => setIsMappingModalOpen(false)}
        title="Mapping Warna per Harga"
      >
        <div className="space-y-6">
          <div className="space-y-3">
            <h4 className="text-sm font-medium text-slate-700">Daftar Mapping</h4>
            {(!settings.templateMappings || settings.templateMappings.length === 0) ? (
              <div className="text-sm text-slate-500 text-center py-4 bg-slate-50 rounded-xl">
                Belum ada mapping warna
              </div>
            ) : (
              <div className="space-y-2">
                {settings.templateMappings.map((map, idx) => (
                  <div key={idx} className="flex items-center justify-between p-3 border rounded-xl bg-white">
                    <div className="flex items-center gap-3">
                      <div className={`w-6 h-6 rounded-full ${map.color} border border-slate-200`} />
                      <span className="font-medium text-sm">Rp {map.price.toLocaleString('id-ID')}</span>
                    </div>
                    <button 
                      onClick={() => handleDeleteMapping(idx)}
                      className="text-slate-400 hover:text-red-500 p-1"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="pt-4 border-t border-slate-100">
            <h4 className="text-sm font-medium text-slate-700 mb-3">Tambah Mapping Baru</h4>
            <div className="flex gap-2 items-end">
              <div className="flex-1">
                <Input 
                  label="Harga (Rp)" 
                  type="number" 
                  placeholder="Contoh: 2000"
                  value={newMapping.price}
                  onChange={(e) => setNewMapping({ ...newMapping, price: e.target.value })}
                />
              </div>
              <div className="flex-1">
                <label className="text-sm font-medium text-slate-700 mb-1.5 block">Warna</label>
                <select 
                  className="flex h-11 w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500"
                  value={`${newMapping.color}|${newMapping.accent}`}
                  onChange={(e) => {
                    const [color, accent] = e.target.value.split('|');
                    setNewMapping({ ...newMapping, color, accent });
                  }}
                >
                  {colorOptions.map((opt) => (
                    <option key={opt.label} value={`${opt.color}|${opt.accent}`}>
                      {opt.label}
                    </option>
                  ))}
                </select>
              </div>
              <Button onClick={handleAddMapping} className="h-11 px-4">
                <Plus className="h-5 w-5" />
              </Button>
            </div>
          </div>
        </div>
      </Modal>
    </motion.div>
  );
}
