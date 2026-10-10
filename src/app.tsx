import { useState } from 'react';
import { FeedControls } from '@/components/feed-controls';
import { FpsMeter } from '@/components/fps-meter';
import { useRenderCount } from '@/hooks/use-render-count';
import { NaiveProductDashboard } from '@/modules/product/components/dashboard/naive-product-dashboard';
import { ProductDashboard } from '@/modules/product/components/dashboard/product-dashboard';
import { PRODUCT_COUNT } from '@/modules/product/constants/product-constants';
import { cn } from '@/utils/cn';

type Mode = 'optimized' | 'naive';

const MODES: { value: Mode; label: string }[] = [
    { value: 'optimized', label: 'Optimized' },
    { value: 'naive', label: 'Naive (sebelum)' },
];

export function App() {
    const [mode, setMode] = useState<Mode>('optimized');
    const appRenderRef = useRenderCount<HTMLSpanElement>();

    return (
        <div className="mx-auto flex max-w-7xl flex-col gap-5 px-4 py-6 sm:px-6">
            <header className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
                <div>
                    <h1 className="text-xl font-semibold">Product Stock Dashboard</h1>
                    <p className="text-sm text-gray-500">
                        {PRODUCT_COUNT.toLocaleString('id-ID')} produk · stok real-time · Soal #1 Work Sample
                    </p>
                </div>
                <div className="flex flex-wrap items-center gap-x-4 gap-y-2">
                    <FpsMeter />
                    <span className="text-sm text-gray-500">
                        App renders <span ref={appRenderRef} className="font-mono font-semibold" />
                    </span>
                    <FeedControls />
                </div>
            </header>

            <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                <div className="inline-flex w-fit rounded-lg bg-gray-100 p-1 dark:bg-gray-900">
                    {MODES.map((option) => (
                        <button
                            key={option.value}
                            type="button"
                            onClick={() => setMode(option.value)}
                            className={cn(
                                'rounded-md px-3 py-1.5 text-sm font-medium text-gray-500',
                                mode === option.value && 'bg-white text-gray-900 shadow-sm dark:bg-gray-800 dark:text-gray-100'
                            )}
                        >
                            {option.label}
                        </button>
                    ))}
                </div>
                <p className="text-sm text-gray-500">
                    {mode === 'optimized'
                        ? 'Hanya row yang stoknya berubah yang re-render — lihat kolom Renders.'
                        : 'Setiap update me-render ulang 5.000 row. Coba scroll & ketik: terasa lag.'}
                </p>
            </div>

            {mode === 'optimized' ? <ProductDashboard /> : <NaiveProductDashboard />}
        </div>
    );
}