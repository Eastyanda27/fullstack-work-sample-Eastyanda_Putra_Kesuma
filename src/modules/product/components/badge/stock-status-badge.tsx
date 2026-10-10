import { cn } from '@/utils/cn';
import { STOCK_STATUS_LABEL } from '../../constants/product-constants';
import type { StockStatus } from '../../types/product-types';

export const getStockStatusBadge = (status: StockStatus) => {
    switch (status) {
        case 'in_stock':
            return 'bg-emerald-50 text-emerald-600 border-emerald-200 dark:bg-emerald-950/40 dark:text-emerald-300 dark:border-emerald-900';
        case 'low_stock':
            return 'bg-amber-50 text-amber-600 border-amber-200 dark:bg-amber-950/40 dark:text-amber-300 dark:border-amber-900';
        case 'out_of_stock':
            return 'bg-red-50 text-red-600 border-red-200 dark:bg-red-950/40 dark:text-red-300 dark:border-red-900';
    }
};

export function StockStatusBadge({ status }: { status: StockStatus }) {
    return (
        <span
            className={cn(
                'inline-flex w-fit items-center rounded-full border px-2 py-0.5 text-xs font-medium whitespace-nowrap',
                getStockStatusBadge(status)
            )}
        >
            {STOCK_STATUS_LABEL[status]}
        </span>
    );
}