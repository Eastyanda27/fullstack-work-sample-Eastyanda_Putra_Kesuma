import { memo } from 'react';
import { cn } from '@/utils/cn';
import { formatNumber } from '@/utils/format';
import { STOCK_STATUS_LABEL } from '../../constants/product-constants';
import { useProductStore } from '../../store/product-store';
import type { StockStatus } from '../../types/product-types';

const ACCENT: Record<StockStatus, string> = {
    in_stock: 'bg-emerald-500',
    low_stock: 'bg-amber-500',
    out_of_stock: 'bg-red-500',
};

export const STOCK_STATUSES: StockStatus[] = ['in_stock', 'low_stock', 'out_of_stock'];

interface StockSummaryCardProps {
    status: StockStatus;
    value: number;
}

export function StockSummaryCard({ status, value }: StockSummaryCardProps) {
    return (
        <div className="rounded-xl border border-gray-200 bg-white p-4 dark:border-gray-800 dark:bg-gray-950">
            <div className="flex items-center gap-2 text-sm text-gray-500">
                <span className={cn('size-2 rounded-full', ACCENT[status])} />
                {STOCK_STATUS_LABEL[status]}
            </div>
            <p className="mt-1 text-2xl font-semibold tabular-nums">{formatNumber(value)}</p>
        </div>
    );
}

/** Versi terhubung ke store: selector mengembalikan number (primitive), jadi
 *  kartu hanya re render saat angkanya berubah bukan setiap ada update stok. */
const LiveStockSummaryCard = memo(function LiveStockSummaryCard({ status }: { status: StockStatus }) {
    const value = useProductStore((state) => state.statusCount[status]);
    return <StockSummaryCard status={status} value={value} />;
});

export function LiveStockSummary() {
    return (
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
            {STOCK_STATUSES.map((status) => (
                <LiveStockSummaryCard key={status} status={status} />
            ))}
        </div>
    );
}