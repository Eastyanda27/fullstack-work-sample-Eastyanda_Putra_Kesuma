// Formatter dibuat sekali di module scope — membuat Intl.NumberFormat di dalam
// render row (5.000x) adalah salah satu sumber lag yang sering terlewat.
const currencyFormatter = new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    maximumFractionDigits: 0,
});

const numberFormatter = new Intl.NumberFormat('id-ID');

export const formatCurrency = (value: number) => currencyFormatter.format(value);

export const formatNumber = (value: number) => numberFormatter.format(value);