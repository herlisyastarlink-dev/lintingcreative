export interface TemplateParams {
  paperPreset: 'A4' | 'F4' | 'CUSTOM';
  customWidth?: number;
  customHeight?: number;
  orientation: 'portrait' | 'landscape';
  columns: number;
  rows: number;
  marginMm: number;
  gapXmm: number;
  gapYmm: number;
}

export interface CalculationResult {
  widthMm: number;
  heightMm: number;
  effectiveWidthMm: number;
  effectiveHeightMm: number;
  gapXTotal: number;
  gapYTotal: number;
  voucherWidthMm: number;
  voucherHeightMm: number;
  totalVouchers: number;
  error?: string;
  warning?: string;
}

export function calculateTemplate(params: TemplateParams): CalculationResult {
  let w = 0;
  let h = 0;

  if (params.paperPreset === 'A4') {
    w = 210;
    h = 297;
  } else if (params.paperPreset === 'F4') {
    w = 215;
    h = 330;
  } else {
    w = params.customWidth || 210;
    h = params.customHeight || 297;
  }

  if (params.orientation === 'landscape') {
    const temp = w;
    w = h;
    h = temp;
  }

  const effectiveWidthMm = w - (2 * params.marginMm);
  const effectiveHeightMm = h - (2 * params.marginMm);

  const gapXTotal = (params.columns - 1) * params.gapXmm;
  const gapYTotal = (params.rows - 1) * params.gapYmm;

  const voucherWidthMm = (effectiveWidthMm - gapXTotal) / params.columns;
  const voucherHeightMm = (effectiveHeightMm - gapYTotal) / params.rows;

  let error = undefined;
  let warning = undefined;

  if (effectiveWidthMm <= 0 || effectiveHeightMm <= 0) {
    error = 'Margin terlalu besar';
  } else if (voucherWidthMm <= 0 || voucherHeightMm <= 0) {
    error = 'Grid/gap tidak muat';
  } else if (voucherWidthMm < 20 || voucherHeightMm < 20) {
    warning = 'Ukuran voucher terlalu kecil (< 20mm)';
  }

  return {
    widthMm: w,
    heightMm: h,
    effectiveWidthMm,
    effectiveHeightMm,
    gapXTotal,
    gapYTotal,
    voucherWidthMm,
    voucherHeightMm,
    totalVouchers: params.columns * params.rows,
    error,
    warning
  };
}
