import * as React from 'react';
import { motion } from 'motion/react';
import { Card, CardContent } from '@/components/Card';
import { Button } from '@/components/Button';
import { Printer, FileText } from 'lucide-react';

export function OperatorPrint() {
  const handlePrint = () => {
    window.print();
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-6"
    >
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-slate-900">Quick Print</h1>
        <p className="text-sm text-slate-500">Shortcut cetak PDF F4 Landscape/Portrait.</p>
      </div>

      <Card className="bg-white/80 backdrop-blur-xl border-white/50">
        <CardContent className="p-6 space-y-6 flex flex-col items-center justify-center text-center">
          <div className="p-4 bg-blue-50 text-blue-600 rounded-full mb-2">
            <Printer className="h-10 w-10" />
          </div>
          <h3 className="text-lg font-semibold text-slate-900">Cetak Voucher</h3>
          <p className="text-sm text-slate-500 max-w-xs">
            Pilih mode cetak untuk menghasilkan PDF siap print. Pastikan ukuran kertas F4 diatur pada dialog print browser.
          </p>
          <div className="flex flex-col w-full gap-3 mt-4">
            <Button onClick={handlePrint} size="lg" className="w-full gap-2">
              <FileText className="h-5 w-5" />
              Cetak F4 Landscape (30 pcs)
            </Button>
            <Button onClick={handlePrint} variant="secondary" size="lg" className="w-full gap-2">
              <FileText className="h-5 w-5" />
              Cetak F4 Portrait (20 pcs)
            </Button>
          </div>
        </CardContent>
      </Card>

      <div className="hidden print:block print-area p-8">
        <div className="text-center font-bold text-2xl mb-8">SAMPLE CETAK VOUCHER</div>
        <div className="grid grid-cols-5 gap-4">
          {Array.from({ length: 30 }).map((_, i) => (
            <div key={i} className="border-2 border-slate-800 p-4 text-center rounded-lg">
              <div className="font-bold text-sm">WIFI VOUCHER</div>
              <div className="text-xs mb-2">3 Jam - Rp 2.000</div>
              <div className="font-mono font-bold text-lg tracking-widest">A{i}B2C3</div>
            </div>
          ))}
        </div>
      </div>
    </motion.div>
  );
}
