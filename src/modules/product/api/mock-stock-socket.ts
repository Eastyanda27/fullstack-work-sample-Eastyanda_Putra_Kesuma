import { INITIAL_PRODUCTS } from '../data/initial-products';
import type { IStockUpdate } from '../types/product-types';

/**
 * Simulasi server push (WebSocket / SSE). Di production bagian ini diganti
 * `createSseConnection` / WebSocket client — kontraknya sama: pesan per item
 * berisi id, stock yang datang dengan frekuensi tinggi dan tidak beraturan.
 */
type StockListener = (update: IStockUpdate) => void;

const TICK_MS = 50;

const listeners = new Set<StockListener>();
const stockById = new Map(INITIAL_PRODUCTS.map((product) => [product.id, product.stock]));
const productIds = INITIAL_PRODUCTS.map((product) => product.id);

let timer: ReturnType<typeof setInterval> | null = null;
let ratePerSecond = 0;
let budget = 0;

const emit = (update: IStockUpdate) => {
    stockById.set(update.id, update.stock);
    listeners.forEach((listener) => listener(update));
};

const nextStock = (current: number) => {
    if (Math.random() < 0.85) return Math.max(0, current - (1 + Math.floor(Math.random() * 3)));
    return current + 5 + Math.floor(Math.random() * 20);
};

const tick = () => {
    budget += (ratePerSecond * TICK_MS) / 1000;

    while (budget >= 1) {
        budget -= 1;
        const id = productIds[Math.floor(Math.random() * productIds.length)];
        emit({ id, stock: nextStock(stockById.get(id) ?? 0) });
    }
};

export const mockStockSocket = {
    subscribe(listener: StockListener) {
        listeners.add(listener);
        return () => {
            listeners.delete(listener);
        };
    },

    /** Snapshot state server dipakai untuk re sync saat reconnect */
    snapshot(): IStockUpdate[] {
        return Array.from(stockById, ([id, stock]) => ({ id, stock }));
    },

    getStock(id: string) {
        return stockById.get(id) ?? 0;
    },

    start(rate: number) {
        ratePerSecond = rate;
        if (timer === null) timer = setInterval(tick, TICK_MS);
    },

    stop() {
        if (timer !== null) clearInterval(timer);
        timer = null;
        budget = 0;
    },

    /** Simulasi POST /products/:id/restock → server membroadcast stok baru */
    restock(id: string, amount: number) {
        emit({ id, stock: (stockById.get(id) ?? 0) + amount });
    },
};