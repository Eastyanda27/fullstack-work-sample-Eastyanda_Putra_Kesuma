import { afterEach, describe, expect, it, vi } from 'vitest';
import { createFrameBatcher } from './frame-batcher';

describe('createFrameBatcher', () => {
    afterEach(() => {
        vi.unstubAllGlobals();
    });

    it('menggabungkan pesan per frame dan dedupe per key (last write wins)', () => {
        let runFrame: FrameRequestCallback = () => {};
        const requestFrame = vi.fn((callback: FrameRequestCallback) => {
            runFrame = callback;
            return 1;
        });
        vi.stubGlobal('requestAnimationFrame', requestFrame);

        const flush = vi.fn();
        const batcher = createFrameBatcher<{ id: string; stock: number }>((item) => item.id, flush);

        batcher.push({ id: 'a', stock: 1 });
        batcher.push({ id: 'b', stock: 5 });
        batcher.push({ id: 'a', stock: 3 });

        expect(requestFrame).toHaveBeenCalledTimes(1);
        expect(flush).not.toHaveBeenCalled();

        runFrame(0);

        expect(flush).toHaveBeenCalledTimes(1);
        expect(flush).toHaveBeenCalledWith([
            { id: 'a', stock: 3 },
            { id: 'b', stock: 5 },
        ]);
    });
});
