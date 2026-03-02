import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Button } from '@/components/Button';
import { Card, CardContent } from '@/components/Card';
import { useStore } from '@/store';
import { Wifi, Zap, ShieldCheck, Printer, BarChart3, ArrowRight, Check, Globe, Smartphone } from 'lucide-react';

export function Landing() {
  const { settings } = useStore();
  const features = [
    {
      icon: <Zap className="h-6 w-6 text-amber-500" />,
      title: "Cepat & Instan",
      desc: "Generate ribuan voucher dalam hitungan detik dengan performa tinggi."
    },
    {
      icon: <Printer className="h-6 w-6 text-blue-500" />,
      title: "Cetak Fleksibel",
      desc: "Dukungan printer thermal bluetooth & cetak massal A4/F4."
    },
    {
      icon: <ShieldCheck className="h-6 w-6 text-emerald-500" />,
      title: "Aman & Terpusat",
      desc: "Sistem manajemen user & reseller dengan keamanan tingkat lanjut."
    },
    {
      icon: <BarChart3 className="h-6 w-6 text-purple-500" />,
      title: "Laporan Detail",
      desc: "Pantau penjualan, omzet, dan performa bisnis secara realtime."
    }
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5 } }
  };

  return (
    <div className="min-h-screen bg-slate-50 relative overflow-x-hidden font-sans selection:bg-blue-100 selection:text-blue-900">
      {/* Animated Background Elements */}
      <div className="fixed inset-0 z-0 pointer-events-none overflow-hidden">
        <motion.div 
          animate={{ 
            scale: [1, 1.2, 1],
            rotate: [0, 90, 0],
            x: [0, 100, 0],
            y: [0, -50, 0]
          }}
          transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
          className="absolute top-[-10%] right-[-5%] w-[600px] h-[600px] rounded-full bg-blue-400/10 blur-[100px]" 
        />
        <motion.div 
          animate={{ 
            scale: [1, 1.5, 1],
            rotate: [0, -60, 0],
            x: [0, -80, 0],
            y: [0, 100, 0]
          }}
          transition={{ duration: 25, repeat: Infinity, ease: "linear" }}
          className="absolute bottom-[-10%] left-[-10%] w-[700px] h-[700px] rounded-full bg-purple-400/10 blur-[120px]" 
        />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-[0.03]"></div>
      </div>

      {/* Navbar */}
      <nav className="relative z-50 px-6 py-6 flex items-center justify-between max-w-7xl mx-auto">
        <motion.div 
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="flex items-center gap-3 bg-slate-900/80 backdrop-blur-md p-2 pr-6 rounded-full border border-white/10 shadow-lg"
        >
          {settings?.logoUrl ? (
            <img src={settings.logoUrl} alt="App Logo" className="h-10 w-auto object-contain" />
          ) : (
            <div className="h-10 w-10 bg-gradient-to-br from-blue-600 to-purple-600 rounded-full flex items-center justify-center text-white shadow-lg shadow-blue-600/20">
              <Wifi className="h-5 w-5" />
            </div>
          )}
          <div className="flex flex-col">
            <span className="font-extrabold text-lg tracking-tight text-white leading-none">
              {settings?.businessName || 'WASPOINT.NET'}
            </span>
            <span className="text-[10px] font-bold text-blue-200 tracking-widest uppercase">
              PT. ANUGERAH WASPOINT NETWORK
            </span>
          </div>
        </motion.div>
        <Link to="/login">
          <Button variant="secondary" size="sm" className="rounded-xl font-bold shadow-lg shadow-blue-900/10 border-white/20 bg-white/90 hover:bg-white transition-all text-slate-900">
            Masuk Dashboard
          </Button>
        </Link>
      </nav>

      {/* Hero Section */}
      <section className="relative z-10 px-6 pt-12 pb-24 max-w-7xl mx-auto text-center md:pt-24">
        <motion.div
          initial="hidden"
          animate="visible"
          variants={containerVariants}
          className="max-w-4xl mx-auto"
        >
          <motion.div variants={itemVariants} className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/80 backdrop-blur-sm border border-slate-200/60 shadow-sm mb-8 hover:shadow-md transition-all cursor-default">
            <span className="relative flex h-2.5 w-2.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500"></span>
            </span>
            <span className="text-xs font-bold text-slate-600 tracking-wide uppercase">Solusi Internet Desa & Kota</span>
          </motion.div>
          
          <motion.h1 variants={itemVariants} className="text-5xl md:text-7xl font-extrabold text-slate-900 tracking-tight leading-[1.1] mb-8">
            Revolusi Bisnis WiFi <br className="hidden md:block" />
            dengan <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 animate-gradient-x">WASPOINT.NET</span>
          </motion.h1>
          
          <motion.p variants={itemVariants} className="text-lg md:text-xl text-slate-500 font-medium leading-relaxed mb-12 max-w-2xl mx-auto">
            Platform manajemen voucher WiFi tercanggih dari <strong>PT. ANUGERAH WASPOINT NETWORK</strong>. 
            Kelola ribuan voucher, pantau omzet, dan perluas jaringan reseller Anda dalam satu aplikasi.
          </motion.p>

          <motion.div variants={itemVariants} className="flex flex-col sm:flex-row items-center justify-center gap-4 w-full sm:w-auto">
            <Link to="/login" className="w-full sm:w-auto">
              <Button size="lg" className="w-full sm:w-auto h-14 text-lg shadow-xl shadow-blue-600/20 rounded-2xl bg-gradient-to-r from-blue-600 to-purple-600 border-0 hover:scale-105 transition-transform duration-200">
                Mulai Sekarang <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>
            <a href="#features" className="w-full sm:w-auto">
              <Button variant="secondary" size="lg" className="w-full sm:w-auto h-14 text-lg border-slate-200 bg-white/60 backdrop-blur-md rounded-2xl hover:bg-white hover:scale-105 transition-all duration-200">
                Pelajari Fitur
              </Button>
            </a>
          </motion.div>
        </motion.div>
      </section>

      {/* Features Grid */}
      <section id="features" className="relative z-10 px-6 py-24 bg-white/40 backdrop-blur-3xl border-t border-white/50">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-20">
            <motion.h2 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-3xl md:text-4xl font-bold text-slate-900 mb-4"
            >
              Kenapa Memilih <span className="text-blue-600">WASPOINT.NET</span>?
            </motion.h2>
            <motion.p 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
              className="text-slate-500 text-lg max-w-2xl mx-auto"
            >
              Teknologi terbaik untuk mendukung pertumbuhan bisnis jaringan internet Anda.
            </motion.p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.1 }}
                whileHover={{ y: -10 }}
              >
                <Card className="h-full border-white/50 bg-white/60 backdrop-blur-xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] hover:shadow-[0_20px_40px_rgb(0,0,0,0.08)] transition-all duration-300 rounded-[2rem]">
                  <CardContent className="p-8">
                    <div className="h-14 w-14 rounded-2xl bg-gradient-to-br from-slate-50 to-slate-100 border border-slate-200 flex items-center justify-center mb-6 shadow-sm group-hover:scale-110 transition-transform duration-300">
                      {feature.icon}
                    </div>
                    <h3 className="text-xl font-bold text-slate-900 mb-3">{feature.title}</h3>
                    <p className="text-slate-500 leading-relaxed">{feature.desc}</p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Mobile Preview Section */}
      <section className="relative z-10 px-6 py-32 overflow-hidden">
        <div className="max-w-7xl mx-auto flex flex-col lg:flex-row items-center gap-20">
          <div className="flex-1 text-center lg:text-left">
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
            >
              <h2 className="text-4xl md:text-5xl font-extrabold text-slate-900 mb-8 leading-tight">
                Kelola Bisnis dari <br/>
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600">Genggaman Anda</span>
              </h2>
              <p className="text-lg text-slate-500 mb-10 leading-relaxed">
                Aplikasi <strong>WASPOINT.NET</strong> didesain khusus untuk kemudahan akses melalui smartphone. 
                Cetak voucher via printer thermal bluetooth semudah mengirim pesan.
              </p>
              <ul className="space-y-5 mb-12 text-left max-w-md mx-auto lg:mx-0">
                {[
                  'Desain responsif & ringan',
                  'Dukungan Printer Thermal Bluetooth',
                  'Manajemen Stok Voucher Realtime',
                  'Laporan Omzet Harian Otomatis'
                ].map((item, i) => (
                  <motion.li 
                    key={i} 
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.2 + (i * 0.1) }}
                    className="flex items-center gap-4 text-slate-700 font-semibold"
                  >
                    <div className="h-8 w-8 rounded-full bg-green-100 flex items-center justify-center flex-shrink-0 shadow-sm">
                      <Check className="h-4 w-4 text-green-600" />
                    </div>
                    {item}
                  </motion.li>
                ))}
              </ul>
            </motion.div>
          </div>
          
          <motion.div 
            className="flex-1 relative"
            initial={{ opacity: 0, x: 50, rotate: 5 }}
            whileInView={{ opacity: 1, x: 0, rotate: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <div className="relative z-10 mx-auto border-slate-900 bg-slate-900 border-[12px] rounded-[3rem] h-[650px] w-[320px] shadow-[0_50px_100px_-20px_rgba(50,50,93,0.25),0_30px_60px_-30px_rgba(0,0,0,0.3)] ring-1 ring-slate-900/5">
              <div className="h-[32px] w-[3px] bg-slate-800 absolute -left-[15px] top-[72px] rounded-l-lg"></div>
              <div className="h-[46px] w-[3px] bg-slate-800 absolute -left-[15px] top-[124px] rounded-l-lg"></div>
              <div className="h-[46px] w-[3px] bg-slate-800 absolute -left-[15px] top-[178px] rounded-l-lg"></div>
              <div className="h-[64px] w-[3px] bg-slate-800 absolute -right-[15px] top-[142px] rounded-r-lg"></div>
              <div className="rounded-[2.2rem] overflow-hidden w-full h-full bg-slate-50 relative">
                {/* Mock UI */}
                <div className="absolute top-0 left-0 right-0 h-32 bg-gradient-to-br from-blue-600 to-purple-700 rounded-b-[3rem] z-0 shadow-lg"></div>
                <div className="relative z-10 p-6 pt-14">
                  <div className="flex justify-between items-center mb-8 text-white">
                    <div>
                      <div className="text-xs opacity-80 font-medium mb-1">Selamat Datang,</div>
                      <div className="font-bold text-lg">Mitra Waspoint</div>
                    </div>
                    <div className="h-10 w-10 bg-white/20 rounded-full backdrop-blur-md border border-white/30 flex items-center justify-center">
                      <Wifi className="h-5 w-5 text-white" />
                    </div>
                  </div>
                  <div className="bg-white rounded-3xl p-6 shadow-xl shadow-blue-900/5 mb-6 border border-slate-100 relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-24 h-24 bg-blue-50 rounded-bl-full -mr-4 -mt-4 opacity-50"></div>
                    <div className="relative z-10">
                      <div className="text-xs text-slate-400 font-bold uppercase tracking-wider mb-2">Saldo Aktif</div>
                      <div className="text-3xl font-extrabold text-slate-900 mb-1">Rp 2.5jt</div>
                      <div className="text-xs text-emerald-600 font-bold bg-emerald-50 inline-block px-2 py-1 rounded-lg mt-2">
                        +15% dari bulan lalu
                      </div>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4 mb-6">
                    <div className="bg-blue-50 p-5 rounded-3xl hover:bg-blue-100 transition-colors cursor-pointer">
                      <div className="h-10 w-10 bg-blue-100 rounded-2xl flex items-center justify-center mb-3 text-blue-600">
                        <Printer className="h-5 w-5" />
                      </div>
                      <div className="font-bold text-slate-900">Cetak</div>
                      <div className="text-xs text-slate-500">Voucher Baru</div>
                    </div>
                    <div className="bg-purple-50 p-5 rounded-3xl hover:bg-purple-100 transition-colors cursor-pointer">
                      <div className="h-10 w-10 bg-purple-100 rounded-2xl flex items-center justify-center mb-3 text-purple-600">
                        <BarChart3 className="h-5 w-5" />
                      </div>
                      <div className="font-bold text-slate-900">Laporan</div>
                      <div className="text-xs text-slate-500">Cek Omzet</div>
                    </div>
                  </div>
                  <div className="space-y-3">
                    <div className="p-4 bg-white rounded-2xl shadow-sm border border-slate-100 flex items-center gap-3">
                      <div className="h-10 w-10 rounded-xl bg-slate-100 flex items-center justify-center">
                        <Smartphone className="h-5 w-5 text-slate-500" />
                      </div>
                      <div>
                        <div className="font-bold text-sm text-slate-900">Paket Harian</div>
                        <div className="text-xs text-slate-500">Terjual 150 pcs</div>
                      </div>
                    </div>
                    <div className="p-4 bg-white rounded-2xl shadow-sm border border-slate-100 flex items-center gap-3">
                      <div className="h-10 w-10 rounded-xl bg-slate-100 flex items-center justify-center">
                        <Globe className="h-5 w-5 text-slate-500" />
                      </div>
                      <div>
                        <div className="font-bold text-sm text-slate-900">Paket Mingguan</div>
                        <div className="text-xs text-slate-500">Terjual 45 pcs</div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            {/* Decorative blobs behind phone */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-gradient-to-tr from-blue-500/20 to-purple-500/20 rounded-full blur-3xl -z-10 animate-pulse"></div>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-slate-900 border-t border-slate-800 py-16 px-6 relative z-10 text-white">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row justify-between items-center gap-8 mb-12">
            <div className="flex items-center gap-3">
              {settings?.logoUrl ? (
                <img src={settings.logoUrl} alt="App Logo" className="h-10 w-auto object-contain" />
              ) : (
                <div className="h-10 w-10 bg-white/10 rounded-xl flex items-center justify-center text-white backdrop-blur-md">
                  <Wifi className="h-5 w-5" />
                </div>
              )}
              <div className="flex flex-col">
                <span className="font-bold text-lg text-white">{settings?.businessName || 'WASPOINT.NET'}</span>
                <span className="text-[10px] text-slate-400 uppercase tracking-wider">PT. ANUGERAH WASPOINT NETWORK</span>
              </div>
            </div>
            <div className="flex gap-8 text-sm font-medium text-slate-400">
              <a href="#" className="hover:text-blue-400 transition-colors">Tentang Kami</a>
              <a href="#" className="hover:text-blue-400 transition-colors">Fitur</a>
              <a href="#" className="hover:text-blue-400 transition-colors">Harga</a>
              <a href="#" className="hover:text-blue-400 transition-colors">Kontak</a>
            </div>
          </div>
          <div className="border-t border-slate-800 pt-8 flex flex-col md:flex-row justify-between items-center gap-4 text-sm text-slate-500">
            <p>© {new Date().getFullYear()} PT. ANUGERAH WASPOINT NETWORK. All rights reserved.</p>
            <p>Dibuat dengan ❤️ untuk Indonesia Digital</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
