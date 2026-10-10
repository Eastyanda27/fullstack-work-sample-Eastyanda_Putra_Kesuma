export type FrameBatcher<T> = {
    push: (item: T) => void;
    cancel: () => void;
};

/**
 * Menampung pesan yang datang yang datang terus lalu di flush sekali per
 * animation frame. Pesan dengan key yang sama di frame yang sama digabung
 * (last write wins), jadi 1.000 pesan/detik = maksimal ~60 state update/detik.
 */
export const createFrameBatcher = <T>(
    getKey: (item: T) => string,
    flush: (items: T[]) => void
): FrameBatcher<T> => {
    let pending = new Map<string, T>();
    let frame: number | null = null;

    const run = () => {
        frame = null;
        const items = Array.from(pending.values());
        pending = new Map();
        flush(items);
    };

    return {
        push: (item) => {
            pending.set(getKey(item), item);
            if (frame === null) frame = requestAnimationFrame(run);
        },
        cancel: () => {
            if (frame !== null) cancelAnimationFrame(frame);
            frame = null;
            pending.clear();
        },
    };
};