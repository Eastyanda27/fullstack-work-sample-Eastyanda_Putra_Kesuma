import { PRODUCT_COUNT } from '../constants/product-constants';
import { generateProducts } from '../helper/product-helper';

/** Pengganti response GET /products — 5.000 item */
export const INITIAL_PRODUCTS = generateProducts(PRODUCT_COUNT);
