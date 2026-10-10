import { memo, useCallback, type MouseEvent } from 'react';
import { areEqual, type ListChildComponentProps } from 'react-window';
import { PackagePlus } from 'lucide-react';
import { useRenderCount } from '@/hooks/use-render-count';
import { cn } from '@/utils/cn';
import { formatCurrency, formatNumber } from '@/utils/format';
import { mockStockSocket } from '../../api/mock-stock-socket';
import { PRODUCT_GRID_COLS, RESTOCK_AMOUNT } from '../../constants/product-constants';
import { useProductStore } from '../../store/product-store';
import { StockStatusBadge } from '../badge/stock-status-badge';

export interface ProductRowData {
    ids: string[];
}

const FLASH_WINDOW_MS = 1000;

/**
 * Setiap row berlangganan HANYA ke datanya sendiri dan ke boolean
 * isSelected nya. Saat stok produk X berubah, hanya row X yang re render.
 * areEqual dari react-window mencegah re render saat list di scroll bila
 * style & data tidak berubah.
 */
export const ProductRow = memo(function ProductRow({
    index,
    style,
    data,
}: ListChildComponentProps<ProductRowData>) {
    const id = data.ids[index];
    const product = useProductStore((state) => state.byId[id]);
    const isSelected = useProductStore((state) => state.selectedId === id);
    const selectProduct = useProductStore((state) => state.selectProduct);
    const renderCountRef = useRenderCount<HTMLSpanElement>();

    const handleSelect = useCallback(() => selectProduct(id), [selectProduct, id]);

    const handleRestock = useCallback(
        (event: MouseEvent<HTMLButtonElement>) => {
            event.stopPropagation();
            mockStockSocket.restock(id, RESTOCK_AMOUNT);
        },
        [id]
    );

    const isFresh = Date.now() - product.updatedAt < FLASH_WINDOW_MS;

    return (
        <div
            style={style}
            role="row"
            aria-selected={isSelected}
            onClick={handleSelect}
            className={cn(
                PRODUCT_GRID_COLS,
                'cursor-pointer border-b border-gray-100 text-sm text-gray-700 transition-colors hover:bg-gray-50 dark:border-gray-800 dark:text-gray-200 dark:hover:bg-gray-800/50',
                isSelected && 'bg-blue-50 hover:bg-blue-50 dark:bg-blue-950/40 dark:hover:bg-blue-950/40'
            )}
        >
            <span className="text-gray-400">{index + 1}</span>
            <span className="font-mono text-xs text-gray-500">{product.sku}</span>
            <span className="truncate font-medium">{product.name}</span>
            <span className="truncate text-gray-500">{product.category}</span>
            <span className="text-right tabular-nums">{formatCurrency(product.price)}</span>
            <span
                // key berubah → elemen di mount ulang → animasi flash diputar ulang
                key={product.updatedAt}
                className={cn('rounded px-1.5 py-0.5 text-right font-semibold tabular-nums', isFresh && 'animate-flash')}
            >
                {formatNumber(product.stock)}
            </span>
            <StockStatusBadge status={product.status} />
            <span ref={renderCountRef} className="text-center font-mono text-xs text-gray-400" title="Jumlah render row ini" />
            <button
                type="button"
                onClick={handleRestock}
                className="inline-flex items-center justify-center gap-1 rounded-md border border-gray-200 px-2 py-1 text-xs font-medium hover:bg-white dark:border-gray-700 dark:hover:bg-gray-900"
            >
                <PackagePlus className="size-3.5" />+{RESTOCK_AMOUNT}
            </button>
        </div>
    );
}, areEqual);