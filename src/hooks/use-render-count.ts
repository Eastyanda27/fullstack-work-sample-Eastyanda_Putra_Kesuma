import { useEffect, useRef } from 'react';

/**
 * Menghitung berapa kali komponen di-commit dan menuliskannya langsung ke DOM
 * bukan lewat state supaya untuk ngukur sendiri tidak menambah render
 */
export const useRenderCount = <T extends HTMLElement>() => {
    const count = useRef(0);
    const elementRef = useRef<T>(null);

    useEffect(() => {
        count.current += 1;
        if (elementRef.current) elementRef.current.textContent = String(count.current);
    });

    return elementRef;
};