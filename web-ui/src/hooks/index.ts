import { useEffect, useState } from 'react';
import { useAppStore } from '@/store';

// Theme hook that syncs with system preferences
export function useTheme() {
    const { theme, setTheme } = useAppStore();
    const [resolvedTheme, setResolvedTheme] = useState<'light' | 'dark'>('light');

    useEffect(() => {
        const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');

        const updateTheme = () => {
            if (theme === 'system') {
                setResolvedTheme(mediaQuery.matches ? 'dark' : 'light');
            } else {
                setResolvedTheme(theme);
            }
        };

        updateTheme();
        mediaQuery.addEventListener('change', updateTheme);

        return () => mediaQuery.removeEventListener('change', updateTheme);
    }, [theme]);

    useEffect(() => {
        const root = window.document.documentElement;
        root.classList.remove('light', 'dark');
        root.classList.add(resolvedTheme);
    }, [resolvedTheme]);

    return {
        theme,
        resolvedTheme,
        setTheme,
        toggleTheme: () => setTheme(resolvedTheme === 'light' ? 'dark' : 'light'),
    };
}

// Local storage hook
export function useLocalStorage<T>(
    key: string,
    initialValue: T
): [T, (value: T | ((val: T) => T)) => void] {
    const [storedValue, setStoredValue] = useState<T>(() => {
        if (typeof window === 'undefined') {
            return initialValue;
        }
        try {
            const item = window.localStorage.getItem(key);
            return item ? JSON.parse(item) : initialValue;
        } catch (error) {
            console.log(error);
            return initialValue;
        }
    });

    const setValue = (value: T | ((val: T) => T)) => {
        try {
            const valueToStore = value instanceof Function ? value(storedValue) : value;
            setStoredValue(valueToStore);
            if (typeof window !== 'undefined') {
                window.localStorage.setItem(key, JSON.stringify(valueToStore));
            }
        } catch (error) {
            console.log(error);
        }
    };

    return [storedValue, setValue];
}

// Debounced value hook
export function useDebounce<T>(value: T, delay: number): T {
    const [debouncedValue, setDebouncedValue] = useState<T>(value);

    useEffect(() => {
        const handler = setTimeout(() => {
            setDebouncedValue(value);
        }, delay);

        return () => {
            clearTimeout(handler);
        };
    }, [value, delay]);

    return debouncedValue;
}

// Online status hook
export function useOnlineStatus() {
    const [isOnline, setIsOnline] = useState(
        typeof navigator !== 'undefined' ? navigator.onLine : true
    );

    useEffect(() => {
        const handleOnline = () => setIsOnline(true);
        const handleOffline = () => setIsOnline(false);

        window.addEventListener('online', handleOnline);
        window.addEventListener('offline', handleOffline);

        return () => {
            window.removeEventListener('online', handleOnline);
            window.removeEventListener('offline', handleOffline);
        };
    }, []);

    return isOnline;
}

// Previous value hook
export function usePrevious<T>(value: T): T | undefined {
    const [current, setCurrent] = useState<T>(value);
    const [previous, setPrevious] = useState<T | undefined>(undefined);

    if (value !== current) {
        setPrevious(current);
        setCurrent(value);
    }

    return previous;
}

// Array state hook with common operations
export function useArray<T>(initialValue: T[] = []) {
    const [array, setArray] = useState<T[]>(initialValue);

    const push = (element: T) => {
        setArray(arr => [...arr, element]);
    };

    const filter = (callback: (item: T) => boolean) => {
        setArray(arr => arr.filter(callback));
    };

    const update = (index: number, newElement: T) => {
        setArray(arr => arr.map((item, i) => i === index ? newElement : item));
    };

    const remove = (index: number) => {
        setArray(arr => arr.filter((_, i) => i !== index));
    };

    const clear = () => {
        setArray([]);
    };

    return {
        array,
        set: setArray,
        push,
        filter,
        update,
        remove,
        clear,
    };
}

// Copy to clipboard hook
export function useCopyToClipboard() {
    const [isCopied, setIsCopied] = useState(false);

    const copyToClipboard = async (text: string) => {
        if (!navigator?.clipboard) {
            console.warn('Clipboard not supported');
            return false;
        }

        try {
            await navigator.clipboard.writeText(text);
            setIsCopied(true);
            setTimeout(() => setIsCopied(false), 2000);
            return true;
        } catch (error) {
            console.warn('Copy failed', error);
            setIsCopied(false);
            return false;
        }
    };

    return { isCopied, copyToClipboard };
}

// Intersection observer hook
export function useIntersectionObserver(
    elementRef: React.RefObject<Element>,
    {
        threshold = 0,
        root = null,
        rootMargin = '0%',
        freezeOnceVisible = false,
    }: {
        threshold?: number;
        root?: Element | null;
        rootMargin?: string;
        freezeOnceVisible?: boolean;
    } = {}
) {
    const [entry, setEntry] = useState<IntersectionObserverEntry>();

    const frozen = entry?.isIntersecting && freezeOnceVisible;

    const updateEntry = ([entry]: IntersectionObserverEntry[]): void => {
        setEntry(entry);
    };

    useEffect(() => {
        const node = elementRef?.current;
        const hasIOSupport = !!window.IntersectionObserver;

        if (!hasIOSupport || frozen || !node) return;

        const observerParams = { threshold, root, rootMargin };
        const observer = new IntersectionObserver(updateEntry, observerParams);

        observer.observe(node);

        return () => observer.disconnect();
    }, [elementRef, threshold, root, rootMargin, frozen]);

    return entry;
}

// Document title hook
export function useDocumentTitle(title: string) {
    useEffect(() => {
        const originalTitle = document.title;
        document.title = title;

        return () => {
            document.title = originalTitle;
        };
    }, [title]);
}

// Keyboard shortcut hook
export function useKeyPress(targetKey: string, handler: () => void) {
    useEffect(() => {
        const handleKeyPress = (event: KeyboardEvent) => {
            if (event.key === targetKey) {
                handler();
            }
        };

        window.addEventListener('keydown', handleKeyPress);
        return () => {
            window.removeEventListener('keydown', handleKeyPress);
        };
    }, [targetKey, handler]);
}
