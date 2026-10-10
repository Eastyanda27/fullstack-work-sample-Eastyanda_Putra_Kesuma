import { useEffect, useState } from 'react';
import { useRenderCount } from '@/hooks/use-render-count';
import { cn } from '@/utils/cn';
import { formatCurrency, formatNumber } from '@/utils/format';
import { mockStockSocket } from '../../api/mock-stock-socket';
import { PRODUCT_GRID_COLS, RESTOCK_AMOUNT, TABLE_HEIGHT } from '../../constants/product-constants';
import { INITIAL_PRODUCTS } from '../../data/initial-products';
import { countByStatus, getStockStatus } from '../../helper/product-helper';
import type { IProduct } from '../../types/product-types';
import { StockStatusBadge } from '../badge/stock-status-badge';
import { STOCK_STATUSES, StockSummaryCard } from '../summary/stock-summary-card';
import { ProductTableHeader } from '../table/product-table-header';

/**
 * Ini pola yang menyebabkan lag pada soal:
 * 1. Seluruh array produk disimpan di useState komponen induk.
 * 2. Setiap pesan socket → `setProducts(prev.map(...))` → array baru →
 *    induk re render → 5.000 row ikut re render (tidak ada React.memo).
 * 3. Tidak ada virtualization: 5.000 row (±45.000 DOM node) selalu di-render.
 * 4. Derived state (summary) dihitung ulang di setiap render.
 * 5. Inline arrow function baru per row per render.
 */
export function NaiveProductDashboard() {
    const [products, setProducts] = useState<IProduct[]>(() =>
        INITIAL_PRODUCTS.map((product) => {
            const stock = mockStockSocket.getStock(product.id);
            return { ...product, stock, status: getStockStatus(stock) };
        })
    );
    const [selectedId, setSelectedId] = useState<string | null>(null);

    useEffect(
        () =>
            mockStockSocket.subscribe((update) => {
                setProducts((prev) =>
                    prev.map((product) =>
                        product.id === update.id
                            ? { ...product, stock: update.stock, status: getStockStatus(update.stock), updatedAt: Date.now() }
                            : product
                    )
                );
            }),
        []
    );

    const statusCount = countByStatus(products);

    return (
        <div className="flex flex-col gap-4">
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
                {STOCK_STATUSES.map((status) => (
                    <StockSummaryCard key={status} status={status} value={statusCount[status]} />
                ))}
            </div>
            <div className="overflow-x-auto rounded-xl border border-gray-200 bg-white dark:border-gray-800 dark:bg-gray-950">
                <div className="min-w-[1000px]">
                    <ProductTableHeader />
                    <div className="overflow-y-auto" style={{ height: TABLE_HEIGHT }}>
                        {products.map((product, index) => (
                            <NaiveProductRow
                                key={product.id}
                                index={index}
                                product={product}
                                isSelected={product.id === selectedId}
                                onSelect={() => setSelectedId(product.id)}
                                onRestock={() => mockStockSocket.restock(product.id, RESTOCK_AMOUNT)}
                            />
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}

interface NaiveProductRowProps {
    index: number;
    product: IProduct;
    isSelected: boolean;
    onSelect: () => void;
    onRestock: () => void;
}

function NaiveProductRow({ index, product, isSelected, onSelect, onRestock }: NaiveProductRowProps) {
    const renderCountRef = useRenderCount<HTMLSpanElement>();

    return (
        <div
            onClick={onSelect}
            className={cn(
                PRODUCT_GRID_COLS,
                'h-12 cursor-pointer border-b border-gray-100 text-sm text-gray-700 dark:border-gray-800 dark:text-gray-200',
                isSelected && 'bg-blue-50 dark:bg-blue-950/40'
            )}
        >
            <span className="text-gray-400">{index + 1}</span>
            <span className="font-mono text-xs text-gray-500">{product.sku}</span>
            <span className="truncate font-medium">{product.name}</span>
            <span className="truncate text-gray-500">{product.category}</span>
            <span className="text-right tabular-nums">{formatCurrency(product.price)}</span>
            <span className="px-1.5 text-right font-semibold tabular-nums">{formatNumber(product.stock)}</span>
            <StockStatusBadge status={product.status} />
            <span ref={renderCountRef} className="text-center font-mono text-xs text-red-500" />
            <button
                type="button"
                onClick={(event) => {
                    event.stopPropagation();
                    onRestock();
                }}
                className="rounded-md border border-gray-200 px-2 py-1 text-xs font-medium dark:border-gray-700"
            >
                +{RESTOCK_AMOUNT}
            </button>
        </div>
    );
}