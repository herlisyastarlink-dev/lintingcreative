import { Link } from 'react-router-dom';
import { motion } from 'motion/react';
import { Button } from '@/components/Button';
import { Card, CardContent } from '@/components/Card';
import { Wifi, Zap, ShieldCheck } from 'lucide-react';
import { useStore } from '@/store';

export function Landing() {
  const { settings } = useStore();

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-pink-50 flex flex-col items-center justify-center p-6 relative overflow-hidden">
      {/* Decorative background elements */}
      <div className="absolute top-[-10%] left-[-10%] w-96 h-96 bg-blue-400/20 rounded-full blur-3xl" />
      <div className="absolute bottom-[-10%] right-[-10%] w-96 h-96 bg-pink-400/20 rounded-full blur-3xl" />

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: 'easeOut' }}
        className="w-full max-w-md z-10 flex flex-col items-center text-center"
      >
        <div className="mb-8 flex h-20 w-20 items-center justify-center rounded-3xl bg-gradient-to-br from-blue-600 to-blue-500 shadow-xl shadow-blue-500/30">
          <Wifi className="h-10 w-10 text-white" />
        </div>

        <h1 className="mb-4 text-4xl font-extrabold tracking-tight text-slate-900">
          {settings.businessName || 'LINTING CREATIVE'}
        </h1>
        <p className="mb-10 text-lg text-slate-600 font-medium">
          Sistem Manajemen WiFi & Voucher Modern
        </p>

        <div className="grid grid-cols-1 gap-4 w-full mb-10">
          <Card className="bg-white/60">
            <CardContent className="p-4 flex items-center gap-4">
              <div className="p-3 bg-blue-100 rounded-2xl text-blue-600">
                <Zap className="h-6 w-6" />
              </div>
              <div className="text-left">
                <h3 className="font-semibold text-slate-900">Cepat & Mudah</h3>
                <p className="text-sm text-slate-500">Kelola voucher dalam hitungan detik</p>
              </div>
            </CardContent>
          </Card>
          <Card className="bg-white/60">
            <CardContent className="p-4 flex items-center gap-4">
              <div className="p-3 bg-pink-100 rounded-2xl text-pink-600">
                <ShieldCheck className="h-6 w-6" />
              </div>
              <div className="text-left">
                <h3 className="font-semibold text-slate-900">Aman & Terpusat</h3>
                <p className="text-sm text-slate-500">Sistem role-based untuk Operator & Reseller</p>
              </div>
            </CardContent>
          </Card>
        </div>

        <Link to="/login" className="w-full">
          <Button size="lg" className="w-full rounded-2xl text-lg font-semibold shadow-xl shadow-blue-600/20">
            Masuk ke Sistem
          </Button>
        </Link>
      </motion.div>
    </div>
  );
}
