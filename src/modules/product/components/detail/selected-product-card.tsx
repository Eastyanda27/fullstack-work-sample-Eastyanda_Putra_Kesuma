import { X } from 'lucide-react';
import { formatCurrency, formatNumber } from '@/utils/format';
import { useProductStore } from '../../store/product-store';
import { StockStatusBadge } from '../badge/stock-status-badge';

/** Hanya re render saat produk yang sedang dipilih berubah. */
export function SelectedProductCard() {
    const product = useProductStore((state) => (state.selectedId ? state.byId[state.selectedId] : null));
    const selectProduct = useProductStore((state) => state.selectProduct);

    if (!product) {
        return (
            <p className="rounded-xl border border-dashed border-gray-200 px-4 py-3 text-sm text-gray-500 dark:border-gray-800">
                Klik salah satu baris untuk melihat detail produk. Perhatikan kolom <b>Renders</b>: memilih baris hanya me-render
                ulang 2 baris (yang lama & yang baru).
            </p>
        );
    }

    return (
        <div className="flex flex-wrap items-center gap-x-6 gap-y-2 rounded-xl border border-blue-200 bg-blue-50/60 px-4 py-3 text-sm dark:border-blue-900 dark:bg-blue-950/30">
            <div>
                <p className="font-mono text-xs text-gray-500">{product.sku}</p>
                <p className="font-semibold">{product.name}</p>
            </div>
            <p>
                <span className="text-gray-500">Kategori:</span> {product.category}
            </p>
            <p>
                <span className="text-gray-500">Harga:</span> {formatCurrency(product.price)}
            </p>
            <p>
                <span className="text-gray-500">Stok:</span> <b className="tabular-nums">{formatNumber(product.stock)}</b>
            </p>
            <StockStatusBadge status={product.status} />
            <button
                type="button"
                onClick={() => selectProduct(null)}
                className="ml-auto rounded-md p-1 text-gray-500 hover:bg-white dark:hover:bg-gray-900"
                aria-label="Tutup detail"
            >
                <X className="size-4" />
            </button>
        </div>
    );
}