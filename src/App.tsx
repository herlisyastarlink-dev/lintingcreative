import * as React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { useStore } from './store';
import { Layout } from './components/Layout';
import { Landing } from './pages/Landing';
import { Login } from './pages/Login';

import { OperatorDashboard } from './pages/Operator/Dashboard';
import { OperatorImport } from './pages/Operator/Import';
import { OperatorDataVoucher } from './pages/Operator/DataVoucher';
import { OperatorKelolaReseller } from './pages/Operator/KelolaReseller';
import { OperatorManagementCetak } from './pages/Operator/ManagementCetak';
import { OperatorPrint } from './pages/Operator/Print';
import { OperatorPengaturan } from './pages/Operator/Pengaturan';

import { OperatorRequestVoucher } from './pages/Operator/RequestVoucher';

import { ResellerDashboard } from './pages/Reseller/Dashboard';
import { ResellerCetak } from './pages/Reseller/Cetak';
import { ResellerLaporan } from './pages/Reseller/Laporan';
import { ResellerRequestVoucher } from './pages/Reseller/RequestVoucher';
import { ResellerPengaturan } from './pages/Reseller/Pengaturan';

function ProtectedRoute({ children, allowedRole }: { children: React.ReactNode; allowedRole: 'operator' | 'reseller' }) {
  const { currentUser } = useStore();

  if (!currentUser) {
    return <Navigate to="/login" replace />;
  }

  if (currentUser.role !== allowedRole) {
    return <Navigate to={`/${currentUser.role}`} replace />;
  }

  return <>{children}</>;
}

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/login" element={<Login />} />

        <Route
          path="/operator"
          element={
            <ProtectedRoute allowedRole="operator">
              <Layout />
            </ProtectedRoute>
          }
        >
          <Route index element={<OperatorDashboard />} />
          <Route path="import" element={<OperatorImport />} />
          <Route path="voucher" element={<OperatorDataVoucher />} />
          <Route path="reseller" element={<OperatorKelolaReseller />} />
          <Route path="cetak" element={<OperatorManagementCetak />} />
          <Route path="print" element={<OperatorPrint />} />
          <Route path="request" element={<OperatorRequestVoucher />} />
          <Route path="pengaturan" element={<OperatorPengaturan />} />
        </Route>

        <Route
          path="/reseller"
          element={
            <ProtectedRoute allowedRole="reseller">
              <Layout />
            </ProtectedRoute>
          }
        >
          <Route index element={<ResellerDashboard />} />
          <Route path="cetak" element={<ResellerCetak />} />
          <Route path="request" element={<ResellerRequestVoucher />} />
          <Route path="laporan" element={<ResellerLaporan />} />
          <Route path="pengaturan" element={<ResellerPengaturan />} />
        </Route>

        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}
