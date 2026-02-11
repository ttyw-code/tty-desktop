export function timeout(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
}

export function createCancelablePromise<T>(factory: (token: { isCancellationRequested: boolean, onCancellationRequested: (cb: () => void) => { dispose: () => void } }) => Promise<T>) {
    let cancelled = false;
    const listeners: (() => void)[] = [];
    const token = {
        get isCancellationRequested() { return cancelled; },
        onCancellationRequested(cb: () => void) { listeners.push(cb); return { dispose: () => { const i = listeners.indexOf(cb); if (i >= 0) listeners.splice(i, 1); } } }
    };

    const p = factory(token).finally(() => { /* noop */ });
    return Object.assign(p, {
        cancel() { if (!cancelled) { cancelled = true; listeners.slice().forEach(l => l()); } }
    });
}

export function simpleCancelablePromise<T>(promise: Promise<T>): Promise<T> & { cancel(): void } {
    let cancel: () => void;
    const wrappedPromise = new Promise<T>((resolve, reject) => {
        cancel = () => reject(new Error('Promise was cancelled'));
        promise.then(resolve, reject);
    }) as Promise<T> & { cancel(): void };

    wrappedPromise.cancel = cancel!;
    return wrappedPromise;
}

