import { memo, useMemo } from 'react';
import { FixedSizeList } from 'react-window';
import { ROW_HEIGHT, TABLE_HEIGHT } from '../../constants/product-constants';
import { ProductRow, type ProductRowData } from './product-row';
import { ProductTableHeader } from './product-table-header';

interface ProductTableProps {
    ids: string[];
}

// Key berbasis id bukan index supaya React tidak salah mereuse row saat
// data difilter. Fungsi di module scope = referensi stabil tanpa useCallback.
const getItemKey = (index: number, data: ProductRowData) => data.ids[index];

/**
 * Tabel hanya menerima ids. Perubahan stok tidak mengubah ids, jadi
 * komponen ini dan FixedSizeList tidak rerender sama sekali saat feed
 * real-time berjalan — yang rerender hanya row yang datanya berubah.
 */
export const ProductTable = memo(function ProductTable({ ids }: ProductTableProps) {
    // itemData harus stabil, object literal baru di setiap render akan
    // mematahkan areEqual dan memaksa semua row visible rerender.
    const itemData = useMemo<ProductRowData>(() => ({ ids }), [ids]);

    return (
        <div className="overflow-x-auto rounded-xl border border-gray-200 bg-white dark:border-gray-800 dark:bg-gray-950">
            <div role="table" aria-rowcount={ids.length} className="min-w-[1000px]">
                <ProductTableHeader />
                {ids.length === 0 ? (
                    <p className="py-16 text-center text-sm text-gray-500">Tidak ada produk yang cocok dengan filter.</p>
                ) : (
                    <FixedSizeList
                        height={TABLE_HEIGHT}
                        width="100%"
                        itemCount={ids.length}
                        itemSize={ROW_HEIGHT}
                        itemData={itemData}
                        itemKey={getItemKey}
                        overscanCount={8}
                    >
                        {ProductRow}
                    </FixedSizeList>
                )}
            </div>
        </div>
    );
});