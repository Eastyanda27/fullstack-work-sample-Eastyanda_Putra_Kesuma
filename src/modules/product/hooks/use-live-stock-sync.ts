import { useEffect } from 'react';
import { createFrameBatcher } from '@/libs/frame-batcher';
import { mockStockSocket } from '../api/mock-stock-socket';
import { useProductStore } from '../store/product-store';
import type { IStockUpdate } from '../types/product-types';

/**
 * Menyambungkan feed realtime ke store. Komponen yang memanggil hook ini
 * tidak ikut rerender saat ada pesan masuk. hook ini hanya mendispatch
 * ke store, tidak membaca state.
 */
export const useLiveStockSync = () => {
    const applyStockUpdates = useProductStore((state) => state.applyStockUpdates);

    useEffect(() => {
        // resync saat resubscribe agar tidak ada update yang terlewat
        applyStockUpdates(mockStockSocket.snapshot());

        const batcher = createFrameBatcher<IStockUpdate>((update) => update.id, applyStockUpdates);
        const unsubscribe = mockStockSocket.subscribe(batcher.push);

        return () => {
            unsubscribe();
            batcher.cancel();
        };
    }, [applyStockUpdates]);
};