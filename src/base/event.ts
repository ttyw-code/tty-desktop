type Listener<T> = (e: T) => void;

export class Emitter<T> {
    private listeners: Set<Listener<T>> = new Set();

    event = (listener: Listener<T>): (() => void) => {
        this.listeners.add(listener);
        return () => this.listeners.delete(listener);
    };

    fire(e: T) {
        for (const l of Array.from(this.listeners)) {
            try {
                l(e);
            } catch (err) {
                // swallow
            }
        }
    }

    dispose() {
        this.listeners.clear();
    }
}

export const Event = {
    None: () => () => { /* noop */ }
};

export default Emitter;
