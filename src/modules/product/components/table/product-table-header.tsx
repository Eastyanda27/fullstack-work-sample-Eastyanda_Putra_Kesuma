import { cn } from '@/utils/cn';
import { PRODUCT_GRID_COLS } from '../../constants/product-constants';

const COLUMNS = ['#', 'SKU', 'Product', 'Category', 'Price', 'Stock', 'Status', 'Renders', 'Action'];

export function ProductTableHeader() {
    return (
        <div
            role="row"
            className={cn(
                PRODUCT_GRID_COLS,
                'h-10 border-b border-gray-200 bg-gray-50 text-xs font-semibold tracking-wide text-gray-500 uppercase dark:border-gray-800 dark:bg-gray-900 dark:text-gray-400'
            )}
        >
            {COLUMNS.map((column) => (
                <span
                    key={column}
                    role="columnheader"
                    className={cn((column === 'Price' || column === 'Stock') && 'text-right', column === 'Renders' && 'text-center')}
                >
                    {column}
                </span>
            ))}
        </div>
    );
}