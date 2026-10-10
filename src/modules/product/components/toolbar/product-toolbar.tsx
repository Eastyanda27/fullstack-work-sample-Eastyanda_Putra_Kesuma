import { memo } from 'react';
import { Search } from 'lucide-react';
import { STATUS_FILTER_OPTIONS } from '../../constants/product-constants';
import type { StatusFilter } from '../../types/product-types';

interface ProductToolbarProps {
    query: string;
    status: StatusFilter;
    resultCount: number;
    onQueryChange: (query: string) => void;
    onStatusChange: (status: StatusFilter) => void;
}

export const ProductToolbar = memo(function ProductToolbar({
    query,
    status,
    resultCount,
    onQueryChange,
    onStatusChange,
}: ProductToolbarProps) {
    return (
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
            <label className="relative flex-1">
                <span className="sr-only">Cari produk</span>
                <Search className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-gray-400" />
                <input
                    value={query}
                    onChange={(event) => onQueryChange(event.target.value)}
                    placeholder="Cari SKU atau nama produk..."
                    className="h-10 w-full rounded-lg border border-gray-200 bg-white pr-3 pl-9 text-sm outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-100 dark:border-gray-700 dark:bg-gray-900 dark:focus:ring-blue-950"
                />
            </label>
            <select
                value={status}
                onChange={(event) => onStatusChange(event.target.value as StatusFilter)}
                className="h-10 rounded-lg border border-gray-200 bg-white px-3 text-sm outline-none focus:border-blue-400 dark:border-gray-700 dark:bg-gray-900"
            >
                {STATUS_FILTER_OPTIONS.map((option) => (
                    <option key={option.value} value={option.value}>
                        {option.label}
                    </option>
                ))}
            </select>
            <span className="text-sm whitespace-nowrap text-gray-500 tabular-nums">{resultCount.toLocaleString('id-ID')} produk</span>
        </div>
    );
});