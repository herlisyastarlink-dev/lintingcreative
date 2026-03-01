import * as React from 'react';
import { motion } from 'motion/react';
import { Card, CardContent } from '@/components/Card';
import { Button } from '@/components/Button';
import { Input } from '@/components/Input';
import { useStore } from '@/store';
import { Save, CheckCircle2, UserCircle2, Wifi, Upload, Image as ImageIcon } from 'lucide-react';
import { fileToBase64 } from '@/lib/utils';

export function ResellerPengaturan() {
  const { currentUser, updateReseller } = useStore();
  
  const [formData, setFormData] = React.useState({
    name: currentUser?.name || '',
    wifiName: currentUser?.wifiName || '',
    logoUrl: currentUser?.logoUrl || '',
    photoUrl: currentUser?.photoUrl || '',
  });
  const [saved, setSaved] = React.useState(false);

  if (!currentUser) return null;

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    updateReseller(currentUser.id, formData);
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  const handleLogoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      try {
        const base64 = await fileToBase64(file);
        setFormData({ ...formData, logoUrl: base64 });
      } catch (error) {
        console.error('Failed to convert image', error);
      }
    }
  };

  const handlePhotoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      try {
        const base64 = await fileToBase64(file);
        setFormData({ ...formData, photoUrl: base64 });
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
        <h1 className="text-2xl font-bold text-slate-900">Profil & Pengaturan</h1>
        <p className="text-sm text-slate-500">Lengkapi profil dan informasi WiFi Anda.</p>
      </div>

      <Card className="bg-white/80 backdrop-blur-xl border-white/50">
        <CardContent className="p-6">
          <form onSubmit={handleSave} className="space-y-5">
            <div className="flex items-center gap-3 mb-6 pb-4 border-b border-slate-100">
              <div className="p-3 bg-blue-50 text-blue-600 rounded-2xl">
                <UserCircle2 className="h-6 w-6" />
              </div>
              <div>
                <h3 className="font-semibold text-slate-900">Profil Reseller</h3>
                <p className="text-xs text-slate-500">Informasi akun dan cetak voucher</p>
              </div>
            </div>

            <Input
              label="Nama Lengkap"
              placeholder="Contoh: Reseller 1"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            />
            
            <Input
              label="Nama WiFi / SSID"
              placeholder="Contoh: Warkop Berkah WiFi"
              value={formData.wifiName}
              onChange={(e) => setFormData({ ...formData, wifiName: e.target.value })}
            />

            <div className="space-y-2">
              <label className="text-sm font-medium text-slate-700">Logo Usaha (Opsional)</label>
              <div className="flex items-center gap-4">
                {formData.logoUrl ? (
                  <img src={formData.logoUrl} alt="Logo" className="w-16 h-16 rounded-xl object-contain border border-slate-200 bg-white" />
                ) : (
                  <div className="w-16 h-16 rounded-xl bg-slate-100 flex items-center justify-center border border-slate-200 text-slate-400">
                    <ImageIcon className="w-8 h-8" />
                  </div>
                )}
                <div className="flex-1">
                  <Input
                    label=""
                    placeholder="URL Logo atau Upload"
                    value={formData.logoUrl}
                    onChange={(e) => setFormData({ ...formData, logoUrl: e.target.value })}
                  />
                  <div className="mt-2 flex items-center gap-2">
                    <input
                      type="file"
                      id="logo-upload"
                      accept="image/*"
                      className="hidden"
                      onChange={handleLogoUpload}
                    />
                    <label
                      htmlFor="logo-upload"
                      className="cursor-pointer flex items-center gap-2 px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg text-sm transition-colors"
                    >
                      <Upload className="w-4 h-4" />
                      Upload Logo
                    </label>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="space-y-2">
              <label className="text-sm font-medium text-slate-700">Foto Profil (Opsional)</label>
              <div className="flex items-center gap-4">
                {formData.photoUrl ? (
                  <img src={formData.photoUrl} alt="Profile" className="w-16 h-16 rounded-full object-cover border border-slate-200" />
                ) : (
                  <div className="w-16 h-16 rounded-full bg-slate-100 flex items-center justify-center border border-slate-200 text-slate-400">
                    <UserCircle2 className="w-8 h-8" />
                  </div>
                )}
                <div className="flex-1">
                  <Input
                    label=""
                    placeholder="URL Foto atau Upload"
                    value={formData.photoUrl}
                    onChange={(e) => setFormData({ ...formData, photoUrl: e.target.value })}
                  />
                  <div className="mt-2 flex items-center gap-2">
                    <input
                      type="file"
                      id="photo-upload"
                      accept="image/*"
                      className="hidden"
                      onChange={handlePhotoUpload}
                    />
                    <label
                      htmlFor="photo-upload"
                      className="cursor-pointer flex items-center gap-2 px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg text-sm transition-colors"
                    >
                      <Upload className="w-4 h-4" />
                      Upload Foto
                    </label>
                  </div>
                </div>
              </div>
            </div>

            {saved && (
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
    </motion.div>
  );
}
