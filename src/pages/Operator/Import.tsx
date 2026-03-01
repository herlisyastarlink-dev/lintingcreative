import * as React from 'react';
import { motion } from 'motion/react';
import { read, utils } from 'xlsx';
import { Button } from '@/components/Button';
import { Card, CardContent } from '@/components/Card';
import { useStore } from '@/store';
import { UploadCloud, FileSpreadsheet, CheckCircle2, AlertCircle } from 'lucide-react';

export function OperatorImport() {
  const { users, importVouchers } = useStore();
  const resellers = users.filter((u) => u.role === 'reseller');

  const [file, setFile] = React.useState<File | null>(null);
  const [resellerId, setResellerId] = React.useState<string>('');
  const [status, setStatus] = React.useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [message, setMessage] = React.useState('');

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
      setStatus('idle');
      setMessage('');
    }
  };

  const handleImport = async () => {
    if (!file) {
      setStatus('error');
      setMessage('Pilih file Excel terlebih dahulu');
      return;
    }

    setStatus('loading');
    setMessage('Memproses file...');

    try {
      const reader = new FileReader();
      reader.onload = (e) => {
        try {
          const data = e.target?.result;
          const workbook = read(data, { type: 'binary' });
          const sheetName = workbook.SheetNames[0];
          const worksheet = workbook.Sheets[sheetName];
          const json = utils.sheet_to_json<any>(worksheet);

          if (json.length === 0) {
            throw new Error('File Excel kosong');
          }

          const requiredColumns = ['Kode voucher', 'Grup pengguna', 'Harga', 'Periode'];
          const firstRow = json[0];
          const missingColumns = requiredColumns.filter((col) => !(col in firstRow));

          if (missingColumns.length > 0) {
            throw new Error(`Kolom hilang: ${missingColumns.join(', ')}`);
          }

          const newVouchers = json.map((row) => ({
            code: String(row['Kode voucher']),
            group: String(row['Grup pengguna']),
            price: Number(row['Harga']),
            period: String(row['Periode']),
            resellerId: resellerId || null,
          }));

          importVouchers(newVouchers);
          setStatus('success');
          setMessage(`Berhasil import ${newVouchers.length} voucher`);
          setFile(null);
        } catch (error: any) {
          setStatus('error');
          setMessage(error.message || 'Gagal memproses file Excel');
        }
      };
      reader.onerror = () => {
        setStatus('error');
        setMessage('Gagal membaca file');
      };
      reader.readAsBinaryString(file);
    } catch (error: any) {
      setStatus('error');
      setMessage(error.message || 'Terjadi kesalahan');
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-6"
    >
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-slate-900">Import Voucher</h1>
        <p className="text-sm text-slate-500">Upload file Excel (XLSX) untuk menambah data voucher.</p>
      </div>

      <Card className="bg-white/80 backdrop-blur-xl border-white/50">
        <CardContent className="p-6 space-y-6">
          <div className="space-y-2">
            <label className="text-sm font-medium text-slate-700">Pilih Reseller (Opsional)</label>
            <select
              className="flex h-11 w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 transition-all"
              value={resellerId}
              onChange={(e) => setResellerId(e.target.value)}
            >
              <option value="">-- Tanpa Reseller (Global) --</option>
              {resellers.map((r) => (
                <option key={r.id} value={r.id}>
                  {r.name} (@{r.username})
                </option>
              ))}
            </select>
          </div>

          <div
            className={`relative flex flex-col items-center justify-center rounded-2xl border-2 border-dashed p-8 transition-colors ${
              file ? 'border-blue-500 bg-blue-50/50' : 'border-slate-300 hover:border-blue-400 hover:bg-slate-50'
            }`}
          >
            <input
              type="file"
              accept=".xlsx, .xls"
              onChange={handleFileChange}
              className="absolute inset-0 z-10 h-full w-full cursor-pointer opacity-0"
            />
            {file ? (
              <>
                <FileSpreadsheet className="mb-3 h-10 w-10 text-blue-500" />
                <p className="text-sm font-medium text-slate-700">{file.name}</p>
                <p className="text-xs text-slate-500 mt-1">{(file.size / 1024).toFixed(2)} KB</p>
              </>
            ) : (
              <>
                <UploadCloud className="mb-3 h-10 w-10 text-slate-400" />
                <p className="text-sm font-medium text-slate-700">Klik atau drag file ke sini</p>
                <p className="text-xs text-slate-500 mt-1">Format: .xlsx, .xls</p>
              </>
            )}
          </div>

          <div className="bg-slate-50 rounded-xl p-4 border border-slate-100">
            <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-500 mb-2">Format Wajib:</h4>
            <ul className="text-sm text-slate-600 space-y-1 list-disc list-inside">
              <li>Kode voucher</li>
              <li>Grup pengguna</li>
              <li>Harga (angka)</li>
              <li>Periode (misal: 3Jam, 1Hari)</li>
            </ul>
          </div>

          {status === 'success' && (
            <div className="flex items-center gap-2 rounded-xl bg-emerald-50 p-3 text-sm text-emerald-700 border border-emerald-100">
              <CheckCircle2 className="h-5 w-5" />
              {message}
            </div>
          )}

          {status === 'error' && (
            <div className="flex items-center gap-2 rounded-xl bg-red-50 p-3 text-sm text-red-700 border border-red-100">
              <AlertCircle className="h-5 w-5" />
              {message}
            </div>
          )}

          <Button
            onClick={handleImport}
            disabled={!file || status === 'loading'}
            className="w-full"
            size="lg"
          >
            {status === 'loading' ? 'Memproses...' : 'Import Sekarang'}
          </Button>
        </CardContent>
      </Card>
    </motion.div>
  );
}
