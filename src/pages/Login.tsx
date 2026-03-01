import * as React from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'motion/react';
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
    <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center p-4 relative overflow-hidden">
      <div className="absolute top-[-20%] left-[-10%] w-[500px] h-[500px] bg-blue-300/20 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-[-20%] right-[-10%] w-[500px] h-[500px] bg-pink-300/20 rounded-full blur-3xl pointer-events-none" />

      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5, ease: 'easeOut' }}
        className="w-full max-w-md z-10"
      >
        <div className="mb-8 flex flex-col items-center">
          <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-blue-600 to-blue-500 shadow-lg shadow-blue-500/30">
            <Zap className="h-8 w-8 text-white" />
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900">{settings.businessName || 'Linting Creative'}</h1>
          <p className="text-sm text-slate-500">Silakan masuk ke akun Anda</p>
        </div>

        <Card className="bg-white/80 backdrop-blur-xl border-white/50 shadow-2xl shadow-blue-900/5">
          <CardContent className="p-6">
            <form onSubmit={handleLogin} className="space-y-4">
              <div className="relative">
                <Input
                  label="Username"
                  placeholder="Masukkan username"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="pl-10"
                />
                <UserCircle2 className="absolute left-3 top-9 h-5 w-5 text-slate-400" />
              </div>
              <div className="relative">
                <Input
                  label="Password"
                  type="password"
                  placeholder="Masukkan password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="pl-10"
                />
                <KeyRound className="absolute left-3 top-9 h-5 w-5 text-slate-400" />
              </div>

              {error && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="rounded-xl bg-red-50 p-3 text-sm text-red-600 border border-red-100"
                >
                  {error}
                </motion.div>
              )}

              <Button type="submit" className="w-full mt-2" size="lg">
                Masuk
              </Button>
            </form>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}
