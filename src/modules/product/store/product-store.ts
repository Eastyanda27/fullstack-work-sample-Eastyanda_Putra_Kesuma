import { create } from 'zustand';
import { INITIAL_PRODUCTS } from '../data/initial-products';
import { countByStatus, getStockStatus } from '../helper/product-helper';
import type { IProduct, IStockUpdate, StockStatus } from '../types/product-types';

/**
 * State dinormalisasi: ids (urutan) dipisah dari byId (isi).
 * Update stok hanya mengganti referensi object item yang berubah —
 * ids dan object item lain tetap referensi yang sama, sehingga
 * selector per row di row lain tidak memicu rerender.
 */
interface ProductStoreState {
    ids: string[];
    byId: Record<string, IProduct>;
    statusCount: Record<StockStatus, number>;
    selectedId: string | null;
    setProducts: (products: IProduct[]) => void;
    applyStockUpdates: (updates: IStockUpdate[]) => void;
    selectProduct: (id: string | null) => void;
}

const normalize = (products: IProduct[]) => ({
    ids: products.map((product) => product.id),
    byId: Object.fromEntries(products.map((product) => [product.id, product])),
    statusCount: countByStatus(products),
});

export const useProductStore = create<ProductStoreState>((set, get) => ({
    ...normalize(INITIAL_PRODUCTS),
    selectedId: null,

    setProducts: (products) => set({ ...normalize(products), selectedId: null }),

    applyStockUpdates: (updates) => {
        const { byId, statusCount } = get();
        let nextById: Record<string, IProduct> | null = null;
        let nextCount: Record<StockStatus, number> | null = null;
        const now = Date.now();

        for (const { id, stock } of updates) {
            const current = (nextById ?? byId)[id];
            if (!current || current.stock === stock) continue;

            nextById ??= { ...byId };
            const status = getStockStatus(stock);

            if (status !== current.status) {
                nextCount ??= { ...statusCount };
                nextCount[current.status] -= 1;
                nextCount[status] += 1;
            }

            nextById[id] = { ...current, stock, status, updatedAt: now };
        }

        if (!nextById) return;
        set(nextCount ? { byId: nextById, statusCount: nextCount } : { byId: nextById });
    },

    selectProduct: (id) => set({ selectedId: id }),
}));