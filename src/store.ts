import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { DEFAULT_TEMPLATE_CSS } from '@/lib/TemplateEngine';

export type Role = 'operator' | 'reseller';

export interface User {
  id: string;
  role: Role;
  username: string;
  password?: string;
  name: string;
  region?: string;
  bio?: string;
  wifiName?: string;
  logoUrl?: string;
  photoUrl?: string;
  phone?: string;
  address?: string;
  bankAccount?: string;
  canPrintThermal?: boolean;
  canPrintMass?: boolean;
}

export interface Voucher {
  id: string;
  code: string;
  group: string;
  price: number;
  period: string;
  status: 'available' | 'used' | 'pending';
  resellerId: string | null;
  printedAt: string | null;
  batchId?: string;
  printCount?: number;
}

export interface Transaction {
  id: string;
  resellerId: string;
  date: string;
  vouchers: string[]; // array of voucher codes
  totalAmount: number;
  packageDetails: string; // e.g., "3Jam - Rp 2000"
}

export interface TemplateMapping {
  price: number;
  color: string;
  accent: string;
}

export interface PrintTemplate {
  id: string;
  name: string;
  paperPreset: 'A4' | 'F4' | 'THERMAL80' | 'THERMAL58' | 'CUSTOM';
  widthMm: number;
  heightMm: number;
  orientation: 'portrait' | 'landscape';
  columns: number;
  rows: number;
  marginMm: number;
  gapXmm: number;
  gapYmm: number;
  effectiveWidthMm: number;
  effectiveHeightMm: number;
  voucherWidthMm: number;
  voucherHeightMm: number;
  cssText: string;
  createdAt: string;
  updatedAt: string;
  isActive?: boolean;
}

export interface VoucherRequestItem {
  price: number;
  quantity: number;
}

export interface VoucherRequest {
  id: string;
  resellerId: string;
  price?: number;
  quantity?: number;
  items?: VoucherRequestItem[];
  status: 'pending' | 'completed' | 'rejected';
  createdAt: string;
}

export interface Settings {
  ssid: string;
  businessName: string;
  location: string;
  templateMappings: TemplateMapping[];
}

interface AppState {
  currentUser: User | null;
  users: User[];
  vouchers: Voucher[];
  transactions: Transaction[];
  voucherRequests: VoucherRequest[];
  settings: Settings;
  printTemplates: PrintTemplate[];
  
  login: (username: string, password: string) => boolean;
  logout: () => void;
  
  addReseller: (user: Omit<User, 'id' | 'role'>) => void;
  updateReseller: (id: string, user: Partial<User>) => void;
  deleteReseller: (id: string) => void;
  
  importVouchers: (vouchers: Omit<Voucher, 'id' | 'status' | 'printedAt'>[]) => void;
  deleteVoucher: (id: string) => void;
  deleteVouchersByBatch: (batchId: string) => void;
  deleteAllVouchers: () => void;
  
  updateSettings: (settings: Partial<Settings>) => void;
  
  addPrintTemplate: (template: Omit<PrintTemplate, 'id' | 'createdAt' | 'updatedAt'>) => void;
  updatePrintTemplate: (id: string, template: Partial<PrintTemplate>) => void;
  deletePrintTemplate: (id: string) => void;
  
  printVouchers: (resellerId: string, price: number, period: string, group: string, qty: number, isThermal: boolean, batchId?: string) => { vouchers: Voucher[]; transactionId?: string };
  printBatch: (resellerId: string, batchId: string, isThermal: boolean) => { vouchers: Voucher[]; transactionId?: string };
  rollbackPrint: (transactionId: string) => void;
  rollbackPrintCount: (voucherIds: string[]) => void;
  commitPrint: (transactionId: string) => void;
  
  requestVouchers: (resellerId: string, items: VoucherRequestItem[]) => void;
  updateRequestStatus: (id: string, status: 'completed' | 'rejected') => void;
}

