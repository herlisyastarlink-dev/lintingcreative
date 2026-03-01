import * as React from 'react';
import { motion } from 'motion/react';
import { Card, CardContent } from '@/components/Card';
import { Button } from '@/components/Button';
import { Input } from '@/components/Input';
import { useStore } from '@/store';
import { Settings, Save, CheckCircle2, UserCircle2, Upload } from 'lucide-react';
import { fileToBase64 } from '@/lib/utils';

export function OperatorPengaturan() {
  const { settings, updateSettings, currentUser, users, updateReseller } = useStore();
  const [formData, setFormData] = React.useState(settings);
  const [saved, setSaved] = React.useState(false);

  // Operator profile
  const [opName, setOpName] = React.useState(currentUser?.name || '');
  const [opPhoto, setOpPhoto] = React.useState(currentUser?.photoUrl || '');
  const [opSaved, setOpSaved] = React.useState(false);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    updateSettings(formData);
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    if (currentUser) {
      updateReseller(currentUser.id, { name: opName, photoUrl: opPhoto });
      setOpSaved(true);
      setTimeout(() => setOpSaved(false), 3000);
    }
  };

  const handlePhotoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      try {
        const base64 = await fileToBase64(file);
        setOpPhoto(base64);
      } catch (error) {
        console.error('Failed to convert image', error);
      }
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-6"
    >
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-slate-900">Pengaturan</h1>
        <p className="text-sm text-slate-500">Konfigurasi umum sistem WiFi dan Profil.</p>
      </div>

      <Card className="bg-white/80 backdrop-blur-xl border-white/50">
        <CardContent className="p-6">
          <form onSubmit={handleSaveProfile} className="space-y-5">
            <div className="flex items-center gap-3 mb-6 pb-4 border-b border-slate-100">
              <div className="p-3 bg-blue-50 text-blue-600 rounded-2xl">
                <UserCircle2 className="h-6 w-6" />
              </div>
              <div>
                <h3 className="font-semibold text-slate-900">Profil Operator</h3>
                <p className="text-xs text-slate-500">Informasi akun Anda</p>
              </div>
            </div>

            <Input
              label="Nama Lengkap"
              placeholder="Contoh: Operator Utama"
              value={opName}
              onChange={(e) => setOpName(e.target.value)}
            />
            
            <div className="space-y-2">
              <label className="text-sm font-medium text-slate-700">Foto Profil</label>
              <div className="flex items-center gap-4">
                {opPhoto ? (
                  <img src={opPhoto} alt="Profile" className="w-16 h-16 rounded-full object-cover border border-slate-200" />
                ) : (
                  <div className="w-16 h-16 rounded-full bg-slate-100 flex items-center justify-center border border-slate-200 text-slate-400">
                    <UserCircle2 className="w-8 h-8" />
                  </div>
                )}
                <div className="flex-1">
                  <Input
                    label=""
                    placeholder="URL Foto atau Upload"
                    value={opPhoto}
                    onChange={(e) => setOpPhoto(e.target.value)}
                  />
                  <div className="mt-2 flex items-center gap-2">
                    <input
                      type="file"
                      id="op-photo-upload"
                      accept="image/*"
                      className="hidden"
                      onChange={handlePhotoUpload}
                    />
                    <label
                      htmlFor="op-photo-upload"
                      className="cursor-pointer flex items-center gap-2 px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg text-sm transition-colors"
                    >
                      <Upload className="w-4 h-4" />
                      Upload Foto
                    </label>
                  </div>
                </div>
              </div>
            </div>

            {opSaved && (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="flex items-center gap-2 rounded-xl bg-emerald-50 p-3 text-sm text-emerald-700 border border-emerald-100"
              >
                <CheckCircle2 className="h-5 w-5" />
                Profil berhasil disimpan
              </motion.div>
            )}

            <Button type="submit" className="w-full gap-2" size="lg">
              <Save className="h-5 w-5" />
              Simpan Profil
            </Button>
          </form>
        </CardContent>
      </Card>

      <Card className="bg-white/80 backdrop-blur-xl border-white/50">
        <CardContent className="p-6">
          <form onSubmit={handleSave} className="space-y-5">
            <div className="flex items-center gap-3 mb-6 pb-4 border-b border-slate-100">
              <div className="p-3 bg-amber-50 text-amber-600 rounded-2xl">
                <Settings className="h-6 w-6" />
              </div>
              <div>
                <h3 className="font-semibold text-slate-900">Informasi Usaha</h3>
                <p className="text-xs text-slate-500">Tampil pada struk dan halaman login</p>
              </div>
            </div>

            <Input
              label="Nama WiFi / SSID"
              placeholder="Contoh: LINTING_WIFI"
              value={formData.ssid}
              onChange={(e) => setFormData({ ...formData, ssid: e.target.value })}
            />
            <Input
              label="Nama Usaha"
              placeholder="Contoh: Linting Creative Net"
              value={formData.businessName}
              onChange={(e) => setFormData({ ...formData, businessName: e.target.value })}
            />
            <Input
              label="Lokasi (Opsional)"
              placeholder="Contoh: Jl. Merdeka No. 1"
              value={formData.location}
              onChange={(e) => setFormData({ ...formData, location: e.target.value })}
            />

            {saved && (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="flex items-center gap-2 rounded-xl bg-emerald-50 p-3 text-sm text-emerald-700 border border-emerald-100"
              >
                <CheckCircle2 className="h-5 w-5" />
                Pengaturan berhasil disimpan
              </motion.div>
            )}

            <Button type="submit" className="w-full gap-2" size="lg">
              <Save className="h-5 w-5" />
              Simpan Konfigurasi
            </Button>
          </form>
        </CardContent>
      </Card>
    </motion.div>
  );
}
