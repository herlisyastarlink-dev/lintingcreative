import * as React from 'react';
import { motion } from 'motion/react';
import { Card, CardContent } from '@/components/Card';
import { Button } from '@/components/Button';
import { Modal } from '@/components/Modal';
import { Input } from '@/components/Input';
import { useStore, User } from '@/store';
import { UserPlus, Edit2, Trash2, MapPin } from 'lucide-react';
import { fileToBase64 } from '@/lib/utils';

export function OperatorKelolaReseller() {
  const { users, addReseller, updateReseller, deleteReseller } = useStore();
  const resellers = users.filter((u) => u.role === 'reseller');

  const [isModalOpen, setIsModalOpen] = React.useState(false);
  const [editingId, setEditingId] = React.useState<string | null>(null);
  const [formData, setFormData] = React.useState({
    name: '',
    username: '',
    password: '',
    region: '',
    bio: '',
    wifiName: '',
    logoUrl: '',
    photoUrl: '',
    canPrintThermal: true,
    canPrintMass: true,
  });

  const handleOpenModal = (reseller?: User) => {
    if (reseller) {
      setEditingId(reseller.id);
      setFormData({
        name: reseller.name,
        username: reseller.username,
        password: reseller.password || '',
        region: reseller.region || '',
        bio: reseller.bio || '',
        wifiName: reseller.wifiName || '',
        logoUrl: reseller.logoUrl || '',
        photoUrl: reseller.photoUrl || '',
        canPrintThermal: reseller.canPrintThermal ?? true,
        canPrintMass: reseller.canPrintMass ?? true,
      });
    } else {
      setEditingId(null);
      setFormData({ name: '', username: '', password: '', region: '', bio: '', wifiName: '', logoUrl: '', photoUrl: '', canPrintThermal: true, canPrintMass: true });
    }
    setIsModalOpen(true);
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingId) {
      updateReseller(editingId, formData);
    } else {
      addReseller(formData);
    }
    setIsModalOpen(false);
  };

  const handleDelete = (id: string) => {
    if (window.confirm('Yakin ingin menghapus reseller ini?')) {
      deleteReseller(id);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-4"
    >
      <div className="flex items-center justify-between mb-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Kelola Reseller</h1>
          <p className="text-sm text-slate-500">Daftar dan manajemen akun reseller.</p>
        </div>
        <Button onClick={() => handleOpenModal()} size="sm" className="gap-2">
          <UserPlus className="h-4 w-4" />
          <span className="hidden sm:inline">Tambah</span>
        </Button>
      </div>

      <div className="space-y-3">
        {resellers.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-12 text-center">
            <div className="mb-4 rounded-full bg-slate-100 p-4">
              <UserPlus className="h-8 w-8 text-slate-400" />
            </div>
            <h3 className="text-lg font-medium text-slate-900">Belum ada reseller</h3>
            <p className="text-sm text-slate-500">Klik tombol Tambah untuk membuat akun reseller baru.</p>
          </div>
        ) : (
          resellers.map((r) => (
            <Card key={r.id} className="bg-white/80 backdrop-blur-xl border-white/50">
              <CardContent className="p-4 flex items-center justify-between">
                <div className="flex items-center gap-4">
                  {r.photoUrl ? (
                    <img src={r.photoUrl} alt={r.name} className="h-12 w-12 rounded-full object-cover border border-slate-200" />
                  ) : (
                    <div className="flex h-12 w-12 items-center justify-center rounded-full bg-blue-100 text-blue-600 font-bold text-lg">
                      {r.name.charAt(0).toUpperCase()}
                    </div>
                  )}
                  <div>
                    <h3 className="font-semibold text-slate-900">{r.name}</h3>
                    <div className="text-sm text-slate-500 flex items-center gap-1">
                      <span>@{r.username}</span>
                      {r.region && (
                        <>
                          <span>•</span>
                          <MapPin className="h-3 w-3" />
                          <span>{r.region}</span>
                        </>
                      )}
                    </div>
                    {r.wifiName && (
                      <div className="text-xs text-blue-600 mt-0.5 font-medium">
                        WiFi: {r.wifiName}
                      </div>
                    )}
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => handleOpenModal(r)}
                    className="p-2 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-xl transition-colors"
                  >
                    <Edit2 className="h-4 w-4" />
                  </button>
                  <button
                    onClick={() => handleDelete(r.id)}
                    className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-xl transition-colors"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>

      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={editingId ? 'Edit Reseller' : 'Tambah Reseller'}
      >
        <form onSubmit={handleSave} className="space-y-4">
          <Input
            label="Nama Lengkap"
            required
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          />
          <Input
            label="Username"
            required
            value={formData.username}
            onChange={(e) => setFormData({ ...formData, username: e.target.value })}
          />
          <Input
            label="Password"
            type="password"
            required={!editingId}
            placeholder={editingId ? 'Kosongkan jika tidak ingin mengubah' : ''}
            value={formData.password}
            onChange={(e) => setFormData({ ...formData, password: e.target.value })}
          />
          <Input
            label="Wilayah"
            value={formData.region}
            onChange={(e) => setFormData({ ...formData, region: e.target.value })}
          />
          <Input
            label="Nama WiFi Reseller"
            placeholder="Contoh: Warkop Berkah WiFi"
            value={formData.wifiName}
            onChange={(e) => setFormData({ ...formData, wifiName: e.target.value })}
          />
          <div className="space-y-2">
            <label className="text-sm font-medium text-slate-700">Logo Reseller (Opsional)</label>
            <div className="flex items-center gap-4">
              {formData.logoUrl ? (
                <img src={formData.logoUrl} alt="Logo" className="w-12 h-12 rounded-xl object-contain border border-slate-200 bg-white" />
              ) : (
                <div className="w-12 h-12 rounded-xl bg-slate-100 flex items-center justify-center border border-slate-200 text-slate-400">
                  <span className="text-xs">Logo</span>
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
                    id="reseller-logo-upload"
                    accept="image/*"
                    className="hidden"
                    onChange={async (e) => {
                      const file = e.target.files?.[0];
                      if (file) {
                        try {
                          const base64 = await fileToBase64(file);
                          setFormData({ ...formData, logoUrl: base64 });
                        } catch (error) {
                          console.error('Failed to convert image', error);
                        }
                      }
                    }}
                  />
                  <label
                    htmlFor="reseller-logo-upload"
                    className="cursor-pointer flex items-center gap-2 px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg text-xs transition-colors"
                  >
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
                <img src={formData.photoUrl} alt="Profile" className="w-12 h-12 rounded-full object-cover border border-slate-200" />
              ) : (
                <div className="w-12 h-12 rounded-full bg-slate-100 flex items-center justify-center border border-slate-200 text-slate-400">
                  <span className="text-xs">Foto</span>
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
                    id="reseller-photo-upload"
                    accept="image/*"
                    className="hidden"
                    onChange={async (e) => {
                      const file = e.target.files?.[0];
                      if (file) {
                        try {
                          const base64 = await fileToBase64(file);
                          setFormData({ ...formData, photoUrl: base64 });
                        } catch (error) {
                          console.error('Failed to convert image', error);
                        }
                      }
                    }}
                  />
                  <label
                    htmlFor="reseller-photo-upload"
                    className="cursor-pointer flex items-center gap-2 px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg text-xs transition-colors"
                  >
                    Upload Foto
                  </label>
                </div>
              </div>
            </div>
          </div>
          <div className="flex flex-col gap-1.5 w-full">
            <label className="text-sm font-medium text-slate-700">Biodata Singkat</label>
            <textarea
              className="flex min-h-[80px] w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 transition-all"
              value={formData.bio}
              onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
            />
          </div>
          
          <div className="space-y-3 pt-2 border-t border-slate-100">
            <h4 className="text-sm font-medium text-slate-900">Hak Akses Cetak</h4>
            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                id="canPrintThermal"
                checked={formData.canPrintThermal}
                onChange={(e) => setFormData({ ...formData, canPrintThermal: e.target.checked })}
                className="h-4 w-4 rounded border-slate-300 text-blue-600 focus:ring-blue-500"
              />
              <label htmlFor="canPrintThermal" className="text-sm text-slate-700">
                Izinkan Cetak Thermal
              </label>
            </div>
            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                id="canPrintMass"
                checked={formData.canPrintMass}
                onChange={(e) => setFormData({ ...formData, canPrintMass: e.target.checked })}
                className="h-4 w-4 rounded border-slate-300 text-blue-600 focus:ring-blue-500"
              />
              <label htmlFor="canPrintMass" className="text-sm text-slate-700">
                Izinkan Cetak Massal (A4/F4)
              </label>
            </div>
          </div>

          <div className="pt-4 flex justify-end gap-2">
            <Button type="button" variant="ghost" onClick={() => setIsModalOpen(false)}>
              Batal
            </Button>
            <Button type="submit">{editingId ? 'Simpan Perubahan' : 'Tambah Reseller'}</Button>
          </div>
        </form>
      </Modal>
    </motion.div>
  );
}
