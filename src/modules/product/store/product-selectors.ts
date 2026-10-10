import type { IProduct, StatusFilter } from '../types/product-types';

interface VisibleIdsSource {
    ids: string[];
    byId: Record<string, IProduct>;
}

/**
 * Tanpa filter, kembalikan ids asli (referensi stabil). Dengan filter,
 * hasilnya array baru komponen membungkusnya dengan useShallow sehingga
 * tabel hanya re render bila isi daftar id benar-benar berubah.
 */
export const selectVisibleIds = (
    { ids, byId }: VisibleIdsSource,
    query: string,
    status: StatusFilter
): string[] => {
    const keyword = query.trim().toLowerCase();
    if (!keyword && status === 'all') return ids;

    return ids.filter((id) => {
        const product = byId[id];
        if (status !== 'all' && product.status !== status) return false;
        return !keyword || product.keywords.includes(keyword);
    });
};
