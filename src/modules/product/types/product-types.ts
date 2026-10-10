export type StockStatus = 'in_stock' | 'low_stock' | 'out_of_stock';

export type StatusFilter = StockStatus | 'all';

export interface IProduct {
    id: string;
    sku: string;
    name: string;
    category: string;
    price: number;
    stock: number;
    status: StockStatus;
    updatedAt: number;
    keywords: string;
}

/** Payload pesan real-time dari server (WebSocket / SSE) */
export interface IStockUpdate {
    id: string;
    stock: number;
}
