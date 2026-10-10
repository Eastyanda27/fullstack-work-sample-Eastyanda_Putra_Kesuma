import { beforeEach, describe, expect, it } from 'vitest';
import { generateProducts } from '../helper/product-helper';
import { selectVisibleIds } from './product-selectors';
import { useProductStore } from './product-store';

const PRODUCTS = generateProducts(100, 7);

describe('product store', () => {
    beforeEach(() => {
        useProductStore.getState().setProducts(PRODUCTS);
    });

    it('hanya mengganti referensi item yang berubah', () => {
        const before = useProductStore.getState();
        const [changed, untouched] = before.ids;

        before.applyStockUpdates([{ id: changed, stock: before.byId[changed].stock + 5 }]);
        const after = useProductStore.getState();

        expect(after.byId[changed]).not.toBe(before.byId[changed]);
        expect(after.byId[changed].stock).toBe(before.byId[changed].stock + 5);
        expect(after.byId[untouched]).toBe(before.byId[untouched]);
        expect(after.ids).toBe(before.ids);
    });

    it('tidak membuat state baru bila stok sama (no-op)', () => {
        const before = useProductStore.getState();
        const id = before.ids[0];

        before.applyStockUpdates([{ id, stock: before.byId[id].stock }]);

        expect(useProductStore.getState().byId).toBe(before.byId);
    });

    it('memperbarui statusCount secara incremental', () => {
        const state = useProductStore.getState();
        const id = state.ids.find((key) => state.byId[key].status === 'in_stock')!;
        const { in_stock, out_of_stock } = state.statusCount;

        state.applyStockUpdates([{ id, stock: 0 }]);
        const next = useProductStore.getState();

        expect(next.byId[id].status).toBe('out_of_stock');
        expect(next.statusCount.in_stock).toBe(in_stock - 1);
        expect(next.statusCount.out_of_stock).toBe(out_of_stock + 1);
    });

    it('selectVisibleIds mengembalikan referensi ids asli tanpa filter', () => {
        const state = useProductStore.getState();

        expect(selectVisibleIds(state, '', 'all')).toBe(state.ids);
        expect(selectVisibleIds(state, 'sku-00001', 'all')).toEqual(['p-1']);
    });
});
