export const DEFAULT_TEMPLATE_CSS = `/* CSS Variabel akan di-inject secara dinamis oleh sistem */
/*
:root {
  --paper-w-mm: 330;
  --paper-h-mm: 215;
  --margin-mm: 5;
  --gap-x-mm: 4;
  --gap-y-mm: 4;
  --voucher-w-mm: 60.8;
  --voucher-h-mm: 37.6;
  --cols: 5;
  --rows: 6;
}
*/

@media print {
  @page {
    size: calc(var(--paper-w-mm) * 1mm) calc(var(--paper-h-mm) * 1mm);
    margin: 0;
  }
  body {
    margin: 0;
    -webkit-print-color-adjust: exact;
    print-color-adjust: exact;
  }
}

.print-container {
  width: calc(var(--paper-w-mm) * 1mm);
  height: calc(var(--paper-h-mm) * 1mm);
  padding: calc(var(--margin-mm) * 1mm);
  box-sizing: border-box;
  display: grid;
  grid-template-columns: repeat(var(--cols), calc(var(--voucher-w-mm) * 1mm));
  grid-template-rows: repeat(var(--rows), calc(var(--voucher-h-mm) * 1mm));
  column-gap: calc(var(--gap-x-mm) * 1mm);
  row-gap: calc(var(--gap-y-mm) * 1mm);
  background: white;
  margin: 0 auto;
  position: relative;
}

.voucher {
  width: calc(var(--voucher-w-mm) * 1mm);
  height: calc(var(--voucher-h-mm) * 1mm);
  box-sizing: border-box;
  border: 1px solid #e2e8f0;
  border-radius: 8px;
  padding: 4mm;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  position: relative;
  background: #ffffff;
  overflow: hidden;
}

/* Modern Minimalist Voucher Design */
.voucher {
  width: calc(var(--voucher-w-mm) * 1mm);
  height: calc(var(--voucher-h-mm) * 1mm);
  box-sizing: border-box;
  border: 1px solid #e2e8f0;
  border-radius: 12px;
  padding: 4mm;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  position: relative;
  background: #ffffff;
  overflow: hidden;
}

.voucher::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  width: 4mm;
  height: 100%;
  background: #0f172a;
}

.voucher-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  padding-left: 2mm;
}

.voucher-brand {
  font-family: 'Plus Jakarta Sans', system-ui, sans-serif;
  font-weight: 800;
  font-size: 9pt;
  color: #0f172a;
  line-height: 1.2;
  text-transform: uppercase;
  letter-spacing: -0.5px;
}

.voucher-price {
  font-family: 'Plus Jakarta Sans', system-ui, sans-serif;
  font-weight: 800;
  font-size: 10pt;
  color: #0f172a;
  background: #f8fafc;
  padding: 1mm 2mm;
  border-radius: 6px;
  border: 1px solid #e2e8f0;
}

.voucher-body {
  flex: 1;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  padding-left: 2mm;
}

.voucher-code {
  font-family: 'JetBrains Mono', monospace;
  font-size: 16pt;
  font-weight: 800;
  letter-spacing: 3px;
  color: #0f172a;
}

.voucher-period {
  font-family: 'Plus Jakarta Sans', system-ui, sans-serif;
  font-size: 7pt;
  font-weight: 600;
  color: #64748b;
  text-transform: uppercase;
  letter-spacing: 1px;
  margin-top: 1mm;
  background: #f1f5f9;
  padding: 0.5mm 2mm;
  border-radius: 4px;
}

.voucher-footer {
  font-family: 'Plus Jakarta Sans', system-ui, sans-serif;
  font-size: 5pt;
  font-weight: 600;
  color: #94a3b8;
  text-align: right;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

/* Crop marks (L shape at corners) */
.with-crop .voucher::before,
.with-crop .voucher::after {
  content: '';
  position: absolute;
  pointer-events: none;
}

.with-crop .voucher::before {
  border-left: 0.3mm solid #94a3b8;
  border-right: 0.3mm solid #94a3b8;
  width: 100%;
  height: calc(100% + 6mm);
  top: -3mm;
  left: 0;
  box-sizing: border-box;
}

.with-crop .voucher::after {
  border-top: 0.3mm solid #94a3b8;
  border-bottom: 0.3mm solid #94a3b8;
  height: 100%;
  width: calc(100% + 6mm);
  left: -3mm;
  top: 0;
  box-sizing: border-box;
}

/* Cut dots */
.with-cut-dots .voucher::before {
  content: '';
  position: absolute;
  width: 1mm;
  height: 1mm;
  background: #64748b;
  border-radius: 50%;
  top: calc(-0.5mm - (var(--gap-y-mm) * 0.5mm));
  left: calc(-0.5mm - (var(--gap-x-mm) * 0.5mm));
  box-shadow: 
    calc(var(--voucher-w-mm) * 1mm + var(--gap-x-mm) * 1mm) 0 0 0 #64748b,
    0 calc(var(--voucher-h-mm) * 1mm + var(--gap-y-mm) * 1mm) 0 0 #64748b,
    calc(var(--voucher-w-mm) * 1mm + var(--gap-x-mm) * 1mm) calc(var(--voucher-h-mm) * 1mm + var(--gap-y-mm) * 1mm) 0 0 #64748b;
}
`;

export function generateVoucherHtml(vouchers: any[], businessName: string = "WIFI VOUCHER", logoUrl?: string) {
  let html = '';
  for (let i = 0; i < vouchers.length; i++) {
    const v = vouchers[i] || {};
    const priceStr = v.price ? `Rp ${v.price.toLocaleString('id-ID')}` : 'Rp 2.000';
    const codeStr = v.code || `A${i}B2C3`;
    const periodStr = v.period || '3 Jam';
    
    html += `
      <div class="voucher">
        <div class="voucher-header">
          <div class="voucher-brand" style="display: flex; align-items: center; gap: 4px;">
            ${logoUrl ? `<img src="${logoUrl}" style="height: 16px; width: auto; object-fit: contain;" />` : ''}
            ${businessName}
          </div>
          <div class="voucher-price">${priceStr}</div>
        </div>
        <div class="voucher-body">
          <div class="voucher-code">${codeStr}</div>
          <div class="voucher-period">${periodStr}</div>
        </div>
        <div class="voucher-footer">
          Gunakan sebelum 31 Des 2026
        </div>
      </div>
    `;
  }
  return html;
}
