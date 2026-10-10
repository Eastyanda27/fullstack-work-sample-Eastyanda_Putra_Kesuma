import { useDeferredValue, useState } from 'react';
import { useLiveStockSync } from '../../hooks/use-live-stock-sync';
import { useVisibleProductIds } from '../../hooks/use-visible-product-ids';
import type { StatusFilter } from '../../types/product-types';
import { SelectedProductCard } from '../detail/selected-product-card';
import { LiveStockSummary } from '../summary/stock-summary-card';
import { ProductTable } from '../table/product-table';
import { ProductToolbar } from '../toolbar/product-toolbar';

/**
 * Versi optimized.
 * - Komponen ini hanya memegang state UI (query & filter), bukan data produk.
 * - Data produk ada di store, tiap row/kartu berlangganan potongan kecilnya sendiri.
 * - useDeferredValue menjaga input tetap responsif saat memfilter 5.000 item.
 */
export function ProductDashboard() {
    useLiveStockSync();

    const [query, setQuery] = useState('');
    const [status, setStatus] = useState<StatusFilter>('all');
    const deferredQuery = useDeferredValue(query);
    const ids = useVisibleProductIds(deferredQuery, status);

    return (
        <div className="flex flex-col gap-4">
            <LiveStockSummary />
            <ProductToolbar
                query={query}
                status={status}
                resultCount={ids.length}
                onQueryChange={setQuery}
                onStatusChange={setStatus}
            />
            <SelectedProductCard />
            <ProductTable ids={ids} />
        </div>
    );
}
