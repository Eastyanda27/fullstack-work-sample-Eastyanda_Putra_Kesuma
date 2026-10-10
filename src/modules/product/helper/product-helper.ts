import { LOW_STOCK_THRESHOLD } from '../constants/product-constants';
import type { IProduct, StockStatus } from '../types/product-types';

export const getStockStatus = (stock: number): StockStatus => {
    if (stock <= 0) return 'out_of_stock';
    if (stock <= LOW_STOCK_THRESHOLD) return 'low_stock';
    return 'in_stock';
};

export const countByStatus = (products: IProduct[]): Record<StockStatus, number> => {
    const count: Record<StockStatus, number> = { in_stock: 0, low_stock: 0, out_of_stock: 0 };
    for (const product of products) count[product.status] += 1;
    return count;
};

/** PRNG deterministik (mulberry32) agar data dummy selalu sama di setiap reload */
const createRandom = (seed: number) => () => {
    seed = (seed + 0x6d2b79f5) | 0;
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
};

const ADJECTIVES = ['Classic', 'Premium', 'Smart', 'Eco', 'Ultra', 'Compact', 'Pro', 'Lite', 'Wireless', 'Organic'];
const ITEMS = ['Headphone', 'Backpack', 'Sneakers', 'Coffee Beans', 'Desk Lamp', 'Water Bottle', 'Keyboard', 'Jacket', 'Smartwatch', 'Yoga Mat', 'Blender', 'Sunglasses'];
const CATEGORIES = ['Electronics', 'Fashion', 'Home Living', 'Sports', 'Food & Bev', 'Beauty'];

export const generateProducts = (count: number, seed = 42): IProduct[] => {
    const random = createRandom(seed);
    const pick = <T,>(list: T[]) => list[Math.floor(random() * list.length)];

    return Array.from({ length: count }, (_, index) => {
        const sku = `SKU-${String(index + 1).padStart(5, '0')}`;
        const name = `${pick(ADJECTIVES)} ${pick(ITEMS)} ${index + 1}`;
        const stock = random() < 0.08 ? 0 : Math.floor(random() * 120);

        return {
            id: `p-${index + 1}`,
            sku,
            name,
            category: pick(CATEGORIES),
            price: Math.round((20 + random() * 2980) * 1000),
            stock,
            status: getStockStatus(stock),
            updatedAt: 0,
            keywords: `${sku} ${name}`.toLowerCase(),
        };
    });
};
