import * as React from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Button } from '@/components/Button';
import { Input } from '@/components/Input';
import { Card, CardContent } from '@/components/Card';
import { useStore } from '@/store';
import { UserCircle2, KeyRound, Zap } from 'lucide-react';
import { cn } from '@/lib/utils';

export function Login() {
  const [username, setUsername] = React.useState('');
  const [password, setPassword] = React.useState('');
  const [error, setError] = React.useState('');
  const { login, currentUser, settings } = useStore();
  const navigate = useNavigate();

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!username || !password) {
      setError('Username dan password wajib diisi');
      return;
    }

    const success = login(username, password);
    if (!success) {
      setError('Username atau password salah');
    }
  };

  React.useEffect(() => {
    if (currentUser) {
      navigate(`/${currentUser.role}`);
    }
  }, [currentUser, navigate]);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4 relative overflow-hidden bg-slate-900">
      {/* Modern Background Elements */}
      <div className="absolute inset-0 bg-gradient-to-br from-slate-900 via-blue-900 to-purple-900"></div>
      <div className="absolute top-[-10%] right-[-5%] w-96 h-96 bg-blue-500/20 rounded-full blur-3xl animate-pulse"></div>
      <div className="absolute bottom-[-10%] left-[-5%] w-96 h-96 bg-purple-500/20 rounded-full blur-3xl animate-pulse delay-1000"></div>
      
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 0.5, ease: 'easeOut' }}
        className="w-full max-w-md z-10"
      >
        <div className="mb-8 flex flex-col items-center text-center">
          {settings?.logoUrl ? (
            <div className="relative mb-6">
              <img 
                src={settings.logoUrl} 
                alt="App Logo" 
                className="relative h-24 w-auto object-contain" 
              />
            </div>
          ) : (
            <div className="relative mb-6">
              <div className="relative flex h-24 w-24 items-center justify-center rounded-[1.5rem] bg-white/10 shadow-xl border border-white/10 backdrop-blur-md">
                <Zap className="h-10 w-10 text-white" />
              </div>
            </div>
          )}
          <h1 className="text-3xl font-extrabold tracking-tight text-white mb-2">
            {settings?.businessName || 'Linting Creative'}
          </h1>
          <p className="text-blue-200 font-medium">Masuk untuk mengelola voucher Anda</p>
        </div>

        <Card className="bg-white/10 backdrop-blur-xl border border-white/10 shadow-2xl shadow-black/20">
          <CardContent className="p-8">
            <form onSubmit={handleLogin} className="space-y-6">
              <div className="space-y-2">
                <label className="text-sm font-semibold text-blue-100 ml-1">Username</label>
                <div className="relative group">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <UserCircle2 className="h-5 w-5 text-blue-300 group-focus-within:text-blue-400 transition-colors" />
                  </div>
                  <Input
                    placeholder="Masukkan username"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    className="pl-11 bg-black/20 border-white/10 text-white placeholder:text-white/30 focus:border-blue-400 focus:ring-blue-400/20 transition-all duration-200"
                  />
                </div>
              </div>
              
              <div className="space-y-2">
                <label className="text-sm font-semibold text-blue-100 ml-1">Password</label>
                <div className="relative group">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <KeyRound className="h-5 w-5 text-blue-300 group-focus-within:text-blue-400 transition-colors" />
                  </div>
                  <Input
                    type="password"
                    placeholder="Masukkan password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="pl-11 bg-black/20 border-white/10 text-white placeholder:text-white/30 focus:border-blue-400 focus:ring-blue-400/20 transition-all duration-200"
                  />
                </div>
              </div>

              {error && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="rounded-xl bg-red-500/10 backdrop-blur-sm p-4 text-sm font-medium text-red-200 border border-red-500/20 flex items-center gap-2"
                >
                  <div className="w-1.5 h-1.5 rounded-full bg-red-400"></div>
                  {error}
                </motion.div>
              )}

              <Button 
                type="submit" 
                className="w-full h-12 bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white shadow-lg shadow-blue-500/20 transition-all duration-300 transform hover:-translate-y-0.5 border-0" 
                size="lg"
              >
                Masuk ke Dashboard
              </Button>
            </form>
          </CardContent>
        </Card>
        
        <p className="mt-8 text-center text-xs font-medium text-blue-300/60 uppercase tracking-widest">
          &copy; {new Date().getFullYear()} PT. Anugerah Waspoint Network
        </p>
      </motion.div>
    </div>
  );
}
