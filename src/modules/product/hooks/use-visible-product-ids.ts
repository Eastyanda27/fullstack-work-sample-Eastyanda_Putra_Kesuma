import { useShallow } from 'zustand/react/shallow';
import { useProductStore } from '../store/product-store';
import { selectVisibleIds } from '../store/product-selectors';
import type { StatusFilter } from '../types/product-types';

export const useVisibleProductIds = (query: string, status: StatusFilter) =>
    useProductStore(useShallow((state) => selectVisibleIds(state, query, status)));