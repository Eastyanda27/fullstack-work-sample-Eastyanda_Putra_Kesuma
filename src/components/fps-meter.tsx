import { useEffect, useRef } from 'react';

/** FPS meter berbasis requestAnimationFrame jadi menulis ke DOM langsung (0 re-render). */
export function FpsMeter() {
    const valueRef = useRef<HTMLSpanElement>(null);

    useEffect(() => {
        let frames = 0;
        let last = performance.now();
        let rafId = 0;

        const loop = (now: number) => {
            frames += 1;
            if (now - last >= 500) {
                const fps = Math.round((frames * 1000) / (now - last));
                const element = valueRef.current;
                if (element) {
                    element.textContent = String(fps);
                    element.dataset.level = fps >= 50 ? 'good' : fps >= 30 ? 'warn' : 'bad';
                }
                frames = 0;
                last = now;
            }
            rafId = requestAnimationFrame(loop);
        };

        rafId = requestAnimationFrame(loop);
        return () => cancelAnimationFrame(rafId);
    }, []);

    return (
        <span className="text-sm text-gray-500">
            FPS{' '}
            <span
                ref={valueRef}
                data-level="good"
                className="font-mono font-semibold data-[level=bad]:text-red-600 data-[level=good]:text-emerald-600 data-[level=warn]:text-amber-600"
            >
                --
            </span>
        </span>
    );
}