export const useStore = create<AppState>()(
  persist(
    (set, get) => ({
      currentUser: null,
      users: [
        {
          id: 'op-1',
          role: 'operator',
          username: 'wearezionists',
          password: '123456',
          name: 'Operator Utama',
        },
      ],
      vouchers: [],
      transactions: [],
      voucherRequests: [],
      settings: {
        ssid: '',
        businessName: '',
        location: '',
        templateMappings: [
          { price: 2000, color: 'bg-blue-100', accent: 'text-blue-700' },
          { price: 5000, color: 'bg-emerald-100', accent: 'text-emerald-700' },
          { price: 10000, color: 'bg-pink-100', accent: 'text-pink-700' },
        ],
      },
      printTemplates: [
        {
          id: 'tpl-default-f4-land',
          name: 'F4 Landscape 5x6',
          paperPreset: 'F4',
          widthMm: 330,
          heightMm: 215,
          orientation: 'landscape',
          columns: 5,
          rows: 6,
          marginMm: 5,
          gapXmm: 4,
          gapYmm: 4,
          effectiveWidthMm: 320,
          effectiveHeightMm: 205,
          voucherWidthMm: 60.8,
          voucherHeightMm: 30.83,
          cssText: `:root {\n  --paper-w-mm: 330;\n  --paper-h-mm: 215;\n  --margin-mm: 5;\n  --gap-x-mm: 4;\n  --gap-y-mm: 4;\n  --voucher-w-mm: 60.8;\n  --voucher-h-mm: 30.83;\n  --cols: 5;\n  --rows: 6;\n}\n${DEFAULT_TEMPLATE_CSS}`,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
          isActive: true,
        },
        {
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
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
          isActive: false,
        },
        {
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
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
          isActive: false,
        }
      ],

      login: (username, password) => {
        const user = get().users.find(
          (u) => u.username === username && u.password === password
        );
        if (user) {
          set({ currentUser: user });
          return true;
        }
        return false;
      },

      logout: () => set({ currentUser: null }),

      addReseller: (user) =>
        set((state) => ({
          users: [
            ...state.users,
            { ...user, id: `reseller-${Date.now()}`, role: 'reseller' },
          ],
        })),

      updateReseller: (id, user) =>
        set((state) => ({
          users: state.users.map((u) => (u.id === id ? { ...u, ...user } : u)),
        })),

      deleteReseller: (id) =>
        set((state) => ({
          users: state.users.filter((u) => u.id !== id),
        })),

      importVouchers: (newVouchers) =>
        set((state) => {
          const batchId = `batch-${Date.now()}`;
          const vouchersToAdd = newVouchers.map((v) => ({
            ...v,
            id: `v-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
            status: 'available' as const,
            printedAt: null,
            batchId,
          }));
          return { vouchers: [...state.vouchers, ...vouchersToAdd] };
        }),

      deleteVoucher: (id) =>
        set((state) => ({
          vouchers: state.vouchers.filter((v) => v.id !== id),
        })),

      deleteVouchersByBatch: (batchId) =>
        set((state) => ({
          vouchers: state.vouchers.filter((v) => String(v.batchId) !== String(batchId)),
        })),

      deleteAllVouchers: () =>
        set(() => ({
          vouchers: [],
        })),

      updateSettings: (newSettings) =>
        set((state) => ({
          settings: { ...state.settings, ...newSettings },
        })),

      addPrintTemplate: (template) =>
        set((state) => {
          const newId = (template as any).id || `tpl-${Date.now()}`;
          if (state.printTemplates.some(t => t.id === newId)) {
            return state;
          }
          return {
            printTemplates: [
              ...state.printTemplates,
              {
                ...template,
                id: newId,
                createdAt: new Date().toISOString(),
                updatedAt: new Date().toISOString(),
              },
            ],
          };
        }),

      updatePrintTemplate: (id, template) =>
        set((state) => ({
          printTemplates: state.printTemplates.map((t) =>
            t.id === id ? { ...t, ...template, updatedAt: new Date().toISOString() } : t
          ),
        })),

      deletePrintTemplate: (id) =>
        set((state) => ({
          printTemplates: state.printTemplates.filter((t) => t.id !== id),
        })),

      printVouchers: (resellerId, price, period, group, qty, isThermal, batchId) => {
        const state = get();
        const availableVouchers = state.vouchers.filter(
          (v) =>
            v.resellerId === resellerId &&
            Number(v.price) === Number(price) &&
            String(v.period) === String(period) &&
            String(v.group) === String(group) &&
            v.status === 'available' &&
            (!batchId || String(v.batchId) === String(batchId))
        ).sort((a, b) => (a.printCount || 0) - (b.printCount || 0));

        if (availableVouchers.length < qty) {
          throw new Error('Stok tidak cukup');
        }

        const vouchersToPrint = availableVouchers.slice(0, qty);
        const voucherIds = vouchersToPrint.map((v) => v.id);
        const now = new Date().toISOString();

        if (isThermal) {
          const newTransaction: Transaction = {
            id: `trx-${Date.now()}`,
            resellerId,
            date: now,
            vouchers: vouchersToPrint.map((v) => v.code),
            totalAmount: price * qty,
            packageDetails: `${period} - Rp ${price.toLocaleString('id-ID')}`,
          };

          set((state) => ({
            vouchers: state.vouchers.map((v) =>
              voucherIds.includes(v.id)
                ? { ...v, status: 'pending', printedAt: now }
                : v
            ),
            transactions: [...state.transactions, newTransaction],
          }));

          return { vouchers: vouchersToPrint, transactionId: newTransaction.id };
        } else {
          set((state) => ({
            vouchers: state.vouchers.map((v) =>
              voucherIds.includes(v.id)
                ? { ...v, printCount: (v.printCount || 0) + 1, printedAt: now }
                : v
            ),
          }));
          return { vouchers: vouchersToPrint };
        }
      },

      printBatch: (resellerId, batchId, isThermal) => {
        const state = get();
        const availableVouchers = state.vouchers.filter(
          (v) =>
            v.resellerId === resellerId &&
            String(v.batchId) === String(batchId) &&
            v.status === 'available'
        );

        if (availableVouchers.length === 0) {
          throw new Error('Tidak ada voucher yang tersedia di batch ini');
        }

        const voucherIds = availableVouchers.map((v) => v.id);
        const now = new Date().toISOString();

        if (isThermal) {
          const totalAmount = availableVouchers.reduce((sum, v) => sum + v.price, 0);
          const newTransaction: Transaction = {
            id: `trx-${Date.now()}`,
            resellerId,
            date: now,
            vouchers: availableVouchers.map((v) => v.code),
            totalAmount,
            packageDetails: `Cetak Batch ${batchId}`,
          };

          set((state) => ({
            vouchers: state.vouchers.map((v) =>
              voucherIds.includes(v.id)
                ? { ...v, status: 'pending', printedAt: now }
                : v
            ),
            transactions: [...state.transactions, newTransaction],
          }));

          return { vouchers: availableVouchers, transactionId: newTransaction.id };
        } else {
          set((state) => ({
            vouchers: state.vouchers.map((v) =>
              voucherIds.includes(v.id)
                ? { ...v, printCount: (v.printCount || 0) + 1, printedAt: now }
                : v
            ),
          }));
          return { vouchers: availableVouchers };
        }
      },

      rollbackPrint: (transactionId) => {
        const state = get();
        const transaction = state.transactions.find(t => t.id === transactionId);
        if (!transaction) return;

        set((state) => ({
          vouchers: state.vouchers.map((v) =>
            transaction.vouchers.includes(v.code)
              ? { ...v, status: 'available', printedAt: null }
              : v
          ),
          transactions: state.transactions.filter((t) => t.id !== transactionId),
        }));
      },

      rollbackPrintCount: (voucherIds) => {
        set((state) => ({
          vouchers: state.vouchers.map((v) =>
            voucherIds.includes(v.id)
              ? { ...v, printCount: Math.max(0, (v.printCount || 1) - 1) }
              : v
          )
        }));
      },

      commitPrint: (transactionId) => {
        const state = get();
        const transaction = state.transactions.find(t => t.id === transactionId);
        if (!transaction) return;

        set((state) => ({
          vouchers: state.vouchers.map((v) =>
            transaction.vouchers.includes(v.code)
              ? { ...v, status: 'used' }
              : v
          )
        }));
      },

      requestVouchers: (resellerId, items) =>
        set((state) => ({
          voucherRequests: [
            ...state.voucherRequests,
            {
              id: `req-${Date.now()}`,
              resellerId,
              items,
              status: 'pending',
              createdAt: new Date().toISOString(),
            },
          ],
        })),

      updateRequestStatus: (id, status) =>
        set((state) => ({
          voucherRequests: state.voucherRequests.map((req) =>
            req.id === id ? { ...req, status } : req
          ),
        })),
    }),
    {
      name: 'linting-creative-storage',
    }
  )
);
