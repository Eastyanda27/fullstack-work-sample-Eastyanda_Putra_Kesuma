import { useEffect, useState } from 'react';
import { Pause, Play } from 'lucide-react';
import { mockStockSocket } from '@/modules/product/api/mock-stock-socket';
import { FEED_RATES, type FeedRate } from '@/modules/product/constants/product-constants';
import { cn } from '@/utils/cn';

/** State feed diisolasi di sini agar mengubah rate tidak render ulang App. */
export function FeedControls() {
    const [isLive, setIsLive] = useState(true);
    const [rate, setRate] = useState<FeedRate>(100);

    useEffect(() => {
        if (!isLive) return;
        mockStockSocket.start(rate);
        return () => mockStockSocket.stop();
    }, [isLive, rate]);

    return (
        <div className="flex flex-wrap items-center gap-2">
            <button
                type="button"
                onClick={() => setIsLive((prev) => !prev)}
                className={cn(
                    'inline-flex h-9 items-center gap-1.5 rounded-lg border px-3 text-sm font-medium',
                    isLive
                        ? 'border-emerald-200 bg-emerald-50 text-emerald-700 dark:border-emerald-900 dark:bg-emerald-950/40 dark:text-emerald-300'
                        : 'border-gray-200 bg-white text-gray-600 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-300'
                )}
            >
                {isLive ? <Pause className="size-4" /> : <Play className="size-4" />}
                {isLive ? 'Live' : 'Paused'}
            </button>
            <div className="inline-flex h-9 overflow-hidden rounded-lg border border-gray-200 text-sm dark:border-gray-700">
                {FEED_RATES.map((option) => (
                    <button
                        key={option}
                        type="button"
                        onClick={() => setRate(option)}
                        className={cn(
                            'px-3 tabular-nums',
                            option === rate
                                ? 'bg-gray-900 text-white dark:bg-gray-100 dark:text-gray-900'
                                : 'bg-white text-gray-600 hover:bg-gray-50 dark:bg-gray-900 dark:text-gray-300'
                        )}
                    >
                        {option.toLocaleString('id-ID')}/s
                    </button>
                ))}
            </div>
        </div>
    );
}