import type { StatusFilter, StockStatus } from '../types/product-types';

export const PRODUCT_COUNT = 5000;
export const LOW_STOCK_THRESHOLD = 10;
export const RESTOCK_AMOUNT = 50;

export const ROW_HEIGHT = 48;
export const TABLE_HEIGHT = 560;

/** Pilihan kecepatan feed real-time (update per detik) */
export const FEED_RATES = [10, 100, 1000] as const;
export type FeedRate = (typeof FEED_RATES)[number];

export const STOCK_STATUS_LABEL: Record<StockStatus, string> = {
    in_stock: 'In Stock',
    low_stock: 'Low Stock',
    out_of_stock: 'Out of Stock',
};

export const STATUS_FILTER_OPTIONS: { label: string; value: StatusFilter }[] = [
    { label: 'All Status', value: 'all' },
    { label: STOCK_STATUS_LABEL.in_stock, value: 'in_stock' },
    { label: STOCK_STATUS_LABEL.low_stock, value: 'low_stock' },
    { label: STOCK_STATUS_LABEL.out_of_stock, value: 'out_of_stock' },
];

export const PRODUCT_GRID_COLS =
    'grid grid-cols-[56px_96px_minmax(200px,1fr)_120px_120px_72px_116px_72px_104px] items-center gap-x-3 px-4';